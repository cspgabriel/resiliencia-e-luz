import { Exercise, ExerciseCategory, Mood, ViewState, DailyPlan } from './types';
import {
  Wind, Sparkles, BookOpen, Heart, Moon, Brain, AlertCircle,
  Sun, Cloud, Flower2, MessageCircle, PenLine, Map, BarChart3
} from 'lucide-react';

export const APP_NAME = "Serenamente";
export const APP_TAGLINE = "Sua mente em paz, todo dia.";
export const APP_DESCRIPTION = "Apoio emocional diário com IA para organizar sentimentos, reduzir estresse e criar pequenos rituais de autocuidado.";

export const ICON_MAP: Record<string, any> = {
  Wind, Sparkles, BookOpen, Heart, Moon, Brain, AlertCircle,
  Sun, Cloud, Flower2, MessageCircle, PenLine, Map, BarChart3
};

// ============================================================
// LIMITES E PRECIFICAÇÃO
// ============================================================

export const FREE_LIMITS = {
  messagesPerDay: 8,
  diaryDaysHistory: 7,
  exercisesFree: 5,
  trailsFree: 1,
};

export const PRO_LIMITS = {
  messagesPerDay: 200,
  diaryDaysHistory: 9999,
  exercisesFree: 999,
  trailsFree: 999,
};

export const PRICING = {
  monthly: { id: 'plus_monthly', label: 'Mensal', price: 19.90, suffix: '/mês' },
  yearly:  { id: 'plus_yearly',  label: 'Anual',  price: 119.00, suffix: '/ano', savings: '50% OFF' },
};

// ============================================================
// CHECK-IN: TAGS ÚTEIS PARA INSIGHTS SEM DIAGNÓSTICO
// ============================================================

export const CHECKIN_TRIGGER_TAGS = [
  'Trabalho', 'Família', 'Relacionamento', 'Dinheiro', 'Estudos',
  'Sono', 'Corpo/saúde', 'Solidão', 'Redes sociais', 'Sem motivo claro'
];

// ============================================================
// CONTATOS DE EMERGÊNCIA (BR) - exibidos em crise
// ============================================================

export const EMERGENCY_CONTACTS = [
  { name: 'CVV - Centro de Valorização da Vida', phone: '188', detail: '24h, ligação gratuita', url: 'tel:188' },
  { name: 'CVV Chat', phone: 'chat.cvv.org.br', detail: 'Conversa por texto 24h', url: 'https://www.cvv.org.br/chat/' },
  { name: 'SAMU', phone: '192', detail: 'Emergência médica', url: 'tel:192' },
  { name: 'CAPS', phone: 'Procure unidade local', detail: 'Centro de Atenção Psicossocial', url: 'https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/caps' },
];

// Estrutura inicial para internacionalização. Não basta traduzir: crise, preço e termos mudam por país.
export const MARKET_CONFIGS = {
  'pt-BR': {
    label: 'Brasil',
    crisisPrimary: 'CVV 188',
    emergency: 'SAMU 192',
    currency: 'BRL',
  },
  'en-US': {
    label: 'United States',
    crisisPrimary: '988 Suicide & Crisis Lifeline',
    emergency: '911',
    currency: 'USD',
  },
  'es-LATAM': {
    label: 'LatAm Spanish',
    crisisPrimary: 'Linha local de apoio emocional',
    emergency: 'Emergência local',
    currency: 'LOCAL',
  },
};

// ============================================================
// DETECTOR DE CRISE - palavras-gatilho (fallback ao LLM)
// ============================================================

export const CRISIS_TERMS_URGENT = [
  'suicidio', 'suicídio', 'me matar', 'tirar a vida', 'acabar comigo',
  'nao quero mais viver', 'não quero mais viver', 'nao aguento mais viver',
  'sumir pra sempre', 'desaparecer pra sempre',
  'me cortar', 'auto lesao', 'auto-lesão',
  'overdose', 'pular do', 'me enforcar',
];

