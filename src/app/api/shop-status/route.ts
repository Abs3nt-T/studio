
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';

const adminPassword = process.env.ADMIN_PASSWORD;

// This is the singleton document ID for the shop settings
const SETTINGS_DOC_ID = 'shopSettings';

// GET all settings
export async function GET(req: NextRequest) {
    try {
        const settings = await client.fetch(`*[_type == "shopSettings" && _id == "${SETTINGS_DOC_ID}"][0]`);
        
        if (!settings) {
            // If settings don't exist, return default open state but indicate non-existence
            return NextResponse.json({ 
                isShopOpen: true, 
                closingReason: '',
                _warning: 'Shop settings document not found in Sanity. Using default values.' 
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
        const { password, isShopOpen, closingReason } = body;

        if (password !== adminPassword) {
            console.error('--- ERRORE: Password non autorizzata ---');
            return NextResponse.json({ error: "Password non autorizzata." }, { status: 401 });
        }

        if (typeof isShopOpen !== 'boolean') {
             console.error('--- ERRORE: Dato isShopOpen non valido ---');
             return NextResponse.json({ error: "Dato 'isShopOpen' non valido." }, { status: 400 });
        }

        // Use the API token with write access for this operation
        const writeClient = client.withConfig({ token: process.env.SANITY_API_TOKEN });
        
        const patch = writeClient.patch(SETTINGS_DOC_ID).set({ isShopOpen });

        if (typeof closingReason === 'string') {
            patch.set({ closingReason });
        }

        const result = await patch.commit({
            // Creates the document if it doesn't exist.
            createIfNotExists: true,
            // You must specify the document type for creation.
            type: 'shopSettings'
        });

        console.log('--- STATO NEGOZIO AGGIORNATO CON SUCCESSO ---', result);
        
        return NextResponse.json({ success: true, message: "Stato del negozio aggiornato.", newStatus: result });

    } catch (error) {
        console.error("--- ERRORE GENERALE API SHOP STATUS (PATCH):", error);
        return NextResponse.json({ error: "Errore durante l'aggiornamento dello stato del negozio.", details: (error as Error).message }, { status: 500 });
    }
}
