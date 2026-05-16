import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Copy, Flame,
  Map, Quote, Share2, Sparkles, Target, Users
} from 'lucide-react';
import { TrailProgress, UserSettings, ViewState } from '../types';
import {
  getDailyResiliencePill, getTrailTask, RESILIENCE_CHAPTERS, RESILIENCE_PILLS,
  TRAILS, VIRAL_GROWTH_RESOURCES, XP_EVENTS
} from '../constants';
import { today } from '../services/date';
import { renderCard, shareOrDownload } from '../services/share';
import { recordMetric, recordShare } from '../services/metrics';

interface Props {
  onBack: () => void;
  onNavigate: (v: ViewState) => void;
  settings: UserSettings;
  progress: TrailProgress[];
  onCompleteDay: (trailId: string, day: number) => void;
  onXpGain: (xp: number) => void;
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
};

const ResilienceBible: React.FC<Props> = ({ onBack, onNavigate, settings, progress, onCompleteDay, onXpGain }) => {
  const dailyPill = getDailyResiliencePill(today());
  const [selectedChapter, setSelectedChapter] = useState('todos');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const journey = TRAILS.find(t => t.id === 'jornada-resiliencia-21');
  const journeyProgress = progress.find(p => p.trailId === 'jornada-resiliencia-21');
  const completed = journeyProgress?.completedDays.length || 0;
  const nextDay = Math.min(completed + 1, journey?.days || 21);
  const percent = journey ? Math.round((completed / journey.days) * 100) : 0;

  const filteredPills = useMemo(() => (
    selectedChapter === 'todos'
      ? RESILIENCE_PILLS
      : RESILIENCE_PILLS.filter(p => p.chapter === selectedChapter)
  ), [selectedChapter]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2200);
  };

  const handleShareDaily = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await renderCard({
        title: dailyPill.title,
        body: dailyPill.shareText,
        palette: dailyPill.palette,
        footer: 'resiliencia-e-luz.vercel.app',
        badge: `Dia ${dailyPill.day}`,
      });
      await shareOrDownload(blob, `pilula-resiliencia-${today()}.png`, dailyPill.shareText);
      recordShare('resilience_bible_daily_card', settings);
      onXpGain(XP_EVENTS.card_shared);
      showNotice('Card pronto para compartilhar');
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async (text: string, kind: string) => {
    await copyText(text);
    recordMetric('resilience_copy', { kind }, settings);
    showNotice('Texto copiado');
  };

  return (
    <div className="min-h-screen mesh-soft pb-28 md:pb-12 relative overflow-x-hidden">
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[360px] h-[360px] rounded-full bg-amber-200/20 blur-[120px]" />

      <header className="max-w-5xl mx-auto px-5 pt-6 flex items-center gap-3 relative min-w-0">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
          <ArrowLeft />
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Bíblia da Resiliência</p>
          <h1 className="font-bold text-slate-900 dark:text-white text-2xl">Pílulas diárias para atravessar melhor o dia</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 mt-5 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 relative min-w-0">
        <section className="min-w-0 rounded-3xl p-6 md:p-7 text-slate-900 shadow-brand-soft border border-white/50" style={{ background: `linear-gradient(135deg, ${dailyPill.palette[0]}, ${dailyPill.palette[1]})` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-700/80">Leitura de hoje · dia {dailyPill.day}</p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl leading-tight">{dailyPill.title}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center shrink-0">
              <Quote className="w-6 h-6 text-brand-700" />
            </div>
          </div>

          <p className="mt-6 font-serif text-2xl leading-snug">"{dailyPill.text}"</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <div className="bg-white/65 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Reflexão</p>
              <p className="mt-2 text-sm text-slate-800">{dailyPill.reflection}</p>
            </div>
            <div className="bg-white/65 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Prática</p>
              <p className="mt-2 text-sm text-slate-800">{dailyPill.practice}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={handleShareDaily} disabled={busy} className="btn-primary rounded-full px-5 py-3 inline-flex items-center justify-center gap-2 min-w-0">
              <Share2 className="w-4 h-4" /> {busy ? 'Preparando' : 'Compartilhar card'}
            </button>
            <button onClick={() => handleCopy(dailyPill.shareText, 'daily_pill')} className="btn-ghost rounded-full px-5 py-3 inline-flex items-center justify-center gap-2 min-w-0">
              <Copy className="w-4 h-4" /> Copiar frase
            </button>
          </div>
        </section>

        <aside className="glass-strong rounded-3xl p-5 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Jornada central</p>
              <h2 className="font-bold text-slate-900 dark:text-white">21 dias de resiliência</h2>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{completed}/{journey?.days || 21} dias</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div className="mt-5 bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Dia {nextDay}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{getTrailTask('jornada-resiliencia-21', nextDay)}</p>
            {journey && completed < journey.days ? (
              <button onClick={() => onCompleteDay('jornada-resiliencia-21', nextDay)} className="mt-4 w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-3 rounded-2xl flex items-center justify-center gap-2 transition">
                <CheckCircle2 className="w-4 h-4" /> Marcar dia como feito
              </button>
            ) : (
              <div className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Jornada concluída
              </div>
            )}
          </div>

          <button onClick={() => onNavigate(ViewState.TRAILS)} className="mt-4 w-full text-sm font-semibold text-brand-700 dark:text-brand-200 inline-flex items-center justify-center gap-2">
            Ver todas as jornadas <ArrowRight className="w-4 h-4" />
          </button>
        </aside>

        <section className="lg:col-span-2 glass-strong rounded-3xl p-5 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Capítulos</p>
              <h2 className="font-bold text-slate-900 dark:text-white text-xl">Leia como uma bíblia online de motivação diária</h2>
            </div>
            <BookOpen className="w-6 h-6 text-brand-600 dark:text-brand-300 shrink-0" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {RESILIENCE_CHAPTERS.map(chapter => (
              <button
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                  selectedChapter === chapter.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                {chapter.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 min-w-0">
            {filteredPills.map(pill => (
              <article key={pill.id} className="bg-white/75 dark:bg-slate-800/75 rounded-2xl p-4 border border-white/70 dark:border-slate-700/70 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">Dia {pill.day}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{RESILIENCE_CHAPTERS.find(c => c.id === pill.chapter)?.label}</span>
                </div>
                <h3 className="mt-2 font-bold text-slate-900 dark:text-white">{pill.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">"{pill.text}"</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => handleCopy(pill.shareText, 'pill_list')} className="flex-1 px-3 py-2 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 text-xs font-semibold inline-flex items-center justify-center gap-1">
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </button>
                  <button onClick={() => handleCopy(`${pill.title}\n\n${pill.text}\n\n${pill.practice}`, 'pill_practice')} className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center justify-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Prática
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 min-w-0">
          {VIRAL_GROWTH_RESOURCES.map(item => {
            const text = item.template.replace('{pill}', dailyPill.shareText);
            return (
              <button key={item.id} onClick={() => handleCopy(text, item.id)} className="glass rounded-2xl p-4 text-left hover:-translate-y-0.5 transition">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center mb-3">
                  {item.id === 'desafio-7' ? <Users className="w-5 h-5 text-white" /> : item.id === 'status-24h' ? <Flame className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-brand-200">
                  {item.cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </section>
      </main>

      {notice && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-sm">
          {notice}
        </div>
      )}
    </div>
  );
};

export default ResilienceBible;
