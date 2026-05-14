import React from 'react';
import { ArrowLeft, Phone, MessageSquare, Heart, AlertCircle, UserRound } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../constants';
import { UserSettings } from '../types';

interface Props {
  onBack: () => void;
  onStartBreathing: () => void;
  settings?: UserSettings;
}

const SOS: React.FC<Props> = ({ onBack, onStartBreathing, settings }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-rose-50 to-amber-50 dark:from-slate-950 dark:via-red-950/40 dark:to-slate-900 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">SOS — você não precisa atravessar sozinho</h1>
      </header>

      <div className="max-w-md mx-auto px-5 pt-6 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-red-200 dark:border-red-900 text-center">
          <Heart className="w-12 h-12 mx-auto text-rose-500 mb-3" fill="currentColor" />
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
            Respira. Vamos atravessar <strong>um passo por vez</strong>. Se você não estiver seguro(a), acione ajuda humana agora.
          </p>
        </div>

        <button onClick={onStartBreathing} className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-5 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-3">
          <Heart className="w-5 h-5" />
          <div className="text-left">
            <p>Iniciar respiração 4-7-8</p>
            <p className="text-xs font-normal opacity-90">2 minutos · faça agora</p>
          </div>
        </button>

        {settings?.emergencyPhone && (
          <a href={`tel:${settings.emergencyPhone}`} className="w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 flex items-center gap-3">
            <UserRound className="w-5 h-5 text-rose-500" />
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">Ligar para {settings.emergencyContact || 'contato de confiança'}</p>
              <p className="text-xs text-slate-500">{settings.emergencyPhone}</p>
            </div>
          </a>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="font-semibold text-slate-900 dark:text-white">Se houver crise grave ou risco imediato</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Ligue agora — gratuito, sigiloso, 24 horas quando disponível.
          </p>
          <div className="space-y-2">
            {EMERGENCY_CONTACTS.map(c => (
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl p-3 transition">
                {c.url.startsWith('tel:') ? <Phone className="w-5 h-5 text-emerald-600" /> : <MessageSquare className="w-5 h-5 text-emerald-600" />}
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.detail}</p>
                </div>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{c.phone}</p>
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 px-4">
          Pedir ajuda é um passo de cuidado. Você merece apoio real.
        </p>
      </div>
    </div>
  );
};

export default SOS;
