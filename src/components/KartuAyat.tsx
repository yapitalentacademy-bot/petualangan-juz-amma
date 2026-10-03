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

/**
 * KartuAyat:
 * - Latar --gading-kartu (#FFFDF6), radius 28px, garis --zamrud-tua (#0E4D34) 2px
 * - Bayangan cahaya emas lembut (box-shadow emas transparan)
 * - Saat dipilih/benar: berubah menjadi kartu solid --zamrud-tua dengan teks gading dan glow emas
 * - Teks ayat tetap warna murni tanpa efek emas/glow sesuai adab Al-Qur'an
 */
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

  const isSolidActive = selected || status === 'correct';

  return (
    <div
      onClick={handleClick}
      className={`
        btn-kafilah relative flex flex-col p-6 md:p-8 rounded-[28px] border-2
        transition-all duration-200 cursor-pointer select-none
        ${
          isSolidActive
            ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#C9A04A] shadow-xl shadow-[#C9A04A]/30 ring-2 ring-[#C9A04A]/60'
            : status === 'wrong'
            ? 'bg-[#FFF8F5] text-[#2B2A26] border-[#C0603A] ring-4 ring-[#C0603A]/30 shadow-md'
            : 'bg-[#FFFDF6] text-[#2B2A26] border-[#0E4D34] hover:border-[#1B6B47] shadow-lg shadow-[#C9A04A]/15'
        }
        ${className}
      `}
    >
      {/* Header Baris Atas */}
      <div
        className={`flex items-center justify-between gap-4 mb-4 border-b pb-3 ${
          isSolidActive ? 'border-[#3A9D6A]/50' : 'border-[#E9E1D0]'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Bulatan Nomor Ayat Emas */}
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-full font-black text-lg font-['Marcellus'] shadow-sm border ${
              isSolidActive
                ? 'bg-gradient-to-br from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border-[#FFFDF6]'
                : 'bg-gradient-to-br from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border-[#9C7A2E]/40'
            }`}
          >
            {ayat.nomor}
          </div>
          <span
            className={`text-lg font-bold font-['Montserrat'] ${
              isSolidActive ? 'text-[#F3D88A]' : 'text-[#0E4D34]'
            }`}
          >
            Ayat {ayat.nomor}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === 'correct' && (
            <span className="flex items-center gap-1 px-3.5 py-1 bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] font-black rounded-full text-sm font-['Montserrat'] shadow-sm">
              <Check className="w-4 h-4 stroke-[3]" /> Benar
            </span>
          )}
          {status === 'wrong' && (
            <span className="flex items-center gap-1 px-3.5 py-1 bg-[#C0603A] text-[#FFFDF6] font-bold rounded-full text-sm font-['Montserrat']">
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

      {/* Teks Ayat Al-Qur'an (RTL, Harakat Jelas, Warna Murni) */}
      <div
        dir="rtl"
        className={`font-ayat text-3xl md:text-4xl lg:text-5xl tracking-wide leading-[2.1] py-3 text-right ${
          isSolidActive ? 'text-[#FFFDF6]' : 'text-[#2B2A26]'
        }`}
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
                    ${
                      isHighlighted
                        ? isSolidActive
                          ? 'bg-[#C9A04A]/40 text-[#FFFDF6] ring-2 ring-[#F3D88A]'
                          : 'bg-[#C9A04A]/25 text-[#0E4D34] ring-2 ring-[#C9A04A]'
                        : ''
                    }
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
        <div
          className={`mt-4 pt-3 border-t flex flex-col gap-2 ${
            isSolidActive ? 'border-[#3A9D6A]/50' : 'border-[#E9E1D0]'
          }`}
        >
          {showLatin && ayat.latin && (
            <p
              className={`font-['Montserrat'] text-lg md:text-xl font-bold leading-relaxed ${
                isSolidActive ? 'text-[#F3D88A]' : 'text-[#1B6B47]'
              }`}
            >
              {ayat.latin}
            </p>
          )}
          {showTerjemah && ayat.terjemah && (
            <p
              className={`font-['Montserrat'] text-base md:text-lg font-medium italic leading-relaxed ${
                isSolidActive ? 'text-[#FFFDF6]/90' : 'text-[#2B2A26]/80'
              }`}
            >
              "{cleanQuotes(ayat.terjemah)}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};
