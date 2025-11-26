
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background py-16 sm:py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="prose prose-lg mx-auto text-foreground/90 prose-headings:font-headline prose-headings:text-primary prose-p:font-body prose-p:leading-relaxed">
          <h1 className="text-center">Privacy Policy</h1>
          <p className="text-center text-sm text-muted-foreground">Ultimo aggiornamento: 25/07/2024</p>

          <p>
            La presente Privacy Policy descrive come i tuoi dati personali vengono raccolti, utilizzati e condivisi quando visiti o effettui un acquisto su questo sito web ("Sito").
          </p>
          
          <h2 className="mt-12 text-3xl">Titolare del Trattamento dei Dati</h2>
          <p>
            Servizi e Distribuzioni Alimentari Srl<br />
            Via Santa Lucia 69, 72020 Erchie (BR), Italia<br />
            <strong>Indirizzo email del Titolare:</strong> info@fanulicarniequine.it
          </p>

          <h2 className="mt-12 text-3xl">Tipologie di Dati raccolti</h2>
          <p>
            Fra i Dati Personali raccolti da questo Sito, in modo autonomo o tramite terze parti, ci sono: nome, cognome, indirizzo email, numero di telefono, indirizzo di spedizione e fatturazione, Dati di utilizzo e Cookie.
          </p>
          <p>
            I Dati Personali possono essere liberamente forniti dall'Utente o, nel caso di Dati di Utilizzo, raccolti automaticamente durante l'uso di questo Sito.
          </p>

          <h2 className="mt-12 text-3xl">Finalità del Trattamento dei Dati raccolti</h2>
          <p>
            I Dati dell’Utente sono raccolti per consentire al Titolare di fornire i propri Servizi, così come per le seguenti finalità:
          </p>
          <ul>
            <li><strong>Gestione degli ordini e spedizioni:</strong> Per processare i pagamenti, organizzare la spedizione e fornire fatture e/o conferme d'ordine (nome, email, indirizzo, telefono).</li>
            <li><strong>Gestione prenotazioni per ritiro in negozio:</strong> Per gestire le richieste di prenotazione della spesa con ritiro in sede.</li>
            <li><strong>Contattare l'Utente:</strong> Per rispondere a richieste di supporto o per inviare comunicazioni transazionali relative agli ordini.</li>
            <li><strong>Statistica:</strong> Per monitorare e analizzare i dati di traffico in forma aggregata e anonima.</li>
          </ul>

          <h2 className="mt-12 text-3xl">Servizi di terze parti</h2>
          <p>
            Questo sito utilizza servizi di terze parti per il suo funzionamento. Di seguito l'elenco dei servizi e il link alle rispettive privacy policy:
          </p>
          <ul>
            <li>
                <strong>PayPal:</strong> Servizio di gestione dei pagamenti. I dati della transazione sono gestiti direttamente da PayPal. 
                <a href="https://www.paypal.com/it/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer"> Privacy Policy di PayPal</a>.
            </li>
            <li>
                <strong>Sanity:</strong> Piattaforma headless CMS utilizzata per l'archiviazione sicura dei dati relativi a ordini e prenotazioni. 
                <a href="https://www.sanity.io/legal/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy di Sanity</a>.
            </li>
             <li>
                <strong>Resend:</strong> Servizio per l'invio di email transazionali (es. conferma d'ordine, notifica di spedizione). 
                <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy di Resend</a>.
            </li>
            <li>
                <strong>Google Analytics:</strong> Servizio di analisi web fornito da Google Inc. per raccogliere dati statistici aggregati sulla navigazione del sito. I dati sono raccolti in forma anonima.
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy di Google</a>.
            </li>
             <li>
                <strong>Netlify / Firebase App Hosting:</strong> Servizio di hosting su cui è ospitato il sito web.
            </li>
          </ul>
          
          <h2 className="mt-12 text-3xl">Diritti dell’Utente</h2>
          <p>
            Gli Utenti possono esercitare determinati diritti con riferimento ai Dati trattati dal Titolare. In particolare, l’Utente ha il diritto di:
          </p>
          <ul>
            <li><strong>revocare il consenso in ogni momento.</strong></li>
            <li><strong>opporsi al trattamento dei propri Dati.</strong></li>
            <li><strong>accedere ai propri Dati.</strong></li>
            <li><strong>verificare e chiedere la rettificazione.</strong></li>
            <li><strong>ottenere la limitazione del trattamento.</strong></li>
            <li><strong>ottenere la cancellazione o rimozione dei propri Dati Personali.</strong></li>
            <li><strong>ricevere i propri Dati o farli trasferire ad altro titolare.</strong></li>
            <li><strong>proporre reclamo</strong> all'autorità di controllo della protezione dei dati personali competente.</li>
          </ul>
          <p>
            Per esercitare i tuoi diritti, puoi inviare una richiesta all'indirizzo email del Titolare: <a href="mailto:info@fanulicarniequine.it">info@fanulicarniequine.it</a>. Le richieste sono evase dal Titolare nel più breve tempo possibile, in ogni caso entro un mese.
          </p>

          <h2 className="mt-12 text-3xl">Modifiche a questa privacy policy</h2>
          <p>
            Il Titolare del Trattamento si riserva il diritto di apportare modifiche alla presente privacy policy in qualunque momento notificandolo agli Utenti su questa pagina. Si prega dunque di consultare regolarmente questa pagina, facendo riferimento alla data di ultima modifica indicata in alto.
          </p>

        </div>
      </div>
    </div>
  );
}
