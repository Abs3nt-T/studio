'use client';
import { MapPin, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import placeholderData from "@/lib/placeholder-images.json";
import { useBookingChat } from '@/components/BookingChat';


export default function ContattiPage() {
     const heroImageId = placeholderData.galleries.contattiHero[0];
     const heroImage = placeholderData.placeholderImages.find(p => p.id === heroImageId);
     const { setIsOpen } = useBookingChat();

    return (
        <div className="w-full bg-background">
             <section className="relative w-full h-[50vh] min-h-[400px] text-white">
                 {heroImage && (
                    <>
                        <img
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            className="absolute inset-0 h-full w-full object-cover"
                            data-ai-hint={heroImage.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </>
                 )}
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-md">
                        Vieni a trovarci in Bottega
                    </h1>
                </div>
            </section>
            
            <section className="py-20">
                 <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-8">
                            <Card className="mx-auto w-full max-w-md border-primary/20 bg-card pt-6 text-foreground shadow-lg">
                                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full">
                                    <MapPin className="h-10 w-10 text-primary" />
                                    <p className="text-xl font-medium">
                                        Siamo a Erchie (BR)
                                    </p>
                                    <p className="text-2xl font-bold text-primary">
                                        Via Santa Lucia, 69
                                    </p>
                                </CardContent>
                            </Card>
                             <Card className="mx-auto w-full max-w-md border-primary/20 bg-card pt-6 text-foreground shadow-lg">
                                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full">
                                    <Mail className="h-10 w-10 text-primary" />
                                    <p className="text-xl font-medium">
                                       Scrivici una mail
                                    </p>
                                    <a href="mailto:assistenza@fanulicarniequine.it" className="break-all text-xl font-bold text-primary hover:underline">
                                        assistenza@fanulicarniequine.it
                                    </a>
                                </CardContent>
                            </Card>
                    </div>
                </div>
            </section>
            
            <section className="relative bg-secondary/30 py-20">
                <div className="container mx-auto grid grid-cols-1 items-center gap-12 text-center">
                    <div className="space-y-6">
                         <h2 className="font-headline text-4xl font-bold text-primary">Non fare la fila!</h2>
                        <p className="text-2xl text-foreground/80">
                           Prenota la tua spesa online e passa solo a ritirare. Semplice, veloce e senza attese.
                        </p>
                        <Button 
                            size="lg" 
                            className="h-16 px-10 text-xl shadow-lg transition-transform hover:scale-105"
                            onClick={() => setIsOpen(true)}
                        >
                            <MessageSquare className="mr-3 h-8 w-8" />
                            Prenota il Ritiro
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
