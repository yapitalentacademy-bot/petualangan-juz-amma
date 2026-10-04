import React, { useState, useEffect } from 'react';
import { SurahDetail, KelasLevel } from '../../types/surah';
import { GameResult } from '../../types/game';
import { TombolBesar } from '../../components/TombolBesar';
import {
  extractTajwidTargets,
  getTajwidRulesForLevel,
  TajwidTarget,
} from '../../lib/tajwidLogic';
import sampleSurahsData from '../../data/sample-surahs.json';
import {
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  Volume2,
  Info,
  X,
  BookOpen,
} from 'lucide-react';
import { sfx, quranAudio } from '../../lib/audioPlayer';

interface PemburuTajwidGameProps {
  surahId: number;
  level: KelasLevel;
  onFinish: (result: GameResult) => void;
  onExit: () => void;
}

export const PemburuTajwidGame: React.FC<PemburuTajwidGameProps> = ({
  surahId,
  level,
  onFinish,
  onExit,
}) => {
  const surahsRecord = sampleSurahsData as Record<string, SurahDetail>;
  const surah: SurahDetail | undefined = surahsRecord[String(surahId)];

  const [targets, setTargets] = useState<TajwidTarget[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
    ruleLabel?: string;
  }>({ type: null, message: '' });
  const [showRuleGuide, setShowRuleGuide] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (surah) {
      const extracted = extractTajwidTargets(surah, level);
      // If none found for allowed rules, fallback to all available
      if (extracted.length === 0) {
        const allExtracted = extractTajwidTargets(surah, 6);
        setTargets([...allExtracted].sort(() => 0.5 - Math.random()));
      } else {
        setTargets([...extracted].sort(() => 0.5 - Math.random()));
      }
    }
  }, [surahId, level]);

  const activeTarget: TajwidTarget | undefined = targets[currentRound];
  const availableRules = getTajwidRulesForLevel(level);

  const handleWordClick = (word: string, wordIdx: number) => {
    if (!activeTarget || foundIndices.includes(wordIdx) || isCompleted) return;

    const isCorrect = activeTarget.correctWordIndices.includes(wordIdx);

    if (!isCorrect) {
      // JAWABAN SALAH -> Kurangi skor dan lanjut ke target berikutnya
      sfx.playWrong();
      setStreak(0);
      setWrongIndices((prev) => [...prev, wordIdx]);
      setScore((prev) => Math.max(0, prev - 5));

      const correctIdx = activeTarget.correctWordIndices[0] ?? 0;
      const correctWord = activeTarget.kataAyat[correctIdx] || '';

      setFeedback({
        type: 'wrong',
        message: `Kata "${word}" belum tepat! Jawaban benar: "${correctWord}".`,
        ruleLabel: `Hukum ${activeTarget.label} (${activeTarget.ruleInfo.penjelasan})`,
      });

      // Tampilkan kata kunci yang benar sesaat lalu lanjut ke target berikutnya
      setFoundIndices([correctIdx]);

      setTimeout(() => {
        if (currentRound + 1 < targets.length) {
          setCurrentRound((prev) => prev + 1);
          setFoundIndices([]);
          setWrongIndices([]);
          setFeedback({ type: null, message: '' });
        } else {
          // Selesai seluruh target tajwid
          setIsCompleted(true);
          const finalScore = score;
          let stars: 1 | 2 | 3 = 1;
          if (finalScore >= targets.length * 20) stars = 3;
          else if (finalScore >= targets.length * 10) stars = 2;

          sfx.playStar();
          onFinish({
            skor: finalScore,
            maxSkor: targets.length * 35,
            stars,
            akurasi: Math.min(100, Math.max(20, Math.round((finalScore / (targets.length * 25)) * 100))),
            totalSoal: targets.length,
            benar: Math.max(0, Math.floor(finalScore / 25)),
            salah: targets.length - Math.max(0, Math.floor(finalScore / 25)),
          });
        }
      }, 1600);
      return;
    }

    // JAWABAN BENAR (Kata mengandung hukum tajwid target)
    sfx.playCorrect();
    const newFound = [...foundIndices, wordIdx];
    setFoundIndices(newFound);
    const addPts = 25 + streak * 5;
    setScore((prev) => prev + addPts);
    setStreak((prev) => prev + 1);

    setFeedback({
      type: 'correct',
      message: `Benar Sekali! Kata "${word}" mengandung ${activeTarget.label}!`,
      ruleLabel: activeTarget.ruleInfo.penjelasan,
    });

    // Cek apakah semua target kata di ayat ini sudah ditemukan, lalu maju ke ronde berikutnya
    setTimeout(() => {
      if (currentRound + 1 < targets.length) {
        setCurrentRound((prev) => prev + 1);
        setFoundIndices([]);
        setWrongIndices([]);
        setFeedback({ type: null, message: '' });
      } else {
        // Selesai seluruh target tajwid
        setIsCompleted(true);
        const finalScore = score + addPts;
        let stars: 1 | 2 | 3 = 1;
        if (finalScore >= targets.length * 20) stars = 3;
        else if (finalScore >= targets.length * 10) stars = 2;

        sfx.playStar();
        onFinish({
          skor: finalScore,
          maxSkor: targets.length * 35,
          stars,
          akurasi: Math.min(100, Math.max(50, Math.round((finalScore / (targets.length * 25)) * 100))),
          totalSoal: targets.length,
          benar: targets.length,
          salah: 0,
        });
      }
    }, 1600);
  };

  const handleWrongHint = () => {
    sfx.playWrong();
    setStreak(0);
    setFeedback({
      type: 'wrong',
      message: `Belum tepat. Coba perhatikan petunjuk hukum ${activeTarget?.ruleInfo.nama}!`,
      ruleLabel: activeTarget?.ruleInfo.penjelasan,
    });
  };

  const handlePlayAyatAudio = () => {
    if (surah && activeTarget) {
      quranAudio.playAyat(surah.id, activeTarget.ayatNomor);
    }
  };

  if (!surah || targets.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center max-w-xl mx-auto">
        <h3 className="text-3xl font-bold text-amber-300 mb-4">Pemburu Tajwid</h3>
        <p className="text-stone-300 text-xl mb-6">
          Belum ada data target tajwid pada surah ini untuk Level Kelas {level}.
        </p>
        <TombolBesar variant="oasis" onClick={onExit}>
          Kembali ke Pos
        </TombolBesar>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-emerald-500/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-950/80 border border-emerald-400/50 rounded-2xl text-emerald-300">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white font-display">
              Pemburu Tajwid: Surah {surah.namaLatin}
            </h2>
            <p className="text-emerald-300 text-lg font-bold">
              Target {currentRound + 1} dari {targets.length} • Kelas {level}
            </p>
          </div>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 rounded-2xl bg-amber-950/90 border border-amber-500 text-center">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
              Skor Tajwid
            </span>
            <span className="text-3xl font-black text-amber-400">{score}</span>
          </div>

          <button
            onClick={() => setShowRuleGuide(true)}
            className="touch-btn px-4 py-3 bg-stone-900 border border-stone-600 hover:border-amber-400 rounded-2xl text-amber-300 flex items-center gap-2 font-bold cursor-pointer transition-all"
          >
            <BookOpen className="w-6 h-6" />
            Panduan Tajwid
          </button>
        </div>
      </div>

      {/* Target Mission Card */}
      {activeTarget && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-emerald-950/40 to-stone-900 border-2 border-emerald-400/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`px-5 py-3 rounded-2xl font-black text-2xl border-2 shadow-lg ${activeTarget.ruleInfo.warna}`}
            >
              {activeTarget.label || activeTarget.ruleInfo.nama}
            </div>
            <div>
              <span className="text-stone-300 text-lg font-medium block">
                Misi Pemburu: Temukan & Sentuh kata yang mengandung bacaan{' '}
                <strong className="text-emerald-300">{activeTarget.ruleInfo.nama}</strong>!
              </span>
              <span className="text-stone-400 text-sm">
                Ciri: {activeTarget.ruleInfo.penjelasan}
              </span>
            </div>
          </div>

          <button
            onClick={handlePlayAyatAudio}
            className="touch-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700/80 border border-emerald-400 text-white font-bold cursor-pointer hover:bg-emerald-600 transition-all"
          >
            <Volume2 className="w-6 h-6" />
            Dengarkan Ayat
          </button>
        </div>
      )}

      {/* Main Quran Verse Board */}
      {activeTarget && (
        <div className="glass-panel p-8 md:p-12 rounded-3xl border-3 border-amber-500/50 shadow-2xl flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
          {/* Ayat Number Badge */}
          <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/50 text-amber-300 font-bold text-lg">
            Ayat ke-{activeTarget.ayatNomor}
          </div>

          {/* Large Arabic Words Container */}
          <div
            dir="rtl"
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 my-8 max-w-5xl"
          >
            {activeTarget.kataAyat.map((kata, idx) => {
              const isFound = foundIndices.includes(idx);
              const isWrong = wrongIndices.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleWordClick(kata, idx)}
                  className={`
                    touch-btn group relative px-6 py-4 md:px-8 md:py-6 rounded-3xl border-3 font-quran text-5xl md:text-6xl font-bold cursor-pointer transition-all duration-300
                    ${
                      isFound
                        ? 'bg-emerald-600 border-emerald-300 text-white shadow-card-glow scale-105 animate-pulse'
                        : isWrong
                        ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-shake shadow-lg'
                        : 'bg-stone-900/90 border-stone-700 text-amber-100 hover:border-amber-400 hover:bg-stone-800 active:scale-95'
                    }
                  `}
                >
                  <span>{kata}</span>
                  {isFound && (
                    <span className="absolute -top-3 -right-3 p-1.5 rounded-full bg-emerald-400 text-black shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </span>
                  )}
                  {isWrong && (
                    <span className="absolute -top-3 -right-3 p-1.5 rounded-full bg-rose-500 text-white shadow-md">
                      <X className="w-5 h-5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Toast */}
          {feedback.type && (
            <div
              className={`
                mt-4 p-4 md:p-6 rounded-2xl border-2 flex items-center gap-4 max-w-2xl w-full animate-bounce
                ${
                  feedback.type === 'correct'
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/90 border-rose-400 text-rose-200'
                }
              `}
            >
              {feedback.type === 'correct' ? (
                <Sparkles className="w-8 h-8 text-yellow-300 shrink-0" />
              ) : (
                <Info className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <p className="text-2xl font-black">{feedback.message}</p>
                {feedback.ruleLabel && (
                  <p className="text-lg opacity-90">{feedback.ruleLabel}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between">
        <TombolBesar variant="desert" size="normal" onClick={onExit}>
          Keluar ke Pos
        </TombolBesar>

        <button
          onClick={handleWrongHint}
          className="touch-btn px-6 py-4 rounded-2xl bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-300 font-bold text-lg flex items-center gap-2 cursor-pointer"
        >
          <HelpCircle className="w-6 h-6 text-amber-400" />
          Bantuan Petunjuk
        </button>
      </div>

      {/* Guide Modal: Panduan Tajwid */}
      {showRuleGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-4xl w-full border-3 border-emerald-400 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div className="flex items-center gap-3 text-emerald-300">
                <BookOpen className="w-8 h-8" />
                <h3 className="text-3xl font-black font-display">
                  Panduan Hukum Tajwid (Level Kelas {level})
                </h3>
              </div>
              <button
                onClick={() => setShowRuleGuide(false)}
                className="p-3 bg-stone-800 hover:bg-stone-700 rounded-2xl text-stone-300 cursor-pointer"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {availableRules.map((rule) => (
                <div
                  key={rule.hukum}
                  className={`p-6 rounded-2xl border-2 flex flex-col justify-between ${rule.warna}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-2xl font-black text-white">{rule.nama}</h4>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${rule.badgeColor}`}>
                        Kelas {rule.tingkatKelas.join(', ')}
                      </span>
                    </div>
                    <p className="text-stone-200 text-lg mb-4">{rule.penjelasan}</p>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <span className="text-xs text-stone-300 uppercase tracking-wider block mb-1">
                      Huruf / Ciri:
                    </span>
                    <span className="text-xl font-bold font-quran text-amber-200">
                      {rule.contohHuruf}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <TombolBesar variant="oasis" size="normal" onClick={() => setShowRuleGuide(false)}>
              Tutup Panduan & Lanjutkan
            </TombolBesar>
          </div>
        </div>
      )}
    </div>
  );
};
