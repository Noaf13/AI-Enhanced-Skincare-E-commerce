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
 *     "postalCode": "SW1A 1AA",
 *     "country": "UK"
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

export default defineType({
  name: "order",

  title: "Order",
  type: "document",

  fields: [
     defineField({
      name: "orderNumber",
      title: "Order Number ",
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
      defineField({
      name: "customerEmail",
      title: "Customer Email ",
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
            {
            title: "Pending",
            value: "pending",
          },
          {
            title: "Paid",
            value: "paid",
          },
          {
            title: "Processing",
            value: "processing",
          },
          {
            title: "Shipped",
            value: "shipped",
          },
          {
            title: "Cancelled",
            value: "cancelled",
          },
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

              defineField({
              name: "productId",
              title: "Product ID",
              type: "string",
            }),
            defineField({
              name: "productName",
              title: "Product Name",
              type: "string",
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
            }),
            defineField({
              name: "image",
              title: "Image URL",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
    }),
    defineField({
      name: "shippingAmount",
      title: "shippingAmount",
      type:"number",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({
          name: "line1",
          title: "Street Address",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
    }),
  ],

  preview: {
    select: {
      title: "stripeSessionId",
      orderNumber:"orderNumber",
      customer: "customerEmail",
      total: "totalAmount",
      status: "status",
      date: "orderDate",
    },
    prepare(selection: any) {
      const { title,orderNumber, customer, total, status, date } = selection;

      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return {
        title: `Order: ${title?.substring(0, 15)}...`,
        subtitle: `${customer} - £${total} (${status})(${formattedDate}) `,
      };
    },
  },
});
