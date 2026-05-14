# Plano completo - IA Magica Psicologia e Bem-Estar

Data: 2026-05-14  
Repo origem: `https://github.com/cspgabriel/IA-Magica---Gemini`  
Novo repo alvo: `cspgabriel/ia-magica-psicologia-bem-estar`

## 1. Diagnostico da base atual

Stack:
- React + Vite + TypeScript.
- PWA simples: `manifest.json`, `sw.js`, `DownloadApp`.
- UI pronta: landing, dashboard, biblioteca, chat, prompts customizados, onboarding, tema claro/escuro.
- Dados locais: `localStorage` para prompts, settings e onboarding.
- IA atual: `@google/genai` em `services/geminiService.ts`.
- Analytics/Firebase: inicializacao no client.

Pontos bons:
- Base visual ja existe.
- UX mobile/PWA ja encaminhada.
- Psicologia ja aparece como profissao e tem prompts iniciais em `constants.ts`.
- Produto ja tem tela de planos e nocao de free/pro.

Riscos atuais:
- Chave Gemini estava hardcoded no frontend. Foi removida no novo snapshot.
- Firebase estava hardcoded. Foi movido para variaveis `VITE_FIREBASE_*`.
- Sem backend. Isso impede chave DeepSeek segura, billing confiavel, historico privado e controle de abuso.
- Sem auth, sem contas, sem limites reais, sem pagamento, sem LGPD, sem safety layer.
- Conteudo de saude mental ainda nao tem guardrail clinico: risco de parecer diagnostico/terapia.

Conclusao:
Base serve como prototipo UI. Para virar app gratuito/pago de psicologia e bem-estar, o produto precisa virar uma plataforma segura, com backend, consentimento, limites, trilhas guiadas e posicionamento claro: apoio de bem-estar, nao substituto de psicoterapia.

## 2. Posicionamento do produto

Nome sugerido:
- IA Magica Bem-Estar
- Calmamente AI
- Diario Mental IA

Promessa:
> Um app de autocuidado guiado por IA para organizar pensamentos, reduzir sobrecarga emocional e criar rotinas de bem-estar com exercicios baseados em TCC, mindfulness e psicoeducacao.

Nao prometer:
- Diagnostico.
- Tratamento psicologico.
- Atendimento de crise.
- Substituicao de psicologo/psiquiatra.

Segmentos:
- B2C: pessoas ansiosas, sobrecarregadas, buscando autocuidado diario.
- B2P: psicologos que querem materiais, resumos e exercicios, com consentimento do paciente.
- B2B futuro: empresas com programa de bem-estar para colaboradores.

## 3. MVP gratuito

Objetivo: ativar usuario em 5 minutos.

Funcionalidades:
- Onboarding emocional: objetivo, contexto, nivel de estresse, horario preferido.
- Check-in diario: humor, ansiedade, energia, sono, gatilho do dia.
- Diario guiado: "o que aconteceu", "o que senti", "o que pensei", "qual proximo passo".
- Exercicios curtos:
  - respiracao 4-7-8;
  - grounding 5-4-3-2-1;
  - registro de pensamento TCC;
  - roteiro de mindfulness;
  - carta para si mesmo;
  - plano de autocuidado de 24h.
- Biblioteca gratuita com 15 a 25 exercicios.
- Chat limitado com DeepSeek Flash.
- Historico local ou cloud basico.
- Aviso de seguranca: nao e terapia, em crise procure ajuda imediata.

Limites free sugeridos:
- 10 mensagens/dia ou 150 mensagens/mes.
- 7 dias de historico cloud.
- Sem exportacao PDF.
- Sem trilhas longas.

## 4. Plano pago

Plus - R$ 19,90/mes:
- 300 a 500 mensagens/mes.
- Historico completo.
- Trilhas de 7, 14 e 30 dias.
- Insights semanais.
- Exercicios premium.
- Exportacao PDF do diario.
- Lembretes.

Pro - R$ 39,90/mes:
- 1.000 mensagens/mes.
- Modo raciocinio para planos longos.
- Relatorios mensais.
- Biblioteca completa.
- Planos personalizados.
- Backup cloud.

Profissional - R$ 59 a R$ 99/mes:
- Templates para psicologos.
- Resumo SOAP.
- Psicoeducacao para enviar ao paciente.
- Gerador de tarefas terapeuticas.
- Consentimento e disclaimers.
- Sem usar dados do paciente sem autorizacao.

## 5. DeepSeek no lugar do Gemini

Fonte oficial consultada: `https://api-docs.deepseek.com/quick_start/pricing/`.

