import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { UserSettings } from '../types';
import { ACHIEVEMENTS_CATALOG, LEVELS } from '../constants';
import { computeLevel } from '../services/gamification';

interface Props {
  onBack: () => void;
  settings: UserSettings;
}

const Achievements: React.FC<Props> = ({ onBack, settings }) => {
  const unlocked = new Set(settings.achievements || []);
  const level = computeLevel(settings.totalXp || 0);

  const grouped = ACHIEVEMENTS_CATALOG.reduce<Record<string, typeof ACHIEVEMENTS_CATALOG>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [] as any;
    acc[a.category].push(a);
    return acc;
  }, {});

  const categoryLabel: Record<string, string> = {
    streak: '🔥 Sequências',
    checkin: '👂 Check-ins',
    diary: '📖 Diário',
    exercise: '🌬️ Exercícios',
    social: '🤝 Conexão',
    special: '✨ Especiais',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 md:hidden"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Conquistas</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-6">
        <section className="bg-gradient-to-br from-emerald-500 to-sky-500 text-white rounded-3xl p-6">
          <p className="text-sm opacity-90">Nível atual</p>
          <p className="text-4xl font-black mt-1">{level.level} · {level.title}</p>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${level.xpToNext ? (level.xpInLevel / level.xpToNext) * 100 : 100}%` }} />
          </div>
          <p className="text-xs opacity-80 mt-1">{level.xpInLevel} / {level.xpToNext} XP para o próximo nível</p>
          <p className="text-xs opacity-80 mt-1">Total: {level.totalXp} XP · {unlocked.size}/{ACHIEVEMENTS_CATALOG.length} conquistas</p>
        </section>

        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{categoryLabel[cat]}</h2>
            <div className="grid grid-cols-2 gap-2">
              {items.map(a => {
                const isUnlocked = unlocked.has(a.id);
                return (
                  <div key={a.id} className={`rounded-2xl p-4 border ${isUnlocked ? 'bg-white dark:bg-slate-800 border-emerald-300' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-70'}`}>
                    <div className="text-3xl mb-1">{isUnlocked ? a.icon : <Lock className="w-6 h-6 text-slate-400" />}</div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{a.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-200">Trilha de níveis</h3>
          <div className="space-y-1.5">
            {LEVELS.map(l => (
              <div key={l.level} className={`flex items-center justify-between text-xs ${l.level <= level.level ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <span>{l.level <= level.level ? '✓' : '○'} Nível {l.level} · {l.title}</span>
                <span>{l.needXp} XP</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Achievements;
