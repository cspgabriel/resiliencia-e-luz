import React from 'react';
import { PromptTemplate } from '../types';
import { ICON_MAP } from '../constants';
import { ArrowRight, Lock } from 'lucide-react';

interface PromptCardProps {
  template: PromptTemplate;
  onUse: (template: PromptTemplate) => void;
  isPro: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ template, onUse, isPro }) => {
  const Icon = ICON_MAP[template.iconName] || ICON_MAP['Rocket'];
  const isLocked = template.isPremium && !isPro;

  return (
    <div 
      onClick={() => !isLocked && onUse(template)}
      className={`
      relative group rounded-3xl border p-5 transition-all duration-300 flex flex-col h-full overflow-hidden backdrop-blur-md
      ${isLocked 
        ? 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 opacity-70 grayscale' 
        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-white/5 hover:border-transparent cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20'
      }
    `}>
      {/* Background Gradient on Hover */}
      {!isLocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      )}

      {/* Gradient Border on Hover using pseudo-element */}
      {!isLocked && (
        <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 mask-border"></div>
      )}

      {/* Background Glow Effect - Simplified */}
      {!isLocked && (
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300"></div>
      )}

      {isLocked && (
        <div className="absolute inset-0 z-20 bg-slate-50/10 dark:bg-black/20 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
          <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-full border border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-md">
            <Lock className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3.5 rounded-2xl transition-all duration-300 shadow-sm ${
            template.isPremium 
            ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600 border border-amber-500/20 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white group-hover:border-transparent' 
            : 'bg-gradient-to-br from-violet-500/10 to-indigo-500/10 text-violet-600 border border-violet-500/20 group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-indigo-500 group-hover:text-white group-hover:border-transparent'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        {template.isPremium && (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-lg shadow-md shadow-amber-500/20">
            PRO
          </span>
        )}
      </div>

      <div className="space-y-2 mb-6 flex-1 relative z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight transition-colors group-hover:text-violet-700 dark:group-hover:text-violet-300">
          {template.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300">
          {template.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/50 dark:border-white/5 relative z-10">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
          {template.category}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <span>ATIVAR</span> <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
