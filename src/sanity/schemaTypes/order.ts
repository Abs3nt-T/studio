import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
        name: 'customerEmail',
        title: 'Customer Email',
        type: 'string',
    }),
    defineField({
        name: 'total',
        title: 'Total Amount',
        type: 'number',
    }),
    defineField({
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
            list: [
                {title: 'Pending', value: 'pending'},
                {title: 'Shipped', value: 'shipped'},
            ],
            layout: 'radio'
        }
    }),
    defineField({
        name: 'trackingCode',
        title: 'Tracking Code',
        type: 'string',
    }),
    defineField({
        name: 'courier',
        title: 'Courier',
        type: 'string',
    }),
    defineField({
        name: 'courierLink',
        title: 'Courier Link',
        type: 'url',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'orderId',
      subtitle: 'customerName',
      status: 'status',
    },
    prepare(selection) {
        const {title, subtitle, status} = selection
        return {
            title: `Order #${title?.substring(0, 8)}`,
            subtitle: `${subtitle} - Status: ${status}`
        }
    }
  },
})
