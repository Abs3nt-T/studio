
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { z } from 'zod';

const adminPassword = process.env.ADMIN_PASSWORD;
const SETTINGS_DOC_ID = 'shopSettings';

const patchSchema = z.object({
    password: z.string(),
    isShopOpen: z.boolean(),
    closingReason: z.string().optional(),
});

// GET all settings
export async function GET(req: NextRequest) {
    try {
        const settings = await client.fetch(`*[_type == "shopSettings" && _id == "${SETTINGS_DOC_ID}"][0]`);
        
        if (!settings) {
            // If settings don't exist, return default open state
            return NextResponse.json({ 
                isShopOpen: true, 
                closingReason: '',
            });
        }
        
        return NextResponse.json({
            isShopOpen: settings.isShopOpen,
            closingReason: settings.closingReason,
        });

    } catch (error) {
        console.error("Failed to fetch shop settings:", error);
        return NextResponse.json({ error: "Errore nel recupero dello stato del negozio." }, { status: 500 });
    }
}


// PATCH to update settings
export async function PATCH(req: NextRequest) {
    console.log('--- AVVIO API SHOP STATUS (PATCH) ---');
    try {
        if (!adminPassword) {
            console.error('--- ERRORE: Password admin non configurata ---');
            return NextResponse.json({ error: "Servizio non configurato correttamente." }, { status: 500 });
        }

        const body = await req.json();
        const validation = patchSchema.safeParse(body);

        if (!validation.success) {
            console.error('--- ERRORE: Dati richiesta non validi ---', validation.error.flatten());
            return NextResponse.json({ error: "Dati richiesta non validi.", details: validation.error.flatten() }, { status: 400 });
        }
        
        const { password, isShopOpen, closingReason } = validation.data;

        if (password !== adminPassword) {
            console.error('--- ERRORE: Password non autorizzata ---');
            return NextResponse.json({ error: "Password non autorizzata." }, { status: 401 });
        }

        const writeClient = client.withConfig({ token: process.env.SANITY_API_TOKEN });
        
        // This is a more robust way to handle the patch, ensuring closingReason is handled correctly.
        const result = await writeClient.patch(SETTINGS_DOC_ID)
            .set({ 
              isShopOpen: isShopOpen,
              // Explicitly set closingReason to empty string if it's not provided or empty.
              closingReason: closingReason || '' 
            })
            .commit({
                // Creates the document if it doesn't exist.
                createIfNotExists: {
                  _id: SETTINGS_DOC_ID,
                  _type: 'shopSettings',
                  isShopOpen: isShopOpen,
                  // Provide a default reason if creating for the first time
                  closingReason: closingReason || 'Negozio temporaneamente chiuso.', 
                },
            });

        console.log('--- STATO NEGOZIO AGGIORNATO CON SUCCESSO ---', result);
        
        return NextResponse.json({ success: true, message: "Stato del negozio aggiornato.", newStatus: result });

    } catch (error) {
        console.error("--- ERRORE GENERALE API SHOP STATUS (PATCH):", error);
        const errorMessage = error instanceof Error ? error.message : "Errore sconosciuto.";
        return NextResponse.json({ error: "Errore durante l'aggiornamento dello stato del negozio.", details: errorMessage }, { status: 500 });
    }
}
