
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ModelConfig } from '../types';
import { Send, ArrowLeft, Bot, User, Sparkles, Wand2, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateResponse } from '../services/geminiService';

interface HelperBotProps {
  onBack: () => void;
  apiKey: string;
}

const SYSTEM_INSTRUCTION = `Você é o Assistente Mágico, o guia oficial da plataforma "IA Mágica".
Sua missão é ajudar os usuários a extrair o máximo de produtividade da IA através de prompts.

Informações sobre a plataforma que você deve conhecer:
1. Início/Home: Visão geral de uso e atalhos rápidos.
2. Biblioteca Mágica: Onde ficam centenas de prompts profissionais separados por profissões (Médicos, Desenvolvedores, Marketing, etc).
3. Meus Prompts: Área onde o usuário salva seus próprios prompts customizados.
4. Criação de Prompts: Os usuários podem criar prompts usando a sintaxe de [COLCHETES]. Por exemplo: "Crie um post para [CLIENTE] sobre [ASSUNTO]". O app transformará isso em campos de texto.
5. Chat Livre: Para conversas sem prompts prontos.

Seu tom de voz: Encantador, prestativo, profissional e levemente entusiasmado. Use emojis mágicos ✨🪄.
Sempre que alguém perguntar como fazer algo, explique o passo a passo dentro do app.`;

const HelperBot: React.FC<HelperBotProps> = ({ onBack, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: 'Olá! ✨ Eu sou o seu **Assistente Mágico**. Estou aqui para ajudar você a dominar esta plataforma e transformar seu trabalho com inteligência artificial. Como posso te ajudar hoje? 🪄',
        timestamp: Date.now()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const config: ModelConfig = {
        modelName: 'gemini-3-flash-preview',
        useThinking: false,
        thinkingBudget: 0,
        systemInstruction: SYSTEM_INSTRUCTION
      };

      const responseText = await generateResponse(apiKey, input, config);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Oh não! Tivemos um pequeno problema mágico: ${error.message}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-dark-950">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-dark-900 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white font-bold text-base">Assistente Mágico</h2>
            <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            <Info className="w-3.5 h-3.5" /> Guia de Uso
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-800 text-slate-600' : 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-4 md:p-5 text-sm md:text-base shadow-sm ${
                msg.role === 'user' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-none border border-slate-100 dark:border-slate-700' : 'bg-white dark:bg-dark-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-800'
              }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white"><Bot className="w-4 h-4" /></div>
              <div className="flex gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
            placeholder="Pergunte como usar o app, como criar prompts..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none min-h-[56px] max-h-[150px] shadow-inner"
            rows={1}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading} 
            className="p-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-500 disabled:opacity-50 transition-all shadow-xl shadow-primary-500/30 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelperBot;
