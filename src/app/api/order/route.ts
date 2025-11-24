
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import type { CartItem } from '@/context/CartContext';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const shopEmail = 'pagamenti@fanulicarniequine.it';
const fromEmail = 'Fanuli Carni <pagamenti@fanulicarniequine.it>';

const orderSchema = z.object({
    customer: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        zip: z.string(),
        email: z.string().email(),
        phone: z.string(),
    }),
    products: z.array(z.any()),
    total: z.number(),
});

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

const generateCustomerEmailHtml = (customerName: string, products: CartItem[], total: number) => `
    <h1>Grazie per il tuo ordine, ${customerName}!</h1>
    <p>Abbiamo ricevuto il tuo ordine e lo stiamo preparando. Ecco un riepilogo:</p>
    <h3>Prodotti Ordinati</h3>
    <ul>
        ${products.map(item => `<li>${item.name} (x${item.quantity}) - ${formatPrice(item.offerPrice * item.quantity)}</li>`).join('')}
    </ul>
    <p><strong>Totale Ordine: ${formatPrice(total)}</strong></p>
    <p>Grazie per aver scelto Fanuli Carni Equine.</p>
`;

const generateShopEmailHtml = (customer: z.infer<typeof orderSchema>['customer'], products: CartItem[], total: number) => `
    <h1>Nuovo Ordine Ricevuto!</h1>
    <p>Hai ricevuto un nuovo ordine da preparare. Ecco i dettagli:</p>
    <h3>Dati Cliente</h3>
    <ul>
        <li><strong>Nome:</strong> ${customer.name}</li>
        <li><strong>Indirizzo:</strong> ${customer.address}, ${customer.zip} ${customer.city}</li>
        <li><strong>Email:</strong> ${customer.email}</li>
        <li><strong>Telefono:</strong> ${customer.phone}</li>
    </ul>
    <h3>Prodotti Ordinati</h3>
    <ul>
        ${products.map(item => `<li>${item.name} (x${item.quantity}) - ${item.weight}kg</li>`).join('')}
    </ul>
    <p><strong>Totale Pagato: ${formatPrice(total)}</strong></p>
`;


export async function POST(req: NextRequest) {
    console.log('--- AVVIO API ORDINE ---');

    if (!resend) {
        console.log('--- ERRORE: Chiave API Resend non configurata ---');
        // Restituisci sempre successo per non bloccare l'utente
        return NextResponse.json({ success: true });
    }

    try {
        const body = await req.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
            console.log('--- ERRORE: Dati non validi ---', validation.error.flatten());
            return NextResponse.json({ success: true });
        }

        const { customer, products, total } = validation.data;

        // 1. Invio email al negoziante
        try {
            console.log('--- TENTO INVIO A NEGOZIANTE ---');
            const shopEmailResponse = await resend.emails.send({
                from: fromEmail,
                to: shopEmail,
                subject: `Nuovo Ordine da ${customer.name}`,
                html: generateShopEmailHtml(customer, products as CartItem[], total),
            });
            if (shopEmailResponse.data) {
                console.log('--- EMAIL NEGOZIANTE INVIATA CON SUCCESSO: ' + shopEmailResponse.data.id + ' ---');
            } else {
                 console.log('--- ERRORE RESEND (NEGOZIANTE): ' + shopEmailResponse.error?.message + ' ---', shopEmailResponse.error);
            }
        } catch (error) {
            console.log('--- ERRORE CATCH (NEGOZIANTE):', error);
        }

        // 2. Invio email al cliente
        try {
            console.log('--- TENTO INVIO A CLIENTE ---');
            const customerEmailResponse = await resend.emails.send({
                from: fromEmail,
                to: customer.email,
                subject: 'Conferma Ordine - Fanuli Carni Equine',
                html: generateCustomerEmailHtml(customer.name, products as CartItem[], total),
            });
             if (customerEmailResponse.data) {
                console.log('--- EMAIL CLIENTE INVIATA CON SUCCESSO: ' + customerEmailResponse.data.id + ' ---');
            } else {
                 console.log('--- ERRORE RESEND (CLIENTE): ' + customerEmailResponse.error?.message + ' ---', customerEmailResponse.error);
            }
        } catch (error) {
            console.log('--- ERRORE CATCH (CLIENTE):', error);
        }

        // Risposta di successo al frontend in ogni caso
        return NextResponse.json({ success: true, message: 'Processo di invio email completato.' });

    } catch (error) {
        console.log('--- ERRORE GENERALE API:', error);
        // Risposta di successo al frontend anche in caso di errore generale
        return NextResponse.json({ success: true });
    }
}
