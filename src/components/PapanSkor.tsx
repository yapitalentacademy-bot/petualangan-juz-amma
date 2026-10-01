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
    <div className="flex flex-col items-center justify-center p-8 md:p-12 max-w-4xl mx-auto glass-panel rounded-3xl border-4 border-amber-500/40 shadow-2xl">
      {/* Title & Badge */}
      <div className="flex items-center gap-3 text-amber-400 mb-2">
        <Trophy className="w-12 h-12" />
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide font-display text-center">
          {title}
        </h2>
      </div>

      <p className="text-2xl text-stone-300 font-medium mb-8 text-center max-w-xl">
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
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-gold-glow border-4 border-yellow-200'
                        : 'bg-stone-800 border-2 border-stone-700'
                    }
                  `}
                >
                  <Star
                    className={`w-14 h-14 md:w-20 md:h-20 ${
                      isEarned ? 'text-amber-950 fill-amber-950' : 'text-stone-600'
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
          <div className="flex flex-col items-center p-6 rounded-3xl bg-emerald-950/80 border-4 border-emerald-500 shadow-lg">
            <span className="text-2xl font-bold text-emerald-300">{teamScores.teamA.name}</span>
            <span className="text-6xl font-black text-white mt-2">{teamScores.teamA.score}</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl bg-sky-950/80 border-4 border-sky-500 shadow-lg">
            <span className="text-2xl font-bold text-sky-300">{teamScores.teamB.name}</span>
            <span className="text-6xl font-black text-white mt-2">{teamScores.teamB.score}</span>
          </div>
        </div>
      )}

      {/* Score and Accuracy metrics */}
      {!isTeamMode && (
        <div className="grid grid-cols-2 gap-6 w-full max-w-md my-6">
          <div className="flex flex-col items-center p-5 rounded-2xl bg-stone-900/80 border border-stone-700">
            <span className="text-lg font-bold text-amber-300">Skor Akhir</span>
            <span className="text-4xl font-extrabold text-white mt-1">
              {score} / {maxScore}
            </span>
          </div>
          <div className="flex flex-col items-center p-5 rounded-2xl bg-stone-900/80 border border-stone-700">
            <span className="text-lg font-bold text-emerald-300">Akurasi</span>
            <span className="text-4xl font-extrabold text-white mt-1">
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
