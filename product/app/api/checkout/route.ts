/**
 * Stripe Checkout Session Creation Endpoint
 *
 * Handles the creation of Stripe Checkout sessions for processing cart payments.
 * This endpoint validates cart items, configures shipping options, and returns
 * a session URL for redirecting users to Stripe's hosted checkout page.
 *
 * @export
 * @async
 * @function POST
 * @param {Request} request - Incoming HTTP request containing cart items in JSON body
 * @returns {Promise<NextResponse>} JSON response with checkout session URL and ID
 * @throws {Error} When Stripe API fails, cart is empty, or invalid data is provided
 *
 * @example
 * // Request
 * POST /api/checkout
 * Body: {
 *   "cartItems": [
 *     {
 *       "name": "Premium Widget",
 *       "price": 29.99,
 *       "quantity": 2,
 *       "image": "https://example.com/widget.jpg"
 *     }
 *   ]
 * }
 *
 * // Response (Success)
 * {
 *   "url": "https://checkout.stripe.com/pay/cs_test_abc123",
 *   "sessionId": "cs_test_abc123"
 * }
 *
 * // Response (Error)
 * {
 *   "error": "There are no items in cart"
 * }
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    //Get cart items from request body
    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      //Validate whether cart has items or not
      return NextResponse.json(
        { error: "There is no items in cart" },
        { status: 400 }
      );
    }

    // Create Checkout Sessions with payment configuration
    const session = await stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      //added shipping options
      shipping_options: [
        { shipping_rate: "shr_1SVXqyKrElyPn1fzeOxFPye5" },
        { shipping_rate: "shr_1SVXsaKrElyPn1fzfh6LkLRY" },
      ],

      //Transfer cart items into Stripe line items format

      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name, //product name from cat
            images: item.image ? [item.image] : [], //product image
          },
          unit_amount: Math.round(item.price * 100), // since stripe requires amount in pence
        },
        quantity: item.quantity, //quantity from cart items
        //data structure for stripe
      })),

      //Redirect to success page if payment is successful
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }

      //type safe error handling
    );
  }
}
