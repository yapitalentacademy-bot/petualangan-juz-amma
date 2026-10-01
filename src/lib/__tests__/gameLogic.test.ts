import { describe, it, expect } from 'vitest';
import {
  calculateStars,
  checkSambungAyatAnswer,
  chunkAyatWords,
  generateSambungAyatQuestions,
  checkSusunAyatAnswer,
  generateTebakSurahQuestions,
  generateKeretaSurahQuestions,
  checkKeretaSurahOrder,
  generateKartuKembarDeck,
} from '../gameLogic';

describe('Logika Mini-Game Petualangan Juz Amma', () => {
  describe('Perhitungan Bintang (calculateStars)', () => {
    it('memberikan 3 bintang untuk akurasi 100%', () => {
      expect(calculateStars(100)).toBe(3);
    });

    it('memberikan 2 bintang untuk akurasi >= 80% dan < 100%', () => {
      expect(calculateStars(80)).toBe(2);
      expect(calculateStars(95)).toBe(2);
    });

    it('memberikan 1 bintang untuk akurasi >= 60% dan < 80%', () => {
      expect(calculateStars(60)).toBe(1);
      expect(calculateStars(75)).toBe(1);
    });

    it('memberikan 0 bintang untuk akurasi < 60%', () => {
      expect(calculateStars(59)).toBe(0);
      expect(calculateStars(0)).toBe(0);
    });
  });

  describe('Pengecekan Jawaban Sambung Ayat (checkSambungAyatAnswer)', () => {
    it('menghasilkan soal sambung ayat yang valid', () => {
      const q = generateSambungAyatQuestions(105, 4);
      expect(q.length).toBeGreaterThan(0);
      expect(q[0].jawabanBenar.nomor).toBe(2);
    });

    it('memberikan 15 poin jika benar pada percobaan pertama', () => {
      const result = checkSambungAyatAnswer(105, 2, 105, 2, true);
      expect(result.isCorrect).toBe(true);
      expect(result.scoreDelta).toBe(15);
    });

    it('memberikan 10 poin jika benar setelah percobaan pertama', () => {
      const result = checkSambungAyatAnswer(105, 2, 105, 2, false);
      expect(result.isCorrect).toBe(true);
      expect(result.scoreDelta).toBe(10);
    });

    it('mengembalikan isCorrect false dan 0 poin jika salah', () => {
      const result = checkSambungAyatAnswer(105, 3, 105, 2, true);
      expect(result.isCorrect).toBe(false);
      expect(result.scoreDelta).toBe(0);
    });
  });

  describe('Pemotongan Kata Susun Ayat berdasarkan Level (chunkAyatWords)', () => {
    const sampleWords = ['أَلَمْ', 'تَرَ', 'كَيْفَ', 'فَعَلَ', 'رَبُّكَ', 'بِأَصْحَابِ', 'الْفِيلِ']; // 7 kata

    it('membatasi maksimal 5 potongan untuk Kelas 4', () => {
      const chunks = chunkAyatWords(sampleWords, 4);
      expect(chunks.length).toBeLessThanOrEqual(5);
      expect(chunks.map((c) => c.teks).join(' ')).toBe(sampleWords.join(' '));
    });

    it('membatasi maksimal 8 potongan untuk Kelas 5', () => {
      const chunks = chunkAyatWords(sampleWords, 5);
      expect(chunks.length).toBeLessThanOrEqual(8);
      expect(chunks.length).toBe(7);
    });

    it('memotong setiap kata secara individu untuk Kelas 6', () => {
      const chunks = chunkAyatWords(sampleWords, 6);
      expect(chunks.length).toBe(sampleWords.length);
      expect(chunks[0].teks).toBe('أَلَمْ');
      expect(chunks[chunks.length - 1].teks).toBe('الْفِيلِ');
    });
  });

  describe('Pengecekan Urutan Susun Ayat RTL (checkSusunAyatAnswer)', () => {
    const targetChunks = [
      { id: 'c0', teks: 'قُلْ', urutanBenar: 0 },
      { id: 'c1', teks: 'هُوَ', urutanBenar: 1 },
      { id: 'c2', teks: 'اللَّهُ', urutanBenar: 2 },
      { id: 'c3', teks: 'أَحَدٌ', urutanBenar: 3 },
    ];

    it('mendeteksi jawaban susunan lengkap dan benar', () => {
      const currentSlots = ['c0', 'c1', 'c2', 'c3'];
      const result = checkSusunAyatAnswer(currentSlots, targetChunks);
      expect(result.isComplete).toBe(true);
      expect(result.isCorrect).toBe(true);
      expect(result.correctCount).toBe(4);
    });

    it('mendeteksi jawaban yang belum lengkap terisi', () => {
      const currentSlots = ['c0', 'c1', null, null];
      const result = checkSusunAyatAnswer(currentSlots, targetChunks);
      expect(result.isComplete).toBe(false);
      expect(result.isCorrect).toBe(false);
    });
  });

  describe('Generator Soal Tebak Surah (generateTebakSurahQuestions)', () => {
    it('menghasilkan varian soal arti, jumlah ayat, dan ayat pertama', () => {
      const questions = generateTebakSurahQuestions(105, 4);
      expect(questions.length).toBeGreaterThanOrEqual(3);
      expect(questions.some((q) => q.varian === 'arti')).toBe(true);
      expect(questions.some((q) => q.varian === 'jumlah_ayat')).toBe(true);
      expect(questions.some((q) => q.varian === 'ayat_pertama')).toBe(true);
    });

    it('memastikan setiap soal untuk semua surah (termasuk Al-Ikhlas 112 & An-Nas 114) SELALU memiliki jawaban yang benar di dalam pilihan', () => {
      [105, 106, 107, 108, 112, 114].forEach((sId) => {
        const questions = generateTebakSurahQuestions(sId, 6);
        expect(questions.length).toBeGreaterThan(0);
        questions.forEach((q) => {
          expect(q.pilihan.length).toBe(4);
          const correctChoices = q.pilihan.filter((p) => p.isCorrect);
          expect(correctChoices.length).toBe(1);
          expect(correctChoices[0].surahId).toBe(q.surahBenarId);
        });
      });
    });
  });

  describe('Generator & Validator Kereta Surah (generateKeretaSurahQuestions)', () => {
    it('menghasilkan 5 gerbong untuk Kelas 4 dan 6 gerbong untuk Kelas 5', () => {
      const q4 = generateKeretaSurahQuestions(4);
      expect(q4.gerbongAcak.length).toBe(5);
      expect(q4.urutanTarget.length).toBe(5);

      const q5 = generateKeretaSurahQuestions(5);
      expect(q5.gerbongAcak.length).toBe(6);
    });

    it('memvalidasi urutan nomor surah secara akurat', () => {
      expect(checkKeretaSurahOrder([105, 106, 107, 108])).toBe(true);
      expect(checkKeretaSurahOrder([105, 108, 106, 107])).toBe(false);
      expect(checkKeretaSurahOrder([114, 113, 112])).toBe(false);
    });
  });

  describe('Generator Kartu Kembar Deck (generateKartuKembarDeck)', () => {
    it('menghasilkan 12 kartu (6 pasangan cocok) dalam grid 4x3', () => {
      const deck = generateKartuKembarDeck([105, 106, 107, 108, 112, 114]);
      expect(deck.length).toBe(12);

      // Pastikan setiap pairId muncul tepat 2 kali
      const pairCounts: Record<string, number> = {};
      deck.forEach((c) => {
        pairCounts[c.pairId] = (pairCounts[c.pairId] || 0) + 1;
      });

      Object.values(pairCounts).forEach((count) => {
        expect(count).toBe(2);
      });
    });
  });
});
