
import React, { useState } from 'react';
import { ImageIcon, VideoIcon, Loader2, Download, AlertTriangle, Sparkles } from 'lucide-react';
import { generateImage, generateVideo } from '../services/geminiService';

interface MediaGeneratorProps {
  type: 'image' | 'video';
  apiKey: string;
  isPro: boolean;
}

const MediaGenerator: React.FC<MediaGeneratorProps> = ({ type, apiKey, isPro }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!isPro && !apiKey) {
       setError("Requer chave de API válida.");
       return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (type === 'image') {
        const url = await generateImage(apiKey, prompt);
        setResult(url);
      } else {
        const res = await generateVideo(apiKey, prompt);
        if (res.uri) setResult(`${res.uri}&key=${apiKey}`); 
        else throw new Error("Erro ao obter vídeo.");
      }
    } catch (err: any) {
      setError(err.message || "Erro na geração.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-full flex flex-col pb-20 lg:pb-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          {type === 'image' ? <ImageIcon className="w-6 h-6 text-pink-500" /> : <VideoIcon className="w-6 h-6 text-purple-500" />}
          Estúdio {type === 'image' ? 'Imagem' : 'Vídeo'}
        </h2>
        <p className="text-sm text-slate-500">Criação profissional alimentada pelo Google Imagen/Veo.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 overflow-hidden lg:overflow-visible">
        
        <div className="flex flex-col gap-4">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Descreva sua ideia</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={type === 'image' ? "Crie algo incrível..." : "Descreva o movimento..."}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white resize-none h-32 md:h-48 outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              
              <div className="mt-4 flex flex-col xs:flex-row items-center justify-between gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                    AI: {type === 'image' ? 'IMAGEN 3' : 'VEO 3.1'}
                </span>
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className={`w-full xs:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all ${
                        isLoading ? 'bg-slate-300 dark:bg-slate-800' : 
                        type === 'image' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> GERAR</>}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-slate-100 dark:bg-dark-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-0">
            {isLoading ? (
                <div className="text-center p-6">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full border-4 border-t-transparent animate-spin ${type === 'image' ? 'border-pink-500' : 'border-purple-500'}`}></div>
                    <p className="text-sm font-bold text-slate-500 animate-pulse">PROCESSANDO...</p>
                </div>
            ) : result ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                    {type === 'image' ? (
                        <img src={result} alt="IA Result" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <video controls autoPlay loop className="max-w-full max-h-full">
                            <source src={result} type="video/mp4" />
                        </video>
                    )}
                    <a href={result} download className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md text-white p-2 rounded-lg hover:bg-white hover:text-black transition-all">
                        <Download className="w-5 h-5" />
                    </a>
                </div>
            ) : error ? (
                <div className="text-center p-6">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <p className="text-sm font-medium text-red-500">{error}</p>
                </div>
            ) : (
                <div className="text-center text-slate-400">
                    <p className="text-xs font-bold uppercase tracking-widest">Preview</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default MediaGenerator;
