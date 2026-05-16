import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { getDailyResiliencePill, XP_EVENTS } from '../constants';
import { today } from '../services/date';
import { renderCard, shareOrDownload } from '../services/share';
import { recordShare } from '../services/metrics';
import { UserSettings } from '../types';

interface Props { settings: UserSettings; onXpGain: (xp: number) => void; }

const DailyAffirmationCard: React.FC<Props> = ({ settings, onXpGain }) => {
  const pill = getDailyResiliencePill(today());
  const [busy, setBusy] = useState(false);
  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await renderCard({ title: pill.title, body: pill.shareText, palette: pill.palette, footer: 'resiliencia-e-luz.vercel.app', badge: 'Pílula diária' });
      await shareOrDownload(blob, `pilula-resiliencia-${today()}.png`, pill.shareText);
      recordShare('resilience_pill_daily', settings);
      onXpGain(XP_EVENTS.card_shared);
    } finally { setBusy(false); }
  };
  return (
    <div className="rounded-3xl p-5 shadow-sm border border-white/40" style={{ background: `linear-gradient(135deg, ${pill.palette[0]}, ${pill.palette[1]})` }}>
      <p className="text-xs text-slate-700/80 uppercase tracking-wider">Pílula de resiliência · dia {pill.day}</p>
      <p className="mt-2 text-slate-900 font-serif text-xl leading-snug">"{pill.text}"</p>
      <p className="mt-3 text-xs text-slate-700/80">{pill.practice}</p>
      <button onClick={handleShare} disabled={busy} className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/70 hover:bg-white text-slate-800 text-xs font-semibold rounded-full">
        <Share2 className="w-3 h-3" /> {busy ? 'preparando…' : 'compartilhar'}
      </button>
    </div>
  );
};

export default DailyAffirmationCard;
