import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ArrowLeft, Sun, Moon, Trash2, ShieldCheck, FileText, ExternalLink, Heart } from 'lucide-react';
import { APP_NAME, DISCLAIMER } from '../constants';

interface Props {
  onBack: () => void;
  settings: UserSettings;
  onUpdate: (s: UserSettings) => void;
  onWipeData: () => void;
}

const SettingsModal: React.FC<Props> = ({ onBack, settings, onUpdate, onWipeData }) => {
  const [confirm, setConfirm] = useState(false);

  const toggle = (key: keyof UserSettings, value: any) => onUpdate({ ...settings, [key]: value });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Ajustes</h1>
      </header>

      <div className="max-w-2xl mx-auto px-5 mt-6 space-y-4">
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Conta</h2>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Nome</span>
            <input
              value={settings.name || ''} onChange={e => toggle('name', e.target.value)}
              className="text-sm text-right bg-transparent text-slate-900 dark:text-white outline-none"
              placeholder="Sem nome"
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
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
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacidade
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Seus dados ficam no seu celular. Não vendemos, não compartilhamos, não treinamos IA com sua conversa.
          </p>
          <a href="#" className="flex items-center justify-between py-2 text-sm text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Política de privacidade</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a href="#" className="flex items-center justify-between py-2 text-sm text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Termos de uso</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </section>

        <section className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-5 border border-red-200 dark:border-red-900">
          <h2 className="font-semibold text-red-900 dark:text-red-200 mb-2">Zona de risco</h2>
          <p className="text-xs text-red-700 dark:text-red-300 mb-3">
            Apagar tudo remove check-ins, diário, conversas e preferências. Não tem volta.
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
          <p>© {new Date().getFullYear()} {APP_NAME} · v1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
