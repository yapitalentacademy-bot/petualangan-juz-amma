import React from 'react';

interface TeksturMarmerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Tekstur marmer halus latar belakang yang ringan dan elegan.
 * Menggunakan gradien HSL halus dan urat marmer opasitas rendah.
 */
export const TeksturMarmer: React.FC<TeksturMarmerProps> = ({ className = '', children }) => {
  return (
    <div className={`relative w-full h-full bg-marmer overflow-hidden ${className}`}>
      {/* Subtle marble veins vector overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
      >
        <path
          d="M0,80 Q250,140 450,90 T900,160 L1000,180"
          fill="none"
          stroke="var(--marmer-urat)"
          strokeWidth="1.5"
          strokeDasharray="40 10 90 20"
        />
        <path
          d="M-50,320 Q200,280 500,340 T1050,300"
          fill="none"
          stroke="var(--marmer-urat)"
          strokeWidth="1.2"
        />
        <path
          d="M100,500 Q400,430 750,490 T1000,440"
          fill="none"
          stroke="var(--marmer-urat)"
          strokeWidth="1.8"
          strokeDasharray="60 15 120 25"
        />
      </svg>
      {children}
    </div>
  );
};
