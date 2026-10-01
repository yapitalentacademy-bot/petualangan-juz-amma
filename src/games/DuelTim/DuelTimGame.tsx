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
    <div className="flex flex-col max-w-7xl mx-auto w-full gap-6">
      {/* Top Header: Scores & Round status & Fallback toggle */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border-2 border-amber-500/40">
        {/* Team A Score */}
        <div className="flex items-center gap-4 bg-emerald-950/90 border-2 border-emerald-400 px-6 py-3 rounded-2xl">
          <div className="w-5 h-5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-2xl font-black text-emerald-300">Tim Hijau:</span>
          <span className="text-4xl font-black text-white">{scoreA}</span>
        </div>

        {/* Center Round Info */}
        <div className="flex flex-col items-center">
          <span className="text-stone-400 font-bold text-sm">Duel Tim (Sambung Ayat)</span>
          <span className="text-2xl font-black text-amber-200">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
        </div>

        {/* Team B Score */}
        <div className="flex items-center gap-4 bg-sky-950/90 border-2 border-sky-400 px-6 py-3 rounded-2xl">
          <div className="w-5 h-5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-2xl font-black text-sky-300">Tim Biru:</span>
          <span className="text-4xl font-black text-white">{scoreB}</span>
        </div>
      </div>

      {/* Fallback Mode Toggle Bar */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => {
            sfx.playClick();
            setIsTurnBasedFallback(!isTurnBasedFallback);
          }}
          className="touch-btn flex items-center gap-2 px-5 py-2.5 bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-300 rounded-xl font-bold text-base cursor-pointer"
        >
          {isTurnBasedFallback ? (
            <ToggleRight className="w-6 h-6 text-emerald-400" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-stone-500" />
          )}
          <span>
            {isTurnBasedFallback ? 'Mode Giliran Bergantian (Aktif)' : 'Mode Multi-Touch Buzzer'}
          </span>
        </button>

        {onExit && (
          <button
            onClick={onExit}
            className="touch-btn px-4 py-2 rounded-xl bg-stone-900/80 text-stone-400 hover:text-stone-200 font-bold text-base border border-stone-800 cursor-pointer"
          >
            Keluar Duel
          </button>
        )}
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Team A Buzzer */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-3xl glass-panel border-3 border-emerald-500/50">
          <span className="text-2xl font-black text-emerald-300 mb-2">TIM HIJAU</span>
          <BuzzerButton
            team="A"
            teamName="Tim Hijau"
            isActive={activeBuzzerTeam === 'A'}
            isLocked={lockedTeams.A}
            onPress={handleBuzzerPress}
            disabled={isTurnBasedFallback}
          />
        </div>

        {/* Center: Question & Choices Card */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Active Turn & Timer Indicator */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-stone-900/90 border border-stone-700">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-stone-300">Giliran Menjawab:</span>
              {activeBuzzerTeam ? (
                <span
                  className={`px-4 py-1 rounded-xl font-black text-lg ${
                    activeBuzzerTeam === 'A'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-sky-500 text-slate-950'
                  }`}
                >
                  {activeBuzzerTeam === 'A' ? 'Tim Hijau' : 'Tim Biru'}
                </span>
              ) : (
                <span className="text-amber-400 font-bold text-lg animate-pulse">
                  Tekan Buzzer untuk Rebut Soal!
                </span>
              )}
            </div>

            {isTimerRunning && (
              <div className="flex items-center gap-2 text-amber-300 font-mono font-black text-2xl">
                <Timer className="w-6 h-6 text-amber-400 animate-spin" />
                <span>{timerSeconds}s</span>
              </div>
            )}
          </div>

          {/* Prompt Ayat Box */}
          <div className="glass-panel p-6 rounded-3xl border-3 border-amber-500/60 shadow-lg">
            <div className="flex items-center justify-between mb-2 border-b border-stone-800 pb-2">
              <span className="text-lg font-bold text-amber-300">
                Sambung Ayat ke-{currentQ.promptAyat.nomor} ➔ Ayat ke-{currentQ.jawabanBenar.nomor}:
              </span>
              <button
                onClick={handleReplayPrompt}
                className="touch-btn flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-sm font-bold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Putar</span>
              </button>
            </div>

            <div
              dir="rtl"
              className="font-quran text-amber-100 text-3xl md:text-4xl text-right leading-loose py-2"
            >
              {currentQ.promptAyat.arab}
            </div>

            {(showLatin || showTerjemah) && (
              <div className="mt-2 pt-2 border-t border-stone-800/80">
                {showLatin && (
                  <p className="text-base font-bold text-emerald-300 italic truncate">
                    {currentQ.promptAyat.latin}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Choices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.pilihanAyat.map((choice, idx) => {
              const isSelected = selectedChoiceIdx === idx;
              const isCorrect = choice.isCorrect;

              let style = 'bg-stone-900/90 border-stone-700 hover:border-amber-400';
              if (isSelected && isCorrect) {
                style = 'bg-emerald-950 border-emerald-400 ring-4 ring-emerald-400';
              } else if (isSelected && !isCorrect) {
                style = 'bg-rose-950 border-rose-500 ring-4 ring-rose-500 animate-shake';
              } else if (isAnswerRevealed && isCorrect) {
                style = 'bg-emerald-950/70 border-emerald-400 border-dashed';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectChoice(idx)}
                  className={`
                    touch-btn p-5 rounded-2xl border-3 flex flex-col justify-between min-h-[130px]
                    transition-all select-none cursor-pointer
                    ${style}
                    ${!activeBuzzerTeam ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center mb-1">
                    {String.fromCharCode(65 + idx)}
                  </span>

                  <div
                    dir="rtl"
                    className="font-quran text-amber-100 text-2xl text-right leading-relaxed"
                  >
                    {choice.arab}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Team B Buzzer */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-3xl glass-panel border-3 border-sky-500/50">
          <span className="text-2xl font-black text-sky-300 mb-2">TIM BIRU</span>
          <BuzzerButton
            team="B"
            teamName="Tim Biru"
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
