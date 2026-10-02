import React from 'react';
import { Ayat } from '../types/surah';
import { PemutarAudio } from './PemutarAudio';
import { quranAudio } from '../lib/audioPlayer';
import { Check, RotateCcw } from 'lucide-react';

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
      ? 'border-[#D4A23A] bg-[#FFFDF7] ring-4 ring-[#D4A23A]/50 shadow-xl'
      : 'border-[#D4A23A] bg-[#FFFDF7] hover:border-[#0F7A5C] hover:ring-2 hover:ring-[#0F7A5C]/30 shadow-md',
    correct: 'border-[#0F7A5C] bg-[#F4FAF7] ring-4 ring-[#0F7A5C]/60 shadow-card-glow',
    wrong: 'border-[#C0603A] bg-[#FDF6F2] ring-4 ring-[#C0603A]/50',
  };

  return (
    <div
      onClick={handleClick}
      className={`
        btn-kafilah relative flex flex-col p-6 md:p-8 rounded-[24px] border-2
        transition-all duration-150 cursor-pointer select-none text-[#14233C]
        ${statusStyles[status]}
        ${className}
      `}
      style={{
        boxShadow:
          status === 'correct'
            ? '0 12px 28px -4px rgba(15, 122, 92, 0.25), inset 0 0 0 2px #0F7A5C'
            : status === 'wrong'
            ? '0 12px 28px -4px rgba(192, 96, 58, 0.25), inset 0 0 0 2px #C0603A'
            : '0 8px 24px -4px rgba(11, 79, 62, 0.15), inset 0 0 0 2px rgba(212, 162, 58, 0.35)',
      }}
    >
      {/* Lengkung Mihrab Mini & Header Baris Atas */}
      <div className="flex items-center justify-between gap-4 mb-4 border-b border-[#E8D2A6]/80 pb-3">
        <div className="flex items-center gap-3">
          {/* Bulatan Nomor Ayat Bertema Khatam */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FEF08A] to-[#D4A23A] text-[#14233C] font-black text-xl shadow-sm border border-[#FFFDF7]">
            {ayat.nomor}
          </div>
          <span className="text-lg font-black text-[#0B4F3E] font-teks">
            Ayat ke-{ayat.nomor}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === 'correct' && (
            <span className="flex items-center gap-1 px-3 py-1 bg-[#0F7A5C] text-[#FFFDF7] font-bold rounded-full text-sm font-teks">
              <Check className="w-4 h-4" /> Benar
            </span>
          )}
          {status === 'wrong' && (
            <span className="flex items-center gap-1 px-3 py-1 bg-[#C0603A] text-[#FFFDF7] font-bold rounded-full text-sm font-teks">
              <RotateCcw className="w-4 h-4" /> Ulangi
            </span>
          )}

          <PemutarAudio
            surahNumber={surahNumber}
            ayatNumber={ayat.nomor}
            size="normal"
            showLabel={false}
          />
        </div>
      </div>

      {/* Teks Ayat Al-Qur'an (Mulia, Tenang, RTL, Font Ayat Resmi) */}
      <div
        dir="rtl"
        className="font-ayat text-[#14233C] text-3xl md:text-4xl lg:text-5xl tracking-wide leading-[1.9] py-3 text-right"
      >
        {ayat.kata && ayat.kata.length > 0 ? (
          <div className="flex flex-wrap gap-x-3 gap-y-2 justify-start items-center">
            {ayat.kata.map((word, idx) => {
              const isHighlighted = highlightWords.includes(idx);
              return (
                <span
                  key={idx}
                  className={`
                    px-2 py-0.5 rounded-lg transition-colors
                    ${isHighlighted ? 'bg-[#D4A23A]/25 text-[#0B4F3E] ring-2 ring-[#D4A23A]' : ''}
                  `}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ) : (
          <p>{ayat.arab}</p>
        )}
      </div>

      {/* Transliterasi dan Terjemahan */}
      {(showLatin || showTerjemah) && (
        <div className="mt-4 pt-3 border-t border-[#E8D2A6]/70 flex flex-col gap-2">
          {showLatin && ayat.latin && (
            <p className="font-teks text-lg md:text-xl font-bold text-[#0F7A5C] leading-relaxed">
              {ayat.latin}
            </p>
          )}
          {showTerjemah && ayat.terjemah && (
            <p className="font-teks text-base md:text-lg font-medium text-[#14233C]/80 italic leading-relaxed">
              "{cleanQuotes(ayat.terjemah)}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};
