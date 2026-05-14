import React, { useEffect, useState } from 'react';
import { UserSettings, ViewState } from '../types';
import { ArrowLeft, Sun, Moon, Trash2, ShieldCheck, FileText, ExternalLink, Heart, Bell, Lock, Bot, Phone, Cloud, LogIn, LogOut, UserCircle2 } from 'lucide-react';
import { APP_NAME, DISCLAIMER } from '../constants';
import { isFirebaseConfigured, getFirebaseAuth } from '../services/firebase';
import { signOut, watchUser } from '../services/firebaseAuth';

interface Props {
  onBack: () => void;
  settings: UserSettings;
  onUpdate: (s: UserSettings) => void;
  onWipeData: () => void;
  onNavigate: (v: ViewState) => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

const SettingsModal: React.FC<Props> = ({ onBack, settings, onUpdate, onWipeData, onNavigate, onOpenAuth }) => {
  const [confirm, setConfirm] = useState(false);
  const [authState, setAuthState] = useState<{ email?: string; anonymous: boolean; signedIn: boolean }>({ anonymous: true, signedIn: false });

  useEffect(() => {
    const unsub = watchUser(u => {
      setAuthState({
        email: u?.email || undefined,
        anonymous: !!u?.isAnonymous,
        signedIn: !!u,
      });
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => { await signOut(); };

  const toggle = (key: keyof UserSettings, value: any) => onUpdate({ ...settings, [key]: value });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Ajustes</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-4">
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <UserCircle2 className="w-4 h-4 text-emerald-500" /> Conta
          </h2>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Nome</span>
            <input
              value={settings.name || ''} onChange={e => toggle('name', e.target.value)}
              className="text-sm text-right bg-transparent text-slate-900 dark:text-white outline-none"
              placeholder="Sem nome"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-sm text-slate-600 dark:text-slate-300">Login</span>
            <span className="text-sm text-slate-500">
              {!isFirebaseConfigured() ? 'desativado' : authState.email ? authState.email : authState.anonymous ? 'anônimo' : 'sem sessão'}
            </span>
          </div>

          {isFirebaseConfigured() && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {!authState.email ? (
                <>
                  <button onClick={() => onOpenAuth?.('signup')} className="py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                    <LogIn className="w-4 h-4" /> Criar conta
                  </button>
                  <button onClick={() => onOpenAuth?.('signin')} className="py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                    <LogIn className="w-4 h-4" /> Entrar
                  </button>
                </>
              ) : (
                <button onClick={handleSignOut} className="col-span-2 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                  <LogOut className="w-4 h-4" /> Sair desta conta
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700 mt-3">
            <span className="text-sm text-slate-600 dark:text-slate-300">Plano</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{settings.isPro ? 'Plus ✨' : 'Grátis'}</span>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Aparência</h2>
          <div className="flex gap-2">
            <button onClick={() => toggle('theme', 'light')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm ${settings.theme === 'light' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-2 border-transparent'}`}>
              <Sun className="w-4 h-4" /> Claro
            </button>
            <button onClick={() => toggle('theme', 'dark')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm ${settings.theme === 'dark' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-2 border-transparent'}`}>
              <Moon className="w-4 h-4" /> Escuro
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-500" /> Rotina diária
          </h2>
          <label className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Lembrete gentil</span>
            <input
              type="time"
              value={settings.reminderTime || ''}
              onChange={e => toggle('reminderTime', e.target.value || undefined)}
              className="text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2"
            />
          </label>
          <p className="text-xs text-slate-500 mt-2">Use mensagens neutras, sem revelar conteúdo sensível nas notificações.</p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacidade e segurança
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Check-ins, diário e histórico ficam no seu dispositivo por padrão. A conversa com IA só envia texto quando você ativar essa opção.
          </p>

          <label className="flex items-start gap-3 cursor-pointer py-3 border-t border-slate-100 dark:border-slate-700">
            <input type="checkbox" checked={settings.allowAiProcessing} onChange={e => toggle('allowAiProcessing', e.target.checked)} className="mt-1 w-4 h-4 accent-sky-500" />
            <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">
              <span className="flex items-center gap-2 font-semibold"><Bot className="w-4 h-4" /> Conversa com IA</span>
              Permitir que mensagens enviadas no chat sejam processadas por provedor externo para gerar resposta.
            </span>
          </label>

          {isFirebaseConfigured() && (
            <label className="flex items-start gap-3 cursor-pointer py-3 border-t border-slate-100 dark:border-slate-700">
              <input type="checkbox" checked={!!settings.cloudSyncEnabled} onChange={e => toggle('cloudSyncEnabled', e.target.checked)} className="mt-1 w-4 h-4 accent-sky-500" />
              <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">
                <span className="flex items-center gap-2 font-semibold"><Cloud className="w-4 h-4" /> Sincronizar com a nuvem</span>
                Faz backup criptografado dos seus check-ins, diário e progresso na sua conta. Útil para usar em outros aparelhos. Pode ser desativado a qualquer momento.
              </span>
            </label>
          )}

          <label className="flex items-start gap-3 cursor-pointer py-3 border-t border-slate-100 dark:border-slate-700">
            <input type="checkbox" checked={settings.appLockEnabled} onChange={e => toggle('appLockEnabled', e.target.checked)} className="mt-1 w-4 h-4 accent-emerald-500" />
            <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">
              <span className="flex items-center gap-2 font-semibold"><Lock className="w-4 h-4" /> Bloqueio por senha/biometria</span>
              Estrutura pronta para app nativo. No PWA, implementar PIN local como próximo passo.
            </span>
          </label>

          <button onClick={() => onNavigate(ViewState.PRIVACY)} className="w-full flex items-center justify-between py-3 text-sm text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-700">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Política de privacidade</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button onClick={() => onNavigate(ViewState.TERMS)} className="w-full flex items-center justify-between py-3 text-sm text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-700">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Termos de uso</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-500" /> Contato de confiança
          </h2>
          <div className="space-y-3">
            <input
              value={settings.emergencyContact || ''}
              onChange={e => toggle('emergencyContact', e.target.value)}
              placeholder="Nome da pessoa"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
            />
            <input
              value={settings.emergencyPhone || ''}
              onChange={e => toggle('emergencyPhone', e.target.value)}
              placeholder="Telefone com DDD"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">Esse contato aparece no SOS. O app não envia mensagens automaticamente.</p>
        </section>

        <section className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-5 border border-red-200 dark:border-red-900">
          <h2 className="font-semibold text-red-900 dark:text-red-200 mb-2">Zona de risco</h2>
          <p className="text-xs text-red-700 dark:text-red-300 mb-3">
            Apagar tudo remove check-ins, diário, conversas, trilhas e preferências. Não tem volta.
          </p>
          {!confirm ? (
            <button onClick={() => setConfirm(true)} className="w-full py-3 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Apagar todos os meus dados
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setConfirm(false)} className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-300 text-slate-600 rounded-xl text-sm">Cancelar</button>
              <button onClick={onWipeData} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold">Confirmar apagar</button>
            </div>
          )}
        </section>

        <footer className="text-center py-6 text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
          <p className="px-6">{DISCLAIMER}</p>
          <p>© {new Date().getFullYear()} {APP_NAME} · v2.0</p>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
