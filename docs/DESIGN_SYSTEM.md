# Serenamente — Design System

> Versão 2.0 · Atualizado em 2026-05-15
> Base do redesign V2 (commit a partir de `023581c`).

Documentação viva da linguagem visual do Serenamente. Cobre tokens, componentes, padrões e regras de uso. Mantém consistência entre landing, app interno (HomeDashboard, Sidebar, Onboarding) e telas futuras.

---

## 1. Princípios

A marca cuida. Cada decisão visual precisa atender pelo menos um destes pilares:

1. **Acolhedor antes de bonito.** O design valida o usuário antes de propor ação. Cores quentes-no-frio, espaços generosos, sem cobrança visual.
2. **Sereno, não apagado.** Profundidade cromática (teal escuro + gradientes) substitui o pastel-flat genérico de apps wellness. É um adulto que respira, não um Tamagotchi.
3. **Confiança visível.** LGPD, dados locais, sem ads e disclaimer médico aparecem com peso. Não escondemos a parte importante.
4. **Movimento opcional.** Toda animação respeita `prefers-reduced-motion` e jamais bloqueia leitura. Conteúdo é visível por padrão.
5. **Português Brasil em primeiro lugar.** Tom direto, coloquial e direto-ao-coração. "Você tá" supera "How are you feeling today".

---

## 2. Identidade verbal

| Elemento        | Voz                                                                                             |
|-----------------|--------------------------------------------------------------------------------------------------|
| Tagline         | **Sua mente em paz, todo dia.**                                                                  |
| Mascote IA      | **Sereno** — assistente, não terapeuta. Valida antes de sugerir.                                 |
| Pronome         | Você (nunca "tu", nunca "o(a) usuário(a)")                                                       |
| Cumprimentos    | "Bom dia", "Como você tá?", "Faz sentido se sentir assim"                                        |
| Proibido        | Jargão clínico ("ansiedade generalizada", "TAG"), promessas ("vai melhorar"), emojis em excesso  |
| Frases-âncora   | "Sentir não é fraqueza", "Pequeno também conta", "Você merece o mesmo cuidado que oferece"        |

---

## 3. Logotipo

- Ícone em [`/public/icon.svg`](../public/icon.svg): círculo + 3 ondas + folha estilizada, gradient `#5EB8B3 → #1A6B73`.
- Sempre exibido com `glow` sutil em headers (blob `bg-brand-400` blur md `opacity:40-50`).
- Tamanhos mínimos: 32px em mobile, 36px em sidebar, 40px no header da landing.
- Wordmark: **Serenamente** em Plus Jakarta Sans, weight 700, cor `brand-700` (light) ou `brand-200` (dark), tracking `tight`.

---

## 4. Cores

### 4.1 Paleta de marca (`brand`)

Definida em [`index.html`](../index.html) via `tailwind.config.theme.extend.colors.brand`.

| Token        | Hex       | Uso                                                              |
|--------------|-----------|------------------------------------------------------------------|
| `brand-50`   | `#EFFAF8` | Hover state suave, fundos de chip em light mode                  |
| `brand-100`  | `#D7F2EE` | Texto inverso em fundos escuros                                  |
| `brand-200`  | `#AFE4DC` | Texto/border em dark mode                                        |
| `brand-300`  | `#7FCDC4` | Blobs decorativos, hover states                                  |
| `brand-400`  | `#5EB8B3` | Gradient start, ícones secundários                               |
| `brand-500`  | `#3FA09B` | Estados intermediários                                           |
| `brand-600`  | `#1A6B73` | **Cor principal** — links, ícones primários, texto destacado     |
| `brand-700`  | `#155B62` | CTA primário (gradient end), texto em fundo claro                |
| `brand-800`  | `#0E4D54` | Theme color do PWA, gradient escuro (header bar)                 |
| `brand-900`  | `#093A40` | Acentos extremos, body background dark                           |

### 4.2 Cores funcionais

