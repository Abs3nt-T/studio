
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import type { CartItem } from '@/context/CartContext';
import { client } from '@/sanity/client';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const shippingSchema = z.object({
    name: z.string(),
    address: z.string(),
    notes: z.string().optional(),
    city: z.string(),
    province: z.string(),
    zip: z.string(),
    email: z.string().email(),
    phone: z.string(),
});

const orderSchema = z.object({
    customer: shippingSchema,
    billing: shippingSchema.optional(),
    products: z.array(z.any()),
    total: z.number(),
    transactionId: z.string(),
});

type CustomerData = z.infer<typeof shippingSchema>;
type BillingData = z.infer<typeof shippingSchema> | undefined;


const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

const getShippingCost = (weight: number): number => {
    if (weight === 0) return 0;
    if (weight > 0 && weight <= 10) return 15;
    if (weight > 10 && weight <= 20) return 13;
    return 0; // Free shipping for 21kg or more
};


const generateCustomerEmailHtml = (customerName: string, products: CartItem[], total: number, orderId: string) => {
    const totalWeight = products.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
    const shippingCost = getShippingCost(totalWeight);
    const subtotal = total - shippingCost;

    return `
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
        <p style="margin: 5px 0;"><strong>Subtotale:</strong> ${formatPrice(subtotal)}</p>
        <p style="margin: 5px 0;"><strong>Spedizione:</strong> ${shippingCost > 0 ? formatPrice(shippingCost) : 'Gratuita'}</p>
        <h3 style="margin: 10px 0; color: #A32E2E;">Totale: ${formatPrice(total)}</h3>
    </div>
    <p>Grazie per aver scelto Fanuli Carni Equine.</p>
</div>
`;
}

const generateShopEmailHtml = (customer: CustomerData, billing: BillingData | undefined, products: CartItem[], total: number, transactionId: string) => {
    const totalWeight = products.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
    const shippingCost = getShippingCost(totalWeight);
    const subtotal = total - shippingCost;
    
    return `
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
                <td colspan="2" style="padding: 10px; text-align: right;">Subtotale Prodotti:</td>
                <td style="padding: 10px; text-align: right;">${formatPrice(subtotal)}</td>
            </tr>
            <tr style="font-weight: bold;">
                <td colspan="2" style="padding: 10px; text-align: right;">Spedizione:</td>
                <td style="padding: 10px; text-align: right;">${shippingCost > 0 ? formatPrice(shippingCost) : 'Gratuita'}</td>
            </tr>
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
        ${customer.city}, ${customer.province}, ${customer.zip}
    </p>
    
    ${customer.notes ? `
    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Note Cliente</h3>
    <p><i>${customer.notes}</i></p>
    ` : ''}

    ${billing ? `
    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Indirizzo di Fatturazione</h3>
    <p>
        ${billing.name}<br>
        ${billing.address}<br>
        ${billing.city}, ${billing.province}, ${billing.zip}
    </p>
    ` : '<p><i>L\'indirizzo di fatturazione è lo stesso di quello di spedizione.</i></p>'}
</div>
`;
}


export async function POST(req: NextRequest) {
    console.log('--- AVVIO API ORDINE ---');

    try {
        const body = await req.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
            console.log('--- ERRORE: Dati non validi ---', validation.error.flatten());
            return NextResponse.json({ success: false, message: "Invalid data received" }, { status: 400 });
        }

        const { customer, products, total, transactionId } = validation.data;

        // Save to Sanity
        try {
            console.log('--- TENTO SALVATAGGIO SU SANITY ---');
            const newOrder = {
                _type: 'order',
                orderId: transactionId,
                customerName: customer.name,
                customerEmail: customer.email,
                total: total,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };
            const sanityResult = await client.create(newOrder);
            console.log('--- ORDINE SALVATO SU SANITY CON SUCCESSO: ' + sanityResult._id + ' ---');
        } catch (error) {
            console.log('--- ERRORE CATCH (SANITY):', error);
            // Non blocchiamo il flusso se Sanity fallisce, le email sono più importanti
        }
        

        if (!resend) {
            console.log('--- ERRORE: Chiave API Resend non configurata ---');
            return NextResponse.json({ success: true, message: "Order saved to Sanity, but Resend not configured." });
        }
        
        const { billing } = validation.data;

        // 1. Invio email al negoziante
        try {
            console.log('--- TENTO INVIO A NEGOZIANTE: pagamentifce@gmail.com ---');
            const shopEmailResponse = await resend.emails.send({
                from: 'Fanuli Carni <info@fanulicarniequine.it>',
                to: ['pagamentifce@gmail.com'],
                subject: `Nuovo Ordine #${transactionId.substring(0,8)} da ${customer.name}`,
                replyTo: customer.email,
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
                from: 'Fanuli Carni Equine <info@fanulicarniequine.it>',
                to: [customer.email],
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

        return NextResponse.json({ success: true, message: 'Processo di invio email completato.' });

    } catch (error) {
        console.log('--- ERRORE GENERALE API:', error);
        return NextResponse.json({ success: false, message: "General server error." }, { status: 500 });
    }
}
