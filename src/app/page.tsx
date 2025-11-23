
import { Button } from "@/components/ui/button";
import { ChefHat, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@/components/ui/card";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const valuesBgImage = PlaceHolderImages.find(p => p.id === 'values-bg');

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-background">
        <div className="absolute inset-0">
          {heroImage && (
            <img
              src={heroImage.imageUrl}
              alt={heroImage.description}
              className="h-full w-full object-cover object-center"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
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

      {/* Values Section */}
      <section id="valori" className="relative w-full py-20 md:py-24 lg:py-32">
        <div className="absolute inset-0">
          {valuesBgImage && (
            <img
              src={valuesBgImage.imageUrl}
              alt={valuesBgImage.description}
              className="h-full w-full object-cover object-center"
              data-ai-hint={valuesBgImage.imageHint}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

        <div className="container relative px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">I Nostri Valori</h2>
            <p className="mt-4 text-lg text-muted-foreground">La nostra promessa di qualità, dal 1968.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="flex flex-col items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-8 text-center text-foreground shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-2xl font-bold">Selezione Pugliese</h3>
              <p className="text-muted-foreground">Solo capi scelti con cura dal nostro territorio per garantire freschezza e sapore unici.</p>
            </Card>
            <Card className="flex flex-col items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-8 text-center text-foreground shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <ChefHat className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-2xl font-bold">Maestri Macellai</h3>
              <p className="text-muted-foreground">La nostra arte si tramanda da generazioni, con una lavorazione artigianale quotidiana.</p>
            </Card>
            <Card className="flex flex-col items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-8 text-center text-foreground shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-2xl font-bold">Gusto e Salute</h3>
              <p className="text-muted-foreground">La carne equina è un'alleata del benessere: nutriente, magra e ricca di ferro.</p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
