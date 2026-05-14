import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserSettings } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { ArrowLeft, Send, AlertCircle, Phone, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DISCLAIMER, FREE_LIMITS, EMERGENCY_CONTACTS } from '../constants';

interface Props {
  onBack: () => void;
  messages: ChatMessage[];
  setMessages: (m: ChatMessage[]) => void;
  settings: UserSettings;
  onLimitReached: () => void;
  onIncrementUsage: () => void;
}

const ChatInterface: React.FC<Props> = ({ onBack, messages, setMessages, settings, onLimitReached, onIncrementUsage }) => {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const greet: ChatMessage = {
        id: 'greet',
        role: 'model',
        text: 'Oi. Tô aqui pra te ouvir, sem pressa. O que tá passando contigo agora?',
        timestamp: Date.now(),
      };
      setMessages([greet]);
    }
  }, []);

  const canSend = settings.isPro || settings.messagesUsedToday < FREE_LIMITS.messagesPerDay;
  const remaining = FREE_LIMITS.messagesPerDay - settings.messagesUsedToday;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy) return;
    if (!canSend) { onLimitReached(); return; }

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, timestamp: Date.now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');

    if (!settings.allowAiProcessing) {
      const consentMsg: ChatMessage = {
        id: `local-${Date.now()}`,
        role: 'model',
        text: 'A conversa com IA está desativada. Suas mensagens não foram enviadas para nenhum provedor externo. Para conversar comigo, ative "Conversa com IA" em Ajustes. Enquanto isso, você ainda pode usar check-in, diário, exercícios e SOS.',
        timestamp: Date.now(),
      };
      setMessages([...updated, consentMsg]);
      return;
    }

    setBusy(true);

    try {
      const result = await sendChatMessage(text, updated);

      const botMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: result.text,
        timestamp: Date.now(),
        flagged: result.flagged,
      };
      setMessages([...updated, botMsg]);

      if (result.flagged) setShowEmergency(true);
      if (!result.bypassedAI) onIncrementUsage();
    } catch (e) {
      const errMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'model',
        text: 'Tive um problema técnico. Tenta de novo em instantes 💛',
        timestamp: Date.now(),
      };
      setMessages([...updated, errMsg]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-900 dark:text-white">Conversa com Sereno</h1>
          <p className="text-xs text-slate-500">{settings.isPro ? 'Plus · ampliado' : `${remaining} mensagens hoje`} · IA {settings.allowAiProcessing ? 'ativa' : 'desativada'}</p>
        </div>
        <button onClick={() => setShowEmergency(true)} title="Ajuda emergencial" className="p-2 text-red-500">
          <Phone className="w-5 h-5" />
        </button>
      </header>

      {!settings.allowAiProcessing && (
        <div className="mx-4 mt-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 rounded-2xl p-3 flex gap-2 text-xs text-sky-900 dark:text-sky-100">
          <Shield className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Privacidade reforçada: o chat com IA está desligado. Nada digitado aqui é enviado para provedor externo enquanto essa opção estiver desativada.</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-emerald-500 text-white rounded-br-sm'
                : m.flagged
                  ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-100 rounded-bl-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-700'
            }`}>
              <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={canSend ? "Escreve o que tá sentindo..." : "Você atingiu o limite de hoje"}
            disabled={!canSend || busy}
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white resize-none max-h-32 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !canSend || busy}
            className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">{DISCLAIMER}</p>
      </div>

      {showEmergency && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => setShowEmergency(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Ajuda profissional</h3>
                <p className="text-xs text-slate-500">Gratuito, sigiloso, 24h</p>
              </div>
            </div>
            <div className="space-y-2">
              {EMERGENCY_CONTACTS.map(c => (
                <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="block bg-slate-50 dark:bg-slate-800 rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{c.name}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">{c.phone}</p>
                  <p className="text-xs text-slate-500">{c.detail}</p>
                </a>
              ))}
            </div>
            <button onClick={() => setShowEmergency(false)} className="w-full mt-4 py-3 text-sm text-slate-600 dark:text-slate-300">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
