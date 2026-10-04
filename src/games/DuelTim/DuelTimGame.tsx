import React, { useState, useEffect, useRef } from 'react';
import { MiniGameProps, SambungAyatQuestion } from '../../types/game';
import { generateSambungAyatQuestions } from '../../lib/gameLogic';
import { quranAudio, sfx } from '../../lib/audioPlayer';
import { BuzzerButton } from './BuzzerButton';
import { DuelResultScreen } from './DuelResultScreen';
import { Timer, ToggleLeft, ToggleRight, RotateCcw } from 'lucide-react';
import { TombolBesar } from '../../components/TombolBesar';

export const DuelTimGame: React.FC<MiniGameProps> = ({
  surahId,
  level,
  onFinish,
  onExit,
  showLatin = true,
  showTerjemah = true,
}) => {
  const [questions, setQuestions] = useState<SambungAyatQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Score state
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // Buzzer & Turn state
  const [activeBuzzerTeam, setActiveBuzzerTeam] = useState<'A' | 'B' | null>(null);
  const [lockedTeams, setLockedTeams] = useState<{ A: boolean; B: boolean }>({ A: false, B: false });
  const [timerSeconds, setTimerSeconds] = useState(7);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Game flow states
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isTurnBasedFallback, setIsTurnBasedFallback] = useState(false);
  const [turnTeam, setTurnTeam] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const generated = generateSambungAyatQuestions(surahId, level);
    const roundQuestions = generated.slice(0, 10);
    setQuestions(roundQuestions);
    resetRound();
  }, [surahId, level]);

  const resetRound = () => {
    setCurrentIndex(0);
    setScoreA(0);
    setScoreB(0);
    setIsFinished(false);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setActiveBuzzerTeam(null);
    setLockedTeams({ A: false, B: false });
    setIsAnswerRevealed(false);
    setSelectedChoiceIdx(null);
    setTimerSeconds(7);
    setIsTimerRunning(false);
  };

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentQ && !isFinished) {
      resetQuestionState();

      if (isTurnBasedFallback) {
        setActiveBuzzerTeam(turnTeam);
        setIsTimerRunning(true);
      }

      const timer = setTimeout(() => {
        quranAudio.playAyat(currentQ.promptAyat.surahId, currentQ.promptAyat.nomor);
      }, 300);

      return () => {
        clearTimeout(timer);
        quranAudio.stop();
      };
    }
  }, [currentIndex, currentQ?.id, isTurnBasedFallback]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0 && !isAnswerRevealed) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning && !isAnswerRevealed) {
      handleTimeOut();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, isAnswerRevealed]);

  const handleBuzzerPress = (team: 'A' | 'B') => {
    if (activeBuzzerTeam !== null || lockedTeams[team] || isAnswerRevealed) return;

    sfx.playBuzzer();
    setActiveBuzzerTeam(team);
    setTimerSeconds(7);
    setIsTimerRunning(true);
  };

  const handleTimeOut = () => {
    sfx.playWrong();
    if (!activeBuzzerTeam) return;

    const otherTeam = activeBuzzerTeam === 'A' ? 'B' : 'A';
    const newLocked = { ...lockedTeams, [activeBuzzerTeam]: true };
    setLockedTeams(newLocked);

    if (!newLocked[otherTeam] && !isTurnBasedFallback) {
      setActiveBuzzerTeam(otherTeam);
      setTimerSeconds(5);
    } else {
      setIsAnswerRevealed(true);
      setIsTimerRunning(false);
      setTimeout(handleNextQuestion, 2500);
    }
  };

  const isHandlingAnswer = useRef(false);

  const handleSelectChoice = (index: number) => {
    if (!activeBuzzerTeam || isAnswerRevealed || isHandlingAnswer.current) return;
    isHandlingAnswer.current = true;
    setSelectedChoiceIdx(index);

    const chosen = currentQ.pilihanAyat[index];

    if (chosen.isCorrect) {
      sfx.playCorrect();
      setIsAnswerRevealed(true);
      setIsTimerRunning(false);

      if (activeBuzzerTeam === 'A') {
        setScoreA((prev) => prev + 10);
      } else {
        setScoreB((prev) => prev + 10);
      }

      quranAudio.playAyat(chosen.surahId, chosen.nomor);

      setTimeout(() => {
        isHandlingAnswer.current = false;
        handleNextQuestion();
      }, 2500);
    } else {
      sfx.playWrong();
      const currentTeam = activeBuzzerTeam;
      const otherTeam = currentTeam === 'A' ? 'B' : 'A';
      const newLocked = { ...lockedTeams, [currentTeam]: true };
      setLockedTeams(newLocked);

      if (!newLocked[otherTeam] && !isTurnBasedFallback) {
        setActiveBuzzerTeam(otherTeam);
        setTimerSeconds(5);
        setSelectedChoiceIdx(null);
        isHandlingAnswer.current = false;
      } else {
        setIsAnswerRevealed(true);
        setIsTimerRunning(false);
        setTimeout(() => {
          isHandlingAnswer.current = false;
          handleNextQuestion();
        }, 2500);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      if (isTurnBasedFallback) {
        setTurnTeam((prev) => (prev === 'A' ? 'B' : 'A'));
      }
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      if (onFinish) {
        const total = scoreA + scoreB;
        onFinish({
          skor: Math.max(scoreA, scoreB),
          maxSkor: questions.length * 10,
          benar: Math.round(total / 10),
          salah: questions.length - Math.round(total / 10),
          totalSoal: questions.length,
          stars: 3,
          akurasi: 100,
        });
      }
    }
  };

  const handleReplayPrompt = () => {
    if (currentQ) {
      sfx.playClick();
      quranAudio.playAyat(currentQ.promptAyat.surahId, currentQ.promptAyat.nomor);
    }
  };

  if (isFinished) {
    return (
      <DuelResultScreen
        scoreA={scoreA}
        scoreB={scoreB}
        teamAName="Tim Zamrud"
        teamBName="Tim Emas"
        onRestart={resetRound}
        onExit={onExit || (() => {})}
      />
    );
  }

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#FFFDF6] border-2 border-[#0E4D34] rounded-[28px] text-center">
        <p className="text-2xl text-[#0E4D34] mb-6 font-['Marcellus']">Mempersiapkan ronde Duel Tim...</p>
        {onExit && (
          <TombolBesar variant="ghost" onClick={onExit}>
            Kembali
          </TombolBesar>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full gap-6 font-['Montserrat']">
      {/* Top Header: Comparison Pricing Cards Style from Proposal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Team A (Tim Zamrud): Solid Zamrud Card with Gold Score */}
        <div className="md:col-span-4 flex items-center justify-between p-4 px-6 rounded-[24px] bg-[#0E4D34] border-2 border-[#3A9D6A] shadow-lg text-[#FFFDF6]">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#F3D88A] animate-pulse" />
            <span className="text-lg font-bold uppercase tracking-wider font-['Montserrat']">Tim Zamrud</span>
          </div>
          <span className="text-3xl md:text-4xl font-black font-['Marcellus'] text-gradien-emas">
            {scoreA}
          </span>
        </div>

        {/* Center Round Info */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#FFFDF6] border-2 border-[#D9CBB0] shadow-sm text-center">
          <span className="text-[#0E4D34] font-bold text-xs uppercase tracking-wider">Duel Tim Cepat Tepat</span>
          <span className="text-xl md:text-2xl font-black text-[#0E4D34] font-['Marcellus']">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
        </div>

        {/* Team B (Tim Emas): Solid Gold Gradient Card with Zamrud Score */}
        <div className="md:col-span-4 flex items-center justify-between p-4 px-6 rounded-[24px] bg-gradient-to-r from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] border-2 border-[#FFF2C6] shadow-lg text-[#0E4D34]">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#0E4D34] animate-pulse" />
            <span className="text-lg font-bold uppercase tracking-wider font-['Montserrat']">Tim Emas</span>
          </div>
          <span className="text-3xl md:text-4xl font-black font-['Marcellus'] text-[#0E4D34]">
            {scoreB}
          </span>
        </div>
      </div>

      {/* Fallback Mode Toggle Bar */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => {
            sfx.playClick();
            setIsTurnBasedFallback(!isTurnBasedFallback);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFFDF6] border border-[#D9CBB0] hover:border-[#0E4D34] text-[#2B2A26] rounded-full font-bold text-xs md:text-sm cursor-pointer shadow-sm"
        >
          {isTurnBasedFallback ? (
            <ToggleRight className="w-5 h-5 text-[#0E4D34]" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-[#D9CBB0]" />
          )}
          <span>
            {isTurnBasedFallback ? 'Mode Giliran Bergantian (Aktif)' : 'Mode Multi-Touch Buzzer'}
          </span>
        </button>

        {onExit && (
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-full bg-[#FFFDF6] text-[#2B2A26]/80 hover:text-[#0E4D34] font-bold text-xs md:text-sm border border-[#D9CBB0] hover:border-[#C0603A] cursor-pointer shadow-sm"
          >
            Keluar Duel
          </button>
        )}
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Team A Buzzer (Tim Zamrud) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-[32px] bg-[#0E4D34] border-2 border-[#3A9D6A] shadow-xl text-[#FFFDF6]">
          <span className="text-2xl font-black font-['Marcellus'] text-[#F3D88A] mb-3 uppercase tracking-wider">
            TIM ZAMRUD
          </span>
          <BuzzerButton
            team="A"
            teamName="Tim Zamrud"
            isActive={activeBuzzerTeam === 'A'}
            isLocked={lockedTeams.A}
            onPress={handleBuzzerPress}
            disabled={isTurnBasedFallback}
          />
        </div>

        {/* Center: Question & Choices Card */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Active Turn & Timer Indicator */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#FFFDF6] border border-[#0E4D34]/30 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-bold text-[#2B2A26]/70">Giliran Menjawab:</span>
              {activeBuzzerTeam ? (
                <span
                  className={`px-3.5 py-0.5 rounded-full font-black text-xs md:text-sm shadow-sm ${
                    activeBuzzerTeam === 'A'
                      ? 'bg-[#0E4D34] text-[#F3D88A] border border-[#3A9D6A]'
                      : 'bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border border-[#9C7A2E]/40'
                  }`}
                >
                  {activeBuzzerTeam === 'A' ? 'Tim Zamrud' : 'Tim Emas'}
                </span>
              ) : (
                <span className="text-[#C0603A] font-bold text-xs md:text-sm animate-pulse">
                  Tekan Buzzer untuk Rebut Soal!
                </span>
              )}
            </div>

            {isTimerRunning && (
              <div className="flex items-center gap-1.5 text-[#C0603A] font-black text-base md:text-lg">
                <Timer className="w-5 h-5 animate-spin" />
                <span>{timerSeconds}s</span>
              </div>
            )}
          </div>

          {/* Prompt Ayat Box */}
          <div className="bg-[#FFFDF6] p-5 md:p-6 rounded-[28px] border-2 border-[#0E4D34] shadow-md">
            <div className="flex items-center justify-between mb-2 border-b border-[#E9E1D0] pb-2">
              <span className="text-xs md:text-sm font-bold text-[#0E4D34]">
                Sambung Ayat ke-{currentQ.promptAyat.nomor} ➔ Ayat ke-{currentQ.jawabanBenar.nomor}:
              </span>
              <button
                onClick={handleReplayPrompt}
                className="flex items-center gap-1 px-3 py-1 bg-[#F8F4EA] hover:bg-[#E9E1D0] text-[#0E4D34] border border-[#D9CBB0] rounded-full text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Putar</span>
              </button>
            </div>

            <div
              dir="rtl"
              className="font-ayat text-[#2B2A26] text-3xl md:text-4xl text-right leading-[2.4] py-3"
            >
              {currentQ.promptAyat.arab}
            </div>

            {(showLatin || showTerjemah) && (
              <div className="mt-2 pt-2 border-t border-[#E9E1D0]">
                {showLatin && (
                  <p className="text-sm font-bold text-[#1B6B47] italic">
                    {currentQ.promptAyat.latin}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Choices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQ.pilihanAyat.map((choice, idx) => {
              const isSelected = selectedChoiceIdx === idx;
              const isCorrect = choice.isCorrect;

              let style = 'bg-[#FFFDF6] border-[#0E4D34]/40 hover:border-[#0E4D34] text-[#2B2A26]';
              if (isSelected && isCorrect) {
                style = 'bg-[#0E4D34] border-[#C9A04A] text-[#FFFDF6] ring-4 ring-[#C9A04A]/40';
              } else if (isSelected && !isCorrect) {
                style = 'bg-[#FFF8F5] border-[#C0603A] text-[#2B2A26] ring-4 ring-[#C0603A]/30';
              } else if (isAnswerRevealed && isCorrect) {
                style = 'bg-[#0E4D34] border-[#C9A04A] text-[#FFFDF6] border-dashed';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectChoice(idx)}
                  className={`
                    p-4 md:p-5 rounded-[22px] border-2 flex flex-col justify-between min-h-[130px] h-auto gap-2
                    transition-all select-none cursor-pointer shadow-sm
                    ${style}
                    ${!activeBuzzerTeam ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="w-7 h-7 rounded-full bg-[#F8F4EA] text-[#0E4D34] font-black text-xs flex items-center justify-center mb-1 border border-[#D9CBB0]">
                    {String.fromCharCode(65 + idx)}
                  </span>

                  <div
                    dir="rtl"
                    className="font-ayat text-xl md:text-2xl text-right leading-[2.35] py-2"
                  >
                    {choice.arab}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Team B Buzzer (Tim Emas) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-[32px] bg-gradient-to-br from-[#F3D88A] via-[#C9A04A] to-[#9C7A2E] border-2 border-[#FFF2C6] shadow-xl text-[#0E4D34]">
          <span className="text-2xl font-black font-['Marcellus'] text-[#0E4D34] mb-3 uppercase tracking-wider">
            TIM EMAS
          </span>
          <BuzzerButton
            team="B"
            teamName="Tim Emas"
            isActive={activeBuzzerTeam === 'B'}
            isLocked={lockedTeams.B}
            onPress={handleBuzzerPress}
            disabled={isTurnBasedFallback}
          />
        </div>
      </div>
    </div>
  );
};