| Função              | Light                | Dark                  | Uso                                       |
|---------------------|----------------------|-----------------------|-------------------------------------------|
| Fundo da página     | `#F4F9F8`            | `#050E10`             | `body { background }`                     |
| Texto primário      | `slate-900`          | `white`               | Headlines, body principal                 |
| Texto secundário    | `slate-600`          | `slate-300`           | Parágrafos, subheadings                   |
| Texto sutil         | `slate-500`          | `slate-400`           | Meta info, hints, caption                 |
| Borda padrão        | `slate-200/60`       | `slate-700/60`        | Cards não-glass                           |
| Sucesso             | `emerald-500`        | `emerald-400`         | Check-ins concluídos, validação           |
| Atenção             | `amber-500`          | `amber-300`           | Streak fire, prioridades médias           |
| Erro / SOS          | `red-500/rose-600`   | `red-400`             | SOS, crisis CTA, contatos de emergência   |
| Info                | `sky-500`            | `sky-400`             | Consentimento IA, processamento externo   |

### 4.3 Gradientes assinatura

```css
/* Brand horizontal (CTA primário) */
linear-gradient(135deg, #1A6B73 0%, #5EB8B3 100%);

/* Brand profundo (hero cards, paywall) */
linear-gradient(135deg, #0E4D54 0%, #155B62 45%, #1A6B73 100%);

/* Brand cinemático (CTA final, finish-state) */
linear-gradient(135deg, #0E4D54 0%, #1A6B73 50%, #5EB8B3 100%);
```

### 4.4 Cores categóricas (quick actions, features)

Sempre como `bg-gradient-to-br` em ícones-chip 10-12 com sombra suave:

| Categoria       | Gradient                        |
|-----------------|----------------------------------|
| Conversa / IA   | `from-teal-400 to-emerald-500`   |
| Respiração      | `from-sky-400 to-cyan-500`       |
| Trilhas         | `from-violet-400 to-purple-500`  |
| Diário          | `from-indigo-400 to-blue-500`    |
| Insights        | `from-amber-400 to-orange-500`   |
| Cartas / afeto  | `from-rose-400 to-pink-500`      |
| Comunidade      | `from-cyan-400 to-sky-600`       |
| Conquistas      | `from-yellow-400 to-amber-500`   |
| Sono            | `from-indigo-400 to-purple-500`  |
| SOS             | `from-red-500 to-rose-600`       |

> **Regra:** o gradient é só no ícone-chip ou no card grande hero/paywall. Nunca aplique gradient ao corpo de texto pequeno.

---

## 5. Tipografia

### 5.1 Famílias

- **Plus Jakarta Sans** (300–800) — sans-serif geométrica humanizada. Base de TODO o sistema. CDN Google Fonts.
- **Instrument Serif** (regular + italic) — serif suave para acentos em headlines. Usada exclusivamente em **palavras emocionais** dentro de H1/H2 ("todo dia.", "honestas.", "hoje?").

```html
<h1>Como você tá, <span class="font-serif italic text-brand-gradient">Mark</span>?</h1>
```

### 5.2 Escala

| Token            | Tamanho            | Weight | Uso                                |
|------------------|--------------------|--------|------------------------------------|
| Display (hero)   | `text-[64px]` lg / `text-5xl` md / `text-4xl` sm | 700 | Hero H1, CTA final                 |
| H2               | `text-5xl` md / `text-3xl` sm | 700 | Section headings                   |
| H3               | `text-xl` / `text-lg` | 700 | Card titles, FAQ questions         |
| Body large       | `text-lg md:text-xl` | 400 | Hero subhead, intros               |
| Body             | `text-base`        | 400    | Texto corrido                      |
| Body small       | `text-sm`          | 400-500| Cards, listas, descrições          |
| Caption          | `text-xs`          | 500    | Meta info, microcopy               |
| Eyebrow / Kicker | `text-xs uppercase tracking-widest` | 700 | "RECURSOS", "PLANOS", etc.         |

### 5.3 Tracking & leading

- Headlines: `tracking-tight leading-[1.05]`
- Body: `leading-relaxed`
- Eyebrows: `tracking-widest`

### 5.4 Utility `.text-brand-gradient`

Texto com gradient brand animado (8s loop). Usar em palavras-chave de headlines, jamais em parágrafos.

