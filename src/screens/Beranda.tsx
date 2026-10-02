import React, { useState, useRef } from 'react';
import { TombolBesar } from '../components/TombolBesar';
import { Compass, Users, Sparkles, ShieldCheck, KeyRound, Info, Maximize, Minimize, Swords } from 'lucide-react';
import { KelasLevel } from '../types/surah';
import { sfx } from '../lib/audioPlayer';
import { useFullscreen } from '../lib/useFullscreen';
import { BintangDelapan } from '../components/ornaments/BintangDelapan';
import { LenteraFanus } from '../components/ornaments/LenteraFanus';
import { MaskotNur } from '../components/ornaments/MaskotNur';

interface BerandaProps {
  onStartAdventure: () => void;
  onStartDuel?: () => void;
  selectedClass: string;
  selectedLevel: KelasLevel;
  badges?: string[];
  totalStars?: number;
  onSelectClass: (kelas: string) => void;
  onSelectLevel: (level: KelasLevel) => void;
  onOpenTeacherMode: () => void;
  onOpenAbout?: () => void;
}

export const Beranda: React.FC<BerandaProps> = ({
  onStartAdventure,
  onStartDuel,
  selectedClass,
  selectedLevel,
  badges = ['Penjelajah Pemula'],
  totalStars = 8,
  onSelectClass,
  onSelectLevel,
  onOpenTeacherMode,
  onOpenAbout,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Press and hold timer untuk tombol Mode Guru (2 detik)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const availableClasses = ['4A', '4B', '5A', '5B', '6A', '6B'];
  const levels: { level: KelasLevel; label: string; wilayah: string; desc: string }[] = [
    { level: 4, label: 'Kelas 4', wilayah: 'Oase Fajar', desc: 'An-Nas s.d. Ad-Dhuha (22 Pos)' },
    { level: 5, label: 'Kelas 5', wilayah: 'Lembah Senja', desc: "An-Nas s.d. Al-A'la (28 Pos)" },
    { level: 6, label: 'Kelas 6', wilayah: 'Puncak Bintang', desc: "An-Nas s.d. An-Naba' (37 Pos)" },
  ];

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handlePinSubmit = () => {
    if (pinInput === '1234' || pinInput === '0000') {
      sfx.playCorrect();
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      onOpenTeacherMode();
    } else {
      sfx.playWrong();
      setPinError(true);
      setPinInput('');
    }
  };

  const handleHoldStart = () => {
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 2000;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(pct);
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      sfx.playCorrect();
      setHoldProgress(0);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setShowPinModal(true);
    }, duration);
  };

  const handleHoldEnd = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setHoldProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#F6EBD9] text-[#14233C] flex flex-col items-center justify-between p-6 md:p-10 relative overflow-hidden bg-pola-girih">
      {/* Siluet Bukit Pasir Fajar & Pohon Kurma SVG di Latar Belakang */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg viewBox="0 0 1440 600" className="w-full h-full object-cover" preserveAspectRatio="none">
          <path d="M0,450 C320,380 480,520 800,430 C1120,340 1280,480 1440,410 L1440,600 L0,600 Z" fill="#E8D2A6" />
          <path d="M0,500 C400,460 700,560 1100,490 C1300,460 1400,520 1440,510 L1440,600 L0,600 Z" fill="#DFC797" />
        </svg>
      </div>

      {/* Top Header: Badge, Stars & Tools */}
      <header className="w-full flex flex-wrap items-center justify-between gap-4 z-10 max-w-6xl">
        <div className="flex items-center gap-3 bg-[#FFFDF7] px-5 py-2.5 rounded-full border-2 border-[#E8D2A6] shadow-sm">
          <Sparkles className="w-5 h-5 text-[#D4A23A]" />
          <span className="text-lg md:text-xl font-bold font-judul text-[#0B4F3E]">
            Kafilah Cahaya • Juz 'Amma
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Bintang Khatam Count */}
          <div className="flex items-center gap-2 bg-[#FFFDF7] border-2 border-[#D4A23A] px-4 py-2 rounded-full shadow-sm">
            <BintangDelapan filled={true} size={24} />
            <span className="text-lg font-black font-teks text-[#0B4F3E]">{totalStars} Bintang</span>
          </div>

          {/* Lencana Count */}
          <div className="flex items-center gap-2 bg-[#FFFDF7] border-2 border-[#0F7A5C] px-4 py-2 rounded-full shadow-sm">
            <LenteraFanus isLit={true} size={20} />
            <span className="text-lg font-black font-teks text-[#0F7A5C]">{badges.length} Lencana</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              sfx.playClick();
              toggleFullscreen();
            }}
            className="btn-kafilah flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFDF7] hover:bg-[#F6EBD9] text-[#0B4F3E] border-2 border-[#E8D2A6] rounded-full text-base font-bold shadow-sm"
            title={isFullscreen ? 'Keluar Layar Penuh (ESC)' : 'Mode Layar Penuh'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
          </button>

          {onOpenAbout && (
            <button
              onClick={() => {
                sfx.playClick();
                onOpenAbout();
              }}
              className="btn-kafilah flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFDF7] hover:bg-[#F6EBD9] text-[#1E6F8C] border-2 border-[#E8D2A6] rounded-full text-base font-bold shadow-sm"
            >
              <Info className="w-4 h-4" />
              <span>Tentang</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Utama: Lentera Besar Bercahaya + Judul Baloo 2 */}
      <main className="flex flex-col items-center text-center my-4 z-10 max-w-4xl w-full">
        {/* Lentera Besar / Maskot Nur */}
        <div className="relative mb-2">
          <LenteraFanus isLit={true} size={96} className="animate-pulse" />
        </div>

        {/* Judul Petualangan Juz 'Amma (Baloo 2) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-judul text-[#0B4F3E] tracking-wide mb-1 drop-shadow-sm">
          Petualangan Juz 'Amma
        </h1>

        <p className="text-lg md:text-xl font-bold font-teks text-[#D4A23A] mb-6">
          Menyusuri 37 Pos Oase & Lentera Ilmu Bersama Kafilah Cilik
        </p>

        {/* Panel Pilihan Kelas & Tingkat Ekspedisi */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          {/* Pilih Rombel Kelas */}
          <div className="bg-[#FFFDF7] p-6 rounded-[24px] border-2 border-[#E8D2A6] shadow-md">
            <div className="flex items-center gap-2.5 text-[#0B4F3E] mb-4">
              <Users className="w-6 h-6 text-[#0F7A5C]" />
              <h2 className="text-2xl font-black font-judul">Pilih Rombel Kelas</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {availableClasses.map((kelas) => {
                const isSelected = selectedClass === kelas;
                return (
                  <button
                    key={kelas}
                    onClick={() => {
                      sfx.playClick();
                      onSelectClass(kelas);
                    }}
                    className={`
                      btn-kafilah py-3 px-2 rounded-2xl font-black text-xl font-teks border-2 text-center transition-all
                      ${
                        isSelected
                          ? 'bg-[#0F7A5C] text-[#FFFDF7] border-[#0B4F3E] shadow-btn-zamrud'
                          : 'bg-[#F6EBD9] text-[#14233C] border-[#E8D2A6] hover:bg-[#E8D2A6]'
                      }
                    `}
                  >
                    {kelas}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pilih Wilayah & Tingkat Ekspedisi */}
          <div className="bg-[#FFFDF7] p-6 rounded-[24px] border-2 border-[#E8D2A6] shadow-md">
            <div className="flex items-center gap-2.5 text-[#0B4F3E] mb-4">
              <Compass className="w-6 h-6 text-[#D4A23A]" />
              <h2 className="text-2xl font-black font-judul">Tingkat & Wilayah</h2>
            </div>

            <div className="flex flex-col gap-2.5">
              {levels.map((item) => {
                const isSelected = selectedLevel === item.level;
                return (
                  <button
                    key={item.level}
                    onClick={() => {
                      sfx.playClick();
                      onSelectLevel(item.level);
                    }}
                    className={`
                      btn-kafilah flex items-center justify-between p-3.5 px-5 rounded-2xl border-2 text-left transition-all
                      ${
                        isSelected
                          ? 'bg-[#F0FAF6] border-[#0F7A5C] text-[#0B4F3E] shadow-sm'
                          : 'bg-[#F6EBD9] border-[#E8D2A6] text-[#14233C] hover:bg-[#E8D2A6]'
                      }
                    `}
                  >
                    <div>
                      <span className="text-lg font-black font-judul text-[#0B4F3E]">{item.label} • {item.wilayah}</span>
                      <p className="text-xs md:text-sm text-[#14233C]/75 font-teks font-medium">{item.desc}</p>
                    </div>
                    {isSelected && (
                      <span className="bg-[#0F7A5C] text-[#FFFDF7] font-bold px-3 py-1 rounded-full text-xs font-teks">
                        Aktif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dua Tombol Aksi Utama: Mulai Petualangan & Duel Tim (DESIGN.md) */}
        <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-2xl">
          <TombolBesar
            variant="zamrud"
            size="large"
            icon={<Compass className="w-8 h-8" />}
            onClick={onStartAdventure}
            className="flex-1 min-w-[260px]"
          >
            Mulai Petualangan
          </TombolBesar>

          <TombolBesar
            variant="biru"
            size="large"
            icon={<Swords className="w-8 h-8" />}
            onClick={() => {
              if (onStartDuel) {
                onStartDuel();
              } else {
                onStartAdventure();
              }
            }}
            className="flex-1 min-w-[260px]"
          >
            Duel Tim Santri
          </TombolBesar>
        </div>
      </main>

      {/* Footer & Tombol Mode Guru Pojok Kanan Bawah (Hold 2 Detik) */}
      <footer className="w-full max-w-6xl flex items-center justify-between z-10 pt-4 border-t border-[#E8D2A6]/70">
        <div className="flex items-center gap-3">
          <MaskotNur size={36} expression="happy" />
          <span className="font-teks font-bold text-sm text-[#0B4F3E]/80">
            "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
          </span>
        </div>

        {/* Tombol Mode Guru yang harus ditahan 2 detik */}
        <div className="relative">
          <button
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            className="btn-kafilah relative flex items-center gap-2 px-4 py-2.5 bg-[#FFFDF7] hover:bg-[#F6EBD9] text-[#0B4F3E] border-2 border-[#E8D2A6] rounded-full text-sm font-bold shadow-sm select-none"
            title="Tahan 2 detik untuk membuka Mode Guru"
          >
            <ShieldCheck className="w-5 h-5 text-[#0F7A5C]" />
            <span>Mode Guru</span>
            {holdProgress > 0 && (
              <span className="text-xs text-[#D4A23A] font-bold">({holdProgress}%)</span>
            )}
          </button>
        </div>
      </footer>

      {/* PIN Modal untuk Mode Guru */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFDF7] p-8 rounded-[28px] border-4 border-[#D4A23A] max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#F6EBD9] flex items-center justify-center mx-auto mb-4 border-2 border-[#E8D2A6]">
              <KeyRound className="w-8 h-8 text-[#0F7A5C]" />
            </div>

            <h3 className="text-2xl font-black font-judul text-[#0B4F3E] mb-2">
              Akses Mode Guru
            </h3>
            <p className="text-sm font-teks text-[#14233C]/80 mb-6">
              Masukkan PIN guru untuk membuka rekap nilai & pengaturan (Default: 1234 atau 0000).
            </p>

            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              placeholder="••••"
              autoFocus
              className="w-full text-center text-3xl font-black tracking-widest py-3 px-4 rounded-2xl bg-[#F6EBD9] border-2 border-[#E8D2A6] focus:outline-none focus:border-[#0F7A5C] text-[#14233C] mb-4"
            />

            {pinError && (
              <p className="text-sm font-bold text-[#C0603A] mb-4">
                PIN salah. Silakan coba lagi.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError(false);
                }}
                className="flex-1 py-3 rounded-full font-bold font-teks bg-[#E8D2A6] hover:bg-[#DFC797] text-[#14233C]"
              >
                Batal
              </button>
              <button
                onClick={handlePinSubmit}
                className="flex-1 py-3 rounded-full font-bold font-teks bg-[#0F7A5C] hover:bg-[#128F6C] text-[#FFFDF7] shadow-md"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

