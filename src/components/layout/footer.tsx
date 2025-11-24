
import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto space-y-4 py-8 text-center">
        <p className="font-headline text-lg font-bold">Fanuli Carni Equine</p>
        <p className="text-sm text-primary-foreground/80">Via Santa Lucia 69, 72020 Erchie (BR)</p>
        <div className="pt-4 text-xs text-primary-foreground/60">
            <p>
              &copy; {currentYear} Fanuli Carni Equine. Tutti i diritti riservati.
            </p>
             <Link href="/termini" className="mt-2 inline-block underline hover:text-primary-foreground">
                Termini di Servizio
            </Link>
        </div>
      </div>
    </footer>
  );
}
