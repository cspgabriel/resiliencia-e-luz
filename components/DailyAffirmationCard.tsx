import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { getDailyAffirmation, XP_EVENTS } from '../constants';
import { today } from '../services/date';
import { renderCard, shareOrDownload } from '../services/share';
import { recordShare } from '../services/metrics';
import { trackSafeEvent } from '../services/analytics';
import { UserSettings } from '../types';

interface Props {
  settings: UserSettings;
  onXpGain: (xp: number) => void;
}

const DailyAffirmationCard: React.FC<Props> = ({ settings, onXpGain }) => {
  const aff = getDailyAffirmation(today());
  const [busy, setBusy] = useState(false);

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await renderCard({
        title: 'Para hoje',
        body: aff.text,
        emoji: '🌿',
        palette: [aff.palette[0], aff.palette[1]],
        footer: today(),
      });
      const r = await shareOrDownload(blob, `serenamente-${today()}.png`, aff.text);
      recordShare('affirmation_daily', settings);
      trackSafeEvent('affirmation_shared', { result: r });
      onXpGain(XP_EVENTS.card_shared);
    } finally { setBusy(false); }
  };

  return (
    <div
      className="rounded-3xl p-5 shadow-sm border border-white/40"
      style={{ background: `linear-gradient(135deg, ${aff.palette[0]}, ${aff.palette[1]})` }}
    >
      <p className="text-xs text-slate-700/80 uppercase tracking-wider">Para hoje</p>
      <p className="mt-2 text-slate-900 font-serif text-lg leading-snug">"{aff.text}"</p>
      <button onClick={handleShare} disabled={busy} className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/70 hover:bg-white text-slate-800 text-xs font-semibold rounded-full">
        <Share2 className="w-3 h-3" /> {busy ? 'preparando…' : 'compartilhar'}
      </button>
    </div>
  );
};

export default DailyAffirmationCard;
