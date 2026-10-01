import { KelasLevel, SurahDetail, SurahMeta } from '../types/surah';
import {
  SambungAyatQuestion,
  SusunAyatQuestion,
  TebakSurahQuestion,
  KeretaSurahItem,
  KartuKembarCard,
} from '../types/game';
import sampleSurahsData from '../data/sample-surahs.json';
import surahListData from '../data/surah-list.json';

const surahsRecord = sampleSurahsData as Record<string, SurahDetail>;
const allSurahsList = surahListData as SurahMeta[];

/**
 * Star calculation according to BRIEF:
 * >= 60%: 1 star
 * >= 80%: 2 stars
 * 100%: 3 stars
 */
export function calculateStars(accuracyPercent: number): number {
  if (accuracyPercent >= 100) return 3;
  if (accuracyPercent >= 80) return 2;
  if (accuracyPercent >= 60) return 1;
  return 0;
}

/**
 * Sambung Ayat Answer Checker
 * Skor: 10 poin per benar, bonus 5 bila benar pada percobaan pertama.
 */
export function checkSambungAyatAnswer(
  selectedSurahId: number,
  selectedAyatNomor: number,
  correctSurahId: number,
  correctAyatNomor: number,
  isFirstTry: boolean
): { isCorrect: boolean; scoreDelta: number } {
  const isCorrect = selectedSurahId === correctSurahId && selectedAyatNomor === correctAyatNomor;
  if (!isCorrect) {
    return { isCorrect: false, scoreDelta: 0 };
  }
  return {
    isCorrect: true,
    scoreDelta: isFirstTry ? 15 : 10,
  };
}

/**
 * Generator Soal Sambung Ayat
 */
export function generateSambungAyatQuestions(
  surahId: number,
  level: KelasLevel
): SambungAyatQuestion[] {
  const surah = surahsRecord[String(surahId)];
  if (!surah || surah.ayat.length < 2) return [];

  const numChoices = level === 4 ? 3 : 4;
  const questions: SambungAyatQuestion[] = [];

  const allOtherAyats: {
    surahId: number;
    nomor: number;
    arab: string;
    latin: string;
    terjemah: string;
    audio: string;
  }[] = [];

  Object.values(surahsRecord).forEach((s) => {
    s.ayat.forEach((a) => {
      allOtherAyats.push({
        surahId: s.id,
        nomor: a.nomor,
        arab: a.arab,
        latin: a.latin,
        terjemah: a.terjemah,
        audio: a.audio,
      });
    });
  });

  for (let i = 0; i < surah.ayat.length - 1; i++) {
    const promptAyatData = surah.ayat[i];
    const nextAyatData = surah.ayat[i + 1];

    const correctAnswer = {
      surahId: surah.id,
      nomor: nextAyatData.nomor,
      arab: nextAyatData.arab,
      latin: nextAyatData.latin,
      terjemah: nextAyatData.terjemah,
      audio: nextAyatData.audio,
      isCorrect: true,
    };

    const distractors: typeof correctAnswer[] = [];
    surah.ayat.forEach((a) => {
      if (a.nomor !== nextAyatData.nomor && a.nomor !== promptAyatData.nomor) {
        distractors.push({
          surahId: surah.id,
          nomor: a.nomor,
          arab: a.arab,
          latin: a.latin,
          terjemah: a.terjemah,
          audio: a.audio,
          isCorrect: false,
        });
      }
    });

    if (distractors.length < numChoices - 1) {
      const shuffledOthers = [...allOtherAyats]
        .filter((a) => a.surahId !== surah.id || a.nomor !== nextAyatData.nomor)
        .sort(() => 0.5 - Math.random());

      for (const item of shuffledOthers) {
        if (distractors.length >= numChoices - 1) break;
        if (!distractors.some((d) => d.surahId === item.surahId && d.nomor === item.nomor)) {
          distractors.push({
            ...item,
            isCorrect: false,
          });
        }
      }
    }

    const finalDistractors = distractors.slice(0, numChoices - 1);
    const pilihanAyat = [correctAnswer, ...finalDistractors].sort(() => 0.5 - Math.random());

    questions.push({
      id: `sa_${surah.id}_${promptAyatData.nomor}`,
      nomorSoal: i + 1,
      promptAyat: {
        surahId: surah.id,
        surahLatin: surah.namaLatin,
        nomor: promptAyatData.nomor,
        arab: promptAyatData.arab,
        latin: promptAyatData.latin,
        terjemah: promptAyatData.terjemah,
        audio: promptAyatData.audio,
      },
      jawabanBenar: {
        surahId: surah.id,
        nomor: nextAyatData.nomor,
        arab: nextAyatData.arab,
        latin: nextAyatData.latin,
        terjemah: nextAyatData.terjemah,
        audio: nextAyatData.audio,
      },
      pilihanAyat,
    });
  }

  return questions;
}

