import React from 'react';
import { ArrowLeft, CheckCircle2, Lock, Map } from 'lucide-react';
import { UserSettings, TrailProgress } from '../types';
import { TRAILS, ICON_MAP, getTrailTask } from '../constants';
import AdSlot from './AdSlot';

interface Props {
  onBack: () => void;
  settings: UserSettings;
  progress: TrailProgress[];
  onCompleteDay: (trailId: string, day: number) => void;
  onUpgrade: () => void;
}

const Trails: React.FC<Props> = ({ onBack, settings, progress, onCompleteDay, onUpgrade }) => {
  const getProgress = (trailId: string) => progress.find(p => p.trailId === trailId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="max-w-3xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300"><ArrowLeft /></button>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-xl">Trilhas guiadas</h1>
          <p className="text-xs text-slate-500">Rotinas de 7, 14 e 21 dias, sem cobrança pesada.</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 mt-5 space-y-4">
        {TRAILS.map(trail => {
          const Icon = ICON_MAP[trail.iconName] || Map;
          const locked = trail.isPremium && !settings.isPro;
          const item = getProgress(trail.id);
          const completed = item?.completedDays.length || 0;
          const nextDay = Math.min(completed + 1, trail.days);
          const complete = completed >= trail.days;
          const percent = Math.round((completed / trail.days) * 100);

          return (
            <div key={trail.id} className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 ${locked ? 'opacity-90' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                  {locked ? <Lock className="w-5 h-5 text-slate-400" /> : <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-900 dark:text-white">{trail.title}</h2>
                    {trail.isPremium && <span className="text-[10px] font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-1.5 py-0.5 rounded">PLUS</span>}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{trail.description}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{completed}/{trail.days} dias</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                </div>
              </div>

              {!locked && !complete && (
                <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-4">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold mb-1">Dia {nextDay}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{getTrailTask(trail.id, nextDay)}</p>
                  <button onClick={() => onCompleteDay(trail.id, nextDay)} className="mt-3 bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Marcar dia como feito
                  </button>
                </div>
              )}

              {!locked && complete && (
                <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-4 flex gap-2 text-sm text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>Trilha concluída. Voltar e continuar cuidando de você também conta.</p>
                </div>
              )}

              {locked && (
                <button onClick={onUpgrade} className="mt-4 w-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 text-violet-700 dark:text-violet-200 rounded-2xl py-3 text-sm font-semibold">
                  Desbloquear no Plus
                </button>
              )}
            </div>
          );
        })}

        <AdSlot slotId="trails_bottom" format="banner" settings={settings} onUpgrade={onUpgrade} />
      </div>
    </div>
  );
};

export default Trails;
