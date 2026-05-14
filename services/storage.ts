// Persistência local (localStorage) - tudo no device por padrão (privacidade LGPD)
import { CheckIn, ChatMessage, DiaryEntry, UserSettings } from '../types';

const KEYS = {
  settings:  'serenamente_settings',
  checkins:  'serenamente_checkins',
  diary:     'serenamente_diary',
  chat:      'serenamente_chat',
  trail:     'serenamente_trail_progress',
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

export const today = (): string => new Date().toISOString().split('T')[0];

// SETTINGS
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
  };
  const stored = get<Partial<UserSettings>>(KEYS.settings, {});
  const merged = { ...defaults, ...stored };
  if (merged.lastMessageDate !== today()) {
    merged.messagesUsedToday = 0;
    merged.lastMessageDate = today();
  }
  return merged;
};

export const saveSettings = (s: UserSettings) => set(KEYS.settings, s);

// CHECK-INS
export const loadCheckins = (): CheckIn[] => get<CheckIn[]>(KEYS.checkins, []);
export const saveCheckin = (c: CheckIn) => {
  const all = loadCheckins();
  all.unshift(c);
  set(KEYS.checkins, all.slice(0, 365));
};

// DIÁRIO
export const loadDiary = (): DiaryEntry[] => get<DiaryEntry[]>(KEYS.diary, []);
export const saveDiaryEntry = (e: DiaryEntry) => {
  const all = loadDiary();
  all.unshift(e);
  set(KEYS.diary, all.slice(0, 1000));
};
export const deleteDiaryEntry = (id: string) => {
  set(KEYS.diary, loadDiary().filter(e => e.id !== id));
};

// CHAT (apenas últimas 50 msgs - rolling)
export const loadChat = (): ChatMessage[] => get<ChatMessage[]>(KEYS.chat, []);
export const saveChat = (msgs: ChatMessage[]) => set(KEYS.chat, msgs.slice(-50));

// LIMPAR TUDO (direito LGPD ao esquecimento)
export const wipeAllData = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem('serenamente_settings');
};

// INCREMENTO DE USO DE MSG (free tier)
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
