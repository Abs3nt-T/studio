
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import type { CartItem } from '@/context/CartContext';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Indirizzi forzati come da richiesta per il debug e la produzione
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
    billing: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        zip: z.string(),
    }).optional(),
    products: z.array(z.any()),
    total: z.number(),
    transactionId: z.string(),
});

type CustomerData = z.infer<typeof orderSchema>['customer'];
type BillingData = z.infer<typeof orderSchema>['billing'];

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

const generateCustomerEmailHtml = (customerName: string, products: CartItem[], total: number, orderId: string) => `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
    <h1 style="color: #A32E2E; text-align: center;">Grazie per il tuo ordine!</h1>
    <p>Ciao ${customerName},</p>
    <p>Abbiamo ricevuto il tuo ordine e lo stiamo elaborando. Ecco un riepilogo del tuo acquisto:</p>
    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Dettagli Ordine #${orderId.substring(0, 8)}</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Prodotto</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Quantità</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Prezzo</th>
            </tr>
        </thead>
        <tbody>
            ${products.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${formatPrice(item.offerPrice * item.quantity)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <div style="text-align: right;">
        <p style="margin: 5px 0;"><strong>Subtotale:</strong> ${formatPrice(products.reduce((acc, item) => acc + item.offerPrice * item.quantity, 0))}</p>
        <p style="margin: 5px 0;"><strong>Spedizione:</strong> Da calcolare</p>
        <h3 style="margin: 10px 0; color: #A32E2E;">Totale: ${formatPrice(total)}</h3>
    </div>
    <p>Grazie per aver scelto Fanuli Carni Equine.</p>
</div>
`;

const generateShopEmailHtml = (customer: CustomerData, billing: BillingData, products: CartItem[], total: number, transactionId: string) => `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
    <h1 style="color: #A32E2E; text-align: center;">Nuovo Ordine Ricevuto!</h1>
    <p>Hai ricevuto un nuovo ordine da preparare. Ecco i dettagli:</p>
    
    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Dettagli Ordine #${transactionId.substring(0, 8)}</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Prodotto</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Qtà</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Subtotale</th>
            </tr>
        </thead>
        <tbody>
            ${products.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name} (${formatPrice(item.offerPrice)}/kg)</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${formatPrice(item.offerPrice * item.quantity)}</td>
                </tr>
            `).join('')}
        </tbody>
        <tfoot>
            <tr style="font-weight: bold;">
                <td colspan="2" style="padding: 10px; text-align: right; border-top: 2px solid #333;">Totale Ordine:</td>
                <td style="padding: 10px; text-align: right; border-top: 2px solid #333;">${formatPrice(total)}</td>
            </tr>
        </tfoot>
    </table>

    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Info Cliente</h3>
    <p><strong>Nome:</strong> ${customer.name}</p>
    <p><strong>Email:</strong> ${customer.email}</p>
    <p><strong>Telefono:</strong> ${customer.phone}</p>
    <p><strong>ID Transazione PayPal:</strong> ${transactionId}</p>

    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Indirizzo di Spedizione</h3>
    <p>
        ${customer.name}<br>
        ${customer.address}<br>
        ${customer.city}, ${customer.zip}
    </p>

    ${billing ? `
    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Indirizzo di Fatturazione</h3>
    <p>
        ${billing.name}<br>
        ${billing.address}<br>
        ${billing.city}, ${billing.zip}
    </p>
    ` : '<p><i>L\'indirizzo di fatturazione è lo stesso di quello di spedizione.</i></p>'}
</div>
`;


export async function POST(req: NextRequest) {
    console.log('--- AVVIO API ORDINE ---');

    if (!resend) {
        console.log('--- ERRORE: Chiave API Resend non configurata ---');
        return NextResponse.json({ success: true, message: "Resend not configured" });
    }

    try {
        const body = await req.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
            console.log('--- ERRORE: Dati non validi ---', validation.error.flatten());
            return NextResponse.json({ success: true, message: "Invalid data" });
        }

        const { customer, billing, products, total, transactionId } = validation.data;

        // 1. Invio email al negoziante
        try {
            console.log('--- TENTO INVIO A NEGOZIANTE: ' + shopEmail + ' ---');
            const shopEmailResponse = await resend.emails.send({
                from: fromEmail,
                to: [shopEmail], // Indirizzo hardcoded
                subject: `Nuovo Ordine #${transactionId.substring(0,8)} da ${customer.name}`,
                html: generateShopEmailHtml(customer, billing, products as CartItem[], total, transactionId),
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
            console.log('--- TENTO INVIO A CLIENTE: ' + customer.email + ' ---');
            const customerEmailResponse = await resend.emails.send({
                from: fromEmail,
                to: customer.email, // Email del cliente dal form
                subject: `Conferma Ordine #${transactionId.substring(0,8)} - Fanuli Carni Equine`,
                html: generateCustomerEmailHtml(customer.name, products as CartItem[], total, transactionId),
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
        return NextResponse.json({ success: true, message: "General error" });
    }
}
