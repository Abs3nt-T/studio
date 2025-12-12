
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
    try {
        if (!adminPassword) {
            return NextResponse.json({ error: "Servizio non configurato correttamente." }, { status: 500 });
        }

        const body = await req.json();
        const { password, isShopOpen } = body;

        if (password !== adminPassword) {
            return NextResponse.json({ error: "Password non autorizzata." }, { status: 401 });
        }

        if (typeof isShopOpen !== 'boolean') {
             return NextResponse.json({ error: "Dato 'isShopOpen' non valido." }, { status: 400 });
        }

        // Use the API token with write access for this operation
        const writeClient = client.withConfig({ token: process.env.SANITY_API_TOKEN });
        
        const newStatus = await writeClient
            .patch(SETTINGS_DOC_ID)
            .set({ isShopOpen: isShopOpen })
            // Use createIfNotExists to handle the case where the document doesn't exist yet
            .commit({ autoGenerateArrayKeys: true, createIfNotExists: true, type: 'shopSettings' });
        
        return NextResponse.json({ success: true, message: "Stato del negozio aggiornato.", newStatus });

    } catch (error) {
        console.error("Failed to update shop status:", error);
        return NextResponse.json({ error: "Errore durante l'aggiornamento dello stato del negozio." }, { status: 500 });
    }
}
