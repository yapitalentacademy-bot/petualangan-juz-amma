import React from 'react';
import { BellRing, Check, Lock } from 'lucide-react';

interface BuzzerButtonProps {
  team: 'A' | 'B';
  teamName: string;
  isActive: boolean;
  isLocked: boolean;
  onPress: (team: 'A' | 'B') => void;
  disabled?: boolean;
}

export const BuzzerButton: React.FC<BuzzerButtonProps> = ({
  team,
  teamName,
  isActive,
  isLocked,
  onPress,
  disabled = false,
}) => {
  const isTeamA = team === 'A';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (disabled || isLocked) return;
    onPress(team);
  };

  const baseColors = isTeamA
    ? {
        idle: 'from-emerald-600 to-emerald-800 border-emerald-400 shadow-card-glow hover:from-emerald-500 hover:to-emerald-700',
        active: 'from-emerald-400 to-emerald-600 border-yellow-300 ring-8 ring-yellow-400/80 shadow-2xl scale-105 animate-pulse',
        bgGlow: 'bg-emerald-500/20',
        textColor: 'text-emerald-300',
      }
    : {
        idle: 'from-sky-600 to-sky-800 border-sky-400 shadow-card-glow hover:from-sky-500 hover:to-sky-700',
        active: 'from-sky-400 to-sky-600 border-yellow-300 ring-8 ring-yellow-400/80 shadow-2xl scale-105 animate-pulse',
        bgGlow: 'bg-sky-500/20',
        textColor: 'text-sky-300',
      };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onPointerDown={handlePointerDown}
        disabled={disabled || isLocked}
        className={`
          touch-btn relative flex flex-col items-center justify-center
          w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border-8
          bg-gradient-to-br transition-all duration-75 cursor-pointer select-none
          ${isActive ? baseColors.active : baseColors.idle}
          ${isLocked ? 'opacity-40 grayscale cursor-not-allowed border-stone-600' : ''}
          ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
        `}
      >
        {/* Glowing aura */}
        <div className={`absolute -inset-4 rounded-full blur-xl ${baseColors.bgGlow} -z-10`} />

        {/* Icon */}
        <div className="mb-3">
          {isActive ? (
            <Check className="w-24 h-24 text-white animate-bounce stroke-[3]" />
          ) : isLocked ? (
            <Lock className="w-20 h-20 text-stone-300" />
          ) : (
            <BellRing className="w-24 h-24 text-white stroke-[2.5]" />
          )}
        </div>

        {/* Buzzer Label */}
        <span className="text-3xl md:text-4xl font-black text-white tracking-wider font-display uppercase drop-shadow-md">
          {isActive ? 'MENJAWAB!' : 'BUZZER'}
        </span>

        <span className="text-lg md:text-xl font-extrabold text-stone-100/90 mt-1">
          {teamName}
        </span>
      </button>
    </div>
  );
};
