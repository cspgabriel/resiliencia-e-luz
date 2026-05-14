import React from 'react';
import { ViewState } from '../types';
import { Sparkles, MessageSquare, LayoutDashboard, Zap, Wand2, Lightbulb, HelpCircle, Smartphone, ArrowRight, BarChart3, ShieldCheck } from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (view: ViewState) => void;
  onStartChat: () => void;
  tokensUsed: number;
  isPro: boolean;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, onStartChat, tokensUsed, isPro }) => {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-28 md:pb-12">
      
      {/* Professional Welcome Banner with Richer Gradient */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/10 group border border-white/10">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 bg-slate-900">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-90"></div>
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-full blur-[120px] mix-blend-screen"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
           
           {/* Grid Overlay */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ambiente Profissional v2.0</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white tracking-tight">
            Centralize sua inteligência <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-white">Otimize seus processos.</span>
          </h1>
          <p className="text-indigo-100/80 text-base md:text-lg mb-10 leading-relaxed font-normal max-w-xl">
            Acesse uma biblioteca curada de prompts estruturados para garantir consistência e qualidade nas respostas da IA, ou utilize o modo livre para demandas complexas.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate(ViewState.LIBRARY)}
              className="group bg-white text-indigo-950 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
            >
              <div className="p-1 bg-indigo-100 rounded-lg">
                 <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              </div> 
              <span>Acessar Biblioteca</span>
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1" />
            </button>
            <button 
              onClick={onStartChat}
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3 hover:border-white/20"
            >
              <MessageSquare className="w-5 h-5 text-indigo-300" /> Novo Chat
            </button>
          </div>
        </div>
      </section>

      {/* Status Modules with Distinct Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Account (Emerald/Teal Gradient - Boosted Visibility) */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/80 dark:to-teal-900/60 backdrop-blur-xl p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-700 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">Assinatura</p>
              <p className="text-lg font-bold text-emerald-950 dark:text-white flex items-center gap-2">
                {isPro ? 'Plano Pro' : 'Plano Básico'}
              </p>
              <p className="text-xs text-emerald-800/60 dark:text-emerald-200/50 mt-0.5">Status: Ativo</p>
            </div>
          </div>
        </div>

        {/* Card 2: App (Violet/Fuchsia Gradient - Boosted Visibility) */}
        <button 
          onClick={() => onNavigate(ViewState.DOWNLOAD)}
          className="group relative overflow-hidden bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/80 dark:to-pink-900/60 backdrop-blur-xl p-6 rounded-3xl border border-fuchsia-100 dark:border-fuchsia-800 shadow-sm hover:shadow-lg hover:shadow-fuchsia-500/10 transition-all duration-500 text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-fuchsia-500/20"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white dark:bg-fuchsia-900/50 rounded-2xl flex items-center justify-center border border-fuchsia-200 dark:border-fuchsia-700 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Smartphone className="w-7 h-7 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-fuchsia-600/70 dark:text-fuchsia-400/70 uppercase tracking-widest mb-1">Mobile</p>
              <p className="text-lg font-bold text-fuchsia-950 dark:text-white">Instalar App</p>
              <p className="text-xs text-fuchsia-800/60 dark:text-fuchsia-200/50 mt-0.5">Versão PWA disponível.</p>
            </div>
          </div>
        </button>

        {/* Card 3: Support (Indigo/Blue Gradient - Darker) */}
        <button 
          onClick={() => onNavigate(ViewState.HELPER_BOT)}
          className="group relative overflow-hidden bg-slate-900 p-6 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all text-left border border-indigo-900/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 opacity-100"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          
          <div className="flex items-center gap-4 relative z-10 text-white">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Suporte</p>
              <p className="text-lg font-bold">Documentação</p>
              <p className="text-xs text-indigo-200/70 mt-0.5">Central de ajuda</p>
            </div>
          </div>
        </button>
      </div>

      {/* Feature Highlight with Soft Gradient Background */}
      <section className="bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-900/50 dark:to-indigo-900/20 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/60 to-transparent dark:from-white/5 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-white dark:from-indigo-900 dark:to-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-800 shadow-sm">
                <Lightbulb className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Padronização de Prompts</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    Utilize a funcionalidade de <strong>Variáveis Dinâmicas</strong> para criar formulários reutilizáveis. Ao padronizar a entrada de dados (ex: [CLIENTE], [TEMA]), você garante a reprodutibilidade dos resultados em toda a sua equipe.
                </p>
            </div>
            <button 
                onClick={() => onNavigate(ViewState.CREATE_PROMPT)}
                className="bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 hover:border-indigo-200 transition-all whitespace-nowrap shadow-sm"
            >
                Configurar Variável
            </button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-12">
        <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-slate-500 uppercase tracking-wide">
            <LayoutDashboard className="w-4 h-4" />
            Navegação por Especialidade
        </h3>
        <div className="flex flex-wrap gap-3">
          {['Marketing', 'Desenvolvedor', 'Escritor', 'Negócios', 'Designer', 'Professor', 'Psicólogo', 'Médico'].map((cat) => (
            <button 
              key={cat}
              onClick={() => {
                onNavigate(ViewState.LIBRARY);
              }}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 dark:hover:from-indigo-900/30 dark:hover:to-violet-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-sm shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeDashboard;
