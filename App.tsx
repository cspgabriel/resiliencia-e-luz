import React, { useEffect, useRef, useState } from 'react';
import { ViewState, UserSettings, CheckIn as CheckInT, ChatMessage, Exercise, DiaryEntry, TrailProgress, ExerciseLog, FutureLetter } from './types';
import { EXERCISES, PAYWALL_REASONS, XP_EVENTS } from './constants';
import {
  loadSettings, saveSettings, loadCheckins, saveCheckin,
  loadDiary, saveDiaryEntry, deleteDiaryEntry,
  loadChat, saveChat, wipeAllData, incrementMessageCount,
  loadTrailProgress, completeTrailDay, loadExerciseLog, saveExerciseCompletion
} from './services/storage';
import { today } from './services/date';
import { trackSafeEvent } from './services/analytics';
import { isFirebaseConfigured } from './services/firebase';
import { watchUser } from './services/firebaseAuth';
import { backfillAll, wipeCloudData, syncCompanion, syncAchievements } from './services/cloudSync';
import { applyXp, checkUnlocks, XpSource } from './services/gamification';
import { recordDailyRetention, recordFunnelStep } from './services/metrics';
import { loadLetters, dueLetters } from './services/futureLetter';
import { consumeRefFromUrl, redeemInviteCode } from './services/referral';
import { publishMoodToBuddies } from './services/buddy';

