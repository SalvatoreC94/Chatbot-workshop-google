import React from 'react';
import { X, Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Utensils, Heart, Wifi, Car, CreditCard, Navigation } from 'lucide-react';
import { BUSINESS_INFO, getBusinessStatus } from '../data/businessData';

interface BusinessDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMap: () => void;
  onOpenBooking: () => void;
}

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  isOpen,
  onClose,
  onOpenMap,
  onOpenBooking,
}) => {
  if (!isOpen) return null;

  const status = getBusinessStatus();
  const todayIndex = new Date().getDay();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'Heart':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Wifi':
        return <Wifi className="w-4 h-4 text-blue-500" />;
      case 'Car':
        return <Car className="w-4 h-4 text-indigo-500" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        id="business-details-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold mb-1.5 bg-white border-slate-200 text-slate-700">
              {BUSINESS_INFO.category}
            </div>
            <h2 className="font-bold text-slate-900 text-lg sm:text-xl">{BUSINESS_INFO.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{BUSINESS_INFO.tagline}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${status.badgeColor}`}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <div>
                <span className="font-bold block">{status.statusText}</span>
                <span className="text-[11px] opacity-80">{status.nextEventText}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="px-3 py-1.5 rounded-lg font-semibold bg-white text-slate-900 shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors text-xs cursor-pointer"
            >
              Prenota ora
            </button>
          </div>

          {/* Direct Contacts Grid */}
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-2.5">
              Contatti Diretti
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Telefono */}
              <a
                href={`tel:${BUSINESS_INFO.contacts.phone}`}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Telefono Chiamata Diretta</span>
                  <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{BUSINESS_INFO.contacts.phoneDisplay}</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${BUSINESS_INFO.contacts.whatsapp}?text=${encodeURIComponent("Salve, vorrei alcune informazioni su Osteria Bella Vista.")}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">WhatsApp Messaggi</span>
                  <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{BUSINESS_INFO.contacts.whatsappDisplay}</span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${BUSINESS_INFO.contacts.email}`}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Email Prenotazioni</span>
                  <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate block">{BUSINESS_INFO.contacts.email}</span>
                </div>
              </a>

              {/* Indirizzo & Mappa */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMap();
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition-all flex items-center gap-3 text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Posizione & Google Maps</span>
                  <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors block">{BUSINESS_INFO.contacts.address}, Roma</span>
                </div>
              </button>
            </div>
          </div>

          {/* Weekly Hours Table */}
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-2.5">
              Orari di Apertura Settimanali
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {BUSINESS_INFO.weeklyHours.map((h) => {
                const isToday = h.dayIndex === todayIndex;
                return (
                  <div
                    key={h.day}
                    className={`p-2.5 sm:px-3.5 flex items-center justify-between ${
                      isToday ? 'bg-indigo-50/60 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isToday ? 'text-indigo-700' : 'text-slate-800'}>{h.day}</span>
                      {isToday && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-indigo-600 text-white text-[10px] font-bold">
                          Oggi
                        </span>
                      )}
                    </div>
                    <div>
                      {h.isOpen ? (
                        <div className="text-right">
                          <span className="text-slate-700">Pranzo: {h.lunch}</span>
                          <span className="mx-1 text-slate-300">•</span>
                          <span className="text-slate-700">Cena: {h.dinner}</span>
                        </div>
                      ) : (
                        <span className="text-rose-500 font-medium">Chiuso (Riposo)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-2.5">
              Servizi & Dotazioni
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_INFO.services.map((srv) => (
                <div key={srv.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-2 text-xs">
                  <span className="mt-0.5">{getServiceIcon(srv.iconName)}</span>
                  <div>
                    <span className="font-semibold text-slate-800 block">{srv.name}</span>
                    <span className="text-[10px] text-slate-400">{srv.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Chiudi
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMap();
              }}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              Mappa & Indicazioni
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Prenota Tavolo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
