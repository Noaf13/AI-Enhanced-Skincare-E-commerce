import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { client } from "../../../../sanity/lib/client";

export const runtime = 'nodejs';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("❌ No signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log("✅ Webhook event received:", event.type);

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("📦 Processing order for session:", session.id);

      // Extract data from session
      const clerkUserId = session.metadata?.clerkUserId;
      const cartItems = session.metadata?.cartItems
        ? JSON.parse(session.metadata.cartItems)
        : [];

      if (!clerkUserId) {
        console.error("❌ No Clerk user ID in session metadata");
        return NextResponse.json(
          { error: "Missing user ID" },
          { status: 400 }
        );
      }

      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      console.log("🔢 Generated order number:", orderNumber);

      // Prepare order data for Sanity
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
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
        })),
        totalAmount: (session.amount_total || 0) / 100,
        shippingAmount: (session.total_details?.amount_shipping || 0) / 100,
        currency: session.currency || "gbp",
        status: "paid",
        createdAt: new Date().toISOString(),
      };

      // Add shipping address if available (using type-safe access)
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

      console.log("💾 Creating order in Sanity...");

      try {
        // Create order in Sanity
        const createdOrder = await client.create(orderData);

        console.log("✅ Order created successfully:", createdOrder._id);

        return NextResponse.json({
          received: true,
          orderId: createdOrder._id,
          orderNumber: orderNumber,
        });
      } catch (sanityError: any) {
        console.error("❌ Sanity creation error:", sanityError);
        return NextResponse.json(
          { error: `Failed to create order: ${sanityError.message}` },
          { status: 500 }
        );
      }
    }

    // Return success for other event types
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    );
  }
}