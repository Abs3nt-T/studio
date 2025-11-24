import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import type { CartItem } from '@/context/CartContext';

const resend = new Resend(process.env.RESEND_API_KEY);
const shopEmail = process.env.SHOP_EMAIL || 'info@fanulicarniequine.it';

const orderSchema = z.object({
    customer: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        zip: z.string(),
        email: z.string().email(),
        phone: z.string(),
    }),
    products: z.array(z.any()), // Simplified for now, can be more specific
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
    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Dati non validi', details: validation.error.flatten() }, { status: 400 });
        }

        const { customer, products, total } = validation.data;

        // Email to shop owner
        await resend.emails.send({
            from: 'Fanuli Carni Equine <noreply@resend.dev>',
            to: shopEmail,
            subject: `Nuovo Ordine da ${customer.name}`,
            html: generateShopEmailHtml(customer, products as CartItem[], total),
        });

        // Email to customer
        await resend.emails.send({
            from: 'Fanuli Carni Equine <noreply@resend.dev>',
            to: customer.email,
            subject: 'Conferma Ordine - Fanuli Carni Equine',
            html: generateCustomerEmailHtml(customer.name, products as CartItem[], total),
        });

        return NextResponse.json({ message: 'Email inviate con successo' });

    } catch (error) {
        console.error('Errore invio email:', error);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
