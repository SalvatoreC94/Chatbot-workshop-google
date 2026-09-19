import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, Sparkles, MapPin, Phone, MessageSquare, Download, Trash2, Utensils } from 'lucide-react';
import { Booking, RestaurantVenue } from '../types';
import { RESTAURANT_VENUES } from '../data/businessData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVenue?: RestaurantVenue | null;
  initialDate?: string;
  initialGuests?: number;
  onBookingConfirmed?: (booking: Booking) => void;
}

const STORAGE_KEY = 'dining_concierge_bookings';

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedVenue = null,
  initialDate,
  initialGuests = 2,
  onBookingConfirmed,
}) => {
  const [step, setStep] = useState<'form' | 'success' | 'list'>('form');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Selected restaurant state
  const [targetVenueId, setTargetVenueId] = useState<string>(
    selectedVenue?.id || RESTAURANT_VENUES[0].id
  );

  const activeVenue = RESTAURANT_VENUES.find((v) => v.id === targetVenueId) || RESTAURANT_VENUES[0];

  // Form state
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialDate || todayStr);
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(initialGuests);
  const [seatingPreference, setSeatingPreference] = useState<'indoor' | 'outdoor' | 'private_room' | 'no_preference'>('no_preference');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync when selectedVenue prop changes
  useEffect(() => {
    if (selectedVenue) {
      setTargetVenueId(selectedVenue.id);
      setStep('form');
    }
  }, [selectedVenue, isOpen]);

  // Load existing bookings from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBookings(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const timeSlots = [
    { label: '12:30 (Pranzo)', val: '12:30' },
    { label: '13:00 (Pranzo)', val: '13:00' },
    { label: '13:30 (Pranzo)', val: '13:30' },
    { label: '14:00 (Pranzo)', val: '14:00' },
    { label: '19:30 (Cena)', val: '19:30' },
    { label: '20:00 (Cena)', val: '20:00' },
    { label: '20:30 (Cena)', val: '20:30' },
    { label: '21:00 (Cena)', val: '21:00' },
    { label: '21:30 (Cena)', val: '21:30' },
    { label: '22:00 (Cena)', val: '22:00' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Inserisci il tuo nome e cognome.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Inserisci un recapito telefonico per la conferma.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      code: `RSV-${randomNum}`,
      restaurantId: activeVenue.id,
      restaurantName: activeVenue.name,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date,
      time,
      guests,
      seatingPreference,
      notes: notes.trim(),
      status: 'confermata',
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setCurrentBooking(newBooking);
    setStep('success');
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Generate .ics calendar download
  const downloadCalendarFile = (b: Booking) => {
    const [year, month, day] = b.date.split('-').map(Number);
    const [hours, minutes] = b.time.split(':').map(Number);

    const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatICSDate = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Food Advisor Bot//Prenotazioni//IT',
      'BEGIN:VEVENT',
      `UID:${b.id}@diningbot.it`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:Tavolo da ${b.restaurantName} (${b.guests} persone)`,
      `DESCRIPTION:Prenotazione confermata #${b.code} a nome ${b.name}.`,
      `LOCATION:${activeVenue.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `prenotazione-${b.code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        id="booking-modal-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">Prenotazione Rapida Tavolo</h2>
              <p className="text-xs text-slate-500">Conferma istantanea senza carta di credito</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookings.length > 0 && (
              <button
                type="button"
                onClick={() => setStep(step === 'list' ? 'form' : 'list')}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {step === 'list' ? 'Nuova' : `Le mie (${bookings.length})`}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Scelta Ristorante */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-indigo-500" />
                  Ristorante Selezionato
                </label>
                <select
                  id="booking-restaurant-select"
                  value={targetVenueId}
                  onChange={(e) => setTargetVenueId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors bg-white font-semibold text-slate-900"
                >
                  {RESTAURANT_VENUES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.imageEmoji} {v.name} ({v.neighborhood} • {v.cuisine})
                    </option>
                  ))}
                </select>
                <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate">{activeVenue.address}</span>
                  <span className="font-semibold text-slate-700 shrink-0">{activeVenue.priceRange}</span>
                </div>
              </div>

              {/* Data & Ora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Data
                  </label>
                  <input
                    type="date"
                    id="booking-date-input"
                    value={date}
                    min={todayStr}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    Orario
                  </label>
                  <select
                    id="booking-time-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors bg-white"
                  >
                    {timeSlots.map((s) => (
                      <option key={s.val} value={s.val}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coperti */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    Numero Ospiti
                  </span>
                  <span className="font-bold text-indigo-600 text-sm">{guests} {guests === 1 ? 'persona' : 'persone'}</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        guests === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferenza tavolo */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Ambiente Tavolo
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSeatingPreference('outdoor')}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                      seatingPreference === 'outdoor'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    🌿 Dehor aperto
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeatingPreference('indoor')}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                      seatingPreference === 'indoor'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    🏛️ Sala interna
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeatingPreference('no_preference')}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                      seatingPreference === 'no_preference'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    ✨ Nessuna pref.
                  </button>
                </div>
              </div>

              {/* Dati personali */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nome e Cognome *
                  </label>
                  <input
                    type="text"
                    id="booking-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="es. Mario Rossi"
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Telefono / Cellulare *
                    </label>
                    <input
                      type="tel"
                      id="booking-phone-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="es. 340 1234567"
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email (opzionale)
                    </label>
                    <input
                      type="email"
                      id="booking-email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="es. mario@email.it"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Note speciali, intolleranze o anniversari
                  </label>
                  <input
                    type="text"
                    id="booking-notes-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="es. 1 celiaco, seggiolone bimbo, cena romantica..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="booking-submit-btn"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                Conferma Prenotazione da {activeVenue.name}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Nessun pagamento anticipato. Cancellazione sempre gratuita.
              </p>
            </form>
          )}

          {/* STEP 2: SUCCESS RECEIPT */}
          {step === 'success' && currentBooking && (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Prenotazione Confermata!</h3>
                <p className="text-xs text-slate-500">Il tavolo è riservato per te con conferma immediata</p>
              </div>

              {/* Receipt card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Codice Prenotazione:</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 text-sm">
                    {currentBooking.code}
                  </span>
                </div>

                <div className="space-y-1 py-1 border-b border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Ristorante:</span>
                  <strong className="text-slate-900 font-bold text-sm block">{currentBooking.restaurantName}</strong>
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {activeVenue.address}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Ospite:</span>
                    <strong className="text-slate-900 font-semibold">{currentBooking.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Coperti:</span>
                    <strong className="text-slate-900 font-semibold">{currentBooking.guests} persone</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Data:</span>
                    <strong className="text-slate-900 font-semibold">{currentBooking.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Orario:</span>
                    <strong className="text-slate-900 font-semibold">{currentBooking.time}</strong>
                  </div>
                </div>

                {currentBooking.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block">Note:</span>
                    <p className="text-slate-700 italic">{currentBooking.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => downloadCalendarFile(currentBooking)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Salva nel Calendario (.ics)
                </button>
                <a
                  href={`https://wa.me/${activeVenue.whatsapp}?text=${encodeURIComponent(`Salve, ho effettuato la prenotazione ${currentBooking.code} da ${currentBooking.restaurantName} a nome ${currentBooking.name} per ${currentBooking.guests} persone il ${currentBooking.date} alle ${currentBooking.time}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Conferma su WhatsApp
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Chiudi finestra
              </button>
            </div>
          )}

          {/* STEP 3: LIST OF BOOKINGS */}
          {step === 'list' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm">Le tue prenotazioni salvate:</h3>
              {bookings.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Non ci sono ancora prenotazioni registrate.</p>
              ) : (
                <div className="space-y-2.5">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{b.restaurantName || 'Ristorante'}</span>
                          <span className="px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-700 font-mono font-bold text-[10px]">
                            {b.code}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">
                          Ospite: {b.name} • 👥 {b.guests} persone
                        </p>
                        <p className="text-slate-500">
                          📅 {b.date} alle ore {b.time}
                        </p>
                        {b.notes && (
                          <p className="text-slate-400 italic">"{b.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => downloadCalendarFile(b)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 rounded-md"
                          title="Scarica evento calendario"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                          title="Annulla prenotazione"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                + Effettua un'altra prenotazione
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
