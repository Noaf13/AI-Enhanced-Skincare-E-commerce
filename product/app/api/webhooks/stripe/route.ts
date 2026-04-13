/**
 * Stripe Webhook Handler
 *
 * Listens for Stripe events and creates order documents in Sanity
 * when a checkout session completes. Verifies the webhook signature
 * before processing anything to make sure requests are genuinely from Stripe.
 *
 * @module webhooks/stripe
 *
 * @example
 * // Stripe sends a POST to /api/webhooks/stripe after payment
 * // The handler verifies the signature then writes the order to Sanity
 *
 * @dependencies
 * - stripe: signature verification + type definitions
 * - sanity client: writing the order document
 * - STRIPE_WEBHOOK_SECRET: env variable set from the Stripe CLI or dashboard
 */
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { client } from "../../../../sanity/lib/client";

// needs nodejs runtime - edge runtime strips the raw body which breaks signature verification
export const runtime = 'nodejs';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/webhooks/stripe
 *
 * main webhook handler - verifies the stripe signature then processes the event.
 * currently only handles checkout.session.completed, other events just return 200
 *
 * @async
 * @function POST
 * @param {Request} request - raw request from Stripe
 * @returns {Promise<NextResponse>} 200 if handled, 400 if signature fails, 500 if sanity write fails
 *
 * @throws {Error} if signature verification fails or sanity create throws
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    // no signature means the request didnt come from stripe
    if (!signature) {
      console.error("No stripe signature found on request");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    // verify the signature using the webhook secret
    // if this throws it means the payload was tampered with or wrong secret
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log("Webhook event received:", event.type);

    // only care about this event type for now
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // pull the data we stored in metadata during checkout
      const clerkUserId = session.metadata?.clerkUserId;
      const cartItems = session.metadata?.cartItems
        ? JSON.parse(session.metadata.cartItems)
        : [];

      if (!clerkUserId) {
        console.error("No clerkUserId found in session metadata");
        return NextResponse.json(
          { error: "Missing user ID" },
          { status: 400 }
        );
      }

      // generate a readable order number using timestamp + random string
      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      // build the order object to write to sanity
      const orderData: any = {
        _type: "order",
        orderNumber,
        clerkUserId,
        customerEmail: session.customer_details?.email || "",
        customerName: session.customer_details?.name || "",
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        items: cartItems.map((item: any) => ({
          _type: "object",
          productId: item._id,
          name: item.name,
          price: item.price,       // amounts come from stripe in pence so divide by 100

          quantity: item.quantity,
          image: item.image || "",
        })),
        totalAmount: (session.amount_total || 0) / 100,
        shippingAmount: (session.total_details?.amount_shipping || 0) / 100,
        currency: session.currency || "gbp",
        status: "paid",
        createdAt: new Date().toISOString(),
      };

      // add shipping address if stripe collected one
      // cast to any because the type definitions dont always include shipping_details
      const shippingDetails = (session as any).shipping_details;
      if (shippingDetails?.address) {
        orderData.shippingAddress = {
          _type: "object",
          line1: shippingDetails.address.line1 || "",
          line2: shippingDetails.address.line2 || "",
          city: shippingDetails.address.city || "",
          state: shippingDetails.address.state || "",
          postal_code: shippingDetails.address.postal_code || "",
          country: shippingDetails.address.country || "",
        };
      }

      try {
        // write the order to sanity
        const createdOrder = await client.create(orderData);

        console.log("Order created in sanity:", createdOrder._id);

        return NextResponse.json({
          received: true,
          orderId: createdOrder._id,
          orderNumber: orderNumber,
        });
      } catch (sanityError: any) {
        console.error("Sanity create failed:", sanityError);
        return NextResponse.json(
          { error: `Failed to create order: ${sanityError.message}` },
          { status: 500 }
        );
      }
    }
    // any other stripe event types just return 200 so stripe doesnt retry
    return NextResponse.json({ received: true });
  } catch (error: any) {console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    );
  }
}