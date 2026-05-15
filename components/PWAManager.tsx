import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, Share, X, WifiOff, Plus } from 'lucide-react';
import { registerPwa, onInstallAvailable, triggerInstall, isStandalone, isiOS } from '../services/pwa';
import { trackSafeEvent } from '../services/analytics';

const DISMISS_KEY = 'resilienciaeluz_pwa_dismissed_at';
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const wasRecentlyDismissed = (): boolean => {
  try { const v = localStorage.getItem(DISMISS_KEY); if (!v) return false; return Date.now() - Number(v) < DISMISS_TTL_MS; } catch { return false; }
};

const PWAManager: React.FC = () => {
  const [updateReady, setUpdateReady] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [refreshFn, setRefreshFn] = useState<(() => Promise<void>) | null>(null);
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => { const fn = registerPwa({ onNeedRefresh: () => setUpdateReady(true), onOfflineReady: () => { setOfflineReady(true); setTimeout(() => setOfflineReady(false), 4000); } }); if (fn) setRefreshFn(() => fn); }, []);
  useEffect(() => { const unsub = onInstallAvailable((avail) => { setInstallAvailable(avail); if (avail && !isStandalone() && !wasRecentlyDismissed()) setTimeout(() => setShowInstall(true), 30000); }); return () => unsub(); }, []);
  useEffect(() => { if (!isiOS() || isStandalone() || wasRecentlyDismissed()) return; const t = setTimeout(() => setShowIOSHint(true), 45000); return () => clearTimeout(t); }, []);
  useEffect(() => { const up = () => setOnline(true); const down = () => setOnline(false); window.addEventListener('online', up); window.addEventListener('offline', down); return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); }; }, []);

  const handleInstall = async () => { trackSafeEvent('pwa_install_clicked'); const result = await triggerInstall(); trackSafeEvent('pwa_install_result', { result }); setShowInstall(false); if (result === 'dismissed') { try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {} } };
  const handleDismiss = () => { try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {} setShowInstall(false); setShowIOSHint(false); trackSafeEvent('pwa_install_dismissed'); };
  const handleRefresh = async () => { trackSafeEvent('pwa_update_applied'); if (refreshFn) await refreshFn(); else window.location.reload(); };

  return (
    <>
      {!online && <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg"><WifiOff className="w-3 h-3" /> Modo offline</div>}
      {offlineReady && <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-brand-600 text-white px-4 py-2.5 rounded-2xl shadow-lg text-sm flex items-center gap-2">✓ Pronto para usar offline</div>}
      {updateReady && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60] bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-slate-700">
          <RefreshCw className="w-5 h-5 text-brand-400 shrink-0" />
          <div className="flex-1"><p className="font-semibold text-sm">Nova versão disponível</p><p className="text-xs opacity-80">Atualize para receber as melhorias.</p></div>
          <button onClick={handleRefresh} className="px-3 py-2 bg-brand-600 rounded-xl text-xs font-semibold">Atualizar</button>
          <button onClick={() => setUpdateReady(false)} className="text-slate-400 -mr-1"><X className="w-4 h-4" /></button>
        </div>
      )}
      {showInstall && installAvailable && !isStandalone() && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[55] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center shrink-0"><Download className="w-5 h-5 text-brand-600 dark:text-brand-400" /></div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">Adicionar à tela inicial</p>
              <p className="text-xs text-slate-500 mt-0.5">Acesse mais rápido, mesmo offline.</p>
              <div className="flex gap-2 mt-3">
                <button onClick={handleInstall} className="flex-1 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">Instalar</button>
                <button onClick={handleDismiss} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs">Agora não</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showIOSHint && (
        <div className="fixed bottom-20 left-4 right-4 z-[55] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0"><Plus className="w-5 h-5 text-sky-600 dark:text-sky-400" /></div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">Adicionar ao iPhone</p>
              <p className="text-xs text-slate-500 mt-0.5">Toque em <Share className="w-3 h-3 inline -mt-0.5" /> Compartilhar → <b>"Adicionar à Tela de Início"</b>.</p>
              <button onClick={handleDismiss} className="mt-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs">Entendi</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAManager;
