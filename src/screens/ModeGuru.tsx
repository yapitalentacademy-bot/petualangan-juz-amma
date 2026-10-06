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
import { sfx, quranAudio, LIST_QARI } from '../lib/audioPlayer';

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
  const [activeQariId, setActiveQariId] = useState(quranAudio.getQari());
  const [activeSpeed, setActiveSpeed] = useState(quranAudio.getPlaybackRate());

  React.useEffect(() => {
    const unsub = quranAudio.subscribe(() => {
      setActiveQariId(quranAudio.getQari());
      setActiveSpeed(quranAudio.getPlaybackRate());
    });
    return () => unsub();
  }, []);
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
    <div className="min-h-screen bg-[#F8F4EA] text-[#2B2A26] flex flex-col font-['Montserrat']">
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-[#FFFDF6] p-3 rounded-[24px] border-2 border-[#0E4D34]/30 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('pengaturan');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm md:text-base cursor-pointer transition-all ${
                activeTab === 'pengaturan'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] shadow-md'
                  : 'bg-[#F8F4EA] text-[#2B2A26] hover:bg-[#E9E1D0]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#C9A04A]" />
              <span>Pengaturan & Kelas</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('pos_fokus');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm md:text-base cursor-pointer transition-all ${
                activeTab === 'pos_fokus'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] shadow-md'
                  : 'bg-[#F8F4EA] text-[#2B2A26] hover:bg-[#E9E1D0]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#C9A04A]" />
              <span>Pos & Surah Fokus</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('rekap_csv');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm md:text-base cursor-pointer transition-all ${
                activeTab === 'rekap_csv'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] shadow-md'
                  : 'bg-[#F8F4EA] text-[#2B2A26] hover:bg-[#E9E1D0]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#C9A04A]" />
              <span>Rekap Nilai & CSV</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('lencana');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm md:text-base cursor-pointer transition-all ${
                activeTab === 'lencana'
                  ? 'bg-[#0E4D34] text-[#FFFDF6] shadow-md'
                  : 'bg-[#F8F4EA] text-[#2B2A26] hover:bg-[#E9E1D0]'
              }`}
            >
              <Award className="w-4 h-4 text-[#C9A04A]" />
              <span>Lencana ({progress.lencana.length})</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] rounded-full font-bold text-sm shadow-sm cursor-pointer hover:brightness-105 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV Nilai</span>
          </button>
        </div>

        {/* Tab 1: Pengaturan & Kelas */}
        {activeTab === 'pengaturan' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Class Selection & Add */}
              <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-md flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[#0E4D34]">
                    <Shield className="w-6 h-6 text-[#C9A04A]" />
                    <h2 className="text-2xl font-bold font-['Marcellus']">Pilih Kelas Aktif</h2>
                  </div>

                  <button
                    onClick={() => setShowAddClassInput(!showAddClassInput)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F4EA] text-[#0E4D34] rounded-full text-xs font-bold border border-[#D9CBB0] cursor-pointer hover:bg-[#E9E1D0]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Kelas</span>
                  </button>
                </div>

                {showAddClassInput && (
                  <div className="flex gap-2 p-3 bg-[#F8F4EA] rounded-2xl border border-[#D9CBB0]">
                    <input
                      type="text"
                      placeholder="Misal: 5C"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="flex-1 bg-[#FFFDF6] px-4 py-2 rounded-xl text-[#2B2A26] font-bold uppercase focus:outline-none border border-[#0E4D34]"
                    />
                    <TombolBesar variant="zamrud" size="small" onClick={handleAddClass}>
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
                      className={`py-3 rounded-2xl text-lg font-black border-2 cursor-pointer transition-all ${
                        progress.namaKelas === k
                          ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] shadow-md'
                          : 'bg-[#F8F4EA] text-[#2B2A26] border-[#D9CBB0] hover:border-[#0E4D34]'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Level Selection */}
                <div className="pt-4 border-t-2 border-[#E9E1D0]">
                  <span className="text-base font-bold text-[#0E4D34] block mb-3 font-['Montserrat']">
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
                        className={`py-3 rounded-2xl text-base font-black border-2 cursor-pointer transition-all ${
                          progress.level === lvl
                            ? 'bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border-[#9C7A2E]/40 shadow-md'
                            : 'bg-[#F8F4EA] text-[#2B2A26] border-[#D9CBB0] hover:border-[#C9A04A]'
                        }`}
                      >
                        Kelas {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display & Sound Toggles */}
              <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-md flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[#0E4D34]">
                  <Settings className="w-6 h-6 text-[#0E4D34]" />
                  <h2 className="text-2xl font-bold font-['Marcellus']">Tampilan & Audio Murottal</h2>
                </div>

                {/* Qari Selection Card */}
                <div className="p-4 bg-[#F8F4EA] rounded-2xl border border-[#D9CBB0]">
                  <span className="text-xs font-bold text-[#0E4D34] uppercase tracking-wider block mb-2 font-['Montserrat']">
                    🎙️ Pilihan Qari Utama Kelas:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LIST_QARI.map((q) => {
                      const isSelected = activeQariId === q.id;
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            sfx.playClick();
                            quranAudio.setQari(q.id);
                          }}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#0E4D34] text-[#FFFDF6] border-[#0E4D34] font-bold shadow-sm'
                              : 'bg-[#FFFDF6] text-[#2B2A26] border-[#D9CBB0] hover:border-[#0E4D34]'
                          }`}
                        >
                          <div>
                            <span className="text-[11px] block font-medium opacity-80">{q.gelar}</span>
                            <span className="text-xs font-black font-['Marcellus']">{q.nama}</span>
                          </div>
                          {isSelected && <span className="text-xs font-black text-[#F3D88A]">AKTIF ✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D9CBB0]">
                    <span className="text-xs font-bold text-[#0E4D34]">Kecepatan Tilawah:</span>
                    <div className="flex items-center gap-1.5">
                      {[0.75, 1.0, 1.25].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            sfx.playClick();
                            quranAudio.setPlaybackRate(speed);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                            activeSpeed === speed
                              ? 'bg-[#0E4D34] text-[#FFFDF6]'
                              : 'bg-[#FFFDF6] text-[#0E4D34] border border-[#D9CBB0]'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Switch: Teks Latin */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('teksLatin');
                  }}
                  className="flex items-center justify-between p-4 bg-[#F8F4EA] rounded-2xl border border-[#D9CBB0] cursor-pointer hover:border-[#0E4D34] transition-all"
                >
                  <div className="flex items-center gap-3 text-[#2B2A26]">
                    <Type className="w-5 h-5 text-[#C9A04A]" />
                    <span className="text-base font-bold">Teks Latin (Transliterasi)</span>
                  </div>
                  <span
                    className={`px-3.5 py-1 rounded-full font-black text-xs ${
                      progress.pengaturan.teksLatin
                        ? 'bg-[#0E4D34] text-[#FFFDF6]'
                        : 'bg-[#D9CBB0] text-[#2B2A26]/60'
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
                  className="flex items-center justify-between p-4 bg-[#F8F4EA] rounded-2xl border border-[#D9CBB0] cursor-pointer hover:border-[#0E4D34] transition-all"
                >
                  <div className="flex items-center gap-3 text-[#2B2A26]">
                    <Award className="w-5 h-5 text-[#0E4D34]" />
                    <span className="text-base font-bold">Terjemahan Kemenag</span>
                  </div>
                  <span
                    className={`px-3.5 py-1 rounded-full font-black text-xs ${
                      progress.pengaturan.terjemah
                        ? 'bg-[#0E4D34] text-[#FFFDF6]'
                        : 'bg-[#D9CBB0] text-[#2B2A26]/60'
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
                  className="flex items-center justify-between p-4 bg-[#F8F4EA] rounded-2xl border border-[#D9CBB0] cursor-pointer hover:border-[#0E4D34] transition-all"
                >
                  <div className="flex items-center gap-3 text-[#2B2A26]">
                    <Volume2 className="w-5 h-5 text-[#1B6B47]" />
                    <span className="text-base font-bold">Efek Suara Sentuhan</span>
                  </div>
                  <span
                    className={`px-3.5 py-1 rounded-full font-black text-xs ${
                      progress.pengaturan.suaraEfek
                        ? 'bg-[#0E4D34] text-[#FFFDF6]'
                        : 'bg-[#D9CBB0] text-[#2B2A26]/60'
                    }`}
                  >
                    {progress.pengaturan.suaraEfek ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                {/* Switch: Maskot Nur Tanpa Wajah */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('nurTanpaWajah');
                  }}
                  className="flex items-center justify-between p-4 bg-[#F8F4EA] rounded-2xl border border-[#D9CBB0] cursor-pointer hover:border-[#C9A04A] transition-all"
                >
                  <div className="flex items-center gap-3 text-[#2B2A26]">
                    <LenteraFanus size={22} menyala={true} />
                    <div className="text-left">
                      <span className="text-base font-bold block">Tampilkan Nur Tanpa Wajah</span>
                      <span className="text-xs text-[#2B2A26]/70 font-medium block">Untuk sekolah yang menghindari gambar makhluk bernyawa</span>
                    </div>
                  </div>
                  <span
                    className={`px-3.5 py-1 rounded-full font-black text-xs ${
                      progress.pengaturan.nurTanpaWajah
                        ? 'bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34]'
                        : 'bg-[#D9CBB0] text-[#2B2A26]/60'
                    }`}
                  >
                    {progress.pengaturan.nurTanpaWajah ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                {/* Switch: Sembunyikan Siluet Hewan */}
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('sembunyikanHewan');
                  }}
                  className="flex items-center justify-between p-4 bg-[#F8F4EA] rounded-2xl border border-[#D9CBB0] cursor-pointer hover:border-[#C9A04A] transition-all"
                >
                  <div className="flex items-center gap-3 text-[#2B2A26]">
                    <Sparkles className="w-5 h-5 text-[#1B6B47]" />
                    <div className="text-left">
                      <span className="text-base font-bold block">Sembunyikan Siluet Hewan</span>
                      <span className="text-xs text-[#2B2A26]/70 font-medium block">Hanya tampilkan lanskap alam murni tanpa siluet fauna</span>
                    </div>
                  </div>
                  <span
                    className={`px-3.5 py-1 rounded-full font-black text-xs ${
                      progress.pengaturan.sembunyikanHewan
                        ? 'bg-[#0E4D34] text-[#FFFDF6]'
                        : 'bg-[#D9CBB0] text-[#2B2A26]/60'
                    }`}
                  >
                    {progress.pengaturan.sembunyikanHewan ? 'TERSEMBUNYI' : 'TAMPIL'}
                  </span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 md:p-8 rounded-[28px] bg-[#C0603A]/10 border-2 border-[#C0603A]/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-[#C0603A] font-['Marcellus']">Atur Ulang Progres Kelas</h3>
                <p className="text-sm text-[#2B2A26]/80 mt-1 font-medium">
                  Menghapus bintang dan skor lokal untuk kelas {progress.namaKelas}.
                </p>
              </div>

              <TombolBesar
                variant="terakota"
                size="small"
                icon={<RotateCcw className="w-5 h-5" />}
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
            <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-md">
              <div className="flex items-center gap-3 text-[#0E4D34] mb-2">
                <Sparkles className="w-6 h-6 text-[#C9A04A]" />
                <h3 className="text-2xl font-bold font-['Marcellus']">
                  Surah Fokus Minggu Ini
                </h3>
              </div>
              <p className="text-[#2B2A26]/80 text-sm mb-6 font-medium">
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
                        ? 'bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border-[#9C7A2E]/50 shadow-md'
                        : 'bg-[#F8F4EA] text-[#2B2A26] border-[#D9CBB0] hover:border-[#0E4D34]'
                    }`}
                  >
                    <span className="block text-xs text-[#2B2A26]/70">Pos {s.urutanPos}</span>
                    <span className="block text-base font-black font-['Marcellus']">{s.namaLatin}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Unlock Table */}
            <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#0E4D34] font-['Marcellus'] mb-1">
                    Buka / Kunci Pos Secara Manual (37 Pos)
                  </h3>
                  <p className="text-[#2B2A26]/80 text-sm font-medium">
                    Sentuh gembok pada surah mana pun untuk membuka atau menguncinya bagi kelas ini.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onUnlockAllSurahs && (
                    <button
                      onClick={() => {
                        sfx.playCorrect();
                        onUnlockAllSurahs();
                      }}
                      className="px-4 py-2 bg-[#0E4D34] hover:bg-[#155E40] text-[#FFFDF6] font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Buka Semua (37 Pos)</span>
                    </button>
                  )}

                  {onUnlockLevelSurahs && (
                    <button
                      onClick={() => {
                        sfx.playClick();
                        onUnlockLevelSurahs(progress.level);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer transition-all border border-[#9C7A2E]/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
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
                          ? 'bg-[#F8F4EA] border-[#0E4D34] text-[#0E4D34] shadow-sm'
                          : 'bg-[#E9E1D0]/40 border-[#D9CBB0] text-[#2B2A26]/50'
                      }`}
                    >
                      <div>
                        <span className="text-xs text-[#2B2A26]/60 block">Pos {s.urutanPos}</span>
                        <span className="text-sm font-black font-['Marcellus']">{s.namaLatin}</span>
                      </div>
                      {isUnlocked ? (
                        <Unlock className="w-4 h-4 text-[#0E4D34]" />
                      ) : (
                        <Lock className="w-4 h-4 text-[#C0603A]/60" />
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
          <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-md flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-[#E9E1D0] pb-6">
              <div>
                <h3 className="text-3xl font-bold text-[#0E4D34] font-['Marcellus']">
                  Rekap Capaian Kelas {progress.namaKelas}
                </h3>
                <p className="text-[#2B2A26]/80 text-sm mt-1 font-medium">
                  {completedCount} dari 37 Pos Selesai • Total {totalStars} Bintang Terkumpul
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0E4D34] hover:bg-[#155E40] text-[#FFFDF6] rounded-full font-bold text-sm shadow-sm cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File CSV (.csv)</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#E9E1D0] text-[#2B2A26]/70 text-sm font-black font-['Montserrat']">
                    <th className="py-3 px-4">Pos</th>
                    <th className="py-3 px-4">Nama Surah</th>
                    <th className="py-3 px-4">Arti</th>
                    <th className="py-3 px-4 text-center">Bintang</th>
                    <th className="py-3 px-4 text-center">Skor Tertinggi</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D0] text-[#2B2A26] text-sm font-medium">
                  {surahListData.map((s) => {
                    const detail = progress.posSelesai[s.id];
                    const isUnlocked = progress.posTerbuka.includes(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-[#F8F4EA]">
                        <td className="py-3 px-4 font-bold text-[#0E4D34]">{s.urutanPos}</td>
                        <td className="py-3 px-4 font-black font-['Marcellus'] text-base">{s.namaLatin}</td>
                        <td className="py-3 px-4 text-[#2B2A26]/80">{s.arti}</td>
                        <td className="py-3 px-4 text-center">
                          {detail ? (
                            <span className="text-[#C9A04A] font-black">{'★'.repeat(detail.stars)}</span>
                          ) : (
                            <span className="text-[#D9CBB0]">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {detail ? detail.skorTertinggi : 0}
                        </td>
                        <td className="py-3 px-4">
                          {detail && detail.stars >= 1 ? (
                            <span className="px-3 py-1 rounded-full bg-[#0E4D34]/15 text-[#0E4D34] border border-[#0E4D34] text-xs font-bold">
                              Lulus ({detail.stars}★)
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-3 py-1 rounded-full bg-[#C9A04A]/20 text-[#0E4D34] border border-[#C9A04A] text-xs font-bold">
                              Terbuka
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-[#E9E1D0] text-[#2B2A26]/60 text-xs font-bold">
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
          <div className="bg-[#FFFDF6] p-6 md:p-8 rounded-[28px] border-2 border-[#0E4D34]/30 shadow-md flex flex-col gap-6">
            <h3 className="text-3xl font-bold text-[#0E4D34] font-['Marcellus']">
              Lencana & Prestasi Kelas {progress.namaKelas}
            </h3>
            <p className="text-[#2B2A26]/80 text-sm mb-2 font-medium">
              Lencana otomatis terbuka ketika kelas mencapai target hafalan dan mini-game.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_BADGES.map((b) => {
                const isEarned = progress.lencana.includes(b.name);
                return (
                  <div
                    key={b.id}
                    className={`p-6 rounded-[24px] border-2 flex items-start gap-4 transition-all ${
                      isEarned
                        ? 'bg-[#F8F4EA] border-[#C9A04A] shadow-sm'
                        : 'bg-[#E9E1D0]/30 border-[#D9CBB0] opacity-50 grayscale'
                    }`}
                  >
                    <BintangDelapan size={40} fill={isEarned ? '#C9A04A' : '#D9CBB0'} />
                    <div>
                      <h4 className="text-lg font-bold text-[#0E4D34] font-['Marcellus'] mb-1">{b.name}</h4>
                      <p className="text-xs text-[#2B2A26]/80 leading-relaxed font-medium">{b.description}</p>
                      {isEarned && (
                        <span className="inline-block mt-3 px-3 py-0.5 rounded-full bg-[#0E4D34] text-[#FFFDF6] font-black text-[11px]">
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
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-[#FFFDF6] p-8 rounded-[28px] border-4 border-[#C0603A] max-w-md w-full text-center shadow-2xl">
              <h4 className="text-2xl font-bold font-['Marcellus'] text-[#C0603A] mb-3">Konfirmasi Reset?</h4>
              <p className="text-sm font-medium text-[#2B2A26]/80 mb-6 font-['Montserrat']">
                Yakin ingin mereset seluruh nilai dan progres kelas {progress.namaKelas}? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4">
                <TombolBesar variant="ghost" size="small" className="flex-1" onClick={() => setShowConfirmReset(false)}>
                  Batal
                </TombolBesar>
                <TombolBesar
                  variant="terakota"
                  size="small"
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
