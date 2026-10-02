import React, { useState } from 'react';
import { HeaderNav } from '../components/HeaderNav';
import { TombolBesar } from '../components/TombolBesar';
import { KelasLevel, KelasProgress } from '../types/surah';
import { generateClassRecapCSV, downloadCSV } from '../lib/csvExport';
import { ALL_BADGES } from '../lib/badgeSystem';
import surahListData from '../data/surah-list.json';
import {
  Shield,
  Settings,
  Volume2,
  Type,
  RotateCcw,
  Award,
  Download,
  Lock,
  Unlock,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';
import { sfx } from '../lib/audioPlayer';

import { BintangDelapan } from '../components/ornaments/BintangDelapan';
import { LenteraFanus } from '../components/ornaments/LenteraFanus';

interface ModeGuruProps {
  progress: KelasProgress;
  focusSurahId: number;
  onSetFocusSurahId: (id: number) => void;
  onBackToHome: () => void;
  onSetClass: (kelas: string) => void;
  onSetLevel: (level: KelasLevel) => void;
  onToggleSetting: (key: keyof KelasProgress['pengaturan']) => void;
  onManualToggleUnlock: (surahId: number) => void;
  onUnlockAllSurahs?: () => void;
  onUnlockLevelSurahs?: (level: KelasLevel) => void;
  onResetProgress: () => void;
}

type TabType = 'pengaturan' | 'pos_fokus' | 'rekap_csv' | 'lencana';

export const ModeGuru: React.FC<ModeGuruProps> = ({
  progress,
  focusSurahId,
  onSetFocusSurahId,
  onBackToHome,
  onSetClass,
  onSetLevel,
  onToggleSetting,
  onManualToggleUnlock,
  onUnlockAllSurahs,
  onUnlockLevelSurahs,
  onResetProgress,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pengaturan');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [showAddClassInput, setShowAddClassInput] = useState(false);

  const availableClasses = ['4A', '4B', '5A', '5B', '6A', '6B'];

  const handleExportCSV = () => {
    sfx.playClick();
    const csvContent = generateClassRecapCSV(progress);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Rekap_Nilai_Juz_Amma_Kelas_${progress.namaKelas}_${dateStr}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleAddClass = () => {
    if (newClassName.trim().length > 0) {
      sfx.playCorrect();
      onSetClass(newClassName.trim().toUpperCase());
      setNewClassName('');
      setShowAddClassInput(false);
    }
  };

  const completedCount = Object.values(progress.posSelesai).filter((p) => p.stars >= 1).length;
  const totalStars = Object.values(progress.posSelesai).reduce((acc, curr) => acc + curr.stars, 0);

  return (
    <div className="min-h-screen bg-[var(--pasir-terang)] text-[var(--malam)] flex flex-col font-['Nunito']">
      <HeaderNav
        title="Mode Guru & Manajemen Kelas"
        subtitle={`Kelas ${progress.namaKelas} (Lv.${progress.level}) • Rekap, Kurikulum & Pengaturan`}
        showBackToMap={false}
        showBackToHome={true}
        onBackToHome={onBackToHome}
        classNameLabel={progress.namaKelas}
        levelLabel={progress.level}
        soundEnabled={progress.pengaturan.suaraEfek}
        onToggleSound={() => onToggleSetting('suaraEfek')}
      />

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full pb-20">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-[var(--gading)] p-3 rounded-2xl border-2 border-[var(--emas)]/40 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('pengaturan');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base cursor-pointer transition-all ${
                activeTab === 'pengaturan'
                  ? 'bg-[var(--zamrud)] text-[var(--gading)] shadow-md'
                  : 'bg-[var(--pasir)]/40 text-[var(--malam)] hover:bg-[var(--pasir)]'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Pengaturan & Kelas</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('pos_fokus');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base cursor-pointer transition-all ${
                activeTab === 'pos_fokus'
                  ? 'bg-[var(--zamrud)] text-[var(--gading)] shadow-md'
                  : 'bg-[var(--pasir)]/40 text-[var(--malam)] hover:bg-[var(--pasir)]'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span>Pos & Surah Fokus</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('rekap_csv');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base cursor-pointer transition-all ${
                activeTab === 'rekap_csv'
                  ? 'bg-[var(--zamrud)] text-[var(--gading)] shadow-md'
                  : 'bg-[var(--pasir)]/40 text-[var(--malam)] hover:bg-[var(--pasir)]'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Rekap Nilai & CSV</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('lencana');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base cursor-pointer transition-all ${
                activeTab === 'lencana'
                  ? 'bg-[var(--zamrud)] text-[var(--gading)] shadow-md'
                  : 'bg-[var(--pasir)]/40 text-[var(--malam)] hover:bg-[var(--pasir)]'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Lencana ({progress.lencana.length})</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--zamrud)] hover:bg-[var(--zamrud-tua)] text-[var(--gading)] rounded-full font-bold text-base shadow-sm cursor-pointer transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Unduh CSV Nilai</span>
          </button>
        </div>

        {/* Tab 1: Pengaturan & Kelas */}
        {activeTab === 'pengaturan' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Class Selection & Add */}
              <div className="bg-[var(--gading)] p-6 md:p-8 rounded-[28px] border-2 border-[var(--emas)]/50 shadow-md flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[var(--zamrud-tua)]">
                    <Shield className="w-7 h-7 text-[var(--emas)]" />
                    <h2 className="text-2xl font-black font-['Baloo_2']">Pilih Kelas Aktif</h2>
                  </div>

                  <button
                    onClick={() => setShowAddClassInput(!showAddClassInput)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--pasir)]/60 text-[var(--zamrud-tua)] rounded-full text-sm font-bold border border-[var(--emas)] cursor-pointer hover:bg-[var(--pasir)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kelas</span>
                  </button>
                </div>

                {showAddClassInput && (
                  <div className="flex gap-2 p-3 bg-[var(--pasir-terang)] rounded-2xl border border-[var(--emas)]/60">
                    <input
                      type="text"
                      placeholder="Misal: 5C"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="flex-1 bg-[var(--gading)] px-4 py-2 rounded-xl text-[var(--malam)] font-bold uppercase focus:outline-none border border-[var(--emas)]"
                    />
                    <TombolBesar variant="zamrud" size="normal" onClick={handleAddClass}>
                      Simpan
                    </TombolBesar>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {availableClasses.map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        sfx.playClick();
                        onSetClass(k);
                      }}
                      className={`py-3.5 rounded-2xl text-xl font-black border-2 cursor-pointer transition-all ${
                        progress.namaKelas === k
                          ? 'bg-[var(--zamrud)] text-[var(--gading)] border-[var(--zamrud-tua)] shadow-md'
                          : 'bg-[var(--pasir-terang)] text-[var(--malam)] border-[var(--pasir)] hover:border-[var(--zamrud)]'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Level Selection */}
                <div className="pt-4 border-t-2 border-[var(--pasir)]">
                  <span className="text-lg font-black text-[var(--zamrud-tua)] block mb-3">
                    Level Kurikulum
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {([4, 5, 6] as KelasLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          sfx.playClick();
                          onSetLevel(lvl);
                        }}
                        className={`py-3.5 rounded-2xl text-xl font-black border-2 cursor-pointer transition-all ${
                          progress.level === lvl
                            ? 'bg-[var(--emas)] text-[var(--malam)] border-[var(--emas)] shadow-md'
                            : 'bg-[var(--pasir-terang)] text-[var(--malam)] border-[var(--pasir)] hover:border-[var(--emas)]'
                        }`}
                      >
                        Kelas {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display & Sound Toggles */}
              <div className="bg-[var(--gading)] p-6 md:p-8 rounded-[28px] border-2 border-[var(--emas)]/50 shadow-md flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[var(--zamrud-tua)]">
                  <Settings className="w-7 h-7 text-[var(--zamrud)]" />
                  <h2 className="text-2xl font-black font-['Baloo_2']">Tampilan & Audio</h2>
                </div>

                {/* Switch: Teks Latin */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('teksLatin');
                  }}
                  className="flex items-center justify-between p-4 bg-[var(--pasir-terang)] rounded-2xl border border-[var(--pasir)] cursor-pointer hover:border-[var(--zamrud)] transition-all"
                >
                  <div className="flex items-center gap-3 text-[var(--malam)]">
                    <Type className="w-6 h-6 text-[var(--emas)]" />
                    <span className="text-lg font-bold">Teks Latin (Transliterasi)</span>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full font-black text-xs ${
                      progress.pengaturan.teksLatin
                        ? 'bg-[var(--zamrud)] text-[var(--gading)]'
                        : 'bg-[var(--pasir)] text-[var(--malam)]/60'
                    }`}
                  >
                    {progress.pengaturan.teksLatin ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                {/* Switch: Terjemahan */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('terjemah');
                  }}
                  className="flex items-center justify-between p-4 bg-[var(--pasir-terang)] rounded-2xl border border-[var(--pasir)] cursor-pointer hover:border-[var(--zamrud)] transition-all"
                >
                  <div className="flex items-center gap-3 text-[var(--malam)]">
                    <Award className="w-6 h-6 text-[var(--zamrud)]" />
                    <span className="text-lg font-bold">Terjemahan Kemenag</span>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full font-black text-xs ${
                      progress.pengaturan.terjemah
                        ? 'bg-[var(--zamrud)] text-[var(--gading)]'
                        : 'bg-[var(--pasir)] text-[var(--malam)]/60'
                    }`}
                  >
                    {progress.pengaturan.terjemah ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                {/* Switch: Suara Efek */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('suaraEfek');
                  }}
                  className="flex items-center justify-between p-4 bg-[var(--pasir-terang)] rounded-2xl border border-[var(--pasir)] cursor-pointer hover:border-[var(--zamrud)] transition-all"
                >
                  <div className="flex items-center gap-3 text-[var(--malam)]">
                    <Volume2 className="w-6 h-6 text-[var(--biru-laut)]" />
                    <span className="text-lg font-bold">Efek Suara Sentuhan</span>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full font-black text-xs ${
                      progress.pengaturan.suaraEfek
                        ? 'bg-[var(--zamrud)] text-[var(--gading)]'
                        : 'bg-[var(--pasir)] text-[var(--malam)]/60'
                    }`}
                  >
                    {progress.pengaturan.suaraEfek ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                {/* Switch: Maskot Nur Tanpa Wajah (DESIGN.md Halaman 4) */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('nurTanpaWajah');
                  }}
                  className="flex items-center justify-between p-4 bg-[var(--pasir-terang)] rounded-2xl border border-[var(--pasir)] cursor-pointer hover:border-[var(--emas)] transition-all"
                >
                  <div className="flex items-center gap-3 text-[var(--malam)]">
                    <LenteraFanus size={24} menyala={true} />
                    <div className="text-left">
                      <span className="text-lg font-bold block">Tampilkan Nur Tanpa Wajah</span>
                      <span className="text-xs text-[var(--malam)]/70 font-semibold block">Untuk sekolah yang menghindari gambar makhluk bernyawa</span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full font-black text-xs ${
                      progress.pengaturan.nurTanpaWajah
                        ? 'bg-[var(--emas)] text-[var(--malam)]'
                        : 'bg-[var(--pasir)] text-[var(--malam)]/60'
                    }`}
                  >
                    {progress.pengaturan.nurTanpaWajah ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                {/* Switch: Sembunyikan Siluet Hewan (DESIGN.md Bagian Pemandangan Alam) */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('sembunyikanHewan');
                  }}
                  className="flex items-center justify-between p-4 bg-[var(--pasir-terang)] rounded-2xl border border-[var(--pasir)] cursor-pointer hover:border-[var(--emas)] transition-all"
                >
                  <div className="flex items-center gap-3 text-[var(--malam)]">
                    <Sparkles className="w-6 h-6 text-[#1E6F8C]" />
                    <div className="text-left">
                      <span className="text-lg font-bold block">Sembunyikan Siluet Hewan</span>
                      <span className="text-xs text-[var(--malam)]/70 font-semibold block">Hanya tampilkan lanskap alam tanpa siluet burung/kupu-kupu</span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full font-black text-xs ${
                      progress.pengaturan.sembunyikanHewan
                        ? 'bg-[var(--zamrud)] text-[var(--gading)]'
                        : 'bg-[var(--pasir)] text-[var(--malam)]/60'
                    }`}
                  >
                    {progress.pengaturan.sembunyikanHewan ? 'TERSEMBUNYI' : 'TAMPIL'}
                  </span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 md:p-8 rounded-[28px] bg-[var(--terakota)]/10 border-2 border-[var(--terakota)]/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-[var(--terakota)] font-['Baloo_2']">Atur Ulang Progres Kelas</h3>
                <p className="text-base text-[var(--malam)]/80 mt-1 font-semibold">
                  Menghapus bintang dan skor lokal untuk kelas {progress.namaKelas}.
                </p>
              </div>

              <TombolBesar
                variant="terakota"
                size="normal"
                icon={<RotateCcw className="w-6 h-6" />}
                onClick={() => setShowConfirmReset(true)}
              >
                Reset Progres
              </TombolBesar>
            </div>
          </div>
        )}

        {/* Tab 2: Pos & Surah Fokus */}
        {activeTab === 'pos_fokus' && (
          <div className="flex flex-col gap-8">
            {/* Surah Fokus Selector */}
            <div className="bg-[var(--gading)] p-6 md:p-8 rounded-[28px] border-2 border-[var(--emas)]/50 shadow-md">
              <div className="flex items-center gap-3 text-[var(--zamrud-tua)] mb-2">
                <Sparkles className="w-7 h-7 text-[var(--emas)]" />
                <h3 className="text-2xl font-black font-['Baloo_2']">
                  Surah Fokus Minggu Ini
                </h3>
              </div>
              <p className="text-[var(--malam)]/80 text-base mb-6 font-semibold">
                Surah terpilih akan disorot dengan lencana khusus di Peta Petualangan agar siswa fokus menghafalkannya.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {surahListData.slice(0, 12).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sfx.playClick();
                      onSetFocusSurahId(s.id);
                    }}
                    className={`p-3 rounded-2xl border-2 font-bold text-center cursor-pointer transition-all ${
                      focusSurahId === s.id
                        ? 'bg-[var(--emas)] text-[var(--malam)] border-[var(--emas)] shadow-md'
                        : 'bg-[var(--pasir-terang)] text-[var(--malam)] border-[var(--pasir)] hover:border-[var(--zamrud)]'
                    }`}
                  >
                    <span className="block text-xs text-[var(--malam)]/70">Pos {s.urutanPos}</span>
                    <span className="block text-lg font-black font-['Baloo_2']">{s.namaLatin}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Unlock Table */}
            <div className="bg-[var(--gading)] p-6 md:p-8 rounded-[28px] border-2 border-[var(--emas)]/50 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-black text-[var(--zamrud-tua)] font-['Baloo_2'] mb-1">
                    Buka / Kunci Pos Secara Manual (37 Pos)
                  </h3>
                  <p className="text-[var(--malam)]/80 text-sm font-semibold">
                    Sentuh gembok pada surah mana pun untuk membuka atau menguncinya bagi kelas ini.
                  </p>
                </div>

                {/* Tombol Aksi Cepat */}
                <div className="flex flex-wrap items-center gap-2">
                  {onUnlockAllSurahs && (
                    <button
                      onClick={() => {
                        sfx.playCorrect();
                        onUnlockAllSurahs();
                      }}
                      className="px-4 py-2 bg-[#0F7A5C] hover:bg-[#128F6C] text-[#FFFDF7] font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Buka Semua (37 Pos)</span>
                    </button>
                  )}

                  {onUnlockLevelSurahs && (
                    <button
                      onClick={() => {
                        sfx.playClick();
                        onUnlockLevelSurahs(progress.level);
                      }}
                      className="px-4 py-2 bg-[#D4A23A] hover:bg-[#C2902B] text-[#14233C] font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Sesuai Kelas {progress.level}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {surahListData.map((s) => {
                  const isUnlocked = progress.posTerbuka.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        sfx.playClick();
                        onManualToggleUnlock(s.id);
                      }}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isUnlocked
                          ? 'bg-[var(--pasir-terang)] border-[var(--zamrud)] text-[var(--zamrud-tua)] shadow-sm'
                          : 'bg-[var(--pasir)]/30 border-[var(--pasir)] text-[var(--malam)]/50'
                      }`}
                    >
                      <div>
                        <span className="text-xs text-[var(--malam)]/60 block">Pos {s.urutanPos}</span>
                        <span className="text-base font-black font-['Baloo_2']">{s.namaLatin}</span>
                      </div>
                      {isUnlocked ? (
                        <Unlock className="w-5 h-5 text-[var(--zamrud)]" />
                      ) : (
                        <Lock className="w-5 h-5 text-[var(--malam)]/40" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rekap Nilai & CSV */}
        {activeTab === 'rekap_csv' && (
          <div className="bg-[var(--gading)] p-6 md:p-8 rounded-[28px] border-2 border-[var(--emas)]/50 shadow-md flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-[var(--pasir)] pb-6">
              <div>
                <h3 className="text-3xl font-black text-[var(--zamrud-tua)] font-['Baloo_2']">
                  Rekap Capaian Kelas {progress.namaKelas}
                </h3>
                <p className="text-[var(--malam)]/80 text-base mt-1 font-semibold">
                  {completedCount} dari 37 Pos Selesai • Total {totalStars} Bintang Terkumpul
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--zamrud)] hover:bg-[var(--zamrud-tua)] text-[var(--gading)] rounded-full font-bold text-base shadow-sm cursor-pointer transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Unduh File CSV (.csv)</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--pasir)] text-[var(--malam)]/70 text-base font-black">
                    <th className="py-3 px-4">Pos</th>
                    <th className="py-3 px-4">Nama Surah</th>
                    <th className="py-3 px-4">Arti</th>
                    <th className="py-3 px-4 text-center">Bintang</th>
                    <th className="py-3 px-4 text-center">Skor Tertinggi</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--pasir)] text-[var(--malam)] text-base font-semibold">
                  {surahListData.map((s) => {
                    const detail = progress.posSelesai[s.id];
                    const isUnlocked = progress.posTerbuka.includes(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-[var(--pasir-terang)]">
                        <td className="py-3 px-4 font-bold text-[var(--zamrud-tua)]">{s.urutanPos}</td>
                        <td className="py-3 px-4 font-black font-['Baloo_2']">{s.namaLatin}</td>
                        <td className="py-3 px-4 text-[var(--malam)]/80">{s.arti}</td>
                        <td className="py-3 px-4 text-center">
                          {detail ? (
                            <span className="text-[var(--emas)] font-black">{'★'.repeat(detail.stars)}</span>
                          ) : (
                            <span className="text-[var(--pasir)]">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {detail ? detail.skorTertinggi : 0}
                        </td>
                        <td className="py-3 px-4">
                          {detail && detail.stars >= 1 ? (
                            <span className="px-3 py-1 rounded-full bg-[var(--zamrud)]/15 text-[var(--zamrud-tua)] border border-[var(--zamrud)] text-xs font-bold">
                              Lulus ({detail.stars}★)
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-3 py-1 rounded-full bg-[var(--emas)]/20 text-[var(--malam)] border border-[var(--emas)] text-xs font-bold">
                              Terbuka
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-[var(--pasir)] text-[var(--malam)]/60 text-xs font-bold">
                              Terkunci
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Lencana Kelas */}
        {activeTab === 'lencana' && (
          <div className="bg-[var(--gading)] p-6 md:p-8 rounded-[28px] border-2 border-[var(--emas)]/50 shadow-md flex flex-col gap-6">
            <h3 className="text-3xl font-black text-[var(--zamrud-tua)] font-['Baloo_2']">
              Lencana & Prestasi Kelas {progress.namaKelas}
            </h3>
            <p className="text-[var(--malam)]/80 text-base mb-2 font-semibold">
              Lencana otomatis terbuka ketika kelas mencapai target hafalan dan mini-game.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_BADGES.map((b) => {
                const isEarned = progress.lencana.includes(b.name);
                return (
                  <div
                    key={b.id}
                    className={`p-6 rounded-3xl border-2 flex items-start gap-4 transition-all ${
                      isEarned
                        ? 'bg-[var(--pasir-terang)] border-[var(--emas)] shadow-sm'
                        : 'bg-[var(--pasir)]/30 border-[var(--pasir)] opacity-50 grayscale'
                    }`}
                  >
                    <BintangDelapan size={44} fill={isEarned ? '#D4A23A' : '#E8D2A6'} />
                    <div>
                      <h4 className="text-xl font-black text-[var(--zamrud-tua)] font-['Baloo_2'] mb-1">{b.name}</h4>
                      <p className="text-sm text-[var(--malam)]/80 leading-relaxed font-semibold">{b.description}</p>
                      {isEarned && (
                        <span className="inline-block mt-3 px-3 py-0.5 rounded-full bg-[var(--zamrud)] text-[var(--gading)] font-black text-xs">
                          DIRAIH ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="glass-panel p-8 rounded-3xl border-4 border-rose-500 max-w-md w-full text-center">
              <h4 className="text-3xl font-black text-rose-400 mb-3">Konfirmasi Reset?</h4>
              <p className="text-stone-300 mb-6">
                Yakin ingin mereset seluruh nilai dan progres kelas {progress.namaKelas}? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4">
                <TombolBesar variant="ghost" className="flex-1" onClick={() => setShowConfirmReset(false)}>
                  Batal
                </TombolBesar>
                <TombolBesar
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    onResetProgress();
                    setShowConfirmReset(false);
                  }}
                >
                  Ya, Reset
                </TombolBesar>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
