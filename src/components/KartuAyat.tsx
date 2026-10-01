import React from 'react';
import { Ayat } from '../types/surah';
import { PemutarAudio } from './PemutarAudio';
import { quranAudio } from '../lib/audioPlayer';

export interface KartuAyatProps {
  ayat: Ayat;
  surahNumber: number;
  showLatin?: boolean;
  showTerjemah?: boolean;
  selected?: boolean;
  status?: 'default' | 'correct' | 'wrong';
  onClick?: () => void;
  audioOnClick?: boolean;
  highlightWords?: number[];
  className?: string;
}

export const KartuAyat: React.FC<KartuAyatProps> = ({
  ayat,
  surahNumber,
  showLatin = true,
  showTerjemah = true,
  selected = false,
  status = 'default',
  onClick,
  audioOnClick = false,
  highlightWords = [],
  className = '',
}) => {
  const cleanQuotes = (text: string) => text.replace(/^["'\s]+|["'\s]+$/g, '');

  const handleClick = () => {
    if (audioOnClick) {
      quranAudio.playAyat(surahNumber, ayat.nomor);
    }
    if (onClick) {
      onClick();
    }
  };

  const statusStyles = {
    default: selected
      ? 'border-emerald-400 bg-emerald-950/90 ring-4 ring-emerald-400/80 shadow-card-glow'
      : 'border-emerald-500/40 bg-slate-900/90 hover:border-amber-400/80 shadow-xl',
    correct: 'border-emerald-400 bg-emerald-950/95 ring-4 ring-emerald-300 shadow-card-glow',
    wrong: 'border-rose-500 bg-rose-950/95 ring-4 ring-rose-400 animate-shake',
  };

  return (
    <div
      onClick={handleClick}
      className={`
        touch-btn relative flex flex-col p-8 md:p-10 rounded-3xl border-3
        transition-all duration-150 backdrop-blur-md cursor-pointer select-none
        ${statusStyles[status]}
        ${className}
      `}
    >
      {/* Top row: Ayat Number Badge + Audio Play Button */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-700/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-2xl shadow-md border border-amber-200">
            {ayat.nomor}
          </div>
          <span className="text-xl font-black text-amber-200">
            Ayat ke-{ayat.nomor}
          </span>
        </div>

        <PemutarAudio
          surahNumber={surahNumber}
          ayatNumber={ayat.nomor}
          size="normal"
          showLabel={false}
        />
      </div>

      {/* Arabic Verse Container (RTL) */}
      <div
        dir="rtl"
        className="font-quran text-amber-100 text-tv-arabic tracking-wide leading-loose py-4 text-right"
      >
        {ayat.kata && ayat.kata.length > 0 ? (
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-start items-center">
            {ayat.kata.map((word, idx) => {
              const isHighlighted = highlightWords.includes(idx);
              return (
                <span
                  key={idx}
                  className={`
                    px-2 py-1 rounded-xl transition-colors
                    ${isHighlighted ? 'bg-emerald-600/40 text-emerald-300 ring-2 ring-emerald-400' : ''}
                  `}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ) : (
          ayat.arab
        )}
      </div>

      {/* Transliteration and Translation */}
      {(showLatin || showTerjemah) && (
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-col gap-3">
          {showLatin && (
            <p className="text-tv-latin font-bold text-emerald-300/95 italic tracking-wide">
              {ayat.latin}
            </p>
          )}
          {showTerjemah && (
            <p className="text-tv-sub text-stone-300 font-medium leading-relaxed">
              "{cleanQuotes(ayat.terjemah)}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};