/**
 * Pemotongan Kata untuk Susun Ayat berdasarkan Level
 */
export function chunkAyatWords(
  words: string[],
  level: KelasLevel
): { id: string; teks: string; urutanBenar: number }[] {
  if (!words || words.length === 0) return [];

  const maxChunks = level === 4 ? 5 : level === 5 ? 8 : words.length;

  if (words.length <= maxChunks) {
    return words.map((word, idx) => ({
      id: `chunk_${idx}_${word}`,
      teks: word,
      urutanBenar: idx,
    }));
  }

  const chunkSize = Math.ceil(words.length / maxChunks);
  const chunks: { id: string; teks: string; urutanBenar: number }[] = [];

  let chunkIndex = 0;
  for (let i = 0; i < words.length; i += chunkSize) {
    const slice = words.slice(i, i + chunkSize);
    chunks.push({
      id: `chunk_${chunkIndex}_${slice.join('_')}`,
      teks: slice.join(' '),
      urutanBenar: chunkIndex,
    });
    chunkIndex++;
  }

  return chunks;
}

/**
 * Generator Soal Susun Ayat
 */
export function generateSusunAyatQuestions(
  surahId: number,
  level: KelasLevel
): SusunAyatQuestion[] {
  const surah = surahsRecord[String(surahId)];
  if (!surah) return [];

  return surah.ayat.map((a) => {
    const chunks = chunkAyatWords(a.kata, level);
    return {
      id: `su_${surah.id}_${a.nomor}`,
      surahId: surah.id,
      nomorAyat: a.nomor,
      arabLengkap: a.arab,
      latin: a.latin,
      terjemah: a.terjemah,
      audio: a.audio,
      potonganKata: chunks,
    };
  });
}

/**
 * Pengecek Jawaban Susun Ayat (Urutan RTL Kanan ke Kiri)
 */
export function checkSusunAyatAnswer(
  currentSlots: (string | null)[],
  targetChunks: { id: string; teks: string; urutanBenar: number }[]
): { isComplete: boolean; isCorrect: boolean; correctCount: number } {
  if (currentSlots.length !== targetChunks.length) {
    return { isComplete: false, isCorrect: false, correctCount: 0 };
  }

  const isComplete = currentSlots.every((slot) => slot !== null);
  let correctCount = 0;

  for (let i = 0; i < targetChunks.length; i++) {
    if (currentSlots[i] === targetChunks[i].id) {
      correctCount++;
    }
  }

  const isCorrect = isComplete && correctCount === targetChunks.length;

  return {
    isComplete,
    isCorrect,
    correctCount,
  };
}

/**
 * Helper untuk membuat 4 pilihan jawaban Tebak Surah
 * Menjamin 1 jawaban benar (isCorrect: true) + 3 pengecoh acak (isCorrect: false)
 */
function buildTebakSurahChoices(targetSurahId: number, numChoices: number = 4) {
  const target =
    allSurahsList.find((s) => s.id === targetSurahId) ||
    surahsRecord[String(targetSurahId)];
  if (!target) return [];

  const correctChoice = {
    surahId: target.id,
    namaLatin: target.namaLatin,
    namaArab: target.namaArab,
    arti: target.arti,
    isCorrect: true,
  };

  // Ambil kandidat pengecoh dari surah-surah lain
  const otherSurahs = allSurahsList
    .filter((s) => s.id !== targetSurahId)
    .sort(() => 0.5 - Math.random());

  const distractors = otherSurahs.slice(0, numChoices - 1).map((s) => ({
    surahId: s.id,
    namaLatin: s.namaLatin,
    namaArab: s.namaArab,
    arti: s.arti,
    isCorrect: false,
  }));

  return [correctChoice, ...distractors].sort(() => 0.5 - Math.random());
}

/**
 * Generator Soal Tebak Surah
 * 3 Varian: Arti nama, Jumlah ayat & tempat turun, Ayat pertama / audio
 */