Precos oficiais por 1M tokens em 2026-05-14:
- DeepSeek V4 Flash: input cache miss US$ 0.14, input cache hit US$ 0.0028, output US$ 0.28.
- DeepSeek V4 Pro: input cache miss US$ 0.435, input cache hit US$ 0.003625, output US$ 0.87, com desconto oficial ate 2026-05-31 15:59 UTC.
- Modelos `deepseek-chat` e `deepseek-reasoner` seguem compatibilidade, mas serao depreciados futuramente segundo a doc oficial.

Modelo recomendado:
- Default: `deepseek-v4-flash` ou alias compativel `deepseek-chat`.
- Raciocinio/premium: `deepseek-v4-pro` ou alias compativel `deepseek-reasoner`.
- Nao usar DeepSeek direto no browser em producao. Usar backend proxy.

Arquitetura de chamada:
```text
Frontend -> API backend /api/chat -> safety layer -> DeepSeek -> safety output -> resposta
```

## 6. Calculo de custo com DeepSeek

Cambio usado para simulacao: US$ 1 = R$ 5,00. Ajustar antes de precificar oficialmente.

Formula:
```text
custo = (input_tokens / 1.000.000 * preco_input) + (output_tokens / 1.000.000 * preco_output)
```

### Custo por interacao

Check-in curto:
- 1.000 input + 600 output no Flash.
- Custo: US$ 0.000308.
- Em BRL: R$ 0.00154.

Sessao guiada:
- 3.000 input + 1.500 output no Flash.
- Custo: US$ 0.00084.
- Em BRL: R$ 0.0042.

Sessao premium com raciocinio:
- 4.000 input + 2.000 output no Pro.
- Custo: US$ 0.00348.
- Em BRL: R$ 0.0174.

### Custo mensal por usuario

Free realista:
- 20 interacoes/mes, 1.000 input + 600 output.
- Custo mensal: US$ 0.00616.
- Em BRL: R$ 0.0308.

Plus:
- 300 interacoes/mes, 1.200 input + 800 output no Flash.
- Custo por interacao: US$ 0.000392.
- Custo mensal: US$ 0.1176.
- Em BRL: R$ 0.588.

Pro pesado:
- 1.000 interacoes/mes, 1.500 input + 1.000 output no Flash.
- Custo por interacao: US$ 0.00049.
- Custo mensal: US$ 0.49.
- Em BRL: R$ 2.45.

Pro misto:
- 240 interacoes Flash: US$ 0.09408.
- 60 interacoes Pro com 3.000 input + 1.500 output: US$ 0.1566.
- Custo mensal total: US$ 0.25068.
- Em BRL: R$ 1.2534.

Leitura comercial:
- R$ 19,90/mes suporta uso normal com margem bruta de IA acima de 95%.
- R$ 39,90/mes suporta usuario pesado com boa margem.
- O gargalo de custo nao e token; e suporte, aquisicao, compliance, pagamentos, infra e churn.

## 7. Compliance e seguranca clinica

Obrigatorio antes de launch publico:
- Termos de uso e politica de privacidade.
- Consentimento explicito para dados sensiveis de saude mental.
- LGPD: base legal, minimizacao, exportacao e exclusao de dados.
- Criptografia em transito e repouso.
- Retencao de dados configuravel.
- Botao "apagar meus dados".
- Aviso visivel: nao substitui psicologo, psiquiatra ou emergencia.
- Fluxo de crise: ideacao suicida, automutilacao, violencia, abuso, surto, risco imediato.
- Encaminhamento para CVV 188, SAMU 192, emergencia local e rede de apoio.
- Revisao por psicologo/CRP para prompts e copy.

Regra de produto:
- Nao diagnosticar.
- Nao prescrever medicacao.
- Nao dizer "voce tem X".
- Nao simular relacao terapeutica clinica.
- Usar linguagem de apoio, psicoeducacao e autocuidado.

## 8. Arquitetura tecnica alvo

Frontend:
- React/Vite ou migrar para Next.js se quiser API routes e deploy mais simples.
- PWA, dark mode, mobile-first.

Backend:
- Node/Nest/Fastify ou Next.js API routes.
- `/api/chat`
- `/api/checkin`
- `/api/journal`
- `/api/billing`
- `/api/account/delete`

Banco:
- Supabase/Postgres com RLS.
- Tabelas: users, profiles, checkins, journal_entries, conversations, subscriptions, usage_events, safety_events, cancel_surveys.

IA:
- Provider adapter: DeepSeek default.
- Safety classifier antes e depois da resposta.
- Prompt de sistema versionado no backend.
- Cache de system prompt para reduzir custo.
- Rate limits por plano.

