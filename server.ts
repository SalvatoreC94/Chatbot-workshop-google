import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const VENUES_DATA = [
  {
    id: "osteria-bella-vista",
    name: "Osteria & Bottega Bella Vista",
    cuisine: "Romana Tradizionale",
    priceRange: "€€ (30-40€)",
    rating: 4.9,
    neighborhood: "Piazza Navona / Centro Storico",
    address: "Via dei Coronari 48, Roma",
    phone: "+39 06 6880 1234",
    specialties: ["Carbonara cremosa con guanciale di Amatrice", "Cacio e Pepe in cialda", "Abbacchio scottadito"],
    features: ["Dehor esterno panoramico", "Senza Glutine", "Pet Friendly"],
    summary: "Ideale per autentica cucina romana e una cena suggestiva a Piazza Navona."
  },
  {
    id: "trattoria-da-cesare",
    name: "Trattoria Casaletto & Tradizione",
    cuisine: "Romana Rustica & Fritti",
    priceRange: "€€ (28-36€)",
    rating: 4.8,
    neighborhood: "Trastevere / Gianicolo",
    address: "Via del Casaletto 45, Roma",
    phone: "+39 06 536 0150",
    specialties: ["Polpette di bollito fritte", "Bucatini all'Amatriciana", "Gnocchi al sugo di coda"],
    features: ["Pergolato estivo", "Vini naturali", "Parcheggio facile"],
    summary: "La meta perfetta per i fritti romani d'autore e un'atmosfera verace e calorosa."
  },
  {
    id: "fucina-doro-pizza",
    name: "La Fucina d'Oro - Pizzeria Gourmet",
    cuisine: "Pizza Gourmet & Birre Artigianali",
    priceRange: "€ (18-26€)",
    rating: 4.9,
    neighborhood: "Rione Monti / Colosseo",
    address: "Via Urbana 112, Roma",
    phone: "+39 06 488 2390",
    specialties: ["Pizza Gricia e Carciofi Croccanti", "Margherita con Bufala DOP a crudo", "Tris di supplì"],
    features: ["Forno a legna", "Birre artigianali laziali", "Lievitazione 48h"],
    summary: "Pizza napoletana contemporanea con cornicione soffice e birre artigianali a Monti."
  },
  {
    id: "molo-ripetta-pesce",
    name: "Il Molo di Ripetta - Pescheria & Cucina",
    cuisine: "Pesce Fresco & Cruditè",
    priceRange: "€€€ (48-65€)",
    rating: 4.8,
    neighborhood: "Piazza del Popolo / Spagna",
    address: "Via di Ripetta 73, Roma",
    phone: "+39 06 322 1940",
    specialties: ["Gran crudo di mare con gamberi rossi", "Spaghettoni alle vongole veraci e bottarga", "Frittura di paranza"],
    features: ["Atmosfera elegante & romantica", "Dehor riscaldato", "Pescato del giorno a vista"],
    summary: "Il riferimento per gli amanti del pesce fresco pescato nel Tirreno e cene romantiche."
  },
  {
    id: "giardino-botanico-bistrot",
    name: "Bistrot Giardino Botanico & Green",
    cuisine: "Bistrot Naturale & Senza Glutine",
    priceRange: "€€ (28-38€)",
    rating: 4.7,
    neighborhood: "Campo de' Fiori",
    address: "Piazza del Biscione 95, Roma",
    phone: "+39 06 687 4512",
    specialties: ["Risotto cardoncelli e tartufo", "Ravioli melanzane e stracciatella", "Cheesecake al mango"],
    features: ["100% Senza Glutine Friendly", "Opzioni Vegane", "Cocktail botanici", "Oasi verde"],
    summary: "Atmosfera rilassante e cucina curata con grande attenzione a celiaci e vegetariani."
  },
  {
    id: "enoteca-del-moro",
    name: "Enoteca & Cucina Del Moro",
    cuisine: "Enoteca & Taglieri Gourmet",
    priceRange: "€€ (24-34€)",
    rating: 4.9,
    neighborhood: "Trastevere",
    address: "Vicolo del Cinque 22, Roma",
    phone: "+39 06 580 9165",
    specialties: ["Tagliere degustazione Cinta Senese e pecorini", "Battuta di Fassona al tartufo", "Tiramisù espresso"],
    features: ["Oltre 450 etichette vini", "Tavoli all'aperto nel vicolo", "Aperitivi e dopocena"],
    summary: "L'indirizzo ideale a Trastevere per un calice di vino ricercato e taglieri di qualità."
  }
];

