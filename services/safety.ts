// Camada de segurança clínica
// Detecta sinais de crise (ideação suicida, auto-lesão) ANTES de chamar IA

import { CRISIS_TERMS_URGENT, CRISIS_TERMS_CONCERN } from '../constants';
import { CrisisCheck } from '../types';

const normalize = (text: string): string =>
  text.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const checkCrisis = (text: string): CrisisCheck => {
  if (!text || text.length < 3) return { isCrisis: false, severity: 'none' };
  const normalized = normalize(text);

  const urgentHits = CRISIS_TERMS_URGENT
    .map(t => normalize(t))
    .filter(term => normalized.includes(term));

  if (urgentHits.length > 0) {
    return { isCrisis: true, severity: 'urgent', matchedTerms: urgentHits };
  }

  const concernHits = CRISIS_TERMS_CONCERN
    .map(t => normalize(t))
    .filter(term => normalized.includes(term));

  if (concernHits.length >= 2) {
    return { isCrisis: true, severity: 'concern', matchedTerms: concernHits };
  }

  if (concernHits.length === 1) {
    return { isCrisis: false, severity: 'concern', matchedTerms: concernHits };
  }

  return { isCrisis: false, severity: 'none' };
};

// Filtra pedidos fora do escopo de bem-estar
const OFF_TOPIC_PATTERNS = [
  /escreva (um|uma) (c[oó]digo|fun[cç][aã]o|script)/i,
  /me ajuda com (python|javascript|react|sql)/i,
  /(escreva|crie|gere) (um|uma)? ?(post|artigo|email|copy) (de|para) (marketing|vendas)/i,
  /resolva (esta|essa|este|esse) (quest[aã]o|prova|exerc[ií]cio) de (matem[aá]tica|f[ií]sica|qu[ií]mica)/i,
  /receita (de|para) (bolo|culin[aá]ria|comida)/i,
  /(presidente|eleic[aã]o|pol[ií]tica|bolsonaro|lula)/i,
];

export const isOffTopic = (text: string): boolean =>
  OFF_TOPIC_PATTERNS.some(pat => pat.test(text));

export const OFF_TOPIC_RESPONSE =
  "Eu cuido só de bem-estar emocional aqui. Quer conversar sobre como você tá se sentindo hoje, ou tentar um exercício do app?";
