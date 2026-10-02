import React from 'react';

export interface LenteraFanusProps {
  className?: string;
  isLit?: boolean;
  menyala?: boolean;
  size?: number;
}

/**
 * Ornamen Lentera (Fanus) — Simbol Harta Karun Ilmu & Penanda Pos Tuntas
 */
export const LenteraFanus: React.FC<LenteraFanusProps> = ({
  className = 'w-10 h-12',
  isLit = true,
  menyala,
  size = 48,
}) => {
  const lit = menyala !== undefined ? menyala : isLit;
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Efek Cahaya / Glow saat Menyala */}
      {lit && (
        <circle cx="50" cy="65" r="35" fill="url(#glowGrad)" opacity="0.6" />
      )}

      {/* Cincin Gantungan Atas */}
      <circle
        cx="50"
        cy="15"
        r="8"
        stroke="#D4A23A"
        strokeWidth="4"
        fill="none"
      />

      {/* Kubah / Topi Lentera */}
      <path
        d="M30 35 C30 22, 50 18, 50 18 C50 18, 70 22, 70 35 Z"
        fill="url(#goldMetalGrad)"
        stroke="#9A7220"
        strokeWidth="2"
      />

      {/* Badan Kaca Lentera */}
      <path
        d="M32 35 L22 68 L36 95 L64 95 L78 68 L68 35 Z"
        fill={lit ? 'url(#lightGrad)' : '#E8D2A6'}
        stroke="#0B4F3E"
        strokeWidth="3"
      />

      {/* Rangka Besi Geometris */}
      <line x1="50" y1="35" x2="50" y2="95" stroke="#D4A23A" strokeWidth="2.5" />
      <line x1="22" y1="68" x2="78" y2="68" stroke="#D4A23A" strokeWidth="2.5" />

      {/* Api / Cahaya Lentera di Dalam */}
      {isLit && (
        <ellipse cx="50" cy="65" rx="8" ry="14" fill="#FFFDF7" opacity="0.95" />
      )}

      {/* Kaki / Dasar Lentera */}
      <path
        d="M32 95 L68 95 L72 105 L28 105 Z"
        fill="url(#goldMetalGrad)"
        stroke="#9A7220"
        strokeWidth="2"
      />

      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#D4A23A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#D4A23A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9A7220" />
          <stop offset="50%" stopColor="#D4A23A" />
          <stop offset="100%" stopColor="#9A7220" />
        </linearGradient>
        <linearGradient id="lightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="50%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
};
