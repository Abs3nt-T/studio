import { Dumbbell, ShieldCheck, HeartPulse, Leaf } from 'lucide-react';

export default function SalutePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16 md:px-6 lg:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            La Carne Equina: Il Carburante Nobile
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Un alimento prezioso, naturalmente ricco di nutrienti essenziali per una vita sana e attiva.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HeartPulse className="h-8 w-8" />
            </div>
            <h3 className="font-headline text-2xl font-bold">Ricca di Ferro</h3>
            <p className="text-muted-foreground">
              La carne di cavallo è una delle fonti più ricche di ferro biodisponibile, fondamentale per combattere la stanchezza e l'anemia. Un vero toccasana per l'energia quotidiana.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Dumbbell className="h-8 w-8" />
            </div>
            <h3 className="font-headline text-2xl font-bold">Proteine Nobili</h3>
            <p className="text-muted-foreground">
              Con il suo alto contenuto di proteine ad alto valore biologico, è l'alleata perfetta per gli sportivi che vogliono potenziare la massa muscolare e per la crescita sana dei bambini.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Leaf className="h-8 w-8" />
            </div>
            <h3 className="font-headline text-2xl font-bold">Pochi Grassi</h3>
            <p className="text-muted-foreground">
              Sorprendentemente magra e con un basso contenuto di colesterolo, la nostra carne è ideale per chi segue diete ipocaloriche o semplicemente desidera un'alimentazione leggera e bilanciata.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="font-headline text-2xl font-bold">Genuinità Garantita</h3>
            <p className="text-muted-foreground">
              Selezioniamo solo capi cresciuti in modo naturale, senza l'uso di antibiotici o ormoni. La nostra filiera corta garantisce un prodotto non solo buono, ma anche sicuro e controllato.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
