
import React from 'react';
import { ArrowLeft, Smartphone, Share, PlusSquare, MoreVertical, Download, CheckCircle2, Zap } from 'lucide-react';

interface DownloadAppProps {
  onBack: () => void;
}

const DownloadApp: React.FC<DownloadAppProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-dark-950 animate-in fade-in duration-500">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 bg-white dark:bg-dark-900 sticky top-0 z-20 shadow-sm pt-[env(safe-area-inset-top)] h-[calc(4rem+env(safe-area-inset-top))]">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-primary-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-2 text-slate-900 dark:text-white font-bold text-lg">Instalar Aplicativo</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-2xl mx-auto pb-24">
        <div className="text-center space-y-4 py-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto relative overflow-hidden">
             <div className="absolute inset-0 bg-white/20 blur-xl"></div>
             <Smartphone className="w-10 h-10 text-white relative z-10" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Seu Segundo Cérebro, Sempre no Bolso</h1>
          <p className="text-slate-500 dark:text-slate-400">Ideias surgem no chuveiro ou no trânsito. Não deixe elas escaparem. Instale o App e tenha a potência da IA Mágica a um toque de distância.</p>
          
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 py-2 px-4 rounded-full mx-auto w-fit">
            <Zap className="w-4 h-4" /> Mais rápido que o site
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-primary-600">
              <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-sm">1</div>
              Instalar no iPhone (iOS)
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Share className="w-5 h-5" /></div>
                <p>Abra este site no <strong>Safari</strong> e toque no botão <strong>Compartilhar</strong> na barra inferior.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><PlusSquare className="w-5 h-5" /></div>
                <p>Role as opções e toque em <strong>"Adicionar à Tela de Início"</strong>.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                <p>Pronto! O ícone da <strong>IA Mágica</strong> aparecerá junto com seus outros aplicativos.</p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-primary-600">
              <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-sm">2</div>
              Instalar no Android
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><MoreVertical className="w-5 h-5" /></div>
                <p>Abra no <strong>Chrome</strong> e toque nos <strong>três pontinhos</strong> no canto superior direito.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Download className="w-5 h-5" /></div>
                <p>Toque em <strong>"Instalar Aplicativo"</strong> ou "Adicionar à tela inicial".</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                <p>Confirme a instalação e pronto!</p>
              </div>
            </div>
          </section>
        </div>

        <div className="pt-4">
           <button onClick={onBack} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-xl">
             Voltar para o App
           </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
