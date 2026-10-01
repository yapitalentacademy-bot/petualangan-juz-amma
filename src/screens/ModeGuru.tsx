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

interface ModeGuruProps {
  progress: KelasProgress;
  focusSurahId: number;
  onSetFocusSurahId: (id: number) => void;
  onBackToHome: () => void;
  onSetClass: (kelas: string) => void;
  onSetLevel: (level: KelasLevel) => void;
  onToggleSetting: (key: keyof KelasProgress['pengaturan']) => void;
  onManualToggleUnlock: (surahId: number) => void;
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
    <div className="min-h-screen bg-oasis-pattern flex flex-col">
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

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full pb-20">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 glass-panel p-3 rounded-2xl border border-amber-500/40">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                sfx.playClick();
                setActiveTab('pengaturan');
              }}
              className={`touch-btn flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg cursor-pointer ${
                activeTab === 'pengaturan'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
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
              className={`touch-btn flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg cursor-pointer ${
                activeTab === 'pos_fokus'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
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
              className={`touch-btn flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg cursor-pointer ${
                activeTab === 'rekap_csv'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
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
              className={`touch-btn flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg cursor-pointer ${
                activeTab === 'lencana'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Lencana ({progress.lencana.length})</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="touch-btn flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-base shadow-md cursor-pointer"
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
              <div className="glass-panel p-8 rounded-3xl border-2 border-stone-700 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-amber-300">
                    <Shield className="w-8 h-8" />
                    <h2 className="text-2xl font-black font-display">Pilih Kelas Aktif</h2>
                  </div>

                  <button
                    onClick={() => setShowAddClassInput(!showAddClassInput)}
                    className="touch-btn flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 text-amber-300 rounded-lg text-sm font-bold border border-amber-500/50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kelas</span>
                  </button>
                </div>

                {showAddClassInput && (
                  <div className="flex gap-2 p-3 bg-stone-900 rounded-2xl border border-stone-700">
                    <input
                      type="text"
                      placeholder="Misal: 5C"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="flex-1 bg-stone-950 px-4 py-2 rounded-xl text-white font-bold uppercase focus:outline-none border border-stone-700"
                    />
                    <TombolBesar variant="oasis" size="normal" onClick={handleAddClass}>
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
                      className={`touch-btn py-4 rounded-xl text-xl font-black border-2 cursor-pointer ${
                        progress.namaKelas === k
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                          : 'bg-stone-900 text-stone-300 border-stone-700'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Level Selection */}
                <div className="pt-4 border-t border-stone-800">
                  <span className="text-xl font-bold text-emerald-300 block mb-3">
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
                        className={`touch-btn py-4 rounded-xl text-xl font-black border-2 cursor-pointer ${
                          progress.level === lvl
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                            : 'bg-stone-900 text-stone-300 border-stone-700'
                        }`}
                      >
                        Kelas {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display & Sound Toggles */}
              <div className="glass-panel p-8 rounded-3xl border-2 border-stone-700 flex flex-col gap-5">
                <div className="flex items-center gap-3 text-emerald-300">
                  <Settings className="w-8 h-8" />
                  <h2 className="text-2xl font-black font-display">Tampilan & Audio</h2>
                </div>

                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('teksLatin');
                  }}
                  className="touch-btn flex items-center justify-between p-4 bg-stone-900 rounded-2xl border border-stone-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-stone-200">
                    <Type className="w-6 h-6 text-amber-400" />
                    <span className="text-xl font-bold">Teks Latin (Transliterasi)</span>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-xl font-black text-sm ${
                      progress.pengaturan.teksLatin
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {progress.pengaturan.teksLatin ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('terjemah');
                  }}
                  className="touch-btn flex items-center justify-between p-4 bg-stone-900 rounded-2xl border border-stone-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-stone-200">
                    <Award className="w-6 h-6 text-emerald-400" />
                    <span className="text-xl font-bold">Terjemahan Kemenag</span>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-xl font-black text-sm ${
                      progress.pengaturan.terjemah
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {progress.pengaturan.terjemah ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSetting('suaraEfek');
                  }}
                  className="touch-btn flex items-center justify-between p-4 bg-stone-900 rounded-2xl border border-stone-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-stone-200">
                    <Volume2 className="w-6 h-6 text-sky-400" />
                    <span className="text-xl font-bold">Efek Suara Sentuhan</span>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-xl font-black text-sm ${
                      progress.pengaturan.suaraEfek
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {progress.pengaturan.suaraEfek ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-8 rounded-3xl bg-rose-950/40 border-2 border-rose-600/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-rose-300">Atur Ulang Progres Kelas</h3>
                <p className="text-base text-rose-200/80 mt-1">
                  Menghapus bintang dan skor lokal untuk kelas {progress.namaKelas}.
                </p>
              </div>

              <TombolBesar
                variant="danger"
                size="normal"
                icon={<RotateCcw className="w-7 h-7" />}
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
            <div className="glass-panel p-8 rounded-3xl border-2 border-amber-500/50">
              <div className="flex items-center gap-3 text-amber-300 mb-4">
                <Sparkles className="w-8 h-8" />
                <h3 className="text-2xl font-black font-display">
                  Surah Fokus Minggu Ini
                </h3>
              </div>
              <p className="text-stone-300 text-lg mb-6">
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
                    className={`touch-btn p-4 rounded-2xl border-2 font-bold text-center cursor-pointer ${
                      focusSurahId === s.id
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-gold-glow'
                        : 'bg-stone-900 text-stone-300 border-stone-700'
                    }`}
                  >
                    <span className="block text-sm text-stone-400">Pos {s.urutanPos}</span>
                    <span className="block text-xl font-black">{s.namaLatin}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Unlock Table */}
            <div className="glass-panel p-8 rounded-3xl border-2 border-stone-700">
              <h3 className="text-2xl font-black text-emerald-300 font-display mb-4">
                Buka / Kunci Pos Secara Manual (37 Pos)
              </h3>
              <p className="text-stone-400 text-sm mb-6">
                Sentuh gembok pada surah mana pun untuk membuka atau menguncinya bagi kelas ini.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {surahListData.map((s) => {
                  const isUnlocked = progress.posTerbuka.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        sfx.playClick();
                        onManualToggleUnlock(s.id);
                      }}
                      className={`touch-btn p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer ${
                        isUnlocked
                          ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-100'
                          : 'bg-stone-950 border-stone-800 text-stone-500'
                      }`}
                    >
                      <div>
                        <span className="text-xs text-stone-400 block">Pos {s.urutanPos}</span>
                        <span className="text-lg font-black">{s.namaLatin}</span>
                      </div>
                      {isUnlocked ? (
                        <Unlock className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Lock className="w-6 h-6 text-stone-600" />
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
          <div className="glass-panel p-8 rounded-3xl border-2 border-stone-700 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-6">
              <div>
                <h3 className="text-3xl font-black text-amber-300 font-display">
                  Rekap Capaian Kelas {progress.namaKelas}
                </h3>
                <p className="text-stone-300 text-lg mt-1">
                  {completedCount} dari 37 Pos Selesai • Total {totalStars} Bintang Terkumpul
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="touch-btn flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg cursor-pointer"
              >
                <Download className="w-6 h-6" />
                <span>Unduh File CSV (.csv)</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-700 text-stone-400 text-lg">
                    <th className="py-4 px-4">Pos</th>
                    <th className="py-4 px-4">Nama Surah</th>
                    <th className="py-4 px-4">Arti</th>
                    <th className="py-4 px-4 text-center">Bintang</th>
                    <th className="py-4 px-4 text-center">Skor Tertinggi</th>
                    <th className="py-4 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-200 text-lg">
                  {surahListData.map((s) => {
                    const detail = progress.posSelesai[s.id];
                    const isUnlocked = progress.posTerbuka.includes(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-stone-900/60">
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">{s.urutanPos}</td>
                        <td className="py-4 px-4 font-black">{s.namaLatin}</td>
                        <td className="py-4 px-4 text-stone-400">{s.arti}</td>
                        <td className="py-4 px-4 text-center">
                          {detail ? (
                            <span className="text-yellow-400 font-bold">{'★'.repeat(detail.stars)}</span>
                          ) : (
                            <span className="text-stone-600">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center font-bold">
                          {detail ? detail.skorTertinggi : 0}
                        </td>
                        <td className="py-4 px-4">
                          {detail && detail.stars >= 1 ? (
                            <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-600 text-sm font-bold">
                              Lulus ({detail.stars}★)
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-3 py-1 rounded-xl bg-amber-950 text-amber-300 border border-amber-600 text-sm font-bold">
                              Terbuka
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-xl bg-stone-900 text-stone-500 text-sm font-bold">
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
          <div className="glass-panel p-8 rounded-3xl border-2 border-stone-700 flex flex-col gap-6">
            <h3 className="text-3xl font-black text-amber-300 font-display">
              Lencana & Prestasi Kelas {progress.namaKelas}
            </h3>
            <p className="text-stone-300 text-lg mb-4">
              Lencana otomatis terbuka ketika kelas mencapai target hafalan dan mini-game.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_BADGES.map((b) => {
                const isEarned = progress.lencana.includes(b.name);
                return (
                  <div
                    key={b.id}
                    className={`p-6 rounded-3xl border-3 flex items-start gap-4 transition-all ${
                      isEarned
                        ? 'bg-gradient-to-br from-stone-900 to-emerald-950/80 border-amber-400 shadow-card-glow'
                        : 'bg-stone-950/80 border-stone-800 opacity-50 grayscale'
                    }`}
                  >
                    <span className="text-5xl">{b.icon}</span>
                    <div>
                      <h4 className="text-2xl font-black text-white font-display mb-1">{b.name}</h4>
                      <p className="text-sm text-stone-300 leading-relaxed">{b.description}</p>
                      {isEarned && (
                        <span className="inline-block mt-3 px-3 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-xs">
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
