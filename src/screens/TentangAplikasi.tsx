import React from 'react';
import { TombolBesar } from '../components/TombolBesar';
import {
  BookOpen,
  Tv,
  ShieldCheck,
  ArrowLeft,
  Layers,
} from 'lucide-react';

interface TentangAplikasiProps {
  onBackToHome: () => void;
}

export const TentangAplikasi: React.FC<TentangAplikasiProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-oasis-pattern flex flex-col p-6 md:p-12 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-4">
          <TombolBesar
            variant="ghost"
            size="normal"
            icon={<ArrowLeft className="w-6 h-6" />}
            onClick={onBackToHome}
          >
            Kembali
          </TombolBesar>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-display">
              Tentang Aplikasi & Sumber
            </h1>
            <p className="text-amber-300 text-xl font-bold">
              Petualangan Juz 'Amma • Smart TV Edition
            </p>
          </div>
        </div>

        <div className="px-5 py-2 rounded-2xl bg-stone-900/90 border border-stone-700 text-stone-300 text-base font-bold">
          Versi 1.0.0 (PWA Ready)
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 z-10 mb-12">
        {/* 1. Sumber Teks & Audio */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border-2 border-amber-500/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <BookOpen className="w-8 h-8" />
              <h2 className="text-3xl font-black font-display">Sumber Data Al-Qur'an</h2>
            </div>

            <div className="flex flex-col gap-4 text-stone-200 text-lg">
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <span className="text-amber-300 font-bold block mb-1">
                  📖 Teks Mushaf & Terjemahan
                </span>
                <p className="text-stone-300 text-base leading-relaxed">
                  Teks ayat Al-Qur'an, transliterasi Latin, dan terjemahan bahasa Indonesia mengacu
                  pada standar resmi <strong>Kementerian Agama Republik Indonesia (Kemenag RI)</strong>{' '}
                  melalui <em>Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ)</em>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <span className="text-amber-300 font-bold block mb-1">
                  🎙️ Audio Murottal & Qari
                </span>
                <p className="text-stone-300 text-base leading-relaxed">
                  Audio pelafalan tilawah per ayat dilantunkan oleh{' '}
                  <strong>Syaikh Misyari Rasyid Al-'Afasy (Mishary Rashid Alafasy)</strong> melalui
                  layanan EveryAyah CDN dan sistem caching lokal.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 text-sm text-stone-400">
            Seluruh konten ayat disajikan dengan prinsip pemuliaan adab kalamullah.
          </div>
        </div>

        {/* 2. Filosofi Desain & Pembelajaran Kelas */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border-2 border-emerald-500/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Tv className="w-8 h-8" />
              <h2 className="text-3xl font-black font-display">Desain Layar Smart TV</h2>
            </div>

            <div className="flex flex-col gap-4 text-stone-200 text-lg">
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <span className="text-emerald-300 font-bold block mb-1">
                  🎯 Sentuhan Besar (Touch Targets ≥ 160px)
                </span>
                <p className="text-stone-300 text-base leading-relaxed">
                  Dioptimalkan untuk TV layar sentuh landscape (1920×1080) di ruang kelas dengan
                  tombol berjarak aman, mencegah salah pencet saat anak berinteraksi bersama.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <span className="text-emerald-300 font-bold block mb-1">
                  👥 Mode Duel Tim (Hijau vs Biru)
                </span>
                <p className="text-stone-300 text-base leading-relaxed">
                  Mendukung interaksi multi-touch serentak dengan buzzer responsif, memungkinkan
                  suasana kelas yang aktif, kompetitif, namun tetap santun.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 text-sm text-stone-400">
            Dilengkapi penyimpanan offline Dexie (IndexedDB) & ekspor nilai CSV untuk guru.
          </div>
        </div>

        {/* 3. 7 Mini-Game Interaktif */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border-2 border-cyan-500/50 md:col-span-2">
          <div className="flex items-center gap-3 text-cyan-300 mb-6">
            <Layers className="w-8 h-8" />
            <h2 className="text-3xl font-black font-display">
              7 Varian Mini-Game Edukasi Al-Qur'an
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-stone-200">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-emerald-300 block mb-1">1. Sambung Ayat</span>
              <p className="text-sm text-stone-400">
                Menyambung ayat n ke n+1 dengan pilihan kartu ayat audio.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-amber-300 block mb-1">2. Susun Ayat (RTL)</span>
              <p className="text-sm text-stone-400">
                Menyusun kata Al-Qur'an ke slot berurutan dari kanan ke kiri.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-cyan-300 block mb-1">3. Pemburu Tajwid</span>
              <p className="text-sm text-stone-400">
                Mencari lafadz berhukum tajwid (Ghunnah, Qalqalah, Mad, dll).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-yellow-300 block mb-1">4. Tebak Surah</span>
              <p className="text-sm text-stone-400">
                Menebak surah dari arti nama, ciri ayat, atau audio pembuka.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-teal-300 block mb-1">5. Kereta Surah</span>
              <p className="text-sm text-stone-400">
                Menyusun gerbong surah di rel sesuai urutan mushaf 78–114.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-indigo-300 block mb-1">6. Kartu Kembar</span>
              <p className="text-sm text-stone-400">
                Memory match 4×3 memasangkan nama dan arti surah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-sky-300 block mb-1">7. Duel Tim (Buzzer)</span>
              <p className="text-sm text-stone-400">
                Split screen interaktif 2 tim dengan buzzer cepat tepat.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
              <span className="font-bold text-purple-300 block mb-1">8. Kisah & Kuis</span>
              <p className="text-sm text-stone-400">
                Asbabun nuzul multi-panel + 3 soal pemahaman + amalan nyata.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Nilai Adab & Kehormatan */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border-2 border-purple-500/50 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-950 border border-purple-400/50 rounded-2xl text-purple-300 shrink-0">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-display mb-1">
                Kepatuhan Adab & Pendidikan Karakter
              </h3>
              <p className="text-stone-300 text-lg leading-relaxed max-w-3xl">
                Aplikasi dirancang bebas dari konten negatif terhadap ayat suci, tidak menampilkan
                visual fisik Nabi/sahabat/malaikat, serta mengedepankan evaluasi yang mendidik dan
                menggembirakan anak-anak dalam mencintai Al-Qur'an.
              </p>
            </div>
          </div>

          <TombolBesar variant="oasis" size="large" onClick={onBackToHome}>
            Mulai Bermain
          </TombolBesar>
        </div>
      </div>
    </div>
  );
};