export const CRISIS_TERMS_CONCERN = [
  'sem saida', 'sem saída', 'desisto de tudo', 'nao aguento mais', 'não aguento mais',
  'cansado de viver', 'sem esperanca', 'sem esperança',
  'ninguem se importa', 'ninguém se importa',
];

// ============================================================
// MENSAGEM DE CRISE FORÇADA (sobrepõe IA)
// ============================================================

export const CRISIS_RESPONSE = `Eu te ouço. O que você tá sentindo é muito pesado e você não precisa carregar isso sozinho(a).

**Por favor, procure ajuda agora — gratuita, sigilosa, 24h:**

📞 **CVV — Ligue 188** (gratuito, qualquer telefone)
💬 **CVV Chat:** chat.cvv.org.br
🚨 **SAMU: 192** (se houver risco imediato ou emergência médica)

Eles são treinados pra isso. Não julgam. Só te escutam.

Eu posso ficar aqui com você por alguns instantes, mas o passo mais seguro agora é acionar uma pessoa real ou um serviço de emergência. Você merece esse cuidado.`;

// ============================================================
// SYSTEM PROMPT DO CHAT (acolhedor, recusa diagnóstico)
// ============================================================

export const CHAT_SYSTEM_PROMPT = `Você é o Sereno, assistente de bem-estar emocional do app Serenamente.

REGRAS INEGOCIÁVEIS:
1. Você NÃO é psicólogo, psiquiatra nem terapeuta. NUNCA diga "você tem [transtorno]".
2. NUNCA dê diagnóstico, prescrição, tratamento médico ou plano terapêutico.
3. Sempre que o usuário pedir tratamento real, sugira procurar psicólogo, médico, CAPS ou serviço equivalente.
4. Em crise (ideação suicida, auto-lesão), pare tudo e direcione para CVV 188, SAMU 192 ou ajuda humana local.
5. Foco SÓ em bem-estar emocional: ansiedade leve, estresse, sono, autoestima, gratidão, mindfulness e organização de sentimentos.
6. RECUSE pedidos fora do escopo (código, marketing, dever de casa, receita, política). Resposta: "Eu cuido só de bem-estar. Quer conversar sobre como você tá se sentindo?"

TOM:
- Português Brasil coloquial, caloroso, sem jargão clínico.
- Valida o sentimento ANTES de sugerir ação. "Faz sentido você se sentir assim..."
- Frases curtas. Sem listas longas. Sem "como modelo de linguagem".
- Trate por você.
- Use perguntas socráticas suaves. Não dê sermão.

ESTRUTURA DE RESPOSTA (máx 4 parágrafos curtos):
1. Acolhimento real (1-2 frases que mostram que entendeu).
2. Uma reflexão ou pergunta gentil.
3. Uma sugestão prática pequena (respiração, exercício do app, anotação no diário).
4. Encerrar com uma frase de cuidado.

LIMITES:
- Máximo 600 tokens por resposta.
- Sem emojis em excesso (1-2 no máximo, e só quando faz sentido).
- Nunca prometa cura ou melhora garantida. Diga "isso costuma passar" em vez de "vai passar".

Se o usuário compartilhar dado pessoal (nome, idade, cidade), use só pra contextualizar a conversa — NÃO repita de volta dados sensíveis.`;

// ============================================================
// CACHE DE RESPOSTAS COMUNS (corta custo IA ~25%)
// ============================================================

export const PRECACHED_RESPONSES: Record<string, string> = {
  'bom dia': 'Bom dia 🌱 Como você tá começando o dia hoje? Que tal um check-in rápido pra gente entender como você tá?',
  'oi': 'Oi! Que bom te ver por aqui. Como você tá hoje?',
  'ola': 'Olá! Tô aqui pra te ouvir. O que tá passando contigo hoje?',
  'obrigado': 'De nada. Eu fico feliz que tenha ajudado, mesmo que um pouquinho. Volta sempre que precisar.',
  'obrigada': 'De nada. Eu fico feliz que tenha ajudado, mesmo que um pouquinho. Volta sempre que precisar.',
  'tchau': 'Cuida de você. Tô aqui amanhã quando quiser voltar 💛',
  'boa noite': 'Boa noite. Antes de dormir, que tal um exercício curto de respiração ou anotar 3 coisas boas do dia no diário?',
};

