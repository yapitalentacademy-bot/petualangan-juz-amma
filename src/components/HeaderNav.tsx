import React from 'react';
import { ArrowLeft, Home, Volume2, VolumeX, Shield } from 'lucide-react';
import { sfx } from '../lib/audioPlayer';

interface HeaderNavProps {
  title?: string;
  subtitle?: string;
  showBackToMap?: boolean;
  showBackToHome?: boolean;
  onBackToMap?: () => void;
  onBackToHome?: () => void;
  onOpenTeacherMode?: () => void;
  classNameLabel?: string;
  levelLabel?: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title,
  subtitle,
  showBackToMap = true,
  showBackToHome = false,
  onBackToMap,
  onBackToHome,
  onOpenTeacherMode,
  classNameLabel = '5A',
  levelLabel = 4,
  soundEnabled = true,
  onToggleSound,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 md:px-10 md:py-6 glass-panel border-b-2 border-amber-600/30 sticky top-0 z-40">
      {/* Left Action (Kembali ke Peta / Beranda) */}
      <div className="flex items-center gap-4">
        {showBackToMap && onBackToMap && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToMap();
            }}
            className="touch-btn flex items-center gap-3 px-6 py-3.5 bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border-2 border-amber-600/70 rounded-2xl text-xl font-extrabold shadow-md cursor-pointer"
            title="Kembali ke Peta"
          >
            <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
            <span className="hidden sm:inline">Peta 37 Pos</span>
          </button>
        )}

        {showBackToHome && onBackToHome && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToHome();
            }}
            className="touch-btn flex items-center gap-3 px-6 py-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 border-2 border-stone-600 rounded-2xl text-xl font-extrabold shadow-md cursor-pointer"
            title="Ke Beranda"
          >
            <Home className="w-7 h-7" />
            <span className="hidden sm:inline">Beranda</span>
          </button>
        )}

        {title && (
          <div className="flex flex-col ml-2">
            <h1 className="text-2xl md:text-3xl font-black text-amber-300 font-display">
              {title}
            </h1>
            {subtitle && (
              <span className="text-base md:text-lg text-stone-300 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Action: Class Badge & Audio Toggle & Guru */}
      <div className="flex items-center gap-4">
        {classNameLabel && (
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/60 px-5 py-2.5 rounded-2xl shadow-sm">
            <span className="text-emerald-400 font-bold text-lg">Kelas:</span>
            <span className="text-white font-black text-xl">{classNameLabel}</span>
            <span className="text-xs bg-emerald-700/80 text-emerald-100 font-extrabold px-2 py-0.5 rounded-lg ml-1">
              Lv.{levelLabel}
            </span>
          </div>
        )}

        {onToggleSound && (
          <button
            onClick={() => {
              onToggleSound();
              sfx.playClick();
            }}
            className="touch-btn p-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-2xl cursor-pointer"
            title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
          >
            {soundEnabled ? (
              <Volume2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <VolumeX className="w-7 h-7 text-stone-500" />
            )}
          </button>
        )}

        {onOpenTeacherMode && (
          <button
            onClick={() => {
              sfx.playClick();
              onOpenTeacherMode();
            }}
            className="touch-btn p-3.5 bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 rounded-2xl cursor-pointer"
            title="Mode Guru (PIN)"
          >
            <Shield className="w-7 h-7" />
          </button>
        )}
      </div>
    </header>
  );
};
