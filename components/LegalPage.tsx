import React from 'react';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { APP_NAME } from '../constants';

type Kind = 'privacy' | 'terms';

interface Props {
  kind: Kind;
  onBack: () => void;
}

const Privacy = () => (
  <div className="space-y-5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
    <p><strong>Última atualização:</strong> versão de produto v2. Esta é uma minuta operacional e deve ser revisada juridicamente antes de lançamento público.</p>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">1. Dados que ficam no dispositivo</h2>
      <p>Check-ins, diário, histórico de humor, progresso de trilhas e preferências ficam salvos localmente no seu dispositivo por padrão.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">2. Conversa com IA</h2>
      <p>Quando a conversa com IA estiver ativada e você enviar uma mensagem no chat, o texto da mensagem e um pequeno contexto recente podem ser enviados a um provedor externo de IA para gerar resposta. Você pode desativar isso nos Ajustes.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">3. O que não fazemos</h2>
      <p>Não vendemos conteúdo do seu diário ou conversas. Não usamos suas mensagens para segmentar anúncios sensíveis. Não oferecemos diagnóstico, tratamento médico ou psicoterapia.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">4. Exclusão de dados</h2>
      <p>Você pode apagar seus dados locais em Ajustes → Apagar todos os meus dados. Em futuras versões com conta/sincronização, será necessário oferecer exclusão também no servidor.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">5. Emergência</h2>
      <p>Em risco imediato, procure ajuda humana e serviços de emergência da sua região. No Brasil, CVV 188 e SAMU 192 aparecem como referências no app.</p>
    </section>
  </div>
);

const Terms = () => (
  <div className="space-y-5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
    <p><strong>Última atualização:</strong> versão de produto v2. Esta é uma minuta operacional e deve ser revisada juridicamente antes de lançamento público.</p>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">1. Natureza do serviço</h2>
      <p>O {APP_NAME} oferece apoio emocional, diário, check-ins, exercícios de bem-estar e recursos de autocuidado. O app não substitui psicoterapia, atendimento médico, psiquiátrico ou serviços de emergência.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">2. Uso adequado</h2>
      <p>Use o app para registrar sentimentos, organizar pensamentos e praticar exercícios simples. Não use o app como única fonte de ajuda em crise grave.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">3. Crises e risco imediato</h2>
      <p>Se você estiver em risco, pensando em se machucar ou em perigo imediato, procure uma pessoa real, serviço de emergência ou linha de apoio da sua região.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">4. Planos pagos</h2>
      <p>Recursos Plus podem incluir chat ampliado, trilhas, histórico, áudios e exportações. Em apps nativos, compras digitais devem seguir as regras da Apple App Store e Google Play.</p>
    </section>
    <section>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2">5. Lançamento internacional</h2>
      <p>Contatos de emergência, preços, textos legais e avisos precisam ser adaptados por país. Tradução não é suficiente para lançamento global.</p>
    </section>
  </div>
);

const LegalPage: React.FC<Props> = ({ kind, onBack }) => {
  const isPrivacy = kind === 'privacy';
  const Icon = isPrivacy ? ShieldCheck : FileText;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-emerald-500" />
          <h1 className="font-bold text-slate-900 dark:text-white">{isPrivacy ? 'Política de privacidade' : 'Termos de uso'}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
        {isPrivacy ? <Privacy /> : <Terms />}
      </main>
    </div>
  );
};

export default LegalPage;
