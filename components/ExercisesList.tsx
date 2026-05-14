import React, { useState } from 'react';
import { Exercise, UserSettings } from '../types';
import { EXERCISES, ICON_MAP, FREE_LIMITS } from '../constants';
import { ArrowLeft, Clock, Lock } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelect: (e: Exercise) => void;
  onUpgrade: () => void;
  settings: UserSettings;
}

const ExercisesList: React.FC<Props> = ({ onBack, onSelect, onUpgrade, settings }) => {
  const [filter, setFilter] = useState<string>('Todos');
  const cats = ['Todos', ...Array.from(new Set(EXERCISES.map(e => e.category)))];
  const visible = filter === 'Todos' ? EXERCISES : EXERCISES.filter(e => e.category === filter);

  const freeCount = EXERCISES.filter(e => !e.isPremium).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-3xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-xl">Exercícios</h1>
          <p className="text-xs text-slate-500">{settings.isPro ? `${EXERCISES.length} disponíveis` : `${freeCount} grátis · ${EXERCISES.length - freeCount} no Plus`}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 mt-4 flex gap-2 overflow-x-auto pb-2">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === c ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-5 mt-4 grid gap-3">
        {visible.map(ex => {
          const Icon = ICON_MAP[ex.iconName] || ICON_MAP.Wind;
          const locked = ex.isPremium && !settings.isPro;
          return (
            <button
              key={ex.id}
              onClick={() => locked ? onUpgrade() : onSelect(ex)}
              className={`text-left bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-start gap-4 active:scale-[0.98] transition relative ${locked ? 'opacity-80' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${locked ? 'bg-slate-100 dark:bg-slate-700' : 'bg-emerald-100 dark:bg-emerald-900/40'}`}>
                {locked ? <Lock className="w-5 h-5 text-slate-400" /> : <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">{ex.title}</h3>
                  {ex.isPremium && <span className="text-[10px] font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-1.5 py-0.5 rounded">PLUS</span>}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{ex.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ex.duration}min</span>
                  <span>· {ex.category}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExercisesList;
