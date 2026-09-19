import React from 'react';
import { Bot, Calendar } from 'lucide-react';
import { FREELANCER_PROFILE } from '../data/leadGenData';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center shadow-xs shrink-0">
              <Bot className="w-6 h-6" />
            </div>

            <div>
              <h1 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                {FREELANCER_PROFILE.name}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">{FREELANCER_PROFILE.role}</p>
            </div>
          </div>

          <a
            href={FREELANCER_PROFILE.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Prenota una call</span>
          </a>
        </div>
      </div>
    </header>
  );
};
