
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { ConditionalSnowfall } from '@/components/effects/ConditionalSnowfall'; // Se presente
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

// IMPORTAZIONI CORRETTE (Verifica i percorsi)
import { CartProvider } from '@/context/CartContext';
import { BookingChatProvider, BookingChat } from '@/components/BookingChat';


export const metadata: Metadata = {
  title: 'Fanuli Carni Equine',
  description: 'Tradizione ed eccellenza in ogni taglio di carne.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground antialiased font-headline">
        <CartProvider>
          <BookingChatProvider>
            <div className="relative flex min-h-dvh flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <BookingChat />
          </BookingChatProvider>
        </CartProvider>
        <GoogleAnalytics gaId="G-ET76K6TL4Y" />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="7d278eae-9893-4e89-8176-f9b2453d85ea"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
