# Serenamente AI Proxy - Cloudflare Worker

Proxy simples para tirar a chave Gemini do client.

## Variáveis

- `GEMINI_API_KEY`: chave do Gemini.
- `ALLOWED_ORIGIN`: domínio do app em produção.

## Desenvolvimento

Este Worker é um ponto de partida. Antes de produção, adicionar:

- rate limit por IP/usuário;
- logs sem conteúdo sensível;
- autenticação quando Firebase Auth entrar;
- bloqueio de abuso;
- monitoramento de custo;
- testes de crise também no backend.
