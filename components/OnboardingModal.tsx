import React, { useState } from 'react';
import { Shield, AlertTriangle, Check, Heart, Bot, ArrowRight } from 'lucide-react';
import { APP_NAME, DISCLAIMER } from '../constants';

interface Props {
  onComplete: (data: { name: string; consentLGPD: boolean; ageConfirmed: boolean; allowAiProcessing: boolean }) => void;
}

const OnboardingModal: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(false);
  const [consent, setConsent] = useState(false);
  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);
  const [allowAiProcessing, setAllowAiProcessing] = useState(false);
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

  const canFinish = age && consent && acceptDisclaimer;

  return (
    <div className="fixed inset-0 z-50 mesh-bg flex items-center justify-center p-4 overflow-y-auto">
      {/* Blobs decorativos */}
      <div aria-hidden className="pointer-events-none absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-300/30 blur-[100px] animate-float" />
      <div aria-hidden className="pointer-events-none absolute bottom-10 right-10 w-72 h-72 rounded-full bg-emerald-200/30 blur-[100px] animate-float-slow" />

      <div className="relative max-w-md w-full glass-strong rounded-[2rem] shadow-brand-glow p-6 md:p-8 my-8">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? 'w-8 bg-gradient-to-r from-brand-500 to-brand-700' : s < step ? 'w-1.5 bg-brand-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="relative mx-auto w-20 h-20 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-300 to-brand-600 rounded-full blur-xl opacity-40 animate-breathe" />
          <img src={asset('icon.svg')} alt="" className="relative w-20 h-20" />
        </div>

        {step === 1 && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-2 tracking-tight">
              Bem-vindo ao <span className="font-serif italic text-brand-gradient">{APP_NAME}</span>
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-6 text-sm">
              Antes de começar, quero te apresentar algumas coisas importantes pra você se sentir seguro(a).
            </p>
            <div className="space-y-3 mb-6">
              {[
                { icon: Shield, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',  text: 'Check-ins, diário e histórico ficam salvos no seu dispositivo por padrão.' },
                { icon: Bot,    color: 'text-sky-500 bg-sky-50 dark:bg-sky-900/30',              text: 'Se você ativar a conversa com IA, suas mensagens serão processadas por um provedor externo para gerar respostas.' },
                { icon: Heart,  color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30',            text: 'Eu sou apoio emocional, não substituo psicólogo nem terapeuta.' },
                { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30', text: <>Em crise grave ou risco imediato: ligue <strong>CVV 188</strong>, <strong>SAMU 192</strong> ou alguém de confiança.</> },
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                    <b.icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full rounded-2xl py-3.5 inline-flex items-center justify-center gap-2">
              Entendi, continuar <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 text-center tracking-tight">
              Como devo te <span className="font-serif italic text-brand-gradient">chamar?</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">Pode ser um apelido. Fica só no seu celular.</p>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white mb-5 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition"
            />
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-ghost rounded-2xl py-3.5 px-5">Voltar</button>
              <button
                onClick={() => setStep(3)}
                disabled={!name.trim()}
                className="btn-primary flex-1 rounded-2xl py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center tracking-tight">
              Quase lá. <span className="font-serif italic text-brand-gradient">Última coisa.</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 text-center">
              Pra usar o {APP_NAME}, você precisa concordar com os pontos essenciais.
            </p>

            <label className="flex items-start gap-3 cursor-pointer mb-2 p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/70 transition">
              <input type="checkbox" checked={age} onChange={e => setAge(e.target.checked)} className="mt-1 w-4 h-4 accent-brand-600" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Tenho <strong>18 anos ou mais</strong>.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer mb-2 p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/70 transition">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-brand-600" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Autorizo o tratamento de dados conforme a <strong>LGPD</strong>. Posso apagar tudo a qualquer momento.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer mb-2 p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/70 transition">
              <input type="checkbox" checked={acceptDisclaimer} onChange={e => setAcceptDisclaimer(e.target.checked)} className="mt-1 w-4 h-4 accent-brand-600" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Entendo que <strong>este app não substitui psicoterapia</strong> e que devo procurar ajuda humana em caso de crise.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer mb-5 p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/60">
              <input type="checkbox" checked={allowAiProcessing} onChange={e => setAllowAiProcessing(e.target.checked)} className="mt-1 w-4 h-4 accent-sky-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Ativar conversa com IA. Suas mensagens serão processadas por um provedor externo para gerar resposta.</span>
            </label>

            <button
              onClick={() => onComplete({ name: name.trim(), consentLGPD: consent, ageConfirmed: age, allowAiProcessing })}
              disabled={!canFinish}
              className="btn-primary w-full rounded-2xl py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> Começar
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 text-center">{DISCLAIMER}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
