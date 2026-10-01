# Brief Antigravity — Petualangan Juz 'Amma

Oct 1, 2026 · @YTA

## Ringkasan proyek

Bangun **Petualangan Juz 'Amma**, game web edukasi hafalan dan pemahaman Juz 30 untuk siswa SD kelas 4–6, dimainkan di smart TV layar sentuh di kelas. Game berupa peta 37 pos (An-Naba' s.d. An-Nas); tiap pos berisi mini-game, dan pos berikutnya terbuka setelah pos sebelumnya selesai.

**Cara pakai brief ini di Antigravity:** tempel seluruh dokumen sebagai konteks proyek di awal, lalu jalankan fase pengembangan satu per satu memakai prompt di bagian *Tahapan pengembangan*. Jangan minta agen membangun semuanya sekaligus.

**Tujuan utama:**

1. Memperkuat hafalan surah Juz 30 lewat pengulangan yang menyenangkan.
2. Mengenalkan urutan surah, arti nama surah, kandungan, dan tajwid dasar.
3. Membuat seluruh kelas terlibat bersama di satu layar (mode tim), bukan hanya satu anak.

## Pengguna dan perangkat

Pemain utama adalah siswa SD kelas 4–6 (usia 9–12 tahun) yang bermain berkelompok di depan TV, dengan guru sebagai operator.

| Aspek | Ketentuan |
| --- | --- |
| Perangkat utama | Smart TV / panel interaktif layar sentuh 55–86 inci, umumnya Android, dibuka lewat browser (Chrome) |
| Resolusi target | 1920×1080 landscape; tetap rapi di 3840×2160 dan 1280×720 |
| Input | Sentuhan jari (tap, drag). Jangan bergantung pada hover, klik kanan, atau keyboard |
| Multi-touch | Mode Duel Tim butuh 2 sentuhan bersamaan; sediakan fallback giliran bila panel tidak mendukung |
| Jarak pandang | Siswa duduk 2–5 meter dari layar; teks harus terbaca dari belakang kelas |
| Koneksi | Bisa offline setelah pertama dibuka (internet sekolah sering tidak stabil) |
| Perangkat cadangan | Laptop + proyektor dengan mouse juga harus berfungsi |

## Tech stack dan arsitektur

Gunakan web app statis (PWA) agar bisa dipasang di TV mana pun tanpa toko aplikasi dan tetap jalan offline.

| Bagian | Pilihan | Alasan |
| --- | --- | --- |
| Framework | React + Vite + TypeScript | Komponen mini-game bisa dipakai ulang |
| Animasi & drag | Framer Motion + dnd-kit (pointer events) | Drag halus untuk sentuh dan mouse |
| Audio | Howler.js | Preload dan pemutaran audio per ayat yang andal |
| Penyimpanan | IndexedDB (via Dexie) | Progres kelas, skor, pengaturan guru tersimpan lokal |
| Offline | vite-plugin-pwa (service worker) | Teks, font, dan audio di-cache |
| Hosting | Netlify / Vercel / Railway (statis) | Cukup satu URL untuk dibuka di browser TV |

**Struktur folder yang diminta:**

```
src/
  data/          # surah.json, ayat per surah, kisah, soal
  audio/         # dimuat dari public/audio/{qari}/{surah}{ayat}.mp3
  games/         # satu folder per mini-game
  components/    # Tombol besar, Kartu Ayat, Papan Skor, Timer
  screens/       # Beranda, Peta, Pos Surah, Mode Guru, Hasil
  store/         # state progres & skor
  lib/           # util acak soal, pengecek jawaban, audio
```

Setiap mini-game adalah komponen mandiri dengan antarmuka yang sama: menerima `surahId`, `level`, dan `mode` (solo/tim), lalu mengembalikan `onFinish({skor, benar, salah})`.

## Struktur data

Semua konten disimpan sebagai JSON statis yang terpisah dari kode, agar guru atau tim konten bisa memeriksa dan memperbaikinya tanpa menyentuh logika game.

```json
{
  "id": 105,
  "namaLatin": "Al-Fil",
  "namaArab": "الفيل",
  "arti": "Gajah",
  "jumlahAyat": 5,
  "tempatTurun": "Makkiyah",
  "level": 4,
  "ringkasanKisah": "…",
  "pesanAkhlak": "…",
  "ayat": [
    {
      "nomor": 1,
      "arab": "…",
      "kata": ["…", "…"],
      "latin": "…",
      "terjemah": "…",
      "audio": "105001.mp3",
      "tajwid": [{ "hukum": "ghunnah", "indeksHuruf": [12, 13] }]
    }
  ]
}
```

Ketentuan data:

