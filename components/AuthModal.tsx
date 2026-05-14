import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../services/firebaseAuth';
import { isFirebaseConfigured } from '../services/firebase';
import { trackSafeEvent } from '../services/analytics';

interface Props {
  onClose: () => void;
  onSuccess: (email: string) => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<Props> = ({ onClose, onSuccess, initialMode = 'signup' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ready = isFirebaseConfigured();

  const submit = async () => {
    setErr(null);
    if (!email.includes('@') || pass.length < 6) {
      setErr('Email válido e senha com 6+ caracteres.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email.trim(), pass);
        trackSafeEvent('auth_signup', {});
      } else {
        await signInWithEmail(email.trim(), pass);
        trackSafeEvent('auth_signin', {});
      }
      onSuccess(email.trim());
      onClose();
    } catch (e: any) {
      const code = String(e?.code || '');
      if (code.includes('email-already-in-use')) setErr('Esse email já tem conta. Use "Entrar".');
      else if (code.includes('invalid-credential') || code.includes('wrong-password')) setErr('Email ou senha incorretos.');
      else if (code.includes('weak-password')) setErr('Senha precisa ter no mínimo 6 caracteres.');
      else if (code.includes('user-not-found')) setErr('Conta não encontrada. Crie uma.');
      else setErr('Não foi possível concluir. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full md:max-w-md md:rounded-3xl rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'signup' ? 'Criar conta' : 'Entrar'}
          </h2>
          <button onClick={onClose} className="p-2 -m-2 text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          {mode === 'signup'
            ? 'Conta gratuita para sincronizar entre aparelhos. Sem compartilhar com terceiros.'
            : 'Use o email e senha que você cadastrou.'}
        </p>

        {!ready && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-3 mb-4 text-xs text-amber-900 dark:text-amber-100">
            Firebase não está configurado neste ambiente. Preencha `.env.local` com `VITE_FIREBASE_*` para habilitar login.
          </div>
        )}

        <label className="block text-xs text-slate-500 mb-1">Email</label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 mb-3 border border-slate-200 dark:border-slate-700">
          <Mail className="w-4 h-4 text-slate-400" />
          <input
            type="email" autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white"
          />
        </div>

        <label className="block text-xs text-slate-500 mb-1">Senha (mín. 6)</label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 mb-4 border border-slate-200 dark:border-slate-700">
          <Lock className="w-4 h-4 text-slate-400" />
          <input
            type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={pass} onChange={e => setPass(e.target.value)}
            placeholder="••••••"
            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white"
          />
        </div>

        {err && <p className="text-sm text-rose-500 mb-3">{err}</p>}

        <button
          onClick={submit} disabled={busy || !ready}
          className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'signup' ? 'Criar conta' : 'Entrar'}
        </button>

        <p className="text-center text-sm mt-4 text-slate-500">
          {mode === 'signup' ? 'Já tem conta?' : 'É novo por aqui?'}{' '}
          <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setErr(null); }} className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {mode === 'signup' ? 'Entrar' : 'Criar conta'}
          </button>
        </p>

        <p className="flex items-start gap-2 text-[11px] text-slate-400 mt-5 leading-relaxed">
          <ShieldCheck className="w-3 h-3 mt-0.5 shrink-0" />
          Sem login, seus dados ficam só neste aparelho. Com conta, podem ser sincronizados via Firebase (criptografia em trânsito).
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
