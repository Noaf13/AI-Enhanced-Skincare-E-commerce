import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'order',

  title: 'Order',
  type: 'document',
  
  fields: [
    defineField({
        name: 'clerkUserId',
        title: 'Clerk User ID',
        type: 'string',

    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string', 
    }),
    defineField({
      name: 'stripePaymentIntentId', 
      title: 'Stripe Payment Intent ID',
      type: 'string',   
    }),
    defineField({

      name: 'status',
      title: 'Order Status',
      type: 'string',   
      options: {
        list: [

          {
            title: 'Paid',
            value: 'paid' 
          },
          {
            title: 'Processing',
            value: 'processing'
          },
          {
            title: 'Shipped',
            value: 'shipped'
          },
          {
            title: 'Cancelled',
            value: 'cancelled'
          },

        ]
      },
      initialValue: 'paid'
    }),

    defineField({
      name: 'items',
      title: 'Order Items', 
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',

          fields: [

            defineField({
              name: 'productName',
              title: 'Product Name',
              type: 'string',
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({

      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    }),
    defineField({
      name: 'userEmail', 
      type: 'string',
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({
          name: 'line1', 
          title: 'Street Address',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
    }),
  ],
  
  preview: {
    select: {
      title: 'stripeSessionId',
      customer: 'customerEmail',
      total: 'totalAmount',
      status: 'status',
      date: 'orderDate',
    },
    prepare(selection: any) {
      const { title, customer, total, status, date } = selection

      const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
      return {
        title: `Order: ${title?.substring(0, 15)}...`,
        subtitle: `${customer} - £${total} (${status})(${formattedDate}) `,
      }
    },
  },
})