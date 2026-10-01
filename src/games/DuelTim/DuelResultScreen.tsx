import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Map, Users } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';
import { sfx } from '../../lib/audioPlayer';

interface DuelResultScreenProps {
  scoreA: number;
  scoreB: number;
  teamAName?: string;
  teamBName?: string;
  onRestart: () => void;
  onExit: () => void;
}

export const DuelResultScreen: React.FC<DuelResultScreenProps> = ({
  scoreA,
  scoreB,
  teamAName = 'Tim Hijau',
  teamBName = 'Tim Biru',
  onRestart,
  onExit,
}) => {
  useEffect(() => {
    sfx.playVictory();
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
  }, []);

  const isDraw = scoreA === scoreB;
  const winner = scoreA > scoreB ? teamAName : teamBName;

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 max-w-5xl mx-auto glass-panel rounded-3xl border-4 border-amber-500/50 shadow-2xl my-6">
      {/* Title */}
      <div className="flex items-center gap-4 text-amber-400 mb-2">
        <Trophy className="w-14 h-14" />
        <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight text-center">
          Ronde Duel Selesai!
        </h2>
      </div>

      {/* Appreciative Message */}
      <p className="text-2xl md:text-3xl text-stone-200 font-bold mb-8 text-center max-w-2xl leading-relaxed">
        {isDraw
          ? 'Masya Allah! Kedua tim sama-sama hebat dan kompak!'
          : `Selamat kepada ${winner}! Usaha dan hafalan kedua tim sangat luar biasa!`}
      </p>

      {/* Teams Scoreboard Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full my-6">
        {/* Team A Card */}
        <div
          className={`
            flex flex-col items-center p-8 rounded-3xl border-4 transition-all
            ${
              scoreA >= scoreB
                ? 'bg-emerald-950/90 border-emerald-400 shadow-card-glow ring-4 ring-emerald-500/40'
                : 'bg-emerald-950/60 border-emerald-600/70'
            }
          `}
        >
          <div className="flex items-center gap-3 text-emerald-300 mb-2">
            <Users className="w-8 h-8" />
            <h3 className="text-3xl font-black">{teamAName}</h3>
          </div>

          <span className="text-7xl md:text-8xl font-black text-white my-4 font-mono">
            {scoreA}
          </span>
          <span className="text-xl font-bold text-emerald-300">Poin Terkumpul</span>

          {scoreA >= scoreB && (
            <div className="mt-4 flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-full font-black text-lg">
              <Award className="w-6 h-6" />
              <span>{isDraw ? 'Seri Bersama' : 'Juara Ronde'}</span>
            </div>
          )}
        </div>

        {/* Team B Card */}
        <div
          className={`
            flex flex-col items-center p-8 rounded-3xl border-4 transition-all
            ${
              scoreB >= scoreA
                ? 'bg-sky-950/90 border-sky-400 shadow-card-glow ring-4 ring-sky-500/40'
                : 'bg-sky-950/60 border-sky-600/70'
            }
          `}
        >
          <div className="flex items-center gap-3 text-sky-300 mb-2">
            <Users className="w-8 h-8" />
            <h3 className="text-3xl font-black">{teamBName}</h3>
          </div>

          <span className="text-7xl md:text-8xl font-black text-white my-4 font-mono">
            {scoreB}
          </span>
          <span className="text-xl font-bold text-sky-300">Poin Terkumpul</span>

          {scoreB >= scoreA && (
            <div className="mt-4 flex items-center gap-2 bg-sky-500 text-slate-950 px-4 py-1.5 rounded-full font-black text-lg">
              <Award className="w-6 h-6" />
              <span>{isDraw ? 'Seri Bersama' : 'Juara Ronde'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 w-full">
        <TombolBesar
          variant="ghost"
          size="normal"
          icon={<Map className="w-8 h-8" />}
          onClick={onExit}
        >
          Kembali ke Pos
        </TombolBesar>

        <TombolBesar
          variant="desert"
          size="large"
          icon={<RotateCcw className="w-8 h-8" />}
          onClick={onRestart}
        >
          Duel Lagi (Ronde Baru)
        </TombolBesar>
      </div>
    </div>
  );
};
