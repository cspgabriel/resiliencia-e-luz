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
  name?: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  CHECKIN = 'CHECKIN',
  CHAT = 'CHAT',
  EXERCISES = 'EXERCISES',
  EXERCISE_DETAIL = 'EXERCISE_DETAIL',
  DIARY = 'DIARY',
  HISTORY = 'HISTORY',
  PAYWALL = 'PAYWALL',
  SETTINGS = 'SETTINGS',
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
