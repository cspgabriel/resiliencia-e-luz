
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, PromptTemplate, ModelConfig } from '../types';
import { Send, ArrowLeft, Bot, User, Copy, Check, Sparkles, BrainCircuit, ChevronDown, Wand2, Play, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  template: PromptTemplate | null;
  onBack: () => void;
  onSendMessage: (message: string, config: ModelConfig) => Promise<void>;
  messages: ChatMessage[];
  isLoading: boolean;
  isPro: boolean;
  apiKey: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  template, 
  onBack, 
  onSendMessage, 
  messages,
  isLoading,
  isPro,
  apiKey
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'pt-BR';
        recognitionRef.current.onresult = (event: any) => {
            setInput(prev => prev + (prev ? ' ' : '') + event.results[0][0].transcript);
            setIsListening(false);
        };
        recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (template) {
      const regex = /\[(.*?)\]/g;
      const matches = template.content.match(regex);
      if (matches) {
        const unique = [...new Set<string>(matches)];
        setPlaceholders(unique);
        const vals: Record<string, string> = {};
        unique.forEach(p => vals[p] = '');
        setFormValues(vals);
      } else setPlaceholders([]);
      setInput('');
    } else setPlaceholders([]);
  }, [template]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
  };

  const handleMagicFill = async () => {
    if (!apiKey) return;
    setIsMagicLoading(true);
    try {
      const meta = `Preencha os campos: ${placeholders.join(', ')} para o prompt "${template?.title}". Retorne apenas JSON.`;
      const response = await generateResponse(apiKey, meta, { modelName: 'gemini-3-flash-preview', useThinking: false, thinkingBudget: 0 });
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      setFormValues(prev => ({ ...prev, ...JSON.parse(cleanJson) }));
    } catch (e) { console.error(e); } finally { setIsMagicLoading(false); }
  };

  const handleFormSubmit = () => {
    if (!template) return;
    let final = template.content;
    placeholders.forEach(p => final = final.replace(p, formValues[p] || p));
    onSendMessage(final, { modelName: selectedModel, useThinking, thinkingBudget: useThinking ? 2048 : 0 });
  };

  const handleManualSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    await onSendMessage(msg, { modelName: selectedModel, useThinking, thinkingBudget: useThinking ? 2048 : 0 });
  };

  const showPromptForm = template && messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      <header className="h-14 md:h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 md:px-6 bg-white dark:bg-dark-900 sticky top-0 z-20">
        <div className="flex items-center min-w-0">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="ml-1 min-w-0">
            <h2 className="text-slate-900 dark:text-white font-bold text-sm md:text-base truncate">
              {template ? template.title : 'Chat Livre'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <button 
             onClick={() => { setVoiceEnabled(!voiceEnabled); if(voiceEnabled) window.speechSynthesis.cancel(); }}
             className={`p-2 rounded-lg ${voiceEnabled ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-400'}`}
          >
             {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
             onClick={() => setUseThinking(!useThinking)}
             className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${useThinking ? 'bg-gradient-to-r from-primary-600 to-indigo-600 border-transparent text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
          >
            THINK
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              <Bot className="w-3 h-3" />
              <span className="hidden xs:inline">MODEL</span>
              <ChevronDown className="w-2 h-2" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1 hidden group-hover:block z-30">
              <button onClick={() => setSelectedModel('gemini-3-flash-preview')} className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Flash 3.0</button>
              <button onClick={() => setSelectedModel('gemini-3-pro-preview')} className="w-full text-left px-3 py-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Pro 3.0 ✨</button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6">
        {showPromptForm ? (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
             <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 mb-4 shadow-sm border border-slate-100 dark:border-slate-800">
                   <Sparkles className="w-6 h-6 text-primary-500" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold mb-2">{template.title}</h1>
                <p className="text-xs md:text-sm text-slate-500">{template.description}</p>
             </div>

             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-500" /> Personalizar
                  </h3>
                  {placeholders.length > 0 && (
                    <button onClick={handleMagicFill} disabled={isMagicLoading || !apiKey} className="text-[10px] font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 px-3 py-1.5 rounded-lg disabled:opacity-50 hover:shadow-lg hover:shadow-primary-500/20 transition-all">
                      {isMagicLoading ? '...' : 'MAGIC FILL ✨'}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {placeholders.length > 0 ? placeholders.map((p, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">{p.replace('[','').replace(']','')}</label>
                      <input
                        value={formValues[p]}
                        onChange={(e) => setFormValues({...formValues, [p]: e.target.value})}
                        placeholder={`Digite aqui...`}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/30 outline-none transition-all"
                      />
                    </div>
                  )) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
                      Sem campos variáveis. Clique em executar.
                    </div>
                  )}
                </div>

                <button onClick={handleFormSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-black/10 hover:scale-[1.01]">
                   {isLoading ? 'ENVIANDO...' : 'EXECUTAR PROMPT'} <Play className="w-4 h-4 fill-current" />
                </button>
             </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
            {messages.length === 0 && !template && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <Sparkles className="w-12 h-12 mb-4" />
                <p className="text-sm">Inicie uma conversa profissional...</p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-md'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`relative group max-w-[90%] md:max-w-[80%] rounded-2xl p-4 md:p-5 text-sm md:text-base shadow-sm ${
                  msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-none' : 'bg-white dark:bg-dark-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-800'
                }`}>
                  {msg.role === 'model' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 md:gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {!showPromptForm && (
        <div className="p-3 md:p-4 bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleManualSubmit(); }}}
                placeholder="Diga algo..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none min-h-[48px] max-h-[150px]"
                rows={1}
              />
              <button onClick={() => { if(!recognitionRef.current) return; if(isListening) recognitionRef.current.stop(); else { recognitionRef.current.start(); setIsListening(true); }}} className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={handleManualSubmit} disabled={!input.trim() || isLoading} className="p-3 bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-primary-500/20 disabled:opacity-50 transition-all">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
