'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Gem, ScrollText, Leaf, Star } from "lucide-react";
import React from "react";
import placeholderData from "@/lib/placeholder-images.json";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { allProducts, Product } from "@/lib/products";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

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
    const heroImageId = placeholderData.galleries.homeHero[0];
    const heroImage = placeholderData.placeholderImages.find(p => p.id === heroImageId);
    
    const roastProductsIds = ['picanha-asino', 'costate-asino-osso', 'tomahawk-asino-con-osso', 'ribeye-asino', 'asado-mulo', 'asado-asino'];
    const roastProducts = allProducts
        .filter(p => roastProductsIds.includes(p.id))
        .map(product => {
            const image = PlaceHolderImages.find(img => img.id === product.imageId);
            return { ...product, image };
        });

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
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
                      Fanuli Carni Equine: L'Eccellenza della Tradizione.
                    </h1>
                    <p className="mx-auto mt-6 max-w-[700px] text-lg text-white/90 md:text-xl drop-shadow-sm">
                      A Erchie, la carne equina più genuina. Qualità artigianale e sapori di una volta.
                    </p>
                </div>
            </section>
            
            {/* Holiday Section */}
            <section id="festivita" className="bg-background py-20 sm:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center mb-12">
                        <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                           Buone Feste da Fanuli!
                        </h2>
                        <p className="mt-6 text-lg text-foreground/80 md:text-xl">
                           Un ringraziamento affettuoso a tutti i nostri clienti, e la felicità di ridare a Fanuli Carni Equine un nuovo volto durante queste festività.
                        </p>
                    </div>
                     <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {roastProducts.map((product) => (
                                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1 h-full">
                                         <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                                            <CardHeader className="p-0">
                                                {product.image && (
                                                    <div className="aspect-video w-full overflow-hidden">
                                                        <img
                                                            src={product.image.imageUrl}
                                                            alt={product.image.description}
                                                            className="object-cover w-full h-full"
                                                            data-ai-hint={product.image.imageHint}
                                                        />
                                                    </div>
                                                )}
                                            </CardHeader>
                                            <CardContent className="flex flex-1 flex-col p-6">
                                                <p className="text-sm font-medium text-primary">{product.category}</p>
                                                <CardTitle className="font-headline text-xl mt-1">{product.name}</CardTitle>
                                                <div className="mt-4 flex items-baseline gap-2">
                                                    <p className="text-2xl font-bold text-primary">{formatPrice(product.offerPrice)}</p>
                                                    <p className="text-base font-medium text-muted-foreground line-through">{formatPrice(product.listPrice)}</p>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">/ kg</p>
                                            </CardContent>
                                            <CardFooter className="p-6 pt-0">
                                                <Button asChild className="w-full">
                                                    <Link href="/shop">Vedi nello Shop</Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                    </Carousel>
                </div>
            </section>

             {/* Scoprici Section */}
            <section id="scoprici" className="bg-secondary/30 py-20 sm:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            Scoprici
                        </h2>
                        <p className="mt-6 text-lg text-foreground/80 md:text-xl">
                            Dal 1840, la nostra famiglia porta avanti una tradizione di eccellenza. Una storia di passione, segreti tramandati e un amore incondizionato per la qualità. {' '}
                            <Link href="/chisiamo" className="font-bold text-primary underline transition-colors hover:text-primary/80">
                                Scopri la nostra storia
                            </Link>
                            {' '} e perché la nostra carne è diversa da tutte le altre.
                        </p>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="recensioni" className="bg-background py-20 sm:py-24">
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
            <section id="valori" className="bg-secondary/30 py-20 sm:py-24">
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