```css
.text-brand-gradient {
  background: linear-gradient(135deg, #1A6B73 0%, #5EB8B3 50%, #1A6B73 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  color: transparent;
  animation: gradientMove 8s ease infinite;
}
```

---

## 6. Espaçamento e raio

### 6.1 Espaçamento (Tailwind scale)

- Padding interno de cards: `p-5` (mobile) → `p-6 md:p-8` (desktop)
- Gap entre cards: `gap-3` (denso), `gap-5` (padrão), `gap-10 lg:gap-12` (hero)
- Container máximo: `max-w-6xl mx-auto px-5 md:px-8` (landing), `max-w-4xl` (home, conteúdo focado)
- Seção: `py-16 md:py-24` em landing, `pt-8 md:pt-12` em home

### 6.2 Raios

| Token          | Valor   | Uso                                              |
|----------------|---------|--------------------------------------------------|
| `rounded-lg`   | 0.5rem  | Tags pequenas, chips                             |
| `rounded-xl`   | 0.75rem | Inputs, ícone-chips                              |
| `rounded-2xl`  | 1rem    | Cards padrão, mini-trilhas                       |
| `rounded-3xl`  | 1.5rem  | Cards premium, glass cards, pricing              |
| `rounded-full` | 9999px  | Avatares, CTAs principais, chips de eyebrow      |
| `rounded-[2rem]` | 32px  | CTA hero final                                   |
| `rounded-[2.5rem]` | 40px | Frame do iPhone no hero                         |

---

## 7. Elevação e profundidade

### 7.1 Shadows customizados

```js
'brand-soft': '0 10px 40px -10px rgba(26,107,115,0.35)'  // CTAs, cards
'brand-glow': '0 20px 80px -20px rgba(94,184,179,0.55)'  // Hero, premium
'glass':      '0 8px 32px 0 rgba(14,77,84,0.18)'         // Glass cards
```

### 7.2 Glass morphism

Dois níveis:

| Classe          | Background                                   | Quando usar                                |
|-----------------|----------------------------------------------|--------------------------------------------|
| `.glass`        | `rgba(255,255,255,0.65)` + blur 20px         | Cards normais, FAQ, trust bar              |
| `.glass-strong` | `rgba(255,255,255,0.85)` + blur 24px         | Modais, header sticky scrolled, pricing    |

Em dark mode, ambos viram `rgba(14,77,84,0.35-0.7)`. Sempre com `backdrop-filter: blur() saturate(180%)`.

### 7.3 Background patterns

- **`.mesh-bg`** — Gradient mesh radial (4 hotspots) sobre `#F4F9F8`. Usar na **landing** e fluxos de **onboarding**.
- **`.mesh-soft`** — Variante mais sutil, dois hotspots, `#F8FCFB`. Usar dentro do **app interno** (HomeDashboard, telas com sidebar).
- **`.dot-grid`** — Padrão de pontos sutis (18px grid). Usar em CTAs escuros como camada decorativa.

### 7.4 Blobs decorativos

Padrão usado em hero, modal, CTA final:

```jsx
<div aria-hidden className="pointer-events-none absolute top-0 -left-20 w-[480px] h-[480px] rounded-full bg-brand-300/30 blur-[120px] animate-float-slow" />
```

Sempre com `aria-hidden`, `pointer-events-none`, blur 100-120px, opacity 15-40%.

---

## 8. Animação

### 8.1 Keyframes disponíveis

| Nome          | Duração | Uso                                              |
|---------------|---------|--------------------------------------------------|
| `fadeUp`      | 0.9s    | Entrada de conteúdo (opt-in via classe)          |
| `float`       | 6s      | Cards flutuantes (humor, streak)                 |
| `floatSlow`   | 10s     | Blobs decorativos                                |
| `breathe`     | 4s      | Glow do mockup do hero, blobs do CTA final       |
| `typing`      | 1.4s    | Dots do chat indicando digitação                 |
| `gradientMove`| 8-18s   | Texto gradient animado                           |

### 8.2 Regras

