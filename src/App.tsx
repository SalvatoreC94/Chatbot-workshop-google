import React from 'react';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { FREELANCER_PROFILE } from './data/leadGenData';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm sm:text-base block">Hai un progetto in mente?</span>
            <p className="text-xs text-slate-500 mt-0.5">
              Chiedi all'assistente di {FREELANCER_PROFILE.name} servizi, tecnologie, tempi e costi indicativi.
            </p>
          </div>
        </div>

        <ChatWindow />
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500">
          <span className="font-semibold text-slate-800">{FREELANCER_PROFILE.name}</span> — {FREELANCER_PROFILE.role}
        </div>
      </footer>
    </div>
  );
}
