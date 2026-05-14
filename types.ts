// Serenamente - tipos centrais do app de bem-estar

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
