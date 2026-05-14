import React, { useMemo } from 'react';
import { ArrowLeft, Star, TrendingUp, Flame } from 'lucide-react';
import { UserSettings } from '../types';
import { LEVELS, XP_EVENTS } from '../constants';
import { computeLevel } from '../services/gamification';
import { today, daysAgo } from '../services/date';

interface Props {
  onBack: () => void;
  settings: UserSettings;
}

// Mapa: cada 2 níveis = 1 estrela cheia (5 estrelas no total)
const starsForLevel = (lvl: number): { full: number; half: number } => {
  const total = Math.max(0, Math.min(10, lvl));
  return { full: Math.floor(total / 2), half: total % 2 };
};

const LevelProgress: React.FC<Props> = ({ onBack, settings }) => {
  const level = computeLevel(settings.totalXp || 0);
  const stars = starsForLevel(level.level);

  // Gráfico de XP — últimos 14 dias
  const chart = useMemo(() => {
    const map = new Map((settings.xpHistory || []).map(h => [h.date, h.xp]));
    const days: { date: string; xp: number; label: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = daysAgo(i);
      const date = new Date(d);
      days.push({
        date: d,
        xp: map.get(d) || 0,
        label: `${date.getDate()}/${date.getMonth() + 1}`,
      });
    }
    return days;
  }, [settings.xpHistory]);

  const maxXp = Math.max(40, ...chart.map(d => d.xp));
  const totalLast14 = chart.reduce((s, d) => s + d.xp, 0);

  // Constrói o path do sparkline
  const W = 320; const H = 100; const PAD = 8;
  const stepX = (W - PAD * 2) / (chart.length - 1);
  const pointFor = (i: number, xp: number) => ({
    x: PAD + i * stepX,
    y: H - PAD - ((xp / maxXp) * (H - PAD * 2)),
  });
  const path = chart.map((d, i) => {
    const p = pointFor(i, d.xp);
    return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(' ');
  const areaPath = path + ` L ${(W - PAD).toFixed(1)} ${H - PAD} L ${PAD} ${H - PAD} Z`;

  const progressPct = level.xpToNext > 0 ? Math.min(100, (level.xpInLevel / level.xpToNext) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Meu progresso</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-4">
        {/* CARD PRINCIPAL */}
        <section className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white rounded-3xl p-6 shadow-xl shadow-violet-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">Nível atual</p>
              <p className="text-5xl font-black mt-1 leading-none">{level.level}</p>
              <p className="text-sm font-semibold mt-1 opacity-95">{level.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">XP total</p>
              <p className="text-3xl font-bold">{level.totalXp}</p>
            </div>
          </div>

          {/* ESTRELAS */}
          <div className="flex items-center gap-1.5 mt-5">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < stars.full;
              const half = i === stars.full && stars.half === 1;
              return (
                <div key={i} className="relative">
                  <Star className={`w-7 h-7 ${filled ? 'text-yellow-300' : 'text-white/30'}`} fill={filled ? 'currentColor' : 'none'} strokeWidth={2} />
                  {half && (
                    <Star className="w-7 h-7 text-yellow-300 absolute inset-0" fill="currentColor" strokeWidth={2} style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  )}
                </div>
              );
            })}
            <span className="text-xs opacity-80 ml-2">{Math.min(10, level.level)}/10</span>
          </div>

          {/* BARRA DE XP */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs opacity-90 mb-1.5">
              <span>{level.xpInLevel} XP</span>
              <span>+{Math.max(0, level.xpToNext - level.xpInLevel)} pro próximo</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </section>

        {/* GRÁFICO */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Últimos 14 dias
            </h2>
            <span className="text-xs text-slate-500">{totalLast14} XP</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28">
            <defs>
              <linearGradient id="xpGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#xpGrad)" />
            <path d={path} stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {chart.map((d, i) => {
              const p = pointFor(i, d.xp);
              if (d.xp === 0) return null;
              return <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#10b981" />;
            })}
          </svg>
          <div className="flex justify-between mt-1 text-[10px] text-slate-400">
            <span>{chart[0]?.label}</span>
            <span>{chart[Math.floor(chart.length / 2)]?.label}</span>
            <span>hoje</span>
          </div>
        </section>

        {/* STREAK */}
        {settings.streak && settings.streak.current > 0 && (
          <section className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-900 rounded-2xl p-5 flex items-center gap-4">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{settings.streak.current} dias</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Sequência atual · maior: {settings.streak.longest} · {settings.streak.freezesAvailable} freezes</p>
            </div>
          </section>
        )}

        {/* PRÓXIMOS NÍVEIS */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Trilha de níveis</h2>
          <div className="space-y-2">
            {LEVELS.map(l => {
              const reached = level.totalXp >= l.needXp;
              const current = l.level === level.level;
              return (
                <div key={l.level} className={`flex items-center gap-3 p-2 rounded-lg ${current ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${reached ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {l.level}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${reached ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{l.title}</p>
                    <p className="text-xs text-slate-400">{l.needXp} XP</p>
                  </div>
                  {current && <span className="text-xs text-emerald-600 font-semibold">atual</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* COMO GANHAR XP */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Como ganhar XP</h2>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li className="flex justify-between"><span>📝 Check-in diário</span><span className="font-semibold text-emerald-600">+{XP_EVENTS.checkin}</span></li>
            <li className="flex justify-between"><span>🌬️ Completar exercício</span><span className="font-semibold text-emerald-600">+{XP_EVENTS.exercise_complete}</span></li>
            <li className="flex justify-between"><span>📖 Escrever no diário</span><span className="font-semibold text-emerald-600">+{XP_EVENTS.diary_entry}</span></li>
            <li className="flex justify-between"><span>🗺️ Dia da trilha</span><span className="font-semibold text-emerald-600">+{XP_EVENTS.trail_day}</span></li>
            <li className="flex justify-between"><span>💌 Carta para o futuro</span><span className="font-semibold text-emerald-600">+{XP_EVENTS.letter_written}</span></li>
            <li className="flex justify-between"><span>🌊 Calma coletiva</span><span className="font-semibold text-emerald-600">+{XP_EVENTS.colectiva_joined}</span></li>
            <li className="flex justify-between"><span>🤝 Ping para dupla</span><span className="font-semibold text-emerald-600">+{XP_EVENTS.buddy_ping_sent}</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LevelProgress;
