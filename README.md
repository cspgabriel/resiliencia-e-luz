# IA Magica - Psicologia e Bem-Estar

Base clonada de `cspgabriel/IA-Magica---Gemini` para evoluir em um app freemium de psicologia, autocuidado e bem-estar.

## Status

- Frontend: React + Vite + PWA.
- Base atual: biblioteca de prompts, chat, onboarding, temas, PWA.
- Plano completo: [`docs/plano-completo-psicologia-bem-estar-deepseek.md`](docs/plano-completo-psicologia-bem-estar-deepseek.md).
- Atenção: app ainda precisa de backend proxy antes de uso público. Nunca exponha chave DeepSeek/Gemini no browser em produção.

## Rodar local

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e preencha somente para teste local.

## Proxima fase

1. Migrar texto para DeepSeek via backend proxy.
2. Remover dependência direta do Gemini no cliente.
3. Criar autenticação, limites freemium, histórico seguro e billing.
4. Implementar camada de segurança clínica e LGPD antes de lançar.
