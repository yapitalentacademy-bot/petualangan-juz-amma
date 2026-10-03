import React, { useState } from 'react';
import { HeaderNav } from '../components/HeaderNav';
import surahListData from '../data/surah-list.json';
import { SurahMeta } from '../types/surah';
import { Lock, Flag, Sparkles, LayoutGrid, Milestone } from 'lucide-react';
import { sfx } from '../lib/audioPlayer';
import { BintangDelapan } from '../components/ornaments/BintangDelapan';
import { LenteraFanus } from '../components/ornaments/LenteraFanus';
import { LatarParallax, WilayahType } from '../components/LatarParallax';
import { OrnamenSudut } from '../components/ornaments/OrnamenSudut';

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
  // Jalur dari An-Nas (114) ke An-Naba' (78)
  const surahsOrdered = [...(surahListData as SurahMeta[])].sort((a, b) => b.id - a.id);
  const totalStars = Object.values(surahProgress).reduce((acc, curr) => acc + (curr?.stars || 0), 0);

  // Mode Tampilan: Jalur Alur Experience (Default) vs Grid Peta
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  // Filter tab wilayah aktif
  const [activeTabWilayah, setActiveTabWilayah] = useState<'semua' | 'oase' | 'senja' | 'puncak'>('semua');

  const getWilayahInfo = (surahId: number) => {
    if (surahId >= 93 && surahId <= 114) {
      return { nama: 'Lembah Fajar', kelas: 'Kelas 4' };
    }
    if (surahId >= 87 && surahId <= 92) {
      return { nama: 'Gurun Senja', kelas: 'Kelas 5' };
    }
    return { nama: 'Pegunungan Bintang', kelas: 'Kelas 6' };
  };

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
      <div className="min-h-screen flex flex-col text-[#2B2A26] bg-[#F8F4EA]/85 backdrop-blur-[2px] relative overflow-x-hidden">
        <OrnamenSudut variant="atas-saja" />

        <HeaderNav
          title="Peta Ekspedisi 37 Pos Juz 'Amma"
          subtitle="Jalur Emas dari An-Nas (114) s.d. An-Naba' (78)"
          showBackToMap={false}
          showBackToHome={true}
          onBackToHome={onBackToHome}
          onOpenTeacherMode={onOpenTeacherMode}
          classNameLabel={classNameLabel}
          levelLabel={levelLabel}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full z-10 flex flex-col justify-between">
          {/* Top Banner Proposal */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 mb-6 rounded-[28px] bg-[#FFFDF6] border-2 border-[#0E4D34] shadow-lg shadow-[#C9A04A]/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] rounded-2xl border border-white shadow-sm">
                <Sparkles className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#0E4D34] font-['Marcellus']">
                  Rangkaian Jalur Ekspedisi Santri
                </h2>
                <p className="text-sm md:text-base text-[#2B2A26]/80 font-['Montserrat'] font-semibold">
                  Menyusuri 37 pos surah dengan simpul emas. Tuntaskan tantangan untuk menyalakan lentera!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Stars Count */}
              <div className="flex items-center gap-2 bg-[#F8F4EA] border-2 border-[#C9A04A] px-4 py-2 rounded-full shadow-sm">
                <BintangDelapan filled={true} size={22} />
                <span className="text-base font-black font-['Montserrat'] text-[#0E4D34]">{totalStars} Bintang</span>
              </div>

              {/* Badges Count */}
              <div className="flex items-center gap-2 bg-[#F8F4EA] border-2 border-[#0E4D34] px-4 py-2 rounded-full shadow-sm">
                <LenteraFanus isLit={true} size={20} />
                <span className="text-base font-black font-['Montserrat'] text-[#0E4D34]">{badges.length} Lencana</span>
              </div>

              {/* Toggle Switcher Timeline / Grid */}
              <button
                onClick={() => {
                  sfx.playClick();
                  setViewMode(viewMode === 'timeline' ? 'grid' : 'timeline');
                }}
                className="btn-kafilah flex items-center gap-1.5 px-4 py-2 bg-[#0E4D34] text-[#FFFDF6] rounded-full text-sm font-bold border border-[#3A9D6A] shadow-sm cursor-pointer ml-2"
                title={viewMode === 'timeline' ? 'Beralih ke Tampilan Grid' : 'Beralih ke Jalur Garis Emas (Experience)'}
              >
                {viewMode === 'timeline' ? (
                  <>
                    <LayoutGrid className="w-4 h-4" />
                    <span>Mode Grid</span>
                  </>
                ) : (
                  <>
                    <Milestone className="w-4 h-4" />
                    <span>Mode Jalur</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tab Filter Tiga Wilayah */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => {
                sfx.playClick();
                setActiveTabWilayah('semua');
              }}
              className={`btn-kafilah px-5 py-2.5 rounded-full font-['Montserrat'] font-bold text-sm md:text-base border-2 transition-all cursor-pointer ${
                activeTabWilayah === 'semua'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-md'
                  : 'bg-[#FFFDF6] text-[#2B2A26] border-[#D9CBB0] hover:bg-[#F8F4EA]'
              }`}
            >
              Semua Pos (37 Surah)
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTabWilayah('oase');
              }}
              className={`btn-kafilah px-5 py-2.5 rounded-full font-['Montserrat'] font-bold text-sm md:text-base border-2 transition-all cursor-pointer ${
                activeTabWilayah === 'oase'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-md'
                  : 'bg-[#FFFDF6] text-[#0E4D34] border-[#D9CBB0] hover:bg-[#F8F4EA]'
              }`}
            >
              🌴 Lembah Fajar • Kelas 4 (Pos 114–93)
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTabWilayah('senja');
              }}
              className={`btn-kafilah px-5 py-2.5 rounded-full font-['Montserrat'] font-bold text-sm md:text-base border-2 transition-all cursor-pointer ${
                activeTabWilayah === 'senja'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-md'
                  : 'bg-[#FFFDF6] text-[#C9A04A] border-[#D9CBB0] hover:bg-[#F8F4EA]'
              }`}
            >
              🏜️ Gurun Senja • Kelas 5 (Pos 92–87)
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTabWilayah('puncak');
              }}
              className={`btn-kafilah px-5 py-2.5 rounded-full font-['Montserrat'] font-bold text-sm md:text-base border-2 transition-all cursor-pointer ${
                activeTabWilayah === 'puncak'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-md'
                  : 'bg-[#FFFDF6] text-[#1B6B47] border-[#D9CBB0] hover:bg-[#F8F4EA]'
              }`}
            >
              ⭐ Pegunungan Bintang • Kelas 6 (Pos 86–78)
            </button>
          </div>

          {/* VIEW MODE 1: Jalur Horizontal Emas Bergaya "8 Days 7 Nights Experience" PDF */}
          {viewMode === 'timeline' && (
            <div className="relative w-full bg-[#FFFDF6]/95 border-2 border-[#0E4D34] rounded-[32px] p-6 md:p-10 shadow-xl overflow-x-auto my-auto mb-8">
              {/* Horizon Siluet Pegunungan Hijau Berlapis di Latar Belakang Kartu Jalur */}
              <div className="absolute inset-x-0 bottom-0 h-44 opacity-20 pointer-events-none overflow-hidden">
                <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full text-[#0E4D34]">
                  <path d="M0,200 L0,110 Q200,40 400,100 T800,60 T1200,100 L1200,200 Z" fill="currentColor" opacity="0.5" />
                  <path d="M0,200 L0,140 Q300,80 600,130 T1200,110 L1200,200 Z" fill="currentColor" />
                </svg>
              </div>

              {/* Petunjuk Geser Horizontal untuk Smart TV & Sentuh */}
              <div className="text-center mb-6 text-xs md:text-sm font-bold font-['Montserrat'] text-[#0E4D34]/80 uppercase tracking-wider flex items-center justify-center gap-2">
                <span>◀ Geser Horizontal untuk Melihat Seluruh Rangkaian Pos ▶</span>
              </div>

              {/* Horizontal Timeline Track */}
              <div className="relative flex items-center min-w-max px-12 py-24">
                {/* Glowing Continuous Golden Line */}
                <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] rounded-full shadow-[0_0_15px_rgba(201,160,74,0.6)]" />

                <div className="flex items-center gap-16 md:gap-24 relative z-10">
                  {displayedSurahs.map((surah, idx) => {
                    const isUnlocked = unlockedSurahIds.includes(surah.id);
                    const isFocus = focusSurahId === surah.id;
                    const stars = surahProgress[surah.id]?.stars || 0;
                    const isTuntas = stars >= 1;
                    const isAlternateTop = idx % 2 === 0; // Selang-seling atas/bawah
                    const posNumber = idx + 1;

                    return (
                      <div
                        key={surah.id}
                        className="relative flex flex-col items-center group cursor-pointer"
                        onClick={() => {
                          if (isUnlocked) {
                            sfx.playClick();
                            onSelectSurah(surah.id);
                          } else {
                            sfx.playWrong();
                          }
                        }}
                      >
                        {/* Surah Name Tag (Selang-seling ATAS jika genap) */}
                        {isAlternateTop && (
                          <div
                            className={`absolute bottom-16 flex flex-col items-center text-center p-3 rounded-[20px] min-w-[140px] max-w-[160px] border-2 transition-all duration-200 ${
                              isUnlocked
                                ? isFocus
                                  ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#F3D88A] shadow-xl scale-105'
                                  : 'bg-[#FFFDF6] text-[#2B2A26] border-[#0E4D34] shadow-md group-hover:-translate-y-1'
                                : 'bg-[#E9E1D0]/60 text-[#2B2A26]/40 border-[#D9CBB0] opacity-60'
                            }`}
                          >
                            <span dir="rtl" className="font-['Amiri'] text-xl font-bold text-[#C9A04A]">
                              {surah.namaArab}
                            </span>
                            <span className="font-['Marcellus'] font-black text-sm md:text-base leading-tight mt-0.5">
                              {surah.namaLatin}
                            </span>
                            <span className="text-[11px] font-['Montserrat'] font-medium text-[#2B2A26]/70 truncate max-w-[120px]">
                              {surah.arti}
                            </span>
                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mt-1">
                              {[1, 2, 3].map((starIdx) => (
                                <BintangDelapan
                                  key={starIdx}
                                  filled={isUnlocked && starIdx <= stars}
                                  size={14}
                                  className={isUnlocked && starIdx <= stars ? 'drop-shadow-sm' : 'opacity-25'}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Simpul Bulat Emas (Golden Node) */}
                        <div
                          className={`
                            relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-['Marcellus'] font-black text-lg md:text-xl transition-all duration-300 shadow-xl
                            ${
                              isUnlocked
                                ? isFocus
                                  ? 'bg-gradient-to-br from-[#FFF2C6] via-[#C9A04A] to-[#9C7A2E] text-[#0E4D34] ring-4 ring-[#0E4D34] ring-offset-2 scale-110 shadow-[0_0_25px_rgba(201,160,74,0.8)]'
                                  : isTuntas
                                  ? 'bg-gradient-to-br from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border-2 border-white group-hover:scale-105'
                                  : 'bg-[#FFFDF6] text-[#0E4D34] border-3 border-[#C9A04A]'
                                : 'bg-[#E9E1D0] text-[#2B2A26]/40 border-2 border-[#D9CBB0]'
                            }
                          `}
                        >
                          {isUnlocked ? (
                            isTuntas ? (
                              <LenteraFanus isLit={true} size={28} />
                            ) : (
                              <span>{posNumber}</span>
                            )
                          ) : (
                            <Lock className="w-5 h-5 text-[#8F3D1F]/50" />
                          )}

                          {/* Focus Flag Tag */}
                          {isFocus && (
                            <div className="absolute -top-7 bg-[#0E4D34] text-[#F3D88A] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-['Montserrat'] shadow-md border border-[#F3D88A] flex items-center gap-1">
                              <Flag className="w-3 h-3 fill-[#F3D88A]" /> Aktif
                            </div>
                          )}
                        </div>

                        {/* Surah Name Tag (Selang-seling BAWAH jika ganjil) */}
                        {!isAlternateTop && (
                          <div
                            className={`absolute top-16 flex flex-col items-center text-center p-3 rounded-[20px] min-w-[140px] max-w-[160px] border-2 transition-all duration-200 ${
                              isUnlocked
                                ? isFocus
                                  ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#F3D88A] shadow-xl scale-105'
                                  : 'bg-[#FFFDF6] text-[#2B2A26] border-[#0E4D34] shadow-md group-hover:translate-y-1'
                                : 'bg-[#E9E1D0]/60 text-[#2B2A26]/40 border-[#D9CBB0] opacity-60'
                            }`}
                          >
                            <span dir="rtl" className="font-['Amiri'] text-xl font-bold text-[#C9A04A]">
                              {surah.namaArab}
                            </span>
                            <span className="font-['Marcellus'] font-black text-sm md:text-base leading-tight mt-0.5">
                              {surah.namaLatin}
                            </span>
                            <span className="text-[11px] font-['Montserrat'] font-medium text-[#2B2A26]/70 truncate max-w-[120px]">
                              {surah.arti}
                            </span>
                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mt-1">
                              {[1, 2, 3].map((starIdx) => (
                                <BintangDelapan
                                  key={starIdx}
                                  filled={isUnlocked && starIdx <= stars}
                                  size={14}
                                  className={isUnlocked && starIdx <= stars ? 'drop-shadow-sm' : 'opacity-25'}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: Grid 37 Pos (Alternatif) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 pb-12">
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
                      btn-kafilah relative flex flex-col justify-between items-center p-5 rounded-[28px] border-2 min-h-[190px] select-none transition-all cursor-pointer
                      ${
                        isUnlocked
                          ? isFocus
                            ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#F3D88A] ring-4 ring-[#C9A04A]/50 shadow-xl scale-105'
                            : isTuntas
                            ? 'bg-[#FFFDF6] text-[#2B2A26] border-[#0E4D34] shadow-md hover:border-[#C9A04A]'
                            : 'bg-[#FFFDF6] text-[#2B2A26] border-[#D9CBB0] shadow-sm hover:border-[#0E4D34]'
                          : 'bg-[#E9E1D0]/60 text-[#2B2A26]/40 border-[#D9CBB0] filter grayscale opacity-60 cursor-not-allowed'
                      }
                    `}
                  >
                    {isFocus && (
                      <div className="absolute -top-3 inset-x-0 flex justify-center">
                        <span className="flex items-center gap-1 bg-[#F3D88A] text-[#0E4D34] font-black text-xs px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider font-['Montserrat']">
                          <Flag className="w-3.5 h-3.5 fill-[#0E4D34]" /> Pos Kafilah
                        </span>
                      </div>
                    )}

                    <div className="w-full flex items-center justify-between">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm font-['Montserrat'] ${
                          isFocus
                            ? 'bg-[#F3D88A] text-[#0E4D34]'
                            : isUnlocked
                            ? 'bg-[#F8F4EA] text-[#0E4D34] border border-[#D9CBB0]'
                            : 'bg-[#D9CBB0] text-[#2B2A26]/40'
                        }`}
                      >
                        {urutanKe}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9E1D0]/60 font-['Montserrat']">
                        {wilayahInfo.kelas}
                      </span>

                      {isUnlocked ? (
                        <LenteraFanus isLit={isTuntas} size={22} />
                      ) : (
                        <Lock className="w-5 h-5 text-[#8F3D1F]/60" />
                      )}
                    </div>

                    <div className="flex flex-col items-center text-center my-2">
                      <span
                        dir="rtl"
                        className={`font-['Amiri'] text-2xl font-bold mb-0.5 ${
                          isFocus ? 'text-[#F3D88A]' : 'text-[#0E4D34]'
                        }`}
                      >
                        {surah.namaArab}
                      </span>

                      <span className="text-lg font-black font-['Marcellus'] leading-tight">
                        {surah.namaLatin}
                      </span>

                      <span className="text-xs font-['Montserrat'] font-medium truncate max-w-[130px] mt-0.5 opacity-80">
                        {surah.arti}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3].map((starIdx) => (
                        <BintangDelapan
                          key={starIdx}
                          filled={isUnlocked && starIdx <= stars}
                          size={20}
                          className={isUnlocked && starIdx <= stars ? 'drop-shadow-sm' : 'opacity-30'}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </LatarParallax>
  );
};
