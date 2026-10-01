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
import sampleSurahsData from '../data/sample-surahs.json';
import { SurahDetail, KelasLevel } from '../types/surah';
import { GameResult } from '../types/game';
import {
  BookOpen,
  Sparkles,
  HeartHandshake,
  PlayCircle,
  Star,
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
      <div className="min-h-screen bg-oasis-pattern flex flex-col items-center justify-center p-6">
        <div className="glass-panel p-10 rounded-3xl max-w-lg text-center">
          <h2 className="text-3xl font-bold text-rose-400 mb-4">Surah Belum Terbuka</h2>
          <p className="text-stone-300 mb-6">
            Data surah ini sedang dipersiapkan untuk fase berikutnya.
          </p>
          <TombolBesar variant="oasis" onClick={onBackToMap}>
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

  return (
    <div className="min-h-screen bg-oasis-pattern flex flex-col">
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

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full pb-20">
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
                  onSelectNextSurah
                    ? () => {
                        handleExitGame();
                        onSelectNextSurah(surah.id + 1);
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
            {/* Surah Header Card */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl border-3 border-amber-500/50 mb-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-lg font-bold mb-3">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    Surah ke-{surah.id} ({surah.tempatTurun})
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white font-display mb-1">
                    Surah {surah.namaLatin}
                  </h2>
                  <p className="text-2xl text-amber-300 font-bold">
                    Artinya: "{surah.arti}"
                  </p>
                </div>

                {/* Big Arabic Title */}
                <div className="text-center md:text-right">
                  <span
                    dir="rtl"
                    className="font-quran text-6xl md:text-8xl text-amber-200 font-bold drop-shadow-md"
                  >
                    {surah.namaArab}
                  </span>
                </div>
              </div>

              {/* Quick Action Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-stone-800">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('bacaan')}
                    className={`
                      touch-btn px-6 py-3 rounded-2xl text-xl font-extrabold border-2 transition-all cursor-pointer
                      ${
                        activeTab === 'bacaan'
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-card-glow'
                          : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-stone-500'
                      }
                    `}
                  >
                    Teks & Audio Ayat
                  </button>

                  <button
                    onClick={() => setActiveTab('kisah')}
                    className={`
                      touch-btn px-6 py-3 rounded-2xl text-xl font-extrabold border-2 transition-all cursor-pointer
                      ${
                        activeTab === 'kisah'
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-card-glow'
                          : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-stone-500'
                      }
                    `}
                  >
                    Kisah & Pesan Akhlak
                  </button>
                </div>

                <TombolBesar
                  variant="desert"
                  size="normal"
                  icon={<PlayCircle className="w-8 h-8" />}
                  onClick={handlePlayAll}
                >
                  Putar Murottal
                </TombolBesar>
              </div>
            </div>

            {/* Mini-Games Launch Section (All 7 Mini-Games) */}
            <div className="mb-10 p-8 rounded-3xl glass-oasis border-3 border-emerald-400/60 shadow-xl">
              <div className="flex items-center gap-3 text-emerald-200 mb-6">
                <Sparkles className="w-8 h-8 text-yellow-300" />
                <h3 className="text-3xl font-black font-display">
                  Pilih Tantangan Mini-Game Pos
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Sambung Ayat */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/90 border-2 border-emerald-500/60 shadow-md">
                  <div>
                    <div className="flex items-center gap-3 text-emerald-300 mb-2">
                      <Layers className="w-7 h-7" />
                      <h4 className="text-2xl font-black">Sambung Ayat</h4>
                    </div>
                    <p className="text-stone-300 text-base mb-6">
                      Dengarkan bacaan ayat ke-n dan sentuh kartu ayat ke-(n+1) dengan benar!
                    </p>
                  </div>
                  <TombolBesar variant="oasis" size="normal" onClick={() => setActiveGame('sambung')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 2. Susun Ayat */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/90 border-2 border-amber-500/60 shadow-md">
                  <div>
                    <div className="flex items-center gap-3 text-amber-300 mb-2">
                      <Puzzle className="w-7 h-7" />
                      <h4 className="text-2xl font-black">Susun Ayat (RTL)</h4>
                    </div>
                    <p className="text-stone-300 text-base mb-6">
                      Susun potongan kata Al-Qur'an ke slot berurutan dari kanan ke kiri!
                    </p>
                  </div>
                  <TombolBesar variant="desert" size="normal" onClick={() => setActiveGame('susun')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 3. Pemburu Tajwid (Fase 6) */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/90 border-2 border-cyan-500/60 shadow-md">
                  <div>
                    <div className="flex items-center gap-3 text-cyan-300 mb-2">
                      <Search className="w-7 h-7" />
                      <h4 className="text-2xl font-black">Pemburu Tajwid</h4>
                    </div>
                    <p className="text-stone-300 text-base mb-6">
                      Cari dan sentuh lafadz yang mengandung hukum tajwid (Ghunnah, Qalqalah, Mad, dll)!
                    </p>
                  </div>
                  <TombolBesar variant="ocean" size="normal" onClick={() => setActiveGame('tajwid')}>
                    Mulai Berburu
                  </TombolBesar>
                </div>

                {/* 4. Tebak Surah */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/90 border-2 border-yellow-500/60 shadow-md">
                  <div>
                    <div className="flex items-center gap-3 text-yellow-300 mb-2">
                      <HelpCircle className="w-7 h-7" />
                      <h4 className="text-2xl font-black">Tebak Surah</h4>
                    </div>
                    <p className="text-stone-300 text-base mb-6">
                      Tebak nama surah dari arti nama, ciri ayat, atau audio pembuka!
                    </p>
                  </div>
                  <TombolBesar variant="desert" size="normal" onClick={() => setActiveGame('tebak')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 5. Kereta Surah */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/90 border-2 border-teal-500/60 shadow-md">
                  <div>
                    <div className="flex items-center gap-3 text-teal-300 mb-2">
                      <TrainTrack className="w-7 h-7" />
                      <h4 className="text-2xl font-black">Kereta Surah</h4>
                    </div>
                    <p className="text-stone-300 text-base mb-6">
                      Susun gerbong surah di rel sesuai urutan mushaf (berwaktu di kelas 5–6)!
                    </p>
                  </div>
                  <TombolBesar variant="oasis" size="normal" onClick={() => setActiveGame('kereta')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 6. Kartu Kembar */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/90 border-2 border-indigo-500/60 shadow-md">
                  <div>
                    <div className="flex items-center gap-3 text-indigo-300 mb-2">
                      <Grid className="w-7 h-7" />
                      <h4 className="text-2xl font-black">Kartu Kembar</h4>
                    </div>
                    <p className="text-stone-300 text-base mb-4">
                      Memory match grid 4×3 mencari pasangan nama dan arti surah!
                    </p>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setKartuKembarMode('solo')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                          kartuKembarMode === 'solo'
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'bg-stone-800 text-stone-400 border-stone-700'
                        }`}
                      >
                        Mode Solo
                      </button>
                      <button
                        onClick={() => setKartuKembarMode('tim')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                          kartuKembarMode === 'tim'
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'bg-stone-800 text-stone-400 border-stone-700'
                        }`}
                      >
                        Mode Tim
                      </button>
                    </div>
                  </div>
                  <TombolBesar variant="oasis" size="normal" onClick={() => setActiveGame('kartu')}>
                    Mainkan
                  </TombolBesar>
                </div>

                {/* 7. Duel Tim */}
                <div className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/90 border-2 border-sky-500/60 shadow-md">
                  <div>
                    <div className="flex items-center gap-3 text-sky-300 mb-2">
                      <Users className="w-7 h-7" />
                      <h4 className="text-2xl font-black">Duel Tim (Buzzer)</h4>
                    </div>
                    <p className="text-stone-300 text-base mb-6">
                      Layar terbelah dengan buzzer multi-touch untuk 2 tim sekelas (Hijau vs Biru)!
                    </p>
                  </div>
                  <TombolBesar variant="ocean" size="normal" onClick={() => setActiveGame('duel')}>
                    Mulai Duel
                  </TombolBesar>
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
                <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-3 border-amber-400/70 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-sm font-extrabold uppercase tracking-wider inline-block mb-3">
                      Fitur Interaktif
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-white font-display mb-2">
                      Jelajahi Kisah & Kuis Pemahaman
                    </h3>
                    <p className="text-stone-300 text-xl max-w-2xl">
                      Ikuti petualangan narasi multi-panel asbabun nuzul Surah {surah.namaLatin},
                      ikuti kuis 3 soal, dan temukan pesan amalan nyata hari ini!
                    </p>
                  </div>
                  <TombolBesar
                    variant="desert"
                    size="large"
                    icon={<BookOpen className="w-8 h-8" />}
                    onClick={() => setActiveGame('kisahScreen')}
                  >
                    Buka Kisah Interaktif
                  </TombolBesar>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-panel p-8 md:p-10 rounded-3xl border-2 border-emerald-500/40">
                    <div className="flex items-center gap-3 text-emerald-400 mb-4">
                      <BookOpen className="w-8 h-8" />
                      <h3 className="text-3xl font-black font-display">
                        Ringkasan Kisah
                      </h3>
                    </div>
                    <p className="text-2xl text-stone-200 leading-relaxed font-medium">
                      {surah.ringkasanKisah}
                    </p>
                  </div>

                  <div className="glass-panel p-8 md:p-10 rounded-3xl border-2 border-amber-500/40">
                    <div className="flex items-center gap-3 text-amber-400 mb-4">
                      <HeartHandshake className="w-8 h-8" />
                      <h3 className="text-3xl font-black font-display">
                        Pesan Akhlak
                      </h3>
                    </div>
                    <p className="text-2xl text-amber-100 leading-relaxed font-medium">
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
  );
};
