import { BusinessData, FAQItem, RestaurantVenue } from '../types';

export const RESTAURANT_VENUES: RestaurantVenue[] = [
  {
    id: 'osteria-bella-vista',
    name: 'Osteria & Bottega Bella Vista',
    tagline: 'Cucina romana autentica e dehor nel cuore del rione Ponte',
    description: 'Trattoria accogliente a due passi da Piazza Navona. Celebre per i primi della tradizione romana mantecati a regola d\'arte e materie prime laziali certificate a km zero.',
    cuisine: 'Romana Tradizionale',
    priceRange: '€€',
    averagePrice: '30 - 40€ a persona',
    rating: 4.9,
    reviewsCount: 428,
    neighborhood: 'Piazza Navona / Centro Storico',
    address: 'Via dei Coronari 48, 00186 Roma (RM)',
    lat: 41.9008,
    lng: 12.4705,
    phone: '+390668801234',
    phoneDisplay: '+39 06 6880 1234',
    whatsapp: '393456789012',
    specialties: [
      'Carbonara cremosa con guanciale croccante di Amatrice',
      'Cacio e Pepe servita in cialda di parmigiano',
      'Abbacchio alla scottadito con carciofo alla romana'
    ],
    features: ['Dehor all\'aperto', 'Opzioni Senza Glutine', 'Pet Friendly', 'Parcheggio convenzionato a 150m'],
    imageEmoji: '🍝',
    accentColor: 'indigo',
    openingHoursSummary: 'Mar - Dom: 12:00-15:00 e 19:00-23:30 (Lun chiuso)',
    isPopular: true,
  },
  {
    id: 'trattoria-da-cesare',
    name: 'Trattoria Casaletto & Tradizione',
    tagline: 'Osteria di quartiere, fritti leggendari e atmosfera verace',
    description: 'Un tempio della convivialità romana premiato per i suoi fritti leggeri, la trippa alla romana e un pergolato esterno perfetto per cene estive o pranzi in famiglia.',
    cuisine: 'Romana Rustica & Fritti',
    priceRange: '€€',
    averagePrice: '28 - 36€ a persona',
    rating: 4.8,
    reviewsCount: 612,
    neighborhood: 'Trastevere / Gianicolo',
    address: 'Via del Casaletto 45, 00151 Roma (RM)',
    lat: 41.8712,
    lng: 12.4491,
    phone: '+3906536015',
    phoneDisplay: '+39 06 536 0150',
    whatsapp: '393471122334',
    specialties: [
      'Polpette di bollito fritte con salsa verde e giardiniera',
      'Bucatini all\'Amatriciana con pecorino romano DOP',
      'Gnocchi al ragù di coda alla vaccinara'
    ],
    features: ['Giardino pergolato', 'Vini Naturali', 'Ampio parcheggio facile', 'Climatizzato'],
    imageEmoji: '🍷',
    accentColor: 'rose',
    openingHoursSummary: 'Tutti i giorni: 12:30-15:00 e 19:30-23:30 (Mercoledì chiuso)',
    isPopular: true,
  },
  {
    id: 'fucina-doro-pizza',
    name: 'La Fucina d\'Oro - Pizzeria Gourmet',
    tagline: 'Impasti lievitati 48h con farine macinate a pietra e ingredienti DOP',
    description: 'Pizzeria contemporanea nel suggestivo Rione Monti. Pizze tonde e alla pala con cornicione a canotto, abbinate a birre artigianali da microbirrifici italiani.',
    cuisine: 'Pizza Gourmet & Birre Artigianali',
    priceRange: '€',
    averagePrice: '18 - 26€ a persona',
    rating: 4.9,
    reviewsCount: 540,
    neighborhood: 'Rione Monti / Colosseo',
    address: 'Via Urbana 112, 00184 Roma (RM)',
    lat: 41.8955,
    lng: 12.4930,
    phone: '+39064882390',
    phoneDisplay: '+39 06 488 2390',
    whatsapp: '393489988776',
    specialties: [
      'Pizza \'Gricia e Carciofi Croccanti\'',
      'Margherita con Bufala Campana DOP a crudo e basilico fresco',
      'Tris di supplì classici al telefono e cacio & pepe'
    ],
    features: ['Forno a Legna', '12 Birre alla spina artigianali', 'Impasti speciali senza lieviti chimici', 'Take-away'],
    imageEmoji: '🍕',
    accentColor: 'amber',
    openingHoursSummary: 'Lun - Dom: 19:00 - 00:00 (Sab e Dom anche a pranzo 12:30-15:00)',
    isPopular: true,
  },
  {
    id: 'molo-ripetta-pesce',
    name: 'Il Molo di Ripetta - Pescheria & Cucina',
    tagline: 'Pescato fresco dell\'arcipelago tirrenico e crudi raffinati',
    description: 'Locale elegante vicino a Piazza del Popolo. Il banco del pesce a vista permette di scegliere direttamente il pescato del giorno cucinato al sale, all\'acqua pazza o alla griglia.',
    cuisine: 'Pesce Fresco & Cruditè',
    priceRange: '€€€',
    averagePrice: '48 - 65€ a persona',
    rating: 4.8,
    reviewsCount: 310,
    neighborhood: 'Piazza del Popolo / Spagna',
    address: 'Via di Ripetta 73, 00186 Roma (RM)',
    lat: 41.9080,
    lng: 12.4720,
    phone: '+39063221940',
    phoneDisplay: '+39 06 322 1940',
    whatsapp: '393405566778',
    specialties: [
      'Gran crudo di mare: scampi di Ponza, tartare di tonno e gamberi rossi',
      'Spaghettoni alle vongole veraci, lime e polvere di bottarga',
      'Frittura mista di paranza dorata e croccante'
    ],
    features: ['Atmosfera Romantica', 'Tavoli all\'aperto riscaldati', 'Carta Champagne e Bollicine', 'Sommelier'],
    imageEmoji: '🦐',
    accentColor: 'cyan',
    openingHoursSummary: 'Mar - Dom: 12:30-15:00 e 19:30-23:30 (Lunedì chiuso)',
    isPopular: false,
  },
  {
    id: 'giardino-botanico-bistrot',
    name: 'Bistrot Giardino Botanico & Green',
    tagline: 'Cucina biologica a filiera corta, piatti vegetariani e gluten-free',
    description: 'Un\'oasi verde rilassante a Campo de\' Fiori. Menù ricercato con opzioni 100% vegetariane, vegane e senza glutine certificato, circondati da piante rigogliose e luci soffuse.',
    cuisine: 'Bistrot Naturale & Senza Glutine',
    priceRange: '€€',
    averagePrice: '28 - 38€ a persona',
    rating: 4.7,
    reviewsCount: 285,
    neighborhood: 'Campo de\' Fiori',
    address: 'Piazza del Biscione 95, 00186 Roma (RM)',
    lat: 41.8952,
    lng: 12.4718,
    phone: '+39066874512',
    phoneDisplay: '+39 06 687 4512',
    whatsapp: '393332211445',
    specialties: [
      'Risotto mantecato ai funghi cardoncelli, timo selvatico e crema di castagne',
      'Ravioli artigianali ripieni di melanzane affumicate e stracciatella (anche senza glutine)',
      'Cheesecake vegana con purea di mango e crumble di mandorle'
    ],
    features: ['100% Gluten-Free Friendly', 'Opzioni Vegane e Senza Lattosio', 'Cocktail Botanici', 'Wi-Fi veloce'],
    imageEmoji: '🌿',
    accentColor: 'emerald',
    openingHoursSummary: 'Mer - Lun: 11:30 - 23:30 (Martedì chiuso)',
    isPopular: false,
  },
  {
    id: 'enoteca-del-moro',
    name: 'Enoteca & Cucina Del Moro',
    tagline: 'Vini pregiati, formaggi affinati e salumi artigianali a Trastevere',
    description: 'Caratteristica enoteca nei pittoreschi vicoli di Trastevere con oltre 450 etichette italiane e internazionali, accompagnate da caldi taglieri di norcineria e primi piatti espressi.',
    cuisine: 'Enoteca & Taglieri Gourmet',
    priceRange: '€€',
    averagePrice: '24 - 34€ a persona',
    rating: 4.9,
    reviewsCount: 390,
    neighborhood: 'Trastevere',
    address: 'Vicolo del Cinque 22, 00153 Roma (RM)',
    lat: 41.8899,
    lng: 12.4695,
    phone: '+39065809165',
    phoneDisplay: '+39 06 580 9165',
    whatsapp: '393398877665',
    specialties: [
      'Tagliere degustazione di Cinta Senese e pecorini stagionati in grotta',
      'Battuta di Fassona al coltello con scaglie di tartufo nero',
      'Tiramisù espresso al caffè moka con savoiardi artigianali'
    ],
    features: ['Oltre 450 etichette di vino', 'Tavolini all\'aperto nel vicolo', 'Degustazioni guidate', 'Musica di sottofondo'],
    imageEmoji: '🧀',
    accentColor: 'purple',
    openingHoursSummary: 'Tutti i giorni: 17:30 - 01:00 (Sab e Dom anche pranzo dalle 12:30)',
    isPopular: true,
  }
];

