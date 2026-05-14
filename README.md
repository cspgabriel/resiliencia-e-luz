# Serenamente

> Sua mente em paz, todo dia.

Apoio emocional diário com IA, check-in, exercícios, diário, trilhas e SOS. **Não substitui psicoterapia, atendimento médico ou serviços de emergência.** É um app para autocuidado, organização de sentimentos e suporte entre um dia difícil e o próximo passo.

PWA leve em React/Vite/TS. Local-first para armazenamento. IA via proxy backend em produção.

---

## 🎯 Posicionamento

| | ChatGPT / Claude | Serenamente |
|---|---|---|
| Tom | genérico/corporativo | acolhedor PT-BR |
| Abertura | tela em branco | check-in em 30s |
| Rotina | conversa solta | plano de hoje + trilhas |
| Memória | conversa | humor, sono, energia, gatilhos e diário local |
| Crise | resposta variável | SOS + contatos de ajuda + guardrails |
| Privacidade | depende da conta/provedor | dados locais por padrão + consentimento separado para IA |

---

## 🚀 Rodar local

```bash
npm install
cp .env.example .env.local
npm run dev
```

App em http://localhost:3000

> ⚠️ Em produção, não use chave Gemini no client. Use o Cloudflare Worker em `worker/` ou outro backend proxy com rate limit.

---

## 🧱 Arquitetura

```text
serenamente-app/
├── App.tsx
├── types.ts
├── constants.ts
├── services/
│   ├── date.ts              # datas locais, evita bug de UTC
│   ├── geminiService.ts     # chat via proxy + fallback dev opcional
│   ├── safety.ts            # detector de crise + off-topic
│   ├── analytics.ts         # eventos seguros, sem conteúdo sensível
│   └── storage.ts           # localStorage local-first
├── components/
│   ├── HomeDashboard.tsx    # check-in + plano de hoje
│   ├── CheckIn.tsx          # humor, sono, energia e gatilhos
│   ├── ChatInterface.tsx    # consentimento de IA
│   ├── Trails.tsx           # trilhas guiadas
│   ├── Insights.tsx         # padrões sem diagnóstico
│   ├── SOS.tsx              # respiração + ajuda humana
│   └── LegalPage.tsx        # política/termos internos
├── worker/
│   └── index.ts             # proxy Gemini Cloudflare Worker
└── docs/
    ├── PRD_SERENAMENTE_V2.md
    └── INTERNATIONAL_LAUNCH_CHECKLIST.md
```

---

## 🛡 Segurança e confiança

1. Disclaimer permanente: apoio emocional, não psicoterapia.
2. Detector de crise antes da IA.
3. SOS com CVV 188, SAMU 192, CAPS e contato de confiança.
4. Consentimento separado para conversa com IA.
5. Dados locais por padrão para check-in, diário, histórico e trilhas.
6. Botão “Apagar todos os meus dados”.
7. Analytics sem conteúdo sensível.
8. Minutas internas de Política de Privacidade e Termos.

---

## ✨ Recursos V2

- Plano de hoje baseado no check-in.
- Tags de gatilho para gerar padrões úteis.
- Tela de insights sem diagnóstico.
- Trilhas guiadas de 7/14/21 dias.
- Log local de exercícios concluídos.
- Contato de confiança no SOS.
- Correção de data local.
- Worker proxy para IA.
- Base de internacionalização por mercado.

---

## 💰 Plano comercial

### Free

- Check-in ilimitado
- Chat: 8 msg/dia
- Exercícios essenciais
- Diário 7 dias
- 1 trilha gratuita

### Plus — R$ 19,90/mês ou R$ 119/ano

- Chat ampliado
- Todos os exercícios + áudios futuros
- Diário ilimitado + insights
- Trilhas premium
- Export PDF futuro
- Sem ads

> Apps nativos devem usar Apple In-App Purchase / Google Play Billing para bens digitais. Stripe/Mercado Pago ficam para web/PWA quando permitido.

---

## 🗺 Roadmap

### Fase 1 — Trust & Daily Use

- Backend proxy
- Política/termos revisados
- Plano de hoje
- Insights
- Trilhas
- Contato de confiança

### Fase 2 — Beta e monetização

- Billing real
- Export PDF
- Áudios
- Push notifications
- TestFlight/Play Internal Testing

### Fase 3 — App nativo

- Capacitor
- App lock/PIN/biometria
- Notificações seguras
- App Store/Play Store

### Fase 4 — Internacional

- i18n
- Contatos de crise por país
- Prompts por idioma
- Política e termos por região
- Piloto em inglês

---

## 📞 Emergência (BR)

- **CVV 188** — 24h, gratuito
- **chat.cvv.org.br** — chat 24h
- **SAMU 192** — emergência médica
- **CAPS** — unidade local

---

© 2026 Serenamente · Feito com cuidado no Brasil 💚
