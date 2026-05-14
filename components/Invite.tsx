import React, { useEffect, useState } from 'react';
import { ArrowLeft, Copy, Share2, CheckCircle2 } from 'lucide-react';
import { UserSettings } from '../types';
import { ensureInviteCode, buildInviteUrl, redeemInviteCode } from '../services/referral';
import { REFERRAL_WHATSAPP_TEXT, REFERRAL_REWARD_DAYS } from '../constants';
import { trackSafeEvent } from '../services/analytics';
import { recordShare } from '../services/metrics';

interface Props {
  onBack: () => void;
  settings: UserSettings;
  onUpdate: (s: UserSettings) => void;
}

const Invite: React.FC<Props> = ({ onBack, settings, onUpdate }) => {
  const [code, setCode] = useState<string>(settings.inviteCodeOwned || '');
  const [redeemInput, setRedeemInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await ensureInviteCode(settings);
      setCode(r.code);
      if (r.settings !== settings) onUpdate(r.settings);
    })();
  }, []);

  const url = code ? buildInviteUrl(code) : '';
  const waText = code ? REFERRAL_WHATSAPP_TEXT(code, url) : '';

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const shareWhatsApp = () => {
    trackSafeEvent('referral_shared', { channel: 'whatsapp' });
    recordShare('whatsapp_invite', settings);
    const wa = `https://wa.me/?text=${encodeURIComponent(waText)}`;
    window.open(wa, '_blank');
  };

  const shareGeneric = async () => {
    trackSafeEvent('referral_shared', { channel: 'share_api' });
    recordShare('generic_invite', settings);
    const nav: any = navigator;
    if (nav.share) {
      try { await nav.share({ text: waText }); } catch {}
    } else {
      copy(waText);
    }
  };

  const redeem = async () => {
    setFeedback(null);
    const r = await redeemInviteCode(redeemInput, settings);
    if (r.ok) {
      onUpdate(r.settings);
      setFeedback('Plus ativado! Aproveite ✨');
      setRedeemInput('');
      trackSafeEvent('referral_redeemed_ok');
    } else {
      setFeedback(r.reason || 'Não foi possível usar esse código');
      trackSafeEvent('referral_redeemed_fail', { reason: r.reason || 'unknown' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Convidar e ganhar Plus</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-5">
        <section className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-3xl p-6">
          <p className="text-sm opacity-90">Seu código de convite</p>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-4xl font-black tracking-widest">{code || '—'}</p>
            {code && (
              <button onClick={() => copy(code)} className="p-2 bg-white/20 rounded-xl">
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
          <p className="text-sm opacity-90 mt-4">
            Quando alguém usar seu código, <b>vocês dois</b> ganham {REFERRAL_REWARD_DAYS} dias do Plus.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
          <button onClick={shareWhatsApp} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Convidar pelo WhatsApp
          </button>
          <button onClick={shareGeneric} className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Outras opções
          </button>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Tem um código?</h2>
          <div className="flex gap-2">
            <input
              value={redeemInput}
              onChange={e => setRedeemInput(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="DIGITE AQUI"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm text-slate-900 dark:text-white tracking-widest font-mono"
              disabled={!!settings.inviteCodeUsed}
            />
            <button
              onClick={redeem}
              disabled={!redeemInput.trim() || !!settings.inviteCodeUsed}
              className="px-5 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40"
            >
              Usar
            </button>
          </div>
          {settings.inviteCodeUsed && (
            <p className="text-xs text-emerald-600 mt-2">Você já usou o código {settings.inviteCodeUsed} ✓</p>
          )}
          {feedback && <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{feedback}</p>}
        </section>
      </div>
    </div>
  );
};

export default Invite;
