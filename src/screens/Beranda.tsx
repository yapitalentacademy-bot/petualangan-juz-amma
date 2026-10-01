import React, { useState } from 'react';
import { TombolBesar } from '../components/TombolBesar';
import { Compass, Users, Sparkles, ShieldCheck, BookOpen, KeyRound, Star, Award, Info, Maximize, Minimize } from 'lucide-react';
import { KelasLevel } from '../types/surah';
import { sfx } from '../lib/audioPlayer';
import { useFullscreen } from '../lib/useFullscreen';

interface BerandaProps {
  onStartAdventure: () => void;
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

  const availableClasses = ['4A', '4B', '5A', '5B', '6A', '6B'];
  const levels: { level: KelasLevel; label: string; desc: string }[] = [
    { level: 4, label: 'Kelas 4', desc: 'Ad-Dhuha s.d. An-Nas (93–114)' },
    { level: 5, label: 'Kelas 5', desc: "Al-A'la s.d. An-Nas (87–114)" },
    { level: 6, label: 'Kelas 6', desc: "An-Naba' s.d. An-Nas (78–114)" },
  ];

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handlePinSubmit = () => {
    // Default PIN: 1234 or 0000
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

  return (
    <div className="min-h-screen bg-oasis-pattern flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Oasis/Desert Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 z-10 max-w-7xl">
        <div className="flex items-center gap-3 bg-slate-950/80 px-6 py-3 rounded-2xl border-2 border-emerald-500/60 shadow-lg backdrop-blur-md">
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-emerald-300 font-display">
            Treasure Edition • Petualangan Smart TV
          </span>
        </div>

        {/* Badges, Stars & Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/90 to-amber-900/90 border-2 border-amber-400/70 px-5 py-2.5 rounded-2xl text-amber-300 font-extrabold shadow-lg">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-bounce" />
            <span className="text-xl">{totalStars} Bintang</span>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/90 to-emerald-900/90 border-2 border-emerald-400/70 px-5 py-2.5 rounded-2xl text-emerald-300 font-extrabold shadow-lg">
            <Award className="w-6 h-6 text-emerald-400" />
            <span className="text-xl">{badges.length} Lencana</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              sfx.playClick();
              toggleFullscreen();
            }}
            className="touch-btn flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border-2 border-amber-400/60 rounded-2xl text-lg font-black cursor-pointer shadow-md"
            title={isFullscreen ? 'Keluar Layar Penuh (ESC)' : 'Mode Layar Penuh (Fullscreen)'}
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-5 h-5" />
                <span className="hidden sm:inline">Kecilkan</span>
              </>
            ) : (
              <>
                <Maximize className="w-5 h-5" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </>
            )}
          </button>

          {onOpenAbout && (
            <button
              onClick={() => {
                sfx.playClick();
                onOpenAbout();
              }}
              className="touch-btn flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-stone-300 hover:text-cyan-300 border-2 border-stone-600 rounded-2xl text-lg font-black cursor-pointer shadow-md"
            >
              <Info className="w-5 h-5 text-cyan-400" />
              <span>Tentang</span>
            </button>
          )}

          <button
            onClick={() => {
              sfx.playClick();
              setShowPinModal(true);
            }}
            className="touch-btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-700/80 to-amber-900/90 hover:from-amber-600 hover:to-amber-800 text-amber-100 border-2 border-amber-400/70 rounded-2xl text-lg font-black cursor-pointer shadow-lg"
          >
            <ShieldCheck className="w-6 h-6 text-amber-300" />
            <span>Mode Guru</span>
          </button>
        </div>
      </div>

      {/* Main Hero Treasure Stone Banner */}
      <div className="flex flex-col items-center text-center my-4 z-10 max-w-5xl">
        <div className="relative p-6 md:p-8 rounded-3xl stone-plaque max-w-4xl w-full flex flex-col items-center mb-4">
          {/* Corner Rivet Screws (Explorer Device Detail) */}
          <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
          <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
          <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />

          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-emerald-900/90 border border-emerald-400/80 rounded-full text-emerald-200 font-extrabold text-base mb-2 shadow-inner">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            37 Pos Petualangan Harta Karun Al-Qur'an
          </div>

          <h1 className="text-5xl md:text-7xl font-black gold-title-3d font-display mb-1 drop-shadow-2xl">
            PETUALANGAN JUZ 'AMMA
          </h1>

          <p className="text-xl md:text-2xl text-emerald-100/90 font-bold max-w-3xl mt-1">
            Jelajahi 37 Surah Juz 30 Bersama Teman Sekelas di Layar Sentuh TV
          </p>
        </div>
      </div>

      {/* Class and Level Selection Panel */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10 my-2">
        {/* Pilih Kelas */}
        <div className="glass-panel p-7 rounded-3xl flex flex-col justify-between border-2 border-amber-500/40">
          <div className="flex items-center gap-3 text-amber-300 mb-5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50">
              <Users className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="text-3xl font-extrabold font-display">Pilih Kelas</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                    touch-btn py-5 px-4 rounded-2xl font-black text-2xl border-3 transition-all cursor-pointer shadow-md
                    ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-200 shadow-gold-glow scale-105 ring-4 ring-amber-400/30'
                        : 'bg-slate-900/90 text-stone-200 border-slate-700 hover:border-amber-400/70 hover:bg-slate-800'
                    }
                  `}
                >
                  {kelas}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pilih Tingkat / Level */}
        <div className="glass-panel p-7 rounded-3xl flex flex-col justify-between border-2 border-emerald-500/40">
          <div className="flex items-center gap-3 text-emerald-300 mb-5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50">
              <Compass className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-extrabold font-display">Tingkat Ekspedisi</h2>
          </div>

          <div className="flex flex-col gap-3">
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
                    touch-btn flex items-center justify-between p-4 px-6 rounded-2xl border-2 transition-all text-left cursor-pointer shadow-md
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-950/95 to-emerald-900/95 border-emerald-400 text-emerald-100 ring-4 ring-emerald-500/40 shadow-card-glow'
                        : 'bg-slate-900/90 border-slate-700 text-stone-300 hover:border-emerald-400/70 hover:bg-slate-800'
                    }
                  `}
                >
                  <div>
                    <span className="text-2xl font-black text-amber-200">{item.label}</span>
                    <p className="text-sm md:text-base text-stone-300 mt-0.5">{item.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 font-black px-4 py-1.5 rounded-xl text-sm shadow-md">
                      Aktif
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary Big Start Button */}
      <div className="mt-6 mb-2 z-10">
        <TombolBesar
          variant="oasis"
          size="large"
          icon={<Compass className="w-12 h-12" />}
          onClick={onStartAdventure}
          className="shadow-2xl ring-8 ring-emerald-500/20"
        >
          Mulai Petualangan Pos
        </TombolBesar>
      </div>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-panel p-10 rounded-3xl border-4 border-amber-500/50 max-w-lg w-full flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mb-6">
              <KeyRound className="w-10 h-10" />
            </div>

            <h3 className="text-3xl font-black text-amber-300 font-display mb-2">
              Masuk Mode Guru
            </h3>
            <p className="text-stone-300 text-lg mb-6 text-center">
              Masukkan PIN 4-digit guru untuk mengakses pengaturan dan rekap progres.
            </p>

            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-5xl tracking-[1em] font-mono py-4 px-6 bg-stone-900 border-2 border-amber-500/60 rounded-2xl text-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-500/50 mb-4"
              autoFocus
            />

            {pinError && (
              <p className="text-rose-400 text-lg font-bold mb-4 animate-shake">
                PIN salah! Gunakan PIN default: 1234
              </p>
            )}

            <div className="flex gap-4 w-full mt-4">
              <TombolBesar
                variant="ghost"
                size="normal"
                className="flex-1"
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError(false);
                }}
              >
                Batal
              </TombolBesar>

              <TombolBesar
                variant="desert"
                size="normal"
                className="flex-1"
                onClick={handlePinSubmit}
              >
                Buka
              </TombolBesar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
