# Firebase Setup - Serenamente

Este projeto usa Firebase **Auth** (anônima + email/senha) e **Firestore** para sincronizar dados do usuário **quando ele dá consentimento explícito**. Por padrão, o app continua local-first.

## 1. Configurar o projeto Firebase

No [Firebase Console](https://console.firebase.google.com) (projeto `animaxx-1f371`):

1. **Authentication** → habilite os provedores:
   - **Anônimo** (obrigatório - usado para iniciar sessão sem fricção)
   - **Email/Senha** (opcional - upgrade da conta anônima)
2. **Firestore Database** → crie no modo Production.
3. **Configurações do Projeto → Seus apps → Web (`</>`)**: registre um app web e copie o objeto de configuração.

## 2. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os valores do passo 1.3:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=animaxx-1f371.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=animaxx-1f371
VITE_FIREBASE_STORAGE_BUCKET=animaxx-1f371.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> Essas chaves são **públicas** (apiKey do Web SDK não é segredo). A segurança vem das Security Rules + Auth.

## 3. Publicar regras de segurança

```bash
# Instale a CLI (uma vez)
npm install -g firebase-tools

# Login e seleção do projeto
firebase login
firebase use animaxx-1f371

# Deploy das regras
firebase deploy --only firestore:rules
```

As regras estão em [`firestore.rules`](../firestore.rules) e isolam cada usuário em `users/{uid}/*`.

## 4. Service Account (Admin SDK)

O arquivo `*firebase-adminsdk*.json` **NÃO** deve ser commitado (já está no `.gitignore`).

Ele só é necessário se você for:
- Validar tokens Firebase no Worker (`worker/index.ts`)
- Executar operações admin (deletar usuários em massa, ler dados de qualquer user)

Para usar no Cloudflare Worker:

```bash
cd worker
# Para dev local
echo 'FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}' > .dev.vars

# Para produção
wrangler secret put FIREBASE_SERVICE_ACCOUNT
# Cole o JSON inteiro em uma única linha
```

> **IMPORTANTE**: se a chave privada vazou (apareceu em chat, foi commitada, etc.), revogue-a imediatamente em
> Firebase Console → Configurações do Projeto → Contas de Serviço → Gerar nova chave.

## 5. Estrutura de dados no Firestore

```
users/{uid}
├─ settings: { ... }                  // documento principal do usuário
├─ checkins/{checkinId}               // mood checkins diários
├─ diary/{entryId}                    // entradas do diário
├─ chat/{messageId}                   // últimas mensagens do chat
├─ trail_progress/{trailId}           // progresso de trilhas
└─ exercise_log/{logId}               // log de exercícios concluídos
```

## 6. Privacidade (LGPD)

- Sync para a nuvem **só acontece se** `cloudSyncEnabled === true` E `consentLGPD === true` E houver `auth.currentUser`.
- "Apagar todos os dados" no app chama `wipeCloudData()` antes de `wipeAllData()`, removendo registros locais **e** na nuvem.
- Conteúdo sensível (texto do diário, mensagens do chat) só sobe se o usuário explicitamente ativou a sincronização.