export function generateTebakSurahQuestions(
  surahId: number,
  level: KelasLevel
): TebakSurahQuestion[] {
  const surah =
    surahsRecord[String(surahId)] ||
    allSurahsList.find((s) => s.id === surahId);
  if (!surah) return [];

  const questions: TebakSurahQuestion[] = [];

  // Varian 1: Dari Arti Nama
  questions.push({
    id: `ts_${surah.id}_arti`,
    varian: 'arti',
    petunjuk: `Surah yang memiliki arti nama "${surah.arti}" adalah...`,
    surahBenarId: surah.id,
    pilihan: buildTebakSurahChoices(surah.id, 4),
  });

  // Varian 2: Dari Jumlah Ayat & Golongan Surah
  questions.push({
    id: `ts_${surah.id}_jml`,
    varian: 'jumlah_ayat',
    petunjuk: `Surah golongan ${surah.tempatTurun} yang terdiri dari ${surah.jumlahAyat} ayat adalah...`,
    surahBenarId: surah.id,
    pilihan: buildTebakSurahChoices(surah.id, 4),
  });

  // Varian 3: Dari Ayat Pertama
  const firstAyat =
    'ayat' in surah && surah.ayat && surah.ayat[0] ? surah.ayat[0] : null;
  if (firstAyat) {
    questions.push({
      id: `ts_${surah.id}_ayat1`,
      varian: 'ayat_pertama',
      petunjuk: `Ayat pembuka di bawah ini merupakan ayat pertama dari Surah...`,
      petunjukArab: firstAyat.arab,
      audioAyat: {
        surahId: surah.id,
        ayatNomor: 1,
      },
      surahBenarId: surah.id,
      pilihan: buildTebakSurahChoices(surah.id, 4),
    });
  }

  // Jika level 5 atau 6, tambahkan soal surah tetangga sebagai variasi tantangan
  if (level >= 5) {
    const otherSurah = allSurahsList.find((s) => s.id !== surah.id);
    if (otherSurah) {
      questions.push({
        id: `ts_${otherSurah.id}_arti`,
        varian: 'arti',
        petunjuk: `Surah yang berarti "${otherSurah.arti}" (${otherSurah.jumlahAyat} ayat) adalah...`,
        surahBenarId: otherSurah.id,
        pilihan: buildTebakSurahChoices(otherSurah.id, 4),
      });
    }
  }

  return questions;
}

/**
 * Generator Kereta Surah
 * Mengambil 5–8 gerbong surah acak untuk disusun sesuai urutan mushaf
 */
export function generateKeretaSurahQuestions(
  level: KelasLevel
): { gerbongAcak: KeretaSurahItem[]; urutanTarget: KeretaSurahItem[] } {
  const count = level === 4 ? 5 : level === 5 ? 6 : 8;

  // Ambil surah-surah yang tersedia (sample dan list)
  const availableSurahs = allSurahsList.slice(15, 37); // Ad-Dhuha (93) s.d. An-Nas (114)
  const shuffledPick = [...availableSurahs].sort(() => 0.5 - Math.random()).slice(0, count);

  // Urutkan target sesuai urutan nomor mushaf (nomorSurah kecil ke besar)
  const urutanTarget = [...shuffledPick]
    .sort((a, b) => a.nomorSurah - b.nomorSurah)
    .map((s) => ({
      id: `gerbong_${s.id}`,
      surahId: s.id,
      nomorSurah: s.nomorSurah,
      namaLatin: s.namaLatin,
      namaArab: s.namaArab,
      arti: s.arti,
    }));

  // Gerbong acak untuk pemain
  const gerbongAcak = [...urutanTarget].sort(() => 0.5 - Math.random());

  return {
    gerbongAcak,
    urutanTarget,
  };
}

/**
 * Pengecek Urutan Kereta Surah
 */
export function checkKeretaSurahOrder(currentOrderIds: number[]): boolean {
  if (currentOrderIds.length < 2) return true;
  for (let i = 0; i < currentOrderIds.length - 1; i++) {
    if (currentOrderIds[i] >= currentOrderIds[i + 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Generator Kartu Kembar (Memory Match 4x3 = 12 kartu / 6 pasang)
 */
export function generateKartuKembarDeck(
  _surahIds?: number[]
): KartuKembarCard[] {
  const sampleList = Object.values(surahsRecord);
  const selectedSurahs = sampleList.slice(0, 6); // 6 surah = 6 pasang = 12 kartu

  const cards: KartuKembarCard[] = [];

  selectedSurahs.forEach((surah) => {
    const pairId = `pair_${surah.id}`;

    // Kartu A: Nama Surah (Arab & Latin)
    cards.push({
      id: `card_${surah.id}_nama`,
      pairId,
      tipe: 'nama_surah',
      teksUtama: surah.namaLatin,
      arab: surah.namaArab,
      teksSekunder: `Surah ke-${surah.id}`,
      isFlipped: false,
      isMatched: false,
    });

    // Kartu B: Arti Surah & Jumlah Ayat
    cards.push({
      id: `card_${surah.id}_arti`,
      pairId,
      tipe: 'arti_surah',
      teksUtama: surah.arti,
      teksSekunder: `${surah.jumlahAyat} Ayat • ${surah.tempatTurun}`,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Acak posisi kartu dalam grid 4x3
  return cards.sort(() => 0.5 - Math.random());
}
