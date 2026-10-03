import React from 'react';

interface OrnamenSudutProps {
  className?: string;
  variant?: 'semua' | 'atas-saja' | 'bawah-saja' | 'minimalis';
}

/**
 * Ornamen Sudut Bergaya Proposal Mewah (Garis tipis 1-1.5px)
 * - Pola geometris islami (bintang/girih) di pojok kiri atas dan kanan atas (terpotong tepi)
 * - Ranting daun line-art di pojok kanan atas dan kiri bawah
 * - Siluet gunung pasir di pojok kanan bawah, dan garis gunung kecil + bulan sabit di kiri bawah
 */
export const OrnamenSudut: React.FC<OrnamenSudutProps> = ({
  className = '',
  variant = 'semua'
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden z-0 select-none ${className}`} aria-hidden="true">
      {/* 1. Pojok Kiri Atas: Pola Geometris Girih Bintang (Terpotong tepi layar) */}
      {(variant === 'semua' || variant === 'atas-saja') && (
        <svg
          className="absolute -top-12 -left-12 w-64 h-64 text-[var(--ornamen)] opacity-60 transition-opacity"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Concentric Islamic Octagram Star Lines */}
          <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="72" />
          <rect x="40" y="40" width="120" height="120" rx="4" transform="rotate(0 100 100)" />
          <rect x="40" y="40" width="120" height="120" rx="4" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="42" stroke="var(--emas)" strokeWidth="1" opacity="0.8" />
          <polygon points="100,68 122,90 100,112 78,90" fill="none" stroke="currentColor" />
          <polygon points="100,68 122,90 100,112 78,90" transform="rotate(45 100 100)" fill="none" stroke="currentColor" />
          <circle cx="100" cy="100" r="16" fill="var(--emas)" fillOpacity="0.15" stroke="var(--emas)" />
        </svg>
      )}

      {/* 2. Pojok Kanan Atas: Pola Geometris Girih & Ranting Daun Line-Art */}
      {(variant === 'semua' || variant === 'atas-saja') && (
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none">
          {/* Girih Star */}
          <svg
            className="absolute -top-14 -right-14 w-60 h-60 text-[var(--ornamen)] opacity-50"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="45" y="45" width="110" height="110" transform="rotate(22.5 100 100)" />
            <rect x="45" y="45" width="110" height="110" transform="rotate(67.5 100 100)" />
            <circle cx="100" cy="100" r="50" stroke="var(--emas)" strokeWidth="1" opacity="0.6" />
          </svg>

          {/* Ranting Daun Line-Art Kanan Atas */}
          <svg
            className="absolute top-4 right-4 w-44 h-44 text-[var(--zamrud)] opacity-40"
            viewBox="0 0 160 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          >
            <path d="M150,10 Q110,30 80,85 Q60,120 40,150" />
            {/* Leaves */}
            <path d="M130,22 Q115,10 105,25 Q120,32 130,22 Z" fill="var(--zamrud)" fillOpacity="0.1" />
            <path d="M110,40 Q130,45 125,60 Q105,52 110,40 Z" fill="var(--zamrud)" fillOpacity="0.1" />
            <path d="M92,62 Q75,52 70,68 Q85,74 92,62 Z" fill="var(--zamrud)" fillOpacity="0.1" />
            <path d="M78,82 Q95,90 88,105 Q70,95 78,82 Z" fill="var(--zamrud)" fillOpacity="0.1" />
            <path d="M60,105 Q45,95 40,110 Q55,118 60,105 Z" fill="var(--zamrud)" fillOpacity="0.1" />
          </svg>
        </div>
      )}

      {/* 3. Pojok Kiri Bawah: Ranting Daun Line-Art + Garis Gunung & Bulan Sabit */}
      {(variant === 'semua' || variant === 'bawah-saja') && (
        <div className="absolute bottom-0 left-0 w-80 h-64 pointer-events-none">
          {/* Garis Gunung & Bulan Sabit */}
          <svg
            className="absolute bottom-0 left-0 w-64 h-36 text-[var(--gunung-pasir)] opacity-70"
            viewBox="0 0 200 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M0,120 L30,70 L70,100 L120,55 L160,95 L200,80 L200,120 Z" fill="var(--marmer-urat)" fillOpacity="0.4" />
            <path d="M0,120 L45,85 L85,110 L135,75 L180,110 L200,105" stroke="var(--gunung-pasir)" />
            {/* Bulan Sabit Halus */}
            <path
              d="M36,25 A12,12 0 1,0 48,37 A10,10 0 1,1 36,25 Z"
              fill="var(--emas)"
              fillOpacity="0.7"
              stroke="var(--emas-tua)"
              strokeWidth="0.8"
            />
          </svg>

          {/* Ranting Daun Line-Art Kiri Bawah */}
          <svg
            className="absolute bottom-4 left-6 w-40 h-40 text-[var(--zamrud)] opacity-35"
            viewBox="0 0 160 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <path d="M10,150 Q40,120 70,80 Q95,45 110,10" />
            <path d="M25,130 Q10,118 20,105 Q32,118 25,130 Z" fill="var(--zamrud)" fillOpacity="0.08" />
            <path d="M45,108 Q62,112 55,128 Q38,120 45,108 Z" fill="var(--zamrud)" fillOpacity="0.08" />
            <path d="M68,82 Q52,70 60,55 Q74,68 68,82 Z" fill="var(--zamrud)" fillOpacity="0.08" />
            <path d="M85,55 Q102,60 95,75 Q80,68 85,55 Z" fill="var(--zamrud)" fillOpacity="0.08" />
          </svg>
        </div>
      )}

      {/* 4. Pojok Kanan Bawah: Siluet Gunung Pasir Elegan */}
      {(variant === 'semua' || variant === 'bawah-saja') && (
        <svg
          className="absolute -bottom-2 -right-2 w-96 h-48 text-[var(--gunung-pasir)] opacity-60"
          viewBox="0 0 320 160"
          fill="none"
        >
          {/* Siluet Gunung Layer Belakang */}
          <path
            d="M50,160 Q130,80 190,110 Q250,50 320,95 L320,160 Z"
            fill="var(--marmer-urat)"
            fillOpacity="0.5"
            stroke="var(--ornamen)"
            strokeWidth="1"
          />
          {/* Siluet Gunung Layer Depan */}
          <path
            d="M110,160 Q190,95 240,130 Q285,105 320,135 L320,160 Z"
            fill="var(--gunung-pasir)"
            fillOpacity="0.35"
            stroke="var(--gunung-pasir)"
            strokeWidth="1.2"
          />
        </svg>
      )}
    </div>
  );
};
