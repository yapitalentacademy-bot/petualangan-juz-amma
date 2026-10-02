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

  // Load questions
  useEffect(() => {
    const generated = generateSambungAyatQuestions(surahId, level);
    // Limit to 10 questions per duel round (or all if < 10)
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

  // Auto-play prompt audio when entering a new question
  useEffect(() => {
    if (currentQ && !isFinished) {
      resetQuestionState();

      if (isTurnBasedFallback) {
        // In turn-based mode, automatically grant turn to the active turn team
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

  // Answering countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0 && !isAnswerRevealed) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning && !isAnswerRevealed) {
      // Time out! Count as wrong for the answering team
      handleTimeOut();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, isAnswerRevealed]);

  // Buzzer press handler
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

    // If the other team is not locked yet, give them a turn!
    if (!newLocked[otherTeam] && !isTurnBasedFallback) {
      setActiveBuzzerTeam(otherTeam);
      setTimerSeconds(5); // 5s for steal chance
    } else {
      // Both teams failed or timed out -> reveal answer and move on
      setIsAnswerRevealed(true);
      setIsTimerRunning(false);
      setTimeout(handleNextQuestion, 2500);
    }
  };

  const isHandlingAnswer = useRef(false);

  // Choice selection
  const handleSelectChoice = (index: number) => {
    if (!activeBuzzerTeam || isAnswerRevealed || isHandlingAnswer.current) return;
    isHandlingAnswer.current = true;
    setSelectedChoiceIdx(index);

    const chosen = currentQ.pilihanAyat[index];

    if (chosen.isCorrect) {
      // Correct!
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
      // Incorrect!
      sfx.playWrong();
      const currentTeam = activeBuzzerTeam;
      const otherTeam = currentTeam === 'A' ? 'B' : 'A';
      const newLocked = { ...lockedTeams, [currentTeam]: true };
      setLockedTeams(newLocked);

      // Give turn to opponent if available
      if (!newLocked[otherTeam] && !isTurnBasedFallback) {
        setActiveBuzzerTeam(otherTeam);
        setTimerSeconds(5);
        setSelectedChoiceIdx(null);
        isHandlingAnswer.current = false;
      } else {
        // Both missed -> show correct answer
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
        teamAName="Tim Hijau"
        teamBName="Tim Biru"
        onRestart={resetRound}
        onExit={onExit || (() => {})}
      />
    );
  }

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-3xl text-center">
        <p className="text-2xl text-stone-300 mb-6">Mempersiapkan ronde Duel Tim...</p>
        {onExit && (
          <TombolBesar variant="ghost" onClick={onExit}>
            Kembali
          </TombolBesar>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full gap-6 font-['Nunito']">
      {/* Top Header: Scores & Round status & Fallback toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 rounded-[28px] bg-[var(--gading)] border-2 border-[var(--emas)] shadow-md">
        {/* Team A Score (Zamrud) */}
        <div className="flex items-center gap-3 bg-[var(--zamrud)]/10 border-2 border-[var(--zamrud)] px-5 py-2.5 rounded-2xl">
          <div className="w-4 h-4 rounded-full bg-[var(--zamrud)] animate-pulse" />
          <span className="text-xl font-black text-[var(--zamrud-tua)] font-['Baloo_2']">Tim Zamrud:</span>
          <span className="text-3xl font-black text-[var(--zamrud-tua)] font-['Baloo_2']">{scoreA}</span>
        </div>

        {/* Center Round Info */}
        <div className="flex flex-col items-center">
          <span className="text-[var(--malam)]/70 font-bold text-xs uppercase tracking-wider">Duel Tim Cepat Tepat</span>
          <span className="text-2xl font-black text-[var(--zamrud-tua)] font-['Baloo_2']">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
        </div>

        {/* Team B Score (Biru Laut) */}
        <div className="flex items-center gap-3 bg-[var(--biru-laut)]/10 border-2 border-[var(--biru-laut)] px-5 py-2.5 rounded-2xl">
          <div className="w-4 h-4 rounded-full bg-[var(--biru-laut)] animate-pulse" />
          <span className="text-xl font-black text-[var(--biru-laut)] font-['Baloo_2']">Tim Biru Laut:</span>
          <span className="text-3xl font-black text-[var(--biru-laut)] font-['Baloo_2']">{scoreB}</span>
        </div>
      </div>

      {/* Fallback Mode Toggle Bar */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => {
            sfx.playClick();
            setIsTurnBasedFallback(!isTurnBasedFallback);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--gading)] border border-[var(--pasir)] hover:border-[var(--emas)] text-[var(--malam)] rounded-full font-bold text-sm cursor-pointer shadow-sm"
        >
          {isTurnBasedFallback ? (
            <ToggleRight className="w-5 h-5 text-[var(--zamrud)]" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-[var(--pasir)]" />
          )}
          <span>
            {isTurnBasedFallback ? 'Mode Giliran Bergantian (Aktif)' : 'Mode Multi-Touch Buzzer'}
          </span>
        </button>

        {onExit && (
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-full bg-[var(--gading)] text-[var(--malam)]/80 hover:text-[var(--malam)] font-bold text-sm border border-[var(--pasir)] hover:border-[var(--terakota)] cursor-pointer shadow-sm"
          >
            Keluar Duel
          </button>
        )}
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Team A Buzzer (Zamrud) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-[32px] bg-[var(--gading)] border-2 border-[var(--zamrud)] shadow-md">
          <span className="text-2xl font-black text-[var(--zamrud-tua)] font-['Baloo_2'] mb-3">TIM ZAMRUD</span>
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
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[var(--gading)] border border-[var(--emas)]/60 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--malam)]/70">Giliran Menjawab:</span>
              {activeBuzzerTeam ? (
                <span
                  className={`px-3 py-0.5 rounded-full font-black text-sm text-[var(--gading)] ${
                    activeBuzzerTeam === 'A'
                      ? 'bg-[var(--zamrud)]'
                      : 'bg-[var(--biru-laut)]'
                  }`}
                >
                  {activeBuzzerTeam === 'A' ? 'Tim Zamrud' : 'Tim Biru Laut'}
                </span>
              ) : (
                <span className="text-[var(--terakota)] font-bold text-sm animate-pulse">
                  Tekan Buzzer untuk Rebut Soal!
                </span>
              )}
            </div>

            {isTimerRunning && (
              <div className="flex items-center gap-1.5 text-[var(--terakota)] font-black text-lg">
                <Timer className="w-5 h-5 animate-spin" />
                <span>{timerSeconds}s</span>
              </div>
            )}
          </div>

          {/* Prompt Ayat Box */}
          <div className="bg-[var(--gading)] p-5 md:p-6 rounded-[28px] border-2 border-[var(--emas)] shadow-md">
            <div className="flex items-center justify-between mb-2 border-b border-[var(--pasir)] pb-2">
              <span className="text-sm font-bold text-[var(--zamrud-tua)]">
                Sambung Ayat ke-{currentQ.promptAyat.nomor} ➔ Ayat ke-{currentQ.jawabanBenar.nomor}:
              </span>
              <button
                onClick={handleReplayPrompt}
                className="flex items-center gap-1 px-3 py-1 bg-[var(--emas)] hover:bg-[var(--emas)]/80 text-[var(--malam)] rounded-full text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Putar</span>
              </button>
            </div>

            <div
              dir="rtl"
              className="font-['Amiri'] text-[var(--zamrud-tua)] text-3xl md:text-4xl text-right leading-loose py-1"
            >
              {currentQ.promptAyat.arab}
            </div>

            {(showLatin || showTerjemah) && (
              <div className="mt-2 pt-2 border-t border-[var(--pasir)]">
                {showLatin && (
                  <p className="text-sm font-bold text-[var(--terakota)] italic truncate">
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

              let style = 'bg-[var(--gading)] border-[var(--emas)]/40 hover:border-[var(--zamrud)]';
              if (isSelected && isCorrect) {
                style = 'bg-[var(--pasir-terang)] border-[var(--zamrud)] ring-4 ring-[var(--zamrud)]/30';
              } else if (isSelected && !isCorrect) {
                style = 'bg-[var(--terakota)]/15 border-[var(--terakota)] ring-4 ring-[var(--terakota)]/30';
              } else if (isAnswerRevealed && isCorrect) {
                style = 'bg-[var(--pasir-terang)] border-[var(--zamrud)] border-dashed';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectChoice(idx)}
                  className={`
                    p-4 rounded-2xl border-2 flex flex-col justify-between min-h-[110px]
                    transition-all select-none cursor-pointer shadow-sm
                    ${style}
                    ${!activeBuzzerTeam ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="w-7 h-7 rounded-full bg-[var(--pasir)] text-[var(--zamrud-tua)] font-black text-xs flex items-center justify-center mb-1 border border-[var(--emas)]/40">
                    {String.fromCharCode(65 + idx)}
                  </span>

                  <div
                    dir="rtl"
                    className="font-['Amiri'] text-[var(--zamrud-tua)] text-xl text-right leading-relaxed"
                  >
                    {choice.arab}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Team B Buzzer (Biru Laut) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-[32px] bg-[var(--gading)] border-2 border-[var(--biru-laut)] shadow-md">
          <span className="text-2xl font-black text-[var(--biru-laut)] font-['Baloo_2'] mb-3">TIM BIRU LAUT</span>
          <BuzzerButton
            team="B"
            teamName="Tim Biru Laut"
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
