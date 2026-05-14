import React, { useState } from 'react';
import { Mood, MOOD_META, CheckIn as CheckInT } from '../types';
import { CHECKIN_TRIGGER_TAGS } from '../constants';
import { today } from '../services/date';
import { ArrowLeft, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSave: (c: CheckInT) => void;
  existing?: CheckInT;
}

const CheckIn: React.FC<Props> = ({ onBack, onSave, existing }) => {
  const [mood, setMood] = useState<Mood | null>(existing?.mood ?? null);
  const [energy, setEnergy] = useState(existing?.energy ?? 3);
  const [sleep, setSleep] = useState(existing?.sleep ?? 7);
  const [note, setNote] = useState(existing?.note ?? '');
  const [trigger, setTrigger] = useState(existing?.trigger ?? '');
  const [triggerTags, setTriggerTags] = useState<string[]>(existing?.triggerTags ?? []);

  const toggleTag = (tag: string) => {
    setTriggerTags(tags => tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  };

  const handleSave = () => {
    if (!mood) return;
    const c: CheckInT = {
      id: existing?.id ?? `ci-${Date.now()}`,
      date: today(),
      timestamp: Date.now(),
      mood,
      energy,
      sleep,
      note: note.trim() || undefined,
      trigger: trigger.trim() || undefined,
      triggerTags,
    };
    onSave(c);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Check-in</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-6">
        <section>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Como você se sente agora?</p>
          <div className="grid grid-cols-4 gap-2">
            {Object.values(Mood).map(m => {
              const meta = MOOD_META[m];
              const active = mood === m;
              return (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`p-3 rounded-2xl border-2 transition ${active ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                >
                  <div className="text-3xl mb-1">{meta.emoji}</div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">{meta.label}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Energia hoje</p>
            <span className="text-xs text-slate-500">{energy}/5</span>
          </div>
          <input type="range" min={1} max={5} value={energy} onChange={e => setEnergy(+e.target.value)} className="w-full accent-emerald-500" />
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Horas de sono</p>
            <span className="text-xs text-slate-500">{sleep}h</span>
          </div>
          <input type="range" min={0} max={12} step={0.5} value={sleep} onChange={e => setSleep(+e.target.value)} className="w-full accent-sky-500" />
        </section>

        <section>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">O que pode ter influenciado? <span className="text-xs text-slate-400 font-normal">(opcional)</span></p>
          <div className="flex flex-wrap gap-2 mb-3">
            {CHECKIN_TRIGGER_TAGS.map(tag => {
              const active = triggerTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${active ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <input
            value={trigger}
            onChange={e => setTrigger(e.target.value)}
            placeholder="Outra coisa? Escreva livre..."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
          />
        </section>

        <section>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Anotação rápida <span className="text-xs text-slate-400 font-normal">(opcional)</span></p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="Escreve livre. Ninguém vai ler, só você."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white resize-none"
          />
        </section>

        <button
          onClick={handleSave}
          disabled={!mood}
          className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" /> Salvar check-in
        </button>
      </div>
    </div>
  );
};

export default CheckIn;
