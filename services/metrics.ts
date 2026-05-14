// Métricas de produto e virais (D1/D7/D30, K-factor, conversões).
// Sem PII: só evento + props numéricas/categóricas.
// Local primeiro, sync agregado para Firestore quando habilitado.
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import { currentUserId } from './firebaseAuth';
import { MetricEvent, UserSettings } from '../types';
import { today } from './date';

const LS_KEY = 'serenamente_metrics_queue';

const readQueue = (): MetricEvent[] => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
};
const writeQueue = (q: MetricEvent[]) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(q.slice(-500))); } catch {}
};

export const recordMetric = async (
  name: string,
  props?: Record<string, string | number | boolean>,
  settings?: UserSettings,
): Promise<void> => {
  const evt: MetricEvent = {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    ts: Date.now(),
    uid: currentUserId() || undefined,
    props,
  };
  const q = readQueue();
  q.push(evt);
  writeQueue(q);

  if (!isFirebaseConfigured() || !settings?.cloudSyncEnabled) return;
  const db = getDb();
  if (!db) return;
  try {
    await addDoc(collection(db, 'metrics', 'events', 'all'), {
      name: evt.name,
      ts: serverTimestamp(),
      uid: evt.uid || null,
      props: evt.props || {},
      day: today(),
    });
  } catch {/* falha silenciosa */}
};

// Retenção D1/D7/D30 — registrada no primeiro acesso do dia
export const recordDailyRetention = async (settings: UserSettings): Promise<void> => {
  const last = localStorage.getItem('serenamente_last_open_day');
  const t = today();
  if (last === t) return;
  localStorage.setItem('serenamente_last_open_day', t);

  const firstSeen = localStorage.getItem('serenamente_first_seen') || t;
  if (!localStorage.getItem('serenamente_first_seen')) {
    localStorage.setItem('serenamente_first_seen', t);
  }
  const days = (new Date(t).getTime() - new Date(firstSeen).getTime()) / 86400000;
  let cohort: string | null = null;
  if (days === 1) cohort = 'd1';
  else if (days === 7) cohort = 'd7';
  else if (days === 30) cohort = 'd30';
  await recordMetric('app_open', { day: t, days_since_install: Math.floor(days), retention: cohort || 'other' }, settings);
};

// Virais
export const recordReferralCreated = (code: string, settings?: UserSettings) =>
  recordMetric('referral_code_created', { code }, settings);

export const recordReferralRedeemed = (code: string, settings?: UserSettings) =>
  recordMetric('referral_redeemed', { code }, settings);

export const recordShare = (kind: string, settings?: UserSettings) =>
  recordMetric('content_shared', { kind }, settings);

export const recordViralCoefficientHint = (settings?: UserSettings) =>
  recordMetric('viral_coefficient_tick', {}, settings);

// Funil
export const recordFunnelStep = (step: string, settings?: UserSettings) =>
  recordMetric('funnel_step', { step }, settings);
