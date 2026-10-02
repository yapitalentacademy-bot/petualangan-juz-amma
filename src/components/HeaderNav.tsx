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
    <header className="w-full flex items-center justify-between px-6 py-3.5 md:px-10 md:py-4 bg-[#FFFDF7] border-b-2 border-[#E8D2A6] sticky top-0 z-40 shadow-sm backdrop-blur-md">
      {/* Left Action (Kembali ke Peta / Beranda) */}
      <div className="flex items-center gap-3">
        {showBackToMap && onBackToMap && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToMap();
            }}
            className="btn-kafilah flex items-center gap-2 px-5 py-2.5 bg-[#0F7A5C] hover:bg-[#128F6C] text-[#FFFDF7] border-2 border-[#0B4F3E] rounded-full text-base md:text-lg font-black shadow-sm cursor-pointer"
            title="Kembali ke Peta"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
            <span className="hidden sm:inline font-teks">Peta Pos</span>
          </button>
        )}

        {showBackToHome && onBackToHome && (
          <button
            onClick={() => {
              sfx.playClick();
              onBackToHome();
            }}
            className="btn-kafilah flex items-center gap-2 px-5 py-2.5 bg-[#E8D2A6] hover:bg-[#DFC797] text-[#14233C] border-2 border-[#CBB385] rounded-full text-base md:text-lg font-black shadow-sm cursor-pointer"
            title="Ke Beranda"
          >
            <Home className="w-5 h-5 text-[#0B4F3E]" />
            <span className="hidden sm:inline font-teks">Beranda</span>
          </button>
        )}

        {title && (
          <div className="flex flex-col ml-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0B4F3E] font-judul leading-tight">
              {title}
            </h1>
            {subtitle && (
              <span className="text-xs md:text-sm text-[#14233C]/75 font-teks font-bold">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Action: Class Badge & Fullscreen & Audio Toggle & Guru */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {classNameLabel && (
          <div className="flex items-center gap-1.5 bg-[#F6EBD9] border-2 border-[#E8D2A6] px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="text-[#0B4F3E] font-bold text-sm font-teks">Kelas:</span>
            <span className="text-[#14233C] font-black text-base font-teks">{classNameLabel}</span>
            <span className="text-xs bg-[#0F7A5C] text-[#FFFDF7] font-black px-2 py-0.5 rounded-full ml-1 font-teks">
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
          className="btn-kafilah p-2.5 bg-[#F6EBD9] hover:bg-[#E8D2A6] text-[#0B4F3E] border-2 border-[#E8D2A6] rounded-full cursor-pointer shadow-sm"
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
            className="btn-kafilah p-2.5 bg-[#F6EBD9] hover:bg-[#E8D2A6] text-[#0B4F3E] border-2 border-[#E8D2A6] rounded-full cursor-pointer shadow-sm"
            title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-[#0F7A5C]" />
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
            className="btn-kafilah p-2.5 bg-[#F6EBD9] hover:bg-[#E8D2A6] text-[#D4A23A] border-2 border-[#E8D2A6] rounded-full cursor-pointer shadow-sm"
            title="Mode Guru (PIN)"
          >
            <Shield className="w-5 h-5 text-[#D4A23A]" />
          </button>
        )}
      </div>
    </header>
  );
};

