
import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'shopSettings',
  title: 'Impostazioni Negozio',
  type: 'document',
  icon: CogIcon,
  // This will ensure that there's only one instance of this document
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    defineField({
      name: 'isShopOpen',
      title: 'Negozio Online Aperto',
      type: 'boolean',
      description: 'Spunta questa casella per permettere ai clienti di effettuare acquisti. Deselezionala per chiudere temporaneamente lo shop.',
      initialValue: true,
    }),
    defineField({
        name: 'closingReason',
        title: 'Motivazione Chiusura (Disclaimer)',
        type: 'text',
        description: 'Questo messaggio verrà mostrato ai clienti quando il negozio è chiuso. Es: "Saremo chiusi per le festività natalizie. Gli ordini riprenderanno il 7 Gennaio."',
        initialValue: 'A causa dell\'intenso traffico di spedizioni durante le festività, abbiamo temporaneamente sospeso gli ordini online per garantire che ogni pacco arrivi in tempo e con la massima cura. Il servizio riprenderà regolarmente a breve. Grazie per la vostra comprensione e buone feste!',
        rows: 3,
    }),
  ],
  preview: {
    prepare() {
        return {
            title: 'Impostazioni Negozio Online'
        }
    }
  }
})
