import { useState, useEffect } from 'react';
import { KelasLevel, KelasProgress } from '../types/surah';
import { getClassProgress, saveClassProgress, SAMPLE_SURAH_IDS, defaultClassData } from '../lib/db';
import { evaluateBadges } from '../lib/badgeSystem';

export type ScreenType = 'BERANDA' | 'PETA' | 'POS_SURAH' | 'MODE_GURU' | 'TENTANG';

const STORAGE_KEY = 'petualangan_juz_amma_progress_v1';

export function loadLocalProgress(): KelasProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const posTerbuka = Array.from(new Set([...(parsed.posTerbuka || []), ...SAMPLE_SURAH_IDS]));
      return { ...defaultClassData, ...parsed, posTerbuka };
    }
  } catch {
    // fallback
  }
  return defaultClassData;
}

export function useGameStore() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('BERANDA');
  const [selectedSurahId, setSelectedSurahId] = useState<number>(105);
  const [focusSurahId, setFocusSurahId] = useState<number>(105);
  const [progress, setProgress] = useState<KelasProgress>(loadLocalProgress);

  // Load from Dexie IndexedDB on mount & class change
  useEffect(() => {
    let isMounted = true;
    getClassProgress(progress.namaKelas).then((dbRecord) => {
      if (isMounted && dbRecord) {
        setProgress(dbRecord);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbRecord));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [progress.namaKelas]);

  // Sync state to Dexie & localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    saveClassProgress(progress, focusSurahId);
  }, [progress, focusSurahId]);

  const setKelas = async (namaKelas: string) => {
    const record = await getClassProgress(namaKelas);
    setProgress(record);
  };

  const setLevel = (level: KelasLevel) => {
    setProgress((prev) => ({ ...prev, level }));
  };

  const updateStars = (surahId: number, stars: number, score: number) => {
    setProgress((prev) => {
      const current = prev.posSelesai[surahId]?.stars || 0;
      const bestScore = Math.max(prev.posSelesai[surahId]?.skorTertinggi || 0, score);
      const newPosSelesai = {
        ...prev.posSelesai,
        [surahId]: {
          stars: Math.max(current, stars),
          skorTertinggi: bestScore,
          terakhirDimainkan: new Date().toISOString(),
        },
      };

      // Unlock next pos if stars >= 1 (Urutan anak SD: 114 An-Nas turun ke 78 An-Naba')
      const nextSurahId = surahId - 1;
      let newPosTerbuka = prev.posTerbuka;
      if (stars >= 1 && nextSurahId >= 78 && !prev.posTerbuka.includes(nextSurahId)) {
        newPosTerbuka = [...prev.posTerbuka, nextSurahId];
      }

      // Auto evaluate badges
      const newBadges = evaluateBadges(newPosSelesai);

      return {
        ...prev,
        posTerbuka: newPosTerbuka,
        posSelesai: newPosSelesai,
        lencana: newBadges,
      };
    });
  };

  const manualToggleUnlock = (surahId: number) => {
    setProgress((prev) => {
      const isCurrentlyUnlocked = prev.posTerbuka.includes(surahId);
      const newPosTerbuka = isCurrentlyUnlocked
        ? prev.posTerbuka.filter((id) => id !== surahId)
        : [...prev.posTerbuka, surahId];
      return {
        ...prev,
        posTerbuka: newPosTerbuka,
      };
    });
  };

  const unlockAllSurahs = () => {
    const allIds = Array.from({ length: 37 }, (_, i) => 78 + i); // 78 to 114
    setProgress((prev) => ({
      ...prev,
      posTerbuka: allIds,
    }));
  };

  const unlockLevelSurahs = (level: KelasLevel) => {
    let ids: number[] = [];
    if (level === 4) {
      ids = Array.from({ length: 22 }, (_, i) => 93 + i); // 93 to 114
    } else if (level === 5) {
      ids = Array.from({ length: 28 }, (_, i) => 87 + i); // 87 to 114
    } else {
      ids = Array.from({ length: 37 }, (_, i) => 78 + i); // 78 to 114
    }
    setProgress((prev) => ({
      ...prev,
      posTerbuka: ids,
    }));
  };

  const toggleSetting = (key: keyof KelasProgress['pengaturan']) => {
    setProgress((prev) => ({
      ...prev,
      pengaturan: {
        ...prev.pengaturan,
        [key]: typeof prev.pengaturan[key] === 'boolean' ? !prev.pengaturan[key] : prev.pengaturan[key],
      },
    }));
  };

  return {
    currentScreen,
    selectedSurahId,
    focusSurahId,
    setFocusSurahId,
    progress,
    setKelas,
    setLevel,
    updateStars,
    manualToggleUnlock,
    unlockAllSurahs,
    unlockLevelSurahs,
    toggleSetting,
    setCurrentScreen,
    setSelectedSurahId,
    bukaPosSurah: (id: number) => {
      setSelectedSurahId(id);
      setCurrentScreen('POS_SURAH');
    },
    kePeta: () => setCurrentScreen('PETA'),
    keBeranda: () => setCurrentScreen('BERANDA'),
    keModeGuru: () => setCurrentScreen('MODE_GURU'),
    keTentang: () => setCurrentScreen('TENTANG'),
  };
}
