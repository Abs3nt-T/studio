import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { client } from '@/sanity/client';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const adminPassword = process.env.ADMIN_PASSWORD;

const shipmentSchema = z.object({
  password: z.string(),
  orderDocumentId: z.string(), // Sanity document ID (_id)
  email: z.string().email(),
  name: z.string(),
  trackingCode: z.string(),
  courier: z.string(),
  courierLink: z.string().url().optional().or(z.literal('')),
});

const authCheckSchema = z.object({
  password: z.string(),
  checkAuthOnly: z.literal(true).optional(),
});


const generateShippedEmailHtml = (customerName: string, trackingCode: string, courier: string, courierLink?: string | null) => {
    return `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
    <h1 style="color: #A32E2E; text-align: center;">Il tuo pacco è in viaggio!</h1>
    <p>Ciao ${customerName},</p>
    <p>Siamo felici di comunicarti che il tuo ordine da <strong>Fanuli Carni Equine</strong> è stato affidato al corriere e sta per raggiungerti.</p>
    
    <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px 20px; margin: 25px 0; text-align: center; border-radius: 8px;">
        <p style="margin: 0 0 10px 0; font-size: 16px;">Il tuo pacco è stato affidato a <strong>${courier}</strong>.</p>
        <p style="margin: 0; font-size: 16px;">Codice di Tracciamento:</p>
        <p style="font-size: 20px; font-weight: bold; color: #A32E2E; margin: 5px 0; letter-spacing: 1px;">${trackingCode}</p>
    </div>

    ${courierLink ? `
    <div style="text-align: center; margin: 30px 0;">
        <a href="${courierLink}" target="_blank" style="background-color: #A32E2E; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Traccia la spedizione
        </a>
    </div>
    ` : ''}

    <p>Grazie ancora per la tua fiducia!</p>
    <p>Il team di Fanuli Carni Equine</p>
</div>
`;
}


export async function POST(req: NextRequest) {
    if (!resend || !adminPassword) {
        return NextResponse.json({ error: "Servizio non configurato correttamente." }, { status: 500 });
    }

    try {
        const body = await req.json();

        // Handle simple auth check for the frontend
        if (body.checkAuthOnly) {
             const authValidation = authCheckSchema.safeParse(body);
             if (!authValidation.success || authValidation.data.password !== adminPassword) {
                return NextResponse.json({ error: "Password non autorizzata." }, { status: 401 });
             }
             // On successful auth, fetch pending orders
             const pendingOrders = await client.fetch('*[_type == "order" && status == "pending"] | order(createdAt desc)');
             return NextResponse.json({ success: true, message: "Autenticazione valida.", orders: pendingOrders });
        }


        const validation = shipmentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Dati non validi.", details: validation.error.flatten() }, { status: 400 });
        }
        
        const { password, orderDocumentId, email, name, trackingCode, courier, courierLink } = validation.data;

        if (password !== adminPassword) {
            return NextResponse.json({ error: "Password non autorizzata." }, { status: 401 });
        }

        // 1. Update Sanity document
        try {
            await client
                .patch(orderDocumentId)
                .set({
                    status: 'shipped',
                    trackingCode: trackingCode,
                    courier: courier,
                    ...(courierLink && { courierLink: courierLink })
                })
                .commit();
        } catch (sanityError) {
            console.error("Sanity Update Error:", sanityError);
            return NextResponse.json({ error: "Impossibile aggiornare l'ordine su Sanity.", details: sanityError }, { status: 500 });
        }


        // 2. Send email
        const emailHtml = generateShippedEmailHtml(name, trackingCode, courier, courierLink);

        const { data, error } = await resend.emails.send({
            from: 'Fanuli Carni Equine <info@fanulicarniequine.it>',
            to: [email],
            subject: 'Il tuo ordine Fanuli Carni Equine è in viaggio!',
            html: emailHtml,
        });

        if (error) {
            console.error("Resend Error:", error);
            // Optional: try to revert Sanity status if email fails? For now, we just log.
            return NextResponse.json({ error: "Impossibile inviare l'email.", details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: `Email di spedizione inviata a ${name} e ordine aggiornato.`, emailId: data?.id });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Errore generale del server." }, { status: 500 });
    }
}
