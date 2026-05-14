// Convites 1×1: cada usuário tem um código próprio; quem se cadastra usando
// o código → ambos ganham 30 dias de Plus.
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './firebase';
import { currentUserId } from './firebaseAuth';
import { InviteCode, UserSettings } from '../types';
import { REFERRAL_REWARD_DAYS } from '../constants';
import { recordReferralCreated, recordReferralRedeemed } from './metrics';

const randomCode = (): string => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
};

export const ensureInviteCode = async (settings: UserSettings): Promise<{ code: string; settings: UserSettings }> => {
  if (settings.inviteCodeOwned) return { code: settings.inviteCodeOwned, settings };
  const code = randomCode();
  const next = { ...settings, inviteCodeOwned: code };
  if (isFirebaseConfigured() && settings.cloudSyncEnabled) {
    const db = getDb(); const uid = currentUserId();
    if (db && uid) {
      try {
        await setDoc(doc(db, 'invites', code), {
          code, ownerUid: uid, createdAt: serverTimestamp(),
        } as Partial<InviteCode>, { merge: true });
      } catch {}
    }
  }
  recordReferralCreated(code, settings);
  return { code, settings: next };
};

export const redeemInviteCode = async (
  code: string,
  settings: UserSettings,
): Promise<{ ok: boolean; reason?: string; settings: UserSettings }> => {
  const clean = code.trim().toUpperCase();
  if (!clean) return { ok: false, reason: 'Código vazio', settings };
  if (settings.inviteCodeUsed) return { ok: false, reason: 'Você já usou um código antes', settings };
  if (settings.inviteCodeOwned === clean) return { ok: false, reason: 'Esse é o seu próprio código', settings };

  if (!isFirebaseConfigured() || !settings.cloudSyncEnabled) {
    // Modo offline / sem sync: ativa Plus localmente como bônus
    return {
      ok: true,
      settings: grantPlus({ ...settings, inviteCodeUsed: clean }),
    };
  }

  const db = getDb(); const uid = currentUserId();
  if (!db || !uid) return { ok: false, reason: 'Faça login para usar código', settings };

  try {
    const ref = doc(db, 'invites', clean);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { ok: false, reason: 'Código não encontrado', settings };
    const data = snap.data() as InviteCode;
    if (data.redeemedBy) return { ok: false, reason: 'Código já foi usado', settings };
    if (data.ownerUid === uid) return { ok: false, reason: 'Esse é o seu próprio código', settings };

    await setDoc(ref, { redeemedBy: uid, redeemedAt: serverTimestamp(), rewardGranted: true }, { merge: true });

    // Recompensa para quem usou
    const next = grantPlus({ ...settings, inviteCodeUsed: clean });
    recordReferralRedeemed(clean, settings);

    // O dono do código também recebe Plus — gravamos pedido em users/{owner}/rewards
    try {
      await setDoc(doc(db, 'users', data.ownerUid, 'rewards', `inv-${clean}`), {
        kind: 'referral_redeemed',
        code: clean,
        daysPlus: REFERRAL_REWARD_DAYS,
        createdAt: serverTimestamp(),
      });
    } catch {}

    return { ok: true, settings: next };
  } catch (e) {
    return { ok: false, reason: 'Falha ao validar código', settings };
  }
};

const grantPlus = (s: UserSettings): UserSettings => ({
  ...s,
  isPro: true,
  // Sem campo expira no MVP — Plus é mantido até paywall real entrar
});

export const buildInviteUrl = (code: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://serenamente.app';
  return `${origin}/?ref=${code}`;
};

export const consumeRefFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  const ref = url.searchParams.get('ref');
  if (!ref) return null;
  url.searchParams.delete('ref');
  window.history.replaceState({}, '', url.toString());
  return ref;
};
