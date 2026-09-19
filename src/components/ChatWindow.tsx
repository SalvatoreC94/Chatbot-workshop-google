import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MapPin, Calendar, Clock, Star, Phone, Navigation, ArrowRight, RefreshCw, MessageSquare, Utensils } from 'lucide-react';
import { ChatMessage, RestaurantVenue } from '../types';
import { RESTAURANT_VENUES, QUICK_SUGGESTIONS } from '../data/businessData';
import { InteractiveMap } from './InteractiveMap';

interface ChatWindowProps {
  onOpenBooking: (venue?: RestaurantVenue) => void;
  onOpenMap: (venue?: RestaurantVenue) => void;
  onOpenFAQ: () => void;
  onOpenDirectory: () => void;
  className?: string;
  externalQuestion?: string | null;
  onClearExternalQuestion?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  onOpenBooking,
  onOpenMap,
  onOpenFAQ,
  onOpenDirectory,
  className = '',
  externalQuestion,
  onClearExternalQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `👋 Ciao! Sono il tuo **Food Advisor Concierge** di Roma.\n\nDimmi cosa hai voglia di mangiare o che tipo di serata stai cercando (es. *carbonara tipica, pizza gourmet, pesce fresco, cena romantica, enoteca a Trastevere o opzioni senza glutine*) e ti consiglierò i locali migliori con la possibilità di **prenotare subito un tavolo**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showCard: 'venues',
      recommendedVenues: [RESTAURANT_VENUES[0], RESTAURANT_VENUES[1], RESTAURANT_VENUES[2]],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle questions passed from external triggers
  useEffect(() => {
    if (externalQuestion && externalQuestion.trim()) {
      handleSendMessage(externalQuestion);
      if (onClearExternalQuestion) {
        onClearExternalQuestion();
      }
    }
  }, [externalQuestion]);

  const handleSendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: trimmed,
          messages: messages.concat(newUserMsg).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Errore di connessione al server');
      }

      const data = await response.json();
      const botMsgId = 'bot-' + Date.now();

      // Find recommended venues from IDs
      let recommendedVenues: RestaurantVenue[] | undefined = undefined;
      if (Array.isArray(data.recommendedVenueIds) && data.recommendedVenueIds.length > 0) {
        recommendedVenues = RESTAURANT_VENUES.filter((v) =>
          data.recommendedVenueIds.includes(v.id)
        );
      }

      // Check if action is show map
      let showCard: 'map' | 'booking' | 'hours' | 'contacts' | 'venues' | 'single_venue' | undefined = undefined;
      if (data.action === 'SHOW_MAP') {
        showCard = 'map';
      } else if (data.action === 'OPEN_BOOKING') {
        showCard = 'booking';
      } else if (recommendedVenues && recommendedVenues.length > 0) {
        showCard = 'venues';
      }

      const newBotMsg: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: data.reply || "Ecco i miei consigli gastronomici per te!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: data.action,
        showCard,
        recommendedVenues,
      };

      setMessages((prev) => [...prev, newBotMsg]);

      // If user specifically requested booking, open modal
      if (data.action === 'OPEN_BOOKING' && data.bookVenueId) {
        const target = RESTAURANT_VENUES.find((v) => v.id === data.bookVenueId);
        setTimeout(() => {
          onOpenBooking(target);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      const botMsgId = 'bot-fb-' + Date.now();
      const lower = trimmed.toLowerCase();
      let matchedVenues = [RESTAURANT_VENUES[0]];
      let text = "Ecco i locali che ti consiglio per la tua richiesta:";

      if (lower.includes('pizza')) {
        matchedVenues = [RESTAURANT_VENUES[2]];
        text = "🍕 Per la pizza ti consiglio **La Fucina d'Oro** nel Rione Monti! Pizze gourmet cotte a legna e birre artigianali.";
      } else if (lower.includes('pesce')) {
        matchedVenues = [RESTAURANT_VENUES[3]];
        text = "🦐 Per il pesce fresco il posto ideale è **Il Molo di Ripetta** a Piazza del Popolo: crudi e pescato tirrenico fresco!";
      } else if (lower.includes('trastevere') || lower.includes('vino')) {
        matchedVenues = [RESTAURANT_VENUES[5]];
        text = "🍷 A Trastevere ti consiglio **Enoteca Del Moro**: oltre 400 etichette e taglieri artigianali nei vicoli storici.";
      } else if (lower.includes('senza glutine') || lower.includes('vegan')) {
        matchedVenues = [RESTAURANT_VENUES[4]];
        text = "🌿 Ti consiglio il **Bistrot Giardino Botanico**: oasi naturale con pasta senza glutine artigianale e piatti vegani deliziosi.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showCard: 'venues',
          recommendedVenues: matchedVenues,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        sender: 'bot',
        text: `Chat riavviata! 👋 Chiedimi un consiglio culinario (es. "Voglio mangiare una carbonara a Trastevere" oppure "Un posto romantico per cena stasera") e ti aiuterò a prenotare il tuo tavolo!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showCard: 'venues',
        recommendedVenues: [RESTAURANT_VENUES[0], RESTAURANT_VENUES[2]],
      },
    ]);
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div id="dining-chatbot-window" className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm">Food Advisor & Concierge Bot</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Advisor
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Consigli su dove mangiare & Prenotazione rapida tavoli
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenDirectory}
            className="p-2 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Tutti i locali"
          >
            <Utensils className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Riavvia conversazione"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40 min-h-[420px] max-h-[540px]">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end animate-in fade-in duration-150'}`}
            >
              {isBot && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[92%] sm:max-w-[85%] space-y-3`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isBot
                      ? 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-tl-xs'
                      : 'bg-indigo-600 text-white shadow-xs rounded-tr-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isBot ? 'text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Embedded Venue Recommendation Cards */}
                {isBot && msg.recommendedVenues && msg.recommendedVenues.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                    {msg.recommendedVenues.map((venue) => (
                      <div
                        key={venue.id}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-2.5"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl p-1 bg-slate-50 rounded-xl border border-slate-100">
                                {venue.imageEmoji}
                              </span>
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{venue.name}</h4>
                                <span className="text-[10px] text-slate-500 block font-medium">
                                  {venue.cuisine} • {venue.neighborhood}
                                </span>
                              </div>
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 shrink-0">
                              <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                              {venue.rating}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                            {venue.tagline}
                          </p>

                          {venue.specialties.length > 0 && (
                            <div className="mt-1.5 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                              <span className="font-semibold text-slate-700">Piatto forte:</span> {venue.specialties[0]}
                            </div>
                          )}
                        </div>

                        {/* Card actions */}
                        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenMap(venue)}
                            className="py-1.5 px-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Navigation className="w-3 h-3 text-indigo-600" />
                            <span>Mappa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenBooking(venue)}
                            className="py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Prenota</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Embedded Map Card */}
                {isBot && msg.showCard === 'map' && (
                  <div className="animate-in fade-in duration-200">
                    <InteractiveMap
                      compact={true}
                      onOpenBooking={onOpenBooking}
                    />
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-400 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px] text-slate-400">Il Food Advisor sta selezionando i locali migliori...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-medium text-slate-400 shrink-0">Chiedi al bot:</span>
        {QUICK_SUGGESTIONS.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(sug.query)}
            className="px-2.5 py-1 text-xs text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200/80 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
          >
            {sug.label}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            id="dining-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chiedimi cosa mangiare (es. 'Dove mangio una carbonara?', 'Pizzeria con dehor', 'Prenota tavolo stasera')..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />

          <button
            type="submit"
            id="dining-chat-send-btn"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              input.trim() && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Chiedi</span>
          </button>
        </form>
      </div>
    </div>
  );
};
