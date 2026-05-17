// Resiliência e Luz - tipos centrais do app de bem-estar

export enum Mood {
  OTIMO = 'OTIMO',
  BEM = 'BEM',
  NEUTRO = 'NEUTRO',
  ANSIOSO = 'ANSIOSO',
  TRISTE = 'TRISTE',
  EXAUSTO = 'EXAUSTO',
  IRRITADO = 'IRRITADO',
}

export const MOOD_META: Record<Mood, { emoji: string; label: string; score: number; color: string }> = {
  [Mood.OTIMO]:    { emoji: '😄', label: 'Ótimo',    score: 5, color: '#10b981' },
  [Mood.BEM]:      { emoji: '🙂', label: 'Bem',      score: 4, color: '#22c55e' },
  [Mood.NEUTRO]:   { emoji: '😐', label: 'Neutro',   score: 3, color: '#94a3b8' },
  [Mood.ANSIOSO]:  { emoji: '😟', label: 'Ansioso',  score: 2, color: '#f59e0b' },
  [Mood.TRISTE]:   { emoji: '😢', label: 'Triste',   score: 2, color: '#3b82f6' },
  [Mood.EXAUSTO]:  { emoji: '😩', label: 'Exausto',  score: 1, color: '#8b5cf6' },
  [Mood.IRRITADO]: { emoji: '😠', label: 'Irritado', score: 1, color: '#ef4444' },
};

export interface CheckIn {
  id: string;
  date: string;
  timestamp: number;
  mood: Mood;
  energy: number;
  sleep: number;
  note?: string;
  trigger?: string;
  triggerTags?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  flagged?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: ExerciseCategory;
  iconName: string;
  isPremium: boolean;
  steps: string[];
  systemPrompt?: string;
  hasTimer?: boolean;
  hasBreathing?: boolean;
  audioUrl?: string;
}

export enum ExerciseCategory {
  RESPIRACAO = 'Respiração',
  GROUNDING = 'Grounding',
  TCC = 'Reflexão',
  GRATIDAO = 'Gratidão',
  SONO = 'Sono',
  MINDFULNESS = 'Mindfulness',
  SOS = 'SOS Ansiedade',
}

export interface DiaryEntry {
  id: string;
  date: string;
  timestamp: number;
  prompt: string;
  content: string;
  mood?: Mood;
}

export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-LATAM';

export interface UserSettings {
  isPro: boolean;
  messagesUsedToday: number;
  lastMessageDate: string;
  maxFreeMessages: number;
  theme: 'light' | 'dark';
  reminderTime?: string;
  onboarded: boolean;
  consentLGPD: boolean;
  consentDate?: number;
  ageConfirmed: boolean;
  emergencyContact?: string;
  emergencyPhone?: string;
  name?: string;
  allowAiProcessing: boolean;
  appLockEnabled: boolean;
  locale: SupportedLocale;
  cloudSyncEnabled?: boolean;
  cloudUserId?: string;
  companion?: CompanionState;
  streak?: StreakState;
  achievements?: string[];
  totalXp?: number;
  xpHistory?: { date: string; xp: number }[];
  adsEnabled?: boolean;          // default true (não-Plus veem ads não-personalizados)
  adsPersonalized?: boolean;     // default false (LGPD - precisa opt-in)
  publicProfile?: boolean;
  reminderLearned?: { hour: number; confidence: number };
  inviteCodeUsed?: string;
  inviteCodeOwned?: string;
}

export interface TrailProgress {
  trailId: string;
  completedDays: number[];
  startedAt: number;
  updatedAt: number;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  title: string;
  category: ExerciseCategory;
  date: string;
  timestamp: number;
  source?: 'exercise' | 'trail' | 'sos';
}

export enum ViewState {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  BIBLE = 'BIBLE',
  CHECKIN = 'CHECKIN',
  CHAT = 'CHAT',
  EXERCISES = 'EXERCISES',
  EXERCISE_DETAIL = 'EXERCISE_DETAIL',
  TRAILS = 'TRAILS',
  DIARY = 'DIARY',
  HISTORY = 'HISTORY',
  INSIGHTS = 'INSIGHTS',
  PAYWALL = 'PAYWALL',
  SETTINGS = 'SETTINGS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  SOS = 'SOS',
  COMPANION = 'COMPANION',
  LETTERS = 'LETTERS',
  WRAPPED = 'WRAPPED',
  COLECTIVA = 'COLECTIVA',
  ANON_FEED = 'ANON_FEED',
  BUDDY = 'BUDDY',
  INVITE = 'INVITE',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
}

// ========== GAMIFICAÇÃO ==========

export interface CompanionState {
  name: string;
  species: 'planta' | 'passarinho';
  stage: number;          // 0..5
  xp: number;
  totalXp: number;
  lastCareAt: number;
  mood: 'feliz' | 'ok' | 'sereno' | 'cansado';
  customizations?: { vasoCor?: string; fundo?: string };
}

export interface StreakState {
  current: number;
  longest: number;
  lastDate: string;
  freezesAvailable: number;
  freezesUsedThisMonth: number;
  protectedDates: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number;
  target?: number;
  category: 'streak' | 'checkin' | 'diary' | 'exercise' | 'social' | 'special';
}

export interface UserLevel {
  level: number;
  title: string;
  xpInLevel: number;
  xpToNext: number;
  totalXp: number;
}

// ========== CONEXÃO ==========

export interface FutureLetter {
  id: string;
  createdAt: number;
  deliverAt: number;
  title: string;
  content: string;
  delivered: boolean;
  openedAt?: number;
}

export interface BuddyLink {
  buddyUid: string;
  buddyName: string;
  pairedAt: number;
  shareLevel: 'mood_only' | 'mood_and_note';
}

export interface BuddyPing {
  id: string;
  fromUid: string;
  fromName: string;
  kind: 'abraco' | 'coracao' | 'estou_aqui' | 'forca';
  createdAt: number;
  read?: boolean;
}

export interface InviteCode {
  code: string;
  ownerUid: string;
  createdAt: number;
  redeemedBy?: string;
  redeemedAt?: number;
  rewardGranted?: boolean;
}

export interface AnonPost {
  id: string;
  text: string;          // até 140 chars, sem PII, sem gatilho
  mood?: Mood;
  hearts: number;
  createdAt: number;
  approved: boolean;
}

export interface ColectivaSession {
  id: string;
  startsAt: number;
  endsAt: number;
  participants: number;
  exerciseId: string;
}

// ========== AFIRMAÇÃO DIÁRIA + WRAPPED ==========

export interface DailyAffirmation {
  date: string;
  text: string;
  author?: string;
  palette: string[];
}

export interface WrappedMonth {
  month: string;          // YYYY-MM
  checkinsCount: number;
  exercisesCount: number;
  diaryEntries: number;
  topMood?: Mood;
  topTrigger?: string;
  streakRecord: number;
  palette: string[];
  highlights: string[];
}

// ========== MÉTRICAS ==========

export interface MetricEvent {
  id: string;
  name: string;
  ts: number;
  uid?: string;
  props?: Record<string, string | number | boolean>;
}

export interface CrisisCheck {
  isCrisis: boolean;
  severity: 'none' | 'concern' | 'urgent';
  matchedTerms?: string[];
}

export interface ModelConfig {
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

export interface DailyPlan {
  title: string;
  message: string;
  actionLabel: string;
  targetView: ViewState;
  exerciseId?: string;
}
