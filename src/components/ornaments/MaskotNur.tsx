import React from 'react';

interface MaskotNurProps {
  className?: string;
  expression?: 'happy' | 'smile' | 'cheer' | 'calm';
  tanpaWajah?: boolean;
  size?: number;
}

/**
 * Maskot "Nur" — Lentera kecil bercahaya yang menemani kafilah belajar Juz 'Amma
 * Dilengkapi opsi tanpaWajah untuk sekolah yang menghindari gambar makhluk bernyawa.
 */
export const MaskotNur: React.FC<MaskotNurProps> = ({
  className = 'w-16 h-20',
  expression = 'smile',
  tanpaWajah = false,
  size = 64,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size * 1.25}
        viewBox="0 0 100 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md"
      >
        {/* Glow lembut di sekeliling Nur */}
        <circle cx="50" cy="65" r="42" fill="url(#nurGlow)" />

        {/* Cincin Gantungan Emas */}
        <circle cx="50" cy="16" r="9" stroke="#D4A23A" strokeWidth="4" fill="none" />

        {/* Topi / Kubah Lentera Nur */}
        <path
          d="M26 36 C26 22, 50 18, 50 18 C50 18, 74 22, 74 36 Z"
          fill="url(#nurGold)"
          stroke="#0B4F3E"
          strokeWidth="2.5"
        />

        {/* Badan Kaca Nur yang Bercahaya Hangat */}
        <path
          d="M28 36 L18 72 L32 100 L68 100 L82 72 L72 36 Z"
          fill="url(#nurBodyGrad)"
          stroke="#0F7A5C"
          strokeWidth="3.5"
        />

        {/* Rangka Emas Halus */}
        <line x1="28" y1="36" x2="32" y2="100" stroke="#D4A23A" strokeWidth="2" opacity="0.8" />
        <line x1="72" y1="36" x2="68" y2="100" stroke="#D4A23A" strokeWidth="2" opacity="0.8" />

        {/* Wajah Nur (Dua titik mata & senyum sederhana) bila tidak dimatikan */}
        {!tanpaWajah && (
          <g className="nur-face">
            {/* Mata Kiri & Kanan */}
            <ellipse cx="40" cy="64" rx="3.5" ry="4.5" fill="#0B4F3E" />
            <ellipse cx="60" cy="64" rx="3.5" ry="4.5" fill="#0B4F3E" />

            {/* Kilau Mata */}
            <circle cx="39" cy="62.5" r="1.2" fill="#FFFDF7" />
            <circle cx="59" cy="62.5" r="1.2" fill="#FFFDF7" />

            {/* Pipi Merona Lembut */}
            <ellipse cx="34" cy="71" rx="3" ry="1.5" fill="#E8A87C" opacity="0.7" />
            <ellipse cx="66" cy="71" rx="3" ry="1.5" fill="#E8A87C" opacity="0.7" />

            {/* Senyum Nur */}
            {expression === 'cheer' ? (
              <path
                d="M43 71 Q50 78 57 71"
                stroke="#0B4F3E"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="#C0603A"
              />
            ) : (
              <path
                d="M44 71 Q50 76 56 71"
                stroke="#0B4F3E"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>
        )}

        {/* Dasar Kaki Lentera */}
        <path
          d="M30 100 L70 100 L75 110 L25 110 Z"
          fill="url(#nurGold)"
          stroke="#0B4F3E"
          strokeWidth="2.5"
        />

        <defs>
          <radialGradient id="nurGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#D4A23A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D4A23A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nurGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A23A" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#9A7220" />
          </linearGradient>
          <linearGradient id="nurBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="40%" stopColor="#FEF9C3" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
