# Brief Desain Tampilan — Petualangan Juz 'Amma

## Konsep dan Arah Visual
Brief ini melengkapi `BRIEF.md` dan khusus mengatur tampilan. Simpan sebagai `DESIGN.md` di folder proyek, lalu terapkan tanpa mengubah logika game.

**Tema**: "Kafilah Cahaya". Siswa adalah anggota kafilah kecil yang menyusuri jalur oase dan lembah, mengumpulkan lentera ilmu di setiap pos surah. Rasa petualangannya datang dari peta, jalur, kompas, dan harta karun; rasa islaminya datang dari pola geometris, lengkung mihrab, lentera, dan bingkai mushaf.

### Tiga kata kunci yang harus terasa di setiap layar:
1. **Hangat** — warna pasir, emas, dan hijau zamrud, bukan neon atau warna permen.
2. **Bertualang** — ada jalur, tujuan, dan hadiah yang jelas di setiap langkah.
3. **Beradab** — ayat Al-Qur'an selalu tampil paling mulia, tenang, dan tidak tertimpa apa pun.

**Perubahan arah peta**: Jalur dimulai dari An-Nas (114) dan berakhir di An-Naba' (78), mengikuti urutan anak SD menghafal Juz 'Amma.

**Hindari**: gaya kasino (koin berhamburan, slot, roda putar), warna neon, ledakan atau efek kekerasan, dan karakter kartun yang terlalu ramai.

---

## Palet Warna
Semua warna didefinisikan sebagai variabel CSS di `src/styles/tokens.css`; komponen dilarang memakai kode warna langsung.

| Token | Hex | Dipakai untuk |
| :--- | :--- | :--- |
| `--pasir-terang` | `#F6EBD9` | Latar utama layar |
| `--pasir` | `#E8D2A6` | Latar peta, panel sekunder |
| `--gading` | `#FFFDF7` | Kartu ayat, kotak dialog |
| `--zamrud` | `#0F7A5C` | Warna utama, tombol aksi, Tim Kiri |
| `--zamrud-tua` | `#0B4F3E` | Teks judul, bingkai, bayangan tombol |
| `--emas` | `#D4A23A` | Bintang, lentera, lencana, ornamen |
| `--biru-laut` | `#1E6F8C` | Tim Kanan, oase dan air di peta |
| `--malam` | `#14233C` | Langit malam peta, teks utama |
| `--terakota` | `#C0603A` | Peringatan lembut, jawaban perlu diulang |

### Aturan Pemakaian:
- Proporsi kira-kira 60% pasir/gading, 30% zamrud/biru laut, 10% emas. Emas adalah aksen hadiah, jangan dipakai untuk latar luas.
- Jawaban benar memakai zamrud + ikon ✓; jawaban perlu diulang memakai terakota + ikon ↻. Merah terang tidak dipakai agar anak tidak merasa dihukum.
- Wilayah peta memakai suasana langit berbeda: pagi (pasir terang) untuk kelas 4, senja (emas ke terakota) untuk kelas 5, malam berbintang (malam + emas) untuk kelas 6.

---

## Tipografi
Empat peran huruf dengan tugas yang tidak boleh tertukar. Semua font gratis dan di-bundle lokal agar tetap tampil saat offline.

| Peran | Font | Ukuran (1920×1080) | Catatan |
| :--- | :--- | :--- | :--- |
| **Ayat Al-Qur'an** | KFGQPC Uthmanic Script HAFS / LPMQ Isep Misbah / Scheherazade New / Amiri Quran | 72–96 px | Hanya untuk teks ayat; tinggi baris 1,9; `dir="rtl"` |
| **Nama surah (hiasan Arab)** | Amiri / Reem Kufi | 48–64 px | Untuk judul pos dan lencana, bukan untuk ayat |
| **Judul Latin** | Baloo 2 (tebal 700–800) | 48–72 px | Membulat dan ramah anak |
| **Teks isi & tombol** | Nunito (tebal 700) | 32–40 px | Instruksi, terjemah, skor |

### Aturan tambahan:
- Jangan memakai font Arab hias (Diwani, Thuluth tebal) untuk ayat; anak harus bisa membaca harakat dengan jelas.
- Instruksi game maksimal satu kalimat pendek, misalnya "Sentuh ayat berikutnya".
- Angka skor memakai angka Latin besar (Baloo 2), bukan angka Arab-Indik, agar mudah dibaca seluruh kelas.

---

