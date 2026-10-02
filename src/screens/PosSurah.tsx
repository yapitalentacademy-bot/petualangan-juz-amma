import React, { useState } from 'react';
import { HeaderNav } from '../components/HeaderNav';
import { KartuAyat } from '../components/KartuAyat';
import { TombolBesar } from '../components/TombolBesar';
import { PapanSkor } from '../components/PapanSkor';
import { SambungAyatGame } from '../games/SambungAyat/SambungAyatGame';
import { SusunAyatGame } from '../games/SusunAyat/SusunAyatGame';
import { TebakSurahGame } from '../games/TebakSurah/TebakSurahGame';
import { KeretaSurahGame } from '../games/KeretaSurah/KeretaSurahGame';
import { KartuKembarGame } from '../games/KartuKembar/KartuKembarGame';
import { DuelTimGame } from '../games/DuelTim/DuelTimGame';
import { PemburuTajwidGame } from '../games/PemburuTajwid/PemburuTajwidGame';
import { KisahSurahScreen } from '../games/KisahSurah/KisahSurahScreen';
import { BintangDelapan } from '../components/ornaments/BintangDelapan';
import { LenteraFanus } from '../components/ornaments/LenteraFanus';
import { LatarParallax, WilayahType } from '../components/LatarParallax';
import sampleSurahsData from '../data/sample-surahs.json';
import { SurahDetail, KelasLevel } from '../types/surah';
import { GameResult } from '../types/game';
import {
  BookOpen,
  HeartHandshake,
  PlayCircle,
  Puzzle,
  Layers,
  Users,
  HelpCircle,
  TrainTrack,
  Grid,
  Search,
} from 'lucide-react';
import { quranAudio, sfx } from '../../src/lib/audioPlayer';

interface PosSurahProps {
  surahId: number;
  onBackToMap: () => void;
  classNameLabel: string;
  levelLabel: KelasLevel;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showLatin: boolean;
  showTerjemah: boolean;
  onUpdateProgress?: (surahId: number, stars: number, score: number) => void;
  onSelectNextSurah?: (nextSurahId: number) => void;
}

type ActiveGameType =
  | 'none'
  | 'sambung'
  | 'susun'
  | 'tebak'
  | 'kereta'
  | 'kartu'
  | 'duel'
  | 'tajwid'
  | 'kisahScreen';

