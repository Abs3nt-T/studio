'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// --- Configuration ---
// IMPORTANTE: Modifica questi valori per farli corrispondere alla tua sequenza di immagini.
const FRAME_COUNT = 140; // Numero totale di frame nell'animazione
const FRAME_PATH_PREFIX = '/frames/tagliata_'; // Percorso e prefisso del nome dei file
const FRAME_FILE_EXTENSION = '.jpg'; // Estensione dei file dei frame
// ---------------------

const getFramePath = (frame: number): string => {
  // Ipotizza che i frame siano nominati tipo: tagliata_0000.jpg, tagliata_0001.jpg, etc.
  return `${FRAME_PATH_PREFIX}${frame.toString().padStart(4, '0')}${FRAME_FILE_EXTENSION}`;
};

// Pre-carica le immagini per un'animazione fluida
const preloadedImages: HTMLImageElement[] = [];
if (typeof window !== 'undefined') {
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    preloadedImages.push(img);
  }
}

export function ScrollHero() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'], // Anima per tutta l'altezza del componente
  });

  // --- Definizioni delle Animazioni ---
  const initialTextOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const initialTextY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.15], [0.5, 0]);
  
  const frameIndex = useTransform(scrollYProgress, [0.1, 0.8], [0, FRAME_COUNT - 1]);
  
  const revealContentOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const revealContentY = useTransform(scrollYProgress, [0.6, 0.8], [50, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !preloadedImages.length) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    let requestId: number;

    const drawFrame = (index: number) => {
        const img = preloadedImages[index];
        if (img && img.complete) {
            // Logica per emulare object-fit: cover
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
    };
    
    const setCanvasSize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context.setTransform(dpr, 0, 0, dpr, 0, 0); // Usa setTransform per gestire lo scaling su schermi retina
        drawFrame(Math.round(frameIndex.get()));
    };

    // Impostazioni iniziali
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    const firstImage = preloadedImages[0];
    if (firstImage.complete) {
        drawFrame(0);
    } else {
        firstImage.onload = () => drawFrame(0);
    }

    const unsubscribe = frameIndex.onChange((latest) => {
      cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(() => drawFrame(Math.round(latest)));
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(requestId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [frameIndex]);

  return (
    <section ref={targetRef} className="relative h-[400vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Livello 2: Canvas per l'animazione dei frame */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

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

        {/* Livello 3: Contenuto Rivelato */}
        <motion.div
          style={{
            opacity: revealContentOpacity,
            y: revealContentY,
          }}
          className="absolute inset-0 z-20 flex items-center justify-between text-white p-8 md:p-16 pointer-events-none"
        >
            <div className="w-1/2 md:w-1/3 pointer-events-auto">
                 <h2 className="font-headline text-4xl md:text-6xl font-bold drop-shadow-lg text-left">
                    La tagliata da gustare, provala con salsa barbecue
                </h2>
            </div>
            <div className="w-1/2 md:w-1/3 flex justify-end pointer-events-auto">
                <Button asChild size="lg" className="text-lg md:text-xl px-8 py-6">
                  <Link href="/shop">Provala</Link>
                </Button>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
