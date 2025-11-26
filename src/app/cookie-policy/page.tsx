
'use client';
import Script from "next/script";

export default function CookiePolicyPage() {
  return (
    <div className="bg-background py-16 sm:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="prose prose-lg mx-auto text-foreground/90 prose-headings:font-headline prose-headings:text-primary prose-p:font-body prose-p:leading-relaxed">
          <h1 className="text-center">Cookie Policy</h1>

          <p>
            Questo sito web utilizza i cookie per migliorare l'esperienza dell'utente, per analizzare il traffico e per finalità di marketing. Un cookie è un piccolo file di testo che un sito web salva sul tuo computer o dispositivo mobile quando visiti il sito.
          </p>

          <h2 className="mt-12 text-3xl">Tipologie di Cookie Utilizzati</h2>
          
          <h3 className="mt-10 text-2xl">Cookie Tecnici (Sempre Attivi)</h3>
          <p>
            Questi cookie sono essenziali per il corretto funzionamento del sito e per consentirti di utilizzare le sue funzionalità principali. Non possono essere disattivati nei nostri sistemi. Solitamente vengono impostati solo in risposta ad azioni da te effettuate che costituiscono una richiesta di servizi, come l'impostazione delle preferenze sulla privacy, l'accesso o la compilazione di moduli, e la gestione del carrello.
          </p>

          <h3 className="mt-10 text-2xl">Cookie di Statistica/Analisi</h3>
          <p>
            Questi cookie ci aiutano a capire come i visitatori interagiscono con il sito web raccogliendo e trasmettendo informazioni in forma anonima. Utilizziamo Google Analytics per raccogliere dati aggregati sul numero di visitatori e su come navigano il sito, al fine di migliorare i nostri servizi.
          </p>

           <h3 className="mt-10 text-2xl">Cookie di Profilazione/Marketing</h3>
          <p>
            Questi cookie possono essere impostati tramite il nostro sito dai nostri partner pubblicitari (es. Google). Possono essere utilizzati da queste aziende per costruire un profilo dei tuoi interessi e mostrarti annunci pertinenti su altri siti. Non memorizzano direttamente informazioni personali, ma si basano sull'identificazione univoca del tuo browser e dispositivo internet. Se non accetti questi cookie, riceverai una pubblicità meno mirata.
          </p>

          <h2 className="mt-12 text-3xl">Dichiarazione Cookie</h2>
          <p>
            Di seguito è riportato l'elenco dettagliato dei cookie utilizzati da questo sito. La dichiarazione è generata e mantenuta aggiornata automaticamente da Cookiebot.
          </p>
          
          <Script id="CookieDeclaration" src="https://consent.cookiebot.com/7d278eae-9893-4e89-8176-f9b2453d85ea/cd.js" type="text/javascript" strategy="lazyOnload" />

          <h2 className="mt-12 text-3xl">Gestione dei Cookie</h2>
          <p>
            Puoi modificare o revocare il tuo consenso in qualsiasi momento cliccando sul link "Impostazioni Cookie" presente nel footer di ogni pagina del sito.
          </p>

        </div>
      </div>
    </div>
  );
}
