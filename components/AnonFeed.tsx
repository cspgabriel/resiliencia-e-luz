import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Send, ShieldCheck } from 'lucide-react';
import { AnonPost, UserSettings } from '../types';
import { fetchAnonFeed, reactToAnonPost, submitAnonPost, sanitizeAnonText } from '../services/anonFeed';
import { ANON_MAX_LEN } from '../constants';
import { trackSafeEvent } from '../services/analytics';

interface Props {
  onBack: () => void;
  settings: UserSettings;
}

const AnonFeed: React.FC<Props> = ({ onBack, settings }) => {
  const [posts, setPosts] = useState<AnonPost[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [hearted, setHearted] = useState<Set<string>>(new Set());

  useEffect(() => { (async () => setPosts(await fetchAnonFeed()))(); }, []);

  const submit = async () => {
    const check = sanitizeAnonText(input);
    if (!check.ok) { setStatus(check.reason || 'Conteúdo não permitido'); return; }
    const r = await submitAnonPost(input);
    if (r.ok) {
      setInput('');
      setStatus('Enviado para moderação. Em breve aparece no mural ✨');
      trackSafeEvent('anon_post_submitted');
    } else {
      setStatus(r.reason || 'Falha ao enviar');
    }
  };

  const react = async (id: string) => {
    if (hearted.has(id)) return;
    setHearted(prev => new Set(prev).add(id));
    setPosts(prev => prev.map(p => p.id === id ? { ...p, hearts: p.hearts + 1 } : p));
    await reactToAnonPost(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden"><ArrowLeft /></button>
        <div className="flex-1">
          <h1 className="font-bold text-slate-900 dark:text-white">Sentindo junto</h1>
          <p className="text-xs text-slate-500">Mural anônimo · moderado</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-4">
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <p className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 mb-2">
            <ShieldCheck className="w-3 h-3" /> 100% anônimo · sem nome, sem foto
          </p>
          <textarea
            value={input} onChange={e => setInput(e.target.value.slice(0, ANON_MAX_LEN))}
            rows={3}
            placeholder="Algo curto e gentil que você quer dividir hoje…"
            className="w-full bg-slate-50 dark:bg-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">{input.length}/{ANON_MAX_LEN}</span>
            <button onClick={submit} disabled={!input.trim()} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Publicar
            </button>
          </div>
          {status && <p className="text-xs text-slate-500 mt-2">{status}</p>}
        </section>

        {posts.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500">
            Ainda não há posts aprovados aqui. Seja o primeiro a deixar uma palavra gentil.
          </div>
        )}

        {posts.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <p className="text-sm text-slate-800 dark:text-slate-100">{p.text}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-400">anônimo</span>
              <button onClick={() => react(p.id)} className={`flex items-center gap-1 text-xs ${hearted.has(p.id) ? 'text-rose-500' : 'text-slate-500'}`}>
                <Heart className="w-3.5 h-3.5" fill={hearted.has(p.id) ? 'currentColor' : 'none'} /> {p.hearts}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnonFeed;
