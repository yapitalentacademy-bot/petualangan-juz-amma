import React, { useState, useEffect, useRef } from 'react';
import { MiniGameProps, TebakSurahQuestion } from '../../types/game';
import { generateTebakSurahQuestions, calculateStars } from '../../lib/gameLogic';
import { quranAudio, sfx } from '../../lib/audioPlayer';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';

export const TebakSurahGame: React.FC<MiniGameProps> = ({
  surahId,
  level,
  onFinish,
  onExit,
}) => {
  const [questions, setQuestions] = useState<TebakSurahQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    const generated = generateTebakSurahQuestions(surahId, level);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  }, [surahId, level]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentQ) {
      setSelectedChoiceIdx(null);
      setAnsweredState('idle');

      // If opening verse audio is present, play it
      if (currentQ.audioAyat) {
        const timer = setTimeout(() => {
          quranAudio.playAyat(currentQ.audioAyat!.surahId, currentQ.audioAyat!.ayatNomor);
        }, 300);
        return () => {
          clearTimeout(timer);
          quranAudio.stop();
        };
      }
    }
  }, [currentIndex, currentQ?.id]);

  const isTransitioning = useRef(false);

  const handleSelectChoice = (index: number) => {
    if (answeredState === 'correct' || isTransitioning.current) return;
    setSelectedChoiceIdx(index);
    const chosen = currentQ.pilihan[index];

    if (chosen.isCorrect) {
      sfx.playCorrect();
      setAnsweredState('correct');
      const scoreDelta = 15;
      setScore((prev) => prev + scoreDelta);
      setCorrectCount((prev) => prev + 1);

      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
        handleNextQuestion();
      }, 1800);
    } else {
      sfx.playWrong();
      setAnsweredState('wrong');
      setWrongCount((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 5));

      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
        handleNextQuestion();
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    setSelectedChoiceIdx(null);
    setAnsweredState('idle');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const totalSoal = questions.length;
    const maxSkor = totalSoal * 15;
    const akurasi = totalSoal > 0 ? Math.round((correctCount / totalSoal) * 100) : 100;
    const stars = calculateStars(akurasi);

    onFinish({
      skor: score,
      maxSkor,
      benar: correctCount,
      salah: wrongCount,
      totalSoal,
      stars,
      akurasi,
    });
  };

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-3xl text-center">
        <p className="text-2xl text-stone-300 mb-6">Mempersiapkan soal Tebak Surah...</p>
        {onExit && (
          <TombolBesar variant="ghost" onClick={onExit}>
            Kembali
          </TombolBesar>
        )}
      </div>
    );
  }

  const variantLabels = {
    arti: 'Tebak dari Arti Nama',
    jumlah_ayat: 'Tebak dari Jumlah Ayat',
    ayat_pertama: 'Tebak dari Ayat Pembuka',
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full gap-8">
      {/* Top Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border-2 border-amber-500/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-md">
            {currentIndex + 1}
          </div>
          <div>
            <span className="text-stone-400 font-bold text-sm block">Tebak Nama Surah</span>
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

      {/* Clue Prompt Card */}
      <div className="bg-stone-900/95 p-8 md:p-12 rounded-3xl border-3 border-amber-500/80 shadow-2xl text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-bold text-lg mb-6 shadow-sm">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>{variantLabels[currentQ.varian]}</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-extrabold text-amber-100 leading-relaxed mb-4 drop-shadow">
          {currentQ.petunjuk}
        </h3>

        {/* Optional Arabic Text for First Verse variant */}
        {currentQ.petunjukArab && (
          <div
            dir="rtl"
            className="font-quran text-amber-200 text-4xl md:text-5xl my-6 leading-loose"
          >
            {currentQ.petunjukArab}
          </div>
        )}

        {currentQ.audioAyat && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                sfx.playClick();
                quranAudio.playAyat(currentQ.audioAyat!.surahId, currentQ.audioAyat!.ayatNomor);
              }}
              className="touch-btn flex items-center gap-3 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl text-xl font-bold shadow-md cursor-pointer"
            >
              <Volume2 className="w-7 h-7" />
              <span>Putar Ulang Audio Ayat</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Choices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentQ.pilihan.map((choice, idx) => {
          const isSelected = selectedChoiceIdx === idx;
          const isCorrect = choice.isCorrect;

          let cardStyle = 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:bg-slate-800 shadow-lg';
          if (isSelected && answeredState === 'correct') {
            cardStyle = 'bg-gradient-to-r from-emerald-950/95 to-emerald-900/95 border-emerald-400 ring-4 ring-emerald-400/80 shadow-card-glow';
          } else if (isSelected && answeredState === 'wrong') {
            cardStyle = 'bg-gradient-to-r from-rose-950/95 to-rose-900/95 border-rose-500 ring-4 ring-rose-500/80 animate-shake';
          } else if (answeredState === 'wrong' && isCorrect) {
            cardStyle = 'bg-emerald-950/60 border-emerald-500/80 border-dashed';
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelectChoice(idx)}
              className={`
                touch-btn relative flex items-center justify-between p-8 rounded-3xl border-4 min-h-[140px]
                transition-all duration-100 cursor-pointer select-none
                ${cardStyle}
              `}
            >
              <div className="flex items-center gap-5">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-3xl font-display flex items-center justify-center shadow-md border-2 border-amber-200">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-2xl md:text-3xl font-black text-amber-100 font-display">
                    "{choice.arti}"
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span dir="rtl" className="font-quran text-4xl text-amber-200 font-bold drop-shadow">
                  {choice.namaArab}
                </span>

                {isSelected && answeredState === 'correct' && (
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                )}
                {isSelected && answeredState === 'wrong' && (
                  <XCircle className="w-10 h-10 text-rose-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

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
