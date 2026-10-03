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

  const cleanQuotes = (text: string) => text.replace(/^["'\s]+|["'\s]+$/g, '');

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

  useEffect(() => {
    if (currentQ) {
      setSelectedChoiceIdx(null);
      setAnsweredState('idle');
      setIsFirstTry(true);
      setShowHint(false);
      setNurMessage(`Mari dengarkan ayat ke-${currentQ.promptAyat.nomor}, lalu pilih sambungannya!`);

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
      sfx.playCorrect();
      setAnsweredState('correct');
      setNurMessage('Masya Allah, jawabanmu tepat sekali!');
      const scoreDelta = isFirstTry ? 15 : 10;
      setScore((prev) => prev + scoreDelta);
      if (isFirstTry) {
        setCorrectCount((prev) => prev + 1);
      }

      quranAudio.playAyat(chosen.surahId, chosen.nomor);

      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
        handleNextQuestion();
      }, 2500);
    } else {
      sfx.playWrong();
      setAnsweredState('wrong');
      setNurMessage('Belum tepat, coba dengarkan dan perhatikan lagi ya!');
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
      handleGameFinish();
    }
  };

  const handleGameFinish = () => {
    const totalSoal = questions.length;
    const finalScore = score;
    const maxSkor = totalSoal * 15;
    const accuracy = totalSoal > 0 ? Math.round((correctCount / totalSoal) * 100) : 100;
    const stars = calculateStars(accuracy);

    if (onFinish) {
      onFinish({
        skor: finalScore,
        maxSkor,
        stars,
        akurasi: accuracy,
        benar: correctCount,
        salah: wrongCount,
        totalSoal,
      });
    }
  };

  const handleReplayPrompt = () => {
    if (currentQ) {
      sfx.playClick();
      quranAudio.playAyat(currentQ.promptAyat.surahId, currentQ.promptAyat.nomor);
    }
  };

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#FFFDF6] border-2 border-[#0E4D34] rounded-[28px] text-center max-w-lg mx-auto shadow-xl">
        <p className="text-2xl text-[#0E4D34] mb-6 font-['Marcellus']">Memuat soal sambung ayat...</p>
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
    <div className="flex flex-col max-w-5xl mx-auto w-full gap-6 font-['Montserrat']">
      {/* Game Bilah Atas */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-5 rounded-[28px] bg-[#FFFDF6] border-2 border-[#0E4D34] shadow-md">
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              onClick={onExit}
              className="p-2.5 rounded-full bg-[#F8F4EA] border border-[#D9CBB0] text-[#0E4D34] hover:bg-[#E9E1D0] cursor-pointer transition-all"
              title="Kembali ke Peta"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <div>
            <span className="text-xs text-[#0E4D34] font-bold block uppercase tracking-wider font-['Montserrat']">
              Sambung Ayat • Surah {currentQ.promptAyat.surahLatin}
            </span>
            <span className="text-xl font-black text-[#2B2A26] font-['Marcellus']">
              Soal {currentIndex + 1} dari {questions.length}
            </span>
          </div>
        </div>

        {/* JalurProgres */}
        <div className="flex-1 max-w-xs mx-auto">
          <JalurProgres currentStep={currentIndex + 1} totalSteps={questions.length} />
        </div>

        <div className="flex items-center gap-2 bg-[#F8F4EA] px-5 py-2 rounded-full border border-[#C9A04A] shadow-sm">
          <BintangDelapan size={20} fill="#C9A04A" />
          <span className="text-xs font-bold text-[#0E4D34] font-['Montserrat']">Skor:</span>
          <span className="text-2xl font-black text-gradien-emas font-['Marcellus']">{score}</span>
        </div>
      </div>

      {/* Prompt Card: Ayat ke-n */}
      <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34] shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-[#E9E1D0] pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#0E4D34] text-[#FFFDF6] font-bold text-xs md:text-sm px-3.5 py-1 rounded-full font-['Montserrat']">
              Dengarkan Ayat Ini:
            </span>
            <span className="text-sm md:text-base font-black text-[#0E4D34] font-['Montserrat']">
              Ayat ke-{currentQ.promptAyat.nomor}
            </span>
          </div>

          <button
            onClick={handleReplayPrompt}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] rounded-full text-xs md:text-sm font-black shadow-sm cursor-pointer hover:brightness-105 transition-all font-['Montserrat']"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Putar Ulang</span>
          </button>
        </div>

        {/* Big Arabic Text (Prompt) */}
        <div
          dir="rtl"
          className="font-ayat text-[#2B2A26] text-3xl md:text-4xl text-center leading-[2.2] py-2"
        >
          {currentQ.promptAyat.arab}
        </div>

        {/* Latin & Translation */}
        {(shouldDisplayLatin || shouldDisplayTerjemah) && (
          <div className="mt-3 pt-3 border-t border-[#E9E1D0] flex flex-col gap-1 text-center font-['Montserrat']">
            {shouldDisplayLatin && (
              <p className="text-sm md:text-base font-bold text-[#1B6B47] italic">
                {currentQ.promptAyat.latin}
              </p>
            )}
            {shouldDisplayTerjemah && (
              <p className="text-xs md:text-sm text-[#2B2A26]/80 font-medium">
                "{cleanQuotes(currentQ.promptAyat.terjemah)}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Instruction & Helper */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg md:text-xl font-bold text-[#0E4D34] font-['Marcellus'] flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-[#C9A04A]" />
          <span>Pilih Lanjutan Ayat Berikutnya (Ayat ke-{currentQ.jawabanBenar.nomor}):</span>
        </h3>

        {level === 6 && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#FFFDF6] border border-[#D9CBB0] hover:border-[#0E4D34] text-[#2B2A26] rounded-full font-bold text-xs cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-[#C9A04A]" />
            <span>{showHint ? 'Sembunyikan Bantuan' : 'Buka Bantuan Teks'}</span>
          </button>
        )}
      </div>

      {/* Choice Cards Grid (Kartu Pilihan: Radius 28px, Gading, Zamrud saat Benar) */}
      <div
        className={`grid gap-5 ${
          currentQ.pilihanAyat.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {currentQ.pilihanAyat.map((choice, idx) => {
          const isSelected = selectedChoiceIdx === idx;
          const isCorrect = choice.isCorrect;
          const isSolidActive = (isSelected && answeredState === 'correct') || (answeredState === 'wrong' && isCorrect);

          let cardStyle = 'bg-[#FFFDF6] text-[#2B2A26] border-[#0E4D34] hover:border-[#1B6B47] shadow-lg shadow-[#C9A04A]/10';
          if (isSolidActive) {
            cardStyle = 'bg-[#0E4D34] text-[#FFFDF6] border-[#C9A04A] ring-4 ring-[#C9A04A]/40 shadow-xl';
          } else if (isSelected && answeredState === 'wrong') {
            cardStyle = 'bg-[#FFF8F5] text-[#2B2A26] border-[#C0603A] ring-4 ring-[#C0603A]/30 shadow-md';
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelectChoice(idx)}
              className={`
                btn-kafilah relative flex flex-col justify-between p-5 md:p-6 rounded-[28px] border-2 min-h-[220px]
                transition-all duration-150 cursor-pointer select-none
                ${cardStyle}
              `}
            >
              {/* Top Choice Indicator */}
              <div
                className={`flex items-center justify-between mb-2 border-b pb-2 ${
                  isSolidActive ? 'border-[#3A9D6A]/50' : 'border-[#E9E1D0]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 rounded-full font-black text-sm font-['Marcellus'] flex items-center justify-center border ${
                      isSolidActive
                        ? 'bg-gradient-to-br from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border-white'
                        : 'bg-[#F8F4EA] text-[#0E4D34] border-[#D9CBB0]'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span
                    className={`text-sm font-bold font-['Montserrat'] ${
                      isSolidActive ? 'text-[#F3D88A]' : 'text-[#0E4D34]'
                    }`}
                  >
                    Pilihan {String.fromCharCode(65 + idx)}
                  </span>
                </div>

                {isSelected && answeredState === 'correct' && (
                  <div className="flex items-center gap-1.5 text-[#F3D88A] font-black text-xs font-['Montserrat']">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Benar! (+{isFirstTry ? '15' : '10'})</span>
                  </div>
                )}

                {isSelected && answeredState === 'wrong' && (
                  <div className="flex items-center gap-1.5 text-[#C0603A] font-black text-xs font-['Montserrat']">
                    <RotateCcw className="w-4 h-4 stroke-[3]" />
                    <span>Perlu Diulang</span>
                  </div>
                )}
              </div>

              {/* Arabic Choice Text */}
              <div
                dir="rtl"
                className={`font-ayat text-2xl md:text-3xl text-center leading-[2] py-2 flex-1 flex items-center justify-center ${
                  isSolidActive ? 'text-[#FFFDF6]' : 'text-[#2B2A26]'
                }`}
              >
                {choice.arab}
              </div>

              {/* Latin & Translation */}
              {(shouldDisplayLatin || shouldDisplayTerjemah) && (
                <div
                  className={`mt-2 pt-2 border-t flex flex-col gap-1 text-center font-['Montserrat'] ${
                    isSolidActive ? 'border-[#3A9D6A]/50' : 'border-[#E9E1D0]'
                  }`}
                >
                  {shouldDisplayLatin && (
                    <p
                      className={`text-xs font-bold italic leading-snug ${
                        isSolidActive ? 'text-[#F3D88A]' : 'text-[#1B6B47]'
                      }`}
                    >
                      {choice.latin}
                    </p>
                  )}
                  {shouldDisplayTerjemah && (
                    <p
                      className={`text-[11px] leading-relaxed font-medium ${
                        isSolidActive ? 'text-[#FFFDF6]/90' : 'text-[#2B2A26]/75'
                      }`}
                    >
                      "{cleanQuotes(choice.terjemah)}"
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Maskot Nur & Lanjut button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <GelembungNur text={nurMessage} />

        {answeredState === 'correct' && (
          <TombolBesar
            variant="emas"
            size="normal"
            icon={<ArrowRight className="w-6 h-6 text-[#0E4D34]" />}
            onClick={handleNextQuestion}
          >
            Lanjut Soal Berikutnya
          </TombolBesar>
        )}
      </div>
    </div>
  );
};
