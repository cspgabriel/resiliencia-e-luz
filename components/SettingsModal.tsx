
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { X, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [activeTab, setActiveTab] = useState<'plans'>('plans');
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white">Configurações & Planos</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'plans' ? 'text-primary-500 border-b-2 border-primary-500 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
          >
            Planos & Limites
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'plans' && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Free Plan */}
              <div className={`p-5 rounded-xl border relative ${!localSettings.isPro ? 'bg-slate-800 border-primary-500 ring-1 ring-primary-500' : 'bg-slate-800/50 border-slate-700 opacity-60'}`}>
                {!localSettings.isPro && (
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    Atual
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-6 h-6 text-slate-300" />
                  <h4 className="text-lg font-bold text-white">Plano Gratuito</h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-400 mb-6">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 10 Tokens Diários</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Acesso a Prompts Básicos</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Modelo Gemini Flash</li>
                  <li className="flex gap-2"><X className="w-4 h-4 text-red-500" /> Sem Thinking Mode</li>
                  <li className="flex gap-2"><X className="w-4 h-4 text-red-500" /> Sem Geração de Imagem/Vídeo</li>
                </ul>
                <div className="mt-auto pt-4 border-t border-slate-700">
                  <p className="text-2xl font-bold text-white">R$ 0 <span className="text-sm font-normal text-slate-500">/mês</span></p>
                </div>
              </div>

              {/* Pro Plan */}
              <div className={`p-5 rounded-xl border relative ${localSettings.isPro ? 'bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-800 border-slate-700'}`}>
                {localSettings.isPro && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    Ativo
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-6 h-6 text-amber-400" />
                  <h4 className="text-lg font-bold text-white">Plano PRO</h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Tokens Ilimitados</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Todos os Prompts + Customizados</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Thinking Mode (Gemini 3)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Geração de Imagem (Gemini 2.5)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Geração de Vídeo (Veo)</li>
                </ul>
                <div className="mt-auto pt-4 border-t border-slate-700">
                  <p className="text-2xl font-bold text-white">R$ 29 <span className="text-sm font-normal text-slate-500">/mês</span></p>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
