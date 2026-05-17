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
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: Sparkles,      color: 'from-amber-400 to-rose-500',     title: 'Sua pílula diária',      text: 'Uma frase que encontra a dor, uma reflexão que organiza o peito e uma prática pequena para hoje.' },
    { icon: BookOpen,      color: 'from-violet-400 to-fuchsia-500', title: 'Temas para o que dói',   text: 'Recomeço, coragem, paz, fé prática, limites e gratidão para quando você não sabe por onde começar.' },
    { icon: Moon,          color: 'from-indigo-400 to-purple-500',  title: 'Jornada de 21 dias',     text: 'Um caminho guiado para voltar a confiar em si, sem pressão, sem cobrança e sem perfeccionismo.' },
    { icon: Zap,           color: 'from-orange-400 to-rose-500',    title: 'Cards que acolhem',      text: 'Compartilhe pílulas nos status ou com alguém que também está segurando muita coisa sozinho.' },
    { icon: MessageCircle, color: 'from-teal-400 to-emerald-500',   title: 'Conversa que não te julga', text: 'A Luz escuta em pt-BR, valida o que você sente e sugere um próximo passo possível.' },
    { icon: AlertCircle,   color: 'from-amber-400 to-orange-500',   title: 'SOS com proteção real',  text: 'Quando passar do limite, o app aponta respiração, CVV 188, SAMU 192 e contato de confiança.' },
  ];

  const trust = [
    { icon: Lock,        text: 'Dados no seu device' },
    { icon: ShieldCheck, text: 'LGPD-compliant' },
    { icon: Smartphone, text: 'Funciona offline' },
    { icon: Heart,      text: 'Acolhimento em 30s' },
  ];

  const steps = [
    { n: '01', title: 'Diga como o dia está pesando', text: 'Sem se explicar demais. Só reconheça o que está apertando por dentro.' },
    { n: '02', title: 'Receba uma pílula para agora', text: 'Frase, reflexão e prática curta para transformar caos em um próximo passo.' },
    { n: '03', title: 'Construa força em sequência',  text: 'A jornada de 21 dias te ajuda a recomeçar pequeno, antes de querer resolver a vida inteira.' },
  ];

  const testimonials = [
    { name: 'Mariana, 27',  loc: 'São Paulo',       stars: 5, text: 'Abro quando acordo com aquele aperto que ninguém vê. A pílula não resolve minha vida, mas me dá um chão para começar o dia.' },
    { name: 'Rafael, 34',   loc: 'Rio de Janeiro',  stars: 5, text: 'Eu vivia empurrando tudo no automático. A jornada me fez parar dois minutos por dia e perceber o que eu estava carregando.' },
    { name: 'Camila, 22',   loc: 'Recife',          stars: 5, text: 'Gosto porque não fala comigo como se eu estivesse quebrada. Parece que entende a bagunça e me entrega um passo pequeno.' },
  ];

  const faqs = [
    { q: 'O Resiliência e Luz substitui psicólogo ou psiquiatra?', a: 'Não. É apoio emocional do dia a dia — para frases, reflexões, respiração e organização de sentimentos. Não diagnostica, não trata e não substitui acompanhamento profissional. Em crise, direcionamos pra CVV 188, SAMU 192 ou contato de confiança.' },
    { q: 'Meus dados ficam onde?',                            a: 'Por padrão, tudo (check-ins, diário, histórico) fica salvo só no seu dispositivo. Se você ativar sincronização na nuvem, o dado vai criptografado pro Firebase. Você pode apagar tudo a qualquer momento em Ajustes → Apagar dados.' },
    { q: 'Como funciona a IA? Ela aprende com o que eu digo?', a: 'A conversa com IA é opt-in (você ativa quando quiser). As mensagens passam por um provedor externo (Google Gemini) só pra gerar a resposta. Não treinamos modelos com seu conteúdo e não vendemos seus dados.' },
    { q: 'Preciso pagar pra começar?',                        a: 'Não. O plano grátis tem pílulas diárias, check-in ilimitado, 5 exercícios essenciais, 8 mensagens/dia com a IA, diário de 7 dias e uma jornada completa. Plus é opcional pra quem quer mais profundidade.' },
    { q: 'Funciona offline?',                                 a: 'Sim. Como é um PWA leve, o app fica disponível mesmo sem internet pra check-in, diário, exercícios e leitura do histórico. A IA precisa de conexão pra responder.' },
    { q: 'E se eu estiver em crise agora?',                    a: 'Abre o SOS direto na tela inicial: tem respiração guiada, contatos de emergência (CVV 188, SAMU 192), e você pode adicionar uma pessoa de confiança. Em risco imediato: ligue 188 ou 192 antes de qualquer coisa.' },
  ];

  return (
    <div className="min-h-screen bg-[#F6FBFA] text-slate-900 dark:bg-[#041112] dark:text-white relative overflow-x-hidden">
      <header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'glass-strong shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-400 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition" />
              <img src={asset('icon.svg')} alt="" className="relative w-10 h-10" />
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

      <section id="top" className="relative max-w-6xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-12 md:pb-16">
        <div className="reveal max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-white/80 text-xs font-semibold text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-950/40 dark:text-emerald-200 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Para dias pesados · pílulas diárias · feito no Brasil
          </div>

          <h1 className="reveal reveal-1 text-4xl sm:text-5xl lg:text-[68px] leading-[1.02] font-bold tracking-tight text-slate-950 dark:text-white mb-6">
            Sua pílula diária <br className="hidden sm:block" />
            <span className="font-serif italic text-brand-gradient">de resiliência.</span>
          </h1>

          <p className="reveal reveal-2 text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Para quando a cabeça pesa, o peito aperta e você precisa de uma frase que não finja que está tudo bem.
            <span className="text-slate-800 dark:text-slate-100 font-medium"> Todo dia, uma reflexão curta e uma prática simples para atravessar melhor o que ninguém vê.</span>
          </p>

          <div className="reveal reveal-3 flex flex-col sm:flex-row gap-3 mb-8">
            <button onClick={onStart} className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base">
              Receber minha pílula de hoje <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#how" className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base">
              Como funciona
            </a>
          </div>

          <div className="reveal reveal-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {['Sem cartão', 'Funciona offline', 'Sem se explicar', '+12 mil pessoas atravessando um dia por vez'].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal reveal-5 mt-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-4 md:gap-5 items-stretch">
          <div className="rounded-2xl bg-[#0B2F35] text-white p-5 md:p-7 shadow-brand-soft overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-100/70 mb-2">Pílula de hoje</p>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight max-w-2xl">
                  Você não é só o que te feriu. Você também é tudo que ainda escolhe florescer.
                </h2>
              </div>
              <BookOpen className="w-8 h-8 text-cyan-200 shrink-0" />
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                { title: 'Reflexão', text: 'O que em você continua escolhendo vida?', icon: Heart },
                { title: 'Prática', text: 'Escreva uma frase curta para repetir hoje.', icon: Activity },
                { title: 'Compartilhar', text: 'Vira card de status sem expor sua dor.', icon: Zap },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/10 p-4">
                  <item.icon className="w-5 h-5 text-cyan-200 mb-3" />
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-sm text-cyan-50/80 mt-1 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Jornada 21 dias</p>
                  <p className="text-lg font-bold text-slate-950 dark:text-white">12 dias concluídos</p>
                </div>
                <Moon className="w-6 h-6 text-brand-600 dark:text-brand-300" />
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full w-[57%] bg-gradient-to-r from-cyan-500 to-emerald-500" />
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">O app puxa você de volta com uma tarefa pequena, não com culpa.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Ritual em 3 passos</p>
              {[
                { label: 'Nomear o peso', icon: Activity },
                { label: 'Regular o corpo', icon: Wind },
                { label: 'Levar uma frase', icon: Sparkles },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-800/40 flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-brand-700 dark:text-brand-200" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{i + 1}. {step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 glass rounded-2xl p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
            Quando estiver pesado, <span className="font-serif italic text-brand-gradient">comece pequeno.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Você não precisa resolver a vida inteira hoje. Precisa só de um próximo passo que caiba no seu fôlego.
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
            Feito para quem sente muito, <br /><span className="font-serif italic text-brand-gradient">mas continua tentando.</span>
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
            Por que uma pílula diária <span className="font-serif italic text-brand-gradient">funciona melhor?</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Porque dor emocional não precisa de palestra. Precisa de reconhecimento, direção pequena e repetição gentil.
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
                    <p className="font-semibold text-slate-500 dark:text-slate-400 text-sm">Conselho genérico</p>
                    <p className="text-[11px] text-slate-400">parece distante da sua dor</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {['Fala bonito, mas não toca no que dói','Dá lista longa quando você mal tem energia','Trata todo cansaço como falta de produtividade','Não cria ritual, sequência ou retorno diário','Não separa apoio emocional de crise real','Não vira uma frase simples para carregar no dia'].map((t, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

              {/* Resiliência e Luz */}
            <div>
              <div>
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
                  {['Começa validando o que você sente','Transforma o peso em uma prática de 2 minutos','Entrega uma pílula diária para repetir quando apertar','Cria jornada de 21 dias para fortalecer constância','Gera cards para compartilhar sem se expor','Direciona CVV 188 e SAMU 192 em crise grave'].map((t, i) => (
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
            Pessoas reais, <span className="font-serif italic text-brand-gradient">dores reais.</span>
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
            { n: '12k+',  l: 'pessoas atravessando dias difíceis' },
            { n: '4.9/5',  l: 'avaliação média' },
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
            Comece grátis. <span className="font-serif italic text-brand-gradient">Recomece no seu ritmo.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Sem pressão. Sem prometer cura. Só um cuidado diário para você não atravessar tudo sozinho.</p>
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
              {['Pílula diária de resiliência','Check-in diário ilimitado','5 exercícios essenciais','Chat com IA — 8 mensagens/dia','Diário dos últimos 7 dias','1 jornada completa de 21 dias','SOS e contatos de emergência'].map((t, i) => (
                <li key={i} className="flex gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
            <button onClick={onStart} className="btn-ghost rounded-full px-6 py-3 inline-flex items-center justify-center gap-2">
              Receber pílula grátis <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PLUS */}
          <div className="relative rounded-3xl p-7 md:p-8 flex flex-col text-white overflow-hidden shadow-brand-glow"
               style={{ background: 'linear-gradient(135deg, #0E4D54 0%, #155B62 45%, #1A6B73 100%)' }}>
            <div aria-hidden className="absolute inset-0 dot-grid opacity-20" />
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
              {['Tudo do grátis','Pílulas e jornadas mais profundas','Chat ilimitado com a Luz','12 exercícios completos + áudios','Diário ilimitado + gráficos de insights','Trilhas guiadas para sono, ansiedade, autoestima e raiva','Exportar PDF para revisar em terapia','Sem ads, prioridade no suporte'].map((t, i) => (
                <li key={i} className="flex gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>

            <button onClick={onStart} className="relative bg-white text-brand-700 font-bold rounded-full px-6 py-3 inline-flex items-center justify-center gap-2 hover:bg-amber-50 transition shadow-lg">
              Aprofundar minha jornada <ArrowRight className="w-4 h-4" />
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
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium text-white mb-6">
              <Award className="w-3.5 h-3.5" /> Comece hoje. Sem fricção.
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-5 leading-tight">
              Você não precisa vencer o dia. <br /><span className="font-serif italic">Só precisa atravessar com cuidado.</span>
            </h2>
            <p className="text-white/85 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Receba uma pílula de resiliência agora. Sem cartão, sem cadastro complicado, sem se explicar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={onStart} className="bg-white text-brand-700 font-bold rounded-full px-8 py-4 inline-flex items-center justify-center gap-2 hover:bg-amber-50 transition shadow-lg">
                Receber pílula grátis <ArrowRight className="w-5 h-5" />
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
                <img src={asset('icon.svg')} alt="" className="w-9 h-9" />
                <span className="font-bold text-brand-700 dark:text-brand-200 text-lg">{APP_NAME}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
                Sua pílula diária de resiliência para quando a vida pesa e você precisa de um próximo passo possível.
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
            © {new Date().getFullYear()} {APP_NAME} · Feito com cuidado no Brasil
          </p>
        </div>
      </footer>

      {/* CTA sticky mobile */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-30">
        <button onClick={onStart} className="btn-primary w-full rounded-full px-6 py-3.5 inline-flex items-center justify-center gap-2 text-base shadow-2xl">
          Receber pílula de hoje <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
