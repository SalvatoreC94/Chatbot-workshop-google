export interface DayHours {
  day: string;
  dayIndex: number; // 0 = Sunday, 1 = Monday, ...
  isOpen: boolean;
  lunch: string | null;
  dinner: string | null;
  note?: string;
}

export interface BusinessContact {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  pec?: string;
  instagram: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  lat: number;
  lng: number;
  mapsUrl: string;
}

export interface BusinessService {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface RestaurantVenue {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cuisine: string;
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  averagePrice: string; // es. "25-35€ a persona"
  rating: number;
  reviewsCount: number;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  specialties: string[];
  features: string[];
  imageEmoji: string;
  accentColor: string;
  openingHoursSummary: string;
  isPopular?: boolean;
}

export interface BusinessData {
  name: string;
  category: string;
  tagline: string;
  description: string;
  contacts: BusinessContact;
  weeklyHours: DayHours[];
  services: BusinessService[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: 'SHOW_MAP' | 'OPEN_BOOKING' | 'SHOW_CONTACTS' | 'SHOW_HOURS' | 'RECOMMEND_VENUES' | 'SHOW_VENUE';
  showCard?: 'map' | 'booking' | 'hours' | 'contacts' | 'venues' | 'single_venue';
  recommendedVenues?: RestaurantVenue[];
  selectedVenue?: RestaurantVenue;
}

export interface Booking {
  id: string;
  code: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: 'indoor' | 'outdoor' | 'private_room' | 'no_preference';
  notes: string;
  status: 'confermata' | 'in_attesa' | 'annullata';
  createdAt: string;
}

export interface FAQItem {
  id: string;
  category: 'Posizione & Parcheggio' | 'Orari & Servizi' | 'Prenotazioni' | 'Menu & Esigenze Alimentari' | 'Pagamenti & Animali' | 'Consigli & Guida Locali';
  question: string;
  answer: string;
  icon: string;
}
