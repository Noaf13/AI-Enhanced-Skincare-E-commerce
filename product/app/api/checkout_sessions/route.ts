import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'

export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

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



      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url!, 303)
  } catch (err) {
  const error = err as Error & { statusCode?: number }
  return NextResponse.json(
    { error: error.message },
    { status: error.statusCode || 500 }

    //type safe error handling 
  )
  }
}