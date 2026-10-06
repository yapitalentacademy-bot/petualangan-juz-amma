import React, { useState } from 'react';
import { HeaderNav } from '../components/HeaderNav';
import { KartuAyat } from '../components/KartuAyat';
import { TombolBesar } from '../components/TombolBesar';
import { PapanSkor } from '../components/PapanSkor';
import { BingkaiMihrab } from '../components/BingkaiMihrab';
import { SambungAyatGame } from '../games/SambungAyat/SambungAyatGame';
import { SusunAyatGame } from '../games/SusunAyat/SusunAyatGame';
import { TebakSurahGame } from '../games/TebakSurah/TebakSurahGame';
import { KeretaSurahGame } from '../games/KeretaSurah/KeretaSurahGame';
import { KartuKembarGame } from '../games/KartuKembar/KartuKembarGame';
import { DuelTimGame } from '../games/DuelTim/DuelTimGame';
import { PemburuTajwidGame } from '../games/PemburuTajwid/PemburuTajwidGame';
import { KisahSurahScreen } from '../games/KisahSurah/KisahSurahScreen';
import { BintangDelapan } from '../components/ornaments/BintangDelapan';
import { LatarParallax, WilayahType } from '../components/LatarParallax';
import { OrnamenSudut } from '../components/ornaments/OrnamenSudut';
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
  Sparkles,
  Square,
} from 'lucide-react';
import { ModalPilihQari } from '../components/ModalPilihQari';
import { quranAudio, sfx } from '../../src/lib/audioPlayer';
import { UserCheck } from 'lucide-react';

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
  const [showQariModal, setShowQariModal] = useState(false);

  if (!surah) {
    return (
      <div className="min-h-screen bg-[#F8F4EA] flex flex-col items-center justify-center p-6 text-[#2B2A26]">
        <div className="bg-[#FFFDF6] border-2 border-[#C9A04A] p-10 rounded-[28px] max-w-lg text-center shadow-xl">
          <h2 className="text-3xl font-black font-['Marcellus'] text-[#C0603A] mb-4">Surah Belum Terbuka</h2>
          <p className="text-[#2B2A26]/80 font-['Montserrat'] font-semibold text-lg mb-6">
            Data surah ini sedang dipersiapkan untuk fase perjalanan kafilah berikutnya.
          </p>
          <TombolBesar variant="zamrud" onClick={onBackToMap}>
            Kembali ke Peta
          </TombolBesar>
        </div>
      </div>
    );
  }

  const [isPlayingFullMurottal, setIsPlayingFullMurottal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(quranAudio.getPlaybackRate());
  const [qariInfo, setQariInfo] = useState(quranAudio.getQariInfo());

  React.useEffect(() => {
    const unsub = quranAudio.subscribe((isPlaying) => {
      if (!isPlaying) {
        setIsPlayingFullMurottal(false);
      }
      setPlaybackSpeed(quranAudio.getPlaybackRate());
      setQariInfo(quranAudio.getQariInfo());
    });
    return () => unsub();
  }, []);

  const handlePlayAll = () => {
    if (isPlayingFullMurottal) {
      quranAudio.stop();
      setIsPlayingFullMurottal(false);
    } else if (surah.ayat.length > 0) {
      setIsPlayingFullMurottal(true);
      quranAudio.playSurah(surah.id, surah.ayat.length, 1, undefined, () => {
        setIsPlayingFullMurottal(false);
      });
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

  const sceneImageSrc =
    surah.id >= 93
      ? '/scenes/lembah-fajar.webp'
      : surah.id >= 87
      ? '/scenes/gurun-senja.webp'
      : '/scenes/pegunungan-bintang.webp';

  return (
    <LatarParallax wilayah={surahWilayah} isBuram={activeGame !== 'none'} className="min-h-screen">
      <div className="min-h-screen text-[#2B2A26] flex flex-col bg-[#F8F4EA]/90 backdrop-blur-[2px] relative">
        <OrnamenSudut variant="atas-saja" />

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

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-20 z-10">
          {/* Game Active Mode */}
          {activeGame !== 'none' && (
            <div className="w-full">
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
                  subtitle={`Kamu berhasil menyelesaikan tantangan ${getGameTitle()} Surah ${
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
                          onSelectNextSurah(surah.id - 1);
                        }
                      : undefined
                  }
                />
              ) : (
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

          {/* Pos Surah Main Hub (Saat tidak memainkan mini game) */}
          {activeGame === 'none' && (
            <>
              {/* Surah Gateway Card: Kiri Bingkai Mihrab Pemandangan, Kanan Nama Surah & Detail */}
              <div className="relative bg-[#FFFDF6] border-2 border-[#0E4D34] rounded-[32px] p-6 md:p-10 mb-8 shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  {/* KIRI: Bingkai Mihrab Berisi Pemandangan Wilayah */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-full max-w-xs md:max-w-sm">
                      <BingkaiMihrab
                        imageSrc={sceneImageSrc}
                        altText={`Pemandangan ${surah.namaLatin}`}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* KANAN: Detail Surah Marcellus & Arab */}
                  <div className="md:col-span-7 flex flex-col items-start text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E4D34]/10 border border-[#0E4D34]/30 text-[#0E4D34] text-xs font-['Montserrat'] font-bold mb-3 shadow-sm uppercase tracking-wider">
                      <BintangDelapan size={16} fill="#C9A04A" />
                      <span>Pos Surah ke-{surah.id} • {surah.tempatTurun}</span>
                    </div>

                    <div className="flex flex-wrap items-baseline justify-between gap-4 w-full mb-2">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0E4D34] font-['Marcellus']">
                        Surah {surah.namaLatin}
                      </h2>
                      <span
                        dir="rtl"
                        className="font-['Amiri'] text-4xl md:text-6xl text-[#0E4D34] font-bold"
                      >
                        {surah.namaArab}
                      </span>
                    </div>

                    <p className="text-xl md:text-2xl text-[#C9A04A] font-['Montserrat'] font-bold mb-4">
                      Artinya: "{surah.arti}" • {surah.jumlahAyat} Ayat
                    </p>

                    <p className="text-sm md:text-base text-[#2B2A26]/80 font-['Montserrat'] font-medium mb-6 leading-relaxed">
                      {surah.ringkasanKisah}
                    </p>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-4 w-full pt-4 border-t border-[#E9E1D0]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('bacaan')}
                          className={`px-5 py-2 rounded-full text-sm font-['Montserrat'] font-bold border-2 transition-all cursor-pointer shadow-sm ${
                            activeTab === 'bacaan'
                              ? 'bg-[#0E4D34] border-[#0E4D34] text-[#FFFDF6] shadow-md'
                              : 'bg-[#F8F4EA] border-[#D9CBB0] text-[#2B2A26] hover:border-[#0E4D34]'
                          }`}
                        >
                          Teks & Audio Ayat
                        </button>

                        <button
                          onClick={() => setActiveTab('kisah')}
                          className={`px-5 py-2 rounded-full text-sm font-['Montserrat'] font-bold border-2 transition-all cursor-pointer shadow-sm ${
                            activeTab === 'kisah'
                              ? 'bg-[#0E4D34] border-[#0E4D34] text-[#FFFDF6] shadow-md'
                              : 'bg-[#F8F4EA] border-[#D9CBB0] text-[#2B2A26] hover:border-[#0E4D34]'
                          }`}
                        >
                          Kisah & Akhlak
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <TombolBesar
                          variant={isPlayingFullMurottal ? 'terakota' : 'emas'}
                          size="small"
                          icon={isPlayingFullMurottal ? <Square className="w-5 h-5 fill-current text-white animate-pulse" /> : <PlayCircle className="w-5 h-5 text-[#0E4D34]" />}
                          onClick={handlePlayAll}
                        >
                          {isPlayingFullMurottal ? 'Hentikan Murottal' : 'Putar Murottal Lengkap'}
                        </TombolBesar>

                        <button
                          onClick={() => {
                            sfx.playClick();
                            setShowQariModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0] hover:border-[#0E4D34] text-[#0E4D34] font-bold text-xs cursor-pointer shadow-sm transition-all"
                        >
                          <UserCheck className="w-4 h-4 text-[#C9A04A]" />
                          <span>Qari: {qariInfo.nama.split(' ')[1] || qariInfo.nama}</span>
                        </button>

                        <div className="flex items-center gap-1 bg-[#F8F4EA] p-1.5 rounded-2xl border border-[#D9CBB0]">
                          {[0.75, 1.0, 1.25].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => {
                                setPlaybackSpeed(speed);
                                quranAudio.setPlaybackRate(speed);
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                playbackSpeed === speed
                                  ? 'bg-[#0E4D34] text-[#FFFDF6] shadow-sm'
                                  : 'text-[#0E4D34] hover:bg-[#E9E1D0]'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Mini-Game Bergaya Fasilitas PDF ("Apa yang Didapatkan Peserta?") */}
              <div className="mb-10 p-6 md:p-8 rounded-[32px] bg-[#FFFDF6] border-2 border-[#0E4D34] shadow-xl">
                <div className="flex items-center gap-3 text-[#0E4D34] mb-6">
                  <div className="p-2 rounded-xl bg-[#F8F4EA] border border-[#C9A04A]">
                    <Sparkles className="w-6 h-6 text-[#C9A04A]" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black font-['Marcellus'] text-[#0E4D34]">
                      Rangkaian Tantangan Belajar
                    </h3>
                    <p className="text-xs md:text-sm font-['Montserrat'] text-[#2B2A26]/70">
                      Pilih modul pembelajaran interaktif untuk menguji dan memperkuat hafalan
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* 1. Sambung Ayat */}
                  <div className="flex flex-col justify-between p-6 rounded-[24px] bg-[#F8F4EA] border-2 border-[#0E4D34]/30 shadow-sm hover:border-[#0E4D34] transition-all">
                    <div>
                      <div className="flex items-center gap-3 text-[#0E4D34] mb-2">
                        <div className="p-2 rounded-xl bg-[#FFFDF6] border border-[#D9CBB0] text-[#0E4D34]">
                          <Layers className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold font-['Marcellus'] text-[#0E4D34]">Sambung Ayat</h4>
                      </div>
                      <p className="text-[#2B2A26]/80 font-['Montserrat'] font-medium text-sm mb-5">
                        Dengarkan audio ayat ke-n lalu sentuh kartu ayat ke-(n+1) secara berurutan.
                      </p>
                    </div>
                    <TombolBesar variant="zamrud" size="small" onClick={() => setActiveGame('sambung')}>
                      Mulai Modul
                    </TombolBesar>
                  </div>

                  {/* 2. Susun Ayat */}
                  <div className="flex flex-col justify-between p-6 rounded-[24px] bg-[#F8F4EA] border-2 border-[#C9A04A]/40 shadow-sm hover:border-[#C9A04A] transition-all">
                    <div>
                      <div className="flex items-center gap-3 text-[#0E4D34] mb-2">
                        <div className="p-2 rounded-xl bg-[#FFFDF6] border border-[#C9A04A] text-[#C9A04A]">
                          <Puzzle className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold font-['Marcellus'] text-[#0E4D34]">Susun Ayat (RTL)</h4>
                      </div>
                      <p className="text-[#2B2A26]/80 font-['Montserrat'] font-medium text-sm mb-5">
                        Susun potongan kata Al-Qur'an ke slot berurutan dari kanan ke kiri.
                      </p>
                    </div>
                    <TombolBesar variant="emas" size="small" onClick={() => setActiveGame('susun')}>
                      Mulai Modul
                    </TombolBesar>
                  </div>

                  {/* 3. Pemburu Tajwid */}
                  <div className="flex flex-col justify-between p-6 rounded-[24px] bg-[#F8F4EA] border-2 border-[#1B6B47]/40 shadow-sm hover:border-[#1B6B47] transition-all">
                    <div>
                      <div className="flex items-center gap-3 text-[#1B6B47] mb-2">
                        <div className="p-2 rounded-xl bg-[#FFFDF6] border border-[#D9CBB0] text-[#1B6B47]">
                          <Search className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold font-['Marcellus'] text-[#0E4D34]">Pemburu Tajwid</h4>
                      </div>
                      <p className="text-[#2B2A26]/80 font-['Montserrat'] font-medium text-sm mb-5">
                        Cari dan sentuh lafadz yang mengandung hukum tajwid (Ghunnah, Qalqalah, Mad).
                      </p>
                    </div>
                    <TombolBesar variant="zamrud" size="small" onClick={() => setActiveGame('tajwid')}>
                      Mulai Berburu
                    </TombolBesar>
                  </div>

                  {/* 4. Tebak Surah */}
                  <div className="flex flex-col justify-between p-6 rounded-[24px] bg-[#F8F4EA] border-2 border-[#C9A04A]/40 shadow-sm hover:border-[#C9A04A] transition-all">
                    <div>
                      <div className="flex items-center gap-3 text-[#0E4D34] mb-2">
                        <div className="p-2 rounded-xl bg-[#FFFDF6] border border-[#C9A04A] text-[#C9A04A]">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold font-['Marcellus'] text-[#0E4D34]">Tebak Surah</h4>
                      </div>
                      <p className="text-[#2B2A26]/80 font-['Montserrat'] font-medium text-sm mb-5">
                        Tebak nama surah dari arti nama, ciri ayat, atau audio pembuka.
                      </p>
                    </div>
                    <TombolBesar variant="emas" size="small" onClick={() => setActiveGame('tebak')}>
                      Mulai Modul
                    </TombolBesar>
                  </div>

                  {/* 5. Kereta Surah */}
                  <div className="flex flex-col justify-between p-6 rounded-[24px] bg-[#F8F4EA] border-2 border-[#0E4D34]/30 shadow-sm hover:border-[#0E4D34] transition-all">
                    <div>
                      <div className="flex items-center gap-3 text-[#0E4D34] mb-2">
                        <div className="p-2 rounded-xl bg-[#FFFDF6] border border-[#D9CBB0] text-[#0E4D34]">
                          <TrainTrack className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold font-['Marcellus'] text-[#0E4D34]">Kereta Surah</h4>
                      </div>
                      <p className="text-[#2B2A26]/80 font-['Montserrat'] font-medium text-sm mb-5">
                        Susun urutan gerbong surah di rel sesuai tartib mushaf Al-Qur'an.
                      </p>
                    </div>
                    <TombolBesar variant="zamrud" size="small" onClick={() => setActiveGame('kereta')}>
                      Mulai Modul
                    </TombolBesar>
                  </div>

                  {/* 6. Kartu Kembar */}
                  <div className="flex flex-col justify-between p-6 rounded-[24px] bg-[#F8F4EA] border-2 border-[#1B6B47]/40 shadow-sm hover:border-[#1B6B47] transition-all">
                    <div>
                      <div className="flex items-center gap-3 text-[#1B6B47] mb-2">
                        <div className="p-2 rounded-xl bg-[#FFFDF6] border border-[#D9CBB0] text-[#1B6B47]">
                          <Grid className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold font-['Marcellus'] text-[#0E4D34]">Kartu Kembar</h4>
                      </div>
                      <p className="text-[#2B2A26]/80 font-['Montserrat'] font-medium text-sm mb-3">
                        Temukan pasangan nama dan arti surah dalam papan memori interaktif.
                      </p>
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => setKartuKembarMode('solo')}
                          className={`px-3 py-1 rounded-full text-xs font-bold font-['Montserrat'] border cursor-pointer ${
                            kartuKembarMode === 'solo'
                              ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34]'
                              : 'bg-[#FFFDF6] text-[#2B2A26] border-[#D9CBB0]'
                          }`}
                        >
                          Mode Solo
                        </button>
                        <button
                          onClick={() => setKartuKembarMode('tim')}
                          className={`px-3 py-1 rounded-full text-xs font-bold font-['Montserrat'] border cursor-pointer ${
                            kartuKembarMode === 'tim'
                              ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34]'
                              : 'bg-[#FFFDF6] text-[#2B2A26] border-[#D9CBB0]'
                          }`}
                        >
                          Mode Tim
                        </button>
                      </div>
                    </div>
                    <TombolBesar variant="zamrud" size="small" onClick={() => setActiveGame('kartu')}>
                      Mulai Modul
                    </TombolBesar>
                  </div>

                  {/* 7. Duel Tim (Spanning Full Grid Width on large screens) */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-[24px] bg-gradient-to-r from-[#F8F4EA] to-[#FFFDF6] border-2 border-[#C9A04A] shadow-md md:col-span-2 lg:col-span-3">
                    <div>
                      <div className="flex items-center gap-3 text-[#0E4D34] mb-1">
                        <Users className="w-6 h-6 text-[#C9A04A]" />
                        <h4 className="text-2xl font-bold font-['Marcellus'] text-[#0E4D34]">
                          Duel Tim Cepat Tepat (Buzzer)
                        </h4>
                      </div>
                      <p className="text-[#2B2A26]/80 font-['Montserrat'] font-medium text-sm">
                        Layar terbelah multi-touch untuk 2 tim sekelas: Tim Zamrud vs Tim Emas!
                      </p>
                    </div>
                    <TombolBesar variant="emas" size="normal" onClick={() => setActiveGame('duel')}>
                      Mulai Duel Tim
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
                <div className="flex flex-col gap-6">
                  <div className="p-8 rounded-[32px] bg-[#FFFDF6] border-2 border-[#0E4D34] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="px-4 py-1.5 rounded-full bg-[#0E4D34]/10 border border-[#0E4D34]/30 text-[#0E4D34] text-xs font-bold uppercase tracking-wider inline-block mb-3 font-['Montserrat']">
                        Fitur Interaktif
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-[#0E4D34] font-['Marcellus'] mb-2">
                        Kisah & Kuis Pemahaman Asbabun Nuzul
                      </h3>
                      <p className="text-[#2B2A26]/80 text-base font-['Montserrat'] font-medium max-w-2xl">
                        Ikuti petualangan narasi multi-panel asbabun nuzul Surah {surah.namaLatin}, selesaikan kuis pemahaman, dan temukan pesan amalan mulia.
                      </p>
                    </div>
                    <TombolBesar
                      variant="emas"
                      size="normal"
                      icon={<BookOpen className="w-6 h-6 text-[#0E4D34]" />}
                      onClick={() => setActiveGame('kisahScreen')}
                    >
                      Buka Kisah Interaktif
                    </TombolBesar>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-md">
                      <div className="flex items-center gap-3 text-[#0E4D34] mb-3">
                        <BookOpen className="w-6 h-6 text-[#0E4D34]" />
                        <h3 className="text-2xl font-bold font-['Marcellus'] text-[#0E4D34]">
                          Ringkasan Kisah
                        </h3>
                      </div>
                      <p className="text-base md:text-lg text-[#2B2A26] font-['Montserrat'] leading-relaxed font-medium">
                        {surah.ringkasanKisah}
                      </p>
                    </div>

                    <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#C9A04A]/40 shadow-md">
                      <div className="flex items-center gap-3 text-[#0E4D34] mb-3">
                        <HeartHandshake className="w-6 h-6 text-[#C9A04A]" />
                        <h3 className="text-2xl font-bold font-['Marcellus'] text-[#0E4D34]">
                          Pesan Akhlak
                        </h3>
                      </div>
                      <p className="text-base md:text-lg text-[#2B2A26] font-['Montserrat'] leading-relaxed font-medium">
                        {surah.pesanAkhlak}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <ModalPilihQari
          isOpen={showQariModal}
          onClose={() => setShowQariModal(false)}
        />
      </div>
    </LatarParallax>
  );
};
