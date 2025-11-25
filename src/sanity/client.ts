import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
// Utilizza una variabile d'ambiente pubblica per le operazioni client-side (lettura e patch limitate)
// Il token con permessi di scrittura completo (SANITY_API_TOKEN) deve essere usato solo lato server (API routes)
const apiToken = process.env.NEXT_PUBLIC_SANITY_API_TOKEN; 

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Impostato a false per avere dati sempre freschi, soprattutto nel pannello admin
  token: apiToken, 
});