// Reference primary business for backward compatibility
export const BUSINESS_INFO: BusinessData = {
  name: "Osteria & Bottega Bella Vista",
  category: "Trattoria & Bottega Enogastronomica",
  tagline: "Cucina romana tradizionale, sapori autentici e dehor nel cuore di Roma",
  description: "Una calda osteria nel centro storico di Roma dove assaporare le migliori ricette della tradizione italiana e romana, preparate con ingredienti freschi selezionati e presidi Slow Food.",
  contacts: {
    phone: "+390668801234",
    phoneDisplay: "+39 06 6880 1234",
    whatsapp: "393456789012",
    whatsappDisplay: "+39 345 678 9012",
    email: "prenotazioni@osteriabellavista.it",
    pec: "osteriabellavista@pec.it",
    instagram: "@osteriabellavista_roma",
    address: "Via dei Coronari, 48",
    postalCode: "00186",
    city: "Roma",
    province: "RM",
    country: "Italia",
    lat: 41.9008,
    lng: 12.4705,
    mapsUrl: "https://maps.google.com/?q=Via+dei+Coronari+48+Roma",
  },
  weeklyHours: [
    { day: "Lunedì", dayIndex: 1, isOpen: false, lunch: null, dinner: null, note: "Chiuso per riposo settimanale" },
    { day: "Martedì", dayIndex: 2, isOpen: true, lunch: "12:00 - 15:00", dinner: "19:00 - 23:30" },
    { day: "Mercoledì", dayIndex: 3, isOpen: true, lunch: "12:00 - 15:00", dinner: "19:00 - 23:30" },
    { day: "Giovedì", dayIndex: 4, isOpen: true, lunch: "12:00 - 15:00", dinner: "19:00 - 23:30" },
    { day: "Venerdì", dayIndex: 5, isOpen: true, lunch: "12:00 - 15:00", dinner: "19:00 - 23:30" },
    { day: "Sabato", dayIndex: 6, isOpen: true, lunch: "12:00 - 15:30", dinner: "19:00 - 00:00" },
    { day: "Domenica", dayIndex: 0, isOpen: true, lunch: "12:00 - 16:00", dinner: "19:30 - 23:00" },
  ],
  services: [
    { id: "s1", name: "Dehor all'Aperto", description: "Tavoli all'aperto nella suggestiva cornice di Via dei Coronari", iconName: "Utensils" },
    { id: "s2", name: "Opzioni Senza Glutine", description: "Pasta artigianale e pane per celiaci preparati separatamente", iconName: "ShieldCheck" },
    { id: "s3", name: "Pet Friendly", description: "I tuoi amici a quattro zampe sono sempre i benvenuti", iconName: "Heart" },
    { id: "s4", name: "Wi-Fi Gratuito", description: "Connessione in fibra ottica ad alta velocità per tutti gli ospiti", iconName: "Wifi" },
    { id: "s5", name: "Parcheggio Convenzionato", description: "Garage Navona a soli 150m con sconto dedicato ai clienti", iconName: "Car" },
    { id: "s6", name: "Tutti i Pagamenti", description: "Accettiamo contanti, bancomat, carte di credito, Apple Pay e Satispay", iconName: "CreditCard" },
  ]
};

