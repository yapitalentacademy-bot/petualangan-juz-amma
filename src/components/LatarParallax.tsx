import React, { useEffect, useState } from 'react';
import * as LembahFajar from '../scenes/lembah-fajar';
import * as GurunSenja from '../scenes/gurun-senja';
import * as PegununganBintang from '../scenes/pegunungan-bintang';
import { quranAudio } from '../lib/audioPlayer';

export type WilayahType = 'lembah-fajar' | 'gurun-senja' | 'pegunungan-bintang';

export interface LatarParallaxProps {
  wilayah?: WilayahType;
  scrollOffset?: number;
  isBuram?: boolean;
  sembunyikanHewan?: boolean;
  isAudioPlaying?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const LatarParallax: React.FC<LatarParallaxProps> = ({
  wilayah = 'lembah-fajar',
  scrollOffset = 0,
  isBuram = false,
  sembunyikanHewan = false,
  isAudioPlaying,
  className = '',
  children,
}) => {
  const [isPlayingAudioInternal, setIsPlayingAudioInternal] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Poll audio player status if not explicitly passed
  useEffect(() => {
    if (isAudioPlaying !== undefined) {
      setIsPlayingAudioInternal(isAudioPlaying);
      return;
    }
    const interval = setInterval(() => {
      setIsPlayingAudioInternal(quranAudio.isPlaying());
    }, 250);
    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  const shouldPauseAnimation = isPlayingAudioInternal || prefersReducedMotion;

  // Parallax offsets with hardware accelerated translate3d
  const offsetL1 = -scrollOffset * 0.08;
  const offsetL2 = -scrollOffset * 0.22;
  const offsetL3 = -scrollOffset * 0.45;
  const offsetL4 = -scrollOffset * 0.8;

  const renderScene = () => {
    switch (wilayah) {
      case 'gurun-senja':
        return (
          <>
            {/* Lapisan 1: Langit & Matahari Senja Gurun */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL1}px, 0, 0)`,
              }}
            >
              <GurunSenja.Layer1Langit />
            </div>

            {/* Lapisan 2: Tebing Canyon & Mesa Gurun */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL2}px, 0, 0)`,
              }}
            >
              <GurunSenja.Layer2Gunung />
            </div>

            {/* Lapisan 3: Bukit Pasir (Sand Dunes) & Kurma Jauh */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL3}px, 0, 0)`,
              }}
            >
              <GurunSenja.Layer3Bukit />
            </div>

            {/* Lapisan 4: Mata Air Oase, Pohon Kurma Besar & Bebatuan */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL4}px, 0, 0)`,
              }}
            >
              <GurunSenja.Layer4Dekat />
            </div>

            {/* Lapisan 5: Elemen Hidup (Awan Senja, Debu Emas, Burung) */}
            <GurunSenja.Layer5Elemen
              sembunyikanHewan={sembunyikanHewan}
              isPaused={shouldPauseAnimation}
            />
          </>
        );

      case 'pegunungan-bintang':
        return (
          <>
            {/* Lapisan 1: Langit Malam, Bintang & Bulan Sabit */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL1}px, 0, 0)`,
              }}
            >
              <PegununganBintang.Layer1Langit />
            </div>

            {/* Lapisan 2: Puncak Gunung Salju & Kabut Malam */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL2}px, 0, 0)`,
              }}
            >
              <PegununganBintang.Layer2Gunung />
            </div>

            {/* Lapisan 3: Lereng Bukit Pinus & Hutan Cemara Malam */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL3}px, 0, 0)`,
              }}
            >
              <PegununganBintang.Layer3Bukit />
            </div>

            {/* Lapisan 4: Danau Cermin Bintang & Pohon Pinus Rindang */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL4}px, 0, 0)`,
              }}
            >
              <PegununganBintang.Layer4Dekat />
            </div>

            {/* Lapisan 5: Elemen Hidup (Bintang Berkelip, Bintang Jatuh, Kunang-kunang, Kabut Danau) */}
            <PegununganBintang.Layer5Elemen
              sembunyikanHewan={sembunyikanHewan}
              isPaused={shouldPauseAnimation}
            />
          </>
        );

      case 'lembah-fajar':
      default:
        return (
          <>
            {/* Lapisan 1: Langit & Matahari Fajar */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL1}px, 0, 0)`,
              }}
            >
              <LembahFajar.Layer1Langit />
            </div>

            {/* Lapisan 2: Barisan Gunung Jauh & Kabut */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL2}px, 0, 0)`,
              }}
            >
              <LembahFajar.Layer2Gunung />
            </div>

            {/* Lapisan 3: Bukit Terasering & Air Terjun */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL3}px, 0, 0)`,
              }}
            >
              <LembahFajar.Layer3Bukit />
            </div>

            {/* Lapisan 4: Sungai, Jembatan, Pohon & Tepi Dekat */}
            <div
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                transform: `translate3d(${offsetL4}px, 0, 0)`,
              }}
            >
              <LembahFajar.Layer4Dekat />
            </div>

            {/* Lapisan 5: Elemen Hidup (Awan, Burung, Kupu-kupu, Daun) */}
            <LembahFajar.Layer5Elemen
              sembunyikanHewan={sembunyikanHewan}
              isPaused={shouldPauseAnimation}
            />
          </>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* Background Parallax Scene */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {renderScene()}
      </div>

      {/* Mode Buram (Focus Mode untuk Mini Game / Duel Tim): Blur 6px + Overlay Gading 70% */}
      {isBuram && (
        <div
          className="absolute inset-0 bg-[#FFFDF7]/75 backdrop-blur-[6px] pointer-events-none transition-opacity duration-300 z-10"
        />
      )}

      {/* Content Layer di atas Latar */}
      {children && (
        <div className="relative z-20 w-full h-full flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
