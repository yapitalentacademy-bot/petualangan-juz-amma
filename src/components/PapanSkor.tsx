import React from 'react';
import { Star, Award, RotateCcw, Map, Trophy } from 'lucide-react';
import { TombolBesar } from './TombolBesar';

export interface PapanSkorProps {
  score: number;
  maxScore?: number;
  stars: number; // 0 s.d. 3
  accuracy?: number; // 0 s.d. 100
  title?: string;
  subtitle?: string;
  onRestart?: () => void;
  onNext?: () => void;
  onBackToMap?: () => void;
  isTeamMode?: boolean;
  teamScores?: {
    teamA: { name: string; score: number };
    teamB: { name: string; score: number };
  };
}

export const PapanSkor: React.FC<PapanSkorProps> = ({
  score,
  maxScore = 100,
  stars,
  accuracy = 100,
  title = 'Pos Selesai!',
  subtitle = 'Masya Allah! Usaha yang sangat luar biasa!',
  onRestart,
  onNext,
  onBackToMap,
  isTeamMode = false,
  teamScores,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 max-w-4xl mx-auto stone-plaque rounded-3xl border-4 border-emerald-400/60 shadow-2xl">
      {/* Title & Badge */}
      <div className="flex items-center gap-3 text-amber-400 mb-2">
        <Trophy className="w-14 h-14 text-yellow-400 animate-bounce" />
        <h2 className="text-4xl md:text-6xl font-black tracking-wide font-display text-center gold-title-3d">
          {title}
        </h2>
      </div>

      <p className="text-2xl text-emerald-100 font-bold mb-8 text-center max-w-xl">
        {subtitle}
      </p>

      {/* Star Display (1-3 stars with animations) */}
      {!isTeamMode && (
        <div className="flex items-center justify-center gap-6 my-6">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stars;
            return (
              <div
                key={starIndex}
                className={`
                  transition-all duration-500 transform
                  ${isEarned ? 'scale-110 rotate-3' : 'scale-90 opacity-30 grayscale'}
                `}
              >
                <div
                  className={`
                    flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl
                    ${
                      isEarned
                        ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-gold-glow border-4 border-yellow-100 ring-4 ring-amber-400/40'
                        : 'bg-slate-800 border-2 border-slate-700'
                    }
                  `}
                >
                  <Star
                    className={`w-14 h-14 md:w-20 md:h-20 ${
                      isEarned ? 'text-amber-950 fill-amber-950' : 'text-slate-600'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Duel Team Score Display */}
      {isTeamMode && teamScores && (
        <div className="grid grid-cols-2 gap-8 w-full my-6">
          <div className="flex flex-col items-center p-6 rounded-3xl bg-emerald-950/90 border-4 border-emerald-400 shadow-lg">
            <span className="text-2xl font-black text-emerald-300 font-display">{teamScores.teamA.name}</span>
            <span className="text-6xl font-black text-white mt-2 font-display">{teamScores.teamA.score}</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl bg-sky-950/90 border-4 border-sky-400 shadow-lg">
            <span className="text-2xl font-black text-sky-300 font-display">{teamScores.teamB.name}</span>
            <span className="text-6xl font-black text-white mt-2 font-display">{teamScores.teamB.score}</span>
          </div>
        </div>
      )}

      {/* Score and Accuracy metrics */}
      {!isTeamMode && (
        <div className="grid grid-cols-2 gap-6 w-full max-w-md my-6">
          <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-900/90 border-2 border-amber-400/60 shadow-md">
            <span className="text-lg font-black text-amber-300 font-display">Skor Ekspedisi</span>
            <span className="text-4xl font-black text-white mt-1 font-display">
              {score} / {maxScore}
            </span>
          </div>
          <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-900/90 border-2 border-emerald-400/60 shadow-md">
            <span className="text-lg font-black text-emerald-300 font-display">Akurasi</span>
            <span className="text-4xl font-black text-white mt-1 font-display">
              {accuracy}%
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 w-full">
        {onBackToMap && (
          <TombolBesar
            variant="ghost"
            size="normal"
            icon={<Map className="w-8 h-8" />}
            onClick={onBackToMap}
          >
            Peta Surah
          </TombolBesar>
        )}

        {onRestart && (
          <TombolBesar
            variant="desert"
            size="normal"
            icon={<RotateCcw className="w-8 h-8" />}
            onClick={onRestart}
          >
            Ulangi Pos
          </TombolBesar>
        )}

        {onNext && (
          <TombolBesar
            variant="oasis"
            size="large"
            icon={<Award className="w-10 h-10" />}
            onClick={onNext}
          >
            Pos Berikutnya
          </TombolBesar>
        )}
      </div>
    </div>
  );
};
