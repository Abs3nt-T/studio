'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Gem, ScrollText, Leaf, Star } from "lucide-react";
import React from "react";
import placeholderData from "@/lib/placeholder-images.json";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const values = [
  {
    icon: Gem,
    title: "Qualità Superiore",
    description: "Selezioniamo solo i migliori tagli di carne, garantendo un prodotto tenero, saporito e di altissima qualità, controllato in ogni fase della filiera.",
  },
  {
    icon: ScrollText,
    title: "Tradizione di Famiglia",
    description: "Portiamo avanti con passione le ricette e i metodi artigianali tramandati da generazioni, per offrirti il sapore autentico della tradizione.",
  },
  {
    icon: Leaf,
    title: "Freschezza Garantita",
    "description": "La nostra carne è sempre fresca di giornata. Prepariamo i tagli e i pronti a cuocere al momento per assicurare massima genuinità e gusto.",
  },
];

const reviews = [
    {
        name: "Maria G.",
        text: "La migliore carne di cavallo che abbia mai assaggiato! La qualità è eccezionale e il personale è sempre gentile e disponibile. Le bombette sono una vera delizia!",
        rating: 5,
    },
    {
        name: "Luca R.",
        text: "Sono un cliente fisso da anni. Fanuli è una garanzia di freschezza e sapore. Perfetto per la grigliata della domenica in famiglia. Non li cambierei per nulla al mondo.",
        rating: 5,
    },
    {
        name: "Giulia T.",
        text: "Ho provato i loro burger fit e sono diventati un must per la mia dieta da sportiva. Magri, proteici e super gustosi. Finalmente un prodotto sano che non sacrifica il sapore.",
        rating: 5,
    }
];

export default function Home() {
    const testImage = placeholderData.placeholderImages.find(p => p.id === 'test-image');
    
    const homeHeroImages = placeholderData.galleries.homeHero.map(id => 
        placeholderData.placeholderImages.find(p => p.id === id)
    ).filter(Boolean);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
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
                         {homeHeroImages.map((image) => (
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
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                          Fanuli Carni Equine: L'Eccellenza della Tradizione.
                        </h1>
                        <p className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl">
                          A Erchie, la carne equina più genuina. Qualità artigianale e sapori di una volta.
                        </p>
                    </div>
                </div>
            </section>
            
            <section className="py-10 text-center">
                <h2 className="font-headline text-2xl">Test Visualizzazione Immagine</h2>
                <p className="mb-4 text-muted-foreground">Se vedi l'immagine di un banco macelleria qui sotto, il problema di base è risolto.</p>
                {testImage ? (
                     <img 
                        src={testImage.imageUrl} 
                        alt={testImage.description}
                        className="mx-auto max-w-lg rounded-lg shadow-lg"
                        data-ai-hint={testImage.imageHint}
                     />
                ) : (
                    <p className="text-destructive">Immagine di test non trovata nel file JSON.</p>
                )}
            </section>

            {/* Reviews Section */}
            <section id="recensioni" className="bg-secondary/30 py-20 sm:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            Dicono di Noi
                        </h2>
                        <p className="mt-4 text-lg text-foreground/80">
                            La soddisfazione dei nostri clienti è la nostra più grande ricompensa.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review) => (
                            <Card key={review.name} className="flex flex-col justify-between">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <CardTitle className="font-headline text-xl">{review.name}</CardTitle>
                                            <div className="flex items-center">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">"{review.text}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section id="valori" className="bg-background py-20 sm:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            I Nostri Valori
                        </h2>
                        <p className="mt-4 text-lg text-foreground/80">
                            Passione, qualità e rispetto per la tradizione sono i pilastri del nostro lavoro.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {values.map((value) => (
                            <Card key={value.title} className="text-center">
                                <CardHeader className="items-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <value.icon className="h-8 w-8" />
                                    </div>
                                    <CardTitle className="font-headline text-2xl">{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}