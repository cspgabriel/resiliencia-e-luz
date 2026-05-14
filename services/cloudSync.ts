// Sincronização local-first → Firestore.
// Privacidade: só sincroniza quando o usuário marca consent + cloudSyncEnabled.
// Estratégia: writes individuais por documento + merge.
// Caminhos: users/{uid}/{collection}/{id}.
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import { currentUserId } from './firebaseAuth';
import {
  CheckIn, ChatMessage, DiaryEntry, ExerciseLog,
  TrailProgress, UserSettings, FutureLetter,
} from '../types';

type Collection =
  | 'checkins'
  | 'diary'
  | 'chat'
  | 'trail_progress'
  | 'exercise_log'
  | 'letters'
  | 'buddies'
  | 'achievements'
  | 'rewards'
  | 'pings'
  | 'public';

const enabled = (settings: UserSettings | null | undefined): boolean => {
  if (!isFirebaseConfigured()) return false;
  if (!settings?.cloudSyncEnabled) return false;
  if (!settings?.consentLGPD) return false;
  return Boolean(currentUserId());
};

const safe = async (fn: () => Promise<void>): Promise<void> => {
  try { await fn(); } catch (err) {
    // Falha silenciosa: app continua funcional offline com localStorage
    console.warn('[cloudSync]', err);
  }
};

const userDoc = (uid: string, col: Collection, id: string) => {
  const db = getDb();
  if (!db) throw new Error('firestore_unavailable');
  return doc(db, 'users', uid, col, id);
};

const userCol = (uid: string, col: Collection) => {
  const db = getDb();
  if (!db) throw new Error('firestore_unavailable');
  return collection(db, 'users', uid, col);
};

// ---------- SETTINGS (documento único) ----------
export const syncSettings = (settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  const uid = currentUserId()!;
  const db = getDb()!;
  await setDoc(doc(db, 'users', uid), {
    settings,
    updatedAt: Date.now(),
  }, { merge: true });
});

// ---------- CHECK-INS ----------
export const syncCheckin = (c: CheckIn, settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await setDoc(userDoc(currentUserId()!, 'checkins', c.id), c, { merge: true });
});

// ---------- DIÁRIO ----------
export const syncDiaryEntry = (e: DiaryEntry, settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await setDoc(userDoc(currentUserId()!, 'diary', e.id), e, { merge: true });
});

export const removeDiaryEntry = (id: string, settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await deleteDoc(userDoc(currentUserId()!, 'diary', id));
});

// ---------- CHAT ----------
export const syncChatMessage = (m: ChatMessage, settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await setDoc(userDoc(currentUserId()!, 'chat', m.id), m, { merge: true });
});

// ---------- TRILHAS ----------
export const syncTrailProgress = (t: TrailProgress, settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await setDoc(userDoc(currentUserId()!, 'trail_progress', t.trailId), t, { merge: true });
});

// ---------- LOG DE EXERCÍCIOS ----------
export const syncExerciseLog = (l: ExerciseLog, settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await setDoc(userDoc(currentUserId()!, 'exercise_log', l.id), l, { merge: true });
});

// ---------- CARTAS PARA O FUTURO ----------
export const syncLetter = (l: FutureLetter, settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await setDoc(userDoc(currentUserId()!, 'letters', l.id), l, { merge: true });
});

// ---------- COMPANION (documento único) ----------
export const syncCompanion = (settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings) || !settings.companion) return;
  const uid = currentUserId()!; const db = getDb()!;
  await setDoc(doc(db, 'users', uid, 'companion', 'state'), settings.companion, { merge: true });
});

// ---------- ACHIEVEMENTS (lista de ids desbloqueadas) ----------
export const syncAchievements = (ids: string[], settings: UserSettings): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  const uid = currentUserId()!; const db = getDb()!;
  await setDoc(doc(db, 'users', uid, 'achievements', 'unlocked'), {
    ids, updatedAt: Date.now(),
  }, { merge: true });
});

// ---------- BACKFILL (sync inicial) ----------
export const backfillAll = (
  settings: UserSettings,
  checkins: CheckIn[],
  diary: DiaryEntry[],
  messages: ChatMessage[],
  trails: TrailProgress[],
  exerciseLog: ExerciseLog[],
  letters: FutureLetter[] = [],
): Promise<void> => safe(async () => {
  if (!enabled(settings)) return;
  await Promise.all([
    syncSettings(settings),
    syncCompanion(settings),
    syncAchievements(settings.achievements || [], settings),
    ...checkins.map(c => syncCheckin(c, settings)),
    ...diary.map(d => syncDiaryEntry(d, settings)),
    ...messages.map(m => syncChatMessage(m, settings)),
    ...trails.map(t => syncTrailProgress(t, settings)),
    ...exerciseLog.map(l => syncExerciseLog(l, settings)),
    ...letters.map(l => syncLetter(l, settings)),
  ]);
});

// ---------- LIMPAR NUVEM (LGPD - direito ao esquecimento) ----------
export const wipeCloudData = (settings: UserSettings): Promise<void> => safe(async () => {
  if (!isFirebaseConfigured()) return;
  const uid = currentUserId();
  if (!uid) return;
  const cols: Collection[] = ['checkins', 'diary', 'chat', 'trail_progress', 'exercise_log'];
  for (const col of cols) {
    const snap = await getDocs(userCol(uid, col));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  }
  const db = getDb()!;
  await deleteDoc(doc(db, 'users', uid));
});
