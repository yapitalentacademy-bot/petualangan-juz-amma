import React, { useState, useEffect } from 'react';
import { MiniGameProps, KeretaSurahItem } from '../../types/game';
import { generateKeretaSurahQuestions, checkKeretaSurahOrder, calculateStars } from '../../lib/gameLogic';
import { sfx } from '../../lib/audioPlayer';
import { Timer, CheckCircle2, Undo2, ArrowRight } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';

export const KeretaSurahGame: React.FC<MiniGameProps> = ({
  level,
  onFinish,
  onExit,
}) => {
  const [availableGerbong, setAvailableGerbong] = useState<KeretaSurahItem[]>([]);
  const [railSlots, setRailSlots] = useState<(KeretaSurahItem | null)[]>([]);
  const [targetCount, setTargetCount] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // Setup round
  useEffect(() => {
    const { gerbongAcak, urutanTarget } = generateKeretaSurahQuestions(level);
    setAvailableGerbong(gerbongAcak);
    setRailSlots(new Array(urutanTarget.length).fill(null));
    setTargetCount(urutanTarget.length);
    setIsEvaluated(false);
    setIsSuccess(false);

    // Timer active for level 5 & 6 (30s for lv 5, 20s for lv 6)
    if (level >= 5) {
      const initialTimer = level === 5 ? 30 : 20;
      setTimerSeconds(initialTimer);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [level]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timerSeconds > 0 && !isEvaluated) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive && !isEvaluated) {
      // Time up! Auto evaluate
      handleCheckOrder();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerSeconds, isEvaluated]);

  const handlePlaceToRail = (item: KeretaSurahItem) => {
    if (isEvaluated) return;
    sfx.playClick();

    // Place into first empty slot
    const firstEmptyIndex = railSlots.findIndex((slot) => slot === null);
    if (firstEmptyIndex === -1) return;

    const newSlots = [...railSlots];
    newSlots[firstEmptyIndex] = item;
    setRailSlots(newSlots);

    setAvailableGerbong((prev) => prev.filter((g) => g.id !== item.id));

    // If all slots are now filled, auto check
    if (newSlots.every((slot) => slot !== null)) {
      setTimeout(() => {
        evaluateSlots(newSlots as KeretaSurahItem[]);
      }, 300);
    }
  };

  const handleRemoveFromRail = (slotIdx: number) => {
    if (isEvaluated) return;
    const item = railSlots[slotIdx];
    if (!item) return;

    sfx.playClick();
    const newSlots = [...railSlots];
    newSlots[slotIdx] = null;
    setRailSlots(newSlots);

    setAvailableGerbong((prev) => [...prev, item]);
  };

  const handleReset = () => {
    if (isEvaluated) return;
    sfx.playClick();
    const allItems: KeretaSurahItem[] = [];
    railSlots.forEach((slot) => {
      if (slot) allItems.push(slot);
    });
    setAvailableGerbong((prev) => [...prev, ...allItems]);
    setRailSlots(new Array(targetCount).fill(null));
  };

  const evaluateSlots = (slotsToCheck: KeretaSurahItem[]) => {
    const surahNumbers = slotsToCheck.map((s) => s.nomorSurah);
    const isOrderCorrect = checkKeretaSurahOrder(surahNumbers);

    setIsEvaluated(true);
    setIsTimerActive(false);

    if (isOrderCorrect) {
      sfx.playCorrect();
      setIsSuccess(true);
      const calculatedScore = 100 + (isTimerActive ? timerSeconds * 2 : 0);
      setScore(calculatedScore);
    } else {
      sfx.playWrong();
      setIsSuccess(false);
      setScore(40);
    }
  };

  const handleCheckOrder = () => {
    const filledSlots = railSlots.filter((s) => s !== null) as KeretaSurahItem[];
    if (filledSlots.length === targetCount) {
      evaluateSlots(filledSlots);
    } else {
      setIsEvaluated(true);
      setIsSuccess(false);
      setScore(20);
      sfx.playWrong();
    }
  };

  const handleFinish = () => {
    const finalAccuracy = isSuccess ? 100 : 50;
    const stars = calculateStars(finalAccuracy);

    onFinish({
      skor: score,
      maxSkor: 150,
      benar: isSuccess ? targetCount : 0,
      salah: isSuccess ? 0 : targetCount,
      totalSoal: targetCount,
      stars,
      akurasi: finalAccuracy,
    });
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full gap-8">
      {/* Top Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border-2 border-amber-500/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-md">
            🚂
          </div>
          <div>
            <span className="text-stone-400 font-bold text-sm block">Kereta Surah (Urutan Mushaf)</span>
            <span className="text-2xl font-black text-amber-200">
              Susun {targetCount} Gerbong Sesuai Urutan Al-Qur'an
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {level >= 5 && isTimerActive && (
            <div className="flex items-center gap-2 bg-amber-950/90 border border-amber-500/60 px-5 py-2.5 rounded-2xl text-amber-300 font-mono font-black text-2xl">
              <Timer className="w-6 h-6 animate-pulse" />
              <span>{timerSeconds}s</span>
            </div>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="touch-btn px-5 py-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 font-bold text-lg border border-stone-800 cursor-pointer"
            >
              Keluar
            </button>
          )}
        </div>
      </div>

      {/* Rel Kereta Container (Train Track) */}
      <div
        className={`
          glass-panel p-8 md:p-12 rounded-3xl border-4 transition-all
          ${
            isEvaluated
              ? isSuccess
                ? 'border-emerald-400 bg-emerald-950/80 shadow-card-glow ring-4 ring-emerald-400/80'
                : 'border-rose-500 bg-rose-950/80'
              : 'border-amber-500/50 shadow-xl'
          }
        `}
      >
        <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-amber-300">
              Rel Kereta (Urutan Surah 1 ➔ {targetCount}):
            </span>
            <span className="text-sm text-stone-400">
              Nomor surah lebih kecil di awal (kiri ➔ kanan)
            </span>
          </div>

          <button
            onClick={handleReset}
            disabled={isEvaluated}
            className="touch-btn flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl text-sm font-bold border border-stone-700 cursor-pointer disabled:opacity-40"
          >
            <Undo2 className="w-4 h-4 text-amber-400" />
            <span>Kosongkan Rel</span>
          </button>
        </div>

        {/* Rail Slots */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4 relative">
          {/* Decorative Train Track lines */}
          <div className="absolute inset-x-4 top-1/2 h-4 bg-stone-800 border-y border-stone-700 -z-10" />

          {railSlots.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleRemoveFromRail(idx)}
              className={`
                touch-btn relative flex flex-col items-center justify-between p-5 min-w-[140px] md:min-w-[160px] min-h-[140px] rounded-2xl border-3
                transition-all select-none cursor-pointer shadow-lg
                ${
                  item
                    ? isEvaluated
                      ? isSuccess
                        ? 'bg-emerald-700 text-white border-emerald-300 shadow-card-glow'
                        : 'bg-rose-900 text-white border-rose-400 animate-shake'
                      : 'bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 border-amber-400 hover:scale-105'
                    : 'bg-stone-950/90 border-dashed border-stone-700 text-stone-600'
                }
              `}
            >
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-stone-950/70 text-amber-300">
                Gerbong {idx + 1}
              </span>

              {item ? (
                <>
                  <span className="text-2xl font-black font-display text-center my-1">
                    {item.namaLatin}
                  </span>
                  <span dir="rtl" className="font-quran text-2xl text-amber-200">
                    {item.namaArab}
                  </span>
                  {isEvaluated && (
                    <span className="text-xs font-bold text-stone-200 mt-1">
                      No. {item.nomorSurah}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm font-bold text-stone-600 my-auto">
                  [Slot Kosong]
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Evaluation banner */}
        {isEvaluated && (
          <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isSuccess ? (
                <div className="flex items-center gap-2 text-emerald-300 font-black text-2xl animate-bounce">
                  <CheckCircle2 className="w-8 h-8 fill-emerald-400 text-slate-950" />
                  <span>Kereta Surah Berhasil Tersusun Rapi!</span>
                </div>
              ) : (
                <span className="text-rose-400 font-bold text-xl">
                  Urutan nomor surah belum tepat. Silakan pelajari kembali urutan mushaf!
                </span>
              )}
            </div>

            <TombolBesar
              variant="oasis"
              size="normal"
              icon={<ArrowRight className="w-6 h-6" />}
              onClick={handleFinish}
            >
              Selesai & Lihat Skor
            </TombolBesar>
          </div>
        )}
      </div>

      {/* Available Gerbong Bank */}
      {!isEvaluated && (
        <div className="glass-panel p-8 rounded-3xl border-2 border-stone-700">
          <h4 className="text-2xl font-black text-amber-300 font-display mb-4">
            Pilih Gerbong Surah Di Bawah Ini:
          </h4>

          {availableGerbong.length === 0 && (
            <p className="text-xl text-stone-400 font-medium py-4 text-center">
              Semua gerbong telah ditaruh di rel. Sentuh gerbong di rel jika ingin memindahkannya.
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-5 min-h-[100px]">
            {availableGerbong.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePlaceToRail(item)}
                className="touch-btn flex flex-col items-center justify-center p-5 min-w-[150px] rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 hover:from-amber-900 hover:to-amber-950 text-amber-100 border-3 border-amber-600/70 hover:border-amber-400 shadow-touch active:translate-y-1 cursor-pointer transition-all"
              >
                <span className="text-2xl font-black font-display">{item.namaLatin}</span>
                <span dir="rtl" className="font-quran text-2xl text-amber-200 mt-1">
                  {item.namaArab}
                </span>
                <span className="text-xs text-stone-400 mt-1 truncate max-w-[120px]">
                  {item.arti}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
