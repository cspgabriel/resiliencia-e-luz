import React, { useEffect, useState } from 'react';
import {
  Wind, Moon, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Brain,
  MessageCircle, Sun, Heart, Lock, Smartphone, Star, ChevronDown,
  Activity, BookOpen, Waves, AlertCircle, Award, Zap
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, PRICING, DISCLAIMER } from '../constants';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: MessageCircle, color: 'from-teal-400 to-emerald-500',  title: 'Conversa que acolhe',    text: 'Sereno te escuta em pt-BR, sem julgamento. Trained pra empatia, não pra produtividade.' },
    { icon: Wind,          color: 'from-sky-400 to-cyan-500',       title: 'Respiração guiada',      text: '12 exercícios de TCC, mindfulness e grounding. Funciona offline, no seu ritmo.' },
    { icon: Brain,         color: 'from-violet-400 to-fuchsia-500', title: 'Padrões da sua semana',  text: 'Check-ins viram insights gentis sobre sono, energia e gatilhos — sem rótulo clínico.' },
    { icon: Moon,          color: 'from-indigo-400 to-purple-500',  title: 'Trilhas de 7 a 21 dias', text: 'Programas curtos pra calma, sono, autoestima e raiva. Um passo pequeno por dia.' },
    { icon: BookOpen,      color: 'from-rose-400 to-pink-500',      title: 'Diário inteligente',     text: 'Escreva como pensa. O app organiza, sem expor seus segredos pra ninguém.' },
    { icon: AlertCircle,   color: 'from-amber-400 to-orange-500',   title: 'SOS com proteção real',  text: 'Detector de crise + CVV 188, SAMU 192 e contato de confiança a um toque.' },
  ];

  const trust = [
    { icon: Lock,        text: 'Dados no seu device' },
    { icon: ShieldCheck, text: 'LGPD-compliant' },
    { icon: Smartphone, text: 'Funciona offline' },
    { icon: Heart,      text: 'Sem ads, sem venda de dados' },
  ];

  const steps = [
    { n: '01', title: 'Check-in em 30 segundos',   text: 'Você diz como tá. Humor, sono, energia e o que pegou.' },
    { n: '02', title: 'Plano gentil pra hoje',     text: 'O app sugere 1 exercício ou prática, do tamanho do seu dia.' },
    { n: '03', title: 'Volta amanhã, sem cobrança', text: 'Streak gentil, freezes e insights que aparecem com o tempo.' },
  ];

  const testimonials = [
    { name: 'Mariana, 27',  loc: 'São Paulo',     stars: 5, text: 'Era pra ser só pra testar. Hoje é a primeira coisa que abro de manhã. Não me sinto cobrada, me sinto cuidada.' },
    { name: 'Rafael, 34',   loc: 'Rio de Janeiro', stars: 5, text: 'Eu sofria de insônia há anos. O ritual noturno + os exercícios de respiração mudaram a minha relação com o sono.' },
    { name: 'Camila, 22',   loc: 'Recife',         stars: 5, text: 'O melhor é que ele não tenta me consertar. Ele só escuta. E quando preciso de ajuda real, ele me direciona pra ajuda real.' },
  ];

  const faqs = [
    { q: 'O Serenamente substitui psicólogo ou psiquiatra?', a: 'Não. É apoio emocional do dia a dia — pra organizar sentimentos, respirar, dormir melhor. Não diagnostica, não trata e não substitui acompanhamento profissional. Em crise, direcionamos pra CVV 188, SAMU 192 ou contato de confiança.' },
    { q: 'Meus dados ficam onde?',                            a: 'Por padrão, tudo (check-ins, diário, histórico) fica salvo só no seu dispositivo. Se você ativar sincronização na nuvem, o dado vai criptografado pro Firebase. Você pode apagar tudo a qualquer momento em Ajustes → Apagar dados.' },
    { q: 'Como funciona a IA? Ela aprende com o que eu digo?', a: 'A conversa com IA é opt-in (você ativa quando quiser). As mensagens passam por um provedor externo (Google Gemini) só pra gerar a resposta. Não treinamos modelos com seu conteúdo e não vendemos seus dados.' },
    { q: 'Preciso pagar pra começar?',                        a: 'Não. O plano grátis tem check-in ilimitado, 5 exercícios essenciais, 8 mensagens/dia com a IA, diário de 7 dias e 1 trilha completa. Plus é opcional pra quem quer mais profundidade.' },
    { q: 'Funciona offline?',                                 a: 'Sim. Como é um PWA leve, o app fica disponível mesmo sem internet pra check-in, diário, exercícios e leitura do histórico. A IA precisa de conexão pra responder.' },
    { q: 'E se eu estiver em crise agora?',                    a: 'Abre o SOS direto na tela inicial: tem respiração guiada, contatos de emergência (CVV 188, SAMU 192), e você pode adicionar uma pessoa de confiança. Em risco imediato: ligue 188 ou 192 antes de qualquer coisa.' },
  ];

  return (
    <div className="min-h-screen mesh-bg relative overflow-x-hidden">
      {/* Blobs decorativos */}
      <div aria-hidden className="pointer-events-none absolute top-0 -left-20 w-[480px] h-[480px] rounded-full bg-brand-300/30 blur-[120px] animate-float-slow" />
      <div aria-hidden className="pointer-events-none absolute top-40 -right-20 w-[420px] h-[420px] rounded-full bg-emerald-200/40 blur-[100px] animate-float" />
      <div aria-hidden className="pointer-events-none absolute top-[60%] left-1/4 w-[360px] h-[360px] rounded-full bg-sky-200/30 blur-[100px] animate-float-slow" />

      {/* ===== HEADER ===== */}
      <header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'glass-strong shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-400 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition" />
              <img src="/icon.svg" alt="" className="relative w-10 h-10" />
            </div>
            <span className="font-bold text-brand-700 dark:text-brand-200 text-lg tracking-tight">{APP_NAME}</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features"   className="hover:text-brand-700 dark:hover:text-brand-200 transition">Recursos</a>
            <a href="#how"        className="hover:text-brand-700 dark:hover:text-brand-200 transition">Como funciona</a>
            <a href="#vs"         className="hover:text-brand-700 dark:hover:text-brand-200 transition">Diferencial</a>
            <a href="#pricing"    className="hover:text-brand-700 dark:hover:text-brand-200 transition">Planos</a>
            <a href="#faq"        className="hover:text-brand-700 dark:hover:text-brand-200 transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onStart} className="hidden sm:inline-flex text-sm font-semibold text-brand-700 dark:text-brand-200 hover:underline px-3 py-2">
              Entrar
            </button>
            <button onClick={onStart} className="btn-primary rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2">
              Começar grátis <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="top" className="relative max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* COL ESQ */}
          <div className="lg:col-span-7">
            <div className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-brand-700 dark:text-brand-200 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Apoio emocional com IA · feito no Brasil
            </div>

            <h1 className="reveal reveal-1 text-4xl sm:text-5xl lg:text-[64px] leading-[1.05] font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Sua mente em paz, <br className="hidden sm:block" />
              <span className="font-serif italic text-brand-gradient">todo dia.</span>
            </h1>

            <p className="reveal reveal-2 text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl leading-relaxed">
              Converse, respire, organize seus pensamentos.
              <span className="text-slate-800 dark:text-slate-100 font-medium"> Um espaço só seu pra cuidar da mente</span> — sem julgamento, sem cobrança, sem promessas vazias.
            </p>

            <div className="reveal reveal-3 flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={onStart} className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base">
                Começar grátis agora <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#how" className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base">
                Como funciona
              </a>
            </div>

            <div className="reveal reveal-4 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sem cartão
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Funciona offline
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Em 30 segundos
              </div>
            </div>

            {/* Prova social inline */}
            <div className="reveal reveal-5 mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {['#5EB8B3','#A7F3D0','#BFDBFE','#FBCFE8','#FDE68A'].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${c}, #1A6B73)` }}>
                    {['M','R','C','J','L'][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  <span className="text-slate-700 dark:text-slate-200 font-semibold ml-1">4.9</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">+12 mil pessoas cuidando da mente</p>
              </div>
            </div>
          </div>

          {/* COL DIR — MOCKUP CHAT */}
          <div className="lg:col-span-5 relative">
            <div className="reveal reveal-3 relative mx-auto max-w-sm lg:max-w-none">
              {/* Glow */}
              <div aria-hidden className="absolute -inset-6 bg-gradient-to-tr from-brand-400/40 via-emerald-300/30 to-sky-300/30 rounded-[3rem] blur-3xl animate-breathe" />

              {/* Frame do "celular" */}
              <div className="relative glass-strong rounded-[2.5rem] p-3 shadow-brand-glow">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-white/60 dark:border-slate-700/60">
                  {/* Status bar fake */}
                  <div className="flex items-center justify-between px-6 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-2 rounded-sm bg-slate-700/80 dark:bg-slate-300/80" />
                      <span className="w-1 h-1 rounded-full bg-slate-700/80 dark:bg-slate-300/80" />
                    </div>
                  </div>

                  {/* Header do chat */}
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Sereno</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">online · acolhedor</p>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Mensagens */}
                  <div className="p-5 space-y-3 bg-gradient-to-b from-brand-50/40 to-sky-50/40 dark:from-slate-900 dark:to-slate-800 min-h-[340px]">
                    {/* user */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-gradient-to-br from-brand-600 to-brand-700 text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-sm">
                        <p className="text-sm">Tô meio sobrecarregada hoje, ansiedade alta…</p>
                      </div>
                    </div>
                    {/* sereno */}
                    <div className="flex justify-start">
                      <div className="max-w-[88%] bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700">
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          Faz sentido se sentir assim com tanta coisa em cima. Antes da gente conversar, que tal 2 minutos de respiração 4-7-8?
                        </p>
                      </div>
                    </div>
                    {/* card de ação */}
                    <div className="flex justify-start">
                      <div className="max-w-[88%] glass rounded-2xl p-3 flex items-center gap-3 border border-brand-200 dark:border-brand-700">
                        <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center">
                          <Wind className="w-5 h-5 text-brand-700 dark:text-brand-200" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">Respiração 4-7-8</p>
                          <p className="text-[11px] text-slate-500">2 min · reduz ativação</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                      </div>
                    </div>
                    {/* typing */}
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex gap-1.5 items-center">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input fake */}
                  <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <div className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-400">Conta pra mim…</div>
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card flutuante: streak */}
              <div className="hidden lg:flex absolute -left-10 top-24 glass rounded-2xl p-3 shadow-glass animate-float w-44 items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl">🔥</div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sequência</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">12 dias</p>
                </div>
              </div>

              {/* Card flutuante: humor */}
              <div className="hidden lg:flex absolute -right-8 bottom-24 glass rounded-2xl p-3 shadow-glass animate-float-slow w-48 items-center gap-3">
                <div className="text-2xl">🌿</div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hoje você está</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Mais calmo(a)</p>
                </div>
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-14 lg:mt-20 glass rounded-2xl p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {trust.map((t, i) => (
            <div key={i} className="flex items-center gap-2.5 justify-center md:justify-start text-sm text-slate-700 dark:text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-800/40 flex items-center justify-center">
                <t.icon className="w-4 h-4 text-brand-700 dark:text-brand-200" />
              </div>
              <span className="font-medium">{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section id="how" className="relative max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300 mb-3">Como funciona</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Três passos pequenos, <span className="font-serif italic text-brand-gradient">todo dia.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Nada de transformação radical. Só um cuidado simples que cabe na sua rotina.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => {
            const StepIcon = [Activity, Heart, Sun][i];
            return (
              <div key={i} className="relative glass rounded-3xl p-7 group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold flex items-center justify-center text-sm shadow-brand-soft">
                  {s.n}
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-800/40 flex items-center justify-center mb-4">
                  <StepIcon className="w-6 h-6 text-brand-700 dark:text-brand-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section id="features" className="relative max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300 mb-3">Recursos</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Tudo o que você precisa, <br /><span className="font-serif italic text-brand-gradient">nada que você não precisa.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="relative group glass rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-glass">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DIFERENCIAL VS CHATGPT ===== */}
      <section id="vs" className="relative max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300 mb-3">Diferencial</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Por que não usar ChatGPT <span className="font-serif italic text-brand-gradient">pra isso?</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Saúde emocional não é tarefa. Precisa de tom, memória e proteção.
          </p>
        </div>

        <div className="glass-strong rounded-3xl p-6 md:p-10 shadow-glass">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {/* ChatGPT */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-slate-500 font-bold text-sm">AI</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-500 dark:text-slate-400 text-sm">ChatGPT genérico</p>
                  <p className="text-[11px] text-slate-400">caixa de entrada vazia</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {['Tom corporativo, lista interminável','Esquece sua semana, conversa solta','Sem detecção de crise','Sem trilhas, sem rituais, sem rotina','Treina IA com o seu desabafo','Sem CVV, sem contatos de emergência'].map((t, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Serenamente */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-tr from-brand-200/40 to-emerald-200/40 dark:from-brand-700/30 dark:to-emerald-700/20 rounded-3xl blur-xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-700 dark:text-brand-200">{APP_NAME}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">acolhedor · em pt-BR</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-100">
                  {['Acolhedor, valida antes de sugerir','Lembra do seu humor, sono e gatilhos','Direciona CVV 188 em crise grave','Trilhas de 7, 14 ou 21 dias','Seu dado fica no celular, sob seu controle','SOS com contato de confiança a um toque'].map((t, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300 mb-3">Quem usa diz</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Pessoas reais, <span className="font-serif italic text-brand-gradient">dias melhores.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-3xl p-7 flex flex-col">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed flex-1 text-[15px]">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3 pt-5 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-300 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Métricas */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: '12k+',  l: 'pessoas cuidando da mente' },
            { n: '4.9★',  l: 'avaliação média' },
            { n: '92%',   l: 'voltam no segundo dia' },
            { n: '0',     l: 'dado vendido. Nunca.' },
          ].map((m, i) => (
            <div key={i} className="glass rounded-2xl p-5 text-center">
              <p className="text-3xl md:text-4xl font-bold text-brand-gradient">{m.n}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="relative max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300 mb-3">Planos</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Comece grátis. <span className="font-serif italic text-brand-gradient">Cresça no seu tempo.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Sem mensalidade abusiva. Sem pegadinha. Cancele quando quiser.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 items-stretch">
          {/* GRÁTIS */}
          <div className="glass rounded-3xl p-7 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Heart className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Grátis</p>
            </div>
            <div className="mb-5">
              <p className="text-5xl font-bold text-slate-900 dark:text-white">R$ 0</p>
              <p className="text-sm text-slate-500 mt-1">para sempre</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200 mb-7 flex-1">
              {['Check-in diário ilimitado','5 exercícios essenciais','Chat com IA — 8 mensagens/dia','Diário dos últimos 7 dias','1 trilha completa (Calma em 7 dias)','SOS e contatos de emergência'].map((t, i) => (
                <li key={i} className="flex gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
            <button onClick={onStart} className="btn-ghost rounded-full px-6 py-3 inline-flex items-center justify-center gap-2">
              Começar grátis <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PLUS */}
          <div className="relative rounded-3xl p-7 md:p-8 flex flex-col text-white overflow-hidden shadow-brand-glow"
               style={{ background: 'linear-gradient(135deg, #0E4D54 0%, #155B62 45%, #1A6B73 100%)' }}>
            <div aria-hidden className="absolute inset-0 dot-grid opacity-20" />
            <div aria-hidden className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest opacity-95">Plus</p>
              </div>
              <span className="text-[10px] font-bold bg-amber-400 text-brand-800 px-2.5 py-1 rounded-full">{PRICING.yearly.savings}</span>
            </div>

            <div className="relative mb-5">
              <p className="text-5xl font-bold">
                R$ {PRICING.monthly.price.toFixed(2).replace('.', ',')}
                <span className="text-base font-normal opacity-80">{PRICING.monthly.suffix}</span>
              </p>
              <p className="text-sm opacity-80 mt-1">
                ou R$ {PRICING.yearly.price.toFixed(2).replace('.', ',')}{PRICING.yearly.suffix} (R$ 9,90/mês equivalente)
              </p>
            </div>

            <ul className="relative space-y-3 text-sm mb-7 flex-1">
              {['Tudo do grátis','Chat ilimitado com Sereno','12 exercícios completos + áudios','Diário ilimitado + gráficos de insights','4 trilhas guiadas (sono, ansiedade, autoestima, raiva)','Exportar PDF pro psicólogo','Sem ads, prioridade no suporte'].map((t, i) => (
                <li key={i} className="flex gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>

            <button onClick={onStart} className="relative bg-white text-brand-700 font-bold rounded-full px-6 py-3 inline-flex items-center justify-center gap-2 hover:bg-amber-50 transition shadow-lg">
              Experimentar Plus 7 dias grátis <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300 mb-3">Dúvidas</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Perguntas <span className="font-serif italic text-brand-gradient">honestas.</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className={`glass rounded-2xl overflow-hidden transition-all ${open ? 'shadow-glass' : ''}`}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span className="font-semibold text-slate-900 dark:text-white text-[15px]">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-brand-600 dark:text-brand-300 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-16 text-center shadow-brand-glow"
             style={{ background: 'linear-gradient(135deg, #0E4D54 0%, #1A6B73 50%, #5EB8B3 100%)' }}>
          <div aria-hidden className="absolute inset-0 dot-grid opacity-20" />
          <div aria-hidden className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl animate-breathe" />
          <div aria-hidden className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl animate-float-slow" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium text-white mb-6">
              <Award className="w-3.5 h-3.5" /> Comece hoje. Sem fricção.
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-5 leading-tight">
              Um pequeno cuidado <br /><span className="font-serif italic">muda o dia inteiro.</span>
            </h2>
            <p className="text-white/85 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Faça seu primeiro check-in em 30 segundos. Sem cartão, sem cadastro complicado.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={onStart} className="bg-white text-brand-700 font-bold rounded-full px-8 py-4 inline-flex items-center justify-center gap-2 hover:bg-amber-50 transition shadow-lg">
                Começar grátis agora <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#how" className="bg-white/15 backdrop-blur text-white font-semibold rounded-full px-8 py-4 inline-flex items-center justify-center gap-2 hover:bg-white/25 transition border border-white/25">
                Ver como funciona
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative max-w-6xl mx-auto px-5 md:px-8 pb-12 pt-8">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <img src="/icon.svg" alt="" className="w-9 h-9" />
                <span className="font-bold text-brand-700 dark:text-brand-200 text-lg">{APP_NAME}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
                Sua mente em paz, todo dia. Apoio emocional diário com IA, feito com cuidado no Brasil.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Produto</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><a href="#features" className="hover:text-brand-700 dark:hover:text-brand-200">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-brand-700 dark:hover:text-brand-200">Planos</a></li>
                <li><a href="#faq" className="hover:text-brand-700 dark:hover:text-brand-200">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Em crise?</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><a href="tel:188" className="hover:text-brand-700 dark:hover:text-brand-200 font-semibold">CVV 188</a></li>
                <li><a href="https://www.cvv.org.br/chat/" target="_blank" rel="noreferrer" className="hover:text-brand-700 dark:hover:text-brand-200">Chat CVV 24h</a></li>
                <li><a href="tel:192" className="hover:text-brand-700 dark:hover:text-brand-200">SAMU 192</a></li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-5">
            {DISCLAIMER}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
            © {new Date().getFullYear()} {APP_NAME} · Feito com cuidado no Brasil 💚
          </p>
        </div>
      </footer>

      {/* CTA sticky mobile */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-30">
        <button onClick={onStart} className="btn-primary w-full rounded-full px-6 py-3.5 inline-flex items-center justify-center gap-2 text-base shadow-2xl">
          Começar grátis <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