export const QUICK_SUGGESTIONS = [
  { label: "🍝 Trattoria romana tipica", query: "Consigliami una trattoria tipica per mangiare una vera carbonara" },
  { label: "🍕 Voglia di pizza", query: "Qual è la migliore pizzeria nei paraggi?" },
  { label: "🦐 Ristorante di pesce", query: "Cerco un ristorante con ottimo pesce fresco stasera" },
  { label: "🍷 Enoteca & aperitivo", query: "Dove posso andare per un aperitivo con buon vino e tagliere?" },
  { label: "🌿 Senza glutine / Veg", query: "Ci sono locali con opzioni certificate senza glutine o vegane?" },
  { label: "📍 Mostrami tutti i locali", query: "Mostrami tutti i locali disponibili sulla mappa di Roma" },
];

export const FAQ_LIST: FAQItem[] = [
  {
    id: "faq-0",
    category: "Consigli & Guida Locali",
    question: "Come funziona questo bot per consigliarmi dove andare a mangiare?",
    answer: "Puoi chiedere al bot in modo naturale cosa desideri: il tipo di cucina (romana, pesce, pizza, vegetariana), l'occasione (cena romantica, pranzo veloce, aperitivo tra amici), il quartiere di Roma o esigenze alimentari (es. senza glutine). Il bot ti consiglierà i locali più adatti con dettagli, posizione su Google Maps e ti permetterà di prenotare subito il tuo tavolo!",
    icon: "Sparkles",
  },
  {
    id: "faq-1",
    category: "Prenotazioni",
    question: "Come posso prenotare un tavolo nei locali consigliati?",
    answer: "Puoi prenotare direttamente in chat chiedendolo al bot, oppure cliccando sul pulsante 'Prenota Tavolo' presente su ogni scheda locale. Ti basterà indicare la data, l'orario e il numero di persone: riceverai la conferma immediata con codice di prenotazione e potrai scaricare il promemoria nel calendario o confermarlo su WhatsApp.",
    icon: "Calendar",
  },
  {
    id: "faq-2",
    category: "Posizione & Parcheggio",
    question: "Dove si trovano i locali e come arrivarci?",
    answer: "Tutti i locali si trovano nel centro di Roma (Piazza Navona, Trastevere, Rione Monti, Campo de' Fiori, Piazza del Popolo). Puoi visualizzare tutti i locali geolocalizzati sulla mappa Google Maps integrata e cliccare su 'Indicazioni' per ottenere il percorso pedonale, con i mezzi o in auto.",
    icon: "MapPin",
  },
  {
    id: "faq-3",
    category: "Menu & Esigenze Alimentari",
    question: "Ci sono opzioni senza glutine per celiaci o per vegetariani e vegani?",
    answer: "Sì! Sia Osteria Bella Vista che Bistrot Giardino Botanico offrono menu dedicati e pane/pasta senza glutine. Puoi filtrare i locali o chiedere direttamente al bot 'Consigliami un locale senza glutine' per visualizzare opzioni garantite.",
    icon: "UtensilsCrossed",
  },
  {
    id: "faq-4",
    category: "Orari & Servizi",
    question: "Quali sono gli orari medi di pranzo e cena dei locali?",
    answer: "La maggior parte delle osterie e ristoranti è aperta a pranzo dalle 12:00 alle 15:00 e a cena dalle 19:00 alle 23:30/00:00. Pizzerie ed enoteche aprono solitamente per aperitivo e cena dalle 17:30 alle 00:00 o 01:00.",
    icon: "Clock",
  },
  {
    id: "faq-5",
    category: "Pagamenti & Animali",
    question: "Gli animali domestici sono ammessi e quali metodi di pagamento accettate?",
    answer: "I cani sono i benvenuti in quasi tutti i locali (specialmente nelle aree con dehor all'aperto). Tutti i ristoranti accettano bancomat, carte di credito dei principali circuiti, Apple Pay e Google Pay.",
    icon: "ShieldCheck",
  },
];

