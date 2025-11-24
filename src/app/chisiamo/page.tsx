'use client';
import React from "react";
import placeholderData from "@/lib/placeholder-images.json";


export default function ChiSiamoPage() {
    const heroImage = placeholderData.placeholderImages.find(p => p.id === 'chisiamo-1');

    return (
        <div className="bg-background">
             <section className="relative w-full h-[50vh] md:h-[60vh] bg-secondary text-white">
                 {heroImage && (
                    <img
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        className="w-full h-full object-cover"
                        data-ai-hint={heroImage.imageHint}
                    />
                 )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                            Scegliamo per voi le carni migliori da generazioni
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90 md:mx-0 md:text-xl">
                            Una storia di famiglia, passione e qualità che dura dal 1840.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 sm:py-24">
                <div className="container mx-auto max-w-4xl px-4 md:px-6">
                    <div className="prose prose-lg mx-auto text-foreground/90 prose-headings:font-headline prose-headings:text-primary prose-p:font-body prose-p:leading-relaxed">
                        <p>
                            Sul versante adriatico di un territorio ricco di cultura della tradizione, nasce agli inizi del secolo scorso la macelleria a conduzione familiare di Emanuele Fanuli.
                        </p>
                        <p>
                            L’attenzione per la qualità e la ricerca della tipicità accompagnano da sempre la norcineria nella scelta di carni biologiche e genuine, da esemplari indigeni nati in allevamenti locali e controllati, in cui gli equini vengono cresciuti nel pascolo libero della campagna salentina, dove mare e terra si uniscono in una fusione di sapori e profumi.
                        </p>
                        <p>
                            Fanuli, una famiglia da sempre dedita con pazienza e amore alla lavorazione ed al commercio delle migliori carni del territorio del Salento e della Valle d’Itria. Se l’epoca attuale è caratterizzata dalla perdita delle usanze tradizionali, come la trasmissione diretta da padre in figlio di antiche sapienze, la famiglia FANULI è l’eccezione che conferma la regola.
                        </p>
                        <p>
                            Il nostro lavoro, infatti, trae origine dal mio trisavolo Emanuele che, nei primi anni del novecento, aprì una bottega nel brindisino, a Erchie, in Via Santa Lucia, centro storico del paese. Successivamente, mio nonno Damiano e mio padre Emanuele continuarono con entusiasmo e dedizione l’attività, grazie all’ esempio e ai consigli del genitore che li avviò alla lavorazione nel settore trasmettendo loro i segreti del mestiere.
                        </p>
                        <p>
                            Oggi siamo giunti alla quarta generazione di macellai che mette a disposizione di tutti la propria esperienza, arricchita da tecniche moderne che hanno migliorato i processi di lavorazione, senza dimenticare, però, gli autentici valori della vita: il contatto umano e il rispetto per la clientela, così come la nostra famiglia ci ha sempre insegnato.
                        </p>
                        <p>
                            Sono questi tratti gli elementi fondamentali che caratterizzano la famiglia FANULI, accanto alla qualità e la genuinità dei prodotti. Settimanalmente, infatti, ci rechiamo presso le aziende zootecniche della zona per acquistare i capi di bestiame e trasportarli personalmente nei centri di macellazione.
                        </p>
                        <p>
                            La preparazione della carne è un processo articolato che si compone di varie fasi, frutto dell’esperienza di chi si occupa con passione e cura di questo settore. La biodiversità presente nell’entroterra idruntino contribuisce a esaltare il sapore, quale protagonista esclusivo delle carni lavorate dall’azienda, garantendo un prodotto di alta qualità a km zero e nel rispetto di tutti gli standard di legge.
                        </p>
                        <blockquote className="border-l-4 border-primary bg-primary/5 p-4 italic">
                            “Fatti pizzicare dalla bontà” è la sintesi del carattere peculiare della tradizione salentina, impregnata del sapore di una terra generosa, la terra degli ulivi monumentali e delle tarante, del mare limpido e dei suoi profumi, dell’esperienza che, dalla terra rossa, ha tratto gusto e genuinità.
                        </blockquote>
                        <p>
                            Grazie all’esperienza maturata in tanti decenni di attività, tramandata di padre in figlio attraverso tre generazioni e al rispetto del territorio e delle sue tradizioni, i macellai FANULI vi consigliano nella scelta del taglio della carne e nella preparazione culinaria più idonea: un’ eccellenza al vostro servizio per le soddisfazioni del vostro palato.
                        </p>
                        <p className="text-center font-headline text-2xl text-primary">
                            MACELLERIA FANULI
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