const DINING_CONCIERGE_PROMPT = `
Sei il Concierge Gastronomico e Food Advisor Bot di Roma.
Il tuo compito è aiutare gli utenti a scoprire dove andare a mangiare, consigliare il locale ideale in base ai loro desideri (cucina, atmosfera, budget, zona, intolleranze) e invitarli a prenotare subito un tavolo con conferma istantanea.

Ecco i 6 ristoranti selezionati nella tua rete:
${JSON.stringify(VENUES_DATA, null, 2)}

Linee guida:
1. Sii sempre caloroso, appassionato di buona cucina, accogliente e professionale.
2. Quando l'utente chiede consigli generici (es. "dove posso mangiare?", "consigliami un posto", "ho fame"):
   - Chiedi o deduci le preferenze (es. tipologia di cucina desiderata, atmosfera romantica, informale, budget) e proponi 1 o 2 locali più idonei.
   - Aggiungi sempre alla fine della risposta il tag [RECOMMEND_VENUES:id1,id2] corrispondente agli ID dei locali consigliati.
3. Se l'utente cerca specificamente:
   - Carbonara / Cacio e Pepe / Cucina romana classica: consiglia Osteria Bella Vista o Trattoria Casaletto con tag [RECOMMEND_VENUES:osteria-bella-vista,trattoria-da-cesare].
   - Pizza / Fritti / Birra artigianale: consiglia La Fucina d'Oro con tag [RECOMMEND_VENUES:fucina-doro-pizza].
   - Pesce fresco / Frutti di mare / Cena romantica elegante: consiglia Il Molo di Ripetta con tag [RECOMMEND_VENUES:molo-ripetta-pesce].
   - Senza glutine / Celiaci / Vegetariano / Vegano: consiglia Bistrot Giardino Botanico o Osteria Bella Vista con tag [RECOMMEND_VENUES:giardino-botanico-bistrot,osteria-bella-vista].
   - Vino / Aperitivo / Tagliere / Trastevere: consiglia Enoteca Del Moro con tag [RECOMMEND_VENUES:enoteca-del-moro].
4. Se l'utente vuole prenotare un tavolo:
   - Se menziona o intende un locale specifico, includi il tag [BOOK_VENUE:id_locale] (es. [BOOK_VENUE:osteria-bella-vista]).
   - Se non specifica il locale, invitalo a scegliere uno dei locali consigliati per aprire la prenotazione rapida.
5. Se l'utente chiede la mappa di tutti i locali o le posizioni, includi il tag [SHOW_MAP].
6. Mantieni le risposte snelle, con elenchi puntati chiari, indicando piatti forti e atmosfera, e offrendo sempre la possibilità di prenotare subito il tavolo!
`;

