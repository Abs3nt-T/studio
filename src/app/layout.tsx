
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { ConditionalSnowfall } from '@/components/effects/ConditionalSnowfall'; // Se presente

// IMPORTAZIONI CORRETTE (Verifica i percorsi)
import { CartProvider } from '@/context/CartContext';
import { BookingChatProvider } from '@/components/BookingChat';
import { BookingChat } from '@/components/BookingChat';

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
      <body className="font-body bg-background text-foreground antialiased">
        
        <CartProvider>
          <BookingChatProvider>
            
            <div className="relative flex min-h-dvh flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>

            <Toaster />
            
            {/* Componente Chat visibile che ora ha accesso al suo provider */}
            <BookingChat />

          </BookingChatProvider>
        </CartProvider>
        
      </body>
    </html>
  );
}
