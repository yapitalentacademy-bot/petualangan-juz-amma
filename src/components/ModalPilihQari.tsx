import React from 'react';
import { quranAudio, LIST_QARI, sfx } from '../lib/audioPlayer';
import { TombolBesar } from './TombolBesar';
import { Volume2, X, Check, Gauge, UserCheck } from 'lucide-react';
import { BintangDelapan } from './ornaments/BintangDelapan';

interface ModalPilihQariProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalPilihQari: React.FC<ModalPilihQariProps> = ({ isOpen, onClose }) => {
  const [activeQari, setActiveQari] = React.useState(quranAudio.getQari());
  const [activeSpeed, setActiveSpeed] = React.useState(quranAudio.getPlaybackRate());
  const [isPlayingPreview, setIsPlayingPreview] = React.useState(false);

  React.useEffect(() => {
    const unsub = quranAudio.subscribe(() => {
      setActiveQari(quranAudio.getQari());
      setActiveSpeed(quranAudio.getPlaybackRate());
      setIsPlayingPreview(quranAudio.isPlaying(112, 1));
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleSelectQari = (id: string) => {
    sfx.playClick();
    quranAudio.setQari(id);
    setActiveQari(id);
  };

  const handleSelectSpeed = (speed: number) => {
    sfx.playClick();
    quranAudio.setPlaybackRate(speed);
    setActiveSpeed(speed);
  };

  const handleTestAudio = () => {
    if (isPlayingPreview) {
      quranAudio.stop();
    } else {
      // Play Surah 112 Al-Ikhlas Ayat 1 as sample
      quranAudio.playAyat(112, 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6 font-['Montserrat']">
      <div className="bg-[#FFFDF6] border-4 border-[#0E4D34] rounded-[32px] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden text-[#2B2A26] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#E9E1D0] pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0E4D34]/10 rounded-2xl border border-[#0E4D34]/30 text-[#0E4D34]">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <BintangDelapan size={16} fill="#C9A04A" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A04A]">
                  Pengaturan Audio Murottal
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-['Marcellus'] text-[#0E4D34]">
                Pilihan Qari & Kecepatan
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              quranAudio.stop();
              onClose();
            }}
            className="p-2.5 rounded-full bg-[#F8F4EA] border border-[#D9CBB0] hover:bg-[#E9E1D0] text-[#2B2A26] transition-all cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section 1: Daftar Qari */}
        <div className="mb-6">
          <span className="text-sm font-bold text-[#0E4D34] uppercase tracking-wider block mb-3 font-['Montserrat']">
            🎙️ Pilih Syaikh / Qari Tilawah:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {LIST_QARI.map((q) => {
              const isSelected = activeQari === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQari(q.id)}
                  className={`p-4 rounded-[22px] border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-md scale-[1.02]'
                      : 'bg-[#F8F4EA] text-[#2B2A26] border-[#D9CBB0] hover:border-[#0E4D34]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`text-[11px] font-bold block ${isSelected ? 'text-[#F3D88A]' : 'text-[#C9A04A]'}`}>
                        {q.gelar}
                      </span>
                      <h4 className="text-base font-black font-['Marcellus'] leading-tight">
                        {q.nama}
                      </h4>
                    </div>
                    {isSelected && (
                      <div className="p-1 bg-[#C9A04A] text-[#0E4D34] rounded-full">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className={`text-xs font-medium ${isSelected ? 'text-[#FFFDF6]/90' : 'text-[#2B2A26]/75'}`}>
                    {q.keterangan}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Kecepatan Bacaan */}
        <div className="mb-8 p-5 bg-[#F8F4EA] rounded-[24px] border border-[#D9CBB0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gauge className="w-6 h-6 text-[#0E4D34]" />
            <div>
              <span className="text-sm font-bold text-[#0E4D34] block">Kecepatan Tilawah</span>
              <span className="text-xs text-[#2B2A26]/70 font-medium">Sesuaikan tempo bacaan siswa di kelas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSelectSpeed(speed)}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer border-2 ${
                  activeSpeed === speed
                    ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-sm'
                    : 'bg-[#FFFDF6] text-[#0E4D34] border-[#D9CBB0] hover:border-[#0E4D34]'
                }`}
              >
                {speed}x {speed === 0.75 ? '(Lambat)' : speed === 1.0 ? '(Normal)' : '(Cepat)'}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Test Audio sample & Close */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#E9E1D0] pt-5">
          <button
            onClick={handleTestAudio}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border-2 cursor-pointer transition-all ${
              isPlayingPreview
                ? 'bg-[#C0603A] text-white border-[#C0603A] animate-pulse'
                : 'bg-[#F8F4EA] text-[#0E4D34] border-[#0E4D34] hover:bg-[#E9E1D0]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingPreview ? 'Hentikan Sampel' : 'Uji Suara Syaikh (Al-Ikhlas: 1)'}</span>
          </button>

          <TombolBesar
            variant="zamrud"
            size="small"
            onClick={() => {
              sfx.playClick();
              quranAudio.stop();
              onClose();
            }}
          >
            Simpan & Selesai
          </TombolBesar>
        </div>
      </div>
    </div>
  );
};
