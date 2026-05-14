import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { UserSettings, ViewState } from '../types';
import {
  isAdsConfigured, canShowAds, ensureAdsenseLoaded, getAdsenseClient,
  pushAdsbygoogle, usePersonalizedAds, requestNonPersonalizedAds,
} from '../services/ads';
import { trackSafeEvent } from '../services/analytics';

interface Props {
  slotId: string;
  format?: 'banner' | 'native' | 'square';
  settings: UserSettings;
  /** ID do bloco do AdSense (opcional, padrão derivado do slotId). */
  adSlot?: string;
  /** Permite o usuário ocultar permanentemente o slot? */
  dismissible?: boolean;
  /** Hook para abrir o paywall ao clicar em "Remover anúncios". */
  onUpgrade?: () => void;
  onNavigate?: (v: ViewState) => void;
}

const dismissKey = (slotId: string) => `serenamente_ad_dismissed_${slotId}`;

const HouseAd: React.FC<{ onUpgrade?: () => void; onNavigate?: (v: ViewState) => void; compact?: boolean }> = ({ onUpgrade, onNavigate, compact }) => (
  <button
    onClick={() => { onUpgrade ? onUpgrade() : onNavigate?.(ViewState.PAYWALL); }}
    className={`w-full text-left bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white rounded-2xl ${compact ? 'p-3' : 'p-4'} flex items-center gap-3 active:scale-[0.99] transition`}
  >
    <Sparkles className="w-5 h-5 shrink-0" />
    <div className="flex-1">
      <p className="text-xs uppercase tracking-wider opacity-90">Serenamente Plus</p>
      <p className="font-semibold text-sm">Chat ampliado, trilhas completas, sem anúncios</p>
    </div>
    <ArrowRight className="w-4 h-4 shrink-0" />
  </button>
);

const AdSlot: React.FC<Props> = ({
  slotId, format = 'banner', settings, adSlot, dismissible = true, onUpgrade, onNavigate,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try { return Boolean(localStorage.getItem(dismissKey(slotId))); } catch { return false; }
  });
  const [pushed, setPushed] = useState(false);

  const enabled = canShowAds(settings);
  const showHouseAd = enabled && !isAdsConfigured();
  const showAdSense = enabled && isAdsConfigured() && !dismissed;

  useEffect(() => {
    if (!showAdSense) return;
    let live = true;
    (async () => {
      const ok = await ensureAdsenseLoaded();
      if (!ok || !live) return;
      if (!usePersonalizedAds(settings)) requestNonPersonalizedAds();
      // Espera o ins entrar no DOM
      requestAnimationFrame(() => {
        if (!live || pushed) return;
        pushAdsbygoogle({});
        setPushed(true);
        trackSafeEvent('ad_impression', { slot: slotId, format });
      });
    })();
    return () => { live = false; };
  }, [showAdSense, slotId, format]);

  if (!enabled) return null;
  if (dismissed) return null;

  const handleDismiss = () => {
    try { localStorage.setItem(dismissKey(slotId), '1'); } catch {}
    trackSafeEvent('ad_dismissed', { slot: slotId });
    setDismissed(true);
  };

  // Dimensões sugeridas (responsivas; AdSense decide layout final)
  const sizeClass = {
    banner:  'min-h-[90px]',
    native:  'min-h-[140px]',
    square:  'min-h-[250px]',
  }[format];

  return (
    <div ref={ref} className={`relative w-full ${sizeClass} my-3`} aria-label="Anúncio">
      <p className="absolute -top-4 left-2 text-[10px] uppercase tracking-wider text-slate-400 select-none">Anúncio</p>

      {showAdSense ? (
        <ins
          ref={insRef as any}
          className="adsbygoogle block w-full"
          style={{ display: 'block', minHeight: format === 'square' ? 250 : format === 'native' ? 140 : 90 }}
          data-ad-client={getAdsenseClient()}
          data-ad-slot={adSlot || slotId}
          data-ad-format={format === 'native' ? 'fluid' : 'auto'}
          data-full-width-responsive="true"
          {...(format === 'native' ? { 'data-ad-layout-key': '-fb+5w+4e-db+86' } : {})}
        />
      ) : showHouseAd ? (
        <HouseAd onUpgrade={onUpgrade} onNavigate={onNavigate} compact={format === 'banner'} />
      ) : null}

      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Ocultar anúncio"
          className="absolute top-1 right-1 p-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-600"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default AdSlot;