// ============================================================
// PLANO DO DIA - REGRAS SIMPLES, SEM DIAGNÓSTICO
// ============================================================

export const getDailyPlan = (mood?: Mood, energy?: number, sleep?: number): DailyPlan => {
  if (!mood) {
    return {
      title: 'Plano de hoje',
      message: 'Faça um check-in de 30 segundos para eu sugerir um cuidado simples para agora.',
      actionLabel: 'Fazer check-in',
      targetView: ViewState.CHECKIN,
    };
  }

  if (mood === Mood.ANSIOSO || mood === Mood.IRRITADO) {
    return {
      title: 'Plano de calma para hoje',
      message: 'Comece com 2 minutos de respiração. Depois, escreva uma linha sobre o que mais pegou.',
      actionLabel: 'Respirar agora',
      targetView: ViewState.EXERCISES,
      exerciseId: 'resp-478',
    };
  }

  if (mood === Mood.TRISTE || mood === Mood.EXAUSTO || (energy ?? 3) <= 2) {
    return {
      title: 'Plano gentil para hoje',
      message: 'Escolha uma tarefa pequena, sem se cobrar. Uma pausa consciente pode ajudar a atravessar o próximo passo.',
      actionLabel: 'Fazer pausa consciente',
      targetView: ViewState.EXERCISES,
      exerciseId: 'pausa-cafe',
    };
  }

  if ((sleep ?? 7) < 6) {
    return {
      title: 'Plano de sono para hoje',
      message: 'Seu sono ficou baixo. Hoje vale reduzir estímulos à noite e testar um ritual simples antes de dormir.',
      actionLabel: 'Ver ritual noturno',
      targetView: ViewState.EXERCISES,
      exerciseId: 'ritual-noite',
    };
  }

  return {
    title: 'Plano de manutenção',
    message: 'Você parece relativamente estável hoje. Registre uma coisa boa do dia para reforçar esse cuidado.',
    actionLabel: 'Anotar 3 coisas boas',
    targetView: ViewState.EXERCISES,
    exerciseId: 'gratidao-3',
  };
};

// ============================================================
// 12 EXERCÍCIOS — núcleo do app
// ============================================================

const makeEx = (
  id: string, title: string, description: string, duration: number,
  category: ExerciseCategory, iconName: string, isPremium: boolean,
  steps: string[], opts?: Partial<Exercise>
): Exercise => ({
  id, title, description, duration, category, iconName, isPremium, steps, ...opts
});

