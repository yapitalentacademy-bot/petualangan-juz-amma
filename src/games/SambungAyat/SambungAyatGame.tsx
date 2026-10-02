import React, { useState, useEffect, useRef } from 'react';
import { MiniGameProps, SambungAyatQuestion } from '../../types/game';
import { generateSambungAyatQuestions, calculateStars } from '../../lib/gameLogic';
import { quranAudio, sfx } from '../../lib/audioPlayer';
import { Check, RotateCcw, ArrowRight, HelpCircle, ArrowLeft } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';
import { JalurProgres } from '../../components/JalurProgres';
import { GelembungNur } from '../../components/GelembungNur';
import { BintangDelapan } from '../../components/ornaments/BintangDelapan';

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
  const [nurMessage, setNurMessage] = useState('Dengarkan lantunan ayat, lalu pilih ayat sambungannya ya!');

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
    setNurMessage('Dengarkan lantunan ayat, lalu pilih sambungan berikutnya!');
  }, [surahId, level]);

  const currentQ = questions[currentIndex];

  // Auto-play prompt audio when moving to a new question
  useEffect(() => {
    if (currentQ) {
      setSelectedChoiceIdx(null);
      setAnsweredState('idle');
      setIsFirstTry(true);
      setShowHint(false);
      setNurMessage(`Mari dengarkan ayat ke-${currentQ.promptAyat.nomor}, lalu pilih sambungannya!`);

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
      setNurMessage('Masya Allah, jawabanmu tepat sekali!');
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
      // Salah / Perlu Diulang
      sfx.playWrong();
      setAnsweredState('wrong');
      setNurMessage('Ayo kita coba periksa kembali ayat berikutnya.');
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
      <div className="flex flex-col items-center justify-center p-12 bg-[var(--gading)] rounded-[32px] border-2 border-[var(--emas)] text-center shadow-lg">
        <p className="text-2xl text-[var(--malam)] font-['Baloo_2'] mb-6 font-bold">Mempersiapkan soal Sambung Ayat...</p>
        {onExit && (
          <TombolBesar variant="zamrud" onClick={onExit}>
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
    <div className="flex flex-col max-w-5xl mx-auto w-full gap-6 font-['Nunito']">
      {/* Game Bilah Atas: Kembali, Nama Surah, JalurProgres, Skor */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-5 rounded-[28px] bg-[var(--gading)] border-2 border-[var(--emas)]/60 shadow-md">
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              onClick={onExit}
              className="p-2.5 rounded-full bg-[var(--pasir-terang)] border border-[var(--pasir)] text-[var(--malam)] hover:border-[var(--zamrud)] cursor-pointer transition-all"
              title="Kembali ke Peta"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <span className="text-xs text-[var(--zamrud-tua)] font-bold block uppercase tracking-wider">
              Sambung Ayat • Surah {currentQ.promptAyat.surahLatin}
            </span>
            <span className="text-xl font-black text-[var(--malam)] font-['Baloo_2']">
              Soal {currentIndex + 1} dari {questions.length}
            </span>
          </div>
        </div>

        {/* JalurProgres Jalan Setapak */}
        <div className="flex-1 max-w-xs mx-auto">
          <JalurProgres currentStep={currentIndex + 1} totalSteps={questions.length} />
        </div>

        <div className="flex items-center gap-2 bg-[var(--pasir-terang)] px-5 py-2 rounded-full border border-[var(--emas)]/60 shadow-inner">
          <BintangDelapan size={20} fill="#D4A23A" />
          <span className="text-sm font-bold text-[var(--malam)]">Skor:</span>
          <span className="text-2xl font-black text-[var(--zamrud-tua)] font-['Baloo_2']">{score}</span>
        </div>
      </div>

      {/* Prompt Card: Ayat ke-n */}
      <div className="bg-[var(--gading)] p-6 md:p-8 rounded-[32px] border-2 border-[var(--emas)] shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--pasir)] pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[var(--zamrud)] text-[var(--gading)] font-bold text-sm px-3.5 py-1 rounded-full">
              Dengarkan Ayat Ini:
            </span>
            <span className="text-base font-black text-[var(--zamrud-tua)]">
              Ayat ke-{currentQ.promptAyat.nomor}
            </span>
          </div>

          <button
            onClick={handleReplayPrompt}
            className="flex items-center gap-2 px-4 py-1.5 bg-[var(--emas)] hover:bg-[var(--emas)]/80 text-[var(--malam)] rounded-full text-sm font-black shadow-sm cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Putar Ulang</span>
          </button>
        </div>

        {/* Big Arabic Text (Prompt) */}
        <div
          dir="rtl"
          className="font-['Amiri'] text-[var(--zamrud-tua)] text-4xl md:text-5xl text-center leading-[2.2] py-2"
        >
          {currentQ.promptAyat.arab}
        </div>

        {/* Latin & Translation */}
        {(shouldDisplayLatin || shouldDisplayTerjemah) && (
          <div className="mt-3 pt-3 border-t-2 border-[var(--pasir)] flex flex-col gap-1 text-center">
            {shouldDisplayLatin && (
              <p className="text-base font-bold text-[var(--terakota)] italic">
                {currentQ.promptAyat.latin}
              </p>
            )}
            {shouldDisplayTerjemah && (
              <p className="text-sm text-[var(--malam)]/80 font-semibold">
                "{cleanQuotes(currentQ.promptAyat.terjemah)}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Instruction & Helper */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl md:text-2xl font-black text-[var(--zamrud-tua)] font-['Baloo_2'] flex items-center gap-2">
          <ArrowRight className="w-6 h-6 text-[var(--emas)]" />
          <span>Pilih Lanjutan Ayat Berikutnya (Ayat ke-{currentQ.jawabanBenar.nomor}):</span>
        </h3>

        {level === 6 && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-4 py-1.5 bg-[var(--gading)] border border-[var(--pasir)] hover:border-[var(--emas)] text-[var(--malam)] rounded-full font-bold text-sm cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-[var(--emas)]" />
            <span>{showHint ? 'Sembunyikan Bantuan' : 'Buka Bantuan Teks'}</span>
          </button>
        )}
      </div>

      {/* Choice Cards Grid */}
      <div
        className={`grid gap-5 ${
          currentQ.pilihanAyat.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {currentQ.pilihanAyat.map((choice, idx) => {
          const isSelected = selectedChoiceIdx === idx;
          const isCorrect = choice.isCorrect;

          let cardBorder = 'border-[var(--emas)]/40 hover:border-[var(--zamrud)] bg-[var(--gading)]';
          if (isSelected && answeredState === 'correct') {
            cardBorder = 'border-[var(--zamrud)] ring-4 ring-[var(--zamrud)]/30 bg-[var(--pasir-terang)]';
          } else if (isSelected && answeredState === 'wrong') {
            cardBorder = 'border-[var(--terakota)] ring-4 ring-[var(--terakota)]/30 bg-[var(--terakota)]/10';
          } else if (answeredState === 'wrong' && isCorrect) {
            cardBorder = 'border-[var(--zamrud)]/60 border-dashed bg-[var(--pasir-terang)]';
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelectChoice(idx)}
              className={`
                relative flex flex-col justify-between p-5 md:p-6 rounded-[28px] border-2 min-h-[220px]
                transition-all duration-150 cursor-pointer select-none shadow-md
                ${cardBorder}
              `}
            >
              {/* Top Choice Indicator */}
              <div className="flex items-center justify-between mb-2 border-b border-[var(--pasir)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-[var(--pasir)] text-[var(--zamrud-tua)] font-black text-lg font-['Baloo_2'] flex items-center justify-center border border-[var(--emas)]/50">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-base font-black text-[var(--zamrud-tua)] font-['Baloo_2']">
                    Pilihan {String.fromCharCode(65 + idx)}
                  </span>
                </div>

                {isSelected && answeredState === 'correct' && (
                  <div className="flex items-center gap-1.5 text-[var(--zamrud)] font-black text-sm">
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Benar! (+{isFirstTry ? '15' : '10'})</span>
                  </div>
                )}

                {isSelected && answeredState === 'wrong' && (
                  <div className="flex items-center gap-1.5 text-[var(--terakota)] font-black text-sm">
                    <RotateCcw className="w-4 h-4 stroke-[3]" />
                    <span>Perlu Diulang</span>
                  </div>
                )}
              </div>

              {/* Arabic Choice Text */}
              <div
                dir="rtl"
                className="font-['Amiri'] text-[var(--zamrud-tua)] text-2xl md:text-3xl text-center leading-[2] py-2 flex-1 flex items-center justify-center"
              >
                {choice.arab}
              </div>

              {/* Latin & Translation */}
              {(shouldDisplayLatin || shouldDisplayTerjemah) && (
                <div className="mt-2 pt-2 border-t border-[var(--pasir)] flex flex-col gap-1 text-center">
                  {shouldDisplayLatin && (
                    <p className="text-sm font-bold text-[var(--terakota)] italic leading-snug">
                      {choice.latin}
                    </p>
                  )}
                  {shouldDisplayTerjemah && (
                    <p className="text-xs text-[var(--malam)]/70 leading-relaxed font-semibold">
                      "{cleanQuotes(choice.terjemah)}"
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Maskot Nur di pojok kiri bawah & Lanjut button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <GelembungNur text={nurMessage} />

        {answeredState === 'correct' && (
          <TombolBesar
            variant="zamrud"
            size="normal"
            icon={<ArrowRight className="w-6 h-6" />}
            onClick={handleNextQuestion}
          >
            Lanjut Soal Berikutnya
          </TombolBesar>
        )}
      </div>
    </div>
  );
};
