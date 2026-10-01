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
      <div className="w-full flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4 bg-stone-900/80 px-6 py-3 rounded-2xl border border-stone-800">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <span className="text-xl font-bold text-amber-200">
            Juz 'Amma Touch Adventure • Smart TV Edition
          </span>
        </div>

        {/* Badges, Stars & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-500/50 px-4 py-2 rounded-xl text-amber-300 font-bold">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{totalStars} Bintang</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-300 font-bold">
            <Award className="w-5 h-5" />
            <span>{badges.length} Lencana</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              sfx.playClick();
              toggleFullscreen();
            }}
            className="touch-btn flex items-center gap-2 px-4 py-2.5 bg-stone-900/80 hover:bg-stone-800 text-amber-300 hover:text-amber-200 border border-amber-500/50 rounded-2xl text-lg font-bold cursor-pointer"
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
              className="touch-btn flex items-center gap-2 px-4 py-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-cyan-300 border border-stone-700/80 rounded-2xl text-lg font-bold cursor-pointer"
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
            className="touch-btn flex items-center gap-2 px-5 py-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-700/80 rounded-2xl text-lg font-bold cursor-pointer"
          >
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Mode Guru</span>
          </button>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div className="flex flex-col items-center text-center my-6 z-10 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-950/80 border border-emerald-500/60 rounded-full text-emerald-300 font-bold text-lg mb-4">
          <BookOpen className="w-5 h-5" />
          37 Pos Petualangan Surah
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight font-display mb-3 drop-shadow-lg">
          Petualangan Juz 'Amma
        </h1>

        <p className="text-2xl md:text-3xl text-stone-200 font-medium max-w-3xl leading-relaxed">
          Belajar, Menghafal, dan Memahami 37 Surah Juz 30 Bersama Teman Sekelas di Layar Sentuh TV
        </p>
      </div>

      {/* Class and Level Selection Panel */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10 my-4">
        {/* Pilih Kelas */}
        <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center gap-3 text-amber-300 mb-6">
            <Users className="w-8 h-8" />
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
                    touch-btn py-5 px-4 rounded-2xl font-black text-2xl border-3 transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-gold-glow scale-105'
                        : 'bg-stone-900/90 text-stone-300 border-stone-700 hover:border-stone-500'
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
        <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center gap-3 text-emerald-300 mb-6">
            <Compass className="w-8 h-8" />
            <h2 className="text-3xl font-extrabold font-display">Tingkat Kesulitan</h2>
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
                    touch-btn flex items-center justify-between p-4 px-6 rounded-2xl border-2 transition-all text-left cursor-pointer
                    ${
                      isSelected
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/50 shadow-card-glow'
                        : 'bg-stone-900/90 border-stone-700 text-stone-300 hover:border-stone-500'
                    }
                  `}
                >
                  <div>
                    <span className="text-2xl font-black">{item.label}</span>
                    <p className="text-sm md:text-base text-stone-400 mt-0.5">{item.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-xl text-sm">
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
