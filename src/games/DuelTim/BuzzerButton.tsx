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
        idle: 'from-[#0E4D34] via-[#1B6B47] to-[#082A1C] border-[#3A9D6A] border-b-[10px] border-b-[#051A11] shadow-xl hover:brightness-110 active:border-b-[4px] active:translate-y-2',
        active: 'from-[#1B6B47] via-[#3A9D6A] to-[#0E4D34] border-[#F3D88A] ring-8 ring-[#F3D88A]/70 shadow-2xl scale-105 animate-pulse',
        bgGlow: 'bg-[#1B6B47]/30',
        textColor: 'text-[#F3D88A]',
      }
    : {
        idle: 'from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] border-[#FFF2C6] border-b-[10px] border-b-[#6A521D] shadow-xl hover:brightness-105 active:border-b-[4px] active:translate-y-2 text-[#0E4D34]',
        active: 'from-[#FFF2C6] via-[#F3D88A] to-[#C9A04A] border-white ring-8 ring-[#0E4D34]/50 shadow-2xl scale-105 animate-pulse text-[#0E4D34]',
        bgGlow: 'bg-[#C9A04A]/40',
        textColor: 'text-[#0E4D34]',
      };

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <button
        onPointerDown={handlePointerDown}
        disabled={disabled || isLocked}
        className={`
          touch-btn relative flex flex-col items-center justify-center
          w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full border-4
          bg-gradient-to-b transition-all duration-75 cursor-pointer select-none
          ${isActive ? baseColors.active : baseColors.idle}
          ${isLocked ? 'opacity-35 grayscale cursor-not-allowed border-stone-400 border-b-4' : ''}
          ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
        `}
      >
        {/* Glowing aura */}
        <div className={`absolute -inset-3 rounded-full blur-xl ${baseColors.bgGlow} -z-10`} />

        {/* Icon */}
        <div className="mb-2">
          {isActive ? (
            <Check className={`w-20 h-20 ${isTeamA ? 'text-[#F3D88A]' : 'text-[#0E4D34]'} animate-bounce stroke-[3]`} />
          ) : isLocked ? (
            <Lock className="w-16 h-16 text-white/60" />
          ) : (
            <BellRing className={`w-20 h-20 ${isTeamA ? 'text-white' : 'text-[#0E4D34]'} stroke-[2.5]`} />
          )}
        </div>

        {/* Buzzer Label */}
        <span className={`text-2xl md:text-4xl font-black font-['Marcellus'] uppercase tracking-wider ${isTeamA ? 'text-white' : 'text-[#0E4D34]'}`}>
          {isActive ? 'MENJAWAB!' : 'BUZZER'}
        </span>

        <span className={`text-base md:text-xl font-bold font-['Montserrat'] mt-1 ${isTeamA ? 'text-[#F3D88A]' : 'text-[#0E4D34]'}`}>
          {teamName}
        </span>
      </button>
    </div>
  );
};
