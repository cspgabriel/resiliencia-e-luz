import React, { useEffect, useState } from 'react';
import { ViewState, UserSettings, CheckIn as CheckInT, ChatMessage, Exercise, DiaryEntry } from './types';
import { EXERCISES, PAYWALL_REASONS } from './constants';
import {
  loadSettings, saveSettings, loadCheckins, saveCheckin,
  loadDiary, saveDiaryEntry, deleteDiaryEntry,
  loadChat, saveChat, wipeAllData, incrementMessageCount, canSendMessage, today
} from './services/storage';

import LandingPage from './components/LandingPage';
import OnboardingModal from './components/OnboardingModal';
import HomeDashboard from './components/HomeDashboard';
import CheckIn from './components/CheckIn';
import ChatInterface from './components/ChatInterface';
import ExercisesList from './components/ExercisesList';
import ExerciseDetail from './components/ExerciseDetail';
import Diary from './components/Diary';
import Paywall from './components/Paywall';
import SOS from './components/SOS';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [checkins, setCheckins] = useState<CheckInT[]>(loadCheckins);
  const [diary, setDiary] = useState<DiaryEntry[]>(loadDiary);
  const [messages, setMessages] = useState<ChatMessage[]>(loadChat);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [paywallReason, setPaywallReason] = useState<string | undefined>();

  // Aplica tema
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.theme]);

  // Persiste settings
  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => { saveChat(messages); }, [messages]);

  // Pula landing se já onboarded
  useEffect(() => {
    if (settings.onboarded && view === ViewState.LANDING) {
      setView(ViewState.HOME);
    }
  }, []);

  const handleStart = () => {
    if (settings.onboarded) setView(ViewState.HOME);
    else setView(ViewState.ONBOARDING);
  };

  const handleOnboardingComplete = (data: { name: string; consentLGPD: boolean; ageConfirmed: boolean }) => {
    const updated: UserSettings = {
      ...settings,
      name: data.name,
      consentLGPD: data.consentLGPD,
      ageConfirmed: data.ageConfirmed,
      consentDate: Date.now(),
      onboarded: true,
    };
    setSettings(updated);
    setView(ViewState.HOME);
  };

  const handleSaveCheckin = (c: CheckInT) => {
    saveCheckin(c);
    setCheckins(loadCheckins());
    setView(ViewState.HOME);
  };

  const handleSelectExercise = (e: Exercise) => {
    setActiveExercise(e);
    setView(ViewState.EXERCISE_DETAIL);
  };

  const handleSaveDiary = (e: DiaryEntry) => {
    saveDiaryEntry(e);
    setDiary(loadDiary());
  };

  const handleDeleteDiary = (id: string) => {
    deleteDiaryEntry(id);
    setDiary(loadDiary());
  };

  const handleLimitReached = () => {
    setPaywallReason(PAYWALL_REASONS.MESSAGE_LIMIT);
    setView(ViewState.PAYWALL);
  };

  const handleUpgradeFromExercise = () => {
    setPaywallReason(PAYWALL_REASONS.PREMIUM_EXERCISE);
    setView(ViewState.PAYWALL);
  };

  const handleUpgradeFromDiary = () => {
    setPaywallReason(PAYWALL_REASONS.DIARY_HISTORY);
    setView(ViewState.PAYWALL);
  };

  const handleIncrementUsage = () => {
    const s = incrementMessageCount();
    setSettings(s);
  };

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    // TODO: integrar Stripe/Mercado Pago
    alert(`Em produção, redirecionaria pro checkout ${plan === 'yearly' ? 'anual' : 'mensal'}. Por enquanto, vou ativar Plus localmente pra você testar.`);
    setSettings({ ...settings, isPro: true });
    setView(ViewState.HOME);
  };

  const handleWipeData = () => {
    wipeAllData();
    setSettings(loadSettings());
    setCheckins([]);
    setDiary([]);
    setMessages([]);
    setView(ViewState.LANDING);
  };

  const handleStartSosBreathing = () => {
    const breath = EXERCISES.find(e => e.id === 'resp-478');
    if (breath) { setActiveExercise(breath); setView(ViewState.EXERCISE_DETAIL); }
  };

  // ============ RENDER ============
  if (view === ViewState.LANDING) {
    return <LandingPage onStart={handleStart} />;
  }
  if (view === ViewState.ONBOARDING) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  const showSidebar = ![ViewState.CHAT, ViewState.EXERCISE_DETAIL, ViewState.PAYWALL, ViewState.ONBOARDING, ViewState.LANDING].includes(view);

  return (
    <div className="md:flex">
      {showSidebar && <Sidebar current={view} onNavigate={setView} settings={settings} />}
      <main className="flex-1 min-h-screen">
        {view === ViewState.HOME && (
          <HomeDashboard onNavigate={setView} checkins={checkins} settings={settings} />
        )}
        {view === ViewState.CHECKIN && (
          <CheckIn onBack={() => setView(ViewState.HOME)} onSave={handleSaveCheckin}
                   existing={checkins.find(c => c.date === today())} />
        )}
        {view === ViewState.CHAT && (
          <ChatInterface
            onBack={() => setView(ViewState.HOME)}
            messages={messages}
            setMessages={setMessages}
            settings={settings}
            onLimitReached={handleLimitReached}
            onIncrementUsage={handleIncrementUsage}
          />
        )}
        {view === ViewState.EXERCISES && (
          <ExercisesList onBack={() => setView(ViewState.HOME)} onSelect={handleSelectExercise}
                         onUpgrade={handleUpgradeFromExercise} settings={settings} />
        )}
        {view === ViewState.EXERCISE_DETAIL && activeExercise && (
          <ExerciseDetail exercise={activeExercise}
                          onBack={() => setView(ViewState.EXERCISES)}
                          onComplete={() => setView(ViewState.HOME)}
                          onSaveDiary={handleSaveDiary} />
        )}
        {view === ViewState.DIARY && (
          <Diary onBack={() => setView(ViewState.HOME)} entries={diary} checkins={checkins} settings={settings}
                 onSave={handleSaveDiary} onDelete={handleDeleteDiary} onUpgrade={handleUpgradeFromDiary} />
        )}
        {view === ViewState.PAYWALL && (
          <Paywall onBack={() => setView(ViewState.HOME)} onSubscribe={handleSubscribe} reason={paywallReason} />
        )}
        {view === ViewState.SOS && (
          <SOS onBack={() => setView(ViewState.HOME)} onStartBreathing={handleStartSosBreathing} />
        )}
        {view === ViewState.SETTINGS && (
          <SettingsModal onBack={() => setView(ViewState.HOME)} settings={settings} onUpdate={setSettings} onWipeData={handleWipeData} />
        )}
      </main>
    </div>
  );
};

export default App;
