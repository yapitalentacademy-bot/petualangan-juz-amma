import { KelasLevel } from './surah';

export type GameMode = 'solo' | 'tim';

export interface GameResult {
  skor: number;
  maxSkor: number;
  benar: number;
  salah: number;
  totalSoal: number;
  stars: number; // 1, 2, atau 3
  akurasi: number; // 0 - 100
}

export interface MiniGameProps {
  surahId: number;
  level: KelasLevel;
  mode?: GameMode;
  onFinish: (result: GameResult) => void;
  onExit?: () => void;
  showLatin?: boolean;
  showTerjemah?: boolean;
}

export interface SambungAyatQuestion {
  id: string;
  nomorSoal: number;
  promptAyat: {
    surahId: number;
    surahLatin: string;
    nomor: number;
    arab: string;
    latin: string;
    terjemah: string;
    audio: string;
  };
  jawabanBenar: {
    surahId: number;
    nomor: number;
    arab: string;
    latin: string;
    terjemah: string;
    audio: string;
  };
  pilihanAyat: {
    surahId: number;
    nomor: number;
    arab: string;
    latin: string;
    terjemah: string;
    audio: string;
    isCorrect: boolean;
  }[];
}

export interface SusunAyatQuestion {
  id: string;
  surahId: number;
  nomorAyat: number;
  arabLengkap: string;
  latin: string;
  terjemah: string;
  audio: string;
  potonganKata: {
    id: string;
    teks: string;
    urutanBenar: number; // 0, 1, 2, ...
  }[];
}

export interface TebakSurahQuestion {
  id: string;
  varian: 'arti' | 'jumlah_ayat' | 'ayat_pertama';
  petunjuk: string;
  petunjukArab?: string;
  audioAyat?: {
    surahId: number;
    ayatNomor: number;
  };
  surahBenarId: number;
  pilihan: {
    surahId: number;
    namaLatin: string;
    namaArab: string;
    arti: string;
    isCorrect: boolean;
  }[];
}

export interface KeretaSurahItem {
  id: string;
  surahId: number;
  nomorSurah: number;
  namaLatin: string;
  namaArab: string;
  arti: string;
}

export interface KartuKembarCard {
  id: string;
  pairId: string;
  tipe: 'nama_surah' | 'arti_surah' | 'ayat_pembuka';
  teksUtama: string;
  teksSekunder?: string;
  arab?: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchedByTeam?: 'A' | 'B';
}
