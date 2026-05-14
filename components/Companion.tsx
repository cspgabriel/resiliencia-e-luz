import React, { useMemo } from 'react';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { UserSettings } from '../types';
import { COMPANION_STAGES, COMPANION_GREETINGS, LEVELS } from '../constants';
import { computeLevel, companionMood, stageForXp } from '../services/gamification';

interface Props {
  onBack: () => void;
  settings: UserSettings;
}

const moodEmoji: Record<string, string> = {
  feliz: '✨', ok: '🌤️', sereno: '🌙', cansado: '💤',
};

const Companion: React.FC<Props> = ({ onBack, settings }) => {
  const comp = settings.companion;
  const totalXp = comp?.totalXp ?? 0;
  const stage = stageForXp(totalXp);
  const stageMeta = COMPANION_STAGES[stage];
  const next = COMPANION_STAGES[stage + 1];
  const level = computeLevel(settings.totalXp || 0);

  const greeting = useMemo(
    () => COMPANION_GREETINGS[Math.floor(Math.random() * COMPANION_GREETINGS.length)],
    [],
  );

  const xpInStage = comp ? Math.max(0, totalXp - stageMeta.needXp) : 0;
  const xpStageWidth = next ? Math.min(100, (xpInStage / (next.needXp - stageMeta.needXp)) * 100) : 100;
  const xpLevelWidth = level.xpToNext > 0 ? Math.min(100, (level.xpInLevel / level.xpToNext) * 100) : 100;

  const mood = comp ? companionMood(comp.lastCareAt) : 'feliz';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-slate-900 dark:to-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Sereninho</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-8 text-center">
        <div className="text-[180px] leading-none select-none animate-pulse-slow">
          {stageMeta.emoji}
        </div>
        <p className="mt-2 text-slate-500 text-sm">{moodEmoji[mood]} {mood === 'feliz' ? 'animado' : mood === 'ok' ? 'tranquilo' : mood === 'sereno' ? 'serenando' : 'sentindo sua falta'}</p>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{stageMeta.name}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stageMeta.description}</p>
        <p className="mt-4 italic text-slate-700 dark:text-slate-200">"{greeting}"</p>
      </div>

      <div className="max-w-2xl mx-auto px-5 mt-8 space-y-4">
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Nível {level.level} · {level.title}
            </span>
            <span className="text-xs text-slate-500">{level.xpInLevel} / {level.xpToNext} XP</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${xpLevelWidth}%` }} />
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Próximo estágio</span>
            <span className="text-xs text-slate-500">{next ? `${next.emoji} ${next.name}` : 'Máximo alcançado'}</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-400 to-amber-400" style={{ width: `${xpStageWidth}%` }} />
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Como cuidar do Sereninho</h3>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <li>📝 Faça um check-in diário (+10 XP)</li>
            <li>🌬️ Complete um exercício (+15 XP)</li>
            <li>📖 Escreva no diário (+12 XP)</li>
            <li>💌 Mande uma carta para o futuro (+25 XP)</li>
            <li>🤝 Pingue sua dupla (+8 XP)</li>
            <li>🌊 Participe da Calma Coletiva (+20 XP)</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-rose-400" fill="currentColor" />
            Quanto mais você cuida de si, mais ele cresce.
          </p>
        </section>
      </div>

      <style>{`
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Companion;
