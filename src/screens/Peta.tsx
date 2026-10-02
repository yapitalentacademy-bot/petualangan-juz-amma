import React, { useState } from 'react';
import { HeaderNav } from '../components/HeaderNav';
import surahListData from '../data/surah-list.json';
import { SurahMeta } from '../types/surah';
import { Lock, Flag, Sparkles } from 'lucide-react';
import { sfx } from '../lib/audioPlayer';
import { BintangDelapan } from '../components/ornaments/BintangDelapan';
import { LenteraFanus } from '../components/ornaments/LenteraFanus';
import { LatarParallax, WilayahType } from '../components/LatarParallax';

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
  focusSurahId = 114,
  badges = [],
  onSelectSurah,
  onBackToHome,
  onOpenTeacherMode,
  classNameLabel,
  levelLabel,
  soundEnabled,
  onToggleSound,
}) => {
  // Jalur dari An-Nas (114) ke An-Naba' (78) sesuai urutan menghafal anak SD (DESIGN.md)
  const surahsOrdered = [...(surahListData as SurahMeta[])].sort((a, b) => b.id - a.id);
  const totalStars = Object.values(surahProgress).reduce((acc, curr) => acc + (curr?.stars || 0), 0);

  // Filter tab wilayah aktif
  const [activeTabWilayah, setActiveTabWilayah] = useState<'semua' | 'oase' | 'senja' | 'puncak'>('semua');

  const getWilayahInfo = (surahId: number) => {
    if (surahId >= 93 && surahId <= 114) {
      return { nama: 'Oase Fajar', kelas: 'Kelas 4', warna: '#0F7A5C', bgClass: 'bg-[#F0FAF6] border-[#0F7A5C]' };
    }
    if (surahId >= 87 && surahId <= 92) {
      return { nama: 'Lembah Senja', kelas: 'Kelas 5', warna: '#C0603A', bgClass: 'bg-[#FDF6F2] border-[#C0603A]' };
    }
    return { nama: 'Puncak Bintang', kelas: 'Kelas 6', warna: '#1E6F8C', bgClass: 'bg-[#F0F8FA] border-[#1E6F8C]' };
  };

  // Tentukan wilayah parallax dinamis
  const getActiveParallaxWilayah = (): WilayahType => {
    if (activeTabWilayah === 'senja' || (activeTabWilayah === 'semua' && levelLabel === 5)) {
      return 'gurun-senja';
    }
    if (activeTabWilayah === 'puncak' || (activeTabWilayah === 'semua' && levelLabel === 6)) {
      return 'pegunungan-bintang';
    }
    return 'lembah-fajar';
  };

  const displayedSurahs = surahsOrdered.filter((s) => {
    if (activeTabWilayah === 'oase') return s.id >= 93 && s.id <= 114;
    if (activeTabWilayah === 'senja') return s.id >= 87 && s.id <= 92;
    if (activeTabWilayah === 'puncak') return s.id >= 78 && s.id <= 86;
    return true;
  });

  return (
    <LatarParallax wilayah={getActiveParallaxWilayah()} className="min-h-screen">
      <div className="min-h-screen flex flex-col text-[#14233C] bg-white/30 backdrop-blur-[2px]">
      <HeaderNav
        title="Peta Kafilah 37 Pos Juz 'Amma"
        subtitle="Jalur Ekspedisi dari An-Nas (114) s.d. An-Naba' (78)"
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
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Banner Wilayah & Info Kafilah */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 mb-6 rounded-[24px] bg-[#FFFDF7] border-2 border-[#D4A23A] shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F6EBD9] text-[#0B4F3E] rounded-2xl border-2 border-[#E8D2A6] shadow-sm">
              <Sparkles className="w-8 h-8 text-[#D4A23A]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#0B4F3E] font-judul">
                Jalur Kafilah Cahaya 37 Pos
              </h2>
              <p className="text-base text-[#14233C]/80 font-teks font-bold">
                Mulai dari An-Nas (114) $\rightarrow$ An-Naba' (78). Nyalakan lentera dan raih bintang di setiap pos!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stars Count */}
            <div className="flex items-center gap-2 bg-[#F6EBD9] border-2 border-[#D4A23A] px-4 py-2 rounded-full shadow-sm">
              <BintangDelapan filled={true} size={24} />
              <span className="text-lg font-black text-[#0B4F3E] font-teks">{totalStars} Bintang</span>
            </div>

            {/* Badges Count */}
            <div className="flex items-center gap-2 bg-[#F6EBD9] border-2 border-[#0F7A5C] px-4 py-2 rounded-full shadow-sm">
              <LenteraFanus isLit={true} size={22} />
              <span className="text-lg font-black text-[#0F7A5C] font-teks">{badges.length} Lencana</span>
            </div>
          </div>
        </div>

        {/* Tab Filter Tiga Wilayah (DESIGN.md) */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => {
              sfx.playClick();
              setActiveTabWilayah('semua');
            }}
            className={`btn-kafilah px-5 py-2.5 rounded-full font-teks font-bold text-base border-2 transition-all ${
              activeTabWilayah === 'semua'
                ? 'bg-[#0B4F3E] text-[#FFFDF7] border-[#0B4F3E] shadow-sm'
                : 'bg-[#FFFDF7] text-[#14233C] border-[#E8D2A6] hover:bg-[#F6EBD9]'
            }`}
          >
            Semua Pos (37 Surah)
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setActiveTabWilayah('oase');
            }}
            className={`btn-kafilah px-5 py-2.5 rounded-full font-teks font-bold text-base border-2 transition-all ${
              activeTabWilayah === 'oase'
                ? 'bg-[#0F7A5C] text-[#FFFDF7] border-[#0B4F3E] shadow-sm'
                : 'bg-[#FFFDF7] text-[#0F7A5C] border-[#E8D2A6] hover:bg-[#F0FAF6]'
            }`}
          >
            🌴 Oase Fajar • Kelas 4 (Pos 114–93)
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setActiveTabWilayah('senja');
            }}
            className={`btn-kafilah px-5 py-2.5 rounded-full font-teks font-bold text-base border-2 transition-all ${
              activeTabWilayah === 'senja'
                ? 'bg-[#C0603A] text-[#FFFDF7] border-[#8F3D1F] shadow-sm'
                : 'bg-[#FFFDF7] text-[#C0603A] border-[#E8D2A6] hover:bg-[#FDF6F2]'
            }`}
          >
            🏜️ Lembah Senja • Kelas 5 (Pos 92–87)
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setActiveTabWilayah('puncak');
            }}
            className={`btn-kafilah px-5 py-2.5 rounded-full font-teks font-bold text-base border-2 transition-all ${
              activeTabWilayah === 'puncak'
                ? 'bg-[#1E6F8C] text-[#FFFDF7] border-[#134B5F] shadow-sm'
                : 'bg-[#FFFDF7] text-[#1E6F8C] border-[#E8D2A6] hover:bg-[#F0F8FA]'
            }`}
          >
            ⭐ Puncak Bintang • Kelas 6 (Pos 86–78)
          </button>
        </div>

        {/* 37-Stations Grid Map (Mulai dari An-Nas 114) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 pb-16">
          {displayedSurahs.map((surah, index) => {
            const isUnlocked = unlockedSurahIds.includes(surah.id);
            const isFocus = focusSurahId === surah.id;
            const stars = surahProgress[surah.id]?.stars || 0;
            const isTuntas = stars >= 1;
            const urutanKe = index + 1;
            const wilayahInfo = getWilayahInfo(surah.id);

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
                  btn-kafilah relative flex flex-col justify-between items-center p-5 rounded-[24px] border-2 min-h-[190px] select-none transition-all cursor-pointer text-[#14233C]
                  ${
                    isUnlocked
                      ? isFocus
                        ? 'bg-[#FFFDF7] border-[#D4A23A] ring-4 ring-[#D4A23A]/50 shadow-xl scale-105'
                        : isTuntas
                        ? 'bg-[#FFFDF7] border-[#0F7A5C] shadow-md hover:border-[#D4A23A]'
                        : 'bg-[#FFFDF7] border-[#E8D2A6] shadow-sm hover:border-[#0F7A5C]'
                      : 'bg-[#E8D2A6]/50 border-[#D5BE93] text-[#14233C]/40 filter grayscale opacity-70 cursor-not-allowed'
                  }
                `}
              >
                {/* Bendera Kafilah Aktif / Pos Fokus */}
                {isFocus && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <span className="flex items-center gap-1 bg-[#0F7A5C] text-[#FFFDF7] font-black text-xs px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider font-teks">
                      <Flag className="w-3.5 h-3.5 fill-[#FFFDF7]" /> Pos Kafilah
                    </span>
                  </div>
                )}

                {/* Nomor Urut Pos & Status Icon */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-black text-sm font-teks
                      ${isUnlocked ? 'bg-[#F6EBD9] text-[#0B4F3E] border border-[#E8D2A6]' : 'bg-[#D5BE93] text-[#14233C]/40'}
                    `}
                  >
                    {urutanKe}
                  </span>

                  <span className="text-[10px] font-bold text-[#14233C]/60 px-2 py-0.5 rounded-full bg-[#E8D2A6]/40">
                    {wilayahInfo.kelas}
                  </span>

                  {isUnlocked ? (
                    <LenteraFanus isLit={isTuntas} size={22} />
                  ) : (
                    <Lock className="w-5 h-5 text-[#8F3D1F]/60" />
                  )}
                </div>

                {/* Nama Surah Arab (Amiri) & Latin (Baloo 2) */}
                <div className="flex flex-col items-center text-center my-2">
                  <span
                    dir="rtl"
                    className={`
                      font-arab-hiasan text-2xl font-bold mb-0.5
                      ${isUnlocked ? 'text-[#0B4F3E]' : 'text-[#14233C]/40'}
                    `}
                  >
                    {surah.namaArab}
                  </span>

                  <span
                    className={`
                      text-lg font-black font-judul leading-tight
                      ${isUnlocked ? 'text-[#14233C]' : 'text-[#14233C]/40'}
                    `}
                  >
                    {surah.namaLatin}
                  </span>

                  <span className="text-xs text-[#14233C]/70 font-teks font-medium truncate max-w-[130px] mt-0.5">
                    {surah.arti}
                  </span>
                </div>

                {/* Bintang Delapan Khatam (1-3) */}
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3].map((starIdx) => {
                    const isEarned = isUnlocked && starIdx <= stars;
                    return (
                      <BintangDelapan
                        key={starIdx}
                        filled={isEarned}
                        size={20}
                        className={isEarned ? 'drop-shadow-sm' : 'opacity-30'}
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
    </LatarParallax>
  );
};

