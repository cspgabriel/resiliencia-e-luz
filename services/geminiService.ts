
import { GoogleGenAI } from "@google/genai";
import { ModelConfig } from "../types";

// API keys must be supplied by environment variables. Never hardcode keys in the client.
const DEFAULT_API_KEY = "";

const getApiKey = () => process.env.API_KEY || DEFAULT_API_KEY;

// Helper function to check if API key exists
const checkApiKey = () => {
  if (!getApiKey()) {
    throw new Error("API Key is missing.");
  }
};

/**
 * Generates a text response using Gemini models.
 */
export const generateResponse = async (_apiKey: string, prompt: string, config: ModelConfig): Promise<string> => {
  checkApiKey();
  const apiKey = getApiKey();

  try {
    // Use the resolved API key
    const ai = new GoogleGenAI({ apiKey });
    let modelName = config.modelName || 'gemini-3-flash-preview'; 
    
    const generationConfig: any = {};
    const tools: any[] = [];

    const lowerPrompt = prompt.toLowerCase();
    const needsSearch = lowerPrompt.includes('pesquisa') || 
                        lowerPrompt.includes('atual') ||
                        lowerPrompt.includes('google') ||
                        lowerPrompt.includes('busca') ||
                        lowerPrompt.includes('notícia');

    if (needsSearch) {
       tools.push({ googleSearch: {} });
    }
    
    if (config.useThinking) {
      modelName = 'gemini-3-pro-preview'; 
      generationConfig.thinkingConfig = { thinkingBudget: config.thinkingBudget || 1024 };
    }

    if (config.systemInstruction) {
      generationConfig.systemInstruction = config.systemInstruction;
    }

    try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            ...generationConfig,
            tools: tools.length > 0 ? tools : undefined
          },
        });
        
        let text = response.text || "Sem resposta gerada.";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (groundingChunks && groundingChunks.length > 0) {
            let sourcesMarkdown = "\n\n**Fontes Consultadas:**\n";
            let hasSources = false;
            groundingChunks.forEach((chunk: any, index: number) => {
                if (chunk.web?.uri) {
                    sourcesMarkdown += `- [${chunk.web.title || 'Fonte ' + (index + 1)}](${chunk.web.uri})\n`;
                    hasSources = true;
                }
            });
            if (hasSources) text += sourcesMarkdown;
        }
        
        return text;

    } catch (innerError: any) {
        // Fallback to gemini-3-flash-preview if the requested model is unavailable
        const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt
        });
        return fallbackResponse.text || "Sem resposta.";
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Erro ao gerar resposta.");
  }
};

/**
 * Generates an image using gemini-2.5-flash-image.
 */
export const generateImage = async (_apiKey: string, prompt: string): Promise<string> => {
  checkApiKey();
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  // Iterate through parts to find the generated image data
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
    }
  }

  throw new Error("Nenhuma imagem foi gerada pelo modelo.");
};

/**
 * Generates a video using veo-3.1-fast-generate-preview.
 */
export const generateVideo = async (_apiKey: string, prompt: string): Promise<{ uri: string }> => {
  checkApiKey();
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Poll the operation status until it is done
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Falha ao obter o link de download do vídeo.");
  }

  return { uri: downloadLink };
};
