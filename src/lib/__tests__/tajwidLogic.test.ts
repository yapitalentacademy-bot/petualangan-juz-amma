import { describe, it, expect } from 'vitest';
import {
  getTajwidRulesForLevel,
  extractTajwidTargets,
  getStoryForSurah,
} from '../tajwidLogic';
import sampleSurahsData from '../../data/sample-surahs.json';
import { SurahDetail } from '../../types/surah';

describe('Tajwid & Story Logic Tests (Fase 6)', () => {
  const surahsRecord = sampleSurahsData as Record<string, SurahDetail>;
  const surah105 = surahsRecord['105'];

  it('should filter tajwid rules correctly by class level', () => {
    const rulesLv4 = getTajwidRulesForLevel(4);
    const ruleHukumsLv4 = rulesLv4.map((r) => r.hukum);
    expect(ruleHukumsLv4).toContain('ghunnah');
    expect(ruleHukumsLv4).toContain('qalqalah');
    expect(ruleHukumsLv4).not.toContain('ikhfa');

    const rulesLv5 = getTajwidRulesForLevel(5);
    const ruleHukumsLv5 = rulesLv5.map((r) => r.hukum);
    expect(ruleHukumsLv5).toContain('mad_thabii');

    const rulesLv6 = getTajwidRulesForLevel(6);
    const ruleHukumsLv6 = rulesLv6.map((r) => r.hukum);
    expect(ruleHukumsLv6).toContain('ikhfa');
    expect(ruleHukumsLv6).toContain('idgham');
  });

  it('should extract tajwid targets from surah according to level with precise correctWordIndices', () => {
    expect(surah105).toBeDefined();
    const targetsLv4 = extractTajwidTargets(surah105, 4);
    expect(targetsLv4.length).toBeGreaterThan(0);
    // Lv4 only allows qalqalah & ghunnah
    targetsLv4.forEach((t) => {
      expect(['qalqalah', 'ghunnah']).toContain(t.hukum);
      expect(t.correctWordIndices).toBeDefined();
      expect(t.correctWordIndices.length).toBeGreaterThan(0);
      // Ensure not all words are marked correct if there are distractors
      if (t.kataAyat.length > 1) {
        expect(t.correctWordIndices.length).toBeLessThan(t.kataAyat.length);
      }
    });

    const targetsLv6 = extractTajwidTargets(surah105, 6);
    expect(targetsLv6.length).toBeGreaterThanOrEqual(targetsLv4.length);
  });

  it('should retrieve story data with 3-5 panels and 3 questions for sample surahs', () => {
    [105, 106, 107, 108, 112, 114].forEach((surahId) => {
      const surah = surahsRecord[String(surahId)];
      expect(surah).toBeDefined();

      const story = getStoryForSurah(surah);
      expect(story.surahId).toBe(surahId);
      expect(story.panels.length).toBeGreaterThanOrEqual(3);
      expect(story.panels.length).toBeLessThanOrEqual(5);

      expect(story.questions.length).toBe(3);
      story.questions.forEach((q) => {
        expect(q.pertanyaan.length).toBeGreaterThan(5);
        expect(q.pilihan.length).toBe(4);
        expect(q.jawabanBenar).toBeGreaterThanOrEqual(0);
        expect(q.jawabanBenar).toBeLessThan(4);
        expect(q.penjelasan.length).toBeGreaterThan(5);
      });

      expect(story.pesanAkhlak.length).toBeGreaterThan(10);
      expect(story.amalanNyata.length).toBeGreaterThan(10);
    });
  });

  it('should provide fallback dynamic story for any unknown surah id', () => {
    const mockSurah: SurahDetail = {
      id: 99,
      namaLatin: 'Az-Zalzalah',
      namaArab: 'الزلزلة',
      arti: 'Kegoncangan',
      jumlahAyat: 8,
      tempatTurun: 'Madaniyah',
      level: 5,
      ringkasanKisah: 'Menceritakan peristiwa dahsyat goncangan bumi di hari kiamat.',
      pesanAkhlak: 'Setiap amal kebaikan sekecil zarrah pun akan dibalas oleh Allah SWT.',
      ayat: [],
    };

    const fallbackStory = getStoryForSurah(mockSurah);
    expect(fallbackStory.surahId).toBe(99);
    expect(fallbackStory.panels.length).toBe(3);
    expect(fallbackStory.questions.length).toBe(3);
    expect(fallbackStory.pesanAkhlak).toBe(mockSurah.pesanAkhlak);
  });
});
