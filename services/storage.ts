// Persistência local (localStorage) - local-first por padrão (privacidade LGPD)
import { CheckIn, ChatMessage, DiaryEntry, Exercise, ExerciseLog, TrailProgress, UserSettings } from '../types';
import { today } from './date';
import {
  syncSettings, syncCheckin, syncDiaryEntry, removeDiaryEntry,
  syncChatMessage, syncTrailProgress, syncExerciseLog,
} from './cloudSync';

const KEYS = {
  settings:    'resilienciaeluz_settings',
  checkins:    'resilienciaeluz_checkins',
  diary:       'resilienciaeluz_diary',
  chat:        'resilienciaeluz_chat',
  trail:       'resilienciaeluz_trail_progress',
  exerciseLog: 'resilienciaeluz_exercise_log',
};

const get = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const set = <T,>(key: string, value: T) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export const loadSettings = (): UserSettings => {
  const defaults: UserSettings = {
    isPro: false,
    messagesUsedToday: 0,
    lastMessageDate: today(),
    maxFreeMessages: 8,
    theme: 'light',
    onboarded: false,
    consentLGPD: false,
    ageConfirmed: false,
    allowAiProcessing: false,
    appLockEnabled: false,
    locale: 'pt-BR',
  };
  const stored = get<Partial<UserSettings>>(KEYS.settings, {});
  const merged = { ...defaults, ...stored };
  if (merged.lastMessageDate !== today()) {
    merged.messagesUsedToday = 0;
    merged.lastMessageDate = today();
  }
  return merged;
};

export const saveSettings = (s: UserSettings) => {
  set(KEYS.settings, s);
  syncSettings(s);
};

export const loadCheckins = (): CheckIn[] => get<CheckIn[]>(KEYS.checkins, []);
export const saveCheckin = (c: CheckIn) => {
  const rest = loadCheckins().filter(existing => existing.id !== c.id && existing.date !== c.date);
  const sorted = [c, ...rest].sort((a, b) => b.timestamp - a.timestamp);
  set(KEYS.checkins, sorted.slice(0, 365));
  syncCheckin(c, loadSettings());
};

export const loadDiary = (): DiaryEntry[] => get<DiaryEntry[]>(KEYS.diary, []);
export const saveDiaryEntry = (e: DiaryEntry) => {
  const all = loadDiary();
  all.unshift(e);
  set(KEYS.diary, all.slice(0, 1000));
  syncDiaryEntry(e, loadSettings());
};
export const deleteDiaryEntry = (id: string) => {
  set(KEYS.diary, loadDiary().filter(e => e.id !== id));
  removeDiaryEntry(id, loadSettings());
};

export const loadChat = (): ChatMessage[] => get<ChatMessage[]>(KEYS.chat, []);
export const saveChat = (msgs: ChatMessage[]) => {
  const trimmed = msgs.slice(-50);
  set(KEYS.chat, trimmed);
  const settings = loadSettings();
  const last = trimmed[trimmed.length - 1];
  if (last) syncChatMessage(last, settings);
};

export const loadTrailProgress = (): TrailProgress[] => get<TrailProgress[]>(KEYS.trail, []);
export const saveTrailProgress = (items: TrailProgress[]) => set(KEYS.trail, items);
export const completeTrailDay = (trailId: string, day: number): TrailProgress[] => {
  const all = loadTrailProgress();
  const now = Date.now();
  const current = all.find(t => t.trailId === trailId) || {
    trailId,
    completedDays: [],
    startedAt: now,
    updatedAt: now,
  };
  const completedDays = Array.from(new Set([...current.completedDays, day])).sort((a, b) => a - b);
  const updated = { ...current, completedDays, updatedAt: now };
  const next = [updated, ...all.filter(t => t.trailId !== trailId)];
  saveTrailProgress(next);
  syncTrailProgress(updated, loadSettings());
  return next;
};

export const loadExerciseLog = (): ExerciseLog[] => get<ExerciseLog[]>(KEYS.exerciseLog, []);
export const saveExerciseCompletion = (exercise: Exercise, source: ExerciseLog['source'] = 'exercise'): ExerciseLog[] => {
  const entry: ExerciseLog = {
    id: `exlog-${Date.now()}`,
    exerciseId: exercise.id,
    title: exercise.title,
    category: exercise.category,
    date: today(),
    timestamp: Date.now(),
    source,
  };
  const next = [entry, ...loadExerciseLog()].slice(0, 1000);
  set(KEYS.exerciseLog, next);
  syncExerciseLog(entry, loadSettings());
  return next;
};

export const wipeAllData = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
};

export const incrementMessageCount = (): UserSettings => {
  const s = loadSettings();
  s.messagesUsedToday += 1;
  s.lastMessageDate = today();
  saveSettings(s);
  return s;
};

export const canSendMessage = (settings: UserSettings): boolean => {
  if (settings.isPro) return settings.messagesUsedToday < 200;
  return settings.messagesUsedToday < settings.maxFreeMessages;
};
