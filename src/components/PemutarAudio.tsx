import React, { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { quranAudio } from '../lib/audioPlayer';

interface PemutarAudioProps {
  surahNumber: number;
  ayatNumber: number;
  size?: 'normal' | 'large';
  showLabel?: boolean;
}

export const PemutarAudio: React.FC<PemutarAudioProps> = ({
  surahNumber,
  ayatNumber,
  size = 'normal',
  showLabel = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = quranAudio.subscribe(() => {
      setIsPlaying(quranAudio.isPlaying(surahNumber, ayatNumber));
    });
    return () => unsubscribe();
  }, [surahNumber, ayatNumber]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      quranAudio.stop();
    } else {
      quranAudio.playAyat(surahNumber, ayatNumber);
    }
  };

  const isLarge = size === 'large';

  return (
    <button
      onClick={handleToggle}
      className={`
        touch-btn flex items-center justify-center gap-3 font-bold rounded-2xl
        transition-all duration-100 cursor-pointer
        ${
          isPlaying
            ? 'bg-emerald-500 text-white shadow-card-glow animate-pulse ring-4 ring-emerald-300'
            : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-2 border-emerald-600/60 shadow-md'
        }
        ${isLarge ? 'px-8 py-5 text-2xl min-h-[72px]' : 'px-5 py-3 text-xl min-h-[56px]'}
      `}
      title={isPlaying ? 'Hentikan Audio' : 'Dengarkan Ayat'}
    >
      {isPlaying ? (
        <Square className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'} fill-current`} />
      ) : (
        <Volume2 className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'}`} />
      )}
      {showLabel && (
        <span>{isPlaying ? 'Memutar...' : 'Dengar Ayat'}</span>
      )}
    </button>
  );
};
