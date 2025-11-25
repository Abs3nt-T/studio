
import {defineField, defineType} from 'sanity'
import {ClipboardListIcon} from '@sanity/icons'

export default defineType({
  name: 'reservation',
  title: 'Prenotazione Ritiro',
  type: 'document',
  icon: ClipboardListIcon,
  fields: [
    defineField({
      name: 'customerName',
      title: 'Nome Cliente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'Telefono Cliente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productList',
      title: 'Lista Spesa',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pickupDate',
      title: 'Data Ritiro',
      type: 'date',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pickupTime',
      title: 'Ora Ritiro',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Stato',
      type: 'string',
      options: {
        list: [
          {title: 'In Attesa', value: 'pending'},
          {title: 'Completata', value: 'completed'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Creata il',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      date: 'pickupDate',
      time: 'pickupTime',
      status: 'status',
    },
    prepare(selection) {
      const {title, date, time, status} = selection
      const formattedDate = date ? new Date(date).toLocaleDateString('it-IT') : ''
      return {
        title: `${title}`,
        subtitle: `Ritiro: ${formattedDate} ore ${time} - Stato: ${status}`,
      }
    },
  },
  orderings: [
    {
      title: 'Data Ritiro, Recenti prima',
      name: 'pickupDateDesc',
      by: [{field: 'pickupDate', direction: 'desc'}],
    },
  ],
})
