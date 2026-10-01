import React from 'react';
import { ArrowLeft, Home, Volume2, VolumeX, Shield, Maximize, Minimize } from 'lucide-react';
import { sfx } from '../lib/audioPlayer';
import { useFullscreen } from '../lib/useFullscreen';

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
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 md:px-10 md:py-6 stone-plaque border-b-2 border-emerald-500/40 sticky top-0 z-40 backdrop-blur-lg">
      {/* Left Action (Kembali ke Peta / Beranda) */}
      <div className="flex items-center gap-4">
        {showBackToMap && onBackToMap && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToMap();
            }}
            className="touch-btn flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 border-2 border-amber-300/80 rounded-2xl text-xl font-black shadow-lg cursor-pointer"
            title="Kembali ke Peta"
          >
            <ArrowLeft className="w-7 h-7 stroke-[3]" />
            <span className="hidden sm:inline">Peta 37 Pos</span>
          </button>
        )}

        {showBackToHome && onBackToHome && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToHome();
            }}
            className="touch-btn flex items-center gap-3 px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-stone-200 border-2 border-emerald-500/60 rounded-2xl text-xl font-black shadow-lg cursor-pointer"
            title="Ke Beranda"
          >
            <Home className="w-7 h-7 text-emerald-400" />
            <span className="hidden sm:inline">Beranda</span>
          </button>
        )}

        {title && (
          <div className="flex flex-col ml-2">
            <h1 className="text-2xl md:text-3xl font-black text-amber-300 font-display drop-shadow">
              {title}
            </h1>
            {subtitle && (
              <span className="text-base md:text-lg text-emerald-100/90 font-bold">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Action: Class Badge & Fullscreen & Audio Toggle & Guru */}
      <div className="flex items-center gap-3 md:gap-4">
        {classNameLabel && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/90 to-emerald-900/90 border-2 border-emerald-400/80 px-5 py-2.5 rounded-2xl shadow-md">
            <span className="text-emerald-300 font-bold text-lg">Kelas:</span>
            <span className="text-white font-black text-xl">{classNameLabel}</span>
            <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-lg ml-1 shadow-sm">
              Lv.{levelLabel}
            </span>
          </div>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => {
            sfx.playClick();
            toggleFullscreen();
          }}
          className="touch-btn p-3.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border-2 border-amber-400/60 rounded-2xl cursor-pointer shadow-md"
          title={isFullscreen ? 'Keluar Layar Penuh (ESC)' : 'Mode Layar Penuh (Fullscreen)'}
        >
          {isFullscreen ? (
            <Minimize className="w-7 h-7" />
          ) : (
            <Maximize className="w-7 h-7" />
          )}
        </button>

        {onToggleSound && (
          <button
            onClick={() => {
              onToggleSound();
              sfx.playClick();
            }}
            className="touch-btn p-3.5 bg-slate-900/90 hover:bg-slate-800 text-stone-300 border-2 border-slate-700 hover:border-emerald-400 rounded-2xl cursor-pointer shadow-md"
            title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
          >
            {soundEnabled ? (
              <Volume2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <VolumeX className="w-7 h-7 text-slate-500" />
            )}
          </button>
        )}

        {onOpenTeacherMode && (
          <button
            onClick={() => {
              sfx.playClick();
              onOpenTeacherMode();
            }}
            className="touch-btn p-3.5 bg-slate-900/80 hover:bg-slate-800 text-stone-400 hover:text-amber-300 border-2 border-slate-700 hover:border-amber-400 rounded-2xl cursor-pointer shadow-md"
            title="Mode Guru (PIN)"
          >
            <Shield className="w-7 h-7" />
          </button>
        )}
      </div>
    </header>
  );
};
