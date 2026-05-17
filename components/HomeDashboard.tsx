import React, { useMemo } from 'react';
import { ViewState, CheckIn, MOOD_META, UserSettings, ExerciseLog, Exercise, TrailProgress } from '../types';
import {
  MessageCircle, Wind, BookOpen, AlertCircle, ArrowRight, Sparkles,
  Map, BarChart3, Target, Mail, Trophy, Flame, Star, Quote, CheckCircle2,
  Heart, Send, PenLine, CalendarDays, ShieldCheck, Users
} from 'lucide-react';
import { FREE_LIMITS, getDailyPlan, EXERCISES, getDailyResiliencePill, getTrailTask } from '../constants';
import { today } from '../services/date';
import { computeLevel } from '../services/gamification';
import AdSlot from './AdSlot';

interface Props {
  onNavigate: (v: ViewState) => void;
  onSelectExercise: (e: Exercise) => void;
  checkins: CheckIn[];
  exerciseLog: ExerciseLog[];
  trailProgress: TrailProgress[];
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

const HomeDashboard: React.FC<Props> = ({ onNavigate, onSelectExercise, checkins, exerciseLog, trailProgress, settings }) => {
  const level = computeLevel(settings.totalXp || 0);
  const streak = settings.streak;
  const todayStr = today();
  const todayCheck = checkins.find(c => c.date === todayStr);
  const todayExercises = exerciseLog.filter(e => e.date === todayStr);
  const last7 = useMemo(() => checkins.slice(0, 7).reverse(), [checkins]);
  const dailyPill = getDailyResiliencePill(todayStr);
  const plan = getDailyPlan(todayCheck?.mood, todayCheck?.energy, todayCheck?.sleep);
  const journeyProgress = trailProgress.find(p => p.trailId === 'jornada-resiliencia-21');
  const completedJourneyDays = journeyProgress?.completedDays.length || 0;
  const nextJourneyDay = Math.min(completedJourneyDays + 1, 21);
  const journeyTouchedToday = journeyProgress?.updatedAt
    ? new Date(journeyProgress.updatedAt).toDateString() === new Date().toDateString()
    : false;
  const ritualDone = [Boolean(todayCheck), todayExercises.length > 0, journeyTouchedToday].filter(Boolean).length;
  const ritualPct = Math.round((ritualDone / 3) * 100);
  const avg = last7.length > 0
    ? (last7.reduce((s, c) => s + MOOD_META[c.mood].score, 0) / last7.length).toFixed(1)
    : null;
  const msgsLeft = settings.isPro ? '∞' : Math.max(0, FREE_LIMITS.messagesPerDay - settings.messagesUsedToday);
  const breath = EXERCISES.find(e => e.id === 'resp-478');

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

  const startBreathing = () => {
    if (breath) onSelectExercise(breath);
    else onNavigate(ViewState.EXERCISES);
  };

  const ritualSteps = [
    {
      title: 'Nomear o peso',
      text: todayCheck ? `Você registrou: ${MOOD_META[todayCheck.mood].label}` : 'Check-in de 30 segundos para parar de engolir tudo no automático.',
      done: Boolean(todayCheck),
      action: () => onNavigate(ViewState.CHECKIN),
    },
    {
      title: 'Regular o corpo',
      text: todayExercises.length ? `${todayExercises.length} prática feita hoje` : 'Respiração curta para diminuir a ativação antes de pensar em solução.',
      done: todayExercises.length > 0,
      action: startBreathing,
    },
    {
      title: 'Continuar a jornada',
      text: journeyTouchedToday ? 'Dia da jornada marcado.' : `Dia ${nextJourneyDay}: ${getTrailTask('jornada-resiliencia-21', nextJourneyDay)}`,
      done: journeyTouchedToday,
      action: () => onNavigate(ViewState.TRAILS),
    },
  ];

  const groups = [
    {
      label: 'Aliviar agora',
      note: 'Quando o corpo está acelerado e pensar dói.',
      items: [
        { title: 'Respirar 2 min', sub: 'Baixar o pico agora', icon: Wind, color: 'from-cyan-400 to-sky-500', action: startBreathing },
        { title: 'SOS ansiedade', sub: 'Ajuda humana + grounding', icon: AlertCircle, color: 'from-rose-500 to-red-600', action: () => onNavigate(ViewState.SOS), danger: true },
        { title: 'Falar com a Luz', sub: settings.allowAiProcessing ? `${msgsLeft} mensagens hoje` : 'Ative IA nos ajustes', icon: MessageCircle, color: 'from-emerald-400 to-teal-600', action: () => onNavigate(ViewState.CHAT) },
      ],
    },
    {
      label: 'Entender o que está acontecendo',
      note: 'Dar nome ao que você sente sem transformar isso em sentença.',
      items: [
        { title: 'Check-in', sub: todayCheck ? 'Editar registro de hoje' : 'Começar por uma palavra', icon: Target, color: 'from-blue-500 to-cyan-500', action: () => onNavigate(ViewState.CHECKIN) },
        { title: 'Diário de descarga', sub: 'Tirar da cabeça e pôr no papel', icon: PenLine, color: 'from-indigo-500 to-blue-600', action: () => onNavigate(ViewState.DIARY) },
        { title: 'Padrões', sub: avg ? `Média semanal ${avg}/5` : 'Insights sem diagnóstico', icon: BarChart3, color: 'from-amber-400 to-orange-500', action: () => onNavigate(ViewState.INSIGHTS) },
      ],
    },
    {
      label: 'Voltar amanhã',
      note: 'O app precisa virar ritual, não mais uma cobrança.',
      items: [
        { title: 'Jornada 21 dias', sub: `${completedJourneyDays}/21 concluídos`, icon: Map, color: 'from-violet-500 to-fuchsia-500', action: () => onNavigate(ViewState.TRAILS) },
        { title: 'Carta para você', sub: 'Uma mensagem para o futuro', icon: Mail, color: 'from-rose-400 to-pink-500', action: () => onNavigate(ViewState.LETTERS) },
        { title: 'Conquistas', sub: `Nível ${level.level} · ${level.title}`, icon: Trophy, color: 'from-yellow-400 to-amber-500', action: () => onNavigate(ViewState.ACHIEVEMENTS) },
      ],
    },
    {
      label: 'Compartilhar sem se expor',
      note: 'Levar luz para alguém sem precisar contar sua história inteira.',
      items: [
        { title: 'Pílulas', sub: 'Cards e frases de hoje', icon: Quote, color: 'from-amber-400 to-rose-500', action: () => onNavigate(ViewState.BIBLE) },
        { title: 'Convidar alguém', sub: 'Começar junto por 7 dias', icon: Send, color: 'from-lime-400 to-emerald-500', action: () => onNavigate(ViewState.INVITE) },
        { title: 'Dupla de cuidado', sub: 'Ping simples de presença', icon: Users, color: 'from-teal-400 to-cyan-500', action: () => onNavigate(ViewState.BUDDY) },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FBFA] dark:bg-[#041112] pb-28 md:pb-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-5 md:pt-8">
        <header className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">{greeting()}{settings.name ? `, ${settings.name}` : ''}</p>
            <h1 className="mt-1 text-2xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              Qual peso você quer aliviar primeiro?
            </h1>
          </div>
          <button
            onClick={() => onNavigate(ViewState.COMPANION)}
            className="shrink-0 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-100 dark:border-cyan-900/50 px-3 py-2 shadow-sm flex items-center gap-2"
          >
            <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
            <div className="hidden sm:block text-left">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Nível {level.level}</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{level.title}</p>
            </div>
          </button>
        </header>

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4 md:gap-5">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#071B20] text-white p-5 md:p-7 shadow-2xl">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
                  <Quote className="w-3.5 h-3.5" /> Pílula de hoje
                </span>
                {(streak?.current || 0) > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-300/15 px-3 py-1.5 text-xs font-semibold text-amber-100">
                    <Flame className="w-3.5 h-3.5" /> {streak!.current} dias seguidos
                  </span>
                )}
              </div>
              <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] max-w-2xl">
                {dailyPill.title}
              </h2>
              <p className="mt-5 text-lg md:text-xl text-cyan-50/90 max-w-2xl leading-relaxed">
                "{dailyPill.text}"
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-cyan-100 font-bold">Reflexão</p>
                  <p className="mt-2 text-sm text-white/90">{dailyPill.reflection}</p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-cyan-100 font-bold">Prática</p>
                  <p className="mt-2 text-sm text-white/90">{dailyPill.practice}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={() => onNavigate(ViewState.BIBLE)} className="cursor-pointer rounded-full bg-white text-[#071B20] px-5 py-3 font-bold inline-flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors">
                  Abrir pílula completa <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={startPlan} className="cursor-pointer rounded-full bg-cyan-400/15 text-cyan-50 border border-cyan-200/20 px-5 py-3 font-semibold inline-flex items-center justify-center gap-2 hover:bg-cyan-400/25 transition-colors">
                  {plan.actionLabel} <Target className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-700 dark:text-cyan-300">Ritual de retorno</p>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">3 passos para hoje</h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{ritualDone}/3 concluídos</span>
                <span>{ritualPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${ritualPct}%` }} />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {ritualSteps.map((step) => (
                <button key={step.title} onClick={step.action} className="cursor-pointer w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${step.done ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-950 dark:text-white">{step.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{step.text}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-5 grid md:grid-cols-3 gap-3">
          <button onClick={() => onNavigate(ViewState.CHECKIN)} className="cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-left hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Estado atual</p>
            <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{todayCheck ? MOOD_META[todayCheck.mood].label : 'Ainda sem check-in'}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{todayCheck?.note || 'Registrar o que pesa reduz a confusão.'}</p>
          </button>
          <button onClick={() => onNavigate(ViewState.TRAILS)} className="cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-left hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Jornada</p>
            <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">Dia {nextJourneyDay}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{completedJourneyDays}/21 passos de resiliência.</p>
          </button>
          <button onClick={() => onNavigate(ViewState.ACHIEVEMENTS)} className="cursor-pointer rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-left hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Constância</p>
            <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{streak?.current || 0} dias seguidos</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Voltar conta mais que fazer perfeito.</p>
          </button>
        </section>

        <AdSlot slotId="home_mid" format="banner" settings={settings} onNavigate={onNavigate} />

        <section className="mt-6 space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-end justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">{group.label}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{group.note}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((item) => (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className={`cursor-pointer rounded-3xl p-4 text-left border transition-colors bg-white dark:bg-slate-900 ${
                      item.danger
                        ? 'border-rose-200 dark:border-rose-900/60 hover:border-rose-300'
                        : 'border-slate-200 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {!settings.isPro && (
          <button
            onClick={() => onNavigate(ViewState.PAYWALL)}
            className="cursor-pointer mt-6 w-full rounded-[2rem] bg-gradient-to-r from-[#06252C] via-[#0B4B55] to-[#0F766E] text-white p-5 md:p-6 text-left flex items-center justify-between gap-4 shadow-xl"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-100">
                <ShieldCheck className="w-4 h-4" /> Plus
              </div>
              <p className="mt-2 text-xl font-bold">Mais profundidade quando a rotina começar a virar ritual.</p>
              <p className="text-sm text-white/75 mt-1">Pílulas avançadas, chat maior, trilhas e diário completo.</p>
            </div>
            <ArrowRight className="w-6 h-6 shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;
