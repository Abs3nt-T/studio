import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
// Il token con permessi di scrittura completo deve essere usato solo lato server (API routes)
const apiToken = process.env.SANITY_API_TOKEN; 

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Impostato a false per avere dati sempre freschi, soprattutto nel pannello admin
  token: apiToken, // Questo token sarà usato solo nelle API routes, non esposto al client
});
