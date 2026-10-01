import React, { useState, useEffect, useRef } from 'react';
import { MiniGameProps, SambungAyatQuestion } from '../../types/game';
import { generateSambungAyatQuestions, calculateStars } from '../../lib/gameLogic';
import { quranAudio, sfx } from '../../lib/audioPlayer';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, HelpCircle, RotateCcw } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';

export const SambungAyatGame: React.FC<MiniGameProps> = ({
  surahId,
  level,
  onFinish,
  onExit,
  showLatin = true,
  showTerjemah = true,
}) => {
  const [questions, setQuestions] = useState<SambungAyatQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isFirstTry, setIsFirstTry] = useState(true);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Helper to clean quotes
  const cleanQuotes = (text: string) => text.replace(/^["'\s]+|["'\s]+$/g, '');

  // Load questions on mount or surah change
  useEffect(() => {
    const generated = generateSambungAyatQuestions(surahId, level);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setAnsweredState('idle');
    setIsFirstTry(true);
    setSelectedChoiceIdx(null);
  }, [surahId, level]);

  const currentQ = questions[currentIndex];

  // Auto-play prompt audio when moving to a new question
  useEffect(() => {
    if (currentQ) {
      setSelectedChoiceIdx(null);
      setAnsweredState('idle');
      setIsFirstTry(true);
      setShowHint(false);

      // Play prompt ayat audio with slight delay for smooth transition
      const timer = setTimeout(() => {
        quranAudio.playAyat(currentQ.promptAyat.surahId, currentQ.promptAyat.nomor);
      }, 300);

      return () => {
        clearTimeout(timer);
        quranAudio.stop();
      };
    }
  }, [currentIndex, currentQ?.id]);

  const isTransitioning = useRef(false);

  const handleSelectChoice = (index: number) => {
    if (answeredState === 'correct' || isTransitioning.current) return;
    setSelectedChoiceIdx(index);
    const chosen = currentQ.pilihanAyat[index];

    if (chosen.isCorrect) {
      // Benar
      sfx.playCorrect();
      setAnsweredState('correct');
      const scoreDelta = isFirstTry ? 15 : 10;
      setScore((prev) => prev + scoreDelta);
      if (isFirstTry) {
        setCorrectCount((prev) => prev + 1);
      }

      // Putar audio ayat jawaban yang benar
      quranAudio.playAyat(chosen.surahId, chosen.nomor);

      // Auto advance after 2.5s
      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
        handleNextQuestion();
      }, 2500);
    } else {
      // Salah
      sfx.playWrong();
      setAnsweredState('wrong');
      if (isFirstTry) {
        setWrongCount((prev) => prev + 1);
        setIsFirstTry(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Selesai seluruh soal
      finishGame();
    }
  };

  const finishGame = () => {
    const totalSoal = questions.length;
    const maxSkor = totalSoal * 15;
    const finalScore = score;
    const akurasi = totalSoal > 0 ? Math.round((correctCount / totalSoal) * 100) : 100;
    const stars = calculateStars(akurasi);

    onFinish({
      skor: finalScore,
      maxSkor,
      benar: correctCount,
      salah: wrongCount,
      totalSoal,
      stars,
      akurasi,
    });
  };

  const handleReplayPrompt = () => {
    if (currentQ) {
      sfx.playClick();
      quranAudio.playAyat(currentQ.promptAyat.surahId, currentQ.promptAyat.nomor);
    }
  };

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-3xl text-center">
        <p className="text-2xl text-stone-300 mb-6">Mempersiapkan soal Sambung Ayat...</p>
        {onExit && (
          <TombolBesar variant="ghost" onClick={onExit}>
            Kembali
          </TombolBesar>
        )}
      </div>
    );
  }

  // Level display settings
  const shouldDisplayLatin = level === 4 ? showLatin : showHint;
  const shouldDisplayTerjemah = level <= 5 ? showTerjemah : showHint;

  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full gap-8">
      {/* Game Header: Progress, Score & Question indicator */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border-2 border-amber-500/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-md">
            {currentIndex + 1}
          </div>
          <div>
            <span className="text-stone-400 font-bold text-sm block">Sambung Ayat (Surah {currentQ.promptAyat.surahLatin})</span>
            <span className="text-2xl font-black text-amber-200">
              Soal {currentIndex + 1} dari {questions.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-stone-900/90 px-6 py-3 rounded-2xl border border-stone-700 shadow-inner">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-stone-400 font-bold text-lg">Skor:</span>
            <span className="text-3xl font-black text-yellow-300">{score}</span>
          </div>

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

      {/* Prompt Card: Ayat ke-n */}
      <div className="glass-panel p-8 md:p-10 rounded-3xl border-3 border-emerald-500/60 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold text-lg px-4 py-1.5 rounded-xl">
              Dengarkan & Sambung Ayat Ini:
            </span>
            <span className="text-xl font-bold text-amber-300">
              Ayat ke-{currentQ.promptAyat.nomor}
            </span>
          </div>

          <button
            onClick={handleReplayPrompt}
            className="touch-btn flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-lg font-bold shadow-md cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Putar Ulang</span>
          </button>
        </div>

        {/* Big Arabic Text (Prompt) */}
        <div
          dir="rtl"
          className="font-quran text-amber-100 text-tv-arabic text-center leading-relaxed py-4 drop-shadow"
        >
          {currentQ.promptAyat.arab}
        </div>

        {/* Latin & Translation */}
        {(shouldDisplayLatin || shouldDisplayTerjemah) && (
          <div className="mt-4 pt-4 border-t border-stone-800/80 flex flex-col gap-2 text-center">
            {shouldDisplayLatin && (
              <p className="text-tv-latin font-bold text-emerald-300 italic">
                {currentQ.promptAyat.latin}
              </p>
            )}
            {shouldDisplayTerjemah && (
              <p className="text-tv-sub text-stone-300">
                "{cleanQuotes(currentQ.promptAyat.terjemah)}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Instruction & Helper */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl md:text-3xl font-black text-amber-300 font-display flex items-center gap-3">
          <ArrowRight className="w-8 h-8 text-amber-400" />
          Pilih Lanjutan Ayat Berikutnya (Ayat ke-{currentQ.jawabanBenar.nomor}):
        </h3>

        {level === 6 && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="touch-btn flex items-center gap-2 px-5 py-2.5 bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-300 rounded-xl font-bold text-lg cursor-pointer"
          >
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <span>{showHint ? 'Sembunyikan Bantuan' : 'Buka Bantuan Teks'}</span>
          </button>
        )}
      </div>

      {/* Choice Cards Grid */}
      <div
        className={`grid gap-6 ${
          currentQ.pilihanAyat.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {currentQ.pilihanAyat.map((choice, idx) => {
          const isSelected = selectedChoiceIdx === idx;
          const isCorrect = choice.isCorrect;

          let cardStyle = 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:bg-slate-800 shadow-xl';
          if (isSelected && answeredState === 'correct') {
            cardStyle = 'bg-gradient-to-r from-emerald-950/95 to-emerald-900/95 border-emerald-400 ring-4 ring-emerald-400/80 shadow-card-glow';
          } else if (isSelected && answeredState === 'wrong') {
            cardStyle = 'bg-gradient-to-r from-rose-950/95 to-rose-900/95 border-rose-500 ring-4 ring-rose-500/80 animate-shake';
          } else if (answeredState === 'wrong' && isCorrect) {
            // Tunjukkan jawaban benar ketika salah
            cardStyle = 'bg-emerald-950/60 border-emerald-500/80 border-dashed';
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelectChoice(idx)}
              className={`
                touch-btn relative flex flex-col justify-between p-6 md:p-8 rounded-3xl border-4 min-h-[280px]
                transition-all duration-100 backdrop-blur-md cursor-pointer select-none
                ${cardStyle}
              `}
            >
              {/* Top Choice Indicator */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-2xl font-display flex items-center justify-center shadow-md border border-amber-200">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xl font-black text-amber-200 font-display">
                    Pilihan {String.fromCharCode(65 + idx)}
                  </span>
                </div>

                {isSelected && answeredState === 'correct' && (
                  <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-base animate-bounce">
                    <CheckCircle2 className="w-6 h-6 fill-emerald-400 text-slate-950" />
                    <span>Benar! (+{isFirstTry ? '15' : '10'})</span>
                  </div>
                )}

                {isSelected && answeredState === 'wrong' && (
                  <div className="flex items-center gap-1.5 text-rose-400 font-extrabold text-base">
                    <XCircle className="w-6 h-6" />
                    <span>Coba Lagi</span>
                  </div>
                )}
              </div>

              {/* Arabic Choice Text */}
              <div
                dir="rtl"
                className="font-quran text-amber-100 text-3xl md:text-5xl text-center leading-relaxed py-4 flex-1 flex items-center justify-center"
              >
                {choice.arab}
              </div>

              {/* Latin & Translation */}
              {(shouldDisplayLatin || shouldDisplayTerjemah) && (
                <div className="mt-3 pt-3 border-t border-stone-800/80 flex flex-col gap-1 text-center">
                  {shouldDisplayLatin && (
                    <p className="text-base md:text-lg font-bold text-emerald-300 italic leading-snug">
                      {choice.latin}
                    </p>
                  )}
                  {shouldDisplayTerjemah && (
                    <p className="text-sm md:text-base text-stone-300 leading-relaxed">
                      "{cleanQuotes(choice.terjemah)}"
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Skip/Next Button if needed */}
      {answeredState === 'correct' && (
        <div className="flex justify-end mt-2">
          <TombolBesar
            variant="oasis"
            size="normal"
            icon={<ArrowRight className="w-7 h-7" />}
            onClick={handleNextQuestion}
          >
            Lanjut Soal Berikutnya
          </TombolBesar>
        </div>
      )}
    </div>
  );
};
