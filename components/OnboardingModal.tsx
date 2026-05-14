
import React, { useState } from 'react';
import { Profession } from '../types';
import { Sparkles, Check, X } from 'lucide-react';
import { APP_NAME } from '../constants';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profession: string) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selected) {
      onComplete(selected);
    }
  };

  const handleSkip = () => {
    onComplete('Outro');
  };

  const categories = Object.values(Profession).filter(p => p !== Profession.ALL && p !== Profession.CUSTOM);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-8 text-center bg-gradient-to-b from-primary-50 to-white dark:from-primary-900/20 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 relative">
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Pular"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary-600 mb-4 shadow-xl shadow-primary-500/30">
             <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bem-vindo à {APP_NAME}</h2>
          <p className="text-slate-500 dark:text-slate-400">Personalize sua experiência: qual sua área?</p>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelected(cat)}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                     selected === cat 
                     ? 'bg-primary-600 border-primary-500 text-white shadow-lg' 
                     : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:border-primary-400'
                  }`}
                >
                   <span className="font-medium text-sm">{cat}</span>
                   {selected === cat && <div className="absolute top-2 right-2"><Check className="w-4 h-4" /></div>}
                </button>
             ))}
             <button
                onClick={() => setSelected('Outro')}
                className={`p-4 rounded-xl border text-left transition-all ${
                    selected === 'Outro' 
                    ? 'bg-primary-600 border-primary-500 text-white shadow-lg' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:border-primary-400'
                 }`}
             >
                <span className="font-medium text-sm">Geral / Múltiplos</span>
             </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
           <button 
             onClick={handleSkip}
             className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors order-2 md:order-1"
           >
             Pular por enquanto
           </button>
           
           <button 
             onClick={handleConfirm}
             disabled={!selected}
             className="w-full md:w-auto px-10 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed order-1 md:order-2"
           >
             Começar a Criar
           </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
