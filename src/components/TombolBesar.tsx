import React from 'react';
import { sfx } from '../lib/audioPlayer';
import { createTouchHandler } from '../lib/utils';

export interface TombolBesarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'oasis' | 'zamrud' | 'desert' | 'emas' | 'ocean' | 'biru' | 'danger' | 'terakota' | 'ghost';
  size?: 'normal' | 'large' | 'small' | 'icon-box';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  soundEffect?: boolean;
}

export const TombolBesar: React.FC<TombolBesarProps> = ({
  variant = 'zamrud',
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

  // Normalisasi nama variant
  const actualVariant =
    variant === 'oasis' ? 'zamrud' :
    variant === 'desert' ? 'emas' :
    variant === 'ocean' ? 'biru' :
    variant === 'danger' ? 'terakota' : variant;

  const variantStyles: Record<string, string> = {
    // Tombol Aksi Utama / Kafilah Zamrud
    zamrud:
      'bg-[#0F7A5C] hover:bg-[#128F6C] text-[#FFFDF7] border-2 border-[#34D399]/40 border-b-[6px] border-b-[#0B4F3E] shadow-btn-zamrud active:border-b-[2px] active:translate-y-1',
    
    // Tombol Hadiah / Emas
    emas:
      'bg-[#D4A23A] hover:bg-[#E2B34B] text-[#FFFDF7] border-2 border-[#FEF08A]/60 border-b-[6px] border-b-[#9A7220] shadow-btn-emas active:border-b-[2px] active:translate-y-1',
    
    // Tombol Tim Kanan / Biru Laut
    biru:
      'bg-[#1E6F8C] hover:bg-[#2585A8] text-[#FFFDF7] border-2 border-[#7DD3FC]/50 border-b-[6px] border-b-[#134B5F] shadow-btn-biru active:border-b-[2px] active:translate-y-1',
    
    // Tombol Peringatan / Terakota (Jawaban Perlu Diulang)
    terakota:
      'bg-[#C0603A] hover:bg-[#D4714A] text-[#FFFDF7] border-2 border-[#FCA5A5]/40 border-b-[6px] border-b-[#8F3D1F] shadow-md active:border-b-[2px] active:translate-y-1',
    
    // Tombol Sekunder / Panel Netral
    ghost:
      'bg-[#E8D2A6] hover:bg-[#DFC797] text-[#14233C] border-2 border-[#CBB385] border-b-[6px] border-b-[#B39B6F] shadow-sm active:border-b-[2px] active:translate-y-1',
  };

  const sizeStyles = {
    small: 'min-h-[52px] px-6 py-2.5 text-lg font-extrabold rounded-full gap-2.5',
    normal: 'min-h-[64px] px-8 py-3.5 text-xl md:text-2xl font-black rounded-full gap-3.5',
    large: 'min-h-[84px] md:min-h-[96px] min-w-[240px] px-10 py-5 text-2xl md:text-3xl font-black rounded-full gap-5',
    'icon-box': 'min-w-[140px] min-h-[140px] p-5 text-xl font-black rounded-3xl flex-col gap-3 justify-center items-center',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        btn-kafilah inline-flex items-center justify-center
        cursor-pointer select-none font-teks tracking-wide text-center
        ${variantStyles[actualVariant] || variantStyles.zamrud}
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

