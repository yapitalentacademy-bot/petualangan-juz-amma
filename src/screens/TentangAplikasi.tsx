import React from 'react';
import { TombolBesar } from '../components/TombolBesar';
import {
  BookOpen,
  Tv,
  ShieldCheck,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { OrnamenSudut } from '../components/ornaments/OrnamenSudut';
import { TeksturMarmer } from '../components/ornaments/TeksturMarmer';

interface TentangAplikasiProps {
  onBackToHome: () => void;
}

export const TentangAplikasi: React.FC<TentangAplikasiProps> = ({ onBackToHome }) => {
  return (
    <TeksturMarmer className="min-h-screen flex flex-col p-6 md:p-12 relative overflow-hidden text-[#2B2A26] font-['Montserrat']">
      <OrnamenSudut variant="semua" />

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8 z-10">
        <div className="flex items-center gap-4">
          <TombolBesar
            variant="ghost"
            size="small"
            icon={<ArrowLeft className="w-5 h-5 text-[#0E4D34]" />}
            onClick={onBackToHome}
          >
            Kembali
          </TombolBesar>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-[#0E4D34] font-['Marcellus']">
              Tentang Aplikasi & Sumber
            </h1>
            <p className="text-[#C9A04A] text-lg md:text-xl font-bold font-['Montserrat']">
              Petualangan Juz 'Amma • Smart TV Edition
            </p>
          </div>
        </div>

        <div className="px-5 py-2 rounded-full bg-[#FFFDF6] border-2 border-[#0E4D34]/30 text-[#0E4D34] text-sm font-bold shadow-sm">
          Versi 1.0.0 (PWA Ready)
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 z-10 mb-12">
        {/* 1. Sumber Teks & Audio */}
        <div className="bg-[#FFFDF6] p-8 md:p-10 rounded-[28px] border-2 border-[#C9A04A] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-[#0E4D34] mb-4">
              <BookOpen className="w-8 h-8 text-[#C9A04A]" />
              <h2 className="text-2xl md:text-3xl font-bold font-['Marcellus']">Sumber Data Al-Qur'an</h2>
            </div>

            <div className="flex flex-col gap-4 text-[#2B2A26] text-base">
              <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
                <span className="text-[#0E4D34] font-bold block mb-1">
                  📖 Teks Mushaf & Terjemahan
                </span>
                <p className="text-[#2B2A26]/80 text-sm leading-relaxed font-medium">
                  Teks ayat Al-Qur'an, transliterasi Latin, dan terjemahan bahasa Indonesia mengacu
                  pada standar resmi <strong>Kementerian Agama Republik Indonesia (Kemenag RI)</strong>{' '}
                  melalui <em>Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ)</em>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
                <span className="text-[#0E4D34] font-bold block mb-1">
                  🎙️ Audio Murottal & Qari
                </span>
                <p className="text-[#2B2A26]/80 text-sm leading-relaxed font-medium">
                  Audio pelafalan tilawah per ayat dilantunkan oleh{' '}
                  <strong>Syaikh Misyari Rasyid Al-'Afasy (Mishary Rashid Alafasy)</strong> melalui
                  layanan EveryAyah CDN dan sistem caching lokal.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E9E1D0] text-xs font-semibold text-[#2B2A26]/60">
            Seluruh konten ayat disajikan dengan prinsip pemuliaan adab kalamullah.
          </div>
        </div>

        {/* 2. Filosofi Desain & Pembelajaran Kelas */}
        <div className="bg-[#FFFDF6] p-8 md:p-10 rounded-[28px] border-2 border-[#0E4D34] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-[#0E4D34] mb-4">
              <Tv className="w-8 h-8 text-[#0E4D34]" />
              <h2 className="text-2xl md:text-3xl font-bold font-['Marcellus']">Desain Layar Smart TV</h2>
            </div>

            <div className="flex flex-col gap-4 text-[#2B2A26] text-base">
              <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
                <span className="text-[#0E4D34] font-bold block mb-1">
                  🎯 Sentuhan Besar (Touch Targets ≥ 160px)
                </span>
                <p className="text-[#2B2A26]/80 text-sm leading-relaxed font-medium">
                  Dioptimalkan untuk TV layar sentuh landscape (1920×1080) di ruang kelas dengan
                  tombol berjarak aman, mencegah salah pencet saat anak berinteraksi bersama.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
                <span className="text-[#0E4D34] font-bold block mb-1">
                  👥 Mode Duel Tim (Zamrud vs Emas)
                </span>
                <p className="text-[#2B2A26]/80 text-sm leading-relaxed font-medium">
                  Mendukung interaksi multi-touch serentak dengan buzzer responsif, memungkinkan
                  suasana kelas yang aktif, kompetitif, namun tetap santun.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E9E1D0] text-xs font-semibold text-[#2B2A26]/60">
            Dilengkapi penyimpanan offline Dexie (IndexedDB) & ekspor nilai CSV untuk guru.
          </div>
        </div>

        {/* 3. 7 Mini-Game Interaktif */}
        <div className="bg-[#FFFDF6] p-8 md:p-10 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-lg md:col-span-2">
          <div className="flex items-center gap-3 text-[#0E4D34] mb-6">
            <Layers className="w-8 h-8 text-[#C9A04A]" />
            <h2 className="text-2xl md:text-3xl font-bold font-['Marcellus']">
              7 Varian Mini-Game Edukasi Al-Qur'an
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-[#2B2A26]">
            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">1. Sambung Ayat</span>
              <p className="text-xs text-[#2B2A26]/75">
                Menyambung ayat n ke n+1 dengan pilihan kartu ayat audio.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">2. Susun Ayat (RTL)</span>
              <p className="text-xs text-[#2B2A26]/75">
                Menyusun kata Al-Qur'an ke slot berurutan dari kanan ke kiri.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">3. Pemburu Tajwid</span>
              <p className="text-xs text-[#2B2A26]/75">
                Mencari lafadz berhukum tajwid (Ghunnah, Qalqalah, Mad).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">4. Tebak Surah</span>
              <p className="text-xs text-[#2B2A26]/75">
                Menebak surah dari arti nama, ciri ayat, atau audio pembuka.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">5. Kereta Surah</span>
              <p className="text-xs text-[#2B2A26]/75">
                Menyusun gerbong surah di rel sesuai urutan mushaf 78–114.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">6. Kartu Kembar</span>
              <p className="text-xs text-[#2B2A26]/75">
                Memory match 4×3 memasangkan nama dan arti surah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">7. Duel Tim (Buzzer)</span>
              <p className="text-xs text-[#2B2A26]/75">
                Split screen interaktif 2 tim dengan buzzer cepat tepat.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#D9CBB0]">
              <span className="font-bold text-[#0E4D34] block mb-1 text-sm">8. Kisah & Kuis</span>
              <p className="text-xs text-[#2B2A26]/75">
                Asbabun nuzul multi-panel + 3 soal kuis pemahaman.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Nilai Adab & Kehormatan */}
        <div className="bg-[#FFFDF6] p-8 md:p-10 rounded-[28px] border-2 border-[#0E4D34] md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#F8F4EA] border border-[#0E4D34]/30 rounded-2xl text-[#0E4D34] shrink-0">
              <ShieldCheck className="w-9 h-9 text-[#1B6B47]" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0E4D34] font-['Marcellus'] mb-1">
                Kepatuhan Adab & Pendidikan Karakter
              </h3>
              <p className="text-[#2B2A26]/80 text-sm md:text-base leading-relaxed max-w-3xl font-medium">
                Aplikasi dirancang bebas dari konten negatif terhadap ayat suci, tidak menampilkan
                visual fisik makhluk bernyawa realistis, serta mengedepankan evaluasi yang mendidik dan
                menggembirakan anak-anak dalam mencintai Al-Qur'an.
              </p>
            </div>
          </div>

          <TombolBesar variant="emas" size="normal" onClick={onBackToHome}>
            Mulai Bermain
          </TombolBesar>
        </div>
      </div>
    </TeksturMarmer>
  );
};
