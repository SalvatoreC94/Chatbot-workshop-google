# Design system — Assistente lead-gen

Riferimento per mantenere coerenti stile visivo e tono del bot mentre il widget evolve. Se cambi un valore qui, aggiorna anche i token in `src/index.css`.

## Tono di voce del bot

Il bot parla a nome di Salvatore Cozzolino: deve suonare come lui, non come un chatbot da e-commerce.

- **Diretto**: mai scuse, mai giri di parole. Se non sa qualcosa, lo dice e rimanda al contatto diretto.
- **Onesto prima, proposta dopo**: se una domanda ha una risposta scomoda (es. "non faccio siti WordPress"), la dà comunque, poi offre l'alternativa.
- **Conciso**: max 3-4 righe per risposta. Niente elenchi puntati a meno che aiutino davvero la lettura.
- **Niente markdown pesante**: pochissimo grassetto, mai wall of text.
- **Chiude sempre con un'azione**: una domanda di follow-up o un invito a passare al contatto (Calendly/WhatsApp) — mai una risposta che lascia il lead a un vicolo cieco.
- **Non inventa cifre o date precise**: su prezzi/tempi resta sul vago e rimanda alla call, non spara numeri a caso.

Queste regole vivono nel system prompt (`LEAD_GEN_PROMPT` in `server.ts`) — se il bot esce dal tono, è lì che si corregge.

## Palette

Token definiti in `src/index.css` sotto `@theme`, usati come utility Tailwind (`bg-brand-600`, `text-accent-700`, ecc.). Cambiare qui = cambiare ovunque nel widget.

| Token | Hex | Uso |
|---|---|---|
| `--color-brand-50` | `#eef2ff` | sfondo badge/hover leggeri |
| `--color-brand-100` | `#e0e7ff` | sfondo icone secondarie |
| `--color-brand-200` | `#c7d2fe` | bordi in hover |
| `--color-brand-600` | `#4f46e5` | colore primario: header, bubble utente, bottone Calendly |
| `--color-brand-700` | `#4338ca` | hover su primario |
| `--color-brand-800` | `#3730a3` | gradiente avatar |
| `--color-accent-600` | `#059669` | bottone WhatsApp |
| `--color-accent-700` | `#047857` | hover WhatsApp |

Neutri: scala `slate` di Tailwind, invariata.

## Tipografia & spaziatura

- Font: system stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`) — zero dipendenze esterne da caricare.
- Testo bubble: `text-xs` mobile / `text-sm` desktop, `leading-relaxed`.
- Radius: card e bubble `rounded-2xl` (16px), bottoni `rounded-xl` (12px) — mai spigoli vivi, mai pillole complete.
- Spaziatura interna bubble: `p-3.5`. Gap tra elementi: `gap-2.5` (stretto) o `gap-4` (tra blocchi).

## Componenti

- **Header (`Navbar.tsx`)**: brand + un solo CTA primario visibile ("Prenota una call"). Niente tab multipli — il widget vive su una pagina contatti, non è un'app a sé.
- **Bubble bot**: sfondo bianco, bordo `slate-200`, angolo alto-sinistra smussato meno degli altri (effetto "fumetto").
- **Bubble utente**: sfondo `brand-600`, testo bianco, angolo alto-destra smussato meno.
- **CTA post-risposta**: quando il bot propone di passare al contatto, mostra due bottoni pillola (Calendly = brand, WhatsApp = accent) sotto il messaggio, mai al posto del testo.
- **Suggerimenti rapidi**: chip orizzontali scrollabili sopra l'input, per chi non sa cosa chiedere.

## Cosa NON fare

- Non aggiungere altri tab (mappa, prenotazione tavolo, FAQ separata) — è stato tolto apposta, il bot deve rispondere tutto in chat.
- Non usare colori fuori dai token sopra senza aggiornare questo file.
- Non far scrivere al bot risposte oltre le 4 righe: se serve più spazio, è probabile che la domanda vada gestita con un CTA invece che con testo.
