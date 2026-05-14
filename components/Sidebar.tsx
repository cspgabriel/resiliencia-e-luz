import React from 'react';
import { ViewState, UserSettings } from '../types';
import { Home, MessageCircle, Wind, BookOpen, Settings, AlertCircle, Sparkles, Map, BarChart3 } from 'lucide-react';
import { APP_NAME } from '../constants';

interface Props {
  current: ViewState;
  onNavigate: (v: ViewState) => void;
  settings: UserSettings;
}

const Sidebar: React.FC<Props> = ({ current, onNavigate, settings }) => {
  const items = [
    { v: ViewState.HOME,      label: 'Início',     icon: Home },
    { v: ViewState.CHAT,      label: 'Conversar',  icon: MessageCircle },
    { v: ViewState.EXERCISES, label: 'Exercícios', icon: Wind },
    { v: ViewState.TRAILS,    label: 'Trilhas',    icon: Map },
    { v: ViewState.INSIGHTS,  label: 'Insights',   icon: BarChart3 },
    { v: ViewState.DIARY,     label: 'Diário',     icon: BookOpen },
    { v: ViewState.SOS,       label: 'SOS',        icon: AlertCircle, danger: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen md:flex md:flex-col">
      {/* Logo - desktop only */}
      <div className="hidden md:flex items-center gap-2 p-5">
        <img src="/icon.svg" alt="" className="w-9 h-9" />
        <span className="font-bold text-[#1a6b73] dark:text-teal-200">{APP_NAME}</span>
      </div>

      {/* Mobile bottom nav / desktop side nav */}
      <div className="flex md:flex-col justify-around md:justify-start md:flex-1 md:px-3 md:gap-1 overflow-x-auto">
        {items.map(it => {
          const active = current === it.v;
          return (
            <button
              key={it.v}
              onClick={() => onNavigate(it.v)}
              className={`flex flex-col md:flex-row items-center md:gap-3 gap-0.5 py-3 px-2 md:px-4 md:py-3 md:rounded-xl transition min-w-[64px] md:min-w-0 flex-1 md:flex-none ${
                active
                  ? 'text-emerald-600 dark:text-emerald-400 md:bg-emerald-50 md:dark:bg-emerald-900/30'
                  : it.danger
                    ? 'text-red-500'
                    : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <it.icon className="w-5 h-5 md:w-4 md:h-4" />
              <span className="text-[10px] md:text-sm font-medium">{it.label}</span>
            </button>
          );
        })}
      </div>

      {/* Plus CTA + Settings - desktop only */}
      <div className="hidden md:block p-3 mt-auto space-y-2">
        {!settings.isPro && (
          <button onClick={() => onNavigate(ViewState.PAYWALL)} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Plus
          </button>
        )}
        <button onClick={() => onNavigate(ViewState.SETTINGS)} className="w-full text-slate-600 dark:text-slate-300 text-sm py-2.5 rounded-xl flex items-center gap-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Settings className="w-4 h-4" /> Ajustes
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
