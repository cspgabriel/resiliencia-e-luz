
import React from 'react';
import { Profession, ViewState, GroupByMode } from '../types';
import { APP_NAME } from '../constants';
import { 
  LayoutDashboard, Code, PenTool, Users, Briefcase, Megaphone, Settings, PlusCircle, FolderHeart,
  Palette, GraduationCap, Moon, Sun, Filter, Stethoscope, Apple, Dumbbell,
  Home, Sparkles, Wand2, Smartphone
} from 'lucide-react';

interface SidebarProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onNavigate: (view: ViewState) => void;
  onOpenSettings: () => void;
  isPro: boolean;
  tokensUsed: number;
  maxTokens: number;
  groupByMode: GroupByMode;
  setGroupByMode: (mode: GroupByMode) => void;
  availableCategories: string[];
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onHome: () => void;
  onFreeChat: () => void;
  currentView: ViewState;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedFilter, 
  onSelectFilter,
  onNavigate,
  onOpenSettings,
  groupByMode,
  setGroupByMode,
  availableCategories,
  currentTheme,
  onToggleTheme,
  onHome,
  onFreeChat,
  currentView
}) => {
  
  const getIconForProfession = (prof: string) => {
    switch (prof) {
      case Profession.MARKETING: return Megaphone;
      case Profession.DEVELOPER: return Code;
      case Profession.WRITER: return PenTool;
      case Profession.HR: return Users;
      case Profession.BUSINESS: return Briefcase;
      case Profession.DESIGN: return Palette;
      case Profession.EDUCATION: return GraduationCap;
      case Profession.NUTRITION: return Apple;
      case Profession.MEDICAL: return Stethoscope;
      case Profession.FITNESS: return Dumbbell;
      default: return Briefcase;
    }
  };

  const isActiveView = (view: ViewState) => currentView === view;

  return (
    <aside className="w-[280px] lg:w-72 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/5 flex flex-col h-full transition-colors duration-300 shadow-[5px_0_30px_rgba(0,0,0,0.02)] z-50">
      
      {/* Header com Logo Glow */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onHome}>
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-inner border border-white/20 relative z-10">
              <Sparkles className="text-white w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">{APP_NAME}</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Pro Edition</p>
          </div>
        </div>
        <button onClick={onToggleTheme} className="p-2 rounded-lg text-slate-500 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
            {currentTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>

      <div className="px-4 pb-2 space-y-4">
         {/* Main Navigation - Modified: Removed Chat Button, Home is full width */}
         <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onHome} 
              className={`flex items-center justify-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isActiveView(ViewState.HOME) ? 'bg-gradient-to-br from-slate-800 to-slate-900 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 border-transparent shadow-lg shadow-black/10 dark:shadow-white/10' : 'bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wide">Página Inicial</span>
            </button>
         </div>

         <button 
           onClick={() => onNavigate(ViewState.HELPER_BOT)}
           className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all text-sm font-bold shadow-sm border group relative overflow-hidden ${isActiveView(ViewState.HELPER_BOT) ? 'border-sky-500/50 text-sky-600 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30' : 'bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:text-sky-500'}`}
         >
           <Wand2 className="w-4 h-4" />
           Assistente Mágico
         </button>

         <button 
           onClick={() => onNavigate(ViewState.CREATE_PROMPT)}
           className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-3.5 rounded-xl transition-all text-sm font-bold shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-95 group border border-white/10"
         >
           <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
           Criar Mágica
         </button>

         {/* Filter Toggles */}
         <div className="flex bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <button
               onClick={() => setGroupByMode(GroupByMode.PROFESSION)}
               className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${groupByMode === GroupByMode.PROFESSION ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Áreas
            </button>
            <button
               onClick={() => setGroupByMode(GroupByMode.CATEGORY)}
               className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${groupByMode === GroupByMode.CATEGORY ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Categorias
            </button>
         </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-2">
        <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-70">Biblioteca</p>
        
        <button
          onClick={() => onSelectFilter(Profession.ALL)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${selectedFilter === Profession.ALL && isActiveView(ViewState.LIBRARY) ? 'bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/40 dark:to-slate-900 text-indigo-900 dark:text-white shadow-sm border border-indigo-100 dark:border-indigo-800' : 'text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300'}`}
        >
          <LayoutDashboard className={`w-4 h-4 transition-colors ${selectedFilter === Profession.ALL && isActiveView(ViewState.LIBRARY) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
          Tudo
        </button>
        <button
          onClick={() => onSelectFilter(Profession.CUSTOM)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${selectedFilter === Profession.CUSTOM && isActiveView(ViewState.LIBRARY) ? 'bg-gradient-to-r from-fuchsia-50 to-white dark:from-fuchsia-900/40 dark:to-slate-900 text-fuchsia-900 dark:text-white shadow-sm border border-fuchsia-100 dark:border-fuchsia-800' : 'text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300'}`}
        >
          <FolderHeart className={`w-4 h-4 transition-colors ${selectedFilter === Profession.CUSTOM && isActiveView(ViewState.LIBRARY) ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-slate-400 group-hover:text-fuchsia-400'}`} />
          Meus Prompts
        </button>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-3" />

        {groupByMode === GroupByMode.PROFESSION ? (
          Object.values(Profession).filter(p => p !== Profession.ALL && p !== Profession.CUSTOM).map((item) => {
            const Icon = getIconForProfession(item);
            const isActive = selectedFilter === item && isActiveView(ViewState.LIBRARY);
            return (
              <button
                key={item}
                onClick={() => onSelectFilter(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? 'bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/40 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
              >
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-violet-500 rounded-r-full"></div>}
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-violet-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                {item}
              </button>
            );
          })
        ) : (
          availableCategories.map((cat) => {
             const isActive = selectedFilter === cat && isActiveView(ViewState.LIBRARY);
             return (
               <button
                 key={cat}
                 onClick={() => onSelectFilter(cat)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? 'bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/40 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
               >
                 {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-violet-500 rounded-r-full"></div>}
                 <Filter className={`w-4 h-4 transition-colors ${isActive ? 'text-violet-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                 {cat}
               </button>
             );
          })
        )}
      </nav>

      <div className="p-4 border-t border-slate-200/50 dark:border-white/5 space-y-2 bg-gradient-to-t from-white/50 to-transparent dark:from-slate-900/50">
        <button 
          onClick={() => onNavigate(ViewState.DOWNLOAD)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${isActiveView(ViewState.DOWNLOAD) ? 'bg-gradient-to-r from-violet-50 to-white text-violet-600 shadow-sm border border-violet-100' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        >
          <Smartphone className="w-4 h-4" />
          Baixar App
        </button>
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Configurações
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
