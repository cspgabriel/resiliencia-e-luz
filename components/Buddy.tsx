import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Hand, UserPlus, Copy } from 'lucide-react';
import { BuddyLink, BuddyPing, MOOD_META, UserSettings, Mood } from '../types';
import { listBuddies, linkBuddy, sendPing, fetchBuddyMood, subscribePings, unlinkBuddy } from '../services/buddy';
import { currentUserId } from '../services/firebaseAuth';
import { trackSafeEvent } from '../services/analytics';

interface Props {
  onBack: () => void;
  settings: UserSettings;
}

const PING_OPTIONS: { kind: BuddyPing['kind']; emoji: string; label: string }[] = [
  { kind: 'abraco',     emoji: '🤗', label: 'Abraço' },
  { kind: 'coracao',    emoji: '💛', label: 'Coração' },
  { kind: 'estou_aqui', emoji: '🤝', label: 'Tô aqui' },
  { kind: 'forca',      emoji: '💪', label: 'Força' },
];

const Buddy: React.FC<Props> = ({ onBack, settings }) => {
  const [buddies, setBuddies] = useState<BuddyLink[]>([]);
  const [moods, setMoods] = useState<Record<string, Mood | undefined>>({});
  const [pings, setPings] = useState<BuddyPing[]>([]);
  const [addUid, setAddUid] = useState('');
  const [addName, setAddName] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const myUid = currentUserId();

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    const unsub = subscribePings(setPings);
    return () => unsub();
  }, []);

  const refresh = async () => {
    const list = await listBuddies();
    setBuddies(list);
    const m: Record<string, Mood | undefined> = {};
    await Promise.all(list.map(async b => {
      const r = await fetchBuddyMood(b.buddyUid);
      m[b.buddyUid] = r.mood;
    }));
    setMoods(m);
  };

  const handleAdd = async () => {
    if (!addUid.trim()) return;
    try {
      await linkBuddy(addUid.trim(), addName.trim() || 'dupla');
      setAddUid(''); setAddName('');
      setFeedback('Dupla vinculada ✓');
      trackSafeEvent('buddy_linked');
      refresh();
    } catch (e) {
      setFeedback('Não foi possível vincular (faça login + sync na nuvem)');
    }
  };

  const handlePing = async (b: BuddyLink, kind: BuddyPing['kind']) => {
    try {
      await sendPing(b.buddyUid, kind, settings.name);
      setFeedback(`${kind} enviado para ${b.buddyName}`);
      trackSafeEvent('buddy_ping_sent', { kind });
    } catch {
      setFeedback('Falha ao enviar');
    }
  };

  const handleUnlink = async (b: BuddyLink) => {
    await unlinkBuddy(b.buddyUid);
    refresh();
  };

  const copyMyUid = async () => {
    if (!myUid) return;
    try { await navigator.clipboard.writeText(myUid); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  if (!settings.cloudSyncEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 md:hidden"><ArrowLeft /></button>
          <h1 className="font-bold text-slate-900 dark:text-white">Dupla de cuidado</h1>
        </header>
        <div className="max-w-2xl mx-auto px-5 mt-10 text-center">
          <p className="text-6xl mb-3">🤝</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Para formar dupla, ative <b>"Sincronizar com a nuvem"</b> em Ajustes. Só o emoji do humor é compartilhado — nada de diário ou conversa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 md:hidden"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Dupla de cuidado</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-5">
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Seu ID para receber duplas</h2>
          <div className="flex gap-2">
            <input value={myUid || ''} readOnly className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 text-xs rounded-lg text-slate-700 dark:text-slate-200 font-mono" />
            <button onClick={copyMyUid} className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> {copied ? 'copiado' : 'copiar'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Compartilhe com 1 pessoa de muita confiança. Só o emoji do seu humor diário fica visível.</p>
        </section>

        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" /> Adicionar dupla
          </h2>
          <input value={addUid} onChange={e => setAddUid(e.target.value)} placeholder="ID da pessoa" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-sm rounded-lg mb-2" />
          <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Como vai chamar (apelido)" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-sm rounded-lg mb-2" />
          <button onClick={handleAdd} className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold">Vincular</button>
        </section>

        {feedback && <p className="text-xs text-center text-emerald-600">{feedback}</p>}

        {buddies.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">Sem dupla ainda.</div>
        ) : (
          buddies.map(b => {
            const mood = moods[b.buddyUid];
            return (
              <section key={b.buddyUid} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">{mood ? MOOD_META[mood].emoji : '😶‍🌫️'}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{b.buddyName}</p>
                    <p className="text-xs text-slate-500">{mood ? `Hoje: ${MOOD_META[mood].label}` : 'Sem humor compartilhado'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {PING_OPTIONS.map(p => (
                    <button key={p.kind} onClick={() => handlePing(b, p.kind)} className="py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs">
                      <span className="block text-xl">{p.emoji}</span>
                      <span className="text-slate-600 dark:text-slate-300">{p.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => handleUnlink(b)} className="text-xs text-slate-400 mt-3">Desvincular dupla</button>
              </section>
            );
          })
        )}

        {pings.length > 0 && (
          <section className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2 flex items-center gap-1"><Heart className="w-4 h-4" fill="currentColor" /> Você recebeu</h3>
            <ul className="space-y-2">
              {pings.slice(0, 5).map(p => (
                <li key={p.id} className="text-sm text-slate-700 dark:text-slate-200">
                  {p.kind === 'abraco' && '🤗 Abraço'}
                  {p.kind === 'coracao' && '💛 Coração'}
                  {p.kind === 'estou_aqui' && '🤝 Tô aqui'}
                  {p.kind === 'forca' && '💪 Força'}
                  <span className="text-xs text-slate-500 ml-2">de {p.fromName}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Buddy;
