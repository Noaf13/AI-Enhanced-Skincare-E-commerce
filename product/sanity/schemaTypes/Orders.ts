/**
 * Sanity.io Order Schema Definition
 *
 * Defines the Order document type for tracking customer purchases and payment information.
 * Integrates with Stripe for payment processing and Clerk for user authentication.
 * Stores complete order details including items, totals, shipping, and status.
 *
 * @module SanitySchemas/Order
 * @constant {Object} order - Sanity schema configuration
 *
 * @example
 * // Example order document structure:
 * {
 *   "clerkUserId": "user_123",
 *   "stripeSessionId": "cs_test_abc123",
 *   "status": "paid",
 *   "items": [
 *     {
 *       "productName": "Premium Moisturizer",
 *       "price": 29.99,
 *       "quantity": 2,
 *       "image": "https://example.com/image.jpg"
 *     }
 *   ],
 *   "totalAmount": 59.98,
 *   "userEmail": "customer@example.com",
 *   "shippingAddress": {
 *     "line1": "123 Main St",
 *     "city": "London",
 *     "postal_code": "SW1A 1AA",
 *     "country": "GB"
 *   },
 *   "orderDate": "2024-01-15T10:30:00Z"
 * }
 *
 * @features
 * - Complete order tracking with status management
 * - Stripe payment integration
 * - Clerk user authentication linkage
 * - Shipping address storage
 * - Order history and analytics
 * - Custom preview in Sanity Studio
 *
 * @dependencies
 * - sanity: Sanity.io CMS framework
 * - Stripe: Payment processing service
 * - Clerk: User authentication service
 *
 * @see {@link product} For product information referenced in order items
 */

import { defineType, defineField, defineArrayMember } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",

  fields: [
    // added order number so its easier to identify orders in the studio
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
    }),
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
    }),
    // renamed from userEmail - matches what the webhook actually sends
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" }, // added pending + delivered
          { title: "Paid", value: "paid" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),

    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            // renamed productName -> name and added productId to match webhook data
            defineField({ name: "productId", title: "Product ID", type: "string" }),
            defineField({ name: "name", title: "Product Name", type: "string" }),
            defineField({ name: "price", title: "Price", type: "number" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
            defineField({ name: "image", title: "Image URL", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({ name: "totalAmount", title: "Total Amount", type: "number" }),
    defineField({ name: "shippingAmount", title: "Shipping Amount", type: "number" }), // added
    defineField({ name: "currency", title: "Currency", type: "string" }),
    // renamed from orderDate to createdAt to match webhook
    defineField({ name: "createdAt", title: "Order Date", type: "datetime" }),

    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "line1", title: "Street Address", type: "string" }),
        defineField({ name: "line2", title: "Address Line 2", type: "string" }), // added
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State / County", type: "string" }), // added
        // was postalCode but webhook sends postal_code so changed to match
        defineField({ name: "postal_code", title: "Postal Code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
      ],
    }),
  ],

  preview: {
    select: {
      orderNumber: "orderNumber",
      customer: "customerEmail",
      total: "totalAmount",
      status: "status",
      date: "createdAt",
    },
    prepare(selection: any) {
      const { orderNumber, customer, total, status, date } = selection;

      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      // updated preview to show order number instead of session id
      return {
        title: orderNumber || "No order number",
        subtitle: `${customer || "No email"} - £${total || 0} (${status || "unknown"}) (${formattedDate})`,
      };
    },
  },
});