import LandingPage from './components/LandingPage';
import OnboardingModal from './components/OnboardingModal';
import HomeDashboard from './components/HomeDashboard';
import CheckIn from './components/CheckIn';
import ChatInterface from './components/ChatInterface';
import ExercisesList from './components/ExercisesList';
import ExerciseDetail from './components/ExerciseDetail';
import Trails from './components/Trails';
import ResilienceBible from './components/ResilienceBible';
import Insights from './components/Insights';
import Diary from './components/Diary';
import Paywall from './components/Paywall';
import SOS from './components/SOS';
import SettingsModal from './components/SettingsModal';
import LegalPage from './components/LegalPage';
import Sidebar from './components/Sidebar';
import LevelProgress from './components/LevelProgress';
import Letters from './components/Letters';
import Invite from './components/Invite';
import Colectiva from './components/Colectiva';
import AnonFeed from './components/AnonFeed';
import Buddy from './components/Buddy';
import Wrapped from './components/Wrapped';
import Achievements from './components/Achievements';
import AuthModal from './components/AuthModal';
import PWAManager from './components/PWAManager';
import { consumeStartupAction } from './services/pwa';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [checkins, setCheckins] = useState<CheckInT[]>(loadCheckins);
  const [diary, setDiary] = useState<DiaryEntry[]>(loadDiary);
  const [messages, setMessages] = useState<ChatMessage[]>(loadChat);
  const [trailProgress, setTrailProgress] = useState<TrailProgress[]>(loadTrailProgress);
  const [exerciseLog, setExerciseLog] = useState<ExerciseLog[]>(loadExerciseLog);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [paywallReason, setPaywallReason] = useState<string | undefined>();
  const [letters, setLetters] = useState<FutureLetter[]>(loadLetters);
  const [toast, setToast] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<null | 'signin' | 'signup'>(null);
  const [previousView, setPreviousView] = useState<ViewState>(ViewState.HOME);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ===== GAMIFICAÇÃO =====
  const gainXp = (source: XpSource | number) => {
    setSettings(prev => {
      const next = typeof source === 'number'
        ? { ...prev, totalXp: (prev.totalXp || 0) + source, companion: prev.companion ? { ...prev.companion, totalXp: prev.companion.totalXp + source, xp: prev.companion.xp + source, lastCareAt: Date.now() } : prev.companion }
        : applyXp(prev, source);
      // Conquistas
      const ctx = {
        checkinsCount: checkins.length,
        diaryCount: diary.length,
        exerciseCount: exerciseLog.length,
        streakCurrent: next.streak?.current || 0,
        hasLetter: letters.length > 0,
        hasShared: false,
        hasBuddy: false,
        hasColectiva: typeof source === 'string' && source === 'colectiva_joined',
        hourOfDay: new Date().getHours(),
        returnedAfterPause: false,
      };
      const newly = checkUnlocks(next.achievements || [], ctx);
      if (newly.length) {
        const merged = Array.from(new Set([...(next.achievements || []), ...newly]));
        showToast(`🎉 Conquista desbloqueada: ${newly.length} nova${newly.length > 1 ? 's' : ''}`);
        return { ...next, achievements: merged };
      }
      return next;
    });
  };

  // Aplica tema
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.theme]);

  // Persiste settings e chat
  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => { saveChat(messages); }, [messages]);

  // Pula landing se já onboarded
  useEffect(() => {
    if (settings.onboarded && view === ViewState.LANDING) {
      setView(ViewState.HOME);
    }
  }, []);

  // Firebase: acompanha o usuário já autenticado; login anônimo fica sob demanda
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let mounted = true;
    const unsub = watchUser(user => {
      if (!mounted) return;
      const uid = user?.uid;
      setSettings(prev => prev.cloudUserId === uid ? prev : { ...prev, cloudUserId: uid });
    });
    return () => { mounted = false; unsub(); };
  }, []);

  // Backfill ao ativar cloud sync pela primeira vez
  const prevCloudSync = useRef<boolean | undefined>(settings.cloudSyncEnabled);
  useEffect(() => {
    if (!prevCloudSync.current && settings.cloudSyncEnabled) {
      backfillAll(settings, checkins, diary, messages, trailProgress, exerciseLog, letters);
    }
    prevCloudSync.current = settings.cloudSyncEnabled;
  }, [settings.cloudSyncEnabled]);

  // Sync companion + achievements quando mudam
  useEffect(() => { if (settings.companion) syncCompanion(settings); }, [settings.companion?.totalXp, settings.cloudSyncEnabled]);
  useEffect(() => { if (settings.achievements) syncAchievements(settings.achievements, settings); }, [settings.achievements, settings.cloudSyncEnabled]);

  // Retenção: registra app_open uma vez por dia
  useEffect(() => { recordDailyRetention(settings); }, []);

  // Cartas devidas + ref code da URL
  useEffect(() => {
    const due = dueLetters();
    if (due.length) showToast(`📬 Você tem ${due.length} carta${due.length > 1 ? 's' : ''} para abrir`);
    const ref = consumeRefFromUrl();
    if (ref) {
      (async () => {
        const r = await redeemInviteCode(ref, settings);
        if (r.ok) { setSettings(r.settings); showToast('🎁 Plus ativado pelo convite!'); }
      })();
    }

    // Deep links dos shortcuts da PWA (?action=checkin|sos|chat|breathe) e share target
    const { action, shareText } = consumeStartupAction();
    if (action === 'checkin') setView(ViewState.CHECKIN);
    else if (action === 'sos') setView(ViewState.SOS);
    else if (action === 'chat') setView(ViewState.CHAT);
    else if (action === 'breathe') {
      const breath = EXERCISES.find(e => e.id === 'resp-478');
      if (breath) handleSelectExercise(breath);
    }
    if (shareText) {
      // Conteúdo compartilhado de outro app cai no diário rascunho
      setView(ViewState.DIARY);
      showToast('📝 Conteúdo recebido no diário');
      try { sessionStorage.setItem('serenamente_share_draft', shareText); } catch {}
    }
  }, []);

  const handleStart = () => {
    if (settings.onboarded) setView(ViewState.HOME);
    else setView(ViewState.ONBOARDING);
  };

  const handleOnboardingComplete = (data: { name: string; consentLGPD: boolean; ageConfirmed: boolean; allowAiProcessing: boolean }) => {
    const updated: UserSettings = {
      ...settings,
      name: data.name,
      consentLGPD: data.consentLGPD,
      ageConfirmed: data.ageConfirmed,
      allowAiProcessing: data.allowAiProcessing,
      consentDate: Date.now(),
      onboarded: true,
    };
    setSettings(updated);
    trackSafeEvent('onboarding_completed', { ai_enabled: data.allowAiProcessing });
    setView(ViewState.HOME);
  };

  const handleSaveCheckin = (c: CheckInT) => {
    saveCheckin(c);
    setCheckins(loadCheckins());
    trackSafeEvent('checkin_saved', { tags: c.triggerTags?.length || 0 });
    recordFunnelStep('checkin_completed', settings);
    gainXp('checkin');
    publishMoodToBuddies(c.mood, settings);
    setView(ViewState.HOME);
  };

  const handleSelectExercise = (e: Exercise) => {
    setPreviousView(view);
    setActiveExercise(e);
    setView(ViewState.EXERCISE_DETAIL);
  };

  const closeExerciseModal = () => {
    setActiveExercise(null);
    setView(previousView);
  };

  const handleSaveDiary = (e: DiaryEntry) => {
    saveDiaryEntry(e);
    setDiary(loadDiary());
    gainXp('diary_entry');
  };

  const handleDeleteDiary = (id: string) => {
    deleteDiaryEntry(id);
    setDiary(loadDiary());
  };

  const handleLimitReached = () => {
    setPaywallReason(PAYWALL_REASONS.MESSAGE_LIMIT);
    trackSafeEvent('paywall_opened', { reason: 'message_limit' });
    setView(ViewState.PAYWALL);
  };

  const handleUpgradeFromExercise = () => {
    setPaywallReason(PAYWALL_REASONS.PREMIUM_EXERCISE);
    setView(ViewState.PAYWALL);
  };

  const handleUpgradeFromTrail = () => {
    setPaywallReason(PAYWALL_REASONS.PREMIUM_TRAIL);
    setView(ViewState.PAYWALL);
  };

  const handleUpgradeFromDiary = () => {
    setPaywallReason(PAYWALL_REASONS.DIARY_HISTORY);
    setView(ViewState.PAYWALL);
  };

  const handleIncrementUsage = () => {
    const s = incrementMessageCount();
    setSettings(s);
    gainXp('chat_message');
  };

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    // TODO: integrar IAP/Google Play Billing no app nativo; Stripe/Mercado Pago no PWA quando permitido.
    alert(`Em produção, redirecionaria pro checkout ${plan === 'yearly' ? 'anual' : 'mensal'}. Por enquanto, vou ativar Plus localmente pra você testar.`);
    setSettings({ ...settings, isPro: true });
    setView(ViewState.HOME);
  };

  const handleWipeData = () => {
    wipeCloudData(settings);
    wipeAllData();
    setSettings(loadSettings());
    setCheckins([]);
    setDiary([]);
    setMessages([]);
    setTrailProgress([]);
    setExerciseLog([]);
    setView(ViewState.LANDING);
  };

  const handleStartSosBreathing = () => {
    const breath = EXERCISES.find(e => e.id === 'resp-478');
    if (breath) handleSelectExercise(breath);
  };

  const handleCompleteExercise = (exercise: Exercise) => {
    setExerciseLog(saveExerciseCompletion(exercise, exercise.category === 'SOS Ansiedade' ? 'sos' : 'exercise'));
    trackSafeEvent('exercise_completed', { exercise_id: exercise.id });
    gainXp('exercise_complete');
    setView(ViewState.HOME);
  };

  const handleCompleteTrailDay = (trailId: string, day: number) => {
    setTrailProgress(completeTrailDay(trailId, day));
    trackSafeEvent('trail_day_completed', { trail_id: trailId, day });
    gainXp('trail_day');
  };

  const handleColectivaCompleted = () => {
    gainXp('colectiva_joined');
    showToast('🌊 Você respirou junto com a comunidade');
  };

  // ============ RENDER ============
  if (view === ViewState.LANDING) {
    return <LandingPage onStart={handleStart} />;
  }
  if (view === ViewState.ONBOARDING) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  // Sidebar aparece em quase tudo, exceto fluxos pré-auth e o modal de exercício
  const showSidebar = ![
    ViewState.ONBOARDING,
    ViewState.LANDING,
  ].includes(view);

  // Renderiza a view "de fundo" quando o exercício abre como modal
  const bgView = view === ViewState.EXERCISE_DETAIL ? previousView : view;

  return (
    <div className="md:flex">
      {showSidebar && <Sidebar current={view} onNavigate={setView} settings={settings} />}
      <main className="flex-1 min-h-screen">
        {bgView === ViewState.HOME && (
          <HomeDashboard
            onNavigate={setView}
            onSelectExercise={handleSelectExercise}
            checkins={checkins}
            exerciseLog={exerciseLog}
            settings={settings}
            onXpGain={(xp) => gainXp(xp)}
          />
        )}
        {bgView === ViewState.COMPANION && (
          <LevelProgress onBack={() => setView(ViewState.HOME)} settings={settings} />
        )}
        {bgView === ViewState.BIBLE && (
          <ResilienceBible
            onBack={() => setView(ViewState.HOME)}
            onNavigate={setView}
            settings={settings}
            progress={trailProgress}
            onCompleteDay={handleCompleteTrailDay}
            onXpGain={(xp) => gainXp(xp)}
          />
        )}
        {bgView === ViewState.LETTERS && (
          <Letters onBack={() => setView(ViewState.HOME)} settings={settings}
                   onXpGain={(src) => gainXp(src)} />
        )}
        {bgView === ViewState.WRAPPED && (
          <Wrapped onBack={() => setView(ViewState.HOME)} settings={settings}
                   checkins={checkins} diary={diary} exerciseLog={exerciseLog} />
        )}
        {bgView === ViewState.COLECTIVA && (
          <Colectiva onBack={() => setView(ViewState.HOME)} settings={settings}
                     onCompleted={handleColectivaCompleted} />
        )}
        {bgView === ViewState.ANON_FEED && (
          <AnonFeed onBack={() => setView(ViewState.HOME)} settings={settings} />
        )}
        {bgView === ViewState.BUDDY && (
          <Buddy onBack={() => setView(ViewState.HOME)} settings={settings} />
        )}
        {bgView === ViewState.INVITE && (
          <Invite onBack={() => setView(ViewState.HOME)} settings={settings} onUpdate={setSettings} />
        )}
        {bgView === ViewState.ACHIEVEMENTS && (
          <Achievements onBack={() => setView(ViewState.HOME)} settings={settings} />
        )}
        {bgView === ViewState.CHECKIN && (
          <CheckIn onBack={() => setView(ViewState.HOME)} onSave={handleSaveCheckin}
                   existing={checkins.find(c => c.date === today())} />
        )}
        {bgView === ViewState.CHAT && (
          <ChatInterface
            onBack={() => setView(ViewState.HOME)}
            messages={messages}
            setMessages={setMessages}
            settings={settings}
            onLimitReached={handleLimitReached}
            onIncrementUsage={handleIncrementUsage}
          />
        )}
        {bgView === ViewState.EXERCISES && (
          <ExercisesList onBack={() => setView(ViewState.HOME)} onSelect={handleSelectExercise}
                         onUpgrade={handleUpgradeFromExercise} settings={settings} />
        )}
        {bgView === ViewState.TRAILS && (
          <Trails
            onBack={() => setView(ViewState.HOME)}
            settings={settings}
            progress={trailProgress}
            onCompleteDay={handleCompleteTrailDay}
            onUpgrade={handleUpgradeFromTrail}
          />
        )}
        {bgView === ViewState.INSIGHTS && (
          <Insights
            onBack={() => setView(ViewState.HOME)}
            checkins={checkins}
            diary={diary}
            exerciseLog={exerciseLog}
            settings={settings}
          />
        )}
        {bgView === ViewState.DIARY && (
          <Diary onBack={() => setView(ViewState.HOME)} entries={diary} checkins={checkins} settings={settings}
                 onSave={handleSaveDiary} onDelete={handleDeleteDiary} onUpgrade={handleUpgradeFromDiary} />
        )}
        {bgView === ViewState.PAYWALL && (
          <Paywall onBack={() => setView(ViewState.HOME)} onSubscribe={handleSubscribe} reason={paywallReason} />
        )}
        {bgView === ViewState.SOS && (
          <SOS onBack={() => setView(ViewState.HOME)} onStartBreathing={handleStartSosBreathing} settings={settings} />
        )}
        {bgView === ViewState.SETTINGS && (
          <SettingsModal onBack={() => setView(ViewState.HOME)} settings={settings} onUpdate={setSettings} onWipeData={handleWipeData} onNavigate={setView} onOpenAuth={(m) => setAuthModal(m)} />
        )}
        {bgView === ViewState.PRIVACY && (
          <LegalPage kind="privacy" onBack={() => setView(ViewState.SETTINGS)} />
        )}
        {bgView === ViewState.TERMS && (
          <LegalPage kind="terms" onBack={() => setView(ViewState.SETTINGS)} />
        )}
      </main>

      {/* EXERCISE MODAL — abre por cima de qualquer view */}
      {view === ViewState.EXERCISE_DETAIL && activeExercise && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6" onClick={closeExerciseModal}>
          <div className="bg-white dark:bg-slate-900 w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <ExerciseDetail
              exercise={activeExercise}
              onBack={closeExerciseModal}
              onComplete={(ex) => { handleCompleteExercise(ex); closeExerciseModal(); }}
              onSaveDiary={handleSaveDiary}
            />
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authModal && (
        <AuthModal
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={(email) => {
            setSettings(prev => ({ ...prev, name: prev.name || email.split('@')[0] }));
            showToast('Conta vinculada ✓');
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-sm max-w-sm">
          {toast}
        </div>
      )}

      {/* PWA: install prompt + update toast + offline indicator */}
      <PWAManager />
    </div>
  );
};

export default App;
