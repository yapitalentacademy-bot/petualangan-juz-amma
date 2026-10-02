import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Map, Users } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';
import { sfx } from '../../lib/audioPlayer';
import { BintangDelapan } from '../../components/ornaments/BintangDelapan';
import { LenteraFanus } from '../../components/ornaments/LenteraFanus';

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
  teamAName = 'Tim Zamrud (Hijau)',
  teamBName = 'Tim Biru Laut',
  onRestart,
  onExit,
}) => {
  useEffect(() => {
    sfx.playVictory();
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F7A5C', '#1E6F8C', '#D4A23A', '#E8D2A6', '#C0603A'],
      });
    } catch {
      // ignore
    }
  }, []);

  const isDraw = scoreA === scoreB;
  const winner = scoreA > scoreB ? teamAName : teamBName;

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 max-w-4xl mx-auto bg-[var(--gading)] rounded-[32px] border-2 border-[var(--emas)] shadow-2xl my-6 font-['Nunito']">
      {/* Title */}
      <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-2">
        <LenteraFanus size={48} menyala={true} />
        <h2 className="text-4xl md:text-5xl font-black font-['Baloo_2'] tracking-tight text-center">
          Ronde Duel Selesai!
        </h2>
      </div>

      {/* Appreciative Message */}
      <p className="text-xl md:text-2xl text-[var(--malam)] font-bold mb-6 text-center max-w-2xl leading-relaxed">
        {isDraw
          ? 'Masya Allah! Kedua tim sama-sama hebat, kompak, dan bersemangat!'
          : `Selamat kepada ${winner}! Usaha dan hafalan kedua kafilah sangat luar biasa!`}
      </p>

      {/* Teams Scoreboard Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-4">
        {/* Team A Card */}
        <div
          className={`
            flex flex-col items-center p-6 rounded-[28px] border-2 transition-all shadow-md
            ${
              scoreA >= scoreB
                ? 'bg-[var(--pasir-terang)] border-[var(--zamrud)] ring-4 ring-[var(--zamrud)]/20'
                : 'bg-[var(--pasir-terang)]/60 border-[var(--pasir)]'
            }
          `}
        >
          <div className="flex items-center gap-2 text-[var(--zamrud-tua)] mb-1">
            <Users className="w-6 h-6" />
            <h3 className="text-2xl font-black font-['Baloo_2']">{teamAName}</h3>
          </div>

          <span className="text-6xl md:text-7xl font-black text-[var(--zamrud-tua)] my-3 font-['Baloo_2']">
            {scoreA}
          </span>
          <span className="text-base font-bold text-[var(--malam)]/70">Poin Terkumpul</span>

          {scoreA >= scoreB && (
            <div className="mt-4 flex items-center gap-2 bg-[var(--zamrud)] text-[var(--gading)] px-4 py-1 rounded-full font-black text-sm shadow-sm">
              <BintangDelapan size={18} fill="#D4A23A" />
              <span>{isDraw ? 'Seri Bersama' : 'Mahkota Juara'}</span>
            </div>
          )}
        </div>

        {/* Team B Card */}
        <div
          className={`
            flex flex-col items-center p-6 rounded-[28px] border-2 transition-all shadow-md
            ${
              scoreB >= scoreA
                ? 'bg-[var(--pasir-terang)] border-[var(--biru-laut)] ring-4 ring-[var(--biru-laut)]/20'
                : 'bg-[var(--pasir-terang)]/60 border-[var(--pasir)]'
            }
          `}
        >
          <div className="flex items-center gap-2 text-[var(--biru-laut)] mb-1">
            <Users className="w-6 h-6" />
            <h3 className="text-2xl font-black font-['Baloo_2']">{teamBName}</h3>
          </div>

          <span className="text-6xl md:text-7xl font-black text-[var(--biru-laut)] my-3 font-['Baloo_2']">
            {scoreB}
          </span>
          <span className="text-base font-bold text-[var(--malam)]/70">Poin Terkumpul</span>

          {scoreB >= scoreA && (
            <div className="mt-4 flex items-center gap-2 bg-[var(--biru-laut)] text-[var(--gading)] px-4 py-1 rounded-full font-black text-sm shadow-sm">
              <BintangDelapan size={18} fill="#D4A23A" />
              <span>{isDraw ? 'Seri Bersama' : 'Mahkota Juara'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <TombolBesar
          variant="emas"
          size="normal"
          icon={<RotateCcw className="w-6 h-6" />}
          onClick={onRestart}
        >
          Tanding Ulang
        </TombolBesar>

        <TombolBesar
          variant="zamrud"
          size="normal"
          icon={<Map className="w-6 h-6" />}
          onClick={onExit}
        >
          Kembali ke Peta
        </TombolBesar>
      </div>
    </div>
  );
};
