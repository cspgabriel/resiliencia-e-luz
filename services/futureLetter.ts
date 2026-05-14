// Cartas para o eu do futuro. Local-first; sync para Firestore quando habilitado.
import { FutureLetter, UserSettings } from '../types';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import { currentUserId } from './firebaseAuth';

const LS_KEY = 'serenamente_letters';

export const loadLetters = (): FutureLetter[] => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
};

const saveLocal = (items: FutureLetter[]) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items.slice(0, 200))); } catch {}
};

const syncOne = async (l: FutureLetter, settings: UserSettings) => {
  if (!isFirebaseConfigured() || !settings.cloudSyncEnabled) return;
  const uid = currentUserId(); const db = getDb();
  if (!uid || !db) return;
  try { await setDoc(doc(db, 'users', uid, 'letters', l.id), l, { merge: true }); } catch {}
};

export const saveLetter = async (l: FutureLetter, settings: UserSettings): Promise<FutureLetter[]> => {
  const all = loadLetters();
  const next = [l, ...all.filter(x => x.id !== l.id)];
  saveLocal(next);
  await syncOne(l, settings);
  return next;
};

export const deleteLetter = async (id: string, settings: UserSettings): Promise<FutureLetter[]> => {
  const next = loadLetters().filter(l => l.id !== id);
  saveLocal(next);
  if (isFirebaseConfigured() && settings.cloudSyncEnabled) {
    const uid = currentUserId(); const db = getDb();
    if (uid && db) {
      try { await deleteDoc(doc(db, 'users', uid, 'letters', id)); } catch {}
    }
  }
  return next;
};

export const markDelivered = async (id: string, settings: UserSettings): Promise<FutureLetter[]> => {
  const all = loadLetters().map(l => l.id === id ? { ...l, delivered: true, openedAt: Date.now() } : l);
  saveLocal(all);
  const found = all.find(l => l.id === id);
  if (found) await syncOne(found, settings);
  return all;
};

export const dueLetters = (): FutureLetter[] =>
  loadLetters().filter(l => !l.delivered && l.deliverAt <= Date.now());