// API endpoint for chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: "Messaggio utente richiesto." });
    }

    const effectiveUserMessage = userMessage || (messages && messages[messages.length - 1]?.text) || "";
    const ai = getGeminiClient();

    // If Gemini API is not configured, immediately use smart local fallback
    if (!ai) {
      const fallbackReply = generateSmartDiningReply(effectiveUserMessage);
      return res.json({
        reply: fallbackReply.text,
        action: fallbackReply.action,
        recommendedVenueIds: fallbackReply.recommendedVenueIds,
        bookVenueId: fallbackReply.bookVenueId,
        source: "fallback",
      });
    }

    // Build context history
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const msg of messages.slice(-6)) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    if (effectiveUserMessage) {
      contents.push({
        role: "user",
        parts: [{ text: effectiveUserMessage }],
      });
    }

    const geminiCallPromise = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: effectiveUserMessage }] }],
      config: {
        systemInstruction: DINING_CONCIERGE_PROMPT,
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 3500)
    );

    const response: any = await Promise.race([geminiCallPromise, timeoutPromise]);
    const replyText = response?.text || "";

    if (!replyText) {
      throw new Error("Empty response from AI");
    }

    let cleanReply = replyText;
    let action: string | null = null;
    let recommendedVenueIds: string[] = [];
    let bookVenueId: string | null = null;

    // Parse [RECOMMEND_VENUES:id1,id2]
    const recMatch = cleanReply.match(/\[RECOMMEND_VENUES:([^\]]+)\]/);
    if (recMatch) {
      recommendedVenueIds = recMatch[1].split(",").map((s: string) => s.trim());
      action = "RECOMMEND_VENUES";
      cleanReply = cleanReply.replace(/\[RECOMMEND_VENUES:[^\]]+\]/g, "").trim();
    }

    // Parse [BOOK_VENUE:id]
    const bookMatch = cleanReply.match(/\[BOOK_VENUE:([^\]]+)\]/);
    if (bookMatch) {
      bookVenueId = bookMatch[1].trim();
      action = "OPEN_BOOKING";
      cleanReply = cleanReply.replace(/\[BOOK_VENUE:[^\]]+\]/g, "").trim();
    }

    if (cleanReply.includes("[SHOW_MAP]")) {
      action = "SHOW_MAP";
      cleanReply = cleanReply.replace(/\[SHOW_MAP\]/g, "").trim();
    }

    return res.json({
      reply: cleanReply,
      action,
      recommendedVenueIds,
      bookVenueId,
      source: "gemini",
    });
  } catch (error: any) {
    console.warn("Utilizzo fallback concierge dining:", error?.message || error);
    const msg = req.body?.userMessage || (req.body?.messages && req.body.messages[req.body.messages.length - 1]?.text) || "";
    const fallbackReply = generateSmartDiningReply(msg);
    return res.json({
      reply: fallbackReply.text,
      action: fallbackReply.action,
      recommendedVenueIds: fallbackReply.recommendedVenueIds,
      bookVenueId: fallbackReply.bookVenueId,
      source: "fallback",
    });
  }
});