export const PosSurah: React.FC<PosSurahProps> = ({
  surahId,
  onBackToMap,
  classNameLabel,
  levelLabel,
  soundEnabled,
  onToggleSound,
  showLatin = true,
  showTerjemah = true,
  onUpdateProgress,
  onSelectNextSurah,
}) => {
  const surahsRecord = sampleSurahsData as Record<string, SurahDetail>;
  const surah: SurahDetail | undefined = surahsRecord[String(surahId)];

  const [activeTab, setActiveTab] = useState<'bacaan' | 'kisah'>('bacaan');
  const [activeGame, setActiveGame] = useState<ActiveGameType>('none');
  const [kartuKembarMode, setKartuKembarMode] = useState<'solo' | 'tim'>('solo');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  if (!surah) {
    return (
      <div className="min-h-screen bg-[var(--pasir-terang)] flex flex-col items-center justify-center p-6 text-[var(--malam)]">
        <div className="bg-[var(--gading)] border-2 border-[var(--emas)] p-10 rounded-3xl max-w-lg text-center shadow-xl">
          <h2 className="text-3xl font-black font-['Baloo_2'] text-[var(--terakota)] mb-4">Surah Belum Terbuka</h2>
          <p className="text-[var(--malam)]/80 font-['Nunito'] font-bold text-lg mb-6">
            Data surah ini sedang dipersiapkan untuk fase perjalanan kafilah berikutnya.
          </p>
          <TombolBesar variant="zamrud" onClick={onBackToMap}>
            Kembali ke Peta
          </TombolBesar>
        </div>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (surah.ayat.length > 0) {
      quranAudio.playAyat(surah.id, 1);
    }
  };

  const handleGameFinish = (result: GameResult) => {
    sfx.playStar();
    setGameResult(result);
    if (onUpdateProgress) {
      onUpdateProgress(surah.id, result.stars, result.skor);
    }
  };

  const handleRestartGame = () => {
    setGameResult(null);
  };

  const handleExitGame = () => {
    quranAudio.stop();
    setActiveGame('none');
    setGameResult(null);
  };

  const getGameTitle = () => {
    switch (activeGame) {
      case 'sambung':
        return 'Sambung Ayat';
      case 'susun':
        return 'Susun Ayat';
      case 'tebak':
        return 'Tebak Surah';
      case 'kereta':
        return 'Kereta Surah';
      case 'kartu':
        return 'Kartu Kembar';
      case 'duel':
        return 'Duel Tim';
      case 'tajwid':
        return 'Pemburu Tajwid';
      case 'kisahScreen':
        return 'Kisah di Balik Surah';
      default:
        return 'Mini-Game';
    }
  };

  const surahWilayah: WilayahType =
    surah.id >= 93 ? 'lembah-fajar' : surah.id >= 87 ? 'gurun-senja' : 'pegunungan-bintang';

  return (
    <LatarParallax wilayah={surahWilayah} isBuram={activeGame !== 'none'} className="min-h-screen">
      <div className="min-h-screen text-[var(--malam)] flex flex-col bg-white/20 backdrop-blur-[1px]">
      <HeaderNav
        title={`Pos Surah: ${surah.namaLatin}`}
        subtitle={`${surah.arti} • ${surah.tempatTurun} • ${surah.jumlahAyat} Ayat`}
        showBackToMap={true}
        onBackToMap={() => {
          quranAudio.stop();
          onBackToMap();
        }}
        classNameLabel={classNameLabel}
        levelLabel={levelLabel}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
      />

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full pb-20">
        {/* Game Active Mode */}
        {activeGame !== 'none' && (
          <div className="w-full">
            {/* Show Result Scoreboard for Solo games when Finished */}
            {gameResult && activeGame !== 'duel' ? (
              <PapanSkor
                score={gameResult.skor}
                maxScore={gameResult.maxSkor}
                stars={gameResult.stars}
                accuracy={gameResult.akurasi}
                title={
                  gameResult.stars === 3
                    ? 'Mumtaz! Luar Biasa!'
                    : gameResult.stars >= 1
                    ? 'Alhamdulillah, Lulus!'
                    : 'Ayo Coba Lagi!'
                }
                subtitle={`Kamu berhasil menyelesaikan mini-game ${getGameTitle()} Surah ${
                  surah.namaLatin
                } dengan akurasi ${gameResult.akurasi}%.`}
                onRestart={handleRestartGame}
                onBackToMap={() => {
                  handleExitGame();
                  onBackToMap();
                }}
                onNext={
                  onSelectNextSurah && surah.id > 78
                    ? () => {
                        handleExitGame();
                        // Urutan anak SD: 114 turun ke 78
                        onSelectNextSurah(surah.id - 1);
                      }
                    : undefined
                }
              />
            ) : (
              /* Active Mini Game Component */
              <div>
                {activeGame === 'sambung' && (
                  <SambungAyatGame
                    surahId={surah.id}
                    level={levelLabel}
                    onFinish={handleGameFinish}
                    onExit={handleExitGame}
                    showLatin={showLatin}
                    showTerjemah={showTerjemah}
                  />
                )}

                {activeGame === 'susun' && (
                  <SusunAyatGame
                    surahId={surah.id}
                    level={levelLabel}
                    onFinish={handleGameFinish}
                    onExit={handleExitGame}
                    showLatin={showLatin}
                    showTerjemah={showTerjemah}
                  />
                )}

                {activeGame === 'tebak' && (
                  <TebakSurahGame
                    surahId={surah.id}
                    level={levelLabel}
                    onFinish={handleGameFinish}
                    onExit={handleExitGame}
                  />
                )}

                {activeGame === 'kereta' && (
                  <KeretaSurahGame
                    surahId={surah.id}
                    level={levelLabel}
                    onFinish={handleGameFinish}
                    onExit={handleExitGame}
                  />
                )}

                {activeGame === 'kartu' && (
                  <KartuKembarGame
                    surahId={surah.id}
                    level={levelLabel}
                    mode={kartuKembarMode}
                    onFinish={handleGameFinish}
                    onExit={handleExitGame}
                  />
                )}

                {activeGame === 'duel' && (
                  <DuelTimGame
                    surahId={surah.id}
                    level={levelLabel}
                    mode="tim"
                    onFinish={handleGameFinish}
                    onExit={handleExitGame}
                    showLatin={showLatin}
                    showTerjemah={showTerjemah}
                  />
                )}

                {activeGame === 'tajwid' && (
                  <PemburuTajwidGame
                    surahId={surah.id}
                    level={levelLabel}
                    onFinish={handleGameFinish}
                    onExit={handleExitGame}
                  />
                )}

                {activeGame === 'kisahScreen' && (
                  <KisahSurahScreen surah={surah} onExit={handleExitGame} />
                )}
              </div>
            )}
          </div>
        )}

        {/* Regular Surah Hub when not playing mini-game */}
        {activeGame === 'none' && (
          <>
            {/* Surah Header Card: Panel Gerbang Lengkung Mihrab */}
            <div className="relative bg-[var(--gading)] border-2 border-[var(--emas)] rounded-[32px] p-6 md:p-10 mb-8 shadow-xl overflow-hidden">
              {/* Lengkung Mihrab Top Accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-[var(--emas)]/15 rounded-b-[40px] border-b-2 border-x-2 border-[var(--emas)]/40 pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--pasir)]/60 border border-[var(--emas)] text-[var(--zamrud-tua)] text-base font-['Nunito'] font-bold mb-3 shadow-sm">
                    <BintangDelapan size={18} fill="#D4A23A" className="text-[var(--emas)]" />
                    <span>Pos Surah ke-{surah.id} • {surah.tempatTurun}</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-[var(--zamrud-tua)] font-['Baloo_2'] mb-1">
                    Surah {surah.namaLatin}
                  </h2>
                  <p className="text-xl text-[var(--terakota)] font-['Nunito'] font-bold">
                    Artinya: "{surah.arti}" • {surah.jumlahAyat} Ayat
                  </p>
                </div>

                {/* Big Arabic Title */}
                <div className="text-center md:text-right flex items-center gap-4">
                  <LenteraFanus size={42} menyala={true} className="hidden md:block" />
                  <span
                    dir="rtl"
                    className="font-['Amiri'] text-5xl md:text-7xl text-[var(--zamrud-tua)] font-bold drop-shadow-sm"
                  >
                    {surah.namaArab}
                  </span>
                </div>
              </div>

              {/* Quick Action Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t-2 border-[var(--pasir)]/70 relative z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('bacaan')}
                    className={`
                      px-6 py-2.5 rounded-full text-lg font-['Nunito'] font-bold border-2 transition-all cursor-pointer shadow-sm
                      ${
                        activeTab === 'bacaan'
                          ? 'bg-[var(--zamrud)] border-[var(--zamrud-tua)] text-[var(--gading)] shadow-md'
                          : 'bg-[var(--pasir)]/40 border-[var(--pasir)] text-[var(--malam)] hover:border-[var(--zamrud)]'
                      }
                    `}
                  >
                    Teks & Audio Ayat
                  </button>

                  <button
                    onClick={() => setActiveTab('kisah')}
                    className={`
                      px-6 py-2.5 rounded-full text-lg font-['Nunito'] font-bold border-2 transition-all cursor-pointer shadow-sm
                      ${
                        activeTab === 'kisah'
                          ? 'bg-[var(--zamrud)] border-[var(--zamrud-tua)] text-[var(--gading)] shadow-md'
                          : 'bg-[var(--pasir)]/40 border-[var(--pasir)] text-[var(--malam)] hover:border-[var(--zamrud)]'
                      }
                    `}
                  >
                    Kisah & Pesan Akhlak
                  </button>
                </div>

                <TombolBesar
                  variant="emas"
                  size="normal"
                  icon={<PlayCircle className="w-7 h-7" />}
                  onClick={handlePlayAll}
                >
                  Putar Murottal Lengkap
                </TombolBesar>
              </div>
            </div>

            {/* Mini-Games Launch Section (All 7 Mini-Games) */}
            <div className="mb-10 p-6 md:p-8 rounded-[32px] bg-[var(--gading)] border-2 border-[var(--emas)]/80 shadow-xl">
              <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-6">
                <LenteraFanus size={32} menyala={true} />
                <h3 className="text-3xl font-black font-['Baloo_2'] text-[var(--zamrud-tua)]">
                  Tantangan Mini-Game Petualangan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Sambung Ayat */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--pasir-terang)] border-2 border-[var(--zamrud)]/40 shadow-sm hover:border-[var(--zamrud)] transition-all">
                  <div>
                    <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-2">
                      <Layers className="w-6 h-6" />
                      <h4 className="text-2xl font-black font-['Baloo_2']">Sambung Ayat</h4>
                    </div>
                    <p className="text-[var(--malam)]/80 font-['Nunito'] font-semibold text-base mb-6">
                      Dengarkan bacaan ayat ke-n dan sentuh kartu ayat ke-(n+1) dengan benar!
                    </p>
                  </div>
                  <TombolBesar variant="zamrud" size="normal" onClick={() => setActiveGame('sambung')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 2. Susun Ayat */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--pasir-terang)] border-2 border-[var(--emas)]/60 shadow-sm hover:border-[var(--emas)] transition-all">
                  <div>
                    <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-2">
                      <Puzzle className="w-6 h-6 text-[var(--emas)]" />
                      <h4 className="text-2xl font-black font-['Baloo_2']">Susun Ayat (RTL)</h4>
                    </div>
                    <p className="text-[var(--malam)]/80 font-['Nunito'] font-semibold text-base mb-6">
                      Susun potongan kata Al-Qur'an ke slot berurutan dari kanan ke kiri!
                    </p>
                  </div>
                  <TombolBesar variant="emas" size="normal" onClick={() => setActiveGame('susun')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 3. Pemburu Tajwid */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--pasir-terang)] border-2 border-[var(--biru-laut)]/50 shadow-sm hover:border-[var(--biru-laut)] transition-all">
                  <div>
                    <div className="flex items-center gap-3 text-[var(--biru-laut)] mb-2">
                      <Search className="w-6 h-6" />
                      <h4 className="text-2xl font-black font-['Baloo_2']">Pemburu Tajwid</h4>
                    </div>
                    <p className="text-[var(--malam)]/80 font-['Nunito'] font-semibold text-base mb-6">
                      Cari dan sentuh lafadz yang mengandung hukum tajwid (Ghunnah, Qalqalah, Mad, dll)!
                    </p>
                  </div>
                  <TombolBesar variant="biru" size="normal" onClick={() => setActiveGame('tajwid')}>
                    Mulai Berburu
                  </TombolBesar>
                </div>

                {/* 4. Tebak Surah */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--pasir-terang)] border-2 border-[var(--emas)]/60 shadow-sm hover:border-[var(--emas)] transition-all">
                  <div>
                    <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-2">
                      <HelpCircle className="w-6 h-6 text-[var(--emas)]" />
                      <h4 className="text-2xl font-black font-['Baloo_2']">Tebak Surah</h4>
                    </div>
                    <p className="text-[var(--malam)]/80 font-['Nunito'] font-semibold text-base mb-6">
                      Tebak nama surah dari arti nama, ciri ayat, atau audio pembuka!
                    </p>
                  </div>
                  <TombolBesar variant="emas" size="normal" onClick={() => setActiveGame('tebak')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 5. Kereta Surah */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--pasir-terang)] border-2 border-[var(--zamrud)]/40 shadow-sm hover:border-[var(--zamrud)] transition-all">
                  <div>
                    <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-2">
                      <TrainTrack className="w-6 h-6" />
                      <h4 className="text-2xl font-black font-['Baloo_2']">Kereta Surah</h4>
                    </div>
                    <p className="text-[var(--malam)]/80 font-['Nunito'] font-semibold text-base mb-6">
                      Susun gerbong surah di rel sesuai urutan mushaf (berwaktu di kelas 5–6)!
                    </p>
                  </div>
                  <TombolBesar variant="zamrud" size="normal" onClick={() => setActiveGame('kereta')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 6. Kartu Kembar */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--pasir-terang)] border-2 border-[var(--biru-laut)]/50 shadow-sm hover:border-[var(--biru-laut)] transition-all">
                  <div>
                    <div className="flex items-center gap-3 text-[var(--biru-laut)] mb-2">
                      <Grid className="w-6 h-6" />
                      <h4 className="text-2xl font-black font-['Baloo_2']">Kartu Kembar</h4>
                    </div>
                    <p className="text-[var(--malam)]/80 font-['Nunito'] font-semibold text-base mb-4">
                      Memory match pasangan nama dan arti surah!
                    </p>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setKartuKembarMode('solo')}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          kartuKembarMode === 'solo'
                            ? 'bg-[var(--biru-laut)] text-[var(--gading)] border-[var(--biru-laut)]'
                            : 'bg-[var(--pasir)]/50 text-[var(--malam)] border-[var(--pasir)]'
                        }`}
                      >
                        Mode Solo
                      </button>
                      <button
                        onClick={() => setKartuKembarMode('tim')}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          kartuKembarMode === 'tim'
                            ? 'bg-[var(--biru-laut)] text-[var(--gading)] border-[var(--biru-laut)]'
                            : 'bg-[var(--pasir)]/50 text-[var(--malam)] border-[var(--pasir)]'
                        }`}
                      >
                        Mode Tim
                      </button>
                    </div>
                  </div>
                  <TombolBesar variant="biru" size="normal" onClick={() => setActiveGame('kartu')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 7. Duel Tim */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-[var(--pasir-terang)] border-2 border-[var(--terakota)]/50 shadow-sm hover:border-[var(--terakota)] transition-all md:col-span-2 lg:col-span-3">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 text-[var(--terakota)] mb-2">
                        <Users className="w-6 h-6" />
                        <h4 className="text-2xl font-black font-['Baloo_2']">Duel Tim Cepat Tepat (Buzzer)</h4>
                      </div>
                      <p className="text-[var(--malam)]/80 font-['Nunito'] font-semibold text-base">
                        Layar terbelah dengan buzzer multi-touch untuk 2 tim sekelas (Tim Hijau Zamrud vs Tim Biru Laut)!
                      </p>
                    </div>
                    <TombolBesar variant="terakota" size="normal" onClick={() => setActiveGame('duel')}>
                      Mulai Duel Tim
                    </TombolBesar>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab 1: Ayat List */}
            {activeTab === 'bacaan' && (
              <div className="flex flex-col gap-6">
                {surah.ayat.map((ayatItem) => (
                  <KartuAyat
                    key={ayatItem.nomor}
                    ayat={ayatItem}
                    surahNumber={surah.id}
                    showLatin={showLatin}
                    showTerjemah={showTerjemah}
                  />
                ))}
              </div>
            )}

            {/* Tab 2: Kisah & Pesan Akhlak */}
            {activeTab === 'kisah' && (
              <div className="flex flex-col gap-8">
                {/* Launch Interactive Story Mode Banner */}
                <div className="p-8 rounded-[32px] bg-[var(--gading)] border-2 border-[var(--emas)] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="px-4 py-1.5 rounded-full bg-[var(--pasir)]/60 border border-[var(--emas)] text-[var(--zamrud-tua)] text-sm font-extrabold uppercase tracking-wider inline-block mb-3">
                      Fitur Interaktif
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-[var(--zamrud-tua)] font-['Baloo_2'] mb-2">
                      Jelajahi Kisah & Kuis Pemahaman
                    </h3>
                    <p className="text-[var(--malam)]/80 text-lg font-['Nunito'] font-semibold max-w-2xl">
                      Ikuti petualangan narasi multi-panel asbabun nuzul Surah {surah.namaLatin},
                      ikuti kuis 3 soal, dan temukan pesan amalan nyata hari ini!
                    </p>
                  </div>
                  <TombolBesar
                    variant="emas"
                    size="large"
                    icon={<BookOpen className="w-8 h-8" />}
                    onClick={() => setActiveGame('kisahScreen')}
                  >
                    Buka Kisah Interaktif
                  </TombolBesar>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[var(--gading)] p-8 md:p-10 rounded-[32px] border-2 border-[var(--zamrud)]/40 shadow-md">
                    <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-4">
                      <BookOpen className="w-8 h-8" />
                      <h3 className="text-3xl font-black font-['Baloo_2']">
                        Ringkasan Kisah
                      </h3>
                    </div>
                    <p className="text-xl text-[var(--malam)] font-['Nunito'] leading-relaxed font-semibold">
                      {surah.ringkasanKisah}
                    </p>
                  </div>

                  <div className="bg-[var(--gading)] p-8 md:p-10 rounded-[32px] border-2 border-[var(--emas)]/60 shadow-md">
                    <div className="flex items-center gap-3 text-[var(--terakota)] mb-4">
                      <HeartHandshake className="w-8 h-8" />
                      <h3 className="text-3xl font-black font-['Baloo_2']">
                        Pesan Akhlak
                      </h3>
                    </div>
                    <p className="text-xl text-[var(--malam)] font-['Nunito'] leading-relaxed font-semibold">
                      {surah.pesanAkhlak}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      </div>
    </LatarParallax>
  );
};