- **Conteúdo visível por padrão.** Animações são polish, nunca bloqueadores. `.reveal` é opt-in via `.reveal-anim` (não usar para conteúdo crítico).
- **Respeitar `prefers-reduced-motion: reduce`** — todas as animações longas são desligadas.
- **Easing** padrão: `ease-out` (entradas), `ease-in-out` (loops).
- **Hover micro-feedback**: `hover:-translate-y-0.5 transition` em cards interativos. `active:scale-[0.97]` em buttons.

---

## 9. Componentes

### 9.1 Botões

#### Primário (`.btn-primary`)
Gradient brand horizontal, shadow soft, hover sobe 1px.
```jsx
<button className="btn-primary rounded-full px-7 py-4">Começar grátis</button>
```

#### Ghost (`.btn-ghost`)
Glass translúcido, borda 1px brand/18, sem fundo opaco. Usar como secundário ao lado de primário.
```jsx
<button className="btn-ghost rounded-full px-7 py-4">Como funciona</button>
```

#### Tamanhos

| Contexto       | Padding         | Texto         |
|----------------|------------------|---------------|
| Header / chip  | `px-5 py-2.5`    | `text-sm`     |
| CTA padrão     | `px-7 py-4`      | `text-base`   |
| CTA hero/final | `px-8 py-4`      | `text-base/lg`|

### 9.2 Cards

| Variante              | Estrutura                                                |
|-----------------------|-----------------------------------------------------------|
| **Card padrão**       | `glass rounded-2xl p-5` + ícone-chip + título + descrição |
| **Card premium**      | `glass rounded-3xl p-7` + hover lift + shadow-glass       |
| **Card destacado**    | Background gradient brand cinemático + dot-grid overlay   |
| **Card alerta SOS**   | Background rose pastel + ícone red gradient               |
| **Floating accent**   | `glass rounded-2xl p-3 animate-float` (streak, humor)     |

### 9.3 Ícone-chip

Padrão de ícone em quadrado/círculo com gradient, sempre antes de títulos de feature/quick action.

```jsx
<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md">
  <MessageCircle className="w-6 h-6 text-white" />
</div>
```

Tamanhos: `w-9 h-9` (sidebar/lista), `w-10 h-10` (avatar/eyebrow), `w-12 h-12` (feature card), `w-14 h-14` (badge numérico).

### 9.4 Header sticky (landing)

```jsx
<header className={`sticky top-0 z-30 transition-all ${scrolled ? 'glass-strong shadow-sm' : ''}`}>
```

Transparent no top, glass-strong ao scrollar (`scrollY > 12`). Nav links em `text-sm font-medium`.

### 9.5 Hero split

Estrutura padrão da landing:

- Grid 12 colunas (`lg:grid-cols-12 gap-10`)
- Esquerda: `lg:col-span-7` — badge + H1 (com serif italic) + body + CTAs duplos + microcopy + prova social
- Direita: `lg:col-span-5` — mockup de iPhone com chat do Sereno + cards flutuantes

### 9.6 Mockup do dispositivo

Frame de iPhone com:
- Container `glass-strong rounded-[2.5rem] p-3 shadow-brand-glow`
- Inner `bg-white dark:bg-slate-900 rounded-[2rem]`
- Status bar fake (hora + ícones)
- Chat header com avatar gradient + status "online · acolhedor"
- Mensagens user (gradient brand, `rounded-br-md`) e bot (white/dark, `rounded-bl-md`)
- Typing dots (.typing-dot)
- Input fake com botão send

### 9.7 FAQ accordion

```jsx
<div className="glass rounded-2xl overflow-hidden">
  <button onClick={...} className="w-full px-6 py-5 flex items-center justify-between text-left">
    <span>{q}</span>
    <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
  </button>
  <div className={`grid transition-all ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
    <div className="overflow-hidden"><p className="px-6 pb-5">{a}</p></div>
  </div>
