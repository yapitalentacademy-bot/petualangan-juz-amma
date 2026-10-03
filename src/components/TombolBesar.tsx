import React from 'react';
import { sfx } from '../lib/audioPlayer';
import { createTouchHandler } from '../lib/utils';

export interface TombolBesarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'emas' | 'zamrud' | 'oasis' | 'desert' | 'ocean' | 'biru' | 'danger' | 'terakota' | 'ghost';
  size?: 'normal' | 'large' | 'small' | 'icon-box';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  soundEffect?: boolean;
}

/**
 * TombolBesar Bergaya Proposal Mewah Tahfiz Camp:
 * - Tombol utama (emas): kapsul --gradien-emas dengan teks --zamrud-tua tebal & kilau lembut.
 * - Tombol sekunder (zamrud): kapsul --zamrud-tua dengan teks gading.
 */
export const TombolBesar: React.FC<TombolBesarProps> = ({
  variant = 'emas',
  size = 'normal',
  icon,
  children,
  onClick,
  disabled = false,
  className = '',
  soundEffect = true,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundEffect) {
      sfx.playClick();
    }
    if (onClick) {
      const debounced = createTouchHandler(() => onClick(e), 200);
      debounced();
    }
  };

  // Normalisasi variant
  const actualVariant =
    variant === 'desert' || variant === 'emas' ? 'emas' :
    variant === 'oasis' || variant === 'zamrud' ? 'zamrud' :
    variant === 'ocean' || variant === 'biru' ? 'zamrud' :
    variant === 'danger' || variant === 'terakota' ? 'terakota' : variant;

  const variantStyles: Record<string, string> = {
    // Tombol Utama Emas (Proposal Style Gradient)
    emas:
      'bg-gradient-to-r from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] text-[#0E4D34] border-2 border-[#FFF2C6] border-b-[6px] border-b-[#7A5F23] shadow-lg shadow-[#C9A04A]/30 hover:brightness-105 active:border-b-[2px] active:translate-y-1',
    
    // Tombol Sekunder Zamrud Tua
    zamrud:
      'bg-[#0E4D34] hover:bg-[#155E40] text-[#FFFDF6] border-2 border-[#3A9D6A]/60 border-b-[6px] border-b-[#07261A] shadow-lg shadow-[#0E4D34]/35 active:border-b-[2px] active:translate-y-1',
    
    // Terakota (Peringatan Halus)
    terakota:
      'bg-[#C0603A] hover:bg-[#D4714A] text-[#FFFDF6] border-2 border-[#FCA5A5]/50 border-b-[6px] border-b-[#8F3D1F] shadow-md active:border-b-[2px] active:translate-y-1',
    
    // Ghost / Gading Marmer
    ghost:
      'bg-[#FFFDF6] hover:bg-[#F8F4EA] text-[#0E4D34] border-2 border-[#D9CBB0] border-b-[6px] border-b-[#CDBFA6] shadow-sm active:border-b-[2px] active:translate-y-1',
  };

  const sizeStyles = {
    small: 'min-h-[50px] px-6 py-2 text-base md:text-lg font-extrabold rounded-full gap-2.5',
    normal: 'min-h-[64px] px-8 py-3.5 text-xl md:text-2xl font-black rounded-full gap-3.5',
    large: 'min-h-[80px] md:min-h-[92px] min-w-[240px] px-10 py-4.5 text-2xl md:text-3xl font-black rounded-full gap-5',
    'icon-box': 'min-w-[130px] min-h-[130px] p-4 text-lg font-black rounded-[24px] flex-col gap-2.5 justify-center items-center',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        btn-kafilah inline-flex items-center justify-center
        cursor-pointer select-none font-['Montserrat'] tracking-wide text-center
        ${variantStyles[actualVariant] || variantStyles.emas}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none' : ''}
        ${className}
      `}
      {...rest}
    >
      {icon && <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>}
      {children && <span className="drop-shadow-sm">{children}</span>}
    </button>
  );
};
