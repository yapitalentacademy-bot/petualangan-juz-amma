import React from 'react';

interface PlakatEmasProps {
  label?: string;
  value: React.ReactNode;
  subValue?: string;
  icon?: React.ReactNode;
  className?: string;
  size?: 'normal' | 'large' | 'compact';
}

/**
 * PlakatEmas: Komponen kotak radius 24px berisi --gradien-emas, tepi lebih terang,
 * dan teks Marcellus --zamrud-tua besar.
 * Mengikuti gaya kotak informasi resmi "±14 Jam / 9 Sesi" di proposal Tahfiz Camp.
 */
export const PlakatEmas: React.FC<PlakatEmasProps> = ({
  label,
  value,
  subValue,
  icon,
  className = '',
  size = 'normal'
}) => {
  const sizeClasses = {
    compact: 'px-4 py-2.5 rounded-2xl min-w-[120px]',
    normal: 'px-6 py-4 rounded-[24px] min-w-[160px]',
    large: 'px-8 py-6 rounded-[28px] min-w-[220px]'
  }[size];

  const valueFontClasses = {
    compact: 'text-2xl md:text-3xl',
    normal: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl'
  }[size];

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center bg-gradient-to-br from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] text-[var(--zamrud-tua)] border-2 border-[#FFF2C6] shadow-lg shadow-[#9C7A2E]/30 ${sizeClasses} ${className}`}
    >
      {/* Inner highlight line */}
      <div className="absolute inset-0.5 rounded-[22px] border border-white/30 pointer-events-none" />

      {icon && <div className="mb-1 text-[var(--zamrud-tua)]">{icon}</div>}

      {label && (
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-[var(--zamrud-tua)]/80 mb-0.5 font-['Montserrat']">
          {label}
        </span>
      )}

      <div className={`font-black font-['Marcellus'] text-[var(--zamrud-tua)] leading-tight ${valueFontClasses}`}>
        {value}
      </div>

      {subValue && (
        <span className="text-xs md:text-sm font-semibold text-[var(--zamrud-tua)]/90 mt-1 font-['Montserrat']">
          {subValue}
        </span>
      )}
    </div>
  );
};
