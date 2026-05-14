# Serenamente

> Sua mente em paz, todo dia.

Apoio emocional diário com IA. **Não substitui psicoterapia** — é o que você usa entre as sessões (ou antes de procurar uma).

PWA leve em React/Vite/TS, IA via Gemini Flash-Lite. Local-first (LGPD by default).

---

## 🎯 Posicionamento

| | ChatGPT / Claude | Serenamente |
|---|---|---|
| Tom | corporativo | acolhedor PT-BR |
| Abertura | tela em branco | check-in em 30s |
| Memória | esquece | lembra do seu humor da semana |
| Crise | resposta genérica | direciona CVV 188 forçado |
| Estrutura | aberto | 12 exercícios + 4 trilhas |
| Privacidade | treina com dado | tudo no device |

---

## 🚀 Rodar local

```bash
npm install
cp .env.example .env.local
# preencha VITE_GEMINI_API_KEY (obtenha em aistudio.google.com)
npm run dev
```

App em http://localhost:3000

> ⚠ Chave no client é OK pra dev. Em produção: backend proxy obrigatório.

---

## 🧱 Arquitetura

```
serenamente-app/
├── App.tsx
├── types.ts                   # Mood, ViewState, CheckIn
├── constants.ts               # 12 exercícios, system prompt, crisis terms
├── services/
│   ├── geminiService.ts       # Gemini Flash-Lite com guardrails
│   ├── safety.ts              # detector de crise + off-topic
│   └── storage.ts             # localStorage local-first
└── components/                # 12 telas (Landing, Home, Chat, etc)
```

---

## 🛡 Segurança clínica

1. Disclaimer permanente no rodapé do chat
2. Detector de crise → CVV 188 forçado **antes** de IA
3. Recusa de diagnóstico no system prompt
4. Off-topic (código, marketing) é bloqueado
5. Idade 18+ + consentimento LGPD no onboarding
6. Botão "Apagar todos os dados" em Ajustes

---

## 💰 Plano comercial

### Free
- Check-in ilimitado
- Chat: 8 msg/dia (Flash-Lite)
- 5 exercícios essenciais
- Diário 7 dias
- 1 trilha (Calma 7d)
- Ads rewarded permitido

### Plus — R$ 19,90/mês ou R$ 119/ano
- Chat ilimitado (200/dia cap)
- 12 exercícios + áudios
- Diário ilimitado + gráficos
- 4 trilhas
- Export PDF
- Sem ads

### Margem (BR 2026)
- Custo free: R$ 0,50–1/mês (Flash-Lite)
- Receita ads: R$ 2–4/mês
- Plus: ~85% margem

### Stack escalável
- Firebase Auth (50k MAU grátis)
- Cloudflare Worker proxy IA + rate limit
- R2 áudios (egress zero)
- Stripe + Mercado Pago (4-6% fee, evita 30% das lojas)
- Capacitor pra empacotar nativo

---

## 🗺 Roadmap

### ✅ Fase 1 — MVP (entregue)
- Landing, onboarding LGPD, check-in, chat, exercícios, diário, paywall, SOS
- Detector de crise + system prompt acolhedor
- PWA offline

### Fase 2 — Backend + billing (4 sem)
- Cloudflare Worker (rate limit + IA proxy)
- Firebase Auth
- Stripe + Mercado Pago
- AdSense

### Fase 3 — App nativo (4 sem)
- Capacitor (iOS + Android)
- AdMob
- Apple Health + Google Fit opcional
- Push notifications

### Fase 4 — Crescimento
- +3 trilhas
- Áudios R2
- Programa empresa B2B
- Afiliado Zenklub/Vittude

---

## 📞 Emergência (BR)

- **CVV 188** — 24h, gratuito
- **chat.cvv.org.br** — chat 24h
- **SAMU 192** — emergência médica
- **CAPS** — unidade local

---

## ⚠ Legal

- Não substitui psicoterapia
- LGPD Art. 11 (dado sensível) — consentimento explícito
- Apple/Play: revisão extra, disclaimer forte aprova
- DPO recomendado após 10k MAU

---

© 2026 Serenamente · Feito com cuidado no Brasil 💚
