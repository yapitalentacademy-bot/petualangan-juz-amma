import React, { useState, useEffect, useRef } from 'react';
import { MiniGameProps, SusunAyatQuestion } from '../../types/game';
import { generateSusunAyatQuestions, checkSusunAyatAnswer, calculateStars } from '../../lib/gameLogic';
import { quranAudio, sfx } from '../../lib/audioPlayer';
import { Volume2, Sparkles, CheckCircle2, ArrowRight, HelpCircle, Undo2 } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';

export const SusunAyatGame: React.FC<MiniGameProps> = ({
  surahId,
  level,
  onFinish,
  onExit,
  showLatin = true,
  showTerjemah = true,
}) => {
  const [questions, setQuestions] = useState<SusunAyatQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: string; teks: string; urutanBenar: number }[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isFirstTry, setIsFirstTry] = useState(true);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Load questions
  useEffect(() => {
    const generated = generateSusunAyatQuestions(surahId, level);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  }, [surahId, level]);

  const currentQ = questions[currentIndex];

  // Setup current question slots and shuffled word bank
  useEffect(() => {
    if (currentQ) {
      const numSlots = currentQ.potonganKata.length;
      setSlots(new Array(numSlots).fill(null));
      // Shuffle word bank
      const shuffled = [...currentQ.potonganKata].sort(() => 0.5 - Math.random());
      setAvailableWords(shuffled);
      setIsAnswerCorrect(false);
      setIsFirstTry(true);
      setShowHint(false);

      // Play ayat audio at start as a friendly helper
      const timer = setTimeout(() => {
        quranAudio.playAyat(currentQ.surahId, currentQ.nomorAyat);
      }, 300);

      return () => {
        clearTimeout(timer);
        quranAudio.stop();
      };
    }
  }, [currentIndex, currentQ?.id]);

  const isAdvancing = useRef(false);

  // Put a word from word bank into the first empty slot (from right to left)
  const handleSelectWord = (wordObj: { id: string; teks: string; urutanBenar: number }) => {
    if (isAnswerCorrect || isAdvancing.current) return;
    sfx.playClick();

    // Find first empty slot (index 0 is rightmost in RTL logical layout)
    const firstEmptyIndex = slots.findIndex((slot) => slot === null);
    if (firstEmptyIndex === -1) return;

    const newSlots = [...slots];
    newSlots[firstEmptyIndex] = wordObj.id;
    setSlots(newSlots);

    // Remove from available bank
    setAvailableWords((prev) => prev.filter((w) => w.id !== wordObj.id));

    // Check if slots are now full
    const check = checkSusunAyatAnswer(newSlots, currentQ.potonganKata);
    if (check.isComplete) {
      if (check.isCorrect) {
        // Complete and Correct!
        sfx.playCorrect();
        setIsAnswerCorrect(true);
        const scoreDelta = isFirstTry ? 15 : 10;
        setScore((prev) => prev + scoreDelta);
        if (isFirstTry) {
          setCorrectCount((prev) => prev + 1);
        }

        // Play full verse audio on correct
        quranAudio.playAyat(currentQ.surahId, currentQ.nomorAyat);

        // Auto advance after 2.5s
        isAdvancing.current = true;
        setTimeout(() => {
          isAdvancing.current = false;
          handleNextQuestion();
        }, 2500);
      } else {
        // Full but Incorrect -> Kurangi poin dan lanjut soal berikutnya
        sfx.playWrong();
        setWrongCount((prev) => prev + 1);
        setScore((prev) => Math.max(0, prev - 5));

        isAdvancing.current = true;
        setTimeout(() => {
          isAdvancing.current = false;
          handleNextQuestion();
        }, 1500);
      }
    }
  };

  // Remove word from slot back to word bank
  const handleRemoveFromSlot = (slotIndex: number) => {
    if (isAnswerCorrect || isAdvancing.current) return;
    const wordId = slots[slotIndex];
    if (!wordId) return;

    sfx.playClick();
    const wordObj = currentQ.potonganKata.find((w) => w.id === wordId);
    if (!wordObj) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setAvailableWords((prev) => [...prev, wordObj]);
  };

  const handleResetSlots = () => {
    if (isAnswerCorrect || !currentQ) return;
    sfx.playClick();
    setSlots(new Array(currentQ.potonganKata.length).fill(null));
    const shuffled = [...currentQ.potonganKata].sort(() => 0.5 - Math.random());
    setAvailableWords(shuffled);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
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

  const handlePlayAyatAudio = () => {
    if (currentQ) {
      sfx.playClick();
      quranAudio.playAyat(currentQ.surahId, currentQ.nomorAyat);
    }
  };

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-3xl text-center">
        <p className="text-2xl text-stone-300 mb-6">Mempersiapkan soal Susun Ayat...</p>
        {onExit && (
          <TombolBesar variant="ghost" onClick={onExit}>
            Kembali
          </TombolBesar>
        )}
      </div>
    );
  }

  const shouldDisplayLatin = level === 4 ? showLatin : showHint;
  const shouldDisplayTerjemah = level <= 5 ? showTerjemah : showHint;

  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full gap-8">
      {/* Game Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border-2 border-amber-500/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-md">
            {currentIndex + 1}
          </div>
          <div>
            <span className="text-stone-400 font-bold text-sm block">Susun Ayat (Arah Kanan ke Kiri)</span>
            <span className="text-2xl font-black text-amber-200">
              Ayat {currentQ.nomorAyat} ({currentIndex + 1} dari {questions.length})
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

      {/* Action helpers: Dengar Audio & Reset */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAyatAudio}
            className="touch-btn flex items-center gap-3 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-2xl text-xl font-extrabold shadow-md cursor-pointer border border-emerald-500/60"
          >
            <Volume2 className="w-7 h-7" />
            <span>Dengar Bunyi Ayat</span>
          </button>

          <button
            onClick={handleResetSlots}
            className="touch-btn flex items-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-2xl text-lg font-bold border border-stone-700 cursor-pointer"
          >
            <Undo2 className="w-6 h-6 text-amber-400" />
            <span>Kosongkan Slot</span>
          </button>
        </div>

        {level === 6 && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="touch-btn flex items-center gap-2 px-5 py-3 bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-300 rounded-2xl font-bold text-lg cursor-pointer"
          >
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <span>{showHint ? 'Tutup Bantuan' : 'Lihat Bantuan'}</span>
          </button>
        )}
      </div>

      {/* Target RTL Slots Container (From Right to Left) */}
      <div
        className={`
          glass-panel p-8 md:p-12 rounded-3xl border-4 transition-all duration-150
          ${
            isAnswerCorrect
              ? 'border-emerald-400 bg-emerald-950/80 shadow-card-glow ring-4 ring-emerald-400/80'
              : 'border-amber-600/50 bg-stone-900/90 shadow-xl'
          }
        `}
      >
        <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-3">
          <span className="text-xl font-bold text-amber-300">
            Slot Susunan Ayat (Kanan ke Kiri ➔):
          </span>
          {isAnswerCorrect && (
            <div className="flex items-center gap-2 text-emerald-300 font-black text-2xl animate-bounce">
              <CheckCircle2 className="w-8 h-8 fill-emerald-400 text-slate-950" />
              <span>Susunan Ayat Sempurna! (+{isFirstTry ? '15' : '10'})</span>
            </div>
          )}
        </div>

        {/* RTL Slots Array */}
        <div
          dir="rtl"
          className="flex flex-wrap flex-row justify-start items-center gap-4 min-h-[120px] py-4"
        >
          {slots.map((wordId, slotIdx) => {
            const wordObj = wordId ? currentQ.potonganKata.find((w) => w.id === wordId) : null;
            const isFilled = wordObj !== null && wordObj !== undefined;

            return (
              <div
                key={slotIdx}
                onClick={() => handleRemoveFromSlot(slotIdx)}
                className={`
                  touch-btn min-w-[130px] md:min-w-[160px] min-h-[90px] px-6 py-4 rounded-2xl border-3 flex items-center justify-center
                  text-center select-none cursor-pointer transition-all duration-100 font-quran text-3xl md:text-4xl
                  ${
                    isFilled
                      ? isAnswerCorrect
                        ? 'bg-emerald-600/90 text-white border-emerald-300 shadow-md ring-2 ring-emerald-300'
                        : 'bg-amber-950 text-amber-100 border-amber-500 shadow-lg hover:border-amber-300'
                      : 'bg-stone-950/80 border-dashed border-stone-700 text-stone-600'
                  }
                `}
              >
                {isFilled ? (
                  wordObj.teks
                ) : (
                  <span className="text-xl font-sans font-bold text-stone-700">
                    Slot {slotIdx + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Transliteration & Translation Aid */}
        {(shouldDisplayLatin || shouldDisplayTerjemah) && (
          <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-col gap-2">
            {shouldDisplayLatin && (
              <p className="text-tv-latin font-bold text-emerald-300 italic">
                {currentQ.latin}
              </p>
            )}
            {shouldDisplayTerjemah && (
              <p className="text-tv-sub text-stone-300">
                "{currentQ.terjemah}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Word Bank Container (Potongan Kata Acak) */}
      <div className="glass-panel p-8 rounded-3xl border-2 border-stone-700">
        <h4 className="text-2xl font-black text-amber-300 font-display mb-4">
          Pilih Potongan Kata Di Bawah Ini:
        </h4>

        {availableWords.length === 0 && !isAnswerCorrect && (
          <p className="text-xl text-stone-400 font-medium py-4 text-center">
            Semua kata telah dimasukkan ke slot. Jika susunan belum benar, sentuh kata di slot untuk mengeluarkannya.
          </p>
        )}

        <div
          dir="rtl"
          className="flex flex-wrap flex-row justify-center items-center gap-5 min-h-[100px]"
        >
          {availableWords.map((wordItem) => (
            <button
              key={wordItem.id}
              onClick={() => handleSelectWord(wordItem)}
              className="touch-btn font-quran text-3xl md:text-5xl px-8 py-5 rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 hover:from-amber-900/90 hover:to-amber-950 text-amber-100 border-2 border-amber-400/80 border-b-[8px] border-b-amber-950 shadow-btn-gold active:border-b-[2px] active:translate-y-1.5 cursor-pointer transition-all duration-75"
            >
              {wordItem.teks}
            </button>
          ))}
        </div>
      </div>

      {/* Advance Button */}
      {isAnswerCorrect && (
        <div className="flex justify-end mt-2">
          <TombolBesar
            variant="oasis"
            size="normal"
            icon={<ArrowRight className="w-7 h-7" />}
            onClick={handleNextQuestion}
          >
            Lanjut Ayat Berikutnya
          </TombolBesar>
        </div>
      )}
    </div>
  );
};
