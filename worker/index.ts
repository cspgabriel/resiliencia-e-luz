export interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGIN?: string;
}

const MODEL_NAME = 'gemini-2.5-flash-lite';

const cors = (env: Env) => ({
  'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});

const json = (body: unknown, status = 200, env: Env) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(env) },
  });

const normalizeText = (value: unknown): string =>
  typeof value === 'string' ? value.slice(0, 4000).trim() : '';

const buildPrompt = (userText: string, history: Array<{ role: string; text: string }>) => {
  const context = history
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'Usuário' : 'Sereno'}: ${normalizeText(m.text)}`)
    .join('\n');
  return `${context}\n\nUsuário: ${userText}\n\nSereno:`;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(env) });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, env);
    if (!env.GEMINI_API_KEY) return json({ error: 'missing_gemini_key' }, 500, env);

    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid_json' }, 400, env);
    }

    const userText = normalizeText(body.userText);
    if (!userText) return json({ error: 'empty_message' }, 400, env);

    const history = Array.isArray(body.history) ? body.history : [];
    const config = body.config || {};
    const systemInstruction = normalizeText(config.systemInstruction) || 'Você é um assistente de bem-estar emocional. Não diagnostique. Em crise, direcione para ajuda humana.';

    const prompt = buildPrompt(userText, history);

    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: typeof config.temperature === 'number' ? config.temperature : 0.75,
          maxOutputTokens: typeof config.maxTokens === 'number' ? config.maxTokens : 600,
        },
      }),
    });

    if (!upstream.ok) {
      return json({ error: 'ai_provider_error' }, 502, env);
    }

    const data: any = await upstream.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('').trim();

    return json({ text: text || 'Tô aqui. Pode me contar mais?', flagged: false }, 200, env);
  },
};
