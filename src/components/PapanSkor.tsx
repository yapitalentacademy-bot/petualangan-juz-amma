import React from 'react';
import { RotateCcw, Map, Award } from 'lucide-react';
import { TombolBesar } from './TombolBesar';
import { PlakatEmas } from './PlakatEmas';
import { BintangDelapan } from './ornaments/BintangDelapan';
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

/**
 * PapanSkor Bergaya Proposal Mewah Tahfiz Camp:
 * - Meniru halaman penutup PDF dengan visual matahari terbenam pegunungan dan gradien zamrud tua di bawah.
 * - Judul putih/emas Marcellus, PlakatEmas untuk bintang, skor, dan akurasi.
 */
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
    <div className="relative flex flex-col items-center justify-center p-8 md:p-12 max-w-4xl mx-auto rounded-[36px] border-2 border-[var(--emas)] shadow-2xl overflow-hidden text-[#FFFDF6]">
      {/* Background Sunset Painting with Deep Emerald Base Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/scenes/sunset-hasil.webp"
          alt="Sunset Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E4D34] via-[#0E4D34]/85 to-black/35" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Judul Utama Marcellus */}
        <h2 className="text-4xl md:text-6xl font-black font-['Marcellus'] text-white text-center mb-1 drop-shadow-md tracking-wide">
          {title}
        </h2>
        <span className="text-xl md:text-2xl font-bold text-gradien-emas font-['Montserrat'] mb-4 text-center">
          PETUALANGAN JUZ 'AMMA
        </span>

        <p className="text-base md:text-lg text-[#F8F4EA]/90 font-['Montserrat'] font-medium mb-6 text-center max-w-lg">
          {subtitle}
        </p>

        {/* Tampilan Bintang Delapan */}
        {!isTeamMode && (
          <div className="flex items-center justify-center gap-6 my-2">
            {[1, 2, 3].map((starIndex) => {
              const isEarned = starIndex <= stars;
              return (
                <div
                  key={starIndex}
                  className={`
                    transition-all duration-300 transform
                    ${isEarned ? 'scale-110 drop-shadow-lg' : 'opacity-30 grayscale'}
                  `}
                >
                  <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-[22px] bg-gradient-to-b from-[#FFFDF6]/20 to-[#0E4D34]/80 border-2 border-[var(--emas)]/80 shadow-md">
                    <BintangDelapan filled={isEarned} size={54} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Duel Team Score Display */}
        {isTeamMode && teamScores && (
          <div className="grid grid-cols-2 gap-6 w-full my-6">
            {/* Tim Zamrud */}
            <div className="flex flex-col items-center p-6 rounded-[28px] bg-[#0E4D34] border-2 border-[var(--emas)] shadow-xl">
              <span className="text-xl font-bold text-[#F3D88A] font-['Montserrat'] uppercase tracking-wider">
                {teamScores.teamA.name}
              </span>
              <span className="text-5xl md:text-6xl font-black text-gradien-emas mt-2 font-['Marcellus']">
                {teamScores.teamA.score}
              </span>
            </div>
            {/* Tim Emas */}
            <div className="flex flex-col items-center p-6 rounded-[28px] bg-gradient-to-br from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] border-2 border-[#FFF2C6] shadow-xl text-[#0E4D34]">
              <span className="text-xl font-bold text-[#0E4D34] font-['Montserrat'] uppercase tracking-wider">
                {teamScores.teamB.name}
              </span>
              <span className="text-5xl md:text-6xl font-black text-[#0E4D34] mt-2 font-['Marcellus']">
                {teamScores.teamB.score}
              </span>
            </div>
          </div>
        )}

        {/* Panel Skor & Akurasi (PlakatEmas Style) */}
        {!isTeamMode && (
          <div className="flex flex-wrap items-center justify-center gap-6 my-6 w-full">
            <PlakatEmas
              label="Poin Nilai"
              value={score}
              subValue={`Target ${maxScore}`}
              size="normal"
            />
            <PlakatEmas
              label="Akurasi Jawaban"
              value={`${accuracy}%`}
              subValue="Tingkat Ketepatan"
              size="normal"
            />
          </div>
        )}

        {/* Maskot Nur */}
        <div className="flex items-center gap-3 my-4 bg-[#0E4D34]/90 px-6 py-3 rounded-full border border-[var(--emas)]/60 shadow-md">
          <MaskotNur size={36} expression="happy" />
          <span className="font-['Montserrat'] font-bold text-[#F8F4EA] text-sm md:text-base">
            {stars >= 3
              ? 'Alhamdulillah, sempurna! Hafalanmu sangat mantap!'
              : stars >= 1
              ? 'Masya Allah, lentera pos ini menyala dengan terang!'
              : 'Terus semangat mencoba, insya Allah pasti bisa!'}
          </span>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 w-full">
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
              variant="emas"
              size="normal"
              icon={<Award className="w-7 h-7 text-[#0E4D34]" />}
              onClick={onNext}
            >
              Pos Berikutnya
            </TombolBesar>
          )}
        </div>
      </div>
    </div>
  );
};
