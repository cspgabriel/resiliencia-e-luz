# Firebase Setup - Serenamente

Firebase Auth + Firestore para auth anônima, sync opt-in, social features (dupla, mural, calma coletiva), referral, gamificação e métricas.

## 1. Configurar o projeto Firebase

No [Firebase Console](https://console.firebase.google.com) (projeto `animaxx-1f371`):

1. **Authentication** → habilite:
   - **Anônimo** (obrigatório)
   - **Email/Senha** (opcional - upgrade da conta anônima)
2. **Firestore Database** → modo Production.
3. **Web app**: registre em Configurações → Seus apps → `</>`.

## 2. Variáveis de ambiente

Em `.env.local`:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=animaxx-1f371.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=animaxx-1f371
VITE_FIREBASE_STORAGE_BUCKET=animaxx-1f371.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Deploy de regras + índices

```bash
npm install -g firebase-tools
firebase login
firebase use animaxx-1f371

firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 4. Estrutura completa de coleções

```
users/{uid}
├─ (doc principal: { settings, updatedAt })
├─ checkins/{id}
├─ diary/{id}
├─ chat/{id}
├─ trail_progress/{trailId}
├─ exercise_log/{id}
├─ letters/{id}                ← cartas para o futuro
├─ companion/state             ← estado do Sereninho
├─ achievements/unlocked       ← { ids: string[] }
├─ buddies/{buddyUid}          ← duplas vinculadas
├─ pings/{id}                  ← recebidos da dupla
├─ rewards/{id}                ← prêmios (referral)
└─ public/mood                 ← mood visível para a dupla

invites/{CODIGO}                ← referral codes
public/anon_feed/posts/{id}     ← mural moderado
public/colectiva/sessions/{id}/participants/{uid}
metrics/events/all/{id}         ← eventos virais/retenção (write-only do client)
```

## 5. Service Account (Admin SDK) - opcional

Para moderação do mural anônimo, broadcast push, deletar usuário em massa.

Mantenha **fora do git** (já está no `.gitignore`). Use no Worker via secret:

```bash
cd worker
wrangler secret put FIREBASE_SERVICE_ACCOUNT
# cole o JSON inteiro
```

## 6. Bootstrap automático de coleções

Coleções no Firestore só existem quando recebem o primeiro documento. **Não é preciso criar manualmente** — assim que o usuário tomar a primeira ação relevante (check-in, escrever carta, ativar sync), o doc é criado e a coleção surge.

Se quiser pré-criar para visualizar no console, rode o script:

```bash
node scripts/bootstrap-collections.mjs
```

(Esse script grava 1 doc placeholder em cada coleção.)

## 7. Moderação do mural anônimo

Posts são criados com `approved: false`. Use o Firebase Console ou um simples app interno para aprovar:

```
public/anon_feed/posts → set approved=true
```

Filtros automáticos já bloqueiam termos de crise + dados pessoais. Sempre revise antes de aprovar.

## 8. Privacidade (LGPD)

- Sync para a nuvem **só acontece** quando `cloudSyncEnabled === true` E `consentLGPD === true` E há auth.currentUser.
- "Apagar todos os dados" remove local + nuvem (chama `wipeCloudData`).
- Conteúdo sensível (texto do diário, mensagens do chat) só sobe se o usuário ativar.
- Mural anônimo nunca expõe `authorUid` — guardado só para audit interno.
- Dupla compartilha apenas emoji do humor — nunca diário, chat ou nome real (a menos que o usuário coloque o próprio nome no apelido).
