// Gamificação: XP, nível, streak gentil (com freezes), companheiro (Sereninho), conquistas.
// Tudo local-first. Sync para Firestore acontece via cloudSync quando ativado.
import {
  CompanionState, StreakState, UserLevel, UserSettings, Achievement,
} from '../types';
import {
  XP_EVENTS, LEVELS, COMPANION_STAGES,
  STREAK_FREEZES_PER_MONTH, ACHIEVEMENTS_CATALOG,
} from '../constants';
import { today, dateKey, daysBetween } from './date';
import { trackSafeEvent } from './analytics';

// ---------------- COMPANION ----------------

export const defaultCompanion = (): CompanionState => ({
  name: 'Sereninho',
  species: 'planta',
  stage: 0,
  xp: 0,
  totalXp: 0,
  lastCareAt: Date.now(),
  mood: 'feliz',
});

export const stageForXp = (xp: number): number => {
  let stage = 0;
  for (const s of COMPANION_STAGES) if (xp >= s.needXp) stage = s.stage;
  return stage;
};

export const companionMood = (lastCareAt: number): CompanionState['mood'] => {
  const hrs = (Date.now() - lastCareAt) / 36e5;
  if (hrs < 12) return 'feliz';
  if (hrs < 48) return 'ok';
  if (hrs < 96) return 'cansado';
  return 'sereno';
};

// ---------------- NÍVEL ----------------

export const computeLevel = (totalXp: number): UserLevel => {
  let current = LEVELS[0];
  let next = LEVELS[1] || LEVELS[0];
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].needXp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || LEVELS[i];
    }
  }
  const xpInLevel = totalXp - current.needXp;
  const xpToNext = Math.max(0, next.needXp - current.needXp);
  return { level: current.level, title: current.title, xpInLevel, xpToNext, totalXp };
};

// ---------------- STREAK ----------------

export const defaultStreak = (): StreakState => ({
  current: 0,
  longest: 0,
  lastDate: '',
  freezesAvailable: STREAK_FREEZES_PER_MONTH,
  freezesUsedThisMonth: 0,
  protectedDates: [],
});

const monthKey = (d: string) => d.slice(0, 7);

export const advanceStreak = (prev: StreakState | undefined): StreakState => {
  const t = today();
  const s = prev ? { ...prev } : defaultStreak();

  // Reset mensal de freezes
  if (s.lastDate && monthKey(s.lastDate) !== monthKey(t)) {
    s.freezesAvailable = STREAK_FREEZES_PER_MONTH;
    s.freezesUsedThisMonth = 0;
  }

  if (s.lastDate === t) return s; // já contou hoje

  if (!s.lastDate) {
    s.current = 1;
  } else {
    const gap = daysBetween(s.lastDate, t);
    if (gap === 1) {
      s.current += 1;
    } else if (gap > 1 && s.freezesAvailable > 0) {
      // Consome freezes para cobrir até 3 dias de gap
      const used = Math.min(gap - 1, s.freezesAvailable, 3);
      s.freezesAvailable -= used;
      s.freezesUsedThisMonth += used;
      // protectedDates: o intervalo entre lastDate e hoje
      for (let i = 1; i <= used; i++) {
        const d = new Date(s.lastDate);
        d.setDate(d.getDate() + i);
        s.protectedDates.push(dateKey(d));
      }
      // Se freezes cobriram o gap, continua. Se não cobriram tudo, streak quebra.
      if (gap - 1 <= used) s.current += 1; else s.current = 1;
    } else {
      s.current = 1;
    }
  }
  s.lastDate = t;
  s.longest = Math.max(s.longest, s.current);
  return s;
};

// ---------------- XP / EVENTOS ----------------

export type XpSource = keyof typeof XP_EVENTS;

export const applyXp = (
  settings: UserSettings,
  source: XpSource,
  multiplier = 1,
): UserSettings => {
  const gained = Math.round((XP_EVENTS[source] || 0) * multiplier);
  if (gained <= 0) return settings;

  // Streak: qualquer ação core (checkin/diary/exercise/trail) avança o dia
  let streak = settings.streak;
  const streakAdvancingSources: XpSource[] = ['checkin', 'diary_entry', 'exercise_complete', 'trail_day'];
  let firstOfDayBonus = 0;
  if (streakAdvancingSources.includes(source)) {
    const before = streak?.lastDate;
    streak = advanceStreak(streak);
    if (before !== streak.lastDate) firstOfDayBonus = XP_EVENTS.first_of_day_bonus;
  }

  // Companion
  const comp = settings.companion ? { ...settings.companion } : defaultCompanion();
  comp.xp += gained + firstOfDayBonus;
  comp.totalXp += gained + firstOfDayBonus;
  comp.lastCareAt = Date.now();
  comp.mood = companionMood(comp.lastCareAt);
  comp.stage = stageForXp(comp.totalXp);

  const totalXp = (settings.totalXp || 0) + gained + firstOfDayBonus;

  trackSafeEvent('xp_gained', { source, amount: gained, total_xp: totalXp });

  return { ...settings, companion: comp, streak, totalXp };
};

// ---------------- ACHIEVEMENTS ----------------

export const buildAchievements = (unlockedIds: string[] = []): Achievement[] => {
  const set = new Set(unlockedIds);
  return ACHIEVEMENTS_CATALOG.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    icon: a.icon,
    target: a.target,
    category: a.category,
    unlockedAt: set.has(a.id) ? Date.now() : undefined,
  }));
};

export interface AchievementContext {
  checkinsCount: number;
  diaryCount: number;
  exerciseCount: number;
  streakCurrent: number;
  hasLetter: boolean;
  hasShared: boolean;
  hasBuddy: boolean;
  hasColectiva: boolean;
  hourOfDay: number;
  returnedAfterPause: boolean;
}

export const checkUnlocks = (
  unlocked: string[],
  ctx: AchievementContext,
): string[] => {
  const have = new Set(unlocked);
  const checks: Record<string, () => boolean> = {
    streak_3:     () => ctx.streakCurrent >= 3,
    streak_7:     () => ctx.streakCurrent >= 7,
    streak_30:    () => ctx.streakCurrent >= 30,
    streak_100:   () => ctx.streakCurrent >= 100,
    checkin_10:   () => ctx.checkinsCount >= 10,
    checkin_50:   () => ctx.checkinsCount >= 50,
    diary_first:  () => ctx.diaryCount >= 1,
    diary_30:     () => ctx.diaryCount >= 30,
    exercise_5:   () => ctx.exerciseCount >= 5,
    exercise_25:  () => ctx.exerciseCount >= 25,
    first_letter: () => ctx.hasLetter,
    first_share:  () => ctx.hasShared,
    first_buddy:  () => ctx.hasBuddy,
    colectiva_1:  () => ctx.hasColectiva,
    night_owl:    () => ctx.hourOfDay >= 23 || ctx.hourOfDay < 4,
    early_bird:   () => ctx.hourOfDay < 7 && ctx.hourOfDay >= 5,
    comeback:     () => ctx.returnedAfterPause,
  };
  const newly: string[] = [];
  for (const id of Object.keys(checks)) {
    if (!have.has(id) && checks[id]()) {
      newly.push(id);
      trackSafeEvent('achievement_unlocked', { achievement_id: id });
    }
  }
  return newly;
};
