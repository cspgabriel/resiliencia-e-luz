import React, { useState } from 'react';
import { Shield, AlertTriangle, Check, Heart, Bot } from 'lucide-react';
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

  const canFinish = age && consent && acceptDisclaimer;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8">
        <img src="/icon.svg" alt="" className="w-20 h-20 mx-auto mb-4" />

        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Bem-vindo ao {APP_NAME}</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-6 text-sm">Antes de começar, quero te apresentar algumas coisas importantes pra você se sentir seguro(a).</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-200">Check-ins, diário e histórico ficam salvos no seu dispositivo por padrão.</p>
              </div>
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-200">Se você ativar a conversa com IA, suas mensagens serão processadas por um provedor externo para gerar respostas.</p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-200">Eu sou apoio emocional, não substituo psicólogo nem terapeuta.</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-200">Em crise grave ou risco imediato: ligue <strong>CVV 188</strong>, <strong>SAMU 192</strong> ou alguém de confiança.</p>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 rounded-2xl">Entendi, continuar</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Como devo te chamar?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Pode ser um apelido. Fica só no seu celular.</p>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white mb-5"
            />
            <button onClick={() => setStep(3)} disabled={!name.trim()} className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-40">
              Continuar
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Consentimento</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
              Pra usar o {APP_NAME}, você precisa concordar com os pontos essenciais. A conversa com IA pode ser ativada agora ou depois nos ajustes.
            </p>

            <label className="flex items-start gap-3 cursor-pointer mb-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              <input type="checkbox" checked={age} onChange={e => setAge(e.target.checked)} className="mt-1 w-4 h-4 accent-emerald-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Tenho <strong>18 anos ou mais</strong>.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer mb-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-emerald-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Autorizo o tratamento de dados conforme a <strong>LGPD</strong>. Posso apagar tudo a qualquer momento nas configurações.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer mb-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              <input type="checkbox" checked={acceptDisclaimer} onChange={e => setAcceptDisclaimer(e.target.checked)} className="mt-1 w-4 h-4 accent-emerald-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Entendo que <strong>este app não substitui psicoterapia</strong> e que devo procurar ajuda humana em caso de crise.</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer mb-5 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900">
              <input type="checkbox" checked={allowAiProcessing} onChange={e => setAllowAiProcessing(e.target.checked)} className="mt-1 w-4 h-4 accent-sky-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Ativar conversa com IA. Quando eu enviar uma mensagem no chat, ela poderá ser processada por um provedor externo para gerar resposta.</span>
            </label>

            <button
              onClick={() => onComplete({ name: name.trim(), consentLGPD: consent, ageConfirmed: age, allowAiProcessing })}
              disabled={!canFinish}
              className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 rounded-2xl disabled:opacity-40 flex items-center justify-center gap-2"
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