export function getBusinessStatus(): { isOpen: boolean; statusText: string; nextEventText: string; badgeColor: string } {
  const now = new Date();
  const dayIndex = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  if (dayIndex === 1) {
    return {
      isOpen: false,
      statusText: "Chiuso (Riposo)",
      nextEventText: "Riapre martedì alle 12:00",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }

  const lunchStart = 12 * 60;
  const lunchEnd = 15 * 60;
  const dinnerStart = 19 * 60;
  const dinnerEnd = 23 * 60 + 30;

  if (currentMinutes >= lunchStart && currentMinutes <= lunchEnd) {
    return {
      isOpen: true,
      statusText: "Aperto ora (Pranzo)",
      nextEventText: "Chiusura pranzo alle 15:00",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (currentMinutes >= dinnerStart && currentMinutes <= dinnerEnd) {
    return {
      isOpen: true,
      statusText: "Aperto ora (Cena)",
      nextEventText: "Cucina aperta fino alle 23:30",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (currentMinutes < lunchStart) {
    return {
      isOpen: false,
      statusText: "Chiuso al momento",
      nextEventText: "Apre oggi a pranzo alle 12:00",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  if (currentMinutes > lunchEnd && currentMinutes < dinnerStart) {
    return {
      isOpen: false,
      statusText: "Pausa pomeridiana",
      nextEventText: "Riapre stasera alle 19:00",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  return {
    isOpen: false,
    statusText: "Chiuso per la notte",
    nextEventText: "Apre domani alle 12:00",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  };
}
