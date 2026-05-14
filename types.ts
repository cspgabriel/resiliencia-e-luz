
export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  profession: string; 
  isPremium: boolean;
  iconName: string;
  isCustom?: boolean; 
  isPublic?: boolean; 
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserSettings {
  apiKey: string;
  openaiKey?: string;
  anthropicKey?: string;
  activeProvider: 'google' | 'openai' | 'anthropic';
  isPro: boolean;
  tokensUsed: number;
  maxFreeTokens: number;
  theme: 'light' | 'dark';
}

export enum Profession {
  ALL = 'Todas',
  CUSTOM = 'Meus Prompts',
  MARKETING = 'Marketing',
  DEVELOPER = 'Desenvolvedor',
  WRITER = 'Escritor',
  DESIGN = 'Designer',
  BUSINESS = 'Negócios',
  HR = 'RH & Gestão',
  SALES = 'Vendas',
  REAL_ESTATE = 'Corretor de Imóveis',
  LAW = 'Advogado',
  NUTRITION = 'Nutricionista',
  MEDICAL = 'Médico',
  DENTIST = 'Dentista',
  FITNESS = 'Personal Trainer',
  PSYCHOLOGY = 'Psicólogo',
  EDUCATION = 'Professor',
  STUDENT = 'Estudante',
}

export enum GroupByMode {
  PROFESSION = 'PROFESSION',
  CATEGORY = 'CATEGORY'
}

export enum ViewState {
  LANDING = 'LANDING',
  HOME = 'HOME',
  LIBRARY = 'LIBRARY',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
  CREATE_PROMPT = 'CREATE_PROMPT',
  HELPER_BOT = 'HELPER_BOT',
  DOWNLOAD = 'DOWNLOAD',
  PROFESSIONS = 'PROFESSIONS',
}

export interface ModelConfig {
  modelName: string;
  useThinking: boolean;
  thinkingBudget: number;
  systemInstruction?: string;
}
