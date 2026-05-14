# Serenamente PWA

App é uma **Progressive Web App** completa: instalável, offline-first, com atualizações em background e shortcuts.

## O que está implementado

- **Service Worker** (`vite-plugin-pwa` + Workbox) com:
  - Precache de todos os assets buildados (JS/CSS/HTML/imagens)
  - Runtime caching de Google Fonts, esm.sh, Firestore
  - **Nunca cacheia** chamadas para o Gemini (custo + privacidade)
  - Update automático em background com prompt antes de aplicar
- **Manifest** completo (`/manifest.webmanifest`) com:
  - 4 shortcuts (Check-in, SOS, Chat, Respirar)
  - `share_target` (recebe conteúdo de outros apps no diário)
  - Ícones SVG + PNG nas múltiplas densidades
  - `display: standalone`, `theme_color`, `categories`
- **Install prompt** customizado:
  - Android/desktop: banner via `beforeinstallprompt` (mostra após 30s)
  - iOS: hint com instruções nativas após 45s
  - Dismiss persiste por 7 dias
- **Indicador offline** no topo quando perde conexão
- **Toast de atualização** quando nova versão do SW está pronta
- **Splash inicial** em HTML puro (some quando React monta)
- **Safe-area insets** para notch do iOS (`.safe-pb`, `.safe-pt`)

## Como instalar

### Android (Chrome/Edge)
1. Visite o site
2. Após 30s aparece o banner "Adicionar à tela inicial"
3. Ou: menu ⋮ → "Instalar app"

### iOS (Safari)
1. Visite o site
2. Botão Compartilhar (□↑)
3. "Adicionar à Tela de Início"

### Desktop (Chrome/Edge)
1. Ícone de instalação na barra de URL (à direita)
2. Ou: menu ⋮ → "Instalar Serenamente"

## Build de produção

```bash
npm install
npm run build
```

Vite + vite-plugin-pwa geram:
- `dist/manifest.webmanifest` — manifest final
- `dist/sw.js` — service worker via Workbox
- `dist/workbox-*.js` — runtime do Workbox
- `dist/assets/*` — bundle JS/CSS com hash

Serve com qualquer host estático (Cloudflare Pages, Vercel, Netlify, etc.). Garanta que **HTTPS está ativo** — PWA não funciona em HTTP exceto `localhost`.

## Ícones PNG

O manifest referencia:
- `/icon.svg` — fonte (já no repo)
- `/icon-192.png` — 192×192
- `/icon-512.png` — 512×512
- `/icon-512-maskable.png` — 512×512 com safe zone para Android
- `/apple-touch-icon.png` — 180×180 para iOS

Para gerar a partir do SVG existente:

```bash
# 1) instale dependência one-shot
npm install --no-save sharp

# 2) rode o gerador
node scripts/generate-icons.mjs
```

O script cria os PNGs em `public/`.

## Shortcuts (long-press no ícone)

| Atalho           | URL                  | Ação                                |
|------------------|----------------------|-------------------------------------|
| Check-in         | `/?action=checkin`   | Abre tela de check-in               |
| SOS Ansiedade    | `/?action=sos`       | Abre SOS                            |
| Conversar        | `/?action=chat`      | Abre chat com Sereno                |
| Respirar agora   | `/?action=breathe`   | Abre Respiração 4-7-8 em modal      |

Funciona em Android (long-press no ícone instalado) e Windows (jump list).

## Share target

Outros apps podem compartilhar texto/URL para o Serenamente. Cai como rascunho no diário. URL recebida:
```
/?share=1&title=...&text=...&url=...
```

## Cache strategy

| Recurso             | Estratégia              | Notas                              |
|---------------------|-------------------------|------------------------------------|
| App shell (build)   | Precache                | Atualiza com nova versão do SW     |
| Google Fonts CSS    | StaleWhileRevalidate    | Cache 1 ano                        |
| Google Fonts WOFF2  | CacheFirst              | Cache 1 ano                        |
| Tailwind CDN        | CacheFirst              | 7 dias (em prod, melhor buildar)   |
| esm.sh              | StaleWhileRevalidate    | 30 dias                            |
| Firestore           | NetworkFirst (6s)       | 24h fallback offline               |
| Gemini API          | NetworkOnly             | Nunca cachear (privacidade)        |

## Testar localmente

```bash
# DEV (SW desabilitado, hot reload normal)
npm run dev

# Preview de PROD (SW ativo, install prompt funcional)
npm run build && npm run preview
```

Para auditar:
- Chrome DevTools → **Lighthouse** → categoria PWA (idealmente score 100)
- Application → **Manifest** verifica o manifest carregado
- Application → **Service Workers** verifica o SW ativo
- Network → **Offline** toggle para testar modo offline

## Critérios de instalabilidade (Chrome)

- ✅ HTTPS (ou localhost)
- ✅ `manifest.webmanifest` com `name`, `short_name`, `icons` 192+512, `start_url`, `display: standalone`
- ✅ Service worker ativo respondendo `fetch`
- ✅ `theme_color`
- ✅ Ícone 192×192 PNG
- ✅ Página servida via SW
