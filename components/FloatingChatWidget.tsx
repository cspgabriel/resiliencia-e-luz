
import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';

interface FloatingChatWidgetProps {
  onClick: () => void;
}

const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Pequeno delay para a animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      
      {/* Tooltip / Balão de Fala */}
      {showTooltip && (
        <div className="relative mr-2 mb-1 animate-in slide-in-from-right-4 fade-in duration-700">
          <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-xl border border-slate-200 dark:border-slate-700 max-w-[200px] text-sm font-medium relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              className="absolute -top-2 -left-2 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 hover:bg-red-500 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <p>Precisa de ajuda? <br/> <span className="text-violet-600 dark:text-violet-400 font-bold">Fale comigo!</span> 👋</p>
          </div>
          {/* Triângulo do balão */}
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 transform rotate-45"></div>
        </div>
      )}

      {/* Botão Flutuante */}
      <button
        onClick={onClick}
        className="group relative w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-[0_8px_30px_rgb(124,58,237,0.4)] hover:shadow-[0_8px_40px_rgb(124,58,237,0.6)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-4 border-slate-50 dark:border-slate-900"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 group-hover:opacity-40"></div>
        <MessageSquarePlus className="w-8 h-8 relative z-10" />
      </button>
    </div>
  );
};

export default FloatingChatWidget;