## Ornamen, Ikon, dan Maskot
Semua ornamen dibuat sebagai SVG atau CSS oleh agen sendiri, tanpa mengambil gambar dari internet, agar ringan dan bebas masalah hak cipta.

### Ornamen inti:
- **Bintang delapan (khatam)** — bentuk dasar bintang hadiah, lencana, dan penanda pos yang sudah tuntas.
- **Pola geometris (girih)** — tekstur latar tipis dengan opasitas 6–10%, tidak pernah berada di belakang teks ayat.
- **Lengkung mihrab** — bingkai atas kartu ayat dan pintu masuk setiap wilayah peta.
- **Lentera (fanus)** — simbol harta karun; setiap pos tuntas menyalakan satu lentera di peta.
- **Bingkai mushaf** — garis ganda emas dengan sudut ornamen di kartu ayat, mengingatkan pada halaman mushaf.

### Ikon & Maskot:
- **Ikon**: set ikon garis Lucide (tebal garis 2,5 px) + ikon tematik SVG (kompas, lentera, unta, oase, tenda).
- **Maskot "Nur"**: lentera kecil bercahaya yang menemani kafilah. Nur memberi instruksi, menyemangati saat jawaban perlu diulang, dan bersinar lebih terang saat jawaban benar. Sediakan sakelar di Mode Guru untuk menampilkan Nur tanpa wajah bagi sekolah yang menghindari gambar makhluk bernyawa.
- **Pemandangan peta**: bukit pasir, pohon kurma, oase, tenda kafilah, jembatan kayu, dan langit berbintang. Tidak ada figur manusia di peta; kafilah ditandai dengan bendera kecil atau jejak langkah.

---

## Komponen UI
| Komponen | Tampilan | Saat disentuh |
| :--- | :--- | :--- |
| **TombolBesar** | Kapsul membulat zamrud, teks gading Nunito 36 px, bayangan bawah zamrud tua 6 px seperti tombol timbul; min 160 px tinggi | Turun 4 px, bayangan menipis, bunyi "tik" lembut |
| **KartuAyat** | Latar gading, bingkai mushaf emas, lengkung mihrab di atas, nomor ayat dalam bulatan kecil | Bingkai menebal dan bercahaya emas tipis |
| **TombolAudio** | Lingkaran emas dengan ikon putar, cincin denyut pelan saat audio berjalan | Memutar atau menjeda audio |
| **PapanSkor** | Dua panel gulungan kertas (zamrud dan biru laut) di kiri-kanan atas, angka Baloo 2 72 px | Angka naik bertahap saat poin bertambah |
| **BintangHadiah** | Bintang delapan emas, kosong berupa garis putus-putus | Mengisi dengan kilau lembut satu per satu |
| **Lencana** | Medali bintang delapan dengan nama surah atau gelar dalam tulisan Amiri | Berputar pelan sekali saat pertama didapat |
| **JalurProgres** | Jalan setapak dengan jejak kaki, bukan bilah progres biasa | Jejak bertambah satu langkah per soal |
| **GelembungNur** | Balon bicara gading dengan ekor ke arah Nur, teks maksimal satu kalimat | Hilang otomatis setelah 4 detik |

*Semua sudut membulat (radius 24 px untuk kartu, 999 px untuk tombol kapsul). Bayangan memakai warna zamrud tua transparan, bukan hitam.*

---

## Desain per Layar

### Beranda
Latar langit fajar dengan siluet bukit pasir dan pohon kurma, lentera besar bercahaya di tengah, judul Petualangan Juz 'Amma dalam Baloo 2 di atasnya. Di bawahnya dua tombol besar: Mulai Petualangan dan Duel Tim. Tombol Mode Guru berupa ikon kecil di pojok kanan bawah yang harus ditahan 2 detik agar tidak tersentuh siswa.

### Peta Petualangan
Peta bergulir horizontal dengan jalur berkelok dari kiri ke kanan, dibagi tiga wilayah:
- **Oase Fajar (Kelas 4)**: An-Nas $\rightarrow$ Ad-Dhuha (22 pos) | Pagi cerah, oase, pohon kurma
- **Lembah Senja (Kelas 5)**: Al-Lail $\rightarrow$ Al-A'la (6 pos) | Langit jingga, tebing batu, tenda kafilah
- **Puncak Bintang (Kelas 6)**: At-Thariq $\rightarrow$ An-Naba' (9 pos) | Malam berbintang, bukit tinggi, lentera di puncak

