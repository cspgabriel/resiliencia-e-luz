// Dupla de cuidado: dois usuários se vinculam e podem ver mood do outro + mandar reações.
// Privacidade: só humor (emoji) viaja. Nada de diário, chat, nome.
import {
  doc, setDoc, getDoc, getDocs, deleteDoc, collection,
  query, orderBy, limit, addDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import { currentUserId } from './firebaseAuth';
import { BuddyLink, BuddyPing, Mood, UserSettings } from '../types';

const requireDb = () => {
  if (!isFirebaseConfigured()) throw new Error('firebase_not_configured');
  const db = getDb(); const uid = currentUserId();
  if (!db || !uid) throw new Error('not_signed_in');
  return { db, uid };
};

// Vincular: ambos os usuários gravam o link. O fluxo simplificado é compartilhar um link com seu uid.
export const linkBuddy = async (
  buddyUid: string,
  buddyName: string,
): Promise<BuddyLink> => {
  const { db, uid } = requireDb();
  const link: BuddyLink = {
    buddyUid, buddyName,
    pairedAt: Date.now(),
    shareLevel: 'mood_only',
  };
  await setDoc(doc(db, 'users', uid, 'buddies', buddyUid), link);
  return link;
};

export const unlinkBuddy = async (buddyUid: string): Promise<void> => {
  const { db, uid } = requireDb();
  await deleteDoc(doc(db, 'users', uid, 'buddies', buddyUid));
};

export const listBuddies = async (): Promise<BuddyLink[]> => {
  try {
    const { db, uid } = requireDb();
    const snap = await getDocs(collection(db, 'users', uid, 'buddies'));
    return snap.docs.map(d => d.data() as BuddyLink);
  } catch { return []; }
};

// Atualiza o mood "público para dupla" — vai num doc separado para isolar privacidade
export const publishMoodToBuddies = async (mood: Mood, settings: UserSettings): Promise<void> => {
  if (!isFirebaseConfigured() || !settings.cloudSyncEnabled) return;
  try {
    const { db, uid } = requireDb();
    await setDoc(doc(db, 'users', uid, 'public', 'mood'), {
      mood, updatedAt: serverTimestamp(),
    });
  } catch {}
};

export const fetchBuddyMood = async (buddyUid: string): Promise<{ mood?: Mood }> => {
  try {
    const { db } = requireDb();
    const snap = await getDoc(doc(db, 'users', buddyUid, 'public', 'mood'));
    if (!snap.exists()) return {};
    return { mood: snap.data().mood };
  } catch { return {}; }
};

export const sendPing = async (
  buddyUid: string,
  kind: BuddyPing['kind'],
  fromName?: string,
): Promise<void> => {
  const { db, uid } = requireDb();
  await addDoc(collection(db, 'users', buddyUid, 'pings'), {
    fromUid: uid,
    fromName: fromName || 'sua dupla',
    kind,
    createdAt: serverTimestamp(),
    read: false,
  } as Partial<BuddyPing>);
};

export const subscribePings = (
  cb: (pings: BuddyPing[]) => void,
): (() => void) => {
  try {
    const { db, uid } = requireDb();
    const q = query(collection(db, 'users', uid, 'pings'), orderBy('createdAt', 'desc'), limit(30));
    return onSnapshot(q, snap => {
      const items: BuddyPing[] = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          fromUid: data.fromUid,
          fromName: data.fromName,
          kind: data.kind,
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
          read: data.read,
        };
      });
      cb(items);
    });
  } catch {
    return () => {};
  }
};
