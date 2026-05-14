#!/usr/bin/env node
// Pré-cria todas as coleções no Firestore com um doc placeholder.
// Útil para visualizar a estrutura no console antes do primeiro usuário real.
//
// Uso:
//   1) Baixe a chave do service account e SAVE FORA DO REPO (~/.firebase/sa.json)
//   2) export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.firebase/sa.json"
//   3) node scripts/bootstrap-collections.mjs
//
// Para remover os placeholders depois, basta apagar o doc 'placeholder' de cada coleção.

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const PLACEHOLDER_UID = '__placeholder__';

const collections = [
  ['users', PLACEHOLDER_UID],
  ['users', PLACEHOLDER_UID, 'checkins', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'diary', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'chat', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'trail_progress', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'exercise_log', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'letters', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'companion', 'state'],
  ['users', PLACEHOLDER_UID, 'achievements', 'unlocked'],
  ['users', PLACEHOLDER_UID, 'buddies', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'pings', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'rewards', 'placeholder'],
  ['users', PLACEHOLDER_UID, 'public', 'mood'],
  ['invites', 'PLACEHOLDER'],
  ['public', 'anon_feed', 'posts', 'placeholder'],
  ['public', 'colectiva', 'sessions', 'placeholder'],
  ['public', 'colectiva', 'sessions', 'placeholder', 'participants', PLACEHOLDER_UID],
  ['metrics', 'events', 'all', 'placeholder'],
];

const payload = {
  __bootstrap: true,
  createdAt: FieldValue.serverTimestamp(),
  note: 'Documento placeholder gerado por scripts/bootstrap-collections.mjs. Pode apagar.',
};

const run = async () => {
  for (const segments of collections) {
    if (segments.length % 2 !== 0) {
      console.warn('Pulando (path com número ímpar de segmentos):', segments.join('/'));
      continue;
    }
    const ref = db.doc(segments.join('/'));
    await ref.set(payload, { merge: true });
    console.log('✓', segments.join('/'));
  }
  console.log('\nBootstrap concluído.');
};

run().catch(err => { console.error(err); process.exit(1); });
