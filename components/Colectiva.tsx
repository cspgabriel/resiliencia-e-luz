import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { UserSettings } from '../types';
import {
  currentSessionId, isSessionLive, minutesUntilNext,
  joinSession, leaveSession, subscribeParticipantCount,
} from '../services/colectiva';
import { COLECTIVA_SCHEDULE_HOUR, COLECTIVA_DURATION_MIN } from '../constants';
import { trackSafeEvent } from '../services/analytics';

interface Props {
  onBack: () => void;
  settings: UserSettings;
  onCompleted: () => void;
}

const Colectiva: React.FC<Props> = ({ onBack, settings, onCompleted }) => {
  const [live, setLive] = useState(isSessionLive());
  const [minutesLeft, setMinutesLeft] = useState(minutesUntilNext());
  const [count, setCount] = useState(0);
  const [joined, setJoined] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setLive(isSessionLive());
      setMinutesLeft(minutesUntilNext());
    }, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const sid = currentSessionId();
    const unsub = subscribeParticipantCount(sid, setCount);
    return () => unsub();
  }, []);

  // Ciclo 4-7-8
  useEffect(() => {
    if (!joined) return;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 1;
      setSeconds(elapsed);
      const inCycle = elapsed % 19;
      if (inCycle < 4) setPhase('inhale');
      else if (inCycle < 11) setPhase('hold');
      else setPhase('exhale');
      if (elapsed >= COLECTIVA_DURATION_MIN * 60) {
        clearInterval(interval);
        onCompleted();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [joined, onCompleted]);

  const handleJoin = async () => {
    trackSafeEvent('colectiva_join_attempt', { live });
    if (settings.cloudSyncEnabled) await joinSession();
    setJoined(true);
  };

  const handleLeave = async () => {
    if (settings.cloudSyncEnabled) await leaveSession(currentSessionId());
    setJoined(false);
  };

  const orb = phase === 'inhale' ? 'scale-150' : phase === 'hold' ? 'scale-150' : 'scale-75';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 pb-24">
      <header className="max-w-2xl mx-auto px-5 pt-6 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden"><ArrowLeft /></button>
        <h1 className="font-bold text-slate-900 dark:text-white">Calma coletiva</h1>
      </header>

      {!joined ? (
        <div className="max-w-2xl mx-auto px-5 mt-12 text-center">
          <p className="text-7xl mb-3">🌊</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Respirar junto</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Todos os dias às <b>{COLECTIVA_SCHEDULE_HOUR}h</b>, qualquer pessoa do app pode respirar junta por <b>{COLECTIVA_DURATION_MIN} minutos</b>. Sem câmera, sem áudio. Só uma sensação de companhia.
          </p>

          <div className="mt-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-sm mx-auto">
            <p className="text-xs text-slate-500 uppercase tracking-wider">{live ? 'Acontecendo agora' : 'Próxima sessão'}</p>
            {live ? (
              <p className="text-3xl font-bold text-emerald-600 mt-1">Ao vivo</p>
            ) : (
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">em {minutesLeft} min</p>
            )}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Users className="w-4 h-4" /> {count} {count === 1 ? 'pessoa pronta' : 'pessoas prontas'}
            </div>
            <button onClick={handleJoin} className="mt-6 w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold">
              {live ? 'Entrar agora' : 'Praticar mesmo assim'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-5 mt-16">
          <p className="text-sm text-slate-500">{count} pessoas respirando juntas 🌊</p>
          <div className="relative mt-8 w-48 h-48 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-sky-300 to-emerald-300 dark:from-sky-700 dark:to-emerald-700 transition-transform duration-[3000ms] ease-in-out ${orb}`} />
            <p className="relative text-white font-bold text-xl">
              {phase === 'inhale' ? 'Inspire' : phase === 'hold' ? 'Segure' : 'Expire'}
            </p>
          </div>
          <p className="mt-8 text-sm text-slate-600 dark:text-slate-300">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} / {COLECTIVA_DURATION_MIN}:00</p>
          <button onClick={handleLeave} className="mt-8 px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm">Sair da prática</button>
        </div>
      )}
    </div>
  );
};

export default Colectiva;
