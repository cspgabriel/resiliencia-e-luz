import React, { useMemo, useState } from 'react';
import { ArrowLeft, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CheckIn, DiaryEntry, ExerciseLog, MOOD_META, UserSettings } from '../types';
import { buildWrapped, previousMonthKey } from '../services/wrapped';
import { renderCard, shareOrDownload } from '../services/share';
import { recordShare } from '../services/metrics';
import { trackSafeEvent } from '../services/analytics';

interface Props {
  onBack: () => void;
  checkins: CheckIn[];
  diary: DiaryEntry[];
  exerciseLog: ExerciseLog[];
  settings: UserSettings;
}

const Wrapped: React.FC<Props> = ({ onBack, checkins, diary, exerciseLog, settings }) => {
  const [month, setMonth] = useState<string>(previousMonthKey());
  const [slide, setSlide] = useState(0);

  const data = useMemo(
    () => buildWrapped(month, checkins, diary, exerciseLog, settings.streak?.longest || 0),
    [month, checkins, diary, exerciseLog, settings.streak?.longest],
  );

  const slides = useMemo(() => [
    { title: 'Seu mês em cores', body: `${new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`, emoji: '🎨' },
    { title: 'Você apareceu', body: `${data.checkinsCount} check-ins`, emoji: '👋' },
    { title: 'Você praticou', body: `${data.exercisesCount} exercícios`, emoji: '🌬️' },
    { title: 'Você escreveu', body: `${data.diaryEntries} entradas no diário`, emoji: '📖' },
    { title: 'Humor mais frequente', body: data.topMood ? `${MOOD_META[data.topMood].emoji} ${MOOD_META[data.topMood].label}` : '—', emoji: '🌈' },
    { title: 'Tema do mês', body: data.topTrigger || 'Mês equilibrado', emoji: '🔍' },
    { title: 'Maior sequência', body: `${data.streakRecord} dias seguidos`, emoji: '🔥' },
  ], [data, month]);

  const handleShare = async () => {
    const s = slides[slide];
    const blob = await renderCard({
      title: s.title,
      body: s.body,
      emoji: s.emoji,
      footer: `${new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
      badge: 'Wrapped',
      palette: [data.palette[0], data.palette[1]],
    });
    const r = await shareOrDownload(blob, `serenamente-wrapped-${month}.png`, `Meu mês no Serenamente 🌱`);
    recordShare('wrapped', settings);
    trackSafeEvent('wrapped_shared', { result: r, slide });
  };

  const prevMonth = () => {
    const d = new Date(month + '-01');
    d.setMonth(d.getMonth() - 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    setSlide(0);
  };

  const nextMonth = () => {
    const d = new Date(month + '-01');
    d.setMonth(d.getMonth() + 1);
    const now = new Date();
    if (d > now) return;
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    setSlide(0);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: `linear-gradient(135deg, ${data.palette[0]}, ${data.palette[1]})` }}>
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 md:hidden"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900">Wrapped</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-4 flex items-center justify-between text-sm text-slate-700">
        <button onClick={prevMonth}><ChevronLeft className="w-5 h-5" /></button>
        <span className="font-semibold">{new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
        <button onClick={nextMonth}><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white/90 rounded-3xl p-8 min-h-[480px] flex flex-col items-center justify-center text-center shadow-xl">
          <p className="text-7xl mb-4">{slides[slide].emoji}</p>
          <h2 className="text-2xl font-bold text-slate-900">{slides[slide].title}</h2>
          <p className="mt-4 text-3xl font-serif text-slate-800">{slides[slide].body}</p>
        </div>

        <div className="flex justify-center gap-1.5 mt-4">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-8 bg-slate-900' : 'w-1.5 bg-slate-900/30'}`} />
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={() => setSlide(s => Math.max(0, s - 1))} className="flex-1 py-3 bg-white/80 rounded-xl text-sm font-semibold">‹ Anterior</button>
          <button onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))} className="flex-1 py-3 bg-white/80 rounded-xl text-sm font-semibold">Próximo ›</button>
        </div>

        <button onClick={handleShare} className="w-full mt-3 py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Compartilhar esse momento
        </button>
      </div>
    </div>
  );
};

export default Wrapped;