// Helper for smart dining concierge matcher
function generateSmartDiningReply(input: string): {
  text: string;
  action: string | null;
  recommendedVenueIds: string[];
  bookVenueId: string | null;
} {
  const query = input.toLowerCase();

  // Pizza
  if (query.includes("pizza") || query.includes("pizzeria") || query.includes("supplì") || query.includes("monti")) {
    return {
      text: "🍕 Per un'esperienza imperdibile a base di **pizza gourmet**, ti consiglio assolutamente **La Fucina d'Oro** nel Rione Monti!\n\n• **Punti di forza:** Impasti leggeri a lievitazione naturale 48h, forno a legna e birre artigianali laziali.\n• **Specialità:** Pizza Gricia e Carciofi Croccanti e Margherita con Bufala DOP.\n\nVuoi che ti riservi un tavolo per stasera?",
      action: "RECOMMEND_VENUES",
      recommendedVenueIds: ["fucina-doro-pizza"],
      bookVenueId: "fucina-doro-pizza",
    };
  }

  // Fish / Seafood
  if (query.includes("pesce") || query.includes("frutti di mare") || query.includes("crudit") || query.includes("vongole") || query.includes("spigola")) {
    return {
      text: "🦐 Se cerchi delizioso **pesce fresco e crudi di mare**, il nostro consiglio d'eccellenza è **Il Molo di Ripetta** a Piazza del Popolo!\n\n• **Punti di forza:** Pescato locale dell'arcipelago tirrenico a vista, atmosfera elegante e romantica.\n• **Specialità:** Gran Crudo di Mare, Spaghettoni alle Vongole e frittura mista di paranza.\n\nPosso aprirti subito la prenotazione rapida!",
      action: "RECOMMEND_VENUES",
      recommendedVenueIds: ["molo-ripetta-pesce"],
      bookVenueId: "molo-ripetta-pesce",
    };
  }

  // Carbonara / Traditional Roman
  if (query.includes("carbonara") || query.includes("cacio e pepe") || query.includes("amatriciana") || query.includes("romana") || query.includes("trattoria") || query.includes("carne")) {
    return {
      text: "🍝 Per una **vera cucina romana tradizionale** eccellente, ti consiglio due punte di diamante:\n\n1. **Osteria & Bottega Bella Vista** (Piazza Navona): celebre per la Carbonara cremosa con guanciale di Amatrice e splendido dehor all'aperto.\n2. **Trattoria Casaletto & Tradizione** (Trastevere): rinomata per i fritti croccanti e la cucina verace con pergolato.\n\nQuale preferisci prenotare?",
      action: "RECOMMEND_VENUES",
      recommendedVenueIds: ["osteria-bella-vista", "trattoria-da-cesare"],
      bookVenueId: "osteria-bella-vista",
    };
  }

  // Gluten-free / Vegan / Natural
  if (query.includes("senza glutine") || query.includes("celiac") || query.includes("vegan") || query.includes("vegetar") || query.includes("bio") || query.includes("intolleran")) {
    return {
      text: "🌿 Per chi cerca opzioni **senza glutine certificate o piatti vegetariani/vegani**, ti consiglio:\n\n1. **Bistrot Giardino Botanico** (Campo de' Fiori): ambiente incantevole immerso nel verde, menù bio con pasta fresca senza glutine e dolci vegani.\n2. **Osteria Bella Vista** (Piazza Navona): con menù della tradizione romana certificato senza glutine.\n\nScegli il tuo preferito per prenotare subito!",
      action: "RECOMMEND_VENUES",
      recommendedVenueIds: ["giardino-botanico-bistrot", "osteria-bella-vista"],
      bookVenueId: "giardino-botanico-bistrot",
    };
  }

  // Wine bar / Aperitivo / Trastevere
  if (query.includes("vino") || query.includes("enoteca") || query.includes("aperitiv") || query.includes("taglier") || query.includes("trastevere") || query.includes("bere")) {
    return {
      text: "🍷 Per un aperitivo d'autore, vino pregiato e ricchi taglieri, l'indirizzo ideale è **Enoteca & Cucina Del Moro** nel cuore di Trastevere!\n\n• **Punti di forza:** Oltre 450 etichette, salumi di Cinta Senese e formaggi DOP affinati.\n• **Specialità:** Tagliere reale, battuta di Fassona al tartufo e tavoli nei vicoli di Trastevere.",
      action: "RECOMMEND_VENUES",
      recommendedVenueIds: ["enoteca-del-moro"],
      bookVenueId: "enoteca-del-moro",
    };
  }

  // Booking intent
  if (query.includes("prenot") || query.includes("tavolo") || query.includes("riservare") || query.includes("posti") || query.includes("prenotazione")) {
    return {
      text: "📅 **Prenotazione Rapida Tavolo:** Con piacere! Ho aperto il modulo di prenotazione: puoi scegliere il locale che preferisci, data, orario e numero di persone con conferma immediata!",
      action: "OPEN_BOOKING",
      recommendedVenueIds: ["osteria-bella-vista", "fucina-doro-pizza", "molo-ripetta-pesce"],
      bookVenueId: "osteria-bella-vista",
    };
  }

  // Map intent
  if (query.includes("mappa") || query.includes("dove") || query.includes("posizione") || query.includes("indirizz") || query.includes("tutti i locali") || query.includes("geolocal")) {
    return {
      text: "📍 Ecco la mappa di Google Maps con **tutti i 6 locali geolocalizzati** nei quartieri storici di Roma! Clicca su ciascun locale per visualizzare specialità, orari e percorrere il tragitto in un click.",
      action: "SHOW_MAP",
      recommendedVenueIds: ["osteria-bella-vista", "trattoria-da-cesare", "fucina-doro-pizza", "molo-ripetta-pesce", "giardino-botanico-bistrot", "enoteca-del-moro"],
      bookVenueId: null,
    };
  }

  // Default welcome advice
  return {
    text: "👋 Ciao! Sono il tuo **Food Advisor Concierge**. Posso consigliarti dove andare a mangiare a Roma e farti prenotare subito un tavolo con conferma istantanea!\n\nDimmi cosa ti piacerebbe: **cucina romana tradizionale, pizza gourmet, pesce fresco, enoteca con taglieri o opzioni senza glutine**? Oppure chiedimi un consiglio per una cena romantica o un pranzo veloce!",
    action: "RECOMMEND_VENUES",
    recommendedVenueIds: ["osteria-bella-vista", "fucina-doro-pizza", "molo-ripetta-pesce", "trattoria-da-cesare"],
    bookVenueId: null,
  };
}

// REST API for venues list
app.get("/api/venues", (req, res) => {
  res.json(VENUES_DATA);
});

// Vite integration for dev and static serving for prod
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server attivo su http://0.0.0.0:${PORT}`);
  });
}

setupServer();
