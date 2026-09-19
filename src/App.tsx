import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { RestaurantList } from './components/RestaurantList';
import { InteractiveMap } from './components/InteractiveMap';
import { FAQSection } from './components/FAQSection';
import { BookingModal } from './components/BookingModal';
import { RESTAURANT_VENUES } from './data/businessData';
import { RestaurantVenue } from './types';
import { MapPin, Calendar, Utensils, Sparkles, Star, Navigation, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'venues' | 'map' | 'faq'>('chat');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedVenueForBooking, setSelectedVenueForBooking] = useState<RestaurantVenue | null>(null);
  const [selectedVenueForMap, setSelectedVenueForMap] = useState<RestaurantVenue | null>(null);
  const [externalQuestion, setExternalQuestion] = useState<string | null>(null);

  const handleOpenBooking = (venue?: RestaurantVenue) => {
    setSelectedVenueForBooking(venue || RESTAURANT_VENUES[0]);
    setIsBookingOpen(true);
  };

  const handleSelectVenueOnMap = (venue?: RestaurantVenue) => {
    if (venue) {
      setSelectedVenueForMap(venue);
    }
    setActiveTab('map');
  };

  const handleAskChatbotAboutVenue = (venue: RestaurantVenue) => {
    setExternalQuestion(`Parlami del ristorante "${venue.name}" a ${venue.neighborhood}: quali sono le sue specialità e perché me lo consigli?`);
    setActiveTab('chat');
  };

  const handleAskChatbotFromFAQ = (questionText: string) => {
    setExternalQuestion(questionText);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Quick Advisor Banner */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  Dove Mangiare a Roma: Guida & Prenotazioni
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {RESTAURANT_VENUES.length} Ristoranti Selezionati
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chiedi consiglio all'assistente AI, trova il locale ideale su Google Maps e prenota il tuo tavolo in un click.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('venues')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Esplora Locali</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenBooking()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Prenota Subito</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CHATBOT ADVISOR */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Chat Column */}
            <div className="lg:col-span-8 space-y-4">
              <ChatWindow
                onOpenBooking={handleOpenBooking}
                onOpenMap={handleSelectVenueOnMap}
                onOpenFAQ={() => setActiveTab('faq')}
                onOpenDirectory={() => setActiveTab('venues')}
                externalQuestion={externalQuestion}
                onClearExternalQuestion={() => setExternalQuestion(null)}
              />
            </div>

            {/* Sidebar with Map snapshot & quick recommendations */}
            <div className="lg:col-span-4 space-y-4">
              {/* Google Maps snapshot */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Locali su Google Maps
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('map')}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Espandi mappa
                  </button>
                </div>

                <InteractiveMap
                  compact={true}
                  onSelectVenue={(v) => setSelectedVenueForMap(v)}
                  onOpenBooking={(v) => handleOpenBooking(v)}
                />
              </div>

              {/* Quick Venue Showcase */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Locali in Evidenza</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('venues')}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Vedi tutti ({RESTAURANT_VENUES.length})
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {RESTAURANT_VENUES.slice(0, 3).map((v) => (
                    <div
                      key={v.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50/40 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xl shrink-0">{v.imageEmoji}</span>
                        <div className="overflow-hidden">
                          <span className="font-bold text-slate-900 block truncate">{v.name}</span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {v.cuisine} • {v.neighborhood}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenBooking(v)}
                        className="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 shrink-0 cursor-pointer"
                      >
                        Prenota
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TUTTI I LOCALI (DIRECTORY) */}
        {activeTab === 'venues' && (
          <RestaurantList
            onSelectVenueOnMap={handleSelectVenueOnMap}
            onOpenBooking={handleOpenBooking}
            onAskChatbotAboutVenue={handleAskChatbotAboutVenue}
          />
        )}

        {/* TAB 3: GOOGLE MAPS MULTI-VENUE */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Mappa Ristoranti su Google Maps</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualizza la posizione esatta di tutti i locali a Roma, calcola le indicazioni stradali e prenota direttamente.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className="px-3.5 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                >
                  Chiedi consiglio al Bot
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenBooking(selectedVenueForMap || undefined)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Prenota Tavolo
                </button>
              </div>
            </div>

            <InteractiveMap
              compact={false}
              selectedVenueId={selectedVenueForMap?.id}
              onSelectVenue={(v) => setSelectedVenueForMap(v)}
              onOpenBooking={(v) => handleOpenBooking(v)}
            />
          </div>
        )}

        {/* TAB 4: FAQ AUTOMATIZZATE */}
        {activeTab === 'faq' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">FAQ & Guida alle Prenotazioni</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Risposte chiare su come funziona il bot consiglia-ristoranti, prenotazioni, menu e posizioni.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className="px-3.5 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
              >
                Apri la Chat
              </button>
            </div>

            <FAQSection onAskChatbot={handleAskChatbotFromFAQ} />
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        selectedVenue={selectedVenueForBooking}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Food Advisor & Concierge Bot</span>
            <span>•</span>
            <span>{RESTAURANT_VENUES.length} Ristoranti selezionati a Roma</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Chatbot
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('venues')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Elenco Locali
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Google Maps
            </button>
            <button
              type="button"
              onClick={() => handleOpenBooking()}
              className="text-indigo-600 font-semibold cursor-pointer"
            >
              Prenota Rapida
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
