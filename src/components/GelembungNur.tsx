import React from 'react';
import { MaskotNur } from './ornaments/MaskotNur';

export interface GelembungNurProps {
  pesan?: string;
  text?: string;
  expression?: 'happy' | 'smile' | 'cheer' | 'calm';
  tanpaWajah?: boolean;
  className?: string;
}

/**
 * Komponen Gelembung Nur — Maskot lentera Nur dengan balon bicara gading
 * Menemani siswa di pojok kiri bawah saat mengerjakan soal.
 */
export const GelembungNur: React.FC<GelembungNurProps> = ({
  pesan,
  text,
  expression = 'smile',
  tanpaWajah = false,
  className = '',
}) => {
  const content = text || pesan || '';
  return (
    <div className={`flex items-end gap-3 pointer-events-none select-none ${className}`}>
      {/* Maskot Nur */}
      <MaskotNur
        expression={expression}
        tanpaWajah={tanpaWajah}
        size={54}
        className="flex-shrink-0 animate-bounce-subtle"
      />

      {/* Balon Bicara Gading dengan Ekor ke Arah Nur */}
      <div className="relative bg-[#FFFDF7] text-[#0B4F3E] border-2 border-[#D4A23A] rounded-2xl px-5 py-3 shadow-lg max-w-sm pointer-events-auto">
        <p className="font-teks font-bold text-base md:text-lg leading-snug">
          {content}
        </p>

        {/* Ekor Balon Segitiga ke Kiri Bawah */}
        <div className="absolute -left-2.5 bottom-3.5 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-[#D4A23A] border-b-[8px] border-b-transparent"></div>
        <div className="absolute -left-[7px] bottom-3.5 w-0 h-0 border-t-[7px] border-t-transparent border-r-[9px] border-r-[#FFFDF7] border-b-[7px] border-b-transparent"></div>
      </div>
    </div>
  );
};
