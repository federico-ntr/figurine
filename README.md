# Figurine

Web app React + TypeScript + MUI, completamente client. Nessun account, API, font remoto o servizio analytics. I dati restano nel localStorage del browser per questo indirizzo. Nessun router necessario: la selezione delle collezioni è stato locale.

Questo progetto è stato sviluppato con un forte contributo di strumenti di intelligenza artificiale (AI), utilizzati nella scrittura e nella revisione del codice e della documentazione.

## Avvio

Node.js 24, come indicato in `.node-version`, e Yarn 4 tramite Corepack.
La versione di Yarn è fissata nel campo `packageManager` di `package.json`.

```sh
corepack enable
yarn install --immutable
yarn dev
```

Apri l'indirizzo mostrato da Vite. Su mobile nella stessa rete usa l'IP LAN del computer e la porta indicata. Nessun backend applicativo: Vite serve solo i file statici.

```sh
yarn lint
yarn format:check
yarn test
yarn build
yarn preview
```

Le dipendenze dirette sono fissate a versioni esatte in `package.json`; il
`yarn.lock` blocca anche le dipendenze transitive. `.yarnrc.yml` mantiene
le installazioni in `node_modules` e le nuove dipendenze a versioni esatte.
Usa `yarn install --immutable` per riprodurre il lockfile.

La build usa Vite 8 con Rolldown e Oxc per trasformare TypeScript/JSX e
minificare JavaScript, configurati in `vite.config.ts`. Il controllo dei tipi
resta affidato a TypeScript (`yarn typecheck`), eseguito anche dalla build.
Il linting usa Oxlint (`.oxlintrc.json`), il formatting Oxfmt (`.oxfmtrc.json`).
Per applicare le correzioni usa `yarn lint:fix` e `yarn format`.
Il workflow di deploy verifica lint, formatting, test e build prima della pubblicazione.

La cartella `dist` contiene l'app compilata, inclusi React e MUI: nessuna CDN necessaria durante l'uso. Servila con un server statico; l'apertura con `file://` non è supportata. Per lavorare senza connessione Internet puoi usare un server statico sul dispositivo, senza servizi esterni. Non è implementata una PWA/service worker.

## Utilizzo

- Crea una o più collezioni (numeri consecutivi 1–10.000).
- Modalità sbusto: digita numero, Invio, successivo. Ogni inserimento aggiunge una copia, anche per un numero già trovato. Il focus resta nel campo. «Annulla ultimo» annulla un inserimento della sessione (fino agli ultimi 50).
- Tocca un numero per aggiungere o rimuovere copie. Filtra per mancanti, trovate e doppioni.
- Esporta una collezione o un backup completo in JSON. Su un altro dispositivo usa Importa e conferma. Ogni importazione crea copie separate delle collezioni; non sovrascrive o unisce automaticamente dati esistenti.
- Per organizzare gli scambi, apri una tua collezione e premi «Confronta». Carica l’export JSON dell’amico oppure incolla il suo JSON o codice FIG1. Se ci sono più album, scegli quello da confrontare: deve essere lo stesso album e la stessa edizione, con la stessa numerazione. Le liste «Puoi dare» e «Puoi ricevere» mostrano i doppioni che mancano all’altra persona, conservando una copia per numero. Il riepilogo indica quanti scambi uno a uno sono possibili; le liste restano utili anche quando solo una persona ha figurine da offrire. Il confronto non importa né salva i dati dell’amico e non modifica le quantità: dopo uno scambio aggiornale manualmente.
- Il QR contiene i dati compressi, non un link: usa un lettore QR che mostri testo, copia il codice FIG1 e incollalo nella finestra Importa del secondo dispositivo. Non è integrata una fotocamera nell'app. Per collezioni troppo grandi viene proposto il JSON.
- Il browser può cancellare il salvataggio locale, soprattutto in modalità privata o cancellando i dati del sito. Conserva backup JSON. Cambiando protocollo/host/porta si usa un archivio locale diverso.

## Verifica

Test unitari per conteggio copie, limiti e validazione import, round-trip JSON/QR e confronto degli scambi; controllo TypeScript e build produzione.
