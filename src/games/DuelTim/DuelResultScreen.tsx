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
  teamAName = 'Tim Zamrud',
  teamBName = 'Tim Emas',
  onRestart,
  onExit,
}) => {
  useEffect(() => {
    sfx.playVictory();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0E4D34', '#1B6B47', '#C9A04A', '#F3D88A', '#9C7A2E'],
      });
    } catch {
      // ignore
    }
  }, []);

  const isDraw = scoreA === scoreB;
  const winner = scoreA > scoreB ? teamAName : teamBName;

  return (
    <div className="relative flex flex-col items-center justify-center p-8 md:p-12 max-w-4xl mx-auto rounded-[36px] border-2 border-[#C9A04A] shadow-2xl my-6 font-['Montserrat'] overflow-hidden text-[#FFFDF6]">
      {/* Background Sunset Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src="/scenes/sunset-hasil.webp"
          alt="Sunset Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E4D34] via-[#0E4D34]/85 to-black/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Title */}
        <div className="flex items-center gap-3 text-[#F3D88A] mb-2">
          <LenteraFanus size={44} menyala={true} />
          <h2 className="text-4xl md:text-5xl font-black font-['Marcellus'] tracking-tight text-center text-white">
            Ronde Duel Selesai!
          </h2>
        </div>

        {/* Appreciative Message */}
        <p className="text-lg md:text-xl text-[#F8F4EA]/90 font-medium mb-6 text-center max-w-2xl leading-relaxed">
          {isDraw
            ? 'Masya Allah! Kedua tim sama-sama hebat, kompak, dan bersemangat!'
            : `Selamat kepada ${winner}! Usaha dan hafalan kedua kafilah sangat luar biasa!`}
        </p>

        {/* Teams Scoreboard Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-4">
          {/* Team A Card (Tim Zamrud) */}
          <div
            className={`
              flex flex-col items-center p-6 rounded-[28px] border-2 transition-all shadow-xl bg-[#0E4D34]
              ${
                scoreA >= scoreB
                  ? 'border-[#F3D88A] ring-4 ring-[#F3D88A]/30'
                  : 'border-[#3A9D6A]/50 opacity-90'
              }
            `}
          >
            <div className="flex items-center gap-2 text-[#F3D88A] mb-1">
              <Users className="w-5 h-5" />
              <h3 className="text-xl font-bold font-['Montserrat'] uppercase tracking-wider">{teamAName}</h3>
            </div>

            <span className="text-6xl md:text-7xl font-black text-gradien-emas my-2 font-['Marcellus']">
              {scoreA}
            </span>
            <span className="text-sm font-semibold text-[#F8F4EA]/70">Poin Terkumpul</span>

            {scoreA >= scoreB && (
              <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
                <BintangDelapan size={16} fill="#0E4D34" />
                <span>{isDraw ? 'Seri Bersama' : 'Mahkota Juara'}</span>
              </div>
            )}
          </div>

          {/* Team B Card (Tim Emas) */}
          <div
            className={`
              flex flex-col items-center p-6 rounded-[28px] border-2 transition-all shadow-xl bg-gradient-to-br from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] text-[#0E4D34]
              ${
                scoreB >= scoreA
                  ? 'border-white ring-4 ring-white/40'
                  : 'border-[#FFF2C6]/60 opacity-90'
              }
            `}
          >
            <div className="flex items-center gap-2 text-[#0E4D34] mb-1">
              <Users className="w-5 h-5" />
              <h3 className="text-xl font-bold font-['Montserrat'] uppercase tracking-wider">{teamBName}</h3>
            </div>

            <span className="text-6xl md:text-7xl font-black text-[#0E4D34] my-2 font-['Marcellus']">
              {scoreB}
            </span>
            <span className="text-sm font-bold text-[#0E4D34]/80">Poin Terkumpul</span>

            {scoreB >= scoreA && (
              <div className="mt-4 flex items-center gap-2 bg-[#0E4D34] text-[#F3D88A] px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
                <BintangDelapan size={16} fill="#F3D88A" />
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
            icon={<RotateCcw className="w-6 h-6 text-[#0E4D34]" />}
            onClick={onRestart}
          >
            Tanding Ulang
          </TombolBesar>

          <TombolBesar
            variant="ghost"
            size="normal"
            icon={<Map className="w-6 h-6" />}
            onClick={onExit}
          >
            Kembali ke Peta
          </TombolBesar>
        </div>
      </div>
    </div>
  );
};
