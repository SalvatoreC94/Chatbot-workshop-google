import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20kb" }));

// Limita gli abusi: un lead vero manda al massimo qualche messaggio al minuto.
const chatShortLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Troppe richieste, riprova tra un minuto." },
});

// Tetto giornaliero per IP: contiene il costo anche in caso di script automatizzati.
const chatDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite giornaliero raggiunto, riprova domani o contattami direttamente." },
});

const MAX_MESSAGE_LENGTH = 500;

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

const FREELANCER_PROFILE = {
  name: "Salvatore Cozzolino",
  role: "Sviluppatore fullstack freelance (specializzato frontend)",
  services: [
    "Sviluppo frontend su misura (React, Next.js)",
    "Applicazioni fullstack end-to-end",
    "Consulenza tecnica e code review",
    "Manutenzione ed evoluzione di prodotti esistenti"
  ],
  techStack: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
  priceRangeText: "Il costo dipende da obiettivo, scope e tempistiche del progetto: si lavora sia a tariffa oraria sia a progetto chiuso. Il modo più rapido per avere una cifra precisa è una breve call conoscitiva.",
  deliveryTimeText: "Dipende dalla complessità: un intervento mirato può richiedere pochi giorni, un prodotto completo alcune settimane. Nella call iniziale si può dare una stima realistica sul caso specifico.",
  calendlyUrl: "https://calendly.com/TUO-LINK/30min",
  whatsappNumber: "39XXXXXXXXXX"
};

const LEAD_GEN_PROMPT = `
Sei l'assistente virtuale sulla pagina contatti del sito di ${FREELANCER_PROFILE.name}, ${FREELANCER_PROFILE.role}.
Il tuo compito è rispondere ai visitatori che valutano di ingaggiarlo, qualificare il lead e spingerlo a prenotare una call o scrivere su WhatsApp.

Dati su cui basare le risposte:
${JSON.stringify(FREELANCER_PROFILE, null, 2)}

Linee guida:
1. Tono professionale, diretto, caloroso ma senza fronzoli. Risposte brevi (max 4-5 righe), niente markup markdown pesante.
2. Se chiedono dei servizi: elenca 2-3 servizi pertinenti alla domanda, non tutti sempre.
3. Se chiedono di prezzi/budget: usa il priceRangeText, non inventare cifre precise.
4. Se chiedono di tempistiche: usa il deliveryTimeText.
5. Se chiedono dello stack tecnico: cita solo le tecnologie rilevanti alla domanda.
6. Se sembrano pronti a procedere (vogliono contattarlo, prenotare, parlare del progetto): invitali esplicitamente a scegliere tra prenotare una call o scrivere su WhatsApp, e aggiungi il tag [OPEN_CTA] alla fine della risposta.
7. Non rispondere a domande fuori tema (non sei un chatbot generico): riporta gentilmente la conversazione sui servizi di ${FREELANCER_PROFILE.name}.
`;

// API endpoint for chatbot
app.post("/api/chat", chatShortLimiter, chatDailyLimiter, async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: "Messaggio utente richiesto." });
    }

    const effectiveUserMessage = userMessage || (messages && messages[messages.length - 1]?.text) || "";

    if (effectiveUserMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Messaggio troppo lungo (max ${MAX_MESSAGE_LENGTH} caratteri).` });
    }

    const ai = getGeminiClient();

    // If Gemini API is not configured, immediately use smart local fallback
    if (!ai) {
      const fallbackReply = generateSmartLeadReply(effectiveUserMessage);
      return res.json({
        reply: fallbackReply.text,
        action: fallbackReply.action,
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
        systemInstruction: LEAD_GEN_PROMPT,
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 300,
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

    if (cleanReply.includes("[OPEN_CTA]")) {
      action = "OPEN_CTA";
      cleanReply = cleanReply.replace(/\[OPEN_CTA\]/g, "").trim();
    }

    const usage = response?.usageMetadata;

    return res.json({
      reply: cleanReply,
      action,
      source: "gemini",
      usage,
    });
  } catch (error: any) {
    console.warn("Utilizzo fallback lead-gen:", error?.message || error);
    const msg = req.body?.userMessage || (req.body?.messages && req.body.messages[req.body.messages.length - 1]?.text) || "";
    const fallbackReply = generateSmartLeadReply(msg);
    return res.json({
      reply: fallbackReply.text,
      action: fallbackReply.action,
      source: "fallback",
    });
  }
});

// Helper: rule-based fallback usato quando Gemini non è configurato o va in timeout/errore
function generateSmartLeadReply(input: string): { text: string; action: string | null } {
  const query = input.toLowerCase();
  const p = FREELANCER_PROFILE;

  if (query.includes("servizi") || query.includes("cosa fai") || query.includes("di cosa ti occupi")) {
    return { text: `Mi occupo di: ${p.services.join(", ")}.`, action: null };
  }
  if (query.includes("prezzo") || query.includes("costo") || query.includes("tariffa") || query.includes("budget") || query.includes("preventivo")) {
    return { text: p.priceRangeText, action: "OPEN_CTA" };
  }
  if (query.includes("tempo") || query.includes("tempi") || query.includes("quanto ci vuole") || query.includes("consegna")) {
    return { text: p.deliveryTimeText, action: null };
  }
  if (query.includes("tecnolog") || query.includes("stack") || query.includes("linguag")) {
    return { text: `Lo stack principale: ${p.techStack.join(", ")}.`, action: null };
  }
  if (query.includes("contatt") || query.includes("parliamo") || query.includes("call") || query.includes("whatsapp")) {
    return { text: "Perfetto, scegli il canale che preferisci per parlarne.", action: "OPEN_CTA" };
  }

  return {
    text: `Ciao! Sono l'assistente di ${p.name}. Posso rispondere su servizi, tecnologie, tempi e costi indicativi, oppure metterti subito in contatto.`,
    action: "OPEN_CTA",
  };
}

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
