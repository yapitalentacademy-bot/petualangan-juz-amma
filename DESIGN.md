# Brief Desain Tampilan — Petualangan Juz 'Amma (Tema Proposal Mewah Tahfiz Camp)

## Konsep dan Arah Visual
Brief ini melengkapi `BRIEF.md` dan khusus mengatur tampilan aplikasi.

**Karakter Gaya**: Elegan, tenang, dan premium: latar gading bermotif marmer halus, hijau zamrud tua, aksen emas yang berkilau lembut, ornamen islami dan dedaunan berupa garis tipis, bingkai lengkung mihrab, dan siluet pegunungan. Kesannya seperti proposal resmi yang mewah, tetapi tetap ramah anak.

### Tiga kata kunci yang harus terasa di setiap layar:
1. **Elegan & Tenang** — warna gading marmer, aksen emas berkilau lembut, dan hijau zamrud tua.
2. **Bertualang** — ada alur jalur emas (*learning experience*), tujuan, dan hadiah yang jelas di setiap langkah.
3. **Beradab** — ayat Al-Qur'an selalu tampil paling mulia, tenang, warna murni tanpa efek glow/emas berlebihan, dan tidak tertimpa apa pun.

**Arah Peta**: Jalur dimulai dari An-Nas (114) dan berakhir di An-Naba' (78), mengikuti urutan anak SD menghafal Juz 'Amma.

---

## Palet Warna
Semua warna didefinisikan sebagai variabel CSS di `src/styles/tokens.css`; komponen dilarang memakai kode warna langsung di luar token sistem.

| Token | Hex / Nilai | Dipakai untuk |
| :--- | :--- | :--- |
| `--gading` | `#F8F4EA` | Latar utama layar |
| `--gading-kartu` | `#FFFDF6` | Isi kartu soal & kartu pilihan |
| `--marmer-urat` | `#E9E1D0` | Urat marmer halus & border sekunder |
| `--ornamen` | `#D9CBB0` | Garis ornamen sudut (opasitas 40–60%) |
| `--zamrud-tua` | `#0E4D34` | Judul layar, kartu solid aktif, tombol utama |
| `--zamrud` | `#1B6B47` | Teks sekunder, ikon line-art |
| `--zamrud-garis` | `#3A9D6A` | Garis bingkai kedua mihrab, border tipis |
| `--emas-terang` | `#F3D88A` | Aksen emas highlight |
| `--emas` | `#C9A04A` | Warna emas utama |
| `--emas-tua` | `#9C7A2E` | Aksen border emas bayangan |
| `--gradien-emas` | `linear-gradient(135deg, #F3D88A, #C9A04A 55%, #9C7A2E)` | Plakat, tombol aksi utama, teks judul emas |
| `--teks` | `#2B2A26` | Teks isi & teks ayat Al-Qur'an |
| `--gunung-pasir` | `#CDBFA6` | Siluet gunung line-art di pojok layar |

### Aturan Pemakaian Warna:
- Proporsi kira-kira 60% gading marmer, 30% zamrud tua, 10% aksen emas. Emas adalah aksen kemewahan dan hadiah, bukan latar layar penuh.
- Jawaban benar memakai zamrud tua solid + border emas + glow emas lembut.
- Jawaban perlu diulang memakai terakota lembut (`#C0603A`) + ikon ↻. Merah terang dihindari agar anak tetap termotivasi.

---

## Tipografi
Empat peran huruf dengan fungsi yang terpisah rapi:

| Peran | Font | Ukuran (1920×1080) | Catatan |
| :--- | :--- | :--- | :--- |
| **Ayat Al-Qur'an** | Scheherazade New / Amiri / KFGQPC Hafs | 72–96 px | Hanya untuk teks ayat; tinggi baris 1.9–2.1; `dir="rtl"`; warna `--teks` murni tanpa efek glow |
| **Nama Surah (Arab)** | Amiri / Reem Kufi | 48–64 px | Hiasan judul pos dan kaligrafi nama surah |
| **Judul Layar & Angka Besar** | Marcellus (Serif Elegan) | 48–72 px | Judul pos, angka skor besar, plakat prestasi |
| **Judul Utama Beranda** | Montserrat ExtraBold | 60–84 px | Baris 1: `--zamrud-tua`, Baris 2: `--gradien-emas` |
| **Teks Isi, Instruksi & Tombol**| Montserrat SemiBold/Bold | 28–36 px | Instruksi, terjemah, label tombol |

---

