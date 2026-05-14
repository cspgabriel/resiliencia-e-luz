// Auth helpers: anônima por padrão (sem fricção), upgrade para email/senha opcional.
import {
  signInAnonymously,
  onAuthStateChanged,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './firebase';

export const ensureAnonymousUser = async (): Promise<User | null> => {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
};

export const watchUser = (cb: (user: User | null) => void): (() => void) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
};

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('firebase_not_configured');
  // Se já existe um usuário anônimo, faz upgrade (preserva o uid e os dados)
  if (auth.currentUser?.isAnonymous) {
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  }
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('firebase_not_configured');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signOut = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await fbSignOut(auth);
};

export const currentUserId = (): string | null => {
  if (!isFirebaseConfigured()) return null;
  return getFirebaseAuth()?.currentUser?.uid ?? null;
};
