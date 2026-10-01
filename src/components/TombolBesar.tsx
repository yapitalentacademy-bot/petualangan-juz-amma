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
    oasis: 'bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white border-b-4 border-emerald-900 shadow-touch active:border-b-0 active:translate-y-1',
    desert: 'bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold border-b-4 border-amber-950 shadow-touch active:border-b-0 active:translate-y-1',
    ocean: 'bg-gradient-to-b from-sky-500 to-sky-700 hover:from-sky-400 hover:to-sky-600 text-white border-b-4 border-sky-950 shadow-touch active:border-b-0 active:translate-y-1',
    danger: 'bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white border-b-4 border-rose-950 shadow-touch active:border-b-0 active:translate-y-1',
    ghost: 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-2 border-slate-600/50 shadow-sm active:translate-y-0.5',
  };

  const sizeStyles = {
    normal: 'min-h-[72px] px-8 py-4 text-2xl font-bold rounded-2xl gap-4',
    large: 'min-h-[110px] min-w-[240px] px-10 py-6 text-3xl font-extrabold rounded-3xl gap-5',
    'icon-box': 'min-w-[160px] min-h-[160px] p-6 text-2xl font-bold rounded-3xl flex-col gap-3 justify-center items-center',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        touch-btn inline-flex items-center justify-center font-sans tracking-wide
        cursor-pointer select-none transition-all duration-75
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed filter grayscale pointer-events-none' : ''}
        ${className}
      `}
      {...rest}
    >
      {icon && <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
