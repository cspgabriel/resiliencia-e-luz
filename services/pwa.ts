// Registro do Service Worker via virtual:pwa-register/react (gerado pelo vite-plugin-pwa)
// Esse módulo é injetado em tempo de build. Em dev fica como noop.

let _registerSW: ((opts?: any) => () => Promise<void>) | null = null;

try {
  // @ts-expect-error virtual module
  const mod = await import('virtual:pwa-register');
  _registerSW = mod.registerSW;
} catch {
  _registerSW = null;
}

export interface PwaCallbacks {
  onNeedRefresh: () => void;
  onOfflineReady: () => void;
}

export const registerPwa = (cb: PwaCallbacks): (() => Promise<void>) | null => {
  if (!_registerSW) return null;
  return _registerSW({
    onNeedRefresh: cb.onNeedRefresh,
    onOfflineReady: cb.onOfflineReady,
    onRegisteredSW: () => {
      // eslint-disable-next-line no-console
      console.info('[pwa] SW registrado');
    },
    onRegisterError: (err: unknown) => {
      // eslint-disable-next-line no-console
      console.warn('[pwa] falha ao registrar SW', err);
    },
  });
};

// ====== INSTALL PROMPT (beforeinstallprompt) ======
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredInstall: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<(available: boolean) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e as BeforeInstallPromptEvent;
    installListeners.forEach(l => l(true));
  });
  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    installListeners.forEach(l => l(false));
  });
}

export const onInstallAvailable = (cb: (available: boolean) => void): (() => void) => {
  installListeners.add(cb);
  cb(!!deferredInstall);
  return () => { installListeners.delete(cb); };
};

export const triggerInstall = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
  if (!deferredInstall) return 'unavailable';
  try {
    await deferredInstall.prompt();
    const { outcome } = await deferredInstall.userChoice;
    deferredInstall = null;
    installListeners.forEach(l => l(false));
    return outcome;
  } catch {
    return 'dismissed';
  }
};

export const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
};

export const isiOS = (): boolean =>
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

// ====== DEEP LINK / SHORTCUTS ======
// Lê ?action= e ?share= da URL para roteamento inicial.
export const consumeStartupAction = (): { action?: string; shareText?: string } => {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const action = url.searchParams.get('action') || undefined;
  const share = url.searchParams.get('share');
  const text = share ? (url.searchParams.get('text') || url.searchParams.get('title') || undefined) : undefined;
  if (action || share) {
    url.searchParams.delete('action');
    url.searchParams.delete('share');
    url.searchParams.delete('text');
    url.searchParams.delete('title');
    url.searchParams.delete('url');
    window.history.replaceState({}, '', url.toString());
  }
  return { action, shareText: text };
};
