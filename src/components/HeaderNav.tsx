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
    <header className="w-full flex items-center justify-between px-6 py-3.5 md:px-10 md:py-4 bg-[#FFFDF6]/95 border-b-2 border-[#E9E1D0] sticky top-0 z-40 shadow-sm backdrop-blur-md">
      {/* Left Action (Kembali ke Peta / Beranda) */}
      <div className="flex items-center gap-3">
        {showBackToMap && onBackToMap && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToMap();
            }}
            className="btn-kafilah flex items-center gap-2 px-5 py-2.5 bg-[#0E4D34] hover:bg-[#155E40] text-[#FFFDF6] border-2 border-[#3A9D6A]/60 rounded-full text-base md:text-lg font-bold shadow-sm cursor-pointer"
            title="Kembali ke Peta"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            <span className="hidden sm:inline font-['Montserrat']">Peta Pos</span>
          </button>
        )}

        {showBackToHome && onBackToHome && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToHome();
            }}
            className="btn-kafilah flex items-center gap-2 px-5 py-2.5 bg-[#F8F4EA] hover:bg-[#E9E1D0] text-[#0E4D34] border-2 border-[#D9CBB0] rounded-full text-base md:text-lg font-bold shadow-sm cursor-pointer"
            title="Ke Beranda"
          >
            <Home className="w-5 h-5 text-[#0E4D34]" />
            <span className="hidden sm:inline font-['Montserrat']">Beranda</span>
          </button>
        )}

        {title && (
          <div className="flex flex-col ml-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0E4D34] font-['Marcellus'] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <span className="text-xs md:text-sm text-[#2B2A26]/75 font-['Montserrat'] font-medium">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Action: Class Badge & Fullscreen & Audio Toggle & Guru */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {classNameLabel && (
          <div className="flex items-center gap-2 bg-[#F8F4EA] border-2 border-[#D9CBB0] px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="text-[#0E4D34] font-bold text-xs md:text-sm font-['Montserrat']">Kelas:</span>
            <span className="text-[#2B2A26] font-black text-sm md:text-base font-['Montserrat']">{classNameLabel}</span>
            <span className="text-xs bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] font-black px-2.5 py-0.5 rounded-full font-['Montserrat'] border border-[#9C7A2E]/30">
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
          className="btn-kafilah p-2.5 bg-[#F8F4EA] hover:bg-[#E9E1D0] text-[#0E4D34] border-2 border-[#D9CBB0] rounded-full cursor-pointer shadow-sm"
          title={isFullscreen ? 'Keluar Layar Penuh (ESC)' : 'Mode Layar Penuh (Fullscreen)'}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {onToggleSound && (
          <button
            onClick={() => {
              onToggleSound();
              sfx.playClick();
            }}
            className="btn-kafilah p-2.5 bg-[#F8F4EA] hover:bg-[#E9E1D0] text-[#0E4D34] border-2 border-[#D9CBB0] rounded-full cursor-pointer shadow-sm"
            title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-[#1B6B47]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#C0603A]" />
            )}
          </button>
        )}

        {onOpenTeacherMode && (
          <button
            onClick={() => {
              sfx.playClick();
              onOpenTeacherMode();
            }}
            className="btn-kafilah p-2.5 bg-[#F8F4EA] hover:bg-[#E9E1D0] text-[#C9A04A] border-2 border-[#D9CBB0] rounded-full cursor-pointer shadow-sm"
            title="Mode Guru (PIN)"
          >
            <Shield className="w-5 h-5 text-[#C9A04A]" />
          </button>
        )}
      </div>
    </header>
  );
};
