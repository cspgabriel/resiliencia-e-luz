import React, { useState, useMemo } from 'react';
import { DiaryEntry, UserSettings, CheckIn, MOOD_META } from '../types';
import { ArrowLeft, Plus, Trash2, Lock } from 'lucide-react';
import { FREE_LIMITS, PAYWALL_REASONS, ADS_DIARY_EVERY_N } from '../constants';
import { today, formatShortDatePtBr } from '../services/date';
import AdSlot from './AdSlot';

interface Props {
  onBack: () => void;
  entries: DiaryEntry[];
  checkins: CheckIn[];
  settings: UserSettings;
  onSave: (e: DiaryEntry) => void;
  onDelete: (id: string) => void;
  onUpgrade: () => void;
}

const DAILY_PROMPTS = [
  'Como foi seu dia? O que mais te marcou?',
  'O que tá pesando na cabeça agora?',
  '3 coisas que você foi grato hoje',
  'Algo que você fez bem hoje',
  'Uma coisa que aprendeu sobre você',
  'O que você precisava ouvir hoje?',
];

const Diary: React.FC<Props> = ({ onBack, entries, checkins, settings, onSave, onDelete, onUpgrade }) => {
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState('');
  const [prompt] = useState(DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)]);

  const cutoff = useMemo(() => {
    if (settings.isPro) return 0;
    const d = new Date();
    d.setDate(d.getDate() - FREE_LIMITS.diaryDaysHistory);
    return d.getTime();
  }, [settings.isPro]);

  const visible = settings.isPro ? entries : entries.filter(e => e.timestamp >= cutoff);
  const hidden = entries.length - visible.length;

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({
      id: `d-${Date.now()}`,
      date: today(),
      timestamp: Date.now(),
      prompt, content: text.trim(),
    });
    setText('');
    setWriting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <div className="flex-1">
          <h1 className="font-bold text-slate-900 dark:text-white text-xl">Meu Diário</h1>
          <p className="text-xs text-slate-500">{entries.length} entradas</p>
        </div>
        <button onClick={() => setWriting(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Escrever
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-4 space-y-3">
        {writing && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-emerald-500">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">{prompt}</p>
            <textarea
              autoFocus value={text} onChange={e => setText(e.target.value)}
              rows={6}
              placeholder="Escreve livre..."
              className="w-full bg-transparent border-none focus:outline-none text-slate-900 dark:text-white resize-none text-sm"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => { setWriting(false); setText(''); }} className="px-4 py-2 text-sm text-slate-500">Cancelar</button>
              <button onClick={handleSave} disabled={!text.trim()} className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-full disabled:opacity-40">Salvar</button>
            </div>
          </div>
        )}

        {visible.length === 0 && !writing && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-sm">Você ainda não escreveu nada.</p>
            <p className="text-xs mt-1">Escrever ajuda a organizar sentimentos. Tente.</p>
          </div>
        )}

        {visible.map((e, idx) => {
          const ci = checkins.find(c => c.date === e.date);
          const showAd = idx > 0 && idx % ADS_DIARY_EVERY_N === 0;
          return (
            <React.Fragment key={e.id}>
              {showAd && <AdSlot slotId={`diary_inline_${idx}`} format="native" settings={settings} onUpgrade={onUpgrade} />}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-slate-500">{formatShortDatePtBr(e.timestamp)}</p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{e.prompt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ci && <span className="text-2xl">{MOOD_META[ci.mood].emoji}</span>}
                    <button onClick={() => onDelete(e.id)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{e.content}</p>
              </div>
            </React.Fragment>
          );
        })}

        {hidden > 0 && (
          <button onClick={onUpgrade} className="w-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 rounded-2xl p-5 text-left flex items-center gap-3">
            <Lock className="w-5 h-5 text-violet-500" />
            <div className="flex-1">
              <p className="font-semibold text-violet-900 dark:text-violet-200 text-sm">{hidden} entradas anteriores</p>
              <p className="text-xs text-violet-700 dark:text-violet-300">{PAYWALL_REASONS.DIARY_HISTORY}</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Diary;
