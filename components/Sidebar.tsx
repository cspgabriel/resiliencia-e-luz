import React from 'react';
import { ViewState, UserSettings } from '../types';
import {
  Home, MessageCircle, Wind, BookOpen, Settings, AlertCircle,
  Sparkles, Map, BarChart3, Trophy, Star, Quote, Target
} from 'lucide-react';
import { APP_NAME } from '../constants';

interface Props {
  current: ViewState;
  onNavigate: (v: ViewState) => void;
  settings: UserSettings;
}

const Sidebar: React.FC<Props> = ({ current, onNavigate, settings }) => {
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
  const items = [
    { v: ViewState.HOME,      label: 'Hoje',     icon: Home },
    { v: ViewState.BIBLE,     label: 'Pílula',   icon: Quote },
    { v: ViewState.CHECKIN,   label: 'Check-in', icon: Target },
    { v: ViewState.TRAILS,    label: 'Jornada',  icon: Map },
    { v: ViewState.EXERCISES, label: 'Respirar', icon: Wind },
    { v: ViewState.DIARY,     label: 'Diário',   icon: BookOpen },
    { v: ViewState.CHAT,      label: 'Luz',      icon: MessageCircle },
    { v: ViewState.SOS,       label: 'SOS',      icon: AlertCircle, danger: true },
  ];
  const secondaryItems = [
    { v: ViewState.INSIGHTS,     label: 'Padrões',    icon: BarChart3 },
    { v: ViewState.ACHIEVEMENTS, label: 'Conquistas', icon: Trophy },
    { v: ViewState.COMPANION,    label: 'Nível',      icon: Star },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/40 dark:border-slate-700/40
                    md:relative md:border-t-0 md:border-r md:border-white/40 md:dark:border-slate-700/40 md:w-64 md:h-screen md:flex md:flex-col">
      {/* Logo - desktop */}
      <div className="hidden md:flex items-center gap-2.5 p-5">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-400 rounded-xl blur-md opacity-40" />
          <img src={asset('icon.svg')} alt="" className="relative w-9 h-9" />
        </div>
        <span className="font-bold text-brand-700 dark:text-brand-200 tracking-tight">{APP_NAME}</span>
      </div>

      {/* Nav items */}
      <div className="flex md:flex-col justify-around md:justify-start md:flex-1 md:px-3 md:gap-1 overflow-x-auto md:overflow-y-auto">
        {items.map(it => {
          const active = current === it.v;
          return (
            <button
              key={it.v}
              onClick={() => onNavigate(it.v)}
              className={`relative flex flex-col md:flex-row items-center md:gap-3 gap-0.5 py-3 px-2 md:px-4 md:py-2.5 md:rounded-xl transition min-w-[64px] md:min-w-0 flex-1 md:flex-none ${
                active
                  ? it.danger
                    ? 'text-red-600 md:bg-red-50 md:dark:bg-red-950/40'
                    : 'text-brand-700 dark:text-brand-200 md:bg-brand-50/80 md:dark:bg-brand-800/40 font-semibold'
                  : it.danger
                    ? 'text-red-500/80'
                    : 'text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-200 md:hover:bg-white/40 md:dark:hover:bg-slate-800/40'
              }`}
            >
              {active && (
                <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-brand-400 to-brand-700" />
              )}
              <it.icon className="w-5 h-5 md:w-4 md:h-4 shrink-0" />
              <span className="text-[10px] md:text-sm font-medium">{it.label}</span>
            </button>
          );
        })}
        <div className="hidden md:block h-px bg-slate-200/70 dark:bg-slate-800 my-2" />
        {secondaryItems.map(it => {
          const active = current === it.v;
          return (
            <button
              key={it.v}
              onClick={() => onNavigate(it.v)}
              className={`hidden md:flex relative items-center gap-3 px-4 py-2.5 rounded-xl transition ${
                active
                  ? 'text-brand-700 dark:text-brand-200 bg-brand-50/80 dark:bg-brand-800/40 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-brand-400 to-brand-700" />
              )}
              <it.icon className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{it.label}</span>
            </button>
          );
        })}
      </div>

      {/* Plus CTA + Settings - desktop */}
      <div className="hidden md:block p-3 mt-auto space-y-2">
        {!settings.isPro && (
          <button
            onClick={() => onNavigate(ViewState.PAYWALL)}
            className="relative w-full text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 overflow-hidden shadow-brand-soft"
            style={{ background: 'linear-gradient(135deg, #0E4D54 0%, #1A6B73 50%, #5EB8B3 100%)' }}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Experimentar Plus
          </button>
        )}
        <button
          onClick={() => onNavigate(ViewState.SETTINGS)}
          className="w-full text-slate-600 dark:text-slate-300 text-sm py-2.5 rounded-xl flex items-center gap-3 px-4 hover:bg-white/50 dark:hover:bg-slate-800/50 transition"
        >
          <Settings className="w-4 h-4" /> Ajustes
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
