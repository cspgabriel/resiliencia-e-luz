
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import PromptCard from './components/PromptCard';
import SettingsModal from './components/SettingsModal';
import CreatePrompt from './components/CreatePrompt';
import LandingPage from './components/LandingPage';
import OnboardingModal from './components/OnboardingModal';
import HomeDashboard from './components/HomeDashboard';
import HelperBot from './components/HelperBot';
import DownloadApp from './components/DownloadApp';
import FloatingChatWidget from './components/FloatingChatWidget';
import { PromptTemplate, Profession, ViewState, ChatMessage, UserSettings, ModelConfig, GroupByMode } from './types';
import { PROMPTS_DATA, APP_NAME, ICON_MAP } from './constants';
import { generateResponse } from './services/geminiService';
import './services/firebase'; 
import { Search, MessageSquarePlus, Menu, Sun, Moon, Home, LayoutDashboard, Wand2, PlusCircle, Smartphone, Briefcase, ChevronRight, FolderHeart, Grid } from 'lucide-react';

const GLOBAL_API_KEY = process.env.API_KEY || "";

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [selectedProfession, setSelectedProfession] = useState<string>(Profession.ALL);
  const [groupByMode, setGroupByMode] = useState<GroupByMode>(GroupByMode.PROFESSION);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [customPrompts, setCustomPrompts] = useState<PromptTemplate[]>(() => {
    const saved = localStorage.getItem('iamagica_custom_prompts');
    return saved ? JSON.parse(saved) : [];
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('iamagica_settings');
    const initial = saved ? JSON.parse(saved) : {};
    return {
      apiKey: GLOBAL_API_KEY, 
      activeProvider: 'google',
      isPro: true, 
      tokensUsed: initial.tokensUsed || 0,
      maxFreeTokens: 999999,
      theme: initial.theme || 'light' // Default to light mode
    };
  });

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('iamagica_onboarded');
    if (!hasOnboarded && viewState !== ViewState.LANDING) {
        setShowOnboarding(true);
    }
  }, [viewState]);

  const handleOnboardingComplete = (profession: string) => {
    localStorage.setItem('iamagica_onboarded', 'true');
    setShowOnboarding(false);
    if (profession !== 'Outro') {
        setSelectedProfession(profession);
        setViewState(ViewState.LIBRARY);
    } else {
        setViewState(ViewState.HOME);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (userSettings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Salvar preferência no localStorage para persistência
    const currentSettings = JSON.parse(localStorage.getItem('iamagica_settings') || '{}');
    localStorage.setItem('iamagica_settings', JSON.stringify({ ...currentSettings, theme: userSettings.theme }));
  }, [userSettings.theme]);

  const handleSelectFilter = (filter: string) => {
    setSelectedProfession(filter);
    setViewState(ViewState.LIBRARY);
    setIsSidebarOpen(false);
  };

  const handleNavigate = (view: ViewState) => {
    setViewState(view);
    setIsSidebarOpen(false);
  };

  const handleUsePrompt = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setMessages([]);
    setViewState(ViewState.CHAT);
  };

  const handleStartFreeChat = () => {
    setSelectedTemplate(null);
    setMessages([]);
    setViewState(ViewState.CHAT);
    setIsSidebarOpen(false);
  };

  const handleCreatePrompt = (newPrompt: PromptTemplate) => {
    setCustomPrompts([...customPrompts, newPrompt]);
    setViewState(ViewState.LIBRARY);
    setSelectedProfession(Profession.CUSTOM); 
  };

  const handleToggleTheme = () => {
    setUserSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const handleSendMessage = async (text: string, config: ModelConfig) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setUserSettings(prev => ({ ...prev, tokensUsed: prev.tokensUsed + 1 }));

    try {
      const responseText = await generateResponse(GLOBAL_API_KEY, text, config);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: `**Erro:** ${error.message}`, timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const allPrompts = [...PROMPTS_DATA, ...customPrompts];

  const filteredPrompts = allPrompts.filter(prompt => {
    let matchesGroup = false;
    if (selectedProfession === Profession.ALL) matchesGroup = true;
    else if (selectedProfession === Profession.CUSTOM) matchesGroup = prompt.isCustom === true;
    else {
      matchesGroup = groupByMode === GroupByMode.PROFESSION 
        ? prompt.profession === selectedProfession 
        : prompt.category === selectedProfession;
    }
    const q = searchQuery.toLowerCase();
    return matchesGroup && (
        prompt.title.toLowerCase().includes(q) || 
        prompt.description.toLowerCase().includes(q) ||
        prompt.profession.toLowerCase().includes(q) ||
        prompt.category.toLowerCase().includes(q)
    );
  });

  const availableCategories = Array.from(new Set(allPrompts.map(p => p.category))).sort();

  if (viewState === ViewState.LANDING) {
     return <LandingPage onStart={() => setViewState(ViewState.HOME)} onInstall={() => setViewState(ViewState.DOWNLOAD)} />;
  }

  const BottomNavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = viewState === view;
    return (
      <button 
        onClick={() => handleNavigate(view)}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all active:scale-95 ${isActive ? 'text-violet-500 dark:text-violet-400' : 'text-slate-400'}`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-slate-50 dark:bg-dark-950 bg-grid-pattern font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden select-none">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          selectedFilter={selectedProfession}
          onSelectFilter={handleSelectFilter}
          onNavigate={handleNavigate}
          onOpenSettings={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
          isPro={true}
          tokensUsed={userSettings.tokensUsed}
          maxTokens={userSettings.maxFreeTokens}
          groupByMode={groupByMode}
          setGroupByMode={setGroupByMode}
          availableCategories={availableCategories}
          currentTheme={userSettings.theme}
          onToggleTheme={handleToggleTheme}
          onHome={() => setViewState(ViewState.HOME)}
          onFreeChat={handleStartFreeChat}
          currentView={viewState}
        />
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header com efeito glass */}
        <header className="lg:hidden flex-none border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl z-30 pt-[env(safe-area-inset-top)] h-[calc(3.5rem+env(safe-area-inset-top))]">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400 active:scale-90 transition-transform">
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-base tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">IA MÁGICA</div>
          <button onClick={() => setViewState(ViewState.DOWNLOAD)} className="p-2 -mr-2 text-slate-600 dark:text-slate-400 active:scale-90 transition-transform">
            <Smartphone className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden safe-area-pb">
          {viewState === ViewState.HOME && (
            <HomeDashboard 
              onNavigate={handleNavigate} 
              onStartChat={handleStartFreeChat}
              tokensUsed={userSettings.tokensUsed}
              isPro={userSettings.isPro}
            />
          )}

          {viewState === ViewState.LIBRARY && (
            <div className="p-4 md:p-8 max-w-7xl mx-auto pb-32 lg:pb-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-10">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        {selectedProfession === Profession.CUSTOM ? 'Meus Prompts' : 
                        selectedProfession === Profession.ALL ? 'Biblioteca Mágica' : selectedProfession}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Acesso rápido à inteligência</p>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-md -z-10"></div>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar inteligência..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-violet-500 dark:focus:border-violet-500 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredPrompts.map(prompt => (
                  <PromptCard key={prompt.id} template={prompt} onUse={handleUsePrompt} isPro={true} />
                ))}
              </div>
            </div>
          )}

          {viewState === ViewState.PROFESSIONS && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto pb-32 animate-in fade-in duration-500">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Explorar</h2>
                  <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm">
                    <button
                      onClick={() => setGroupByMode(GroupByMode.PROFESSION)}
                      className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${groupByMode === GroupByMode.PROFESSION ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-white shadow-sm' : 'text-slate-500'}`}
                    >
                      Áreas
                    </button>
                    <button
                      onClick={() => setGroupByMode(GroupByMode.CATEGORY)}
                      className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${groupByMode === GroupByMode.CATEGORY ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-white shadow-sm' : 'text-slate-500'}`}
                    >
                      Categorias
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => handleSelectFilter(Profession.ALL)}
                    className="flex items-center justify-between p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-violet-500/50 shadow-sm group active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <Grid className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">Todos os Prompts</p>
                        <p className="text-xs text-slate-500">Ver biblioteca completa</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500" />
                  </button>

                  <button 
                    onClick={() => handleSelectFilter(Profession.CUSTOM)}
                    className="flex items-center justify-between p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-violet-500/50 shadow-sm group active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FolderHeart className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">Meus Prompts</p>
                        <p className="text-xs text-slate-500">Suas criações pessoais</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500" />
                  </button>

                  <div className="h-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">{groupByMode === GroupByMode.PROFESSION ? 'Profissões' : 'Categorias'}</p>

                  {groupByMode === GroupByMode.PROFESSION ? (
                    Object.values(Profession).filter(p => p !== Profession.ALL && p !== Profession.CUSTOM).map(prof => (
                      <button 
                        key={prof}
                        onClick={() => handleSelectFilter(prof)}
                        className="flex items-center justify-between p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-violet-500/50 shadow-sm group active:scale-[0.98] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:text-violet-600 transition-colors">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-slate-700 dark:text-slate-200">{prof}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500" />
                      </button>
                    ))
                  ) : (
                    availableCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => handleSelectFilter(cat)}
                        className="flex items-center justify-between p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-violet-500/50 shadow-sm group active:scale-[0.98] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:text-violet-600 transition-colors">
                            <LayoutDashboard className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-slate-700 dark:text-slate-200">{cat}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500" />
                      </button>
                    ))
                  )}
               </div>
            </div>
          )}

          {viewState === ViewState.CREATE_PROMPT && (
            <CreatePrompt onSave={handleCreatePrompt} onCancel={() => setViewState(ViewState.HOME)} />
          )}

          {viewState === ViewState.HELPER_BOT && (
            <HelperBot 
              onBack={() => setViewState(ViewState.HOME)} 
              apiKey={GLOBAL_API_KEY} 
            />
          )}

          {viewState === ViewState.DOWNLOAD && (
            <DownloadApp onBack={() => setViewState(ViewState.HOME)} />
          )}

          {viewState === ViewState.CHAT && (
            <ChatInterface 
              template={selectedTemplate}
              onBack={() => setViewState(selectedTemplate ? ViewState.LIBRARY : ViewState.HOME)}
              onSendMessage={handleSendMessage}
              messages={messages}
              isLoading={isLoading}
              isPro={true}
              apiKey={GLOBAL_API_KEY}
            />
          )}
        </div>

        {/* Bottom Navigation Glass */}
        <nav className="lg:hidden flex-none bg-white/80 dark:bg-dark-900/80 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-around px-2 h-[calc(4.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] z-40 transition-colors shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <BottomNavItem view={ViewState.HOME} icon={Home} label="Início" />
          <BottomNavItem view={ViewState.LIBRARY} icon={LayoutDashboard} label="Biblioteca" />
          
          {/* Botão Central de Criação Neon */}
          <div className="flex-1 flex justify-center -mt-8 relative z-50">
            <div className="absolute inset-0 bg-violet-600 blur-xl opacity-40 rounded-full scale-75"></div>
            <button 
              onClick={() => handleNavigate(ViewState.CREATE_PROMPT)}
              className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-violet-500/40 active:scale-95 transition-all border-[4px] border-slate-50 dark:border-dark-950 relative z-10"
            >
              <PlusCircle className="w-8 h-8" />
            </button>
          </div>

          <BottomNavItem view={ViewState.PROFESSIONS} icon={Briefcase} label="Áreas" />
          <BottomNavItem view={ViewState.HELPER_BOT} icon={Wand2} label="Suporte" />
        </nav>
      </main>

      {viewState !== ViewState.CHAT && viewState !== ViewState.HELPER_BOT && (
        <FloatingChatWidget onClick={handleStartFreeChat} />
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={userSettings} onSave={setUserSettings} />
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default App;
