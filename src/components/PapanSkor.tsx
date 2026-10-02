import React from 'react';
import { RotateCcw, Map, Award } from 'lucide-react';
import { TombolBesar } from './TombolBesar';
import { BintangDelapan } from './ornaments/BintangDelapan';
import { LenteraFanus } from './ornaments/LenteraFanus';
import { MaskotNur } from './ornaments/MaskotNur';

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
  title = 'Pos Tuntas!',
  subtitle = 'Masya Allah! Usaha dan hafalan yang sangat luar biasa!',
  onRestart,
  onNext,
  onBackToMap,
  isTeamMode = false,
  teamScores,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 max-w-3xl mx-auto bg-[#FFFDF7] rounded-[28px] border-4 border-[#D4A23A] shadow-2xl text-[#14233C] relative overflow-hidden">
      {/* Ornamen Lentera di Atas */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <LenteraFanus isLit={stars >= 1} size={54} />
      </div>

      {/* Judul & Subtitle Baloo 2 */}
      <h2 className="text-3xl md:text-5xl font-black font-judul text-[#0B4F3E] text-center mb-2 tracking-wide">
        {title}
      </h2>

      <p className="text-lg md:text-xl text-[#14233C]/85 font-teks font-bold mb-6 text-center max-w-lg">
        {subtitle}
      </p>

      {/* Tampilan Bintang Delapan (Khatam) */}
      {!isTeamMode && (
        <div className="flex items-center justify-center gap-6 my-4">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stars;
            return (
              <div
                key={starIndex}
                className={`
                  transition-all duration-300 transform
                  ${isEarned ? 'scale-110 drop-shadow-md' : 'opacity-35 grayscale'}
                `}
              >
                <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#F6EBD9] border-2 border-[#E8D2A6] shadow-sm">
                  <BintangDelapan filled={isEarned} size={56} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Duel Team Score Display */}
      {isTeamMode && teamScores && (
        <div className="grid grid-cols-2 gap-6 w-full my-6">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-[#F0FAF6] border-3 border-[#0F7A5C] shadow-sm">
            <span className="text-xl font-black text-[#0F7A5C] font-judul">{teamScores.teamA.name}</span>
            <span className="text-5xl font-black text-[#0B4F3E] mt-2 font-judul">{teamScores.teamA.score}</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-[#F0F8FA] border-3 border-[#1E6F8C] shadow-sm">
            <span className="text-xl font-black text-[#1E6F8C] font-judul">{teamScores.teamB.name}</span>
            <span className="text-5xl font-black text-[#134B5F] mt-2 font-judul">{teamScores.teamB.score}</span>
          </div>
        </div>
      )}

      {/* Panel Skor & Akurasi (Gulungan Gading & Zamrud) */}
      {!isTeamMode && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md my-4">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[#F6EBD9] border-2 border-[#E8D2A6]">
            <span className="text-base font-bold text-[#0B4F3E] font-teks">Poin Nilai</span>
            <span className="text-3xl md:text-4xl font-black text-[#14233C] mt-1 font-judul">
              {score} <span className="text-xl text-[var(--malam)]/60 font-normal">/ {maxScore}</span>
            </span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[#F6EBD9] border-2 border-[#E8D2A6]">
            <span className="text-base font-bold text-[#0F7A5C] font-teks">Akurasi Jawaban</span>
            <span className="text-3xl md:text-4xl font-black text-[#0F7A5C] mt-1 font-judul">
              {accuracy}%
            </span>
          </div>
        </div>
      )}

      {/* Maskot Nur yang Memberi Motivasi */}
      <div className="flex items-center gap-3 mt-4 mb-6 bg-[#F6EBD9]/80 px-5 py-2.5 rounded-full border border-[#E8D2A6]">
        <MaskotNur size={42} expression="happy" />
        <span className="font-teks font-bold text-[#0B4F3E] text-base md:text-lg">
          {stars >= 3
            ? 'Alhamdulillah, sempurna! Hafalanmu sangat mantap!'
            : stars >= 1
            ? 'Masya Allah, lentera pos ini menyala dengan terang!'
            : 'Terus semangat mencoba, insya Allah pasti bisa!'}
        </span>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2 w-full">
        {onBackToMap && (
          <TombolBesar
            variant="ghost"
            size="normal"
            icon={<Map className="w-6 h-6" />}
            onClick={onBackToMap}
          >
            Peta Surah
          </TombolBesar>
        )}

        {onRestart && (
          <TombolBesar
            variant="terakota"
            size="normal"
            icon={<RotateCcw className="w-6 h-6" />}
            onClick={onRestart}
          >
            Ulangi Pos
          </TombolBesar>
        )}

        {onNext && (
          <TombolBesar
            variant="zamrud"
            size="normal"
            icon={<Award className="w-7 h-7" />}
            onClick={onNext}
          >
            Pos Berikutnya
          </TombolBesar>
        )}
      </div>
    </div>
  );
};

