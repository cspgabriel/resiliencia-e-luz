
import React, { useState } from 'react';
import { PromptTemplate, Profession } from '../types';
import { Save, X, Globe, Lock, Sparkles, Layout, Type, FileText, Info, Eye } from 'lucide-react';
import { ICON_MAP } from '../constants';

interface CreatePromptProps {
  onSave: (prompt: PromptTemplate) => void;
  onCancel: () => void;
}

const CreatePrompt: React.FC<CreatePromptProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Geral',
    profession: Profession.MARKETING,
    isPublic: false,
    iconName: 'Rocket'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrompt: PromptTemplate = {
      id: `custom-${Date.now()}`,
      title: formData.title || 'Novo Prompt Mágico',
      description: formData.description || 'Sem descrição.',
      content: formData.content,
      category: formData.category,
      profession: formData.profession,
      isPremium: false,
      iconName: formData.iconName,
      isCustom: true,
      isPublic: formData.isPublic
    };
    onSave(newPrompt);
  };

  const PreviewIcon = ICON_MAP[formData.iconName] || ICON_MAP['Rocket'];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-dark-950 p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Profissional */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Forjar Sua Vantagem Secreta</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Transforme aquela tarefa repetitiva e chata em um botão mágico de 1 clique.</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm"
          >
            <X className="w-5 h-5" /> Cancelar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Seção 1: Identidade */}
              <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <Type className="w-5 h-5" />
                  <h3 className="font-bold uppercase text-xs tracking-widest">Identidade do Prompt</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Título da Ferramenta</label>
                    <input
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Gerador de Posts Instagram"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Área de Atuação</label>
                    <select
                      value={formData.profession}
                      onChange={e => setFormData({...formData, profession: e.target.value as Profession})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none"
                    >
                      {Object.values(Profession).filter(p => p !== Profession.ALL && p !== Profession.CUSTOM).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Para que serve? (Curto)</label>
                  <input
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Ex: Cria legendas virais em 5 segundos."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Seção 2: Estrutura do Prompt */}
              <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-primary-600">
                    <FileText className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-xs tracking-widest">Conteúdo Mágico</h3>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 border border-amber-200 dark:border-amber-800">
                    <Info className="w-3 h-3" /> Sintaxe Ativa
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea
                    required
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Digite o prompt aqui. Use [COLCHETES] para criar campos dinâmicos. Ex: Crie uma estratégia de vendas para o cliente [NOME DO CLIENTE] focado no produto [PRODUTO]."
                    rows={10}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 outline-none font-mono text-sm leading-relaxed"
                  />
                  
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 flex items-start gap-3">
                    <div className="p-2 bg-primary-600 rounded-lg text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary-900 dark:text-primary-100 mb-1">Como criar automação:</p>
                      <p className="text-[11px] text-primary-700 dark:text-primary-300 leading-normal">
                        Ao usar palavras entre <strong>[COLCHETES]</strong>, como [NOME] ou [TEMA], o sistema cria um formulário automático. Assim, você só preenche os dados variáveis e a IA faz o resto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Mobile (Fixos) */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 lg:hidden">
                 <button type="submit" className="w-full px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" /> Salvar Prompt
                 </button>
              </div>
            </form>
          </div>

          {/* Sidebar de Preview & Visibilidade */}
          <div className="space-y-6">
            
            {/* Preview Card */}
            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 text-primary-600 mb-6">
                <Eye className="w-5 h-5" />
                <h3 className="font-bold uppercase text-xs tracking-widest">Visualização</h3>
              </div>
              
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-dark-950 shadow-inner mb-6 pointer-events-none">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl">
                    <PreviewIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    PREVIEW
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate">
                  {formData.title || 'Título do Prompt'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-8 overflow-hidden">
                  {formData.description || 'Sua descrição aparecerá aqui...'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {formData.profession}
                  </span>
                  <div className="w-4 h-4 rounded-full bg-primary-600/20" />
                </div>
              </div>

              {/* Visibilidade */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    {formData.isPublic ? <Globe className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-amber-500" />}
                    <div>
                      <p className="text-sm font-bold">{formData.isPublic ? 'Público' : 'Privado'}</p>
                      <p className="text-[10px] text-slate-500">Visível para outros</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${formData.isPublic ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <button 
                  onClick={handleSubmit}
                  className="w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Salvar Mágica
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePrompt;