- **Teks Arab:** ambil dari sumber teks mushaf terverifikasi (Qur'an Kemenag/LPMQ atau Tanzil Uthmani), simpan apa adanya tanpa diketik ulang.
- **Pemecahan kata (`kata`):** dipakai oleh Susun Ayat dan Pemburu Tajwid; harus dibuat dari teks sumber, bukan dipotong manual.
- **Audio:** satu file per ayat dengan pola nama `SSSAAA.mp3` (nomor surah 3 digit + nomor ayat 3 digit), qari bisa diganti lewat pengaturan.
- **Soal Tebak Surah dan Kisah:** file `soal.json` terpisah, tiap soal punya `surahId`, `level`, `pertanyaan`, `pilihan`, `jawaban`.
- **Fase 1 cukup memakai data 6 surah contoh** (Al-Fil, Quraisy, Al-Ma'un, Al-Kautsar, Al-Ikhlas, An-Nas); sisanya diisi setelah mesin game stabil.

## Alur layar

Beranda → Pilih kelas dan level → Peta 37 pos → Pos surah → Mini-game / Duel Tim → Hasil dan bintang → kembali ke Peta (pos berikutnya terbuka).
Beranda → Mode Guru (PIN 4 digit).

Siswa memilih pos di peta, memainkan mini-game, melihat bintang, lalu kembali ke peta dengan pos berikutnya terbuka; Mode Guru hanya bisa diakses dari Beranda dengan PIN.

## Spesifikasi mini-game

Delapan mini-game berbagi komponen yang sama (kartu ayat, tombol putar audio, papan skor). Prioritas pembangunan: 1, 2, 6 di fase awal; sisanya menyusul.

### 1. Sambung Ayat

- **Mekanik:** audio qari membacakan ayat ke-n; muncul 3–4 kartu ayat; siswa menyentuh ayat ke-n+1.
- **Pengecoh:** ayat lain dari surah yang sama atau surah bertetangga dengan awalan mirip.
- **Umpan balik:** benar → kartu menyala hijau, ayat jawaban diputar; salah → kartu bergetar pelan, lalu ayat yang benar ditunjukkan dan diputar.
- **Skor:** 10 poin per benar, bonus 5 bila benar pada percobaan pertama.

### 2. Susun Ayat

- **Mekanik:** satu ayat dipecah per kata dan diacak; siswa menyeret kata ke slot berurutan **dari kanan ke kiri** (arah tulisan Arab).
- **Bantuan:** tombol "Dengar" memutar audio ayat; kata yang sudah benar terkunci di slotnya.
- **Tingkat:** kelas 4 maksimal 5 potongan (kata bisa digabung), kelas 6 seluruh kata.

### 3. Tebak Surah

- **Mekanik:** potongan audio atau petunjuk teks ("Surah tentang pasukan bergajah"); siswa memilih dari 4 nama surah.
- **Varian:** tebak dari arti nama, dari jumlah ayat, atau dari ayat pertama.

### 4. Kereta Surah

- **Mekanik:** 5–8 gerbong berisi nama surah acak; siswa menyeret ke rel sesuai urutan mushaf.
- **Mode waktu:** opsional, aktif mulai kelas 5.

### 5. Kartu Kembar

- **Mekanik:** grid 4×3 kartu tertutup; pasangan nama surah ↔ arti, atau nama surah ↔ jumlah ayat.
- **Mode tim:** tim bergantian membuka; pasangan cocok memberi poin dan giliran tambahan.

### 6. Duel Tim

- **Mekanik:** layar dibagi dua (Tim Kiri hijau, Tim Kanan biru), soal di tengah memakai bank soal mini-game 1, 3, atau 5.
- **Buzzer:** tombol buzzer besar di tiap sisi; tim tercepat menjawab; salah → giliran pindah ke tim lain.
- **Fallback:** bila multi-touch tidak terdeteksi, beralih ke mode giliran bergantian.
- **Akhir:** 10 soal per ronde, papan skor animasi, tidak ada pesan merendahkan tim yang kalah.

### 7. Pemburu Tajwid (kelas 5–6)

- **Mekanik:** satu ayat tampil besar; instruksi "Sentuh semua huruf yang dibaca dengung"; huruf yang benar menyala.
- **Hukum yang dicakup:** ghunnah, ikhfa', idgham, qalqalah, mad thabi'i.
- **Data:** posisi huruf diambil dari field `tajwid` di JSON, wajib diverifikasi guru.

### 8. Kisah di Balik Surah

- **Mekanik:** 3–5 panel ilustrasi bergeser dengan narasi singkat, lalu 3 soal pemahaman dan 1 pesan akhlak.
- **Cakupan awal:** Al-Fil, Quraisy, Al-Ma'un, Al-Kautsar, Al-Lahab, An-Nasr.
- **Batasan ilustrasi:** tidak menggambarkan Nabi, malaikat, atau para sahabat secara visual; gunakan lanskap, siluet benda, atau simbol.

## Penjenjangan kelas

Level menentukan cakupan surah dan tingkat kesulitan; guru memilih level di awal sesi, dan pembagian surah bisa diubah lewat Mode Guru agar sesuai kurikulum sekolah.

| Parameter | Kelas 4 | Kelas 5 | Kelas 6 |
| --- | --- | --- | --- |
| Cakupan surah | Ad-Dhuha s.d. An-Nas (93–114) | Al-A'la s.d. Al-Lail (87–92) + ulangan kelas 4 | An-Naba' s.d. At-Thariq (78–86) + seluruh Juz 30 |
| Pilihan jawaban | 3 | 4 | 4 |
| Batas waktu | Tidak ada | 30 detik/soal (opsional) | 20 detik/soal |
| Bantuan teks | Arab + latin + terjemah | Arab + terjemah | Arab saja (latin bisa dibuka) |
| Susun Ayat | Maks. 5 potongan | Maks. 8 potongan | Semua kata |
| Pemburu Tajwid | Tidak aktif | Ghunnah, qalqalah, mad thabi'i | Semua hukum dalam daftar |
| Tantangan khusus | – | Kereta Surah berwaktu | Hafalan tanpa teks (layar teks disembunyikan) |

## Progres, lencana, dan Mode Guru

Progres disimpan per **kelas** (misalnya "5B"), bukan per siswa, karena satu TV dipakai bersama.

**Sistem progres:**

- Tiap pos surah memberi 1–3 bintang berdasarkan akurasi (≥60%, ≥80%, 100%).
- Pos berikutnya terbuka dengan minimal 1 bintang; guru dapat membuka pos mana pun secara manual.
- Lencana: *Penjelajah* (5 pos), *Penghafal Tangguh* (15 pos), *Ahli Tajwid* (semua Pemburu Tajwid tuntas), *Hafidz Cilik Juz 'Amma* (37 pos).

**Mode Guru** (dibuka dengan PIN 4 digit, menu tersembunyi di pojok layar):

- Membuat dan memilih kelas, memilih level, memilih surah fokus minggu ini.
- Mengaktifkan/mematikan mini-game, batas waktu, teks latin, dan terjemah.
- Memilih qari dan kecepatan audio.
- Melihat rekap skor per kelas dan per surah, dengan ekspor CSV.
- Mengatur ulang progres kelas (dengan konfirmasi dua langkah).

## Desain visual dan UX

Tema visual: **petualangan pulau gurun-oasis** yang hangat dan tenang, dengan warna pasir, hijau zamrud, dan biru laut; hindari gaya terlalu ramai atau bernuansa kasino.

| Elemen | Ukuran / aturan minimum (pada 1920×1080) |
| --- | --- |
| Teks Arab ayat | 72–96 px, font mushaf Uthmani (KFGQPC Uthmanic Script HAFS atau LPMQ Isep Misbah), `dir="rtl"` |
| Teks Latin/terjemah | 32–40 px, font sans serif tebal (mis. Nunito) |
| Tombol & kartu | Minimal 160×160 px, jarak antar tombol ≥ 32 px |
| Area buzzer Duel Tim | Minimal 300×300 px di tiap sisi |
| Kontras | Rasio ≥ 4.5:1; jangan andalkan warna saja (tambah ikon ✓/✗) |

Aturan interaksi:

- Setiap sentuhan memberi umpan balik dalam 100 ms (skala tombol + suara klik lembut).
- Abaikan sentuhan beruntun dalam 300 ms pada tombol jawaban agar tidak terpencet dua kali.
- Tidak ada popup kecil, menu dropdown, atau teks di bawah 28 px.
- Tombol "Kembali ke Peta" selalu ada di pojok kiri atas.
- Suara efek bisa dimatikan terpisah dari audio qari; musik latar tidak diputar saat ayat dibacakan.
- Saat ayat Al-Qur'an diputar, animasi lain dihentikan sejenak sebagai bentuk adab.

## Aturan konten Al-Qur'an

Kesalahan satu harakat pun tidak boleh lolos, jadi aturan berikut wajib dipatuhi agen dan tim.

1. **Agen dilarang mengetik atau menghasilkan teks Arab ayat sendiri.** Semua teks Arab hanya diambil dari file sumber resmi yang disediakan dan dimuat apa adanya.
2. Pengacakan dan pemotongan hanya terjadi di tingkat urutan kata; isi setiap kata tidak boleh diubah.
3. Teks ayat tidak diletakkan di tempat yang tidak layak: tidak di tombol "kalah", tidak dianimasikan terjatuh/hancur, tidak tertimpa elemen lain.
4. Gunakan ayat penuh untuk soal Sambung Ayat; jangan memotong ayat di tengah kalimat sehingga maknanya berubah.
5. Terjemah memakai terjemah Kemenag dan dicantumkan sumbernya di halaman *Tentang*.
6. Audio qari dicantumkan nama dan sumbernya; pastikan izin penggunaan, atau gunakan rekaman qari lokal.
7. Sebelum rilis, seluruh data (teks, pemotongan kata, tajwid, kisah) diperiksa oleh guru Al-Qur'an dan ditandatangani dalam checklist verifikasi.

## Tahapan pengembangan

Kerjakan tujuh fase secara berurutan; uji tiap fase langsung di TV sekolah sebelum lanjut. Prompt di bawah siap ditempel ke Antigravity setelah brief ini dimasukkan sebagai konteks.

1. **Fondasi.**

   ```
   Baca brief Petualangan Juz 'Amma. Kerjakan Fase 1: setup React + Vite + TypeScript, struktur folder sesuai brief, data JSON 6 surah contoh (gunakan placeholder teks Arab yang akan saya ganti dengan file resmi), komponen TombolBesar, KartuAyat, PemutarAudio, PapanSkor, serta layar Beranda dan Peta dengan 37 pos (hanya 6 yang aktif). Ikuti aturan ukuran sentuh dan tipografi di brief. Jangan membuat mini-game dulu.
   ```
2. **Sambung Ayat dan Susun Ayat.**

   ```
   Kerjakan Fase 2: buat mini-game Sambung Ayat dan Susun Ayat sesuai spesifikasi di brief, dengan antarmuka komponen surahId, level, mode, onFinish. Susun Ayat harus mengisi slot dari kanan ke kiri. Hubungkan keduanya ke layar Pos Surah. Tulis unit test untuk pengecek jawaban.
   ```
3. **Duel Tim.**

   ```
   Kerjakan Fase 3: buat mode Duel Tim layar terbelah dengan dua buzzer, deteksi multi-touch memakai pointer events, dan fallback mode giliran. Gunakan bank soal Sambung Ayat. Tambahkan layar hasil dengan papan skor animasi.
   ```
4. **Mini-game pendukung.**

   ```
   Kerjakan Fase 4: buat Tebak Surah, Kereta Surah, dan Kartu Kembar sesuai brief, termasuk mode tim untuk Kartu Kembar dan mode waktu untuk Kereta Surah.
   ```
5. **Progres dan Mode Guru.**

   ```
   Kerjakan Fase 5: simpan progres per kelas di IndexedDB (Dexie), sistem bintang dan lencana, serta Mode Guru ber-PIN dengan semua pengaturan di brief dan ekspor CSV.
   ```
6. **Pemburu Tajwid dan Kisah.**

   ```
   Kerjakan Fase 6: buat Pemburu Tajwid (penyorotan huruf berdasarkan field tajwid di JSON) dan Kisah di Balik Surah (panel geser + 3 soal + pesan akhlak). Patuhi batasan ilustrasi di brief.
   ```
7. **Offline, data lengkap, dan rilis.**

   ```
   Kerjakan Fase 7: jadikan PWA dengan cache teks, font, dan audio; buat skrip impor yang mengubah file sumber teks resmi dan audio per ayat menjadi JSON untuk 37 surah; tambahkan halaman Tentang berisi sumber teks, terjemah, dan qari. Siapkan build untuk deploy statis.
   ```

## Kriteria penerimaan

Game dianggap siap dipakai di kelas bila semua poin berikut lolos saat diuji langsung di TV sekolah.

- [ ] Seluruh teks Arab 37 surah cocok 100% dengan sumber resmi (dicek otomatis oleh skrip pembanding + manual oleh guru)
- [ ] Audio setiap ayat terputar sesuai ayatnya, tanpa jeda lebih dari 1 detik
- [ ] Teks Arab terbaca jelas dari jarak 5 meter
- [ ] Semua tombol bisa disentuh tepat oleh anak tanpa salah pencet
- [ ] Susun Ayat mengisi dari kanan ke kiri dengan benar
- [ ] Duel Tim berjalan di panel multi-touch dan beralih ke mode giliran di panel single-touch
- [ ] Game tetap jalan setelah internet dimatikan
- [ ] Progres kelas tersimpan setelah browser ditutup dan dibuka lagi
- [ ] Mode Guru tidak bisa dibuka tanpa PIN
- [ ] Tidak ada ilustrasi Nabi, malaikat, atau sahabat
- [ ] Uji coba dengan minimal satu kelas sungguhan, catat bagian yang membingungkan siswa
- [ ] Checklist verifikasi konten ditandatangani guru Al-Qur'an
