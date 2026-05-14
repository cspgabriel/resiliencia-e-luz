import React, { useMemo } from 'react';
import { ViewState, CheckIn, MOOD_META, UserSettings, ExerciseLog, Exercise } from '../types';
import { MessageCircle, Wind, BookOpen, AlertCircle, ArrowRight, Sparkles, TrendingUp, Calendar, Map, BarChart3, Target } from 'lucide-react';
import { APP_NAME, FREE_LIMITS, getDailyPlan, EXERCISES } from '../constants';
import { today } from '../services/date';

interface Props {
  onNavigate: (v: ViewState) => void;
  onSelectExercise: (e: Exercise) => void;
  checkins: CheckIn[];
  exerciseLog: ExerciseLog[];
  settings: UserSettings;
}

const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 6) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

const HomeDashboard: React.FC<Props> = ({ onNavigate, onSelectExercise, checkins, exerciseLog, settings }) => {
  const todayStr = today();
  const todayCheck = checkins.find(c => c.date === todayStr);
  const todayExercises = exerciseLog.filter(e => e.date === todayStr);
  const last7 = useMemo(() => checkins.slice(0, 7).reverse(), [checkins]);

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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 to-sky-50/40 dark:from-slate-950 dark:to-slate-900 pb-24">
      <div className="max-w-4xl mx-auto px-5 pt-8">
        <header className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">{greeting()}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {settings.name ? `Como você tá, ${settings.name}?` : 'Como você tá hoje?'}
          </h1>
        </header>

        {/* CHECK-IN STATUS */}
        {!todayCheck ? (
          <button
            onClick={() => onNavigate(ViewState.CHECKIN)}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white p-5 rounded-2xl mb-5 shadow-lg shadow-emerald-500/20 text-left flex items-center justify-between active:scale-[0.98] transition"
          >
            <div>
              <p className="text-sm opacity-90">Ainda não fez o check-in</p>
              <p className="font-semibold text-lg">Como você se sente agora?</p>
            </div>
            <ArrowRight className="w-6 h-6" />
          </button>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-5 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="text-5xl">{MOOD_META[todayCheck.mood].emoji}</div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Você tá:</p>
              <p className="font-semibold text-slate-900 dark:text-white">{MOOD_META[todayCheck.mood].label}</p>
              {todayCheck.triggerTags && todayCheck.triggerTags.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">{todayCheck.triggerTags.join(' · ')}</p>
              )}
              {todayCheck.note && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic line-clamp-2">"{todayCheck.note}"</p>}
            </div>
            <button onClick={() => onNavigate(ViewState.CHECKIN)} className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold underline">
              Editar
            </button>
          </div>
        )}

        {/* PLANO DO DIA */}
        <button
          onClick={startPlan}
          className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 mb-5 border border-emerald-200 dark:border-emerald-900 text-left flex items-start gap-4 active:scale-[0.98] transition"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900 dark:text-white">{plan.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{plan.message}</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-3">{plan.actionLabel} →</p>
          </div>
        </button>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <button onClick={() => onNavigate(ViewState.CHAT)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left active:scale-[0.97] transition">
            <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Conversar</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{settings.allowAiProcessing ? `${msgsLeft} mensagens hoje` : 'Ative IA nos ajustes'}</p>
          </button>

          <button onClick={() => onNavigate(ViewState.EXERCISES)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left active:scale-[0.97] transition">
            <Wind className="w-6 h-6 text-sky-600 dark:text-sky-400 mb-2" />
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Exercícios</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{todayExercises.length} feitos hoje</p>
          </button>

          <button onClick={() => onNavigate(ViewState.TRAILS)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left active:scale-[0.97] transition">
            <Map className="w-6 h-6 text-violet-600 dark:text-violet-400 mb-2" />
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Trilhas</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">7, 14 e 21 dias</p>
          </button>

          <button onClick={() => onNavigate(ViewState.DIARY)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left active:scale-[0.97] transition">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Meu Diário</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Escreva o que sentiu hoje</p>
          </button>

          <button onClick={() => onNavigate(ViewState.INSIGHTS)} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left active:scale-[0.97] transition">
            <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Insights</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Padrões, sem diagnóstico</p>
          </button>

          <button onClick={() => onNavigate(ViewState.SOS)} className="bg-red-50 dark:bg-red-950/30 p-4 rounded-2xl border border-red-200 dark:border-red-900 text-left active:scale-[0.97] transition">
            <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
            <p className="font-semibold text-red-900 dark:text-red-200 text-sm">SOS Ansiedade</p>
            <p className="text-xs text-red-700/80 dark:text-red-300/80">Ajuda agora</p>
          </button>
        </div>

        {/* HUMOR DA SEMANA */}
        {last7.length >= 2 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Sua semana</p>
              </div>
              {avg && <span className="text-xs text-slate-500">Média {avg}/5</span>}
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {last7.map((c, i) => {
                const m = MOOD_META[c.mood];
                const height = (m.score / 5) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md transition-all" style={{ height: `${height}%`, backgroundColor: m.color, minHeight: '10px' }} />
                    <span className="text-[10px] text-slate-400">{m.emoji}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA PLUS */}
        {!settings.isPro && (
          <button onClick={() => onNavigate(ViewState.PAYWALL)} className="w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white p-4 rounded-2xl text-left flex items-center justify-between shadow-lg shadow-fuchsia-500/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Plus</p>
              </div>
              <p className="font-semibold">Chat ampliado + trilhas guiadas + PDF</p>
              <p className="text-xs opacity-90">A partir de R$ 9,90/mês no plano anual</p>
            </div>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;
