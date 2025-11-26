'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto space-y-6 py-8 text-center">
        <div>
          <p className="font-headline text-lg font-bold">Fanuli Carni Equine</p>
          <p className="text-sm text-primary-foreground/80">Via Santa Lucia 69, 72020 Erchie (BR)</p>
        </div>
        
        <div className="flex justify-center gap-4 text-sm">
            <Link href="/privacy-policy" className="underline hover:text-primary-foreground">
                Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="underline hover:text-primary-foreground">
                Cookie Policy
            </Link>
             <button
              onClick={() => (window as any).Cookiebot?.renew()}
              className="underline hover:text-primary-foreground bg-transparent border-none p-0 cursor-pointer text-inherit font-medium"
            >
              Impostazioni Cookie
            </button>
            <Link href="/termini" className="underline hover:text-primary-foreground">
                Termini di Servizio
            </Link>
        </div>

        <div className="pt-4 text-xs text-primary-foreground/60">
            <p>
              &copy; {currentYear} Fanuli Carni Equine. Tutti i diritti riservati.
            </p>
             <p className="mt-2">
                Servizi e Distribuzioni Alimentari Srl - P.IVA: 01766310740
            </p>
        </div>
      </div>
    </footer>
  );
}
