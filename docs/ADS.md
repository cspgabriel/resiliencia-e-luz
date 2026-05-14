# Anúncios — Serenamente

App suporta **Google AdSense** com fallback para "house ads" (promove o Plus). Mesma codebase serve a versão web e a PWA — anúncios aparecem nos dois.

## Onde aparece

| Tela | Slot ID | Formato | Razão |
|---|---|---|---|
| Home | `home_mid` | banner | Antes das mini-trilhas |
| Diário | `diary_inline_N` | native | A cada 6 entradas (rolagem longa) |
| Insights | `insights_bottom` | banner | Depois dos cartões |
| Trilhas | `trails_bottom` | banner | Depois da lista |
| Conquistas | `achievements` | banner | Antes da trilha de níveis |
| Cartas | `letters_list` | banner | Final da lista |

## Onde **nunca** aparece

- SOS (crise)
- Chat com Sereno (íntimo)
- Detalhe do exercício (foco)
- Calma coletiva (prática ao vivo)
- Onboarding / Landing
- Auth modal
- Páginas legais
- Leitura de carta
- Companion / Meu nível
- Settings

## Regras de exibição

1. **Plus → zero anúncios.** Sempre. Sem exceção.
2. **Free + `adsEnabled = true`** (default) → mostra ads.
3. **`adsPersonalized = false`** (default LGPD) → request non-personalized.
4. **Sem `VITE_ADSENSE_CLIENT`** configurado → house ad (banner Plus).
5. **Usuário pode ocultar** cada slot com o ✕ — persiste em localStorage.

## Configuração

### 1. Aprovar conta AdSense
1. Cadastre `serenamente.app` em [Google AdSense](https://www.google.com/adsense)
2. Aguarde aprovação (1-14 dias)
3. Crie unidades de anúncio para cada slot ID acima

### 2. Variáveis de ambiente

Em `.env.local`:
```
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

### 3. Mapear slots reais (opcional)

Por padrão `data-ad-slot` usa o nome do slot. Se quiser IDs específicos do AdSense, passe `adSlot` no `<AdSlot/>`:

```tsx
<AdSlot slotId="home_mid" adSlot="1234567890" format="banner" settings={settings} />
```

### 4. Política do AdSense

- **Política de privacidade** obrigatória (já existe em `/privacy`)
- **Disclosure de cookies** — adicionar banner LGPD/GDPR (não incluído ainda)
- **Não clicar nos próprios anúncios** — viola política
- **Sem ads em conteúdo sensível** — já garantido pela arquitetura (lista de exclusão)

## Métricas

Eventos registrados via `trackSafeEvent`:
- `ad_impression` — quando o slot é montado
- `ad_dismissed` — quando o usuário oculta com ✕

Cruze com `metrics/events` no Firestore para descobrir:
- CTR por slot
- Taxa de dismiss por slot (sinaliza intrusivo)
- Slots com baixa impressão (renderização problemática)

## Performance

- AdSense é carregado **sob demanda** (não bloqueia o boot)
- Script global com `async`
- Cada slot empilha pelo `adsbygoogle` queue separadamente
- Service worker **não cacheia** chamadas ao AdSense

## Alternativa: remover slots

Se preferir não monetizar via AdSense:

1. Não defina `VITE_ADSENSE_CLIENT` → automaticamente cai em house ads (CTA Plus)
2. Para remover completamente, edite cada componente e remova os `<AdSlot/>`

## LGPD / Brasil

A política recomendada:

- **Default**: anúncios **não-personalizados** (legítimo interesse, sem consentimento)
- **Opt-in**: anúncios personalizados (precisa toggle ativo em Ajustes)
- **Sempre**: respeitar opt-out (`adsEnabled = false`)

Esse é o comportamento implementado. Em casos de auditoria, mostre essa doc + a UI dos toggles.
