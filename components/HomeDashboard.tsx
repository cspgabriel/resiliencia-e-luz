import React, { useMemo } from 'react';
import { ViewState, CheckIn, MOOD_META, UserSettings, ExerciseLog, Exercise } from '../types';
import {
  MessageCircle, Wind, BookOpen, AlertCircle, ArrowRight, Sparkles,
  TrendingUp, Map, BarChart3, Target, Mail, Waves, Trophy, Flame, Star, Quote
} from 'lucide-react';
import { FREE_LIMITS, getDailyPlan, EXERCISES, MINI_TRAILS } from '../constants';
import { today } from '../services/date';
import { computeLevel } from '../services/gamification';
import DailyAffirmationCard from './DailyAffirmationCard';
import AdSlot from './AdSlot';

interface Props {
  onNavigate: (v: ViewState) => void;
  onSelectExercise: (e: Exercise) => void;
  checkins: CheckIn[];
  exerciseLog: ExerciseLog[];
  settings: UserSettings;
  onXpGain?: (xp: number) => void;
}

const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 6)  return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

const HomeDashboard: React.FC<Props> = ({ onNavigate, onSelectExercise, checkins, exerciseLog, settings, onXpGain }) => {
  const level   = computeLevel(settings.totalXp || 0);
  const streak  = settings.streak;
  const xpPct   = level.xpToNext > 0 ? Math.min(100, (level.xpInLevel / level.xpToNext) * 100) : 100;
  const todayStr = today();
  const todayCheck     = checkins.find(c => c.date === todayStr);
  const todayExercises = exerciseLog.filter(e => e.date === todayStr);
  const last7   = useMemo(() => checkins.slice(0, 7).reverse(), [checkins]);

  const avg = last7.length > 0
    ? (last7.reduce((s, c) => s + MOOD_META[c.mood].score, 0) / last7.length).toFixed(1)
    : null;

  const msgsLeft = settings.isPro ? '∞' : Math.max(0, FREE_LIMITS.messagesPerDay - settings.messagesUsedToday);
  const plan = getDailyPlan(todayCheck?.mood, todayCheck?.energy, todayCheck?.sleep);

  const startPlan = () => {
    if (plan.exerciseId) {
      const exercise = EXERCISES.find(e => e.id === plan.exerciseId);
      if (exercise && (!exercise.isPremium || settings.isPro)) {
        onSelectExercise(exercise);
        return;
      }
    }
    onNavigate(plan.targetView);
  };

  return (
    <div className="min-h-screen mesh-soft pb-28 md:pb-12 relative overflow-x-hidden">
      {/* Blobs decorativos sutis */}
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-brand-300/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute top-[60%] -left-20 w-[360px] h-[360px] rounded-full bg-sky-200/20 blur-[100px]" />

      <div className="max-w-4xl mx-auto px-5 pt-8 md:pt-12 relative">
        {/* HEADER */}
        <header className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{greeting()}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {settings.name ? <>Como você tá, <span className="font-serif italic text-brand-gradient">{settings.name}</span>?</> : <>Como você tá <span className="font-serif italic text-brand-gradient">hoje?</span></>}
            </h1>
          </div>
          <button
            onClick={() => onNavigate(ViewState.COMPANION)}
            className="group flex items-center gap-2 px-3 py-2 rounded-2xl text-white shadow-brand-soft active:scale-95 transition"
            style={{ background: 'linear-gradient(135deg, #1A6B73 0%, #5EB8B3 100%)' }}
          >
            <div className="relative">
              <Star className="w-7 h-7 text-amber-300" fill="currentColor" strokeWidth={2} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-brand-900">{level.level}</span>
            </div>
            <div className="text-left">
              <p className="text-[10px] opacity-90 leading-none">Nível</p>
              <p className="text-sm font-bold leading-tight">{level.title}</p>
              <div className="w-16 h-1 bg-white/30 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-amber-300" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </button>
        </header>

        {/* AFIRMAÇÃO DIÁRIA */}
        <div className="mb-5">
          <DailyAffirmationCard settings={settings} onXpGain={onXpGain || (() => {})} />
        </div>

        <button
          onClick={() => onNavigate(ViewState.BIBLE)}
          className="w-full glass-strong rounded-2xl p-5 mb-5 text-left flex items-center gap-4 hover:-translate-y-0.5 transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shrink-0 shadow-md">
            <Quote className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Novo</p>
            <p className="font-bold text-slate-900 dark:text-white">Bíblia da Resiliência</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pílulas diárias, capítulos e jornada de 21 dias para compartilhar.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* STREAK */}
        {(streak?.current || 0) > 0 && (
          <button
            onClick={() => onNavigate(ViewState.ACHIEVEMENTS)}
            className="w-full glass rounded-2xl p-4 mb-5 flex items-center gap-3 hover:-translate-y-0.5 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{streak!.current} dias seguidos 🔥</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{streak!.freezesAvailable} freezes disponíveis este mês</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {/* CHECK-IN STATUS */}
        {!todayCheck ? (
          <button
            onClick={() => onNavigate(ViewState.CHECKIN)}
            className="relative w-full p-5 md:p-6 rounded-3xl mb-5 text-left flex items-center justify-between overflow-hidden text-white shadow-brand-glow active:scale-[0.98] transition"
            style={{ background: 'linear-gradient(135deg, #0E4D54 0%, #1A6B73 50%, #5EB8B3 100%)' }}
          >
            <div aria-hidden className="absolute inset-0 dot-grid opacity-15" />
            <div aria-hidden className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-300/15 blur-3xl" />
            <div className="relative">
              <p className="text-xs opacity-85 uppercase tracking-widest font-semibold mb-1">Ainda não fez o check-in</p>
              <p className="font-bold text-xl md:text-2xl">Como você se sente agora?</p>
              <p className="text-xs opacity-85 mt-1">Leva 30 segundos. Você se conhece melhor depois.</p>
            </div>
            <div className="relative w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        ) : (
          <div className="glass-strong rounded-2xl p-5 mb-5 flex items-center gap-4">
            <div className="text-5xl">{MOOD_META[todayCheck.mood].emoji}</div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">Você tá</p>
              <p className="font-bold text-slate-900 dark:text-white">{MOOD_META[todayCheck.mood].label}</p>
              {todayCheck.triggerTags && todayCheck.triggerTags.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">{todayCheck.triggerTags.join(' · ')}</p>
              )}
              {todayCheck.note && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic line-clamp-2">"{todayCheck.note}"</p>}
            </div>
            <button onClick={() => onNavigate(ViewState.CHECKIN)} className="text-xs text-brand-600 dark:text-brand-300 font-semibold underline">
              Editar
            </button>
          </div>
        )}

        {/* PLANO DO DIA */}
        <button
          onClick={startPlan}
          className="w-full glass rounded-2xl p-5 mb-5 text-left flex items-start gap-4 hover:-translate-y-0.5 transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shrink-0 shadow-md">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 dark:text-white">{plan.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{plan.message}</p>
            <p className="text-sm font-semibold text-brand-600 dark:text-brand-300 mt-3 inline-flex items-center gap-1">{plan.actionLabel} <ArrowRight className="w-3.5 h-3.5" /></p>
          </div>
        </button>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { v: ViewState.BIBLE,        icon: Quote,          color: 'from-amber-400 to-rose-500',   title: 'Pílulas',       sub: 'Bíblia da resiliência' },
            { v: ViewState.CHAT,         icon: MessageCircle, color: 'from-teal-400 to-emerald-500',  title: 'Conversar',     sub: settings.allowAiProcessing ? `${msgsLeft} mensagens hoje` : 'Ative IA nos ajustes' },
            { v: ViewState.EXERCISES,    icon: Wind,          color: 'from-sky-400 to-cyan-500',      title: 'Exercícios',    sub: `${todayExercises.length} feitos hoje` },
            { v: ViewState.TRAILS,       icon: Map,           color: 'from-violet-400 to-purple-500', title: 'Trilhas',       sub: '7, 14 e 21 dias' },
            { v: ViewState.DIARY,        icon: BookOpen,      color: 'from-indigo-400 to-blue-500',   title: 'Meu Diário',    sub: 'Escreva o que sentiu' },
            { v: ViewState.INSIGHTS,     icon: BarChart3,     color: 'from-amber-400 to-orange-500',  title: 'Insights',      sub: 'Padrões, sem diagnóstico' },
            { v: ViewState.LETTERS,      icon: Mail,          color: 'from-rose-400 to-pink-500',     title: 'Cartas',        sub: 'Escreva pra você' },
            { v: ViewState.COLECTIVA,    icon: Waves,         color: 'from-cyan-400 to-sky-600',      title: 'Calma viva',    sub: 'Respirar junto às 22h' },
            { v: ViewState.ACHIEVEMENTS, icon: Trophy,        color: 'from-yellow-400 to-amber-500',  title: 'Conquistas',    sub: `Nível ${level.level} · ${level.title}` },
          ].map((a) => (
            <button
              key={a.v}
              onClick={() => onNavigate(a.v)}
              className="glass rounded-2xl p-4 text-left active:scale-[0.97] hover:-translate-y-0.5 transition"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 shadow-sm`}>
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{a.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.sub}</p>
            </button>
          ))}

          <button
            onClick={() => onNavigate(ViewState.SOS)}
            className="col-span-2 md:col-span-3 rounded-2xl p-4 text-left active:scale-[0.97] hover:-translate-y-0.5 transition flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(254,226,226,0.85) 0%, rgba(252,165,165,0.7) 100%)' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-900 text-sm">SOS Ansiedade</p>
              <p className="text-xs text-red-800/80">Respiração guiada + ajuda humana em um toque</p>
            </div>
            <ArrowRight className="w-5 h-5 text-red-700" />
          </button>
        </div>

        {/* ANÚNCIO (some pra Plus / pode ser ocultado) */}
        <AdSlot slotId="home_mid" format="banner" settings={settings} onNavigate={onNavigate} />

        {/* MINI-TRILHAS DE 3 DIAS */}
        <div className="glass-strong rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Para começar pequeno (3 dias)</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Baixa fricção</span>
          </div>
          <div className="space-y-2">
            {MINI_TRAILS.map(t => (
              <button
                key={t.id}
                onClick={() => onNavigate(ViewState.TRAILS)}
                className="w-full text-left p-3 rounded-xl bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 transition flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-800/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-700 dark:text-brand-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{t.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* HUMOR DA SEMANA */}
        {last7.length >= 2 && (
          <div className="glass-strong rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">Sua semana</p>
              </div>
              {avg && <span className="text-xs text-slate-500">Média {avg}/5</span>}
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {last7.map((c, i) => {
                const m = MOOD_META[c.mood];
                const height = (m.score / 5) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{ height: `${height}%`, background: `linear-gradient(180deg, ${m.color}, ${m.color}cc)`, minHeight: '10px' }}
                    />
                    <span className="text-[10px]">{m.emoji}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA PLUS */}
        {!settings.isPro && (
          <button
            onClick={() => onNavigate(ViewState.PAYWALL)}
            className="relative w-full p-5 rounded-3xl text-left flex items-center justify-between overflow-hidden text-white shadow-brand-glow"
            style={{ background: 'linear-gradient(135deg, #0E4D54 0%, #1A6B73 50%, #5EB8B3 100%)' }}
          >
            <div aria-hidden className="absolute inset-0 dot-grid opacity-15" />
            <div aria-hidden className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-95">Plus</p>
              </div>
              <p className="font-bold text-lg">Chat ilimitado + trilhas + PDF</p>
              <p className="text-xs opacity-90 mt-0.5">A partir de R$ 9,90/mês no plano anual · 7 dias grátis</p>
            </div>
            <div className="relative w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;
