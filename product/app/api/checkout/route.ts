import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    //get cart items
    const{cartItems} = await request.json()

    if(!cartItems||cartItems.length === 0){
      //if no cart items
      return NextResponse.json(
        {error:'There is no items in cart'},
        {status:400}
      )
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
        submit_type: 'pay',
        mode:'payment',
        payment_method_types:['card'],
        billing_address_collection:'auto',
        //add shipping options and ID
        shipping_options: [
            {shipping_rate:'shr_1SVXqyKrElyPn1fzeOxFPye5'},
            {shipping_rate:'shr_1SVXsaKrElyPn1fzfh6LkLRY'},

        ],

   line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),// since stripe requires amount in pence  
        },
        quantity: item.quantity,
        //data structure for stripe 
      })),

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${origin}/cart`,
    });
    return NextResponse.json({
      url:session.url,
      sessionId:session.id,
    }

    )
  } catch (err) {
  const error = err as Error & { statusCode?: number }
  return NextResponse.json(
    { error: error.message },
    { status: error.statusCode || 500 }

    //type safe error handling 
  )
  }
}