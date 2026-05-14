// Wrapper de anúncios (Google AdSense). Filosofia:
//  - Plus = zero anúncios (motivo de upgrade)
//  - Não-Plus + adsEnabled=true → mostra ad (não-personalizado por padrão)
//  - adsPersonalized=true → libera segmentação (opt-in LGPD)
//  - Sem VITE_ADSENSE_CLIENT configurado → mostra "house ad" (promove Plus)
//
// O componente <AdSlot/> consome essas funções.

import { UserSettings } from '../types';

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

let scriptLoaded = false;

export const isAdsConfigured = (): boolean =>
  Boolean(ADSENSE_CLIENT && ADSENSE_CLIENT.startsWith('ca-pub-'));

export const getAdsenseClient = (): string | undefined => ADSENSE_CLIENT;

export const canShowAds = (settings: UserSettings): boolean => {
  if (settings.isPro) return false;
  if (settings.adsEnabled === false) return false;
  return true;
};

export const usePersonalizedAds = (settings: UserSettings): boolean =>
  Boolean(settings.adsPersonalized);

// Carrega o script do AdSense sob demanda (uma única vez)
export const ensureAdsenseLoaded = (): Promise<boolean> => new Promise((resolve) => {
  if (!isAdsConfigured()) return resolve(false);
  if (scriptLoaded) return resolve(true);
  if (typeof document === 'undefined') return resolve(false);

  const existing = document.querySelector('script[data-ads-loaded="1"]');
  if (existing) { scriptLoaded = true; return resolve(true); }

  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  s.setAttribute('data-ads-loaded', '1');
  s.onload = () => { scriptLoaded = true; resolve(true); };
  s.onerror = () => resolve(false);
  document.head.appendChild(s);
});

// Push para o adsbygoogle queue (após o ins ser montado no DOM)
export const pushAdsbygoogle = (config: Record<string, unknown> = {}): void => {
  try {
    const w = window as any;
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.push(config);
  } catch {/* falha silenciosa */}
};

// Aplica preferência de não-personalização (NPA)
export const requestNonPersonalizedAds = (): void => {
  try {
    const w = window as any;
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.requestNonPersonalizedAds = 1;
  } catch {}
};