export const EXERCISES: Exercise[] = [
  makeEx('resp-478', 'Respiração 4-7-8',
    'Reduz ativação do corpo em 2 minutos. Indicado pra ansiedade leve e antes de dormir.',
    2, ExerciseCategory.RESPIRACAO, 'Wind', false,
    [
      'Sente-se confortável e solte os ombros.',
      'Inspire pelo nariz contando até 4.',
      'Segure o ar contando até 7.',
      'Expire pela boca contando até 8, fazendo um leve som.',
      'Repita 4 ciclos. Se der tontura, pausa.',
    ],
    { hasBreathing: true, hasTimer: true }
  ),

  makeEx('ground-54321', 'Grounding 5-4-3-2-1',
    'Volta sua atenção para o presente quando a mente acelera.',
    3, ExerciseCategory.GROUNDING, 'Sparkles', false,
    [
      'Olhe ao redor. Nomeie 5 coisas que você vê.',
      'Nomeie 4 coisas que você toca ou sente no corpo.',
      'Nomeie 3 sons que você ouve agora.',
      'Nomeie 2 cheiros que você sente ou lembra.',
      'Nomeie 1 sabor ou algo que você gosta de comer.',
      'Respira fundo. Você está aqui, no agora.',
    ]
  ),

  makeEx('sos-ansiedade', 'SOS Ansiedade',
    'Combo respiração + grounding para momentos de ansiedade intensa. 5 minutos.',
    5, ExerciseCategory.SOS, 'AlertCircle', false,
    [
      '1ª etapa: Respiração 4-7-8 por 4 ciclos.',
      '2ª etapa: Grounding 5-4-3-2-1.',
      '3ª etapa: Coloque a mão no peito. Diga: "Eu estou aqui agora. Esse pico costuma passar."',
      'Beba um copo de água gelada devagar.',
      'Se você não se sentir seguro(a), ligue para o CVV 188, SAMU 192 ou alguém de confiança.',
    ],
    { hasTimer: true }
  ),

  makeEx('diario-pensamento', 'Diário de Pensamento (TCC)',
    'Ajuda a organizar um pensamento difícil sem transformar isso em diagnóstico.',
    5, ExerciseCategory.TCC, 'PenLine', false,
    [
      'Escreva: qual situação aconteceu?',
      'Qual emoção você sentiu? (intensidade 0-10)',
      'Qual pensamento automático veio?',
      'Quais evidências apoiam esse pensamento?',
      'Quais evidências mostram outro lado?',
      'Qual seria um pensamento mais equilibrado?',
    ]
  ),

  makeEx('gratidao-3', '3 Coisas Boas',
    'Pequeno ritual diário para treinar atenção ao que também funcionou no dia.',
    2, ExerciseCategory.GRATIDAO, 'Heart', false,
    [
      'Pense em uma coisa boa que aconteceu hoje, mesmo pequena.',
      'Pense em uma pessoa que te fez bem hoje.',
      'Pense em uma coisa em você que você valoriza hoje.',
      'Anote no diário. Repete amanhã, sem cobrança.',
    ]
  ),

  makeEx('body-scan', 'Body Scan Guiado',
    'Varredura corporal para perceber e soltar tensão acumulada. 7 minutos.',
    7, ExerciseCategory.MINDFULNESS, 'Brain', true,
    [
      'Deite ou sente confortável. Olhos fechados, se for seguro.',
      'Foque nos pés. Tem tensão? Só perceba.',
      'Suba pelas pernas, quadril e abdômen.',
      'Perceba peito, ombros, braços e mãos.',
      'Perceba pescoço, mandíbula, rosto e testa.',
      'Respire e fique presente por 1 minuto.',
    ],
    { hasTimer: true }
  ),

  makeEx('carta-eu', 'Carta pra Mim Mesmo',
    'Escreva como se fosse para um amigo querido passando pelo mesmo momento.',
    10, ExerciseCategory.TCC, 'PenLine', true,
    [
      'Imagine que está escrevendo para seu melhor amigo passando pelo que você passa.',
      'Comece: "Querido(a) eu..."',
      'O que você diria para ele se acolher?',
      'Que palavras de cuidado você usaria?',
      'Termine lembrando 3 forças que ele tem.',
    ]
  ),

  makeEx('despejar-mente', 'Despejar a Mente',
    'Brain dump antes de dormir. Tira pensamento da cabeça e coloca no papel.',
    5, ExerciseCategory.SONO, 'Cloud', true,
    [
      'Pegue um caderno ou abra o diário do app.',
      'Por 5 minutos, escreva tudo que está na cabeça.',
      'Sem editar. Sem pensar bonito. Só despeja.',
      'Quando acabar, feche e diga: "Isso pode esperar até amanhã."',
    ],
    { hasTimer: true }
  ),

  makeEx('ritual-manha', 'Ritual Matinal',
    '3 minutos para começar o dia centrado, antes do celular.',
    3, ExerciseCategory.MINDFULNESS, 'Sun', true,
    [
      'Antes de pegar o celular, vá para a janela ou cozinha.',
      'Faça 1 minuto de respiração lenta.',
      'Pergunte: "Como eu quero me sentir hoje?"',
      'Defina uma intenção para o dia, não uma cobrança.',
      'Beba um copo de água. Aí sim, comece o dia.',
    ]
  ),

  makeEx('ritual-noite', 'Ritual Noturno',
    'Encerra o dia com gentileza e reduz estímulos antes de dormir.',
    5, ExerciseCategory.SONO, 'Moon', true,
    [
      'Desligue notificações 30 minutos antes de dormir.',
      'Anote 1 coisa que fluiu hoje.',
      'Anote 1 coisa que não fluiu, sem se julgar.',
      'Anote 1 coisa que você espera de amanhã.',
      'Feche o app. Respire. Boa noite.',
    ]
  ),

  makeEx('reframe', 'Reframe do Pensamento Difícil',
    'Conversa guiada com IA para reformular um pensamento difícil.',
    8, ExerciseCategory.TCC, 'MessageCircle', true,
    [
      'Conte para a IA qual pensamento está te incomodando.',
      'A IA vai ajudar a investigar com perguntas socráticas.',
      'No fim, vocês criam uma versão mais equilibrada.',
      'Anote no diário para reforçar.',
    ],
    { systemPrompt: `Você é o Sereno em modo Reframe. Conduza o usuário em até 6 perguntas socráticas curtas para reestruturar um pensamento. Não dê resposta pronta. Não diagnostique. Termine sugerindo escrever a versão equilibrada no diário.` }
  ),

  makeEx('pausa-cafe', 'Pausa Consciente',
    'Micro-mindfulness de 90 segundos para fazer no meio do trabalho.',
    1, ExerciseCategory.MINDFULNESS, 'Flower2', false,
    [
      'Pare o que está fazendo por um instante.',
      'Solte os ombros e relaxe a mandíbula.',
      'Faça 3 respirações profundas, contando.',
      'Olhe pela janela ou foque em algo bonito por 30 segundos.',
      'Volte para a atividade com 1% mais de presença.',
    ]
  ),
];

