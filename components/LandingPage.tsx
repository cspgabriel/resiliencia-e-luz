import React from 'react';
import { Wind, Moon, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Brain, MessageCircle, Sun } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, PRICING, DISCLAIMER } from '../constants';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-cyan-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="Serenamente" className="w-10 h-10" />
          <span className="font-bold text-[#1a6b73] dark:text-teal-200 text-lg tracking-tight">{APP_NAME}</span>
        </div>
        <button onClick={onStart} className="text-sm font-semibold text-[#1a6b73] dark:text-teal-300 hover:underline">
          Entrar
        </button>
      </header>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Apoio emocional com IA · feito no Brasil
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-5">
          {APP_TAGLINE}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Converse, respire, organize seus pensamentos. Um espaço só seu pra cuidar da mente, sem julgamento.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5eb8b3] to-[#1a6b73] hover:from-[#4ea8a3] hover:to-[#155b62] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-emerald-500/30 transition"
        >
          Começar grátis <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Sem cartão. Sem compromisso. Funciona offline.</p>
      </section>

      {/* DIFERENCIAL */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, title: 'Conversa acolhedora', text: 'IA treinada pra te ouvir, não pra te dar sermão.' },
            { icon: Wind,          title: 'Exercícios guiados',   text: '12 práticas de TCC, mindfulness e respiração.' },
            { icon: Brain,         title: 'Diário inteligente',   text: 'Acompanha seu humor e revela padrões.' },
            { icon: Moon,          title: 'Trilhas de bem-estar', text: 'Programas de 7, 14 ou 21 dias com IA.' },
            { icon: ShieldCheck,   title: 'Seus dados, suas regras', text: 'Tudo no seu device. Sem vender pra ninguém.' },
            { icon: Sun,           title: 'Funciona offline',     text: 'PWA leve. Use no celular, sem app gigante.' },
          ].map((f, i) => (
            <div key={i} className="bg-white/70 dark:bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-white/50 dark:border-slate-700/50 shadow-sm">
              <f.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAL VS CHATGPT */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Por que não usar ChatGPT pra isso?
        </h2>
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 border border-white/50 dark:border-slate-700/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400 mb-3">ChatGPT</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>Tom corporativo</li>
                <li>Esquece sua semana</li>
                <li>Sem detecção de crise</li>
                <li>Não tem rituais nem trilhas</li>
                <li>Treina IA com seu desabafo</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-3">{APP_NAME}</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-200">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Acolhedor, em pt-BR</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Lembra do seu humor</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Direciona CVV 188 em crise</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Trilhas de 7/14/21 dias</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Seu dado fica no celular</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PREÇO */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
          Comece grátis. Cresça no seu tempo.
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Sem mensalidade abusiva. Sem pegadinha.</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-white/50 dark:border-slate-700/50">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Grátis</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-4">R$ 0</p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>✓ Check-in diário</li>
              <li>✓ 5 exercícios essenciais</li>
              <li>✓ Chat com IA (8 msgs/dia)</li>
              <li>✓ Diário dos últimos 7 dias</li>
              <li>✓ 1 trilha (Calma em 7 dias)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#5eb8b3] to-[#1a6b73] text-white rounded-2xl p-6 shadow-xl shadow-teal-500/30 relative overflow-hidden">
            <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/25 backdrop-blur px-2 py-1 rounded-full">{PRICING.yearly.savings}</span>
            <p className="text-xs font-semibold uppercase mb-2 opacity-90">Plus</p>
            <p className="text-3xl font-bold mb-1">R$ {PRICING.monthly.price.toFixed(2).replace('.', ',')}<span className="text-base font-normal opacity-80">{PRICING.monthly.suffix}</span></p>
            <p className="text-xs opacity-90 mb-4">ou R$ {PRICING.yearly.price.toFixed(2).replace('.', ',')}{PRICING.yearly.suffix}</p>
            <ul className="space-y-2 text-sm opacity-95">
              <li>✓ Tudo do grátis</li>
              <li>✓ Chat ilimitado</li>
              <li>✓ 12 exercícios completos</li>
              <li>✓ Diário ilimitado + gráficos</li>
              <li>✓ 4 trilhas guiadas</li>
              <li>✓ Exportar PDF pro psicólogo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto px-6 pb-10 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {DISCLAIMER}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
          © {new Date().getFullYear()} {APP_NAME} · Feito com cuidado no Brasil
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
