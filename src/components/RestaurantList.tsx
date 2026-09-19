import React, { useState, useMemo } from 'react';
import { Search, Star, MapPin, Calendar, Navigation, Phone, Sparkles, Utensils, ShieldCheck, Heart, MessageSquare } from 'lucide-react';
import { RESTAURANT_VENUES } from '../data/businessData';
import { RestaurantVenue } from '../types';

interface RestaurantListProps {
  onSelectVenueOnMap: (venue: RestaurantVenue) => void;
  onOpenBooking: (venue: RestaurantVenue) => void;
  onAskChatbotAboutVenue: (venue: RestaurantVenue) => void;
  className?: string;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  onSelectVenueOnMap,
  onOpenBooking,
  onAskChatbotAboutVenue,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('Tutte');
  const [selectedPrice, setSelectedPrice] = useState<string>('Tutti');

  const filteredVenues = useMemo(() => {
    return RESTAURANT_VENUES.filter((v) => {
      // Search
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        v.name.toLowerCase().includes(term) ||
        v.neighborhood.toLowerCase().includes(term) ||
        v.cuisine.toLowerCase().includes(term) ||
        v.specialties.some((s) => s.toLowerCase().includes(term));

      // Cuisine
      const matchesCuisine =
        selectedCuisine === 'Tutte' ||
        (selectedCuisine === 'Romana' && v.cuisine.includes('Romana')) ||
        (selectedCuisine === 'Pizza' && v.cuisine.includes('Pizza')) ||
        (selectedCuisine === 'Pesce' && v.cuisine.includes('Pesce')) ||
        (selectedCuisine === 'Senza Glutine' && v.features.some((f) => f.includes('Senza Glutine'))) ||
        (selectedCuisine === 'Enoteca' && v.cuisine.includes('Enoteca'));

      // Price
      const matchesPrice = selectedPrice === 'Tutti' || v.priceRange === selectedPrice;

      return matchesSearch && matchesCuisine && matchesPrice;
    });
  }, [searchTerm, selectedCuisine, selectedPrice]);

  return (
    <div id="restaurant-directory-section" className={`space-y-6 ${className}`}>
      {/* Search and Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">Locali e Ristoranti Selezionati</h2>
            <p className="text-xs text-slate-500">
              Esplora i migliori ristoranti per cucina, quartiere e atmosfera con prenotazione immediata.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 self-start sm:self-auto">
            {filteredVenues.length} di {RESTAURANT_VENUES.length} disponibili
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="venue-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca per nome, piatto (es. carbonara, pizza, fritto), o quartiere (es. Monti, Trastevere)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category & Price Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Cucina:</span>
            {['Tutte', 'Romana', 'Pizza', 'Pesce', 'Senza Glutine', 'Enoteca'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCuisine(c)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCuisine === c
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Prezzo:</span>
            {['Tutti', '€', '€€', '€€€'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPrice(p)}
                className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedPrice === p
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  {venue.imageEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                      {venue.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{venue.neighborhood}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 mr-1" />
                  {venue.rating}
                </div>
                <span className="block text-[10px] text-slate-400 mt-0.5 font-semibold">
                  {venue.priceRange} ({venue.averagePrice})
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
              <div className="space-y-3">
                <p className="text-slate-600 leading-relaxed line-clamp-2">
                  {venue.description}
                </p>

                {/* Specialties */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Specialità della casa:
                  </span>
                  <ul className="space-y-1">
                    {venue.specialties.map((spec, i) => (
                      <li key={i} className="text-slate-700 flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span className="line-clamp-1">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {venue.features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectVenueOnMap(venue)}
                  className="py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mappa</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenBooking(venue)}
                  className="py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Prenota</span>
                </button>
              </div>
            </div>

            {/* Quick Bot Consultation link */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">{venue.openingHoursSummary}</span>
              <button
                type="button"
                onClick={() => onAskChatbotAboutVenue(venue)}
                className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Chiedi al bot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
