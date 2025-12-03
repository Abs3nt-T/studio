
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ScrollHero() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  // Fase 1: Dissolvenza del testo iniziale e dell'overlay
  const initialTextOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const initialTextY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 0]);

  // Fase 3: Rivelazione del nuovo contenuto
  const revealContentOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const revealContentY = useTransform(scrollYProgress, [0.4, 0.6], [50, 0]);

  return (
    <section ref={targetRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Livello 2: Video di sfondo */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/hero-section/salame-animation.mp4"
        />

        {/* Livello 1: Overlay e testo iniziale */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black"
        />
        <motion.div
          style={{
            opacity: initialTextOpacity,
            y: initialTextY,
          }}
          className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4 text-white"
        >
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">
            Fanuli Carni Equine di Damiano Fanuli: L'eccellenza dal 1840
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl drop-shadow-sm">
            A Erchie, la carne equina più genuina. Qualità artigianale e sapori di una volta.
          </p>
        </motion.div>

        {/* Livello 3: Contenuto rivelato */}
        <motion.div
          style={{
            opacity: revealContentOpacity,
            y: revealContentY,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-4"
        >
          <div className="text-center bg-black/50 p-8 rounded-lg">
            <h2 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-lg">
              La nostra ultima novità
            </h2>
            <Button asChild size="lg" className="mt-8">
              <Link href="/shop">Provalo</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
