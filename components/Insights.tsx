import React, { useMemo } from 'react';
import { ArrowLeft, BarChart3, BookOpen, Moon, Sparkles, Wind } from 'lucide-react';
import { CheckIn, DiaryEntry, ExerciseLog, MOOD_META, UserSettings } from '../types';
import AdSlot from './AdSlot';

interface Props {
  onBack: () => void;
  checkins: CheckIn[];
  diary: DiaryEntry[];
  exerciseLog: ExerciseLog[];
  settings: UserSettings;
}

const average = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

const Insights: React.FC<Props> = ({ onBack, checkins, diary, exerciseLog, settings }) => {
  const last7 = checkins.slice(0, 7);
  const last30 = checkins.slice(0, 30);

  const moodAvg = average(last7.map(c => MOOD_META[c.mood].score));
  const sleepAvg = average(last7.map(c => c.sleep));
  const energyAvg = average(last7.map(c => c.energy));

  const topTriggers = useMemo(() => {
    const counts = new Map<string, number>();
    last30.forEach(c => {
      (c.triggerTags || []).forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1));
      if (c.trigger) counts.set(c.trigger, (counts.get(c.trigger) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [last30]);

  const mostUsedExercise = useMemo(() => {
    const counts = new Map<string, number>();
    exerciseLog.slice(0, 30).forEach(e => counts.set(e.title, (counts.get(e.title) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
  }, [exerciseLog]);

  const empty = checkins.length < 2;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-3xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-xl">Insights</h1>
          <p className="text-xs text-slate-500">Padrões de autocuidado, sem diagnóstico.</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 mt-5 space-y-4">
        {empty && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <BarChart3 className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
            <p className="font-semibold text-slate-900 dark:text-white">Ainda não há dados suficientes</p>
            <p className="text-sm text-slate-500 mt-1">Com 2 ou mais check-ins, o app começa a mostrar padrões simples.</p>
          </div>
        )}

        {!empty && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="text-xs text-slate-500">Humor médio</p>
                <p className="font-bold text-slate-900 dark:text-white">{moodAvg.toFixed(1)}/5</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <Moon className="w-5 h-5 text-sky-500 mb-2" />
                <p className="text-xs text-slate-500">Sono médio</p>
                <p className="font-bold text-slate-900 dark:text-white">{sleepAvg.toFixed(1)}h</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <Wind className="w-5 h-5 text-violet-500 mb-2" />
                <p className="text-xs text-slate-500">Energia</p>
                <p className="font-bold text-slate-900 dark:text-white">{energyAvg.toFixed(1)}/5</p>
              </div>
            </div>

            <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2">Leitura gentil da semana</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {sleepAvg < 6
                  ? 'Seu sono ficou baixo nos últimos check-ins. Pode valer testar um ritual noturno simples esta semana.'
                  : moodAvg <= 2.5
                    ? 'Sua média de humor ficou mais baixa. Sem se julgar, escolha um cuidado pequeno por dia e considere falar com alguém de confiança.'
                    : 'Você manteve alguns registros importantes. Continue observando o que ajuda e o que pesa no seu dia.'}
              </p>
              <p className="text-xs text-slate-400 mt-3">Isso não é diagnóstico nem avaliação clínica; é só um resumo dos registros que você fez.</p>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Gatilhos mais marcados</h2>
              {topTriggers.length === 0 ? (
                <p className="text-sm text-slate-500">Você ainda não marcou gatilhos nos check-ins.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {topTriggers.map(([tag, count]) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200">
                      {tag} · {count}x
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Seu uso recente</h2>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-500" /> {diary.length} entradas no diário</p>
                <p className="flex items-center gap-2"><Wind className="w-4 h-4 text-emerald-500" /> {exerciseLog.length} exercícios concluídos</p>
                {mostUsedExercise && <p>Exercício mais usado: <strong>{mostUsedExercise[0]}</strong> ({mostUsedExercise[1]}x)</p>}
              </div>
            </section>
            <AdSlot slotId="insights_bottom" format="banner" settings={settings} />
          </>
        )}
      </div>
    </div>
  );
};

export default Insights;
