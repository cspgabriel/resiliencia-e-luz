import { GoogleGenAI } from "@google/genai";
import { ChatMessage, ModelConfig } from "../types";
import { CHAT_SYSTEM_PROMPT, CRISIS_RESPONSE, PRECACHED_RESPONSES } from "../constants";
import { checkCrisis, isOffTopic, OFF_TOPIC_RESPONSE } from "./safety";

const getApiKey = () => (typeof process !== 'undefined' && process.env?.API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

const MODEL_NAME = 'gemini-2.5-flash-lite';

const normalize = (s: string) => s.toLowerCase().trim().replace(/[.!?,]/g, '');

const tryPrecache = (text: string): string | null => {
  const n = normalize(text);
  if (n.length > 30) return null;
  for (const [k, v] of Object.entries(PRECACHED_RESPONSES)) {
    if (n === k || n.startsWith(k)) return v;
  }
  return null;
};

export interface ChatResponse {
  text: string;
  flagged: boolean;
  bypassedAI: boolean;
}

export const sendChatMessage = async (
  userText: string,
  history: ChatMessage[],
  config?: ModelConfig
): Promise<ChatResponse> => {

  const crisis = checkCrisis(userText);
  if (crisis.isCrisis) {
    return { text: CRISIS_RESPONSE, flagged: true, bypassedAI: true };
  }

  if (isOffTopic(userText)) {
    return { text: OFF_TOPIC_RESPONSE, flagged: false, bypassedAI: true };
  }

  const cached = tryPrecache(userText);
  if (cached) {
    return { text: cached, flagged: false, bypassedAI: true };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      text: "O assistente está em modo demo. Para conversar, configure a API. Enquanto isso, que tal tentar um exercício de respiração?",
      flagged: false,
      bypassedAI: true,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const recentHistory = history.slice(-6);
    const contextText = recentHistory
      .map(m => `${m.role === 'user' ? 'Usuário' : 'Sereno'}: ${m.text}`)
      .join('\n');

    const prompt = `${contextText}\n\nUsuário: ${userText}\n\nSereno:`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: config?.systemInstruction || CHAT_SYSTEM_PROMPT,
        temperature: config?.temperature ?? 0.75,
        maxOutputTokens: config?.maxTokens ?? 600,
      },
    });

    let text = response.text || "Tô aqui. Pode me contar mais?";

    const outCrisis = checkCrisis(text);
    if (outCrisis.isCrisis) {
      return { text: CRISIS_RESPONSE, flagged: true, bypassedAI: false };
    }

    return { text, flagged: false, bypassedAI: false };
  } catch (err: any) {
    console.error('IA error:', err);
    return {
      text: "Tive um soluço aqui. Tenta de novo daqui a pouco? Enquanto isso, que tal respirar fundo 3 vezes?",
      flagged: false,
      bypassedAI: true,
    };
  }
};

// Mantém compatibilidade com chamadas antigas (caso alguma sobrou)
export const generateResponse = async (
  _apiKey: string,
  prompt: string,
  config: ModelConfig
): Promise<string> => {
  const r = await sendChatMessage(prompt, [], config);
  return r.text;
};
