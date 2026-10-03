import React, { useState, useRef } from 'react';
import { TombolBesar } from '../components/TombolBesar';
import { Compass, Users, Sparkles, ShieldCheck, KeyRound, Info, Maximize, Minimize, Swords } from 'lucide-react';
import { KelasLevel } from '../types/surah';
import { sfx } from '../lib/audioPlayer';
import { useFullscreen } from '../lib/useFullscreen';
import { BintangDelapan } from '../components/ornaments/BintangDelapan';
import { LenteraFanus } from '../components/ornaments/LenteraFanus';
import { MaskotNur } from '../components/ornaments/MaskotNur';
import { BingkaiMihrab } from '../components/BingkaiMihrab';
import { OrnamenSudut } from '../components/ornaments/OrnamenSudut';
import { TeksturMarmer } from '../components/ornaments/TeksturMarmer';

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
  sembunyikanHewan?: boolean;
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
    <TeksturMarmer className="min-h-screen relative flex flex-col justify-between p-6 md:p-10 select-none">
      {/* Ornamen Garis Tipis & Pola Geometris Sudut */}
      <OrnamenSudut variant="semua" />

      {/* Top Header: Badge, Stars & Tools */}
      <header className="w-full flex flex-wrap items-center justify-between gap-4 z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 bg-[#FFFDF6] px-5 py-2.5 rounded-full border-2 border-[#0E4D34] shadow-sm">
          <Sparkles className="w-5 h-5 text-[#C9A04A]" />
          <span className="text-base md:text-lg font-bold font-['Montserrat'] text-[#0E4D34]">
            Kafilah Cahaya • Proposal Ekspedisi Qur'an
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Bintang Khatam Count */}
          <div className="flex items-center gap-2 bg-[#FFFDF6] border-2 border-[#C9A04A] px-4 py-2 rounded-full shadow-sm">
            <BintangDelapan filled={true} size={22} />
            <span className="text-base font-black font-['Montserrat'] text-[#0E4D34]">{totalStars} Bintang</span>
          </div>

          {/* Lencana Count */}
          <div className="flex items-center gap-2 bg-[#FFFDF6] border-2 border-[#0E4D34] px-4 py-2 rounded-full shadow-sm">
            <LenteraFanus isLit={true} size={20} />
            <span className="text-base font-black font-['Montserrat'] text-[#0E4D34]">{badges.length} Lencana</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              sfx.playClick();
              toggleFullscreen();
            }}
            className="btn-kafilah flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFDF6] hover:bg-[#F8F4EA] text-[#0E4D34] border-2 border-[#D9CBB0] rounded-full text-sm font-bold shadow-sm cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh (ESC)' : 'Mode Layar Penuh'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline font-['Montserrat']">{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
          </button>

          {onOpenAbout && (
            <button
              onClick={() => {
                sfx.playClick();
                onOpenAbout();
              }}
              className="btn-kafilah flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFDF6] hover:bg-[#F8F4EA] text-[#1B6B47] border-2 border-[#D9CBB0] rounded-full text-sm font-bold shadow-sm cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span className="font-['Montserrat']">Tentang</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Utama Bergaya Cover Proposal PDF: Kiri Teks & Aksi, Kanan Bingkai Mihrab */}
      <main className="w-full max-w-7xl mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Kolom Kiri: Judul Cover PDF & Tombol Aksi */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E4D34]/10 border border-[#0E4D34]/30 text-[#0E4D34] font-bold text-xs uppercase tracking-widest font-['Montserrat'] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04A]" /> Game Edukasi Al-Qur'an Smart TV
          </div>

          <h1 className="font-['Montserrat'] font-black tracking-tight leading-[1.05] mb-2 flex flex-col">
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#0E4D34]">
              PETUALANGAN
            </span>
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradien-emas font-black">
              JUZ 'AMMA
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-medium font-['Montserrat'] text-[#2B2A26]/85 max-w-xl mb-6 leading-relaxed">
            Menyusuri 37 Pos Oase & Lentera Ilmu Bersama Kafilah Cilik dalam petualangan hafalan Al-Qur'an yang mulia dan menyenangkan.
          </p>

          {/* Pengaturan Singkat Kelas & Tingkat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-8">
            {/* Rombel */}
            <div className="bg-[#FFFDF6] p-4 rounded-[22px] border-2 border-[#0E4D34]/30 shadow-sm">
              <div className="flex items-center gap-2 text-[#0E4D34] mb-2">
                <Users className="w-4 h-4 text-[#1B6B47]" />
                <span className="text-sm font-bold font-['Montserrat']">Rombel Kelas</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableClasses.map((kelas) => (
                  <button
                    key={kelas}
                    onClick={() => {
                      sfx.playClick();
                      onSelectClass(kelas);
                    }}
                    className={`py-1.5 px-1 rounded-xl font-black text-sm font-['Montserrat'] border transition-all cursor-pointer ${
                      selectedClass === kelas
                        ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-sm'
                        : 'bg-[#F8F4EA] text-[#2B2A26] border-[#D9CBB0] hover:bg-[#E9E1D0]'
                    }`}
                  >
                    {kelas}
                  </button>
                ))}
              </div>
            </div>

            {/* Tingkat */}
            <div className="bg-[#FFFDF6] p-4 rounded-[22px] border-2 border-[#0E4D34]/30 shadow-sm">
              <div className="flex items-center gap-2 text-[#0E4D34] mb-2">
                <Compass className="w-4 h-4 text-[#C9A04A]" />
                <span className="text-sm font-bold font-['Montserrat']">Tingkat Ekspedisi</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {levels.map((item) => (
                  <button
                    key={item.level}
                    onClick={() => {
                      sfx.playClick();
                      onSelectLevel(item.level);
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-bold font-['Montserrat'] transition-all cursor-pointer ${
                      selectedLevel === item.level
                        ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34]'
                        : 'bg-[#F8F4EA] text-[#2B2A26] border-[#D9CBB0] hover:bg-[#E9E1D0]'
                    }`}
                  >
                    <span>{item.label} ({item.wilayah})</span>
                    {selectedLevel === item.level && (
                      <span className="text-[#F3D88A] text-[10px]">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dua Tombol Aksi Utama: Mulai Petualangan (Emas) & Duel Tim (Zamrud) */}
          <div className="flex flex-wrap items-center gap-4 w-full max-w-xl">
            <TombolBesar
              variant="emas"
              size="large"
              icon={<Compass className="w-8 h-8 text-[#0E4D34]" />}
              onClick={onStartAdventure}
              className="flex-1 min-w-[240px]"
            >
              Mulai Petualangan
            </TombolBesar>

            <TombolBesar
              variant="zamrud"
              size="large"
              icon={<Swords className="w-8 h-8 text-[#FFFDF6]" />}
              onClick={() => {
                if (onStartDuel) {
                  onStartDuel();
                } else {
                  onStartAdventure();
                }
              }}
              className="flex-1 min-w-[220px]"
            >
              Duel Tim
            </TombolBesar>
          </div>
        </div>

        {/* Kolom Kanan: Bingkai Mihrab Ganda Berisi Pemandangan Lembah Fajar */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-sm md:max-w-md">
            <BingkaiMihrab
              imageSrc="/scenes/lembah-fajar.webp"
              altText="Pemandangan Lembah Fajar"
              className="w-full"
            />
            {/* Tag Wilayah Emas Melayang */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] text-[#0E4D34] px-6 py-2 rounded-full border-2 border-white shadow-xl flex items-center gap-2 whitespace-nowrap">
              <LenteraFanus isLit={true} size={20} />
              <span className="font-['Montserrat'] font-black text-sm uppercase tracking-wider">
                Lembah Fajar • Wilayah 1
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer & Tombol Mode Guru */}
      <footer className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 pt-4 border-t border-[#E9E1D0]">
        <div className="flex items-center gap-3">
          <MaskotNur size={34} expression="happy" />
          <span className="font-['Montserrat'] font-semibold text-xs md:text-sm text-[#0E4D34]">
            "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
          </span>
        </div>

        {/* Tombol Mode Guru (Tahan 2 Detik) */}
        <div className="relative">
          <button
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            className="btn-kafilah relative flex items-center gap-2 px-4 py-2 bg-[#FFFDF6] hover:bg-[#F8F4EA] text-[#0E4D34] border-2 border-[#D9CBB0] rounded-full text-xs md:text-sm font-bold shadow-sm select-none cursor-pointer"
            title="Tahan 2 detik untuk membuka Mode Guru"
          >
            <ShieldCheck className="w-4 h-4 text-[#1B6B47]" />
            <span className="font-['Montserrat']">Mode Guru</span>
            {holdProgress > 0 && (
              <span className="text-xs text-[#C9A04A] font-black">({holdProgress}%)</span>
            )}
          </button>
        </div>
      </footer>

      {/* PIN Modal untuk Mode Guru */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFDF6] p-8 rounded-[28px] border-2 border-[#C9A04A] max-w-md w-full text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#F8F4EA] flex items-center justify-center mx-auto mb-4 border-2 border-[#D9CBB0]">
              <KeyRound className="w-7 h-7 text-[#0E4D34]" />
            </div>

            <h3 className="text-2xl font-black font-['Marcellus'] text-[#0E4D34] mb-2">
              Akses Mode Guru
            </h3>
            <p className="text-sm font-['Montserrat'] text-[#2B2A26]/80 mb-6">
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
              className="w-full text-center text-3xl font-black tracking-widest py-3 px-4 rounded-2xl bg-[#F8F4EA] border-2 border-[#D9CBB0] focus:outline-none focus:border-[#0E4D34] text-[#2B2A26] mb-4 font-['Marcellus']"
            />

            {pinError && (
              <p className="text-sm font-bold text-[#C0603A] mb-4 font-['Montserrat']">
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
                className="flex-1 py-3 rounded-full font-bold font-['Montserrat'] bg-[#F8F4EA] hover:bg-[#E9E1D0] text-[#2B2A26] border border-[#D9CBB0] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handlePinSubmit}
                className="flex-1 py-3 rounded-full font-bold font-['Montserrat'] bg-[#0E4D34] hover:bg-[#155E40] text-[#FFFDF6] shadow-md cursor-pointer"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </TeksturMarmer>
  );
};