## Ornamen dan Pemandangan
Semua ornamen dibuat berbasis vektor SVG garis tipis (1–1.5 px):
- **Pola Geometris Islami (Girih)**: Bintang octagram line-art di pojok kiri dan kanan atas (sebagian terpotong tepi layar).
- **Ranting Daun Line-Art**: Daun line-art halus di pojok kanan atas dan kiri bawah.
- **Siluet Gunung Pasir**: Siluet bergradasi lembut di pojok kanan bawah, garis gunung + bulan sabit di kiri bawah.
- **Tekstur Marmer**: Lapisan urat marmer SVG opasitas rendah di latar belakang gading.
- **Bingkai Mihrab**: Bentuk lengkung runcing ganda (luar: zamrud-tua/emas, dalam: zamrud-garis) untuk membingkai pemandangan di Beranda dan Pos Surah.
- **Pemandangan Realistis**: Lukisan alam pegunungan berkabut, oase, dan langit fajar/senja/malam tanpa manusia dan tanpa teks di `public/scenes/`.

---

## Komponen UI
| Komponen | Tampilan | Saat disentuh / Aktif |
| :--- | :--- | :--- |
| **TombolBesar Utama** | Kapsul `--gradien-emas`, teks `--zamrud-tua` Montserrat ExtraBold, kilau tipis | Turun 4 px, bayangan menipis, bunyi "tik" lembut |
| **TombolBesar Sekunder**| Kapsul solid `--zamrud-tua`, teks gading, border `--zamrud-garis` | Turun 4 px |
| **KartuAyat & Pilihan** | Latar `--gading-kartu`, radius 28px, border `--zamrud-tua` 2px, bayangan cahaya emas transparan | Saat benar/dipilih: berubah menjadi kartu solid `--zamrud-tua` dengan teks gading dan glow emas |
| **PlakatEmas** | Kotak radius 24px berisi `--gradien-emas`, border terang, teks Marcellus `--zamrud-tua` besar | Digunakan untuk skor, bintang, dan lencana |
| **JalurProgres** | Garis emas berkilau dengan simpul bulat emas berisi nomor/tanda centang | Simpul menyala saat langkah bertambah |
| **BingkaiMihrab** | Lengkung ogee garis ganda berisi pemandangan alam wilayah | Efek zoom lembut saat hover |
| **GelembungNur** | Balon bicara gading marmer dengan border tipis emas, teks maksimal 1 kalimat | Hilang otomatis setelah 4 detik |

---

## Desain per Layar

### Beranda
Tata letak cover proposal:
- **Kiri**: Judul "PETUALANGAN" (zamrud) dan "JUZ 'AMMA" (emas gradasi), subjudul satu kalimat, tombol Mulai Petualangan (emas) dan Duel Tim (zamrud), serta pemilih rombel/tingkat.
- **Kanan**: Bingkai mihrab ganda berisi pemandangan Lembah Fajar.
- **Pojok**: Ornamen daun dan geometris garis tipis.

### Peta Petualangan
Tata letak *Learning Experience*:
- Garis jalur emas horizontal melintas di atas siluet pegunungan hijau berlapis.
- Setiap pos surah adalah simpul bulat emas dengan nama surah di atas/bawah secara selang-seling.
- Mendukung mode tampilan alternatif (Grid) dan parallax 3 wilayah.

### Pos Surah
- **Kiri**: Bingkai mihrab berisi pemandangan wilayah.
- **Kanan**: Nama surah (Marcellus), nama Arab, arti, jumlah ayat, dan tombol putar murottal.
- **Bawah**: Grid modul tantangan mini-game bergaya fasilitas proposal.

### Layar Mini-Game
- Latar gading marmer polos dengan ornamen sudut tipis.
- KartuAyat di tengah atas, pilihan jawaban di bawah dengan radius 28px.
- Nur di pojok kiri bawah memberikan petunjuk santun.

### Duel Tim
- Dua sisi bergaya perbandingan harga proposal: Tim Zamrud (panel solid `--zamrud-tua` + skor emas) vs Tim Emas (panel solid `--gradien-emas` + skor `--zamrud-tua`).
- Buzzer bulat besar sesuai warna tim.

### Hasil
- Pemandangan matahari terbenam di atas pegunungan dengan gradien zamrud tua di bagian bawah.
- Judul putih Marcellus dan baris kedua gradien emas.
- PlakatEmas untuk bintang, skor, dan akurasi.

### Mode Guru
- Grid kartu gading bergaris zamrud dengan ikon line-art, tanpa animasi berat, tabel rekap besar, dan kontrol sederhana.

---

## Adab dan Batasan Visual (Dipertahankan Penuh)
1. Teks ayat tidak pernah diputar, dimiringkan, dipotong bingkai, ditimpa elemen lain, atau dianimasikan jatuh/pecah/terbang.
2. Ayat tidak diletakkan di dekat ikon gagal/peringatan kasar.
3. Kartu ayat yang salah dipilih cukup meredup lembut lalu kembali ke posisi awal.
4. Tidak ada gambar Nabi, malaikat, para sahabat, atau figur manusia yang realistis.
5. Efek glow dan kilau emas hanya pada tombol, plakat, dan jalur; **tidak pernah pada teks ayat Al-Qur'an**.
6. Semua animasi berhenti saat audio ayat diputar.
7. Kontras teks minimal 4.5:1 dan ukuran minimum teks/tombol untuk Smart TV tetap dipenuhi.
