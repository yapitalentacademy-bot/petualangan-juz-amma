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
 * Filter rentang surah berdasarkan level kelas:
 * - Kelas 4: An-Nas (114) s.d. Ad-Dhuha (93) (22 surah: nomor 93–114)
 * - Kelas 5: An-Nas (114) s.d. Al-A'la (87)   (28 surah: nomor 87–114)
 * - Kelas 6: An-Nas (114) s.d. An-Naba' (78)  (37 surah: nomor 78–114 / full Juz 30)
 */
export function getSurahsForLevel(level: KelasLevel): SurahMeta[] {
  if (level === 4) {
    return allSurahsList.filter((s) => s.id >= 93 && s.id <= 114);
  }
  if (level === 5) {
    return allSurahsList.filter((s) => s.id >= 87 && s.id <= 114);
  }
  return allSurahsList.filter((s) => s.id >= 78 && s.id <= 114);
}

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
 * Urutan soal diacak sehingga tidak monoton berurutan.
 * Pengecoh ayat disaring dari surah-surah sesuai rentang kelas.
 */
export function generateSambungAyatQuestions(
  surahId: number,
  level: KelasLevel
): SambungAyatQuestion[] {
  const surah = surahsRecord[String(surahId)];
  if (!surah || surah.ayat.length < 2) return [];

  const numChoices = level === 4 ? 3 : 4;
  const questions: SambungAyatQuestion[] = [];
  const levelSurahs = getSurahsForLevel(level);
  const levelSurahIdSet = new Set(levelSurahs.map((s) => s.id));

  const allOtherAyats: {
    surahId: number;
    nomor: number;
    arab: string;
    latin: string;
    terjemah: string;
    audio: string;
  }[] = [];

  Object.values(surahsRecord).forEach((s) => {
    // Utamakan surah-surah yang ada dalam rentang level
    if (levelSurahIdSet.has(s.id)) {
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
    }
  });

  // Jika data sampel level sedikit, sertakan seluruh data sampel sebagai cadangan
  if (allOtherAyats.length < 10) {
    Object.values(surahsRecord).forEach((s) => {
      s.ayat.forEach((a) => {
        if (!allOtherAyats.some((existing) => existing.surahId === s.id && existing.nomor === a.nomor)) {
          allOtherAyats.push({
            surahId: s.id,
            nomor: a.nomor,
            arab: a.arab,
            latin: a.latin,
            terjemah: a.terjemah,
            audio: a.audio,
          });
        }
      });
    });
  }

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

    // 1. Ambil ayat-ayat lain dari surah yang sama (selain ayat target & prompt) dan ACAK
    const sameSurahDistractors = surah.ayat
      .filter((a) => a.nomor !== nextAyatData.nomor && a.nomor !== promptAyatData.nomor)
      .map((a) => ({
        surahId: surah.id,
        nomor: a.nomor,
        arab: a.arab,
        latin: a.latin,
        terjemah: a.terjemah,
        audio: a.audio,
        isCorrect: false,
      }))
      .sort(() => 0.5 - Math.random());

    // 2. Ambil ayat-ayat dari surah lain di Juz 30 dan ACAK
    const otherSurahDistractors = allOtherAyats
      .filter((a) => a.surahId !== surah.id)
      .map((a) => ({
        ...a,
        isCorrect: false,
      }))
      .sort(() => 0.5 - Math.random());

    // 3. Gabungkan dan ACAK seluruh kandidat pengecoh agar bervariasi di tiap soal
    const candidatePool = [...sameSurahDistractors, ...otherSurahDistractors].sort(() => 0.5 - Math.random());

    const finalDistractors: typeof correctAnswer[] = [];
    for (const d of candidatePool) {
      if (finalDistractors.length >= numChoices - 1) break;
      if (!finalDistractors.some((fd) => fd.surahId === d.surahId && fd.nomor === d.nomor)) {
        finalDistractors.push(d);
      }
    }

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

  // Acak susunan urutan soal agar tidak selalu berurutan dari ayat 1
  const randomized = [...questions].sort(() => 0.5 - Math.random());
  return randomized.map((q, idx) => ({
    ...q,
    nomorSoal: idx + 1,
  }));
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
 * Urutan ayat diacak agar pemain mendapatkan tantangan ayat secara variatif.
 */
export function generateSusunAyatQuestions(
  surahId: number,
  level: KelasLevel
): SusunAyatQuestion[] {
  const surah = surahsRecord[String(surahId)];
  if (!surah) return [];

  const list = surah.ayat.map((a) => {
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

  // Acak susunan urutan soal ayat
  return [...list].sort(() => 0.5 - Math.random());
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
 * Mengambil kandidat pengecoh dari surah-surah yang sesuai dengan rentang level kelas
 */
function buildTebakSurahChoices(
  targetSurahId: number,
  level: KelasLevel = 4,
  numChoices: number = 4
) {
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

  // Ambil kandidat pengecoh dari rentang level kelas
  const levelSurahs = getSurahsForLevel(level);
  let otherSurahs = levelSurahs
    .filter((s) => s.id !== targetSurahId)
    .sort(() => 0.5 - Math.random());

  // Jika surah di rentang kelas kurang dari yang dibutuhkan, fallback ke daftar lengkap
  if (otherSurahs.length < numChoices - 1) {
    const backupSurahs = allSurahsList
      .filter((s) => s.id !== targetSurahId && !otherSurahs.some((os) => os.id === s.id))
      .sort(() => 0.5 - Math.random());
    otherSurahs = [...otherSurahs, ...backupSurahs];
  }

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
 * Soal disajikan secara acak dengan rentang surah sesuai kelas.
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
    pilihan: buildTebakSurahChoices(surah.id, level, 4),
  });

  // Varian 2: Dari Jumlah Ayat & Golongan Surah
  questions.push({
    id: `ts_${surah.id}_jml`,
    varian: 'jumlah_ayat',
    petunjuk: `Surah golongan ${surah.tempatTurun} yang terdiri dari ${surah.jumlahAyat} ayat adalah...`,
    surahBenarId: surah.id,
    pilihan: buildTebakSurahChoices(surah.id, level, 4),
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
      pilihan: buildTebakSurahChoices(surah.id, level, 4),
    });
  }

  // Tambahkan soal tantangan dari surah lain dalam rentang kelas yang dipilih
  const levelSurahs = getSurahsForLevel(level).filter((s) => s.id !== surah.id);
  const shuffledOthers = [...levelSurahs].sort(() => 0.5 - Math.random());

  // Untuk variasi tantangan, ambil 1-2 surah lain dari rentang kelas
  const extraSurahs = shuffledOthers.slice(0, level >= 5 ? 2 : 1);
  extraSurahs.forEach((otherSurah) => {
    questions.push({
      id: `ts_${otherSurah.id}_arti_${Math.random().toString(36).substring(2, 6)}`,
      varian: 'arti',
      petunjuk: `Surah yang berarti "${otherSurah.arti}" (${otherSurah.jumlahAyat} ayat) adalah...`,
      surahBenarId: otherSurah.id,
      pilihan: buildTebakSurahChoices(otherSurah.id, level, 4),
    });
  });

  // Acak susunan soal tebak surah
  return [...questions].sort(() => 0.5 - Math.random());
}

/**
 * Generator Kereta Surah
 * Mengambil 5–8 gerbong surah acak dari rentang level kelas untuk disusun sesuai urutan mushaf
 * - Kelas 4: 93 s.d. 114 (5 gerbong)
 * - Kelas 5: 87 s.d. 114 (6 gerbong)
 * - Kelas 6: 78 s.d. 114 (8 gerbong)
 */
export function generateKeretaSurahQuestions(
  level: KelasLevel
): { gerbongAcak: KeretaSurahItem[]; urutanTarget: KeretaSurahItem[] } {
  const count = level === 4 ? 5 : level === 5 ? 6 : 8;
  const availableSurahs = getSurahsForLevel(level);

  // Ambil surah secara acak dari rentang level
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
 * Mengambil 6 surah secara acak dari rentang level kelas.
 */
export function generateKartuKembarDeck(
  surahIds?: number[],
  level: KelasLevel = 4
): KartuKembarCard[] {
  const levelSurahs = getSurahsForLevel(level);
  const sampleList = Object.values(surahsRecord);

  // Cari surah yang datanya tersedia lengkap di sampleList atau fallback ke levelSurahs
  const availableSurahsMap = new Map<number, {
    id: number;
    namaLatin: string;
    namaArab: string;
    arti: string;
    jumlahAyat: number;
    tempatTurun: string;
  }>();

  // Masukkan surah dari list level
  levelSurahs.forEach((s) => {
    availableSurahsMap.set(s.id, s);
  });

  // Timpa dengan data sample jika ada
  sampleList.forEach((s) => {
    if (availableSurahsMap.has(s.id) || level >= s.level) {
      availableSurahsMap.set(s.id, s);
    }
  });

  const pool = Array.from(availableSurahsMap.values());
  const selectedSurahs: typeof pool = [];

  // Jika ada surahIds yang diprioritaskan
  if (surahIds && surahIds.length > 0) {
    surahIds.forEach((id) => {
      const found = pool.find((s) => s.id === id);
      if (found && !selectedSurahs.some((s) => s.id === found.id)) {
        selectedSurahs.push(found);
      }
    });
  }

  // Lengkapi hingga 6 surah dengan surah acak dari pool level
  const remaining = pool
    .filter((s) => !selectedSurahs.some((sel) => sel.id === s.id))
    .sort(() => 0.5 - Math.random());

  while (selectedSurahs.length < 6 && remaining.length > 0) {
    selectedSurahs.push(remaining.pop()!);
  }

  // Jika masih kurang dari 6 (misal pool level kecil), gunakan fallback dari allSurahsList
  if (selectedSurahs.length < 6) {
    const fallback = allSurahsList
      .filter((s) => !selectedSurahs.some((sel) => sel.id === s.id))
      .sort(() => 0.5 - Math.random());
    while (selectedSurahs.length < 6 && fallback.length > 0) {
      selectedSurahs.push(fallback.pop()!);
    }
  }

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

