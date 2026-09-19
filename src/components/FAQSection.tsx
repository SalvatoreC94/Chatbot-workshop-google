import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, MessageSquare, HelpCircle, MapPin, Clock, Calendar, UtensilsCrossed, ShieldCheck, Sparkles } from 'lucide-react';
import { FAQ_LIST } from '../data/businessData';
import { FAQItem } from '../types';

interface FAQSectionProps {
  onAskChatbot: (questionText: string) => void;
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onAskChatbot, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    FAQ_LIST.forEach((item) => cats.add(item.category));
    return ['Tutte', ...Array.from(cats)];
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((item) => {
      const matchesCategory = selectedCategory === 'Tutte' || item.category === selectedCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Posizione & Parcheggio':
        return <MapPin className="w-3.5 h-3.5 text-blue-500" />;
      case 'Orari & Servizi':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'Prenotazioni':
        return <Calendar className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Menu & Esigenze Alimentari':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div id="faq-automated-section" className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">FAQ Automatizzate</h2>
              <p className="text-xs text-slate-500">Risposte immediate alle domande più frequenti</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {filteredFaqs.length} risposte
          </span>
        </div>

        {/* Search bar */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="faq-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca una risposta (es. orari, celiaci, parcheggio, cani)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion list */}
      <div className="p-4 divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm text-slate-500 font-medium">Nessuna FAQ trovata per la tua ricerca.</p>
            <p className="text-xs text-slate-400">Prova a digitare parole diverse o chiedi direttamente al nostro chatbot.</p>
            <button
              type="button"
              onClick={() => onAskChatbot(searchTerm)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Chiedi "{searchTerm}" all'Assistente AI
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq: FAQItem) => {
            const isOpen = expandedId === faq.id;
            return (
              <div key={faq.id} className="py-3 group">
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left flex items-start justify-between gap-3 focus:outline-hidden cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0">{getCategoryIcon(faq.category)}</span>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors block">
                        {faq.question}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{faq.category}</span>
                    </div>
                  </div>

                  <div className={`p-1 rounded-md text-slate-400 group-hover:text-slate-700 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-2.5 ml-6 pl-2 border-l-2 border-indigo-100 text-xs text-slate-600 space-y-2.5 animate-in fade-in duration-150">
                    <p className="leading-relaxed text-slate-700">{faq.answer}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Informazione verificata</span>
                      <button
                        type="button"
                        onClick={() => onAskChatbot(faq.question)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Approfondisci in Chat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer prompt */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Non trovi quello che cerchi?</span>
        <button
          type="button"
          onClick={() => onAskChatbot("Vorrei fare una domanda specifica sull'attività")}
          className="font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Scrivi all'assistente AI
        </button>
      </div>
    </div>
  );
};
