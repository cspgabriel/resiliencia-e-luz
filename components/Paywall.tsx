import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, MessageCircle, Wind, BookOpen, Award, FileDown } from 'lucide-react';
import { PRICING } from '../constants';

interface Props { onBack: () => void; onSubscribe: (plan: 'monthly' | 'yearly') => void; reason?: string; }

const Paywall: React.FC<Props> = ({ onBack, onSubscribe, reason }) => {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-indigo-600 to-violet-600 text-white pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 text-white/90"><ArrowLeft /></button>
      </header>
      <div className="max-w-md mx-auto px-5 pt-4">
        <div className="text-center mb-8">
          <Sparkles className="w-10 h-10 mx-auto mb-3" />
          <h1 className="text-3xl font-bold mb-2">Plus, sem culpa</h1>
          <p className="text-white/90 text-sm">{reason || 'Cuidar de você direito vale isso aqui.'}</p>
        </div>
        <div className="space-y-3 mb-6">
          {[
            { icon: MessageCircle, text: 'Chat ilimitado com Luz' },
            { icon: Wind, text: 'Todos os 12 exercícios + áudios' },
            { icon: BookOpen, text: 'Diário ilimitado + gráficos de humor' },
            { icon: Award, text: '4 trilhas guiadas (sono, ansiedade, autoestima, raiva)' },
            { icon: FileDown, text: 'Exportar PDF pro psicólogo' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/15 backdrop-blur rounded-2xl px-4 py-3">
              <f.icon className="w-5 h-5 shrink-0" />
              <p className="text-sm">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3 mb-6">
          <button onClick={() => setPlan('yearly')} className={`w-full text-left rounded-2xl p-4 border-2 transition ${plan === 'yearly' ? 'bg-white text-slate-900 border-white' : 'bg-white/10 border-white/30'}`}>
            <div className="flex justify-between items-start">
              <div><p className="font-bold">Anual</p><p className="text-xs opacity-80">R$ 9,90/mês cobrado anualmente</p></div>
              <div className="text-right"><p className="font-bold">R$ {PRICING.yearly.price.toFixed(2).replace('.', ',')}</p><span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">{PRICING.yearly.savings}</span></div>
            </div>
          </button>
          <button onClick={() => setPlan('monthly')} className={`w-full text-left rounded-2xl p-4 border-2 transition ${plan === 'monthly' ? 'bg-white text-slate-900 border-white' : 'bg-white/10 border-white/30'}`}>
            <div className="flex justify-between items-center">
              <div><p className="font-bold">Mensal</p><p className="text-xs opacity-80">Cancela quando quiser</p></div>
              <p className="font-bold">R$ {PRICING.monthly.price.toFixed(2).replace('.', ',')}<span className="text-sm font-normal">/mês</span></p>
            </div>
          </button>
        </div>
        <button onClick={() => onSubscribe(plan)} className="w-full bg-white text-indigo-700 font-bold py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-2">
          <Check className="w-5 h-5" /> Assinar Plus
        </button>
        <p className="text-xs text-center text-white/80 mt-4">Pagamento seguro via Stripe ou Mercado Pago.<br />Cancele a qualquer momento, sem multa.</p>
      </div>
    </div>
  );
};

export default Paywall;
