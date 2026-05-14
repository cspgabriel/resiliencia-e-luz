// Wrapped mensal: agrega dados do mês e gera um resumo "Spotify Wrapped style".
import { CheckIn, DiaryEntry, ExerciseLog, Mood, MOOD_META, WrappedMonth } from '../types';
import { monthKey } from './date';

const PALETTES: string[][] = [
  ['#FBCFE8','#FDE68A','#A7F3D0'],
  ['#BFDBFE','#C7D2FE','#FBCFE8'],
  ['#FED7AA','#FECACA','#FDE68A'],
  ['#A5F3FC','#A7F3D0','#86EFAC'],
  ['#DDD6FE','#FBCFE8','#FDE68A'],
];

const pickPalette = (m: string): string[] => {
  let h = 0;
  for (let i = 0; i < m.length; i++) h = (h * 31 + m.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
};

const mode = <T,>(arr: T[]): T | undefined => {
  const counts = new Map<T, number>();
  for (const a of arr) counts.set(a, (counts.get(a) || 0) + 1);
  let best: T | undefined; let bestC = 0;
  for (const [k, v] of counts) if (v > bestC) { best = k; bestC = v; }
  return best;
};

export const buildWrapped = (
  month: string,
  checkins: CheckIn[],
  diary: DiaryEntry[],
  exerciseLog: ExerciseLog[],
  streakLongest: number,
): WrappedMonth => {
  const m = checkins.filter(c => monthKey(c.date) === month);
  const d = diary.filter(e => monthKey(e.date) === month);
  const x = exerciseLog.filter(e => monthKey(e.date) === month);

  const topMood = mode(m.map(c => c.mood)) as Mood | undefined;
  const triggers = m.flatMap(c => c.triggerTags || (c.trigger ? [c.trigger] : []));
  const topTrigger = mode(triggers);

  const highlights: string[] = [];
  if (m.length) highlights.push(`${m.length} check-in${m.length > 1 ? 's' : ''} este mês`);
  if (d.length) highlights.push(`${d.length} entrada${d.length > 1 ? 's' : ''} no diário`);
  if (x.length) highlights.push(`${x.length} exercício${x.length > 1 ? 's' : ''} completos`);
  if (topMood) highlights.push(`Humor mais frequente: ${MOOD_META[topMood].label} ${MOOD_META[topMood].emoji}`);
  if (topTrigger) highlights.push(`Tema do mês: ${topTrigger}`);
  if (streakLongest >= 3) highlights.push(`Maior sequência: ${streakLongest} dias`);

  return {
    month,
    checkinsCount: m.length,
    exercisesCount: x.length,
    diaryEntries: d.length,
    topMood,
    topTrigger,
    streakRecord: streakLongest,
    palette: pickPalette(month),
    highlights,
  };
};

export const isLastDayOfMonth = (d = new Date()): boolean => {
  const next = new Date(d);
  next.setDate(d.getDate() + 1);
  return next.getMonth() !== d.getMonth();
};

export const previousMonthKey = (d = new Date()): string => {
  const p = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  const y = p.getFullYear(); const m = String(p.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};