</div>
```

Transição via `grid-template-rows` (smoother que `max-height`).

### 9.8 Sidebar (app)

- Glass-strong, `md:w-64 md:h-screen`
- Logo com glow no topo
- Items com indicador de ativo: barra vertical gradient (`absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-brand-400 to-brand-700`)
- CTA Plus no rodapé (gradient brand cinemático, ícone amber)
- Mobile: bottom nav horizontal scrollable

---

## 10. Padrões de página

### 10.1 Landing

Ordem fixa:
1. Header sticky
2. Hero split (com mockup chat ao vivo)
3. Trust bar (4 chips: LGPD, dados no device, offline, sem ads)
4. Como funciona (3 passos numerados)
5. Features grid (6 cards)
6. Vs ChatGPT (comparação visual)
7. Testimonials (3 cards) + métricas (4 stats)
8. Pricing (2 cards: Grátis + Plus destacado)
9. FAQ (6 perguntas)
10. CTA final (hero card brand cinemático)
11. Footer (logo + colunas + emergência destacada)
12. Sticky CTA mobile

### 10.2 Home (logado)

1. Header com greeting + nível-pílula
2. Affirmation card
3. Streak (se ativo)
4. Check-in card (CTA forte se ausente, info se feito)
5. Plano do dia (gentle nudge)
6. Quick actions grid (8 cards + SOS full-width)
7. Mini-trilhas de 3 dias
8. Humor da semana
9. CTA Plus (se não-Pro)

### 10.3 Onboarding

3 steps em modal glass-strong sobre mesh-bg:
1. Boas-vindas + 4 cards de informação (Shield/Bot/Heart/Alert)
2. Nome
3. Consentimentos (idade + LGPD + disclaimer + opt-in IA)

Progress dots no topo. Botão "Voltar" no step 2+.

---

## 11. Acessibilidade

- Contraste mínimo AA (4.5:1) para texto body, AAA (7:1) para text-sm
- `aria-hidden` em todos os elementos decorativos (blobs, dot-grid, ícones puramente estéticos ao lado de texto)
- `prefers-reduced-motion` desativa animações longas
- Foco visível: `focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500`
- Tamanho mínimo de clique: 44x44px (Tailwind `min-w-[44px]` ou `py-3+`)
- Ícones com label: `lucide-react` sempre próximo a texto explicativo

---

## 12. Tom em SOS e crise

Visualmente diferenciado por uma boa razão:

- Background `rose-50 → rose-200/70` (light) ou `red-950/30` (dark)
- Ícone gradient `red-500 → rose-600`
- Texto `text-red-900` (light) — nunca branco em vermelho
- Sempre destaca **CVV 188** e **SAMU 192** em bold
- Card SOS aparece full-width na home (col-span-2 md:col-span-3) — não fica disputando atenção com quick actions normais

---

## 13. Don'ts

- ❌ Verde puro `#00FF00` ou emerald saturado sozinho — sempre dentro do espectro brand teal
- ❌ Mais de 2 emojis por bloco
- ❌ Linguagem clínica ("transtorno", "patologia", "sintomas")
- ❌ Pop-ups intrusivos, dark patterns, cobrança visual
- ❌ Gradient em texto longo (só headlines/palavras-acento)
- ❌ Animações que impedem leitura ou bloqueiam interação
- ❌ Stock photos de pessoas sorrindo — preferimos abstrações, mockups, ícones

---

## 14. Arquivos-chave

| Arquivo                                    | Conteúdo                                      |
|--------------------------------------------|-----------------------------------------------|
| [`index.html`](../index.html)              | Tokens, utilities, keyframes, font loading    |
| [`components/LandingPage.tsx`](../components/LandingPage.tsx) | Implementação completa da landing             |
| [`components/HomeDashboard.tsx`](../components/HomeDashboard.tsx) | Home autenticada                              |
| [`components/Sidebar.tsx`](../components/Sidebar.tsx) | Navegação principal (desktop + mobile)        |
| [`components/OnboardingModal.tsx`](../components/OnboardingModal.tsx) | Modal de 3 steps                              |
| [`public/icon.svg`](../public/icon.svg)    | Brand mark                                    |

---

## 15. Evolução

- **V2.0 (2026-05-15)** — Redesign premium: paleta brand 50-900, glass morphism, mesh-bg, mockup de chat ao vivo no hero, FAQ accordion, CTA cinemático, harmonização landing↔app.
- **V1 (legacy)** — Cards flat slate, gradient simples teal/sky, sem serif italic.

Mudanças futuras devem ser registradas aqui com versão semântica.

---

© 2026 Serenamente · Feito com cuidado no Brasil 💚
