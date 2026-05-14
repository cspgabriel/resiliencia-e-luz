// Calma Coletiva — contador de pessoas respirando junto em tempo real.
// Heartbeat por sessão (atualiza a cada 10s, expira em 30s).
import {
  doc, setDoc, getDoc, onSnapshot, serverTimestamp, deleteDoc, increment,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import { currentUserId } from './firebaseAuth';
import { COLECTIVA_SCHEDULE_HOUR, COLECTIVA_DURATION_MIN } from '../constants';

export const currentSessionId = (d = new Date()): string => {
  // Sessão por dia + janela de COLECTIVA_DURATION_MIN minutos à partir do horário
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}-${COLECTIVA_SCHEDULE_HOUR}`;
};

export const isSessionLive = (d = new Date()): boolean => {
  if (d.getHours() !== COLECTIVA_SCHEDULE_HOUR) return false;
  return d.getMinutes() < COLECTIVA_DURATION_MIN;
};

export const minutesUntilNext = (d = new Date()): number => {
  const target = new Date(d);
  target.setHours(COLECTIVA_SCHEDULE_HOUR, 0, 0, 0);
  if (target.getTime() <= d.getTime()) target.setDate(target.getDate() + 1);
  return Math.round((target.getTime() - d.getTime()) / 60000);
};

export const joinSession = async (): Promise<{ sessionId: string } | null> => {
  if (!isFirebaseConfigured()) return null;
  const db = getDb(); const uid = currentUserId();
  if (!db || !uid) return null;
  const sessionId = currentSessionId();
  try {
    await setDoc(doc(db, 'public', 'colectiva', 'sessions', sessionId, 'participants', uid), {
      uid, joinedAt: serverTimestamp(),
    });
    // contador agregado
    await setDoc(doc(db, 'public', 'colectiva', 'sessions', sessionId), {
      participants: increment(1),
      lastUpdate: serverTimestamp(),
    }, { merge: true });
    return { sessionId };
  } catch { return null; }
};

export const leaveSession = async (sessionId: string): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = getDb(); const uid = currentUserId();
  if (!db || !uid) return;
  try {
    await deleteDoc(doc(db, 'public', 'colectiva', 'sessions', sessionId, 'participants', uid));
    await setDoc(doc(db, 'public', 'colectiva', 'sessions', sessionId), {
      participants: increment(-1),
    }, { merge: true });
  } catch {}
};

export const subscribeParticipantCount = (
  sessionId: string,
  cb: (count: number) => void,
): (() => void) => {
  if (!isFirebaseConfigured()) { cb(0); return () => {}; }
  const db = getDb();
  if (!db) { cb(0); return () => {}; }
  return onSnapshot(doc(db, 'public', 'colectiva', 'sessions', sessionId), snap => {
    cb((snap.data() as any)?.participants || 0);
  });
};

export const fetchParticipantCount = async (sessionId: string): Promise<number> => {
  if (!isFirebaseConfigured()) return 0;
  const db = getDb();
  if (!db) return 0;
  try {
    const snap = await getDoc(doc(db, 'public', 'colectiva', 'sessions', sessionId));
    return (snap.data() as any)?.participants || 0;
  } catch { return 0; }
};
