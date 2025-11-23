
'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-background">
        <div className="absolute inset-0 bg-primary/80"></div>
        
        <div className="container relative mx-auto flex min-h-[calc(80vh)] flex-col items-center justify-center space-y-8 px-4 py-12 text-center text-primary-foreground md:min-h-[calc(100vh-4rem)] md:px-6">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Fanuli Carni Equine: L'Eccellenza della Tradizione.
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl">
              A Erchie, la carne equina più genuina. Qualità artigianale e sapori di una volta.
            </p>
          </div>
          <Link href="https://wa.me/390123456789" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="px-8 text-lg">
              Prenota su WhatsApp
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
