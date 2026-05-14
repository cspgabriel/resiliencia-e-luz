import React, { useEffect, useState, useRef } from 'react';
import { Exercise, DiaryEntry } from '../types';
import { ICON_MAP } from '../constants';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Save } from 'lucide-react';

interface Props {
  exercise: Exercise;
  onBack: () => void;
  onComplete: () => void;
  onSaveDiary?: (e: DiaryEntry) => void;
}

const BreathingCircle: React.FC = () => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [count, setCount] = useState(4);

  useEffect(() => {
    let active = true;
    const run = async () => {
      while (active) {
        for (let i = 4; i >= 1; i--) { if (!active) return; setPhase('in'); setCount(i); await new Promise(r => setTimeout(r, 1000)); }
        for (let i = 7; i >= 1; i--) { if (!active) return; setPhase('hold'); setCount(i); await new Promise(r => setTimeout(r, 1000)); }
        for (let i = 8; i >= 1; i--) { if (!active) return; setPhase('out'); setCount(i); await new Promise(r => setTimeout(r, 1000)); }
      }
    };
    run();
    return () => { active = false; };
  }, []);

  const scale = phase === 'in' ? 'scale-110' : phase === 'hold' ? 'scale-110' : 'scale-75';
  const label = phase === 'in' ? 'Inspire' : phase === 'hold' ? 'Segure' : 'Expire';
  const color = phase === 'in' ? 'from-sky-400 to-emerald-400' : phase === 'hold' ? 'from-emerald-400 to-violet-400' : 'from-violet-400 to-sky-400';

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${color} flex items-center justify-center transition-transform duration-1000 ${scale} shadow-2xl`}>
        <div className="text-white text-center">
          <p className="text-2xl font-semibold">{label}</p>
          <p className="text-5xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
};

const Timer: React.FC<{ minutes: number; onDone?: () => void }> = ({ minutes, onDone }) => {
  const [secs, setSecs] = useState(minutes * 60);
  const [running, setRunning] = useState(true);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(ref.current); onDone?.(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <p className="text-6xl font-bold text-slate-900 dark:text-white tabular-nums">{m}:{s}</p>
      <div className="flex gap-3">
        <button onClick={() => setRunning(r => !r)} className="px-5 py-2 rounded-full bg-emerald-500 text-white font-semibold flex items-center gap-2">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pausar' : 'Continuar'}
        </button>
        <button onClick={() => { setSecs(minutes * 60); setRunning(true); }} className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </button>
      </div>
    </div>
  );
};

const ExerciseDetail: React.FC<Props> = ({ exercise, onBack, onComplete, onSaveDiary }) => {
  const Icon = ICON_MAP[exercise.iconName] || ICON_MAP.Wind;
  const [done, setDone] = useState(false);
  const [diaryText, setDiaryText] = useState('');

  const handleFinish = () => {
    if (diaryText.trim() && onSaveDiary) {
      onSaveDiary({
        id: `d-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        prompt: exercise.title,
        content: diaryText.trim(),
      });
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <div className="flex-1">
          <h1 className="font-bold text-slate-900 dark:text-white">{exercise.title}</h1>
          <p className="text-xs text-slate-500">{exercise.category} · {exercise.duration} min</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-4">
        <p className="text-slate-600 dark:text-slate-300 mb-4">{exercise.description}</p>

        {exercise.hasBreathing && <BreathingCircle />}
        {exercise.hasTimer && !exercise.hasBreathing && <Timer minutes={exercise.duration} onDone={() => setDone(true)} />}

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
          {exercise.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        {(exercise.category === 'Reflexão' || exercise.category === 'Gratidão' || exercise.category === 'Sono') && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Save className="w-4 h-4" /> Anote no seu diário (opcional)
            </p>
            <textarea
              value={diaryText}
              onChange={e => setDiaryText(e.target.value)}
              rows={5}
              placeholder="Escreve aqui o que veio na sua cabeça..."
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-none"
            />
          </div>
        )}

        <button onClick={handleFinish} className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
          <Check className="w-5 h-5" /> Concluir
        </button>
      </div>
    </div>
  );
};

export default ExerciseDetail;
