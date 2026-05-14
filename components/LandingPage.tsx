
import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Smartphone, Zap, BrainCircuit, ShieldCheck, Clock, Layers, BarChart } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LandingPageProps {
  onStart: () => void;
  onInstall: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onInstall }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Background FX - Subtle */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* Navbar Glass */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-4 h-4" />
             </div>
             <span className="font-semibold text-lg tracking-tight text-white">{APP_NAME}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
             <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
             <button onClick={onInstall} className="hover:text-white transition-colors">Aplicativo</button>
          </div>
          <button 
             onClick={onStart}
             className="px-6 py-2 bg-white text-slate-950 hover:bg-slate-200 rounded-lg text-sm font-semibold transition-all"
          >
             Acessar Plataforma
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Plataforma de Produtividade
           </div>
           
           <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
              Inteligência Artificial <br />
              <span className="text-slate-400">aplicada ao seu negócio.</span>
           </h1>
           
           <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Uma suíte de ferramentas projetada para profissionais que buscam precisão. Utilize prompts estruturados e modelos de linguagem avançados para eliminar tarefas repetitivas com segurança.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2"
              >
                Iniciar Sessão
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={onInstall}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-base font-medium transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-slate-400" /> Instalar App
              </button>
           </div>
        </div>
      </section>

      {/* Feature Cards - Informative */}
      <section className="py-20 px-6 relative z-10 bg-slate-900/30 border-t border-white/5" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Por que utilizar a {APP_NAME}?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Nossa plataforma oferece uma camada de organização sobre os modelos de IA (LLMs), garantindo resultados mais consistentes e profissionais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { 
                    icon: Layers, 
                    title: "Biblioteca de Prompts", 
                    desc: "Acesso a centenas de templates pré-configurados e testados para diversas indústrias (Marketing, Jurídico, TI, Saúde).", 
                  },
                  { 
                    icon: BrainCircuit, 
                    title: "Modelos Avançados", 
                    desc: "Integração direta com o Google Gemini. Escolha entre velocidade (Flash) ou raciocínio complexo (Pro) conforme a necessidade.", 
                  },
                  { 
                    icon: BarChart, 
                    title: "Consistência de Dados", 
                    desc: "Transforme prompts em formulários estruturados. Garanta que sua equipe utilize os mesmos parâmetros para gerar resultados padronizados.", 
                  }
              ].map((feature, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-indigo-400">
                          <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-white">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                  </div>
              ))}
          </div>
        </div>
      </section>

      {/* Tech Specs / App Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-widest">
                    <Smartphone className="w-3 h-3" />
                    Tecnologia PWA
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">Acesse de qualquer lugar. <br /><span className="text-slate-500">Sem instalações complexas.</span></h2>
                <p className="text-lg text-slate-400 font-light">
                    Nossa aplicação utiliza tecnologia Progressive Web App. Isso significa que você tem a performance de um aplicativo nativo diretamente no navegador, compatível com iOS e Android.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {[
                      'Funcionamento Offline', 
                      'Sincronização em Nuvem', 
                      'Interface Otimizada', 
                      'Segurança de Dados'
                    ].map(item => (
                        <div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                            <CheckCircle2 className="text-indigo-500 w-4 h-4" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Visual Representation */}
            <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm aspect-[9/16] bg-slate-900 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                    <div className="h-full w-full bg-slate-950 relative p-6 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-4">
                            <Zap className="w-10 h-10 text-indigo-500" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2">Painel de Controle</h4>
                            <p className="text-sm text-slate-500">Monitoramento em tempo real</p>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-2/3"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mt-8">
                             <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                                <div className="w-8 h-2 bg-slate-800 rounded mb-2"></div>
                                <div className="w-12 h-2 bg-slate-700 rounded"></div>
                             </div>
                             <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                                <div className="w-8 h-2 bg-slate-800 rounded mb-2"></div>
                                <div className="w-12 h-2 bg-slate-700 rounded"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950 text-center">
         <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                 <Sparkles className="w-3 h-3 text-white" />
               </div>
               <span className="font-semibold text-white">{APP_NAME}</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">&copy; {new Date().getFullYear()} {APP_NAME}. Ferramentas de IA para profissionais.</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
