import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Mail, MailOpen, Plus, Trash2, Clock } from 'lucide-react';
import { FutureLetter, UserSettings } from '../types';
import { loadLetters, saveLetter, deleteLetter, markDelivered } from '../services/futureLetter';
import { formatShortDatePtBr } from '../services/date';
import { trackSafeEvent } from '../services/analytics';
import AdSlot from './AdSlot';

interface Props {
  onBack: () => void;
  settings: UserSettings;
  onXpGain: (source: 'letter_written' | 'letter_read') => void;
}

const presetDelays: { label: string; days: number }[] = [
  { label: 'Em 7 dias',    days: 7 },
  { label: 'Em 30 dias',   days: 30 },
  { label: 'Em 90 dias',   days: 90 },
  { label: 'Em 1 ano',     days: 365 },
];

const Letters: React.FC<Props> = ({ onBack, settings, onXpGain }) => {
  const [letters, setLetters] = useState<FutureLetter[]>(loadLetters);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [delayDays, setDelayDays] = useState(30);
  const [reading, setReading] = useState<FutureLetter | null>(null);

  useEffect(() => {
    // ao abrir, marca como entregue as cartas que chegaram a hora
    const due = letters.filter(l => !l.delivered && l.deliverAt <= Date.now());
    (async () => {
      let updated = letters;
      for (const d of due) {
        updated = await markDelivered(d.id, settings);
      }
      if (due.length) setLetters(updated);
    })();
  }, []);

  const due = useMemo(() => letters.filter(l => l.deliverAt <= Date.now()), [letters]);
  const upcoming = useMemo(() => letters.filter(l => l.deliverAt > Date.now()).sort((a, b) => a.deliverAt - b.deliverAt), [letters]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    const letter: FutureLetter = {
      id: `lt-${Date.now()}`,
      createdAt: Date.now(),
      deliverAt: Date.now() + delayDays * 86400000,
      title: title.trim(),
      content: content.trim(),
      delivered: false,
    };
    const next = await saveLetter(letter, settings);
    setLetters(next);
    onXpGain('letter_written');
    trackSafeEvent('letter_written', { days_ahead: delayDays });
    setTitle(''); setContent(''); setComposing(false);
  };

  const handleDelete = async (id: string) => {
    const next = await deleteLetter(id, settings);
    setLetters(next);
  };

  const handleOpen = async (l: FutureLetter) => {
    setReading(l);
    if (!l.openedAt) {
      const next = await markDelivered(l.id, settings);
      setLetters(next);
      onXpGain('letter_read');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden"><ArrowLeft /></button>
        <div className="flex-1">
          <h1 className="font-bold text-slate-900 dark:text-white">Cartas para o futuro</h1>
          <p className="text-xs text-slate-500">Escreva agora. Receba quando precisar lembrar.</p>
        </div>
        <button onClick={() => setComposing(true)} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Nova
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-6">
        {due.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">📬 Chegou para você</h2>
            <div className="space-y-2">
              {due.map(l => (
                <button key={l.id} onClick={() => handleOpen(l)} className="w-full text-left bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 flex items-center gap-3">
                  {l.openedAt ? <MailOpen className="w-5 h-5 text-amber-600" /> : <Mail className="w-5 h-5 text-amber-600" />}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{l.title}</p>
                    <p className="text-xs text-slate-500">Escrita em {formatShortDatePtBr(l.createdAt)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">⏳ Em trânsito</h2>
            <div className="space-y-2">
              {upcoming.map(l => {
                const daysLeft = Math.max(1, Math.ceil((l.deliverAt - Date.now()) / 86400000));
                return (
                  <div key={l.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-sky-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{l.title}</p>
                      <p className="text-xs text-slate-500">Chega em {daysLeft} dias</p>
                    </div>
                    <button onClick={() => handleDelete(l.id)} className="p-2 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {letters.length === 0 && !composing && (
          <div className="text-center py-12">
            <p className="text-6xl mb-3">💌</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              Escreva uma carta hoje. O Sereninho entrega quando você definir — pode ser daqui a 7 dias, 1 ano…
            </p>
          </div>
        )}

        {letters.length > 0 && <AdSlot slotId="letters_list" format="banner" settings={settings} />}
      </div>

      {composing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => setComposing(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Carta para você no futuro</h3>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Assunto (ex: 'Você deu conta')"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white mb-3"
            />
            <textarea
              value={content} onChange={e => setContent(e.target.value)}
              placeholder="Escreva para você daqui a algum tempo. O que você quer lembrar?"
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white mb-3"
            />
            <p className="text-xs text-slate-500 mb-2">Entregar:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {presetDelays.map(p => (
                <button key={p.days} onClick={() => setDelayDays(p.days)} className={`py-2 rounded-xl text-sm ${delayDays === p.days ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setComposing(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm">Cancelar</button>
              <button onClick={handleSave} disabled={!title.trim() || !content.trim()} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50">Selar carta</button>
            </div>
          </div>
        </div>
      )}

      {reading && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center" onClick={() => setReading(null)}>
          <div className="bg-gradient-to-br from-amber-50 to-rose-50 dark:from-slate-800 dark:to-slate-900 rounded-t-3xl md:rounded-3xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <p className="text-xs text-slate-500 mb-1">📬 Carta de {formatShortDatePtBr(reading.createdAt)}</p>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{reading.title}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{reading.content}</p>
            <button onClick={() => setReading(null)} className="w-full mt-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold">Guardar com carinho</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Letters;
