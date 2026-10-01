import React, { useState } from 'react';
import { SurahDetail } from '../../types/surah';
import { TombolBesar } from '../../components/TombolBesar';
import {
  getStoryForSurah,
  SurahStoryData,
  StoryPanel,
  StoryQuestion,
} from '../../lib/tajwidLogic';
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  HeartHandshake,
  Star,
  Compass,
  Sunrise,
  Shield,
  Scroll,
} from 'lucide-react';
import { sfx } from '../../lib/audioPlayer';

interface KisahSurahScreenProps {
  surah: SurahDetail;
  onExit: () => void;
  onRewardBadge?: (badgeId: string) => void;
}

export const KisahSurahScreen: React.FC<KisahSurahScreenProps> = ({
  surah,
  onExit,
  onRewardBadge,
}) => {
  const storyData: SurahStoryData = getStoryForSurah(surah);
  const [currentStep, setCurrentStep] = useState<'panels' | 'quiz' | 'reflection'>('panels');
  const [panelIndex, setPanelIndex] = useState(0);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showAnswerResult, setShowAnswerResult] = useState(false);

  const activePanel: StoryPanel = storyData.panels[panelIndex];
  const activeQuestion: StoryQuestion | undefined = storyData.questions[quizIndex];

  const handleNextPanel = () => {
    sfx.playClick();
    if (panelIndex + 1 < storyData.panels.length) {
      setPanelIndex((prev) => prev + 1);
    } else {
      // Transition to quiz
      setCurrentStep('quiz');
    }
  };

  const handlePrevPanel = () => {
    sfx.playClick();
    if (panelIndex > 0) {
      setPanelIndex((prev) => prev - 1);
    }
  };

  const handleSelectQuizAnswer = (optionIndex: number) => {
    if (showAnswerResult || !activeQuestion) return;

    setSelectedAnswer(optionIndex);
    setShowAnswerResult(true);

    if (optionIndex === activeQuestion.jawabanBenar) {
      sfx.playCorrect();
      setQuizScore((prev) => prev + 1);
    } else {
      sfx.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sfx.playClick();
    setSelectedAnswer(null);
    setShowAnswerResult(false);

    if (quizIndex + 1 < storyData.questions.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      // Finished quiz -> show reflection
      sfx.playStar();
      if (onRewardBadge && quizScore >= 2) {
        onRewardBadge('penjelajah');
      }
      setCurrentStep('reflection');
    }
  };

  const renderPanelIcon = (type: StoryPanel['iconType']) => {
    switch (type) {
      case 'kaaba':
        return <Compass className="w-20 h-20 text-amber-300 animate-pulse" />;
      case 'desert':
        return <Sunrise className="w-20 h-20 text-orange-300" />;
      case 'shield':
        return <Shield className="w-20 h-20 text-cyan-300" />;
      case 'heart':
        return <HeartHandshake className="w-20 h-20 text-rose-300" />;
      case 'stars':
        return <Sparkles className="w-20 h-20 text-yellow-300" />;
      case 'scroll':
      default:
        return <Scroll className="w-20 h-20 text-emerald-300" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-amber-500/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-950/80 border border-amber-400/50 rounded-2xl text-amber-300">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white font-display">
              Kisah di Balik Surah {surah.namaLatin}
            </h2>
            <p className="text-amber-300 text-lg font-bold">
              {storyData.latarBelakang}
            </p>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-2 rounded-2xl font-bold text-sm border ${
              currentStep === 'panels'
                ? 'bg-amber-600 border-amber-400 text-white'
                : 'bg-stone-900 border-stone-700 text-stone-400'
            }`}
          >
            1. Kisah ({panelIndex + 1}/{storyData.panels.length})
          </span>
          <span
            className={`px-4 py-2 rounded-2xl font-bold text-sm border ${
              currentStep === 'quiz'
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-stone-900 border-stone-700 text-stone-400'
            }`}
          >
            2. Kuis Pemahaman
          </span>
          <span
            className={`px-4 py-2 rounded-2xl font-bold text-sm border ${
              currentStep === 'reflection'
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-stone-900 border-stone-700 text-stone-400'
            }`}
          >
            3. Pesan Akhlak
          </span>
        </div>
      </div>

      {/* STEP 1: Story Panels */}
      {currentStep === 'panels' && activePanel && (
        <div className="glass-panel p-8 md:p-12 rounded-3xl border-3 border-amber-500/60 shadow-2xl flex flex-col justify-between min-h-[460px] relative overflow-hidden bg-gradient-to-br from-stone-900 via-amber-950/20 to-stone-950">
          {/* Desert/Oasis Symbolic Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-8">
              <span className="px-5 py-2 rounded-2xl bg-amber-950/90 border border-amber-500/70 text-amber-300 font-extrabold text-xl">
                Bagian {activePanel.panelNumber} dari {storyData.panels.length}
              </span>

              <div className="p-4 bg-stone-900/90 border-2 border-amber-400/40 rounded-3xl shadow-inner">
                {renderPanelIcon(activePanel.iconType)}
              </div>
            </div>

            <h3 className="text-4xl md:text-5xl font-black text-white font-display mb-6 tracking-wide">
              {activePanel.judul}
            </h3>

            <p className="text-2xl md:text-3xl text-stone-200 leading-relaxed font-medium mb-8">
              {activePanel.narasi}
            </p>

            <div className="p-5 rounded-2xl bg-amber-950/60 border-l-4 border-amber-400 text-amber-200 text-xl font-semibold italic">
              ✨ {activePanel.highlightText}
            </div>
          </div>

          {/* Panel Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-800">
            <button
              onClick={handlePrevPanel}
              disabled={panelIndex === 0}
              className={`
                touch-btn px-6 py-4 rounded-2xl font-bold text-xl flex items-center gap-2 border-2 cursor-pointer transition-all
                ${
                  panelIndex === 0
                    ? 'opacity-40 bg-stone-900 border-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-stone-900 border-stone-700 hover:border-amber-400 text-stone-200'
                }
              `}
            >
              <ChevronLeft className="w-7 h-7" />
              Sebelumnya
            </button>

            <TombolBesar
              variant="desert"
              size="large"
              icon={<ChevronRight className="w-8 h-8" />}
              onClick={handleNextPanel}
            >
              {panelIndex + 1 === storyData.panels.length ? 'Mulai Kuis Pemahaman' : 'Berikutnya'}
            </TombolBesar>
          </div>
        </div>
      )}

      {/* STEP 2: Interactive Quiz Mode */}
      {currentStep === 'quiz' && activeQuestion && (
        <div className="glass-panel p-8 md:p-12 rounded-3xl border-3 border-emerald-500/60 shadow-2xl flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="px-5 py-2 rounded-2xl bg-emerald-950/90 border border-emerald-500/70 text-emerald-300 font-extrabold text-xl">
                Pertanyaan {quizIndex + 1} dari {storyData.questions.length}
              </span>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-950/80 border border-amber-400/50 text-amber-300 font-bold">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                Skor Kuis: {quizScore}
              </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-white font-display mb-8">
              {activeQuestion.pertanyaan}
            </h3>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {activeQuestion.pilihan.map((opsi, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === activeQuestion.jawabanBenar;

                let cardStyle =
                  'bg-stone-900/90 border-stone-700 text-stone-200 hover:border-emerald-400 hover:bg-stone-800';

                if (showAnswerResult) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-900/90 border-emerald-300 text-white shadow-card-glow';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-rose-950/90 border-rose-400 text-rose-200';
                  } else {
                    cardStyle = 'bg-stone-900/50 border-stone-800 text-stone-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showAnswerResult}
                    onClick={() => handleSelectQuizAnswer(idx)}
                    className={`
                      touch-btn p-6 rounded-3xl border-3 text-left font-extrabold text-2xl flex items-center justify-between cursor-pointer transition-all
                      ${cardStyle}
                    `}
                  >
                    <span>{opsi}</span>
                    {showAnswerResult && isCorrect && (
                      <CheckCircle className="w-8 h-8 text-emerald-300 shrink-0" />
                    )}
                    {showAnswerResult && isSelected && !isCorrect && (
                      <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Toast */}
            {showAnswerResult && (
              <div className="p-5 rounded-2xl bg-stone-900/90 border-2 border-emerald-400/60 text-emerald-200 text-xl font-semibold">
                💡 <strong className="text-white">Penjelasan:</strong> {activeQuestion.penjelasan}
              </div>
            )}
          </div>

          {/* Quiz Action Button */}
          {showAnswerResult && (
            <div className="flex justify-end mt-8 pt-6 border-t border-stone-800">
              <TombolBesar
                variant="oasis"
                size="large"
                icon={<ChevronRight className="w-8 h-8" />}
                onClick={handleNextQuestion}
              >
                {quizIndex + 1 === storyData.questions.length ? 'Lihat Pesan Akhlak' : 'Soal Berikutnya'}
              </TombolBesar>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Reflection & Moral Lesson */}
      {currentStep === 'reflection' && (
        <div className="glass-panel p-8 md:p-12 rounded-3xl border-3 border-purple-500/60 shadow-2xl flex flex-col justify-between min-h-[460px] bg-gradient-to-br from-stone-900 via-purple-950/30 to-stone-950">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-purple-900/80 border border-purple-400/60 rounded-3xl text-purple-300">
                <HeartHandshake className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-white font-display">
                  Pesan Akhlak & Amalan Nyata
                </h3>
                <p className="text-purple-300 text-xl font-bold">
                  Surah {surah.namaLatin} • Hasil Kuis: {quizScore} / {storyData.questions.length} Benar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="p-8 rounded-3xl bg-stone-900/90 border-2 border-amber-400/50 flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 text-sm font-extrabold uppercase tracking-wider block mb-2">
                    Nilai Luhur Surah
                  </span>
                  <p className="text-2xl text-stone-200 leading-relaxed font-semibold">
                    "{storyData.pesanAkhlak}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-800 text-amber-300 text-sm font-bold">
                  🌱 Menumbuhkan karakter Qur'ani dalam diri
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-stone-900/90 border-2 border-emerald-400/50 flex flex-col justify-between">
                <div>
                  <span className="text-emerald-400 text-sm font-extrabold uppercase tracking-wider block mb-2">
                    Tantangan Amalan Nyata
                  </span>
                  <p className="text-2xl text-stone-200 leading-relaxed font-semibold">
                    "{storyData.amalanNyata}"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-800 text-emerald-300 text-sm font-bold">
                  ⭐ Amalkan hari ini di kelas & rumah!
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-800">
            <button
              onClick={() => {
                setPanelIndex(0);
                setCurrentStep('panels');
              }}
              className="touch-btn px-6 py-4 rounded-2xl bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-300 font-bold text-lg cursor-pointer"
            >
              Baca Ulang Kisah
            </button>

            <TombolBesar variant="oasis" size="large" onClick={onExit}>
              Selesai & Kembali ke Pos
            </TombolBesar>
          </div>
        </div>
      )}

      {/* Exit Button at bottom */}
      {currentStep !== 'reflection' && (
        <div className="flex justify-start">
          <TombolBesar variant="desert" size="normal" onClick={onExit}>
            Keluar ke Pos
          </TombolBesar>
        </div>
      )}
    </div>
  );
};
