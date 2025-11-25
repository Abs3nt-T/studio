
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { client } from '@/sanity/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const shopEmail = process.env.SHOP_EMAIL || 'pagamentifce@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD;

// Schema for creating a new reservation
const reservationSchema = z.object({
    customerName: z.string().min(2, "Il nome è obbligatorio."),
    customerPhone: z.string().min(9, "Il numero di telefono non è valido."),
    productList: z.string().min(3, "La lista della spesa non può essere vuota."),
    pickupDate: z.string().nonempty("La data di ritiro è obbligatoria."),
    pickupTime: z.string().nonempty("L'ora di ritiro è obbligatoria."),
});

// Schema for admin authentication checks
const authCheckSchema = z.object({
  password: z.string(),
  checkAuthOnly: z.literal(true).optional(),
});

// Schema for updating reservation status
const updateReservationSchema = z.object({
    password: z.string(),
    reservationId: z.string(),
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

// Handle POST requests for creating and authenticating
export async function POST(req: NextRequest) {
    console.log('--- AVVIO API PRENOTAZIONE (POST) ---');
    try {
        const body = await req.json();

        // Handle simple auth check for the frontend admin page
        if (body.checkAuthOnly) {
             if (!adminPassword) {
                return NextResponse.json({ error: "Servizio non configurato correttamente." }, { status: 500 });
             }
             const authValidation = authCheckSchema.safeParse(body);
             if (!authValidation.success || authValidation.data.password !== adminPassword) {
                return NextResponse.json({ error: "Password non autorizzata." }, { status: 401 });
             }
             // On successful auth, fetch pending reservations
             const pendingReservations = await client.fetch('*[_type == "reservation" && status == "pending"] | order(pickupDate asc, pickupTime asc)');
             return NextResponse.json({ success: true, message: "Autenticazione valida.", reservations: pendingReservations });
        }


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
            const sanityResult = await client.create(newReservation, { token: process.env.SANITY_API_TOKEN });
            console.log('--- PRENOTAZIONE SALVATA SU SANITY CON SUCCESSO: ' + sanityResult._id + ' ---');
        } catch (error) {
            console.log('--- ERRORE CATCH (SANITY):', error);
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
        console.log('--- ERRORE GENERALE API PRENOTAZIONE (POST):', error);
        return NextResponse.json({ success: false, message: "Errore generale del server." }, { status: 500 });
    }
}

// Handle PATCH requests for updating status
export async function PATCH(req: NextRequest) {
    console.log('--- AVVIO API PRENOTAZIONE (PATCH) ---');
    try {
        const body = await req.json();

        if (!adminPassword) {
            return NextResponse.json({ error: "Servizio non configurato correttamente." }, { status: 500 });
        }

        const validation = updateReservationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Dati richiesta non validi." }, { status: 400 });
        }
        
        const { password, reservationId } = validation.data;

        if (password !== adminPassword) {
            return NextResponse.json({ error: "Password non autorizzata." }, { status: 401 });
        }

        // Update Sanity document using the secure token
        await client
            .patch(reservationId)
            .set({ status: 'completed' })
            .commit({ token: process.env.SANITY_API_TOKEN });

        console.log(`--- PRENOTAZIONE AGGIORNATA A COMPLETATA: ${reservationId} ---`);
        return NextResponse.json({ success: true, message: "Prenotazione aggiornata con successo." });

    } catch (error) {
        console.error("--- ERRORE GENERALE API PRENOTAZIONE (PATCH):", error);
        return NextResponse.json({ error: "Errore durante l'aggiornamento della prenotazione." }, { status: 500 });
    }
}
