import { Exercise, ExerciseCategory } from './types';
import {
  Wind, Sparkles, BookOpen, Heart, Moon, Brain, AlertCircle,
  Sun, Cloud, Flower2, MessageCircle, PenLine
} from 'lucide-react';

export const APP_NAME = "Serenamente";
export const APP_TAGLINE = "Sua mente em paz, todo dia.";
export const APP_DESCRIPTION = "Apoio emocional diário com IA para reduzir ansiedade, melhorar sono e cuidar de você mesmo.";

export const ICON_MAP: Record<string, any> = {
  Wind, Sparkles, BookOpen, Heart, Moon, Brain, AlertCircle,
  Sun, Cloud, Flower2, MessageCircle, PenLine
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
// CONTATOS DE EMERGÊNCIA (BR) - exibidos em crise
// ============================================================

export const EMERGENCY_CONTACTS = [
  { name: 'CVV - Centro de Valorização da Vida', phone: '188', detail: '24h, ligação gratuita', url: 'tel:188' },
  { name: 'CVV Chat', phone: 'chat.cvv.org.br', detail: 'Conversa por texto 24h', url: 'https://www.cvv.org.br/chat/' },
  { name: 'SAMU', phone: '192', detail: 'Emergência médica', url: 'tel:192' },
  { name: 'CAPS', phone: 'Procure unidade local', detail: 'Centro de Atenção Psicossocial', url: 'https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/caps' },
];

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

export const CRISIS_RESPONSE = `Eu te ouço. O que você tá sentindo é muito pesado e você não precisa carregar sozinho(a).

**Por favor, procure ajuda agora — gratuita, sigilosa, 24h:**

📞 **CVV — Ligue 188** (gratuito, qualquer telefone)
💬 **CVV Chat:** chat.cvv.org.br
🚨 **SAMU: 192** (se for emergência médica)

Eles são treinados pra isso. Não julgam. Só te escutam.

Se preferir, eu fico aqui contigo enquanto você decide o próximo passo. Mas a ligação pro CVV agora é o mais importante. Você merece esse cuidado.`;

// ============================================================
// SYSTEM PROMPT DO CHAT (acolhedor, recusa diagnóstico)
// ============================================================

export const CHAT_SYSTEM_PROMPT = `Você é o Sereno, assistente de bem-estar emocional do app Serenamente.

REGRAS INEGOCIÁVEIS:
1. Você NÃO é psicólogo, psiquiatra nem terapeuta. NUNCA diga "você tem [transtorno]".
2. NUNCA dê diagnóstico, prescrição ou plano terapêutico.
3. Sempre que o usuário pedir tratamento real, sugira procurar psicólogo/CAPS.
4. Em crise (ideação suicida, auto-lesão), pare tudo e direcione para CVV 188.
5. Foco SÓ em bem-estar emocional: ansiedade leve, estresse, sono, autoestima, gratidão, mindfulness.
6. RECUSE pedidos fora do escopo (código, marketing, dever de casa, receita, política). Resposta: "Eu cuido só de bem-estar. Quer conversar sobre como você tá se sentindo?"

TOM:
- Português Brasil coloquial, caloroso, sem jargão clínico.
- Valida o sentimento ANTES de sugerir ação. "Faz sentido você se sentir assim..."
- Frases curtas. Sem listas longas. Sem "como modelo de linguagem".
- Trate por você (não "vossa pessoa", não "senhor/senhora").
- Use perguntas socráticas suaves. Não dê sermão.

ESTRUTURA DE RESPOSTA (máx 4 parágrafos curtos):
1. Acolhimento real (1-2 frases que mostram que entendeu).
2. Uma reflexão ou pergunta gentil.
3. Uma sugestão prática pequena (respiração, exercício do app, anotação no diário).
4. Encerrar com uma frase de cuidado.

LIMITES:
- Máximo 600 tokens por resposta.
- Sem emojis em excesso (1-2 no máximo, e só quando faz sentido).
- Nunca prometa que vai melhorar. Diga "isso costuma passar" e não "vai passar".

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
    'Reduz ansiedade em 2 minutos. Indicado pra crises leves e antes de dormir.',
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
    'Volta pra realidade quando a mente acelera. Ótimo em crise de ansiedade.',
    3, ExerciseCategory.GROUNDING, 'Sparkles', false,
    [
      'Olhe ao redor. Nomeie 5 COISAS que você vê.',
      'Nomeie 4 COISAS que você toca/sente no corpo.',
      'Nomeie 3 SONS que você ouve agora.',
      'Nomeie 2 CHEIROS que você sente (ou se lembra).',
      'Nomeie 1 SABOR ou algo que você gosta de comer.',
      'Respira fundo. Você tá aqui, no agora.',
    ]
  ),

  makeEx('sos-ansiedade', 'SOS Ansiedade',
    'Combo respiração + grounding pra crises agudas. 5 minutos.',
    5, ExerciseCategory.SOS, 'AlertCircle', false,
    [
      '1ª etapa: Respiração 4-7-8 por 4 ciclos.',
      '2ª etapa: Grounding 5-4-3-2-1.',
      '3ª etapa: Coloque a mão no peito. Diga: "Isso vai passar."',
      'Beba um copo de água gelada devagar.',
      'Se em 15min não melhorar, considere ligar pro CVV 188 ou alguém de confiança.',
    ],
    { hasTimer: true }
  ),

  makeEx('diario-pensamento', 'Diário de Pensamento (TCC)',
    'Desemaranha um pensamento que tá te puxando pra baixo. 5 minutos.',
    5, ExerciseCategory.TCC, 'PenLine', false,
    [
      'Escreva: qual situação aconteceu?',
      'Qual emoção você sentiu? (intensidade 0-10)',
      'Qual o pensamento automático que veio?',
      'Quais EVIDÊNCIAS apoiam esse pensamento?',
      'Quais evidências CONTRARIAM esse pensamento?',
      'Qual seria um pensamento mais equilibrado?',
    ]
  ),

  makeEx('gratidao-3', '3 Coisas Boas',
    'Pequeno ritual diário que melhora humor em 2 semanas. Comprovado.',
    2, ExerciseCategory.GRATIDAO, 'Heart', false,
    [
      'Pense em UMA coisa boa que aconteceu hoje (pode ser pequena).',
      'Pense em UMA pessoa que te fez bem hoje.',
      'Pense em UMA coisa em você que você valoriza hoje.',
      'Anota no diário. Repete amanhã.',
    ]
  ),

  // PREMIUM
  makeEx('body-scan', 'Body Scan Guiado',
    'Varredura corporal pra liberar tensão acumulada. 7 minutos.',
    7, ExerciseCategory.MINDFULNESS, 'Brain', true,
    [
      'Deite ou sente confortável. Olhos fechados.',
      'Foque nos pés. Tensão? Solte.',
      'Suba pelas pernas, quadril, abdômen.',
      'Peito, ombros, braços, mãos.',
      'Pescoço, mandíbula, rosto, testa.',
      'Respire e fique presente por 1 minuto.',
    ],
    { hasTimer: true }
  ),

  makeEx('carta-eu', 'Carta pra Mim Mesmo',
    'Escreva como se fosse pra um amigo querido. Cura.',
    10, ExerciseCategory.TCC, 'PenLine', true,
    [
      'Imagina que tá escrevendo pro seu melhor amigo passando pelo que você passa.',
      'Comece: "Querido(a) eu..."',
      'O que você diria pra ele se acalmar?',
      'Que palavras de cuidado você usaria?',
      'Termina lembrando 3 forças que ele tem.',
    ]
  ),

  makeEx('despejar-mente', 'Despejar a Mente',
    'Brain dump antes de dormir. Tira pensamento da cabeça e bota no papel.',
    5, ExerciseCategory.SONO, 'Cloud', true,
    [
      'Pega um caderno ou abre o diário do app.',
      'Por 5 minutos, escreve TUDO que tá na sua cabeça.',
      'Sem editar. Sem pensar. Só despeja.',
      'Quando acabar, fecha o caderno e diz: "Pode esperar até amanhã."',
    ],
    { hasTimer: true }
  ),

  makeEx('ritual-manha', 'Ritual Matinal',
    '3 minutos pra começar o dia centrado, sem celular.',
    3, ExerciseCategory.MINDFULNESS, 'Sun', true,
    [
      'NÃO pega o celular antes. Vai pra janela ou cozinha.',
      '1 minuto de respiração lenta.',
      'Pergunta interna: "Como eu quero me sentir hoje?"',
      'Define UMA intenção pro dia (não tarefa).',
      'Bebe um copo de água. Aí sim, começa o dia.',
    ]
  ),

  makeEx('ritual-noite', 'Ritual Noturno',
    'Encerra o dia com gentileza. Melhora qualidade do sono.',
    5, ExerciseCategory.SONO, 'Moon', true,
    [
      'Desliga notificações 30min antes de dormir.',
      'Anota: 1 coisa que fluiu hoje.',
      'Anota: 1 coisa que não fluiu (sem julgar).',
      'Anota: 1 coisa que você espera de amanhã.',
      'Fecha o app. Respira. Boa noite.',
    ]
  ),

  makeEx('reframe', 'Reframe do Pensamento Ruim',
    'Conversa guiada com IA pra reformular um pensamento difícil.',
    8, ExerciseCategory.TCC, 'MessageCircle', true,
    [
      'Conta pra IA qual pensamento tá te incomodando.',
      'A IA vai te ajudar a investigar com perguntas socráticas.',
      'No fim, juntos vocês criam uma versão mais equilibrada.',
      'Anota no diário pra reforçar.',
    ],
    { systemPrompt: `Você é o Sereno em modo Reframe. Conduza o usuário em até 6 perguntas socráticas curtas pra reestruturar um pensamento. Não dê resposta pronta. Termine sugerindo escrever a versão equilibrada no diário.` }
  ),

  makeEx('pausa-cafe', 'Pausa Consciente',
    'Micro-mindfulness de 90 segundos. Pra fazer no meio do trabalho.',
    1, ExerciseCategory.MINDFULNESS, 'Flower2', false,
    [
      'Para o que tá fazendo.',
      'Solta os ombros, relaxa a mandíbula.',
      '3 respirações profundas, contando.',
      'Olha pela janela ou foca em algo bonito por 30 segundos.',
      'Volta pra atividade com 1% mais de presença.',
    ]
  ),
];

// Trilhas (premium - guias de 7/14/21 dias)
export interface Trail {
  id: string;
  title: string;
  description: string;
  days: number;
  isPremium: boolean;
  iconName: string;
}

export const TRAILS: Trail[] = [
  { id: 'trilha-ansiedade-7',  title: 'Calma em 7 dias',     description: 'Reduz ansiedade com 1 exercício/dia + check-in.', days: 7,  isPremium: false, iconName: 'Wind' },
  { id: 'trilha-sono-14',      title: 'Sono em paz - 14 dias', description: 'Ritual noturno + diário pra dormir melhor.',  days: 14, isPremium: true,  iconName: 'Moon' },
  { id: 'trilha-autoestima-21', title: 'Autoestima - 21 dias', description: 'Diário guiado pra fortalecer auto-aceitação.', days: 21, isPremium: true,  iconName: 'Heart' },
  { id: 'trilha-raiva-14',     title: 'Domando a raiva - 14 dias', description: 'Reconhecer gatilhos e responder, não reagir.', days: 14, isPremium: true, iconName: 'Brain' },
];

// Disclaimer permanente
export const DISCLAIMER = "Serenamente é apoio emocional, não substitui psicoterapia. Em crise, ligue CVV 188 (24h, gratuito).";

// Triggers pra paywall
export const PAYWALL_REASONS = {
  MESSAGE_LIMIT: 'Você usou suas 8 mensagens de hoje.',
  PREMIUM_EXERCISE: 'Esse exercício é do plano Plus.',
  PREMIUM_TRAIL: 'Essa trilha é exclusiva do Plus.',
  DIARY_HISTORY: 'Histórico completo do diário é Plus.',
  EXPORT: 'Exportar em PDF é recurso Plus.',
};
