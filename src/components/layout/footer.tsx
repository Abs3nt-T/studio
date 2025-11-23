import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto space-y-2 py-8 text-center">
        <p className="font-headline text-lg font-bold">Fanuli Carni Equine</p>
        <p className="text-sm text-primary-foreground/80">Via Santa Lucia 69, 72020 Erchie (BR)</p>
        <p className="pt-4 text-xs text-primary-foreground/60">
          &copy; {currentYear} Fanuli Carni Equine. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
