import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const tradizioneProducts = [
  {
    id: 'bistecca',
    name: 'Bistecca di Cavallo',
    description: 'Un taglio classico, tenero e saporito, perfetto per la griglia.',
    image: PlaceHolderImages.find(p => p.id === 'product1'),
  },
  {
    id: 'spezzatino',
    name: 'Spezzatino Tradizionale',
    description: 'Morbidi bocconcini di carne, ideali per lente cotture e sughi ricchi.',
    image: PlaceHolderImages.find(p => p.id === 'product2'),
  },
  {
    id: 'macinato',
    name: 'Macinato Scelto',
    description: 'Carne di prima qualità macinata fresca ogni giorno, versatile e gustosa.',
    image: PlaceHolderImages.find(p => p.id === 'product3'),
  },
];

const prontiACuocereProducts = [
    {
        id: 'bombette',
        name: 'Le Bombette Equine',
        description: 'Involtini saporiti con un cuore filante, pronti per la brace.',
        image: PlaceHolderImages.find(p => p.id === 'product4'),
    },
    {
        id: 'burger',
        name: 'Burger Fit',
        description: 'Hamburger magri e proteici, pensati per gli sportivi e per chi ama la leggerezza.',
        image: PlaceHolderImages.find(p => p.id === 'product5'),
    },
    {
        id: 'tartare',
        name: 'Tartare di Puledro',
        description: 'Il crudo di eccellenza. Freschezza e qualità da gustare in purezza.',
        image: PlaceHolderImages.find(p => p.id === 'product6'),
    },
];

export default function ProdottiPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:px-6 lg:py-24">
        
        {/* La Tradizione Section */}
        <section id="tradizione" className="mb-20">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              La Tradizione (Il Fresco)
            </h1>
            <p className="mt-4 text-lg text-foreground/80">
              Tagli classici che esaltano la tenerezza e il sapore autentico della nostra carne.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tradizioneProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                <CardHeader className="p-0">
                  {product.image && (
                     <img
                        src={product.image.imageUrl}
                        alt={product.name}
                        width={600}
                        height={400}
                        className="h-60 w-full object-cover"
                        data-ai-hint={product.image.imageHint}
                     />
                  )}
                </CardHeader>
                <CardContent className="flex-1 p-6">
                  <CardTitle className="font-headline text-2xl">{product.name}</CardTitle>
                  <CardDescription className="mt-2 text-base text-muted-foreground">{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Link href="https://wa.me/390123456789" target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full">Ordina</Button>
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Pronti a Cuocere Section */}
        <section id="pronti-a-cuocere">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              I Pronti a Cuocere
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Le nostre specialità della casa, create con passione per portare in tavola gusto e originalità.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {prontiACuocereProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                 <CardHeader className="p-0">
                  {product.image && (
                     <img
                        src={product.image.imageUrl}
                        alt={product.name}
                        width={600}
                        height={400}
                        className="h-60 w-full object-cover"
                        data-ai-hint={product.image.imageHint}
                     />
                  )}
                </CardHeader>
                <CardContent className="flex-1 p-6">
                  <CardTitle className="font-headline text-2xl">{product.name}</CardTitle>
                  <CardDescription className="mt-2 text-base text-muted-foreground">{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Link href="https://wa.me/390123456789" target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full">Ordina</Button>
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