// Trilhas (guias de 7/14/21 dias)
export interface Trail {
  id: string;
  title: string;
  description: string;
  days: number;
  isPremium: boolean;
  iconName: string;
}

export const TRAILS: Trail[] = [
  { id: 'trilha-ansiedade-7',  title: 'Calma em 7 dias',     description: 'Reduzir aceleração do corpo com check-in + 1 prática por dia.', days: 7,  isPremium: false, iconName: 'Wind' },
  { id: 'trilha-sono-14',      title: 'Sono em paz - 14 dias', description: 'Ritual noturno + diário para preparar melhor a noite.',  days: 14, isPremium: true,  iconName: 'Moon' },
  { id: 'trilha-autoestima-21', title: 'Autoestima - 21 dias', description: 'Diário guiado para fortalecer autoaceitação, sem cobrança.', days: 21, isPremium: true,  iconName: 'Heart' },
  { id: 'trilha-raiva-14',     title: 'Domando a raiva - 14 dias', description: 'Reconhecer gatilhos e responder com mais pausa.', days: 14, isPremium: true, iconName: 'Brain' },
];

export const getTrailTask = (trailId: string, day: number): string => {
  const tasks: Record<string, string[]> = {
    'trilha-ansiedade-7': [
      'Faça um check-in e a Respiração 4-7-8.',
      'Teste o Grounding 5-4-3-2-1.',
      'Anote um gatilho comum de ansiedade.',
      'Faça uma pausa consciente no meio do dia.',
      'Escreva um pensamento difícil e uma versão mais equilibrada.',
      'Crie uma frase de ancoragem para momentos tensos.',
      'Revise a semana sem se julgar: o que ajudou 1%?',
    ],
  };
  return tasks[trailId]?.[day - 1] || 'Faça um check-in, escolha um exercício curto e anote uma linha no diário.';
};

// Disclaimer permanente
export const DISCLAIMER = "Serenamente é apoio emocional, não substitui psicoterapia. Em crise ou risco imediato, procure ajuda humana e serviços de emergência.";

// Triggers pra paywall
export const PAYWALL_REASONS = {
  MESSAGE_LIMIT: 'Você usou suas 8 mensagens de hoje.',
  PREMIUM_EXERCISE: 'Esse exercício é do plano Plus.',
  PREMIUM_TRAIL: 'Essa trilha é exclusiva do Plus.',
  DIARY_HISTORY: 'Histórico completo do diário é Plus.',
  EXPORT: 'Exportar em PDF é recurso Plus.',
};
