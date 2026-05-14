# Serenamente V2 — Trust, Daily Use & International Foundation

## Objetivo

Transformar o protótipo em uma versão mais pronta para beta público, com foco em segurança, uso diário e base para internacionalização.

## Escopo implementado nesta versão

### Trust & Safety

- Consentimento explícito para conversa com IA.
- Texto de privacidade mais honesto: local-first para armazenamento, mas IA externa para processamento do chat quando ativada.
- Páginas internas de Política de Privacidade e Termos de Uso como minuta operacional.
- SOS com linguagem menos absoluta e mais segura.
- Contato de confiança configurável.
- Estrutura de app lock/PIN para versão nativa.
- Proxy Cloudflare Worker para tirar a chave Gemini do client em produção.

### Uso diário

- Plano de hoje gerado por regras simples após check-in.
- Tags de gatilho no check-in.
- Tela de Insights com padrões sem diagnóstico.
- Log local de exercícios concluídos.
- Tela de Trilhas com progresso diário.
- Correção de datas locais para evitar bug de UTC em check-in/diário.

### Internacionalização

- Estrutura inicial `MARKET_CONFIGS` por mercado.
- Observação de que crise, preço, termos e tom precisam ser localizados por país.

## Fora do escopo desta entrega

- Compra real via App Store/Google Play Billing.
- Exportação PDF real.
- Áudios hospedados no R2.
- Push notifications nativas.
- PIN/biometria funcional.
- Revisão jurídica final.
- Revisão clínica por profissional habilitado.

## Métricas recomendadas

- Onboarding concluído.
- Primeiro check-in.
- Check-ins por semana.
- Exercícios concluídos.
- Dias de trilha concluídos.
- Uso do SOS.
- Conversão para Plus.
- Retenção D1/D7/D30.

Importante: analytics não devem capturar conteúdo de diário, chat, notas ou dados sensíveis.
