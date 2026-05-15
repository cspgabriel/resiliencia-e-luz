import { GoogleGenAI } from "@google/genai";
import { ChatMessage, ModelConfig } from "../types";
import { CHAT_SYSTEM_PROMPT, CRISIS_RESPONSE, PRECACHED_RESPONSES } from "../constants";
import { checkCrisis, isOffTopic, OFF_TOPIC_RESPONSE } from "./safety";

const MODEL_NAME = 'gemini-2.5-flash-lite';

const env = () => (import.meta as any).env || {};
const getProxyUrl = () => env().VITE_AI_PROXY_URL || '/api/chat';
const allowClientDevFallback = () => env().DEV && env().VITE_ALLOW_CLIENT_AI_DEV === 'true';
const getClientApiKey = () => env().VITE_GEMINI_API_KEY || "";

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

const safeFallback = (): ChatResponse => ({
  text: "Tive um problema técnico por aqui. Enquanto isso, que tal tentar uma respiração curta ou escrever uma linha no diário?",
  flagged: false,
  bypassedAI: true,
});

const callProxy = async (userText: string, history: ChatMessage[], config?: ModelConfig): Promise<ChatResponse | null> => {
  try {
    const response = await fetch(getProxyUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userText,
        history: history.slice(-6),
        config: {
          systemInstruction: config?.systemInstruction || CHAT_SYSTEM_PROMPT,
          temperature: config?.temperature ?? 0.75,
          maxTokens: config?.maxTokens ?? 600,
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!data?.text || typeof data.text !== 'string') return null;

    const outCrisis = checkCrisis(data.text);
    if (outCrisis.isCrisis) {
      return { text: CRISIS_RESPONSE, flagged: true, bypassedAI: false };
    }

    return {
      text: data.text,
      flagged: Boolean(data.flagged),
      bypassedAI: false,
    };
  } catch {
    return null;
  }
};

const callClientDevFallback = async (userText: string, history: ChatMessage[], config?: ModelConfig): Promise<ChatResponse> => {
  const apiKey = getClientApiKey();
  if (!apiKey || !allowClientDevFallback()) {
    return safeFallback();
  }

  const ai = new GoogleGenAI({ apiKey });
  const recentHistory = history.slice(-6);
  const contextText = recentHistory
    .map(m => `${m.role === 'user' ? 'Usuário' : 'Luz'}: ${m.text}`)
    .join('\n');

  const prompt = `${contextText}\n\nUsuário: ${userText}\n\nLuz:`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: config?.systemInstruction || CHAT_SYSTEM_PROMPT,
      temperature: config?.temperature ?? 0.75,
      maxOutputTokens: config?.maxTokens ?? 600,
    },
  });

  const text = response.text || "Tô aqui. Pode me contar mais?";
  const outCrisis = checkCrisis(text);
  if (outCrisis.isCrisis) {
    return { text: CRISIS_RESPONSE, flagged: true, bypassedAI: false };
  }

  return { text, flagged: false, bypassedAI: false };
};

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

  const proxyResult = await callProxy(userText, history, config);
  if (proxyResult) return proxyResult;

  try {
    return await callClientDevFallback(userText, history, config);
  } catch (err) {
    console.error('IA error:', err);
    return safeFallback();
  }
};

export const generateResponse = async (
  _apiKey: string,
  prompt: string,
  config: ModelConfig
): Promise<string> => {
  const r = await sendChatMessage(prompt, [], config);
  return r.text;
};
