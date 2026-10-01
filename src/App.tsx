import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { Beranda } from './screens/Beranda';
import { Peta } from './screens/Peta';
import { PosSurah } from './screens/PosSurah';
import { ModeGuru } from './screens/ModeGuru';
import { TentangAplikasi } from './screens/TentangAplikasi';
import { sfx } from './lib/audioPlayer';

export const App: React.FC = () => {
  const {
    currentScreen,
    selectedSurahId,
    focusSurahId,
    setFocusSurahId,
    progress,
    setKelas,
    setLevel,
    updateStars,
    manualToggleUnlock,
    toggleSetting,
    bukaPosSurah,
    kePeta,
    keBeranda,
    keModeGuru,
    keTentang,
  } = useGameStore();

  useEffect(() => {
    sfx.setSoundEnabled(progress.pengaturan.suaraEfek);
  }, [progress.pengaturan.suaraEfek]);

  const handleResetProgress = () => {
    localStorage.removeItem('petualangan_juz_amma_progress_v1');
    window.location.reload();
  };

  return (
    <div className="w-full min-h-screen bg-[#12100e] text-slate-100 selection:bg-emerald-500 selection:text-white">
      {currentScreen === 'BERANDA' && (
        <Beranda
          onStartAdventure={kePeta}
          selectedClass={progress.namaKelas}
          selectedLevel={progress.level}
          badges={progress.lencana}
          totalStars={Object.values(progress.posSelesai).reduce(
            (acc, curr) => acc + (curr?.stars || 0),
            0
          )}
          onSelectClass={setKelas}
          onSelectLevel={setLevel}
          onOpenTeacherMode={keModeGuru}
          onOpenAbout={keTentang}
        />
      )}

      {currentScreen === 'PETA' && (
        <Peta
          unlockedSurahIds={progress.posTerbuka}
          surahProgress={progress.posSelesai}
          onSelectSurah={bukaPosSurah}
          onBackToHome={keBeranda}
          onOpenTeacherMode={keModeGuru}
          classNameLabel={progress.namaKelas}
          levelLabel={progress.level}
          soundEnabled={progress.pengaturan.suaraEfek}
          onToggleSound={() => toggleSetting('suaraEfek')}
        />
      )}

      {currentScreen === 'POS_SURAH' && (
        <PosSurah
          surahId={selectedSurahId}
          onBackToMap={kePeta}
          classNameLabel={progress.namaKelas}
          levelLabel={progress.level}
          soundEnabled={progress.pengaturan.suaraEfek}
          onToggleSound={() => toggleSetting('suaraEfek')}
          showLatin={progress.pengaturan.teksLatin}
          showTerjemah={progress.pengaturan.terjemah}
          onUpdateProgress={updateStars}
          onSelectNextSurah={bukaPosSurah}
        />
      )}

      {currentScreen === 'MODE_GURU' && (
        <ModeGuru
          progress={progress}
          focusSurahId={focusSurahId}
          onBackToHome={keBeranda}
          onSetClass={setKelas}
          onSetLevel={setLevel}
          onSetFocusSurahId={setFocusSurahId}
          onManualToggleUnlock={manualToggleUnlock}
          onToggleSetting={toggleSetting}
          onResetProgress={handleResetProgress}
        />
      )}

      {currentScreen === 'TENTANG' && (
        <TentangAplikasi onBackToHome={keBeranda} />
      )}
    </div>
  );
};

export default App;
