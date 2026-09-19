import React, { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Sparkles, Calendar, MessageCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { FREELANCER_PROFILE, QUICK_SUGGESTIONS } from '../data/leadGenData';

function whatsappUrl(): string {
  const { whatsappNumber, whatsappPrefilledMessage } = FREELANCER_PROFILE;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappPrefilledMessage)}`;
}

export const ChatWindow: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `👋 Ciao! Sono l'assistente di ${FREELANCER_PROFILE.name}.\n\nChiedimi pure di servizi, tecnologie, tempi o costi indicativi, oppure passa direttamente al contatto.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-limit-' + Date.now(),
            sender: 'bot',
            text: data.error || 'Errore di connessione al server, riprova tra poco.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cta: response.status === 429 ? 'both' : null,
          },
        ]);
        return;
      }
      const botMsgId = 'bot-' + Date.now();

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: data.reply || 'Posso aiutarti su servizi, tempi e costi, oppure metterti in contatto.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cta: data.action === 'OPEN_CTA' ? 'both' : null,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-fb-' + Date.now(),
          sender: 'bot',
          text: `Al momento non riesco a rispondere in autonomia, ma puoi contattare direttamente ${FREELANCER_PROFILE.name}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cta: 'both',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
    <div id="lead-chatbot-window" className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/80">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-600 border-2 border-white" title="Online" />
        </div>

        <div className="min-w-0">
          <h2 className="font-bold text-slate-900 text-sm truncate">Assistente di {FREELANCER_PROFILE.name}</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 text-brand-600 shrink-0" />
            {FREELANCER_PROFILE.role}
          </p>
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
                <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[92%] sm:max-w-[85%] space-y-2.5">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isBot
                      ? 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-tl-xs'
                      : 'bg-brand-600 text-white shadow-xs rounded-tr-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <div className={`text-[10px] mt-1.5 text-right ${isBot ? 'text-slate-400' : 'text-brand-200'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isBot && msg.cta && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
                    <a
                      href={FREELANCER_PROFILE.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Prenota una call
                    </a>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Scrivimi su WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-400 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px] text-slate-400">Sto scrivendo...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-medium text-slate-400 shrink-0">Chiedi:</span>
        {QUICK_SUGGESTIONS.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(sug.query)}
            className="px-2.5 py-1 text-xs text-slate-600 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 border border-slate-200/80 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi una domanda..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              input.trim() && !isLoading
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Invia</span>
          </button>
        </form>
      </div>
    </div>
  );
};
