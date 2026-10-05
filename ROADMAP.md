# Roadmap Pengembangan — Petualangan Juz 'Amma (Smart TV Edition)

Dokumen ini berisi usulan pengembangan fitur tambahan untuk aplikasi **Petualangan Juz 'Amma**. Kerjakan fitur hanya setelah disetujui/dipilih oleh pengguna.

---

## 🗺️ Daftar Usulan Fitur (1 – 10)

### 1. Data Lengkap 37 Surah & Skrip Verifikasi
- **Manfaat**: Menjamin 100% keakuratan teks mushaf Uthmani Kemenag RI & pemetaan audio EveryAyah untuk seluruh 37 surah (Surah 78 An-Naba' s.d. Surah 114 An-Nas) dengan skrip pembanding otomatis (*verification runner*).
- **Perkiraan Besar Pekerjaan**: Sedang (1 - 2 jam)
- **File Terdampak**:
  - `scripts/import-quran-data.js` (baru)
  - `scripts/verify-quran-text.js` (baru)
  - `src/data/sample-surahs.json`
  - `package.json`

---

### 2. Mode Murajaah Harian (Sesi 5 Menit)
- **Manfaat**: Menyediakan sesi pengulangan cepat 5 menit di awal jam pelajaran. Aplikasi secara otomatis memilih surah yang paling sering salah atau paling jarang dilatih berdasarkan riwayat nilai kelas.
- **Perkiraan Besar Pekerjaan**: Sedang (1.5 - 2 jam)
- **File Terdampak**:
  - `src/screens/ModeMurajaah.tsx` (baru)
  - `src/screens/Beranda.tsx`
  - `src/lib/gameLogic.ts`
  - `src/lib/db.ts`

---

### 3. Mode Setoran Hafalan Kelompok
- **Manfaat**: Memungkinkan guru menilai hafalan siswa/kelompok secara langsung di layar TV dengan tombol cepat (*Lancar* [3 Bintang] / *Perlu Diulang* [1 Bintang]). Hasil penilaian otomatis tercetak di rekap kelas.
- **Perkiraan Besar Pekerjaan**: Sedang (1.5 - 2 jam)
- **File Terdampak**:
  - `src/screens/ModeSetoran.tsx` (baru)
  - `src/screens/PosSurah.tsx`
  - `src/lib/db.ts`

---

### 4. Mode Talaqqi (Pengulangan & Jeda Tiru)
- **Manfaat**: Pemutaran ayat berulang (1x, 3x, atau 5x) yang dilengkapi jeda waktu (*silence delay*) otomatis agar siswa sekelas bisa menirukan bacaan Qari dengan irama yang pas.
- **Perkiraan Besar Pekerjaan**: Sedang (1.5 jam)
- **File Terdampak**:
  - `src/lib/audioPlayer.ts`
  - `src/components/PemutarAudio.tsx`
  - `src/screens/PosSurah.tsx`

---

### 5. Rekap Guru Lengkap & Ekspor PDF / CSV
- **Manfaat**: Laporan statistik komprehensif per kelas dan per surah, menampilkan grafik indikator surah/ayat yang paling sering salah, serta fitur ekspor rekap dalam format **CSV** dan **PDF Siap Cetak**.
- **Perkiraan Besar Pekerjaan**: Besar (2 - 3 jam)
- **File Terdampak**:
  - `src/lib/pdfExport.ts` (baru)
  - `src/lib/csvExport.ts`
  - `src/screens/ModeGuru.tsx`

---

### 6. Pilihan Qari & Pengatur Kecepatan Tilawah
- **Manfaat**: Pilihan Syaikh Misyari Rasyid Al-'Afasy, Syaikh Abdul Basit, Syaikh As-Sudais, dan Syaikh Al-Ghamadi, dilengkapi selektor kecepatan tilawah (0.75x, 1.0x, 1.25x) di Mode Guru & Pos Surah.
- **Perkiraan Besar Pekerjaan**: Kecil - Sedang (1 jam)
- **File Terdampak**:
  - `src/lib/audioPlayer.ts`
  - `src/screens/ModeGuru.tsx`
  - `src/screens/PosSurah.tsx`

---

### 7. Mode Hafalan Tanpa Teks (Kelas 6)
- **Manfaat**: Mode tantangan khusus kelas 6 di mana teks ayat disembunyikan total (*blank mode*) untuk menguji hafalan mutqin tanpa bantuan visual bacaan.
- **Perkiraan Besar Pekerjaan**: Kecil (45 menit)
- **File Terdampak**:
  - `src/components/KartuAyat.tsx`
  - `src/games/SambungAyat/SambungAyatGame.tsx`
  - `src/screens/PosSurah.tsx`

---

### 8. Interactive Onboarding & Tutorial Maskot Nur
- **Manfaat**: Panduan interaktif singkat saat aplikasi pertama kali dibuka di TV, menjelaskan navigasi peta, mini-game, dan adab belajar Al-Qur'an dipandu oleh maskot Nur.
- **Perkiraan Besar Pekerjaan**: Sedang (1.5 jam)
- **File Terdampak**:
  - `src/components/TutorialOnboarding.tsx` (baru)
  - `src/screens/Beranda.tsx`
  - `src/lib/db.ts`

---

### 9. Cetak Sertifikat Digital "Hafidz Cilik Juz 'Amma"
- **Manfaat**: Generator sertifikat apresiasi bernuansa Islami gading-emas yang dapat diunduh/dicetak (PDF/Gambar) saat kelas menyelesaikan seluruh pos di level kelasnya.
- **Perkiraan Besar Pekerjaan**: Sedang - Besar (2 jam)
- **File Terdampak**:
  - `src/components/SertifikatModal.tsx` (baru)
  - `src/screens/ModeGuru.tsx`
  - `src/lib/pdfExport.ts`

---

### 10. Papan Peringkat Antarkelas (Local Leaderboard TV)
- **Manfaat**: Klasemen nilai dan jumlah bintang antarkelas (misal: 4A, 4B, 5A, 5B, 6A, 6B) yang tersimpan secara lokal di TV untuk memotivasi kompetisi kebaikan (*fabiqul khairat*).
- **Perkiraan Besar Pekerjaan**: Sedang (1.5 jam)
- **File Terdampak**:
  - `src/components/PapanPeringkatKelas.tsx` (baru)
  - `src/screens/Beranda.tsx`
  - `src/screens/ModeGuru.tsx`
  - `src/lib/db.ts`
