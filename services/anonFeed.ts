// Mural anônimo "Sentindo Junto" — só posts aprovados aparecem.
// Moderação: filtro automático por keywords + flag `approved=false` por padrão.
import {
  collection, addDoc, query, where, orderBy, limit, getDocs, doc,
  updateDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import { currentUserId } from './firebaseAuth';
import { AnonPost, Mood } from '../types';
import { ANON_BANNED_TERMS, ANON_MAX_LEN } from '../constants';

export const sanitizeAnonText = (raw: string): { ok: boolean; text?: string; reason?: string } => {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: 'Mensagem vazia.' };
  if (trimmed.length > ANON_MAX_LEN) return { ok: false, reason: `Máximo ${ANON_MAX_LEN} caracteres.` };
  const lower = trimmed.toLowerCase();
  for (const term of ANON_BANNED_TERMS) {
    if (lower.includes(term)) return { ok: false, reason: 'Esse conteúdo precisa de cuidado humano. Procure CVV 188.' };
  }
  return { ok: true, text: trimmed };
};

export const submitAnonPost = async (raw: string, mood?: Mood): Promise<{ ok: boolean; reason?: string }> => {
  const s = sanitizeAnonText(raw);
  if (!s.ok) return s;
  if (!isFirebaseConfigured()) return { ok: false, reason: 'Sincronização desativada.' };
  const db = getDb(); const uid = currentUserId();
  if (!db || !uid) return { ok: false, reason: 'Você precisa estar logado.' };
  try {
    await addDoc(collection(db, 'public', 'anon_feed', 'posts'), {
      text: s.text,
      mood: mood || null,
      hearts: 0,
      createdAt: serverTimestamp(),
      approved: false,           // moderação humana antes de exibir
      authorUid: uid,            // só para audit, NUNCA exibido
    });
    return { ok: true };
  } catch {
    return { ok: false, reason: 'Não foi possível enviar agora.' };
  }
};

export const fetchAnonFeed = async (max = 30): Promise<AnonPost[]> => {
  if (!isFirebaseConfigured()) return [];
  const db = getDb();
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'public', 'anon_feed', 'posts'),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(max),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data() as any;
      return {
        id: d.id,
        text: data.text,
        mood: data.mood || undefined,
        hearts: data.hearts || 0,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        approved: true,
      } as AnonPost;
    });
  } catch { return []; }
};

export const reactToAnonPost = async (postId: string): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  if (!db) return;
  try {
    await updateDoc(doc(db, 'public', 'anon_feed', 'posts', postId), {
      hearts: increment(1),
    });
  } catch {}
};