Pagamentos:
- Stripe global ou Mercado Pago Brasil.
- Webhook obrigatorio para liberar plano.
- Dunning para pagamento falho.

Analytics:
- PostHog para eventos, funis, cohorts e feature flags.
- Eventos: signup, onboarding_completed, first_checkin, first_ai_session, streak_3, paywall_seen, checkout_started, subscribed, cancel_started, saved_cancel.

## 9. Retencao e churn prevention

Metrica de ativacao:
Usuario ativado = completou onboarding + fez 1 check-in + concluiu 1 exercicio + voltou em ate 48h.

Health score:
```text
score = checkins_7d*30 + exercicios_7d*25 + streak*20 + historico_chat*15 + sono/humor_trend*10
```

Sinais de risco:
- 3 dias sem check-in depois de ativar.
- Abriu app mas nao concluiu exercicio.
- Queda de humor por 3 dias sem plano de apoio.
- Visitou tela de cancelamento.
- Falha de pagamento.

Intervencoes:
- Dia 2 sem uso: lembrete leve.
- Dia 4: exercicio de 2 minutos.
- Dia 7: resumo de progresso.
- Antes do cancelamento: perguntar motivo.

Cancel flow:
- Motivos:
  - caro;
  - nao uso;
  - nao ajudou;
  - prefiro psicologo;
  - preocupacao com privacidade;
  - problema tecnico;
  - outro.
- Ofertas:
  - caro: 30% por 3 meses;
  - nao uso: pausar 30 dias;
  - nao ajudou: trilha guiada de 7 dias;
  - privacidade: exportar/apagar dados e explicar controles;
  - problema tecnico: suporte prioritario.

Dunning:
- Dia 0: pagamento falhou.
- Dia 3: lembrete.
- Dia 7: acesso sera pausado.
- Dia 10: pausa, nao deletar dados.
- Reativacao com link simples.

Win-back:
- 7 dias apos cancelamento: "seu historico continua disponivel ate X".
- 30 dias: nova trilha gratuita de 7 dias.
- 90 dias: oferta anual com desconto.

## 10. Roadmap de execucao

Fase 1 - Base segura (1 semana):
- Remover todos os segredos do frontend.
- Criar backend proxy DeepSeek.
- Criar `.env.example`.
- Trocar texto de landing para bem-estar.
- Desativar imagem/video no MVP.
- Criar safety prompt inicial.
- Criar disclaimer e tela de crise.

Fase 2 - MVP funcional (2 a 3 semanas):
- Auth.
- Check-in diario.
- Diario guiado.
- Chat com limite free.
- Historico.
- 20 exercicios revisados.
- Dashboard de progresso.
- Eventos PostHog.

Fase 3 - Monetizacao (1 a 2 semanas):
- Stripe/Mercado Pago.
- Planos Free/Plus/Pro.
- Limites por plano.
- Checkout.
- Webhooks.
- Tela de upgrade.
- Cancel flow.

Fase 4 - Retencao (1 semana):
- Streaks.
- Lembretes.
- Relatorio semanal.
- Health score.
- Dunning.
- Win-back.

Fase 5 - Launch controlado:
- Beta privada.
- 50 usuarios.
- Revisao de seguranca.
- Ajuste de prompts.
- Medir CAC, ativacao, retencao D7/D30, conversao free->paid.

## 11. Backlog prioritario

P0:
- Backend proxy DeepSeek.
- Remover Gemini do cliente.
- Safety crisis flow.
- LGPD: apagar/exportar dados.
- Auth e database.
- Rate limit por usuario.

P1:
- Check-in e diario.
- Biblioteca de exercicios.
- Paywall e billing.
- Analytics.
- Cancel flow.

P2:
- Profissionais.
- Relatorios PDF.
- Comunidade/grupos.
- WhatsApp reminders.
- B2B empresas.

## 12. Decisao recomendada

Melhor caminho:
1. Manter app como freemium B2C de bem-estar.
2. Usar DeepSeek Flash para 90% das chamadas.
3. Usar DeepSeek Pro/reasoner so em trilhas pagas ou relatorios.
4. Cobrar R$ 19,90 no Plus e R$ 39,90 no Pro.
5. Lancar beta privado antes de marketing publico.
6. Tratar psicologia clinica como conteudo revisado, nao como promessa medica.

Nao lancar pago publico antes de:
- backend seguro;
- consentimento LGPD;
- safety layer;
- termos;
- revisao por profissional;
- cancelamento facil.
