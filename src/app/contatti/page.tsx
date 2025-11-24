'use client';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import placeholderData from "@/lib/placeholder-images.json";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.75 13.96c.25.13.41.2.52.34.11.14.11.33.01.55-.11.22-.71.83-1.03.99-.31.16-1.42.13-2.4-.33-.98-.46-2.03-1.12-3.13-2.22-1.1-1.1-1.76-2.15-2.22-3.13-.46-1.01-.49-2.09-.33-2.4.16-.32.77-.93.99-1.03.22-.11.41-.11.55.01.14.11.2.27.34.52l.49.87c.25.44.19.98-.09 1.3l-.63.76c-.27.33-.13.75.14 1.01.76.76 1.63 1.42 2.65 1.95.27.13.69.01.99-.25l.63-.76c.33-.27.87-.33 1.3-.09l.87.49zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
    </svg>
);


export default function ContattiPage() {
     const contattiHeroImages = placeholderData.galleries.contattiHero.map(id => 
        placeholderData.placeholderImages.find(p => p.id === id)
    ).filter(Boolean);

    return (
        <div className="w-full bg-background">
             <section className="relative w-full h-[50vh] md:h-[60vh] bg-secondary text-white">
                 <Carousel
                    className="w-full h-full"
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                    opts={{
                        loop: true,
                    }}
                >
                    <CarouselContent className="h-full">
                         {contattiHeroImages.map((image) => (
                            <CarouselItem key={image!.id} className="h-full">
                                <img 
                                    src={image!.imageUrl}
                                    alt={image!.description}
                                    className="w-full h-full object-cover"
                                    data-ai-hint={image!.imageHint}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                     <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:px-6 text-center">
                        <div className="space-y-6">
                            <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                                Vieni a trovarci in Bottega
                            </h1>
                            <Card className="mx-auto max-w-md border-primary/20 bg-card/80 pt-6 text-foreground shadow-lg backdrop-blur-sm">
                                <CardContent className="flex flex-col items-center justify-center gap-4">
                                    <MapPin className="h-10 w-10 text-primary" />
                                    <p className="text-xl font-medium">
                                        Siamo a Erchie (BR)
                                    </p>
                                    <p className="text-2xl font-bold text-primary">
                                        Via Santa Lucia, 69
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="relative bg-secondary/30 py-20">
                <div className="container mx-auto grid grid-cols-1 items-center gap-12 text-center">
                    <div className="space-y-6">
                         <h2 className="font-headline text-4xl font-bold text-primary">Non fare la fila!</h2>
                        <p className="text-2xl text-foreground/80">
                            Prenota la tua spesa su WhatsApp e passa solo a ritirare. Semplice, veloce e senza attese.
                        </p>
                        <Link href="https://wa.me/390123456789" target="_blank" rel="noopener noreferrer" className="inline-block">
                            <Button size="lg" className="h-16 bg-[#25D366] px-10 text-xl text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1EBE57]">
                                <WhatsAppIcon className="mr-3 h-8 w-8" />
                                Prenota su WhatsApp
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}