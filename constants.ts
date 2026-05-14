
import { Profession, PromptTemplate } from './types';
import { 
  Code2, PenTool, Briefcase, Megaphone, Users, BrainCircuit, Rocket, Search, FileText, Mail, Instagram, Bug, CloudSun,
  Stethoscope, Apple, Dumbbell, Scale, GraduationCap, Home, Palette, Smile, HeartHandshake, Calculator, Gavel, 
  Lightbulb, TrendingUp, BookOpen, Brush, Sparkles
} from 'lucide-react';

export const APP_NAME = "IA Mágica";

export const ICON_MAP: Record<string, any> = {
  Code2, PenTool, Briefcase, Megaphone, Users, BrainCircuit, Rocket, Search, FileText, Mail, Instagram, Bug, CloudSun,
  Stethoscope, Apple, Dumbbell, Scale, GraduationCap, Home, Palette, Smile, HeartHandshake, Calculator, Gavel,
  Lightbulb, TrendingUp, BookOpen, Brush, Sparkles
};

const createPrompt = (id: string, title: string, desc: string, content: string, cat: string, prof: Profession, icon: string, premium = true): PromptTemplate => ({
  id, title, description: desc, content, category: cat, profession: prof, isPremium: premium, iconName: icon
});

export const PROMPTS_DATA: PromptTemplate[] = [
  // Novo Prompt ABIH-RJ
  createPrompt('mkt-abih', 'SEO Previsão do Tempo - ABIH-RJ', 'Gera matéria otimizada para o site da ABIH-RJ com dados em tempo real.', 'Pesquisa a previsao do tempo e faz materia otimizada SEO PRO SITE DA abih-rj.\n\n[LINK BUILD INTERNO:] ABIHRJ.COM.BR\n[LINK BUILD EXTERNO:] fonte da previso do tempo\n[PALAVRA CHAVE] Previsao do Tempo para Hoje e Amanha em Arraial do Cabo (RJ)', 'SEO', Profession.MARKETING, 'CloudSun'),

  // Novo Prompt Genérico de SEO solicitado
  createPrompt('mkt-seo-gen', 'Gerador de Matéria SEO', 'Cria artigos otimizados para qualquer site com estrutura de link building.', 'Atue como um Redator Sênior especialista em SEO. Escreva uma matéria completa sobre o assunto: [ASSUNTO].\n\nRequisitos Obrigatórios:\n1. Otimize o texto focando na palavra-chave: [PALAVRA CHAVE]\n2. Insira sugestão de Link Interno para: [LINK BUILD INTERNO]\n3. Cite/Use como referência Link Externo: [LINK BUILD EXTERNO]\n4. Use formatação HTML (H1, H2, H3) para hierarquia.\n5. Crie uma Meta Description atrativa no final.', 'SEO', Profession.MARKETING, 'PenTool'),

  createPrompt('psy-1', 'Reestruturação Cognitiva', 'Terapia TCC.', 'Ajude-me a criar um exercício de reestruturação cognitiva para um paciente que tem o pensamento automático: "[PENSAMENTO NEGATIVO]". Gere evidências a favor e contra.', 'TCC', Profession.PSYCHOLOGY, 'BrainCircuit'),
  createPrompt('psy-2', 'Resumo de Sessão', 'Documentação.', 'Organize as seguintes anotações soltas de uma sessão em um formato SOAP (Subjetivo, Objetivo, Avaliação, Plano): [NOTAS].', 'Clínica', Profession.PSYCHOLOGY, 'FileText'),
  createPrompt('psy-3', 'Metáfora Terapêutica', 'Intervenção.', 'Crie uma metáfora simples para explicar o conceito de "Aceitação" na ACT (Terapia de Aceitação e Compromisso) para um adolescente.', 'Didática', Profession.PSYCHOLOGY, 'Lightbulb'),
  createPrompt('psy-4', 'Roteiro de Mindfulness', 'Prática.', 'Escreva um roteiro de 5 minutos para um exercício de Mindfulness focado na respiração para redução de ansiedade aguda.', 'Prática', Profession.PSYCHOLOGY, 'Smile'),
  createPrompt('psy-5', 'Psicoeducação Ansiedade', 'Material.', 'Crie um texto explicativo para enviar ao paciente descrevendo a fisiologia da crise de pânico (luta ou fuga) para normalizar os sintomas.', 'Educação', Profession.PSYCHOLOGY, 'BookOpen'),
  createPrompt('psy-6', 'Perguntas Socráticas', 'Investigação.', 'Gere uma lista de 5 perguntas socráticas para desafiar a crença central de "Desamor" de um paciente.', 'TCC', Profession.PSYCHOLOGY, 'MessageCircle'),
  createPrompt('psy-7', 'Plano de Prevenção de Recaída', 'Alta.', 'Estruture um plano de prevenção de recaída para um paciente em tratamento de dependência química. Inclua gatilhos e estratégias de enfrentamento.', 'Planejamento', Profession.PSYCHOLOGY, 'ShieldCheck'),
  createPrompt('psy-8', 'Marketing para Psicólogos', 'Ético.', 'Sugira 3 temas de posts educativos para Instagram que respeitem o código de ética do CRP, focados em saúde mental no trabalho.', 'Marketing', Profession.PSYCHOLOGY, 'Instagram'),

  createPrompt('des-1', 'Gerador de Briefing', 'Cliente.', 'Atue como um Diretor de Arte. Faça uma lista de perguntas essenciais para enviar a um cliente que quer criar uma nova identidade visual para [TIPO DE EMPRESA].', 'Gestão', Profession.DESIGN, 'FileText'),
  createPrompt('des-2', 'Paleta de Cores', 'Inspiração.', 'Gere 3 sugestões de paletas de cores (com códigos Hex) para uma marca de [NICHO] que deseja transmitir [SENSAÇÃO, ex: confiança e modernidade].', 'Cores', Profession.DESIGN, 'Palette'),
  createPrompt('des-3', 'Prompt Midjourney/Dall-E', 'IA Generativa.', 'Escreva um prompt detalhado em inglês para gerar uma imagem realista de [DESCRIÇÃO] com iluminação cinemática, estilo fotorealista, 8k.', 'GenAI', Profession.DESIGN, 'Sparkles'),
  
  createPrompt('sal-1', 'Matriz de Objeções', 'Negociação.', 'Crie uma tabela com as 5 principais objeções na venda de [PRODUTO] e escreva um script de contorno para cada uma.', 'Negociação', Profession.SALES, 'Scale'),
  
  createPrompt('stu-1', 'Resumo para Prova', 'Estudos.', 'Resuma os principais conceitos da Revolução Francesa em tópicos para revisão rápida antes da prova.', 'Resumo', Profession.STUDENT, 'BookOpen'),
  
  createPrompt('nutri-1', 'Plano Alimentar Personalizado', 'Crie dietas baseadas em calorias e restrições.', 'Atue como Nutricionista Esportivo. Crie um plano alimentar de [CALORIAS] kcal para um paciente com objetivo de [OBJETIVO: Hipertrofia/Emagrecimento]. Restrições: [RESTRIÇÕES]. Inclua macros por refeição.', 'Planejamento', Profession.NUTRITION, 'Apple'),
  
  createPrompt('fit-1', 'Treino de Hipertrofia ABC', 'Divisão de treino clássica.', 'Monte um treino de musculação divisão ABC para hipertrofia, focado em [GRUPO MUSCULAR FRACO]. Inclua séries, repetições e tempo de descanso.', 'Treinos', Profession.FITNESS, 'Dumbbell'),
  
  createPrompt('dev-1', 'Explicação de Código', 'Entenda código legado.', 'Explique este código passo a passo: [CÓDIGO].', 'Educação', Profession.DEVELOPER, 'Code2'),
];