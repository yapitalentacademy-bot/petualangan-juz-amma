import React from 'react';

export interface BintangDelapanProps {
  className?: string;
  filled?: boolean;
  fill?: string;
  size?: number;
}

/**
 * Ornamen Bintang Delapan (Khatam) Islami
 * Digunakan untuk bintang hadiah, lencana, dan penanda pos tuntas
 */
export const BintangDelapan: React.FC<BintangDelapanProps> = ({
  className = 'w-8 h-8',
  filled = true,
  fill,
  size = 32,
}) => {
  const isFilled = fill ? fill !== 'none' : filled;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="drop-shadow(0px 2px 4px rgba(11, 79, 62, 0.3))">
        {/* Kotak 1 */}
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="6"
          fill={isFilled ? (fill && fill.startsWith('#') ? fill : 'url(#emasGrad)') : 'none'}
          stroke="#D4A23A"
          strokeWidth="5"
          strokeDasharray={isFilled ? 'none' : '6 4'}
        />
        {/* Kotak 2 yang diputar 45 derajat */}
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="6"
          transform="rotate(45 50 50)"
          fill={isFilled ? (fill && fill.startsWith('#') ? fill : 'url(#emasGrad)') : 'none'}
          stroke="#D4A23A"
          strokeWidth="5"
          strokeDasharray={isFilled ? 'none' : '6 4'}
        />
        {/* Lingkaran pusat berkilau */}
        {isFilled && (
          <circle cx="50" cy="50" r="14" fill="#FFFDF7" opacity="0.9" />
        )}
      </g>
      <defs>
        <linearGradient id="emasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4A23A" />
          <stop offset="100%" stopColor="#9A7220" />
        </linearGradient>
      </defs>
    </svg>
  );
};
