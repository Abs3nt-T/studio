
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { client } from '@/sanity/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const shopEmail = process.env.SHOP_EMAIL || 'pagamentifce@gmail.com';

const reservationSchema = z.object({
    customerName: z.string().min(2, "Il nome è obbligatorio."),
    customerPhone: z.string().min(9, "Il numero di telefono non è valido."),
    productList: z.string().min(3, "La lista della spesa non può essere vuota."),
    pickupDate: z.string().nonempty("La data di ritiro è obbligatoria."),
    pickupTime: z.string().nonempty("L'ora di ritiro è obbligatoria."),
});

const generateShopReservationEmailHtml = (data: z.infer<typeof reservationSchema>) => {
    const formattedDate = format(new Date(data.pickupDate), "EEEE dd MMMM yyyy", { locale: it });

    return `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
    <h1 style="color: #A32E2E; text-align: center;">Nuova Prenotazione per Ritiro!</h1>
    <p>Hai ricevuto una nuova prenotazione da preparare. Ecco i dettagli:</p>
    
    <div style="background-color: #f9f9f9; border-left: 4px solid #A32E2E; padding: 15px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #A32E2E;">Dettagli Cliente</h3>
      <p><strong>Nome:</strong> ${data.customerName}</p>
      <p><strong>Telefono:</strong> <a href="tel:${data.customerPhone}">${data.customerPhone}</a></p>
    </div>

    <div style="background-color: #f9f9f9; border-left: 4px solid #A32E2E; padding: 15px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #A32E2E;">Dettagli Ritiro</h3>
      <p><strong>Giorno:</strong> ${formattedDate}</p>
      <p><strong>Ora:</strong> ${data.pickupTime}</p>
    </div>

    <h3 style="color: #A32E2E; border-bottom: 2px solid #A32E2E; padding-bottom: 5px;">Lista della Spesa</h3>
    <div style="white-space: pre-wrap; background: #fdfdfd; border: 1px solid #eee; padding: 15px; border-radius: 4px;">${data.productList}</div>
</div>
`;
};

export async function POST(req: NextRequest) {
    console.log('--- AVVIO API PRENOTAZIONE ---');

    try {
        const body = await req.json();
        const validation = reservationSchema.safeParse(body);

        if (!validation.success) {
            console.log('--- ERRORE: Dati non validi ---', validation.error.flatten());
            return NextResponse.json({ success: false, message: "Dati non validi.", errors: validation.error.flatten() }, { status: 400 });
        }

        const { customerName, customerPhone, productList, pickupDate, pickupTime } = validation.data;

        // Save to Sanity
        const newReservation = {
            _type: 'reservation',
            customerName,
            customerPhone,
            productList,
            pickupDate,
            pickupTime,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        try {
            console.log('--- TENTO SALVATAGGIO PRENOTAZIONE SU SANITY ---');
            const sanityResult = await client.create(newReservation);
            console.log('--- PRENOTAZIONE SALVATA SU SANITY CON SUCCESSO: ' + sanityResult._id + ' ---');
        } catch (error) {
            console.log('--- ERRORE CATCH (SANITY):', error);
            // In questo caso, se Sanity fallisce, è meglio non procedere.
            return NextResponse.json({ success: false, message: "Errore nel salvataggio della prenotazione." }, { status: 500 });
        }

        if (!resend) {
            console.log('--- AVVISO: Chiave API Resend non configurata. Salto invio email. ---');
            return NextResponse.json({ success: true, message: "Prenotazione salvata, ma Resend non è configurato." });
        }
        
        // Invio email al negoziante
        try {
            console.log(`--- TENTO INVIO EMAIL A NEGOZIANTE: ${shopEmail} ---`);
            const shopEmailResponse = await resend.emails.send({
                from: 'Fanuli Carni <info@fanulicarniequine.it>',
                to: [shopEmail],
                subject: `Nuova Prenotazione Ritiro: ${customerName}`,
                html: generateShopReservationEmailHtml(validation.data),
            });
            if (shopEmailResponse.data) {
                console.log('--- EMAIL NEGOZIANTE INVIATA CON SUCCESSO: ' + shopEmailResponse.data.id + ' ---');
            } else {
                 console.log('--- ERRORE RESEND (NEGOZIANTE): ' + shopEmailResponse.error?.message + ' ---', shopEmailResponse.error);
            }
        } catch (error) {
            console.log('--- ERRORE CATCH (INVIO EMAIL):', error);
        }

        return NextResponse.json({ success: true, message: 'Prenotazione creata con successo.' });

    } catch (error) {
        console.log('--- ERRORE GENERALE API PRENOTAZIONE:', error);
        return NextResponse.json({ success: false, message: "Errore generale del server." }, { status: 500 });
    }
}
