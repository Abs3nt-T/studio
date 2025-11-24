
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { allProducts, Product } from '@/lib/products';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';

const categories = ['Tutti', 'Carne di asino', 'Carne di mulo', 'Carne di cavallo', 'Carne di lattone'];

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState('Tutti');

    const productsWithImages = allProducts.map(product => {
        const image = PlaceHolderImages.find(img => img.id === product.imageId);
        return { ...product, image };
    });

    const filteredProducts = selectedCategory === 'Tutti'
        ? productsWithImages
        : productsWithImages.filter(p => p.category === selectedCategory);

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16 md:px-6 lg:py-24">
                <header className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Il Nostro Shop
                    </h1>
                    <p className="mt-4 text-lg text-foreground/80">
                        Qualità e tradizione, direttamente a casa tua.
                    </p>
                </header>

                <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(category)}
                            className="rounded-full"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                            <CardHeader className="p-0">
                                {product.image && (
                                    <div className="aspect-video w-full overflow-hidden">
                                    <Image
                                        src={product.image.imageUrl}
                                        alt={product.image.description}
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-full"
                                        data-ai-hint={product.image.imageHint}
                                    />
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col p-6">
                                <p className="text-sm font-medium text-primary">{product.category}</p>
                                <CardTitle className="font-headline text-xl mt-1">{product.name}</CardTitle>
                                <CardDescription className="mt-2 text-sm text-muted-foreground flex-grow">{product.description}</CardDescription>
                                <div className="mt-4 flex items-baseline gap-2">
                                     <p className="text-2xl font-bold text-primary">{formatPrice(product.offerPrice)}</p>
                                     <p className="text-base font-medium text-muted-foreground line-through">{formatPrice(product.listPrice)}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">/ {product.weight} kg</p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Link href="https://wa.me/390123456789" target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button className="w-full">Ordina su WhatsApp</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
