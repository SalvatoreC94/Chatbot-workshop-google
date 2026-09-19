import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Calendar, Star, Phone, Check, Copy, ExternalLink, Utensils } from 'lucide-react';
import { RESTAURANT_VENUES } from '../data/businessData';
import { RestaurantVenue } from '../types';

interface InteractiveMapProps {
  venues?: RestaurantVenue[];
  selectedVenueId?: string | null;
  onSelectVenue?: (venue: RestaurantVenue) => void;
  onOpenBooking?: (venue: RestaurantVenue) => void;
  compact?: boolean;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  venues = RESTAURANT_VENUES,
  selectedVenueId = null,
  onSelectVenue,
  onOpenBooking,
  compact = false,
  className = '',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Tutti');
  const [activeVenue, setActiveVenue] = useState<RestaurantVenue>(
    venues.find((v) => v.id === selectedVenueId) || venues[0]
  );
  const [copied, setCopied] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Retrieve Google Maps API key
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "AIzaSyA9B6DxoADBHIGi15Kol-2DeXRqbOEcZPY";

  // Filter venues by cuisine category
  const filteredVenues = venues.filter((v) => {
    if (selectedFilter === 'Tutti') return true;
    if (selectedFilter === 'Romana') return v.cuisine.includes('Romana');
    if (selectedFilter === 'Pizza') return v.cuisine.includes('Pizza');
    if (selectedFilter === 'Pesce') return v.cuisine.includes('Pesce');
    if (selectedFilter === 'Senza Glutine') return v.features.some((f) => f.includes('Senza Glutine'));
    if (selectedFilter === 'Enoteca') return v.cuisine.includes('Enoteca');
    return true;
  });

  const handleMarkerClick = (venue: RestaurantVenue) => {
    setActiveVenue(venue);
    if (onSelectVenue) {
      onSelectVenue(venue);
    }
  };

  const copyAddress = (venue: RestaurantVenue) => {
    navigator.clipboard.writeText(venue.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openDirections = (venue: RestaurantVenue) => {
    const destination = encodeURIComponent(`${venue.name}, ${venue.address}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  // Center on active venue or Rome center
  const centerPosition = {
    lat: activeVenue?.lat || 41.8986,
    lng: activeVenue?.lng || 41.8986 ? activeVenue.lng : 12.4740,
  };

  const getPinColor = (venue: RestaurantVenue) => {
    if (venue.id === activeVenue?.id) return '#4338ca'; // Deep Indigo selected
    if (venue.cuisine.includes('Pesce')) return '#0891b2'; // Cyan
    if (venue.cuisine.includes('Pizza')) return '#d97706'; // Amber
    if (venue.features.some((f) => f.includes('Senza Glutine'))) return '#059669'; // Emerald
    if (venue.cuisine.includes('Enoteca')) return '#7c3aed'; // Purple
    return '#dc2626'; // Red
  };

  return (
    <div id="interactive-multivenue-map" className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col ${className}`}>
      {/* Header filter bar */}
      <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Mappa dei Locali Consigliati</h3>
            <p className="text-[11px] text-slate-500">
              {filteredVenues.length} locali a Roma • Clicca sui pin per dettagli e indicazioni
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {['Tutti', 'Romana', 'Pizza', 'Pesce', 'Senza Glutine', 'Enoteca'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Map display */}
      <div className={`relative w-full ${compact ? 'h-64' : 'h-80 sm:h-96'} bg-slate-100 overflow-hidden`}>
        {apiKey && !mapError ? (
          <APIProvider apiKey={apiKey} onError={() => setMapError(true)}>
            <Map
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              center={centerPosition}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              {filteredVenues.map((venue) => {
                const isSelected = venue.id === activeVenue?.id;
                return (
                  <AdvancedMarker
                    key={venue.id}
                    position={{ lat: venue.lat, lng: venue.lng }}
                    title={venue.name}
                    onClick={() => handleMarkerClick(venue)}
                  >
                    <Pin
                      background={getPinColor(venue)}
                      glyphColor="#ffffff"
                      borderColor="#ffffff"
                      scale={isSelected ? 1.3 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        ) : (
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${centerPosition.lat},${centerPosition.lng}&z=14&output=embed`}
          />
        )}

        {/* Selected Venue Floating Card over map */}
        {activeVenue && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl shrink-0 p-1 bg-slate-50 rounded-xl border border-slate-100">
                  {activeVenue.imageEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{activeVenue.name}</h4>
                    <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                      <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                      {activeVenue.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {activeVenue.cuisine} • {activeVenue.neighborhood} • <span className="font-semibold text-slate-700">{activeVenue.priceRange}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyAddress(activeVenue)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg shrink-0"
                title="Copia indirizzo"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              {activeVenue.tagline}
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => openDirections(activeVenue)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                <span>Indicazioni</span>
              </button>

              {onOpenBooking && (
                <button
                  type="button"
                  onClick={() => onOpenBooking(activeVenue)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Prenota Tavolo</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Horizontal quick selector strip */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-2">
        {filteredVenues.map((v) => {
          const isSelected = v.id === activeVenue?.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => handleMarkerClick(v)}
              className={`p-2 rounded-xl text-left border shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-white border-indigo-500 shadow-xs ring-2 ring-indigo-100'
                  : 'bg-white/70 border-slate-200 hover:bg-white text-slate-700'
              }`}
            >
              <span className="text-lg">{v.imageEmoji}</span>
              <div>
                <span className="font-semibold text-xs block text-slate-900 leading-tight">{v.name}</span>
                <span className="text-[10px] text-slate-500">{v.neighborhood}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
