import React from 'react';
import { sfx } from '../lib/audioPlayer';
import { createTouchHandler } from '../lib/utils';

export interface TombolBesarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'oasis' | 'desert' | 'ocean' | 'danger' | 'ghost';
  size?: 'normal' | 'large' | 'icon-box';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  soundEffect?: boolean;
}

export const TombolBesar: React.FC<TombolBesarProps> = ({
  variant = 'oasis',
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
      const debounced = createTouchHandler(() => onClick(e), 250);
      debounced();
    }
  };

  const variantStyles = {
    oasis:
      'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700 hover:from-emerald-300 hover:to-emerald-600 text-white border-2 border-emerald-200/90 border-b-[8px] border-b-[#064e3b] shadow-btn-emerald active:border-b-[2px] active:translate-y-1.5 active:shadow-sm font-game tracking-wide drop-shadow-md',
    desert:
      'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 hover:from-yellow-200 hover:to-amber-500 text-amber-950 font-black border-2 border-yellow-100/90 border-b-[8px] border-b-[#78350f] shadow-btn-gold active:border-b-[2px] active:translate-y-1.5 active:shadow-sm font-game tracking-wide drop-shadow-sm',
    ocean:
      'bg-gradient-to-b from-sky-300 via-sky-500 to-sky-700 hover:from-sky-200 hover:to-sky-600 text-white border-2 border-sky-100/90 border-b-[8px] border-b-[#0c4a6e] shadow-btn-sky active:border-b-[2px] active:translate-y-1.5 active:shadow-sm font-game tracking-wide drop-shadow-md',
    danger:
      'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-700 hover:from-rose-300 hover:to-rose-600 text-white border-2 border-rose-200/90 border-b-[8px] border-b-[#4c0519] shadow-lg active:border-b-[2px] active:translate-y-1.5 active:shadow-sm font-game tracking-wide drop-shadow-md',
    ghost:
      'bg-slate-900/90 hover:bg-slate-800 text-stone-200 border-2 border-slate-600/70 border-b-[6px] border-b-slate-950 shadow-md active:border-b-[2px] active:translate-y-1 font-game tracking-wide',
  };

  const sizeStyles = {
    normal: 'min-h-[72px] px-8 py-4 text-2xl font-black rounded-3xl gap-4',
    large: 'min-h-[110px] min-w-[280px] px-12 py-7 text-3xl md:text-4xl font-black rounded-3xl gap-6',
    'icon-box': 'min-w-[160px] min-h-[160px] p-6 text-2xl font-black rounded-3xl flex-col gap-3 justify-center items-center',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        touch-btn inline-flex items-center justify-center
        cursor-pointer select-none transition-all duration-75 text-center
        ${variantStyles[variant]}
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
