import { Exercise, ExerciseCategory, Mood, ViewState, DailyPlan } from './types';
import {
  Wind, Sparkles, BookOpen, Heart, Moon, Brain, AlertCircle,
  Sun, Cloud, Flower2, MessageCircle, PenLine, Map, BarChart3
} from 'lucide-react';

export const APP_NAME = "Resiliência e Luz";
export const APP_TAGLINE = "Seja a mudança que você quer ver.";
export const APP_DESCRIPTION = "Frases, reflexões e bem-estar diário para cultivar resiliência, fé e leveza no seu dia a dia.";

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

export const CHAT_SYSTEM_PROMPT = `Você é a Luz, assistente de bem-estar emocional do app Resiliência e Luz.

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
    { systemPrompt: `Você é a Luz em modo Reframe. Conduza o usuário em até 6 perguntas socráticas curtas para reestruturar um pensamento. Não dê resposta pronta. Não diagnostique. Termine sugerindo escrever a versão equilibrada no diário.` }
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

export const DISCLAIMER = "Resiliência e Luz é apoio emocional, não substitui psicoterapia. Em crise ou risco imediato, procure ajuda humana e serviços de emergência.";

export const PAYWALL_REASONS = {
  MESSAGE_LIMIT: 'Você usou suas 8 mensagens de hoje.',
  PREMIUM_EXERCISE: 'Esse exercício é do plano Plus.',
  PREMIUM_TRAIL: 'Essa trilha é exclusiva do Plus.',
  DIARY_HISTORY: 'Histórico completo do diário é Plus.',
  EXPORT: 'Exportar em PDF é recurso Plus.',
};

// ============================================================
// GAMIFICAÇÃO — XP, NÍVEIS E EVENTOS DE PONTUAÇÃO
// ============================================================

export const XP_EVENTS = {
  checkin:           10,
  diary_entry:       12,
  exercise_complete: 15,
  trail_day:         20,
  chat_message:      3,
  letter_written:    25,
  letter_read:       15,
  buddy_ping_sent:   8,
  card_shared:       5,
  colectiva_joined:  20,
  affirmation_read:  2,
  first_of_day_bonus: 5,
};

export const LEVELS = [
  { level: 1,  needXp: 0,    title: 'Semeando' },
  { level: 2,  needXp: 80,   title: 'Brotando' },
  { level: 3,  needXp: 200,  title: 'Crescendo' },
  { level: 4,  needXp: 400,  title: 'Florindo' },
  { level: 5,  needXp: 700,  title: 'Resiliente' },
  { level: 6,  needXp: 1100, title: 'Equilibrado(a)' },
  { level: 7,  needXp: 1600, title: 'Presente' },
  { level: 8,  needXp: 2200, title: 'Centrado(a)' },
  { level: 9,  needXp: 3000, title: 'Mestre do Cuidado' },
  { level: 10, needXp: 4000, title: 'Jardim Interior' },
];

// ============================================================
// CONQUISTAS — incentivam comportamentos sustentáveis
// ============================================================

export const ACHIEVEMENTS_CATALOG: { id: string; title: string; description: string; icon: string; target?: number; category: 'streak' | 'checkin' | 'diary' | 'exercise' | 'social' | 'special' }[] = [
  { id: 'streak_3',     title: 'Três dias seguidos',      description: 'Você cuidou de você 3 dias em sequência.',   icon: '🌱', target: 3,   category: 'streak' },
  { id: 'streak_7',     title: 'Uma semana',              description: '7 dias seguidos de presença.',                icon: '🌿', target: 7,   category: 'streak' },
  { id: 'streak_30',    title: 'Um mês inteiro',          description: '30 dias de cuidado contínuo.',                icon: '🌳', target: 30,  category: 'streak' },
  { id: 'streak_100',   title: '100 dias',                description: 'Você construiu um ritual.',                   icon: '🏆', target: 100, category: 'streak' },
  { id: 'checkin_10',   title: '10 check-ins',            description: 'Você está aprendendo a se ouvir.',            icon: '👂', target: 10,  category: 'checkin' },
  { id: 'checkin_50',   title: '50 check-ins',            description: 'Hábito formado.',                              icon: '💎', target: 50,  category: 'checkin' },
  { id: 'diary_first',  title: 'Primeira página',         description: 'Você abriu o diário pela primeira vez.',      icon: '📖', target: 1,   category: 'diary' },
  { id: 'diary_30',     title: 'Diarista',                description: '30 entradas no diário.',                       icon: '✍️', target: 30,  category: 'diary' },
  { id: 'exercise_5',   title: 'Cinco respiros',          description: 'Completou 5 exercícios.',                      icon: '🌬️', target: 5,   category: 'exercise' },
  { id: 'exercise_25',  title: 'Praticante',              description: 'Completou 25 exercícios.',                     icon: '🧘', target: 25,  category: 'exercise' },
  { id: 'first_letter', title: 'Carta para o futuro',     description: 'Você escreveu para você mesmo(a).',           icon: '💌', target: 1,   category: 'social' },
  { id: 'first_share',  title: 'Compartilhou afeto',      description: 'Mandou um card de cuidado para alguém.',      icon: '💞', target: 1,   category: 'social' },
  { id: 'first_buddy',  title: 'Dupla formada',           description: 'Você e alguém estão cuidando juntos.',         icon: '🤝', target: 1,   category: 'social' },
  { id: 'colectiva_1',  title: 'Calma coletiva',          description: 'Respirou junto com outras pessoas.',           icon: '🌊', target: 1,   category: 'social' },
  { id: 'night_owl',    title: 'Coruja consciente',       description: 'Cuidou de si depois das 23h.',                 icon: '🦉', target: 1,   category: 'special' },
  { id: 'early_bird',   title: 'Pássaro madrugador',      description: 'Cuidou de si antes das 7h.',                   icon: '🐦', target: 1,   category: 'special' },
  { id: 'comeback',     title: 'Voltou com gentileza',    description: 'Retornou ao app após uma pausa.',              icon: '💛', target: 1,   category: 'special' },
];

// ============================================================
// COMPANHEIRO — SERENINHO (estágios)
// ============================================================

export const COMPANION_STAGES = [
  { stage: 0, name: 'Semente',   emoji: '🌰', needXp: 0,    description: 'Começo de tudo.' },
  { stage: 1, name: 'Broto',     emoji: '🌱', needXp: 50,   description: 'Apareceu a primeira folha.' },
  { stage: 2, name: 'Muda',      emoji: '🌿', needXp: 150,  description: 'Pequena mas firme.' },
  { stage: 3, name: 'Plantinha', emoji: '🪴', needXp: 350,  description: 'Cresceu com seu cuidado.' },
  { stage: 4, name: 'Florida',   emoji: '🌸', needXp: 700,  description: 'Floresceu junto com você.' },
  { stage: 5, name: 'Jardim',    emoji: '🌷', needXp: 1200, description: 'Virou um jardim inteiro.' },
];

export const COMPANION_GREETINGS = [
  'Que bom te ver. Como você tá?',
  'Tô aqui crescendo com você 💚',
  'Você apareceu. Isso já é cuidado.',
  'Um dia de cada vez. Estamos juntos.',
  'Respira. Eu te espero.',
];

// ============================================================
// AFIRMAÇÕES DIÁRIAS — POOL ROTATIVO (sem repetir por 60 dias)
// ============================================================

export const AFFIRMATIONS: { text: string; palette: string[] }[] = [
  { text: 'Hoje você não precisa ser produtivo. Só precisa estar.',                palette: ['#A7F3D0','#FCD34D'] },
  { text: 'Respirar fundo já é começar de novo.',                                  palette: ['#BFDBFE','#A5F3FC'] },
  { text: 'Sentir não é fraqueza. Sentir é estar vivo.',                           palette: ['#FBCFE8','#FECACA'] },
  { text: 'Você atravessou todos os dias difíceis até agora. 100% de aproveitamento.', palette: ['#FDE68A','#FCA5A5'] },
  { text: 'O que pesa hoje não é definitivo.',                                     palette: ['#C7D2FE','#DDD6FE'] },
  { text: 'Pequeno também conta.',                                                 palette: ['#A7F3D0','#86EFAC'] },
  { text: 'Descansar é parte do plano, não falha.',                                palette: ['#FED7AA','#FCA5A5'] },
  { text: 'Você merece o mesmo cuidado que oferece aos outros.',                   palette: ['#FBCFE8','#FDE68A'] },
  { text: 'Hoje, só por hoje, faça o suficiente.',                                 palette: ['#A5F3FC','#BFDBFE'] },
  { text: 'A calma também pratica. Volta amanhã.',                                 palette: ['#DDD6FE','#FBCFE8'] },
  { text: 'Você não precisa de uma razão para cuidar de você.',                    palette: ['#FDE68A','#A7F3D0'] },
  { text: 'A ansiedade fala alto. A serenidade ensina baixinho.',                  palette: ['#BFDBFE','#FBCFE8'] },
  { text: 'Ser gentil consigo é mais corajoso que se cobrar.',                     palette: ['#FECACA','#FDE68A'] },
  { text: 'Hoje pode ser leve, mesmo que pequeno.',                                palette: ['#86EFAC','#A5F3FC'] },
  { text: 'Você é mais inteiro do que se sente nos dias difíceis.',                palette: ['#C7D2FE','#FCD34D'] },
];

export const getDailyAffirmation = (dateKey: string): typeof AFFIRMATIONS[number] => {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  return AFFIRMATIONS[h % AFFIRMATIONS.length];
};

// ============================================================
// MINI-TRILHAS DE 3 DIAS — baixa ativação
// ============================================================

export const MINI_TRAILS: { id: string; title: string; description: string; iconName: string; tasks: string[] }[] = [
  {
    id: 'mini-comecar',
    title: 'Para começar (3 dias)',
    description: 'Três dias pequenos para entender o app.',
    iconName: 'Sparkles',
    tasks: [
      'Faça um check-in rápido.',
      'Teste a Respiração 4-7-8 (2 min).',
      'Escreva 3 coisas boas no diário.',
    ],
  },
  {
    id: 'mini-dormir',
    title: 'Dormir melhor em 3 dias',
    description: 'Ritual noturno enxuto.',
    iconName: 'Moon',
    tasks: [
      'Faça um ritual noturno hoje.',
      'Despeje a mente no diário antes de dormir.',
      'Repita o ritual e anote o que mudou.',
    ],
  },
  {
    id: 'mini-respirar',
    title: 'Respirar com calma em 3 dias',
    description: 'Para quem tá com ansiedade leve.',
    iconName: 'Wind',
    tasks: [
      'Respiração 4-7-8 ao acordar.',
      'Grounding 5-4-3-2-1 no meio do dia.',
      'Pausa consciente antes de dormir.',
    ],
  },
];

// ============================================================
// STREAK — política gentil (Wysa/Finch-style)
// ============================================================

export const STREAK_FREEZES_PER_MONTH = 4;
export const STREAK_MIN_ACTIONS_FOR_DAY = 1;

// ============================================================
// CALMA COLETIVA — sessão diária às 22h00
// ============================================================

export const COLECTIVA_SCHEDULE_HOUR = 22;
export const COLECTIVA_DURATION_MIN = 5;
export const COLECTIVA_EXERCISE_ID = 'resp-478';

// ============================================================
// CONVITES / REFERRAL
// ============================================================

export const REFERRAL_REWARD_DAYS = 30;
export const REFERRAL_WHATSAPP_TEXT = (code: string, url: string) =>
  `Tô usando o Resiliência e Luz pra me cuidar todo dia (check-in, respiração, diário). Quer experimentar comigo? Com meu código ${code} a gente ganha 30 dias do plano Plus juntos: ${url}?ref=${code}`;

// ============================================================
// MURAL ANÔNIMO — filtros automáticos
// ============================================================

export const ANON_BANNED_TERMS = [
  ...CRISIS_TERMS_URGENT,
  ...CRISIS_TERMS_CONCERN,
  '@', 'http', 'www.', 'cpf', 'rg ', 'whatsapp', 'telegram',
];

export const ANON_MAX_LEN = 140;

// ============================================================
// ANÚNCIOS — slots e contextos onde podem aparecer
// ============================================================

export const AD_SLOTS = {
  home_top:        { id: 'home_top',        format: 'native',  context: 'home' },
  home_mid:        { id: 'home_mid',        format: 'banner',  context: 'home' },
  exercises_list:  { id: 'exercises_list',  format: 'native',  context: 'exercises' },
  trails_bottom:   { id: 'trails_bottom',   format: 'banner',  context: 'trails' },
  diary_inline:    { id: 'diary_inline',    format: 'native',  context: 'diary' },
  insights_bottom: { id: 'insights_bottom', format: 'banner',  context: 'insights' },
  achievements:    { id: 'achievements',    format: 'banner',  context: 'achievements' },
  wrapped_bottom:  { id: 'wrapped_bottom',  format: 'banner',  context: 'wrapped' },
  letters_list:    { id: 'letters_list',    format: 'banner',  context: 'letters' },
} as const;

export type AdSlotId = keyof typeof AD_SLOTS;

export const ADS_DIARY_EVERY_N = 6;
