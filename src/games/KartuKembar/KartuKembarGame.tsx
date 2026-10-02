import React, { useState, useEffect } from 'react';
import { MiniGameProps, KartuKembarCard } from '../../types/game';
import { generateKartuKembarDeck } from '../../lib/gameLogic';
import { sfx } from '../../lib/audioPlayer';
import { Sparkles, Users, CheckCircle2 } from 'lucide-react';

export const KartuKembarGame: React.FC<MiniGameProps> = ({
  surahId,
  level = 4,
  mode = 'solo',
  onFinish,
  onExit,
}) => {
  const [deck, setDeck] = useState<KartuKembarCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);

  // Scores
  const [scoreSolo, setScoreSolo] = useState(0);
  const [teamScores, setTeamScores] = useState<{ A: number; B: number }>({ A: 0, B: 0 });
  const [currentTurnTeam, setCurrentTurnTeam] = useState<'A' | 'B'>('A');
  const [turnsCount, setTurnsCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const isTeamMode = mode === 'tim';

  useEffect(() => {
    startNewGame();
  }, [surahId, level, mode]);

  const startNewGame = () => {
    const cards = generateKartuKembarDeck([surahId], level);
    setDeck(cards);
    setFlippedCardIds([]);
    setMatchedPairIds([]);
    setScoreSolo(0);
    setTeamScores({ A: 0, B: 0 });
    setCurrentTurnTeam('A');
    setTurnsCount(0);
    setIsProcessing(false);
  };

  const handleCardClick = (card: KartuKembarCard) => {
    if (
      isProcessing ||
      card.isMatched ||
      flippedCardIds.includes(card.id) ||
      flippedCardIds.length >= 2
    ) {
      return;
    }

    sfx.playClick();
    const newFlipped = [...flippedCardIds, card.id];
    setFlippedCardIds(newFlipped);

    if (newFlipped.length === 2) {
      setTurnsCount((prev) => prev + 1);
      setIsProcessing(true);

      const card1 = deck.find((c) => c.id === newFlipped[0])!;
      const card2 = deck.find((c) => c.id === newFlipped[1])!;

      if (card1.pairId === card2.pairId) {
        // MATCH!
        sfx.playCorrect();
        setTimeout(() => {
          const newMatched = [...matchedPairIds, card1.pairId];
          setMatchedPairIds(newMatched);

          // Mark in deck
          setDeck((prev) =>
            prev.map((c) =>
              c.pairId === card1.pairId
                ? { ...c, isMatched: true, matchedByTeam: isTeamMode ? currentTurnTeam : undefined }
                : c
            )
          );

          if (isTeamMode) {
            setTeamScores((prev) => ({
              ...prev,
              [currentTurnTeam]: prev[currentTurnTeam] + 20,
            }));
            // Team gets extra turn!
          } else {
            setScoreSolo((prev) => prev + 20);
          }

          setFlippedCardIds([]);
          setIsProcessing(false);

          // Check if all 6 pairs matched
          if (newMatched.length === 6) {
            handleGameComplete();
          }
        }, 800);
      } else {
        // NO MATCH
        sfx.playWrong();
        setTimeout(() => {
          setFlippedCardIds([]);
          if (isTeamMode) {
            setCurrentTurnTeam((prev) => (prev === 'A' ? 'B' : 'A'));
          }
          setIsProcessing(false);
        }, 1300);
      }
    }
  };

  const handleGameComplete = () => {
    sfx.playStar();
    const finalScore = isTeamMode ? Math.max(teamScores.A, teamScores.B) : scoreSolo;
    const stars = turnsCount <= 8 ? 3 : turnsCount <= 12 ? 2 : 1;

    onFinish({
      skor: finalScore,
      maxSkor: 120,
      benar: 6,
      salah: Math.max(0, turnsCount - 6),
      totalSoal: 6,
      stars,
      akurasi: Math.max(50, Math.round((6 / turnsCount) * 100)),
    });
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full gap-6">
      {/* Header Info */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border-2 border-amber-500/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-md">
            🎴
          </div>
          <div>
            <span className="text-stone-400 font-bold text-sm block">
              Kartu Kembar (Memory Match 4×3)
            </span>
            <span className="text-2xl font-black text-amber-200">
              Temukan 6 Pasang Nama & Arti Surah ({matchedPairIds.length} / 6 Cocok)
            </span>
          </div>
        </div>

        {/* Scores & Turn Status */}
        <div className="flex items-center gap-4">
          {isTeamMode ? (
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all ${
                  currentTurnTeam === 'A'
                    ? 'bg-emerald-950 border-emerald-400 ring-4 ring-emerald-500/40'
                    : 'bg-stone-900 border-stone-700 opacity-60'
                }`}
              >
                <span className="text-emerald-300 font-bold">Tim Hijau:</span>
                <span className="text-2xl font-black text-white">{teamScores.A}</span>
              </div>

              <div
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all ${
                  currentTurnTeam === 'B'
                    ? 'bg-sky-950 border-sky-400 ring-4 ring-sky-500/40'
                    : 'bg-stone-900 border-stone-700 opacity-60'
                }`}
              >
                <span className="text-sky-300 font-bold">Tim Biru:</span>
                <span className="text-2xl font-black text-white">{teamScores.B}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-stone-900/90 px-6 py-3 rounded-2xl border border-stone-700">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-stone-400 font-bold text-lg">Skor:</span>
              <span className="text-3xl font-black text-yellow-300">{scoreSolo}</span>
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

      {/* Team Turn Banner */}
      {isTeamMode && (
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-stone-900/90 border border-stone-700">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-amber-400" />
            <span className="text-lg font-bold text-stone-300">Giliran Membuka Kartu:</span>
            <span
              className={`px-4 py-1 rounded-xl font-black text-lg ${
                currentTurnTeam === 'A'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-sky-500 text-slate-950'
              }`}
            >
              {currentTurnTeam === 'A' ? 'Tim Hijau' : 'Tim Biru'}
            </span>
          </div>
          <span className="text-stone-400 font-medium text-sm">
            *Pasangan cocok memberikan poin dan giliran tambahan!
          </span>
        </div>
      )}

      {/* 4x3 Grid of 12 Cards */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 py-2">
        {deck.map((card) => {
          const isFlipped = flippedCardIds.includes(card.id) || card.isMatched;

          let cardBg = 'bg-stone-900 border-amber-600/60 hover:border-amber-400 shadow-md';
          if (card.isMatched) {
            cardBg =
              card.matchedByTeam === 'B'
                ? 'bg-sky-950/90 border-sky-400 shadow-card-glow'
                : 'bg-emerald-950/90 border-emerald-400 shadow-card-glow';
          } else if (isFlipped) {
            cardBg = 'bg-amber-950 border-amber-300 ring-4 ring-amber-400/50 shadow-gold-glow';
          }

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                touch-btn relative flex flex-col items-center justify-center p-6 rounded-3xl border-4 min-h-[160px] md:min-h-[190px]
                transition-all duration-200 select-none cursor-pointer
                ${cardBg}
                ${card.isMatched ? 'cursor-default opacity-90' : ''}
              `}
            >
              {isFlipped ? (
                /* Card Front (Revealed Content) */
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-stone-950/80 text-amber-300 mb-2">
                    {card.tipe === 'nama_surah' ? 'NAMA SURAH' : 'ARTI / INFO'}
                  </span>

                  <span className="text-2xl md:text-3xl font-black text-white font-display">
                    {card.teksUtama}
                  </span>

                  {card.arab && (
                    <span dir="rtl" className="font-quran text-3xl text-amber-200 my-1">
                      {card.arab}
                    </span>
                  )}

                  {card.teksSekunder && (
                    <span className="text-sm font-bold text-stone-300 mt-1">
                      {card.teksSekunder}
                    </span>
                  )}

                  {card.isMatched && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-2 animate-bounce" />
                  )}
                </div>
              ) : (
                /* Card Back (Cover) */
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-300 mb-2">
                    <span className="text-3xl font-black">؟</span>
                  </div>
                  <span className="text-sm font-bold text-amber-200/80">
                    Sentuh Buka
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
