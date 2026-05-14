// Datas locais. Evita o bug de UTC do toISOString() virar o dia errado no Brasil.

const pad = (n: number): string => String(n).padStart(2, '0');

export const localDate = (date = new Date()): string => {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
};

export const today = (): string => localDate();

export const daysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return localDate(d);
};

export const startOfLocalDayMs = (date = new Date()): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const formatShortDatePtBr = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });

export const dateKey = (d: Date): string => localDate(d);

export const daysBetween = (aIso: string, bIso: string): number => {
  const a = new Date(aIso + 'T00:00:00');
  const b = new Date(bIso + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86400000);
};

export const monthKey = (d: string): string => d.slice(0, 7);