Setiap pos berbentuk medali bulat dengan nama surah Arab dan Latin di bawahnya. Status pos: terkunci (abu pasir + ikon gembok), terbuka (berdenyut pelan), tuntas (lentera menyala + 1–3 bintang). Penanda kafilah berupa bendera kecil di pos yang sedang aktif.

### Pos Surah
Panel gerbang berbentuk lengkung mihrab berisi nama surah besar, arti, jumlah ayat, dan tombol dengar bacaan lengkap. Di bawahnya kartu-kartu mini-game yang tersedia, masing-masing dengan ikon tematik dan bintang yang sudah diraih.

### Layar Mini-Game
Tata letak tetap: bilah atas berisi tombol Kembali ke Peta, nama surah, dan JalurProgres; area tengah untuk ayat dan pilihan jawaban; Nur di pojok kiri bawah. Ayat selalu berada di area tengah atas dengan ruang kosong di sekitarnya.

### Duel Tim
Layar terbelah oleh garis vertikal berornamen geometris. Sisi kiri bernuansa zamrud, sisi kanan biru laut, masing-masing dengan bendera tim dan buzzer bulat besar di bawah. Soal ayat berada di tengah atas dalam KartuAyat yang melintasi kedua sisi.

### Hasil
Latar gelap lembut dengan lentera yang menyala bertahap, bintang yang terisi satu per satu, lalu pesan Nur seperti "Masya Allah, lentera Al-Fil menyala!". Dua tombol: Lanjut ke Peta dan Main Lagi. Pada Duel Tim, kedua tim mendapat ucapan, pemenang mendapat mahkota bintang di benderanya.

### Mode Guru
Tampilan lebih sederhana dan informatif: latar gading polos, tanpa animasi, tabel rekap besar, dan sakelar pengaturan berukuran besar. Mode ini tetap memakai palet yang sama agar terasa satu aplikasi.

---

## Animasi dan Suara
| Momen | Animasi | Suara |
| :--- | :--- | :--- |
| **Sentuh tombol** | Tombol turun 4 px, 120 ms | Bunyi "tik" kayu lembut |
| **Jawaban benar** | Kartu bercahaya emas, Nur bersinar, 400 ms | Denting lonceng kecil |
| **Jawaban perlu diulang** | Kartu bergeser kiri-kanan pelan 2 kali, 300 ms | Bunyi "tuk" rendah yang tidak mengagetkan |
| **Pos tuntas** | Lentera di peta menyala dari redup ke terang, 1 detik | Denting naik tiga nada |
| **Bintang terisi** | Bintang membesar lalu kembali, 300 ms per bintang | Denting per bintang |
| **Pindah layar** | Geser lembut ke samping, 250 ms | Tidak ada |

### Aturan Suara:
- Tidak ada musik latar berinstrumen. Gunakan suasana alam (angin gurun, gemericik oase) dengan volume rendah, atau nasyid vokal/perkusi yang bisa dimatikan dari Mode Guru.
- Semua suara efek dibuat sintetis dengan Web Audio API atau bebas lisensi, dan bisa dimatikan terpisah dari audio qari.
- Saat audio ayat berjalan: suara efek dan suasana diredam, animasi dihentikan, dan Nur diam.
- Hormati pengaturan sistem `prefers-reduced-motion`.

---

## Adab dan Batasan Visual
1. Teks ayat tidak pernah diputar, dimiringkan, dipotong bingkai, ditimpa elemen lain, atau dianimasikan jatuh, pecah, terbang, maupun terbakar.
2. Ayat tidak diletakkan di lantai, alas kaki, tempat sampah, atau di dekat ikon gagal.
3. Kartu ayat yang salah dipilih tidak dibuang atau dilempar; kartu cukup meredup lalu kembali ke tempatnya.
4. Tidak ada gambar Nabi, malaikat, para sahabat, atau figur manusia yang realistis.
5. Tidak ada simbol agama lain, salib, bintang Daud, atau ikon yang menyerupai sesajen.
6. Tidak ada gambar babi, anjing sebagai hiasan, minuman keras, atau unsur yang tidak pantas untuk sekolah Islam.
7. Kaligrafi dekoratif hanya memakai nama surah, kata Bismillah, atau kata motivasi (mis. Masya Allah, Barakallah), bukan potongan ayat yang dijadikan hiasan.
8. Ucapan dan teks Nur memakai bahasa Indonesia yang santun, positif, dan tidak mengejek.
