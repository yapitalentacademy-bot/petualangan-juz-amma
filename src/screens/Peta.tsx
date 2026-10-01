import React from 'react';
import { HeaderNav } from '../components/HeaderNav';
import surahListData from '../data/surah-list.json';
import { SurahMeta } from '../types/surah';
import { Lock, Star, Sparkles, Award } from 'lucide-react';
import { sfx } from '../lib/audioPlayer';

interface PetaProps {
  unlockedSurahIds: number[];
  surahProgress: {
    [surahId: number]: {
      stars: number;
      skorTertinggi: number;
    };
  };
  focusSurahId?: number;
  badges?: string[];
  onSelectSurah: (surahId: number) => void;
  onBackToHome: () => void;
  onOpenTeacherMode: () => void;
  classNameLabel: string;
  levelLabel: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Peta: React.FC<PetaProps> = ({
  unlockedSurahIds,
  surahProgress,
  focusSurahId = 105,
  badges = [],
  onSelectSurah,
  onBackToHome,
  onOpenTeacherMode,
  classNameLabel,
  levelLabel,
  soundEnabled,
  onToggleSound,
}) => {
  const surahs: SurahMeta[] = surahListData as SurahMeta[];
  const totalStars = Object.values(surahProgress).reduce((acc, curr) => acc + curr.stars, 0);

  return (
    <div className="min-h-screen bg-oasis-pattern flex flex-col">
      <HeaderNav
        title="Peta 37 Pos Juz 'Amma"
        subtitle="Sentuh pos surah untuk memulai hafalan dan mini-game"
        showBackToMap={false}
        showBackToHome={true}
        onBackToHome={onBackToHome}
        onOpenTeacherMode={onOpenTeacherMode}
        classNameLabel={classNameLabel}
        levelLabel={levelLabel}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
      />

      {/* Map Content Container */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Progress & Focus Surah Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 mb-8 rounded-3xl stone-plaque border-2 border-emerald-400/50 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-amber-200 font-display">
                Peta 37 Pos Ekspedisi Juz 'Amma
              </h2>
              <p className="text-base text-emerald-100/90 font-bold">
                Jelajahi setiap pos pulau untuk mengumpulkan bintang emas dan membuka surah berikutnya!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stars Count */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/90 to-amber-900/90 border-2 border-amber-400/80 px-5 py-2.5 rounded-2xl shadow-md">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-black text-amber-200">{totalStars} Bintang</span>
            </div>

            {/* Badges Count */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/90 to-emerald-900/90 border-2 border-emerald-400/80 px-5 py-2.5 rounded-2xl shadow-md">
              <Award className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-black text-emerald-200">{badges.length} Lencana</span>
            </div>
          </div>
        </div>

        {/* 37-Stations Grid Map */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 pb-16">
          {surahs.map((surah) => {
            const isUnlocked = unlockedSurahIds.includes(surah.id);
            const isFocus = focusSurahId === surah.id;
            const stars = surahProgress[surah.id]?.stars || 0;

            return (
              <div
                key={surah.id}
                onClick={() => {
                  if (isUnlocked) {
                    sfx.playClick();
                    onSelectSurah(surah.id);
                  } else {
                    sfx.playWrong();
                  }
                }}
                className={`
                  touch-btn relative flex flex-col justify-between items-center p-6 rounded-3xl border-4 min-h-[200px] select-none transition-all duration-100 cursor-pointer
                  ${
                    isUnlocked
                      ? isFocus
                        ? 'bg-gradient-to-b from-amber-900/95 via-emerald-950/95 to-slate-950/95 border-amber-300 ring-4 ring-amber-400/80 shadow-gold-glow scale-105'
                        : 'bg-gradient-to-b from-slate-900/95 via-emerald-950/90 to-slate-950/95 border-emerald-500/80 hover:border-amber-400 shadow-card-glow active:scale-95'
                      : 'bg-slate-950/90 border-slate-800 text-slate-600 opacity-60 filter grayscale cursor-not-allowed'
                  }
                `}
              >
                {/* Focus Surah Crown Badge */}
                {isFocus && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-lg uppercase tracking-wider border border-amber-200">
                      ★ Fokus Pos Ini
                    </span>
                  </div>
                )}

                {/* Station Number Badge */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg
                      ${isUnlocked ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md border border-amber-300' : 'bg-slate-800 text-slate-500'}
                    `}
                  >
                    {surah.urutanPos}
                  </span>

                  {isUnlocked ? (
                    <span className="text-xs font-black px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/70 rounded-lg shadow-sm">
                      {surah.jumlahAyat} Ayat
                    </span>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                {/* Surah Name & Arabic */}
                <div className="flex flex-col items-center text-center my-3">
                  <span
                    dir="rtl"
                    className={`
                      font-quran text-3xl font-bold mb-1
                      ${isUnlocked ? 'text-amber-200 drop-shadow' : 'text-slate-600'}
                    `}
                  >
                    {surah.namaArab}
                  </span>

                  <span
                    className={`
                      text-xl font-black font-sans leading-tight
                      ${isUnlocked ? 'text-white' : 'text-slate-500'}
                    `}
                  >
                    {surah.namaLatin}
                  </span>

                  <span className="text-xs text-emerald-300/80 font-bold truncate max-w-[140px] mt-0.5">
                    {surah.arti}
                  </span>
                </div>

                {/* Stars container */}
                <div className="flex items-center gap-1.5 mt-2">
                  {[1, 2, 3].map((starIdx) => {
                    const isEarned = isUnlocked && starIdx <= stars;
                    return (
                      <Star
                        key={starIdx}
                        className={`
                          w-6 h-6
                          ${
                            isEarned
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-md'
                              : 'text-slate-800'
                          }
                        `}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
