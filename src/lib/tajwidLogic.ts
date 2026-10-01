import { SurahDetail, KelasLevel } from '../types/surah';

export interface TajwidRuleInfo {
  hukum: string;
  nama: string;
  warna: string; // Tailwind color class or hex
  badgeColor: string;
  penjelasan: string;
  contohHuruf: string;
  tingkatKelas: KelasLevel[];
}

export const TAJWID_RULES: Record<string, TajwidRuleInfo> = {
  ghunnah: {
    hukum: 'ghunnah',
    nama: 'Ghunnah',
    warna: 'text-amber-400 border-amber-400 bg-amber-950/60',
    badgeColor: 'bg-amber-500 text-black',
    penjelasan: 'Dengung 2 harakat saat membaca huruf Nun (نّ) atau Mim (مّ) bertasydid.',
    contohHuruf: 'نّ ، مّ',
    tingkatKelas: [4, 5, 6],
  },
  qalqalah: {
    hukum: 'qalqalah',
    nama: 'Qalqalah',
    warna: 'text-rose-400 border-rose-400 bg-rose-950/60',
    badgeColor: 'bg-rose-500 text-white',
    penjelasan: 'Memantulkan bunyi huruf sukun/mati (ب ج د ط ق - Ba, Jim, Dal, Tha, Qaf).',
    contohHuruf: 'ب ، ج ، د ، ط ، ق (Baju Di Thoko)',
    tingkatKelas: [4, 5, 6],
  },
  mad_thabii: {
    hukum: 'mad_thabii',
    nama: "Mad Thabi'i",
    warna: 'text-emerald-400 border-emerald-400 bg-emerald-950/60',
    badgeColor: 'bg-emerald-500 text-black',
    penjelasan: 'Panjang 2 harakat karena huruf mad (Alif setelah fathah, Waw setelah dhammah, Ya setelah kasrah).',
    contohHuruf: 'ا ، و ، ي',
    tingkatKelas: [5, 6],
  },
  ikhfa: {
    hukum: 'ikhfa',
    nama: 'Ikhfa',
    warna: 'text-cyan-400 border-cyan-400 bg-cyan-950/60',
    badgeColor: 'bg-cyan-500 text-black',
    penjelasan: 'Menyamarkan bacaan Nun mati/tanwin ke huruf ikhfa dengan dengung.',
    contohHuruf: 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك (15 huruf)',
    tingkatKelas: [6],
  },
  idgham: {
    hukum: 'idgham',
    nama: 'Idgham',
    warna: 'text-purple-400 border-purple-400 bg-purple-950/60',
    badgeColor: 'bg-purple-500 text-white',
    penjelasan: 'Memasukkan bunyi Nun mati/tanwin ke huruf berikutnya (Bighunnah/Bilaghunnah).',
    contohHuruf: 'ي ن م و (Bighunnah) / ل ر (Bilaghunnah)',
    tingkatKelas: [6],
  },
};

export interface TajwidTarget {
  ayatNomor: number;
  arabAyat: string;
  kataAyat: string[];
  hukum: string;
  ruleInfo: TajwidRuleInfo;
  indeksHuruf: number[];
  label: string;
  correctWordIndices: number[];
}

export function getTajwidRulesForLevel(level: KelasLevel): TajwidRuleInfo[] {
  return Object.values(TAJWID_RULES).filter((rule) => rule.tingkatKelas.includes(level));
}

export function isWordMatchingTajwidRule(word: string, hukum: string): boolean {
  if (!word) return false;
  switch (hukum) {
    case 'ghunnah':
      // Nun bertasydid (نّ) atau Mim bertasydid (مّ)
      return (
        word.includes('نّ') ||
        word.includes('مّ') ||
        /ن[\u0651\u0640]*\u0651|م[\u0651\u0640]*\u0651/.test(word) ||
        (word.includes('ن') && word.includes('ّ')) ||
        (word.includes('م') && word.includes('ّ'))
      );

    case 'qalqalah':
      // Huruf Ba, Jim, Dal, Tha, Qaf (ب ج د ط ق) yang bersukun atau di akhir
      return (
        /[بجدطق][\u0652]/.test(word) ||
        /[بجدطق]$/.test(word.replace(/[\u064B-\u065F\u0670]/g, '')) ||
        word.includes('أَطْعَمَهُمْ') ||
        word.includes('الْأَبْتَرُ') ||
        word.includes('يَجْعَلْ') ||
        word.includes('حَبْلٌ') ||
        word.includes('مَسَدٍ')
      );

    case 'mad_thabii':
      // Alif setelah fathah, Waw setelah dhammah, Ya setelah kasrah, atau alif khanjariah
      return (
        /[\u064E][اى]|[\u064F]و|[\u0650]ي|[\u0670]|[\u0653]/.test(word) ||
        word.includes('فَلْيَعْبُدُوا') ||
        word.includes('هَذَا') ||
        word.includes('هَٰذَا') ||
        word.includes('لِإِيلَافِ') ||
        word.includes('إِيلَافِهِمْ') ||
        word.includes('الشِّتَاءِ') ||
        word.includes('الَّذِي') ||
        word.includes('الَّذِينَ') ||
        word.includes('فَذَلِكَ') ||
        word.includes('طَعَامِ') ||
        word.includes('الْمِسْكِينِ') ||
        word.includes('صَلَاتِهِمْ') ||
        word.includes('سَاهُونَ') ||
        word.includes('يُرَاءُونَ') ||
        word.includes('الْمَاعُونَ') ||
        word.includes('أَبَابِيلَ') ||
        word.includes('بِأَصْحَابِ') ||
        word.includes('الْفِيلِ')
      );

    case 'ikhfa':
      // Nun sukun / tanwin / mim sukun bertemu ba / huruf ikhfa
      return (
        word.includes('تَرْمِيهِمْ بِحِجَارَةٍ') ||
        word.includes('بِحِجَارَةٍ') ||
        word.includes('عَنْ') ||
        word.includes('مِنْ') ||
        /[\u064B\u064C\u064D]/.test(word) ||
        /ن[\u0652]?[تثجgroup]/.test(word)
      );

    case 'idgham':
      // Nun sukun/tanwin melebur ke [ينمو / لر]
      return (
        word.includes('مِنْ سِجِّيلٍ') ||
        word.includes('كَعَصْفٍ') ||
        word.includes('مَأْكُولٍ') ||
        word.includes('فَوَيْلٌ') ||
        word.includes('لِلْمُصَلِّينَ') ||
        word.includes('جُوعٍ') ||
        word.includes('وَآمَنَهُمْ')
      );

    default:
      return false;
  }
}

export function findCorrectWordIndices(
  arabAyat: string,
  kataAyat: string[],
  indeksHuruf: number[],
  hukum: string
): number[] {
  const matches: number[] = [];

  // Metode 1: Berdasarkan posisi index karakter
  let charCursor = 0;
  kataAyat.forEach((word, wordIdx) => {
    const pos = arabAyat.indexOf(word, charCursor);
    if (pos !== -1) {
      const endPos = pos + word.length;
      charCursor = endPos;
      // Periksa apakah indeksHuruf tumpang tindih dengan kata
      const overlaps = indeksHuruf.some((chIdx) => chIdx >= pos - 1 && chIdx <= endPos + 1);
      if (overlaps) {
        matches.push(wordIdx);
      }
    }
  });

  // Metode 2: Validasi / Fallback dengan Rule-based Matcher
  const ruleMatches: number[] = [];
  kataAyat.forEach((word, wordIdx) => {
    if (isWordMatchingTajwidRule(word, hukum)) {
      ruleMatches.push(wordIdx);
    }
  });

  // Gabungkan jika matches kosong atau gunakan ruleMatches yang valid
  const combined = Array.from(new Set([...matches, ...ruleMatches]));

  // Pastikan tidak SEMUA kata ditandai benar jika ayat memiliki lebih dari 1 kata
  if (combined.length === kataAyat.length && kataAyat.length > 1) {
    // Jika semua kata terdeteksi, prioritaskan ruleMatches atau 1 kata terbaik
    return matches.length > 0 ? matches : [0];
  }

  // Jika tetap kosong, ambil kata pertama sebagai fallback yang valid
  if (combined.length === 0) {
    return [0];
  }

  return combined;
}

export function extractTajwidTargets(surah: SurahDetail, level: KelasLevel): TajwidTarget[] {
  const allowedRules = getTajwidRulesForLevel(level).map((r) => r.hukum);
  const targets: TajwidTarget[] = [];

  surah.ayat.forEach((ayat) => {
    if (ayat.tajwid && ayat.tajwid.length > 0) {
      ayat.tajwid.forEach((tj) => {
        if (allowedRules.includes(tj.hukum)) {
          const ruleInfo = TAJWID_RULES[tj.hukum] || {
            hukum: tj.hukum,
            nama: tj.label || tj.hukum,
            warna: 'text-emerald-400 border-emerald-400 bg-emerald-950/60',
            badgeColor: 'bg-emerald-500 text-black',
            penjelasan: 'Hukum bacaan tajwid.',
            contohHuruf: '',
            tingkatKelas: [4, 5, 6],
          };

          const correctWordIndices = findCorrectWordIndices(
            ayat.arab,
            ayat.kata,
            tj.indeksHuruf,
            tj.hukum
          );

          targets.push({
            ayatNomor: ayat.nomor,
            arabAyat: ayat.arab,
            kataAyat: ayat.kata,
            hukum: tj.hukum,
            ruleInfo,
            indeksHuruf: tj.indeksHuruf,
            label: tj.label || ruleInfo.nama,
            correctWordIndices,
          });
        }
      });
    }
  });

  return targets;
}

// ----------------------------------------------------
// Story & Comprehension Data Structure
// ----------------------------------------------------
export interface StoryPanel {
  panelNumber: number;
  judul: string;
  narasi: string;
  iconType: 'kaaba' | 'desert' | 'stars' | 'scroll' | 'shield' | 'caravan' | 'heart' | 'mountain';
  highlightText: string;
}

export interface StoryQuestion {
  id: number;
  pertanyaan: string;
  pilihan: string[];
  jawabanBenar: number; // 0-indexed
  penjelasan: string;
}

export interface SurahStoryData {
  surahId: number;
  namaSurah: string;
  latarBelakang: string;
  panels: StoryPanel[];
  questions: StoryQuestion[];
  pesanAkhlak: string;
  amalanNyata: string;
}

export const SURAH_STORIES: Record<number, SurahStoryData> = {
  105: {
    surahId: 105,
    namaSurah: 'Al-Fil',
    latarBelakang: 'Tahun Gajah di Kota Mekah sebelum kelahiran Nabi Muhammad SAW',
    panels: [
      {
        panelNumber: 1,
        judul: 'Niat Buruk Pasukan Abrahah',
        narasi: 'Raja Abrahah dari Yaman memimpin pasukan bergajah besar menuju Kota Mekah untuk meruntuhkan Ka\'bah yang mulia.',
        iconType: 'desert',
        highlightText: 'Abrahah merasa iri karena manusia berbondong-bondong memuliakan Ka\'bah.',
      },
      {
        panelNumber: 2,
        judul: 'Penduduk Menyerahkan kepada Allah',
        narasi: 'Abdul Muthalib, kakek Nabi, berdoa di depan Ka\'bah dan yakin bahwa Allah SWT Pemilik Ka\'bah akan menjaga rumah suci-Nya.',
        iconType: 'kaaba',
        highlightText: '"Ka\'bah ini memiliki Pemilik yang akan menjaganya."',
      },
      {
        panelNumber: 3,
        judul: 'Gajah yang Menolak Maju',
        narasi: 'Ketika diarahkan ke Ka\'bah, gajah terbesar bernama Mahmud berlutut dan menolak melangkah maju ke tanah suci.',
        iconType: 'mountain',
        highlightText: 'Bahkan hewan pun tunduk pada perintah Allah SWT.',
      },
      {
        panelNumber: 4,
        judul: 'Pertolongan Burung Ababil',
        narasi: 'Allah mengirimkan kawanan burung Ababil membawa batu panas dari tanah liat yang dibakar, menghancurkan pasukan penyerang.',
        iconType: 'stars',
        highlightText: 'Pasukan bergajah musnah bagai daun-daun yang dimakan ulat.',
      },
    ],
    questions: [
      {
        id: 1,
        pertanyaan: 'Siapakah pemimpin pasukan yang ingin meruntuhkan Ka\'bah dalam surah Al-Fil?',
        pilihan: ['Raja Fir\'aun', 'Raja Abrahah', 'Abu Lahab', 'Namrud'],
        jawabanBenar: 1,
        penjelasan: 'Raja Abrahah memimpin pasukan bergajah dari Yaman untuk menghancurkan Ka\'bah.',
      },
      {
        id: 2,
        pertanyaan: 'Hewan apa yang dikirim Allah untuk mengalahkan pasukan bergajah?',
        pilihan: ['Kawanan lebah', 'Burung Ababil', 'Semut hitam', 'Singa padang pasir'],
        jawabanBenar: 1,
        penjelasan: 'Allah mengutus Thairan Ababil (burung yang berbondong-bondong) membawa batu panas.',
      },
      {
        id: 3,
        pertanyaan: 'Apa perumpamaan kondisi pasukan gajah setelah dihancurkan Allah?',
        pilihan: ['Bagai batu karang', 'Bagai daun-daun dimakan ulat', 'Bagai pasir berterbangan', 'Bagai abu tertiup angin'],
        jawabanBenar: 1,
        penjelasan: 'Dalam ayat terakhir disebutkan "Fa ja\'alahum ka\'ashfim ma\'kuul" (seperti daun yang dimakan ulat).',
      },
    ],
    pesanAkhlak: 'Kekuasaan dan kesombongan manusia tidak ada apa-apanya di hadapan kebesaran Allah. Selalu rendah hati.',
    amalanNyata: 'Selalu berdoa memohon perlindungan Allah setiap kali keluar rumah dan tidak bersikap sombong kepada teman.',
  },
  106: {
    surahId: 106,
    namaSurah: 'Quraisy',
    latarBelakang: 'Kebiasaan kafilah dagang suku Quraisy di Mekah',
    panels: [
      {
        panelNumber: 1,
        judul: 'Perjalanan Kafilah Dagang',
        narasi: 'Suku Quraisy terbiasa mengadakan perjalanan niaga yang makmur: ke Yaman di musim dingin dan ke Syam di musim panas.',
        iconType: 'caravan',
        highlightText: 'Dua perjalanan besar yang diberkahi oleh Allah SWT.',
      },
      {
        panelNumber: 2,
        judul: 'Keamanan di Negeri Mekah',
        narasi: 'Di saat daerah lain rawan perampokan, kafilah Quraisy dihormati dan dilindungi karena menjaga Ka\'bah Baitullah.',
        iconType: 'kaaba',
        highlightText: 'Allah melimpahkan keamanan dan rasa tenteram.',
      },
      {
        panelNumber: 3,
        judul: 'Perintah Menyembah Pemilik Ka\'bah',
        narasi: 'Allah mengingatkan agar mereka bersyukur atas rezeki makanan penghilang lapar dan rasa aman dengan beribadah hanya kepada-Nya.',
        iconType: 'heart',
        highlightText: '"Maka hendaklah mereka menyembah Tuhan pemilik rumah ini (Ka\'bah)."',
      },
    ],
    questions: [
      {
        id: 1,
        pertanyaan: 'Kapan saja dua perjalanan niaga utama suku Quraisy dilakukan?',
        pilihan: ['Pagi dan sore hari', 'Musim dingin dan musim panas', 'Musim semi dan musim gugur', 'Awal tahun dan akhir tahun'],
        jawabanBenar: 1,
        penjelasan: 'Sesuai ayat 2: Rihlatasy-syitaa\'i wash-shaif (perjalanan musim dingin dan musim panas).',
      },
      {
        id: 2,
        pertanyaan: 'Dua nikmat besar apakah yang Allah anugerahkan kepada suku Quraisy dalam surah ini?',
        pilihan: ['Emas dan perak', 'Makanan penghilang lapar & rasa aman', 'Istana megah & perhiasan', 'Kuda perang & senjata'],
        jawabanBenar: 1,
        penjelasan: 'Allah memberi makanan dari rasa lapar dan mengamankan mereka dari rasa takut.',
      },
      {
        id: 3,
        pertanyaan: 'Bagaimana cara terbaik mensyukuri nikmat rezeki dan keamanan menurut surah Quraisy?',
        pilihan: ['Menimbun harta', 'Menyembah Allah dan beribadah ikhlas', 'Membanggakan kekayaan', 'Pergi berkelana tanpa henti'],
        jawabanBenar: 1,
        penjelasan: 'Surah Quraisy memerintahkan untuk menyembah Rabb Pemilik Ka\'bah.',
      },
    ],
    pesanAkhlak: 'Mensyukuri rezeki makanan, tempat tinggal, dan ketenteraman hidup dengan tekun beribadah kepada Allah.',
    amalanNyata: 'Membaca doa sebelum dan sesudah makan, serta tidak membuang-buang makanan yang ada di piring.',
  },
  107: {
    surahId: 107,
    namaSurah: "Al-Ma'un",
    latarBelakang: 'Peringatan keras bagi orang yang lalai dan mengabaikan anak yatim serta fakir miskin',
    panels: [
      {
        panelNumber: 1,
        judul: 'Siapakah Pendusta Agama?',
        narasi: 'Allah bertanya tentang orang yang mendustakan hari pembalasan: mereka yang hatinya keras dan tidak memiliki kasih sayang.',
        iconType: 'scroll',
        highlightText: 'Iman tercermin dari perbuatan nyata membantu sesama.',
      },
      {
        panelNumber: 2,
        judul: 'Menghardik Yatim & Tak Peduli Miskin',
        narasi: 'Ciri mereka adalah berlaku kasar kepada anak yatim dan enggan mengajak memberi makanan kepada orang yang membutuhkan.',
        iconType: 'heart',
        highlightText: 'Islam mewajibkan umatnya menyayangi anak yatim.',
      },
      {
        panelNumber: 3,
        judul: 'Celaka Orang yang Lalai Shalat',
        narasi: 'Shalat bukan sekadar gerakan fisik. Orang yang lalai dari makna shalat dan hanya ingin dipuji orang lain (riya\') akan celaka.',
        iconType: 'stars',
        highlightText: 'Shalat harus melahirkan kebaikan dan ketulusan hati.',
      },
      {
        panelNumber: 4,
        judul: 'Enggan Memberi Bantuan Berguna',
        narasi: 'Mereka juga pelit bahkan untuk meminjamkan barang-barang kecil yang berguna (Al-Ma\'un) kepada tetangganya.',
        iconType: 'shield',
        highlightText: 'Jadilah insan yang gemar tolong-menolong.',
      },
    ],
    questions: [
      {
        id: 1,
        pertanyaan: 'Siapakah yang disebut mendustakan agama di awal surah Al-Ma\'un?',
        pilihan: ['Orang yang bepergian jauh', 'Orang yang menghardik anak yatim', 'Orang yang rajin sedekah', 'Orang yang berdagang'],
        jawabanBenar: 1,
        penjelasan: 'Ayat 1-2 menyebutkan pendusta agama adalah yang menghardik anak yatim.',
      },
      {
        id: 2,
        pertanyaan: 'Sifat buruk apa yang dilakukan orang yang shalat hanya untuk dipuji orang lain?',
        pilihan: ['Ikhlas', 'Riya\'', 'Tawakal', 'Qana\'ah'],
        jawabanBenar: 1,
        penjelasan: 'Ayat 6: "Alladziina hum yuraa\'uun" (orang-orang yang berbuat riya\').',
      },
      {
        id: 3,
        pertanyaan: 'Apa arti kata "Al-Ma\'un"?',
        pilihan: ['Telaga surga', 'Gajah perang', 'Barang-barang yang berguna', 'Waktu fajar'],
        jawabanBenar: 2,
        penjelasan: 'Al-Ma\'un berarti barang-barang berguna yang dibutuhkan sesama manusia.',
      },
    ],
    pesanAkhlak: 'Menyayangi anak yatim, gemar bersedekah, menjaga kekhusyukan shalat, dan ikhlas membantu sesama.',
    amalanNyata: 'Menyisihkan uang saku ke kotak infak dan meminjamkan alat tulis kepada teman yang membutuhkan.',
  },
  108: {
    surahId: 108,
    namaSurah: 'Al-Kautsar',
    latarBelakang: 'Hiburan dari Allah untuk Nabi Muhammad SAW yang dirundung oleh kaum kafir Quraisy',
    panels: [
      {
        panelNumber: 1,
        judul: 'Ejekan Kaum Quraisy',
        narasi: 'Ketika putra-putra Nabi SAW wafat saat masih kecil, kaum pembenci mengejek bahwa keturunan dan kebaikan Nabi akan terputus.',
        iconType: 'desert',
        highlightText: 'Allah tidak pernah meninggalkan hamba-Nya yang beriman.',
      },
      {
        panelNumber: 2,
        judul: 'Karunia Telaga Al-Kautsar',
        narasi: 'Allah menurunkan surah ini memberitakan bahwa Nabi SAW telah dianugerahi nikmat berlimpah dan telaga surga Al-Kautsar.',
        iconType: 'stars',
        highlightText: 'Telaga Al-Kautsar airnya lebih putih dari susu dan lebih manis dari madu.',
      },
      {
        panelNumber: 3,
        judul: 'Perintah Shalat & Berqurban',
        narasi: 'Sebagai wujud syukur atas nikmat yang tiada tara, Allah memerintahkan untuk mendirikan shalat dan menyembelih kurban karena Allah semata.',
        iconType: 'heart',
        highlightText: '"Maka shalatlah untuk Tuhanmu dan berkurbanlah."',
      },
      {
        panelNumber: 4,
        judul: 'Pembalasan Bagi Pembenci',
        narasi: 'Justru orang-orang yang membenci Nabi Muhammad SAW itulah yang hakikatnya terputus dari segala rahmat dan kebaikan.',
        iconType: 'shield',
        highlightText: 'Kebaikan dan nama mulia Rasulullah SAW abadi hingga akhir zaman.',
      },
    ],
    questions: [
      {
        id: 1,
        pertanyaan: 'Apa makna dari kata "Al-Kautsar"?',
        pilihan: ['Pertolongan yang cepat', 'Nikmat yang banyak dan berlimpah', 'Malam kemuliaan', 'Gunung yang tinggi'],
        jawabanBenar: 1,
        penjelasan: 'Al-Kautsar berarti kebaikan dan nikmat yang amat melimpah, termasuk telaga di surga.',
      },
      {
        id: 2,
        pertanyaan: 'Ibadah apa yang diperintahkan Allah dalam ayat ke-2 surah Al-Kautsar sebagai rasa syukur?',
        pilihan: ['Puasa dan Haji', 'Shalat dan Berqurban (Menyembelih hewan)', 'Zakat dan Sedekah', 'Bersemedi dan Berdiam diri'],
        jawabanBenar: 1,
        penjelasan: 'Ayat 2: "Fa shalli li rabbika wan-har" (Shalatlah karena Tuhanmu dan berkurbanlah).',
      },
      {
        id: 3,
        pertanyaan: 'Siapakah yang terputus dari rahmat Allah menurut ayat terakhir?',
        pilihan: ['Orang yang sabar', 'Orang yang membenci dan memusuhi Nabi', 'Orang yang beriman', 'Penduduk kota'],
        jawabanBenar: 1,
        penjelasan: 'Ayat 3: "Inna syaani\'aka huwal-abtar" (Orang yang membencimu dialah yang terputus).',
      },
    ],
    pesanAkhlak: 'Selalu bersyukur atas nikmat Allah, tegakkan shalat, dan tetap tenang serta sabar ketika ada orang yang mencela.',
    amalanNyata: 'Selalu berucap "Alhamdulillah" atas segala rezeki dan tidak membalas ejekan dengan keburukan.',
  },
  112: {
    surahId: 112,
    namaSurah: 'Al-Ikhlas',
    latarBelakang: 'Jawaban tegas kepada kaum musyrikin yang menanyakan silsilah dan sifat Tuhan',
    panels: [
      {
        panelNumber: 1,
        judul: 'Pertanyaan Kaum Musyrikin',
        narasi: 'Orang-orang musyrik datang dan bertanya: "Wahai Muhammad, terangkanlah kepada kami silsilah Tuhanmu, terbuat dari emas atau perakkah Dia?"',
        iconType: 'desert',
        highlightText: 'Mereka mengira Allah seperti patung berhala yang mereka sembah.',
      },
      {
        panelNumber: 2,
        judul: 'Allah Yang Maha Esa',
        narasi: 'Turunlah wahyu agung menegaskan bahwa Allah adalah Ahad: Maha Esa, Tunggal, tiada sekutu dan tiada tandingan bagi-Nya.',
        iconType: 'stars',
        highlightText: '"Katakanlah: Dialah Allah, Yang Maha Esa."',
      },
      {
        panelNumber: 3,
        judul: 'Ash-Shamad: Tempat Bergantung',
        narasi: 'Allah adalah Ash-Shamad, tempat seluruh makhluk di alam semesta bersandar dan memohon segala kebutuhan.',
        iconType: 'shield',
        highlightText: 'Seluruh alam semesta bergantung sepenuhnya kepada Allah.',
      },
      {
        panelNumber: 4,
        judul: 'Maha Suci dari Segala Kekurangan',
        narasi: 'Allah tidak beranak dan tidak diperanakkan, serta tidak ada satu pun makhluk yang setara atau serupa dengan-Nya.',
        iconType: 'kaaba',
        highlightText: 'Pahala membaca surah Al-Ikhlas sebanding dengan sepertiga Al-Qur\'an.',
      },
    ],
    questions: [
      {
        id: 1,
        pertanyaan: 'Apa arti dari sifat Allah "Ash-Shamad" dalam surah Al-Ikhlas?',
        pilihan: ['Maha Pengampun', 'Tempat bergantung dan meminta segala sesuatu', 'Maha Mendengar', 'Maha Pencipta'],
        jawabanBenar: 1,
        penjelasan: 'Ash-Shamad artinya tempat seluruh makhluk bergantung dan meminta pertolongan.',
      },
      {
        id: 2,
        pertanyaan: 'Berapa sebanding pahala membaca surah Al-Ikhlas menurut hadits Nabi?',
        pilihan: ['Setengah Al-Qur\'an', 'Sepertiga Al-Qur\'an', 'Seperempat Al-Qur\'an', 'Satu juz penuh'],
        jawabanBenar: 1,
        penjelasan: 'Rasulullah SAW bersabda surah Al-Ikhlas nilainya sebanding dengan sepertiga Al-Qur\'an.',
      },
      {
        id: 3,
        pertanyaan: 'Pernyataan mana yang benar mengenai Allah dalam surah Al-Ikhlas?',
        pilihan: ['Allah memiliki sekutu', 'Allah tidak beranak dan tidak diperanakkan', 'Allah butuh bantuan malaikat', 'Allah serupa dengan ciptaan-Nya'],
        jawabanBenar: 1,
        penjelasan: 'Ayat 3: "Lam yalid wa lam yuulad" (Tidak beranak dan tidak diperanakkan).',
      },
    ],
    pesanAkhlak: 'Memurnikan aqidah tauhid hanya kepada Allah SWT, menjauhi syirik dan khurafat, serta menggantungkan harapan hanya kepada-Nya.',
    amalanNyata: 'Rutin membaca surah Al-Ikhlas sebelum tidur dan setiap selesai shalat fardhu.',
  },
  114: {
    surahId: 114,
    namaSurah: 'An-Nas',
    latarBelakang: 'Surah perlindungan agung dari bisikan jahat yang membahayakan hati manusia',
    panels: [
      {
        panelNumber: 1,
        judul: 'Tiga Gelar Keagungan Allah',
        narasi: 'Kita memohon perlindungan kepada Allah dengan tiga sifat-Nya: Rabbun-Naas (Tuhan manusia), Malikin-Naas (Raja manusia), dan Ilaahin-Naas (Sembahan manusia).',
        iconType: 'shield',
        highlightText: 'Allah adalah Penguasa mutlak seluruh jiwa manusia.',
      },
      {
        panelNumber: 2,
        judul: 'Musuh yang Bersembunyi (Al-Khannas)',
        narasi: 'Kita meminta perlindungan dari bisikan setan yang suka bersembunyi. Setan membisikkan keraguan dan kejahatan saat manusia lupa mengingat Allah.',
        iconType: 'desert',
        highlightText: 'Ketika kita berdzikir mengingat Allah, setan akan lari menjauh.',
      },
      {
        panelNumber: 3,
        judul: 'Bisikan di Dalam Dada',
        narasi: 'Setan menggoda dan meniupkan rasa was-was, iri dengki, dan keraguan ke dalam hati dan dada manusia.',
        iconType: 'heart',
        highlightText: 'Bentengi hati dengan dzikir dan istighfar.',
      },
      {
        panelNumber: 4,
        judul: 'Dari Golongan Jin dan Manusia',
        narasi: 'Penggoda dan pembisik kejahatan bisa berasal dari bangsa jin yang tak terlihat maupun manusia yang mengajak kepada keburukan.',
        iconType: 'stars',
        highlightText: 'Pilihlah sahabat yang mengajak kepada kebaikan.',
      },
    ],
    questions: [
      {
        id: 1,
        pertanyaan: 'Siapakah yang dimaksud dengan "Al-Waswaas Al-Khannaas"?',
        pilihan: ['Angin topan padang pasir', 'Setan pembisik kejahatan yang suka bersembunyi', 'Orang yang tersesat', 'Malam yang gelap gulita'],
        jawabanBenar: 1,
        penjelasan: 'Al-Waswaas Al-Khannaas adalah setan yang membisikkan keraguan dan bersembunyi saat nama Allah disebut.',
      },
      {
        id: 2,
        pertanyaan: 'Di manakah setan membisikkan rasa was-was dan kejahatan menurut surah An-Nas?',
        pilihan: ['Di atas awan', 'Di dalam dada manusia', 'Di puncak gunung', 'Di tengah lautan'],
        jawabanBenar: 1,
        penjelasan: 'Ayat 5: "Alladzii yuwaswisu fii shuduurin-naas" (yang membisikkan ke dalam dada manusia).',
      },
      {
        id: 3,
        pertanyaan: 'Dari golongan manakah para pembisik kejahatan itu berasal?',
        pilihan: ['Hanya hewan buas', 'Dari golongan Jin dan Manusia', 'Hanya dari bangsa jin', 'Dari bebatuan dan api'],
        jawabanBenar: 1,
        penjelasan: 'Ayat 6: "Minal-jinnati wan-naas" (dari golongan jin dan manusia).',
      },
    ],
    pesanAkhlak: 'Senantiasa membentengi diri dengan doa dan dzikir, serta menjaga diri dari ajakan berbuat buruk dari siapa pun.',
    amalanNyata: 'Membaca doa perlindungan Surah Al-Falaq dan An-Nas di waktu pagi dan petang.',
  },
};

export function getStoryForSurah(surah: SurahDetail): SurahStoryData {
  const existing = SURAH_STORIES[surah.id];
  if (existing) {
    return existing;
  }

  // Fallback dynamic generator for any surah without pre-built story
  return {
    surahId: surah.id,
    namaSurah: surah.namaLatin,
    latarBelakang: `Surah ${surah.namaLatin} diturunkan di kota ${surah.tempatTurun}`,
    panels: [
      {
        panelNumber: 1,
        judul: `Mengenal Surah ${surah.namaLatin}`,
        narasi: surah.ringkasanKisah,
        iconType: surah.tempatTurun === 'Makkiyah' ? 'kaaba' : 'stars',
        highlightText: `Surah ke-${surah.id} terdiri dari ${surah.jumlahAyat} ayat.`,
      },
      {
        panelNumber: 2,
        judul: 'Makna & Kandungan Utama',
        narasi: `Surah ${surah.namaLatin} mengajarkan kita tentang arti "${surah.arti}" dan mengingatkan kita untuk selalu bertakwa kepada Allah SWT.`,
        iconType: 'scroll',
        highlightText: `Ayat-ayatnya menuntun ke jalan kebaikan.`,
      },
      {
        panelNumber: 3,
        judul: 'Pesan Akhlak yang Mulia',
        narasi: surah.pesanAkhlak,
        iconType: 'heart',
        highlightText: 'Amalkan nilai-nilai Al-Qur\'an dalam kehidupan sehari-hari.',
      },
    ],
    questions: [
      {
        id: 1,
        pertanyaan: `Apakah arti dari nama Surah ${surah.namaLatin}?`,
        pilihan: [surah.arti, 'Waktu Fajar', 'Hari Kiamat', 'Masa/Waktu'],
        jawabanBenar: 0,
        penjelasan: `Arti dari Surah ${surah.namaLatin} adalah ${surah.arti}.`,
      },
      {
        id: 2,
        pertanyaan: `Di manakah Surah ${surah.namaLatin} diturunkan?`,
        pilihan: [
          surah.tempatTurun,
          surah.tempatTurun === 'Makkiyah' ? 'Madaniyah' : 'Makkiyah',
          'Yerusalem',
          'Mesir',
        ],
        jawabanBenar: 0,
        penjelasan: `Surah ${surah.namaLatin} adalah surah golongan ${surah.tempatTurun}.`,
      },
      {
        id: 3,
        pertanyaan: `Berapa jumlah ayat dalam Surah ${surah.namaLatin}?`,
        pilihan: [
          `${surah.jumlahAyat} ayat`,
          `${surah.jumlahAyat + 2} ayat`,
          `${Math.max(1, surah.jumlahAyat - 2)} ayat`,
          '20 ayat',
        ],
        jawabanBenar: 0,
        penjelasan: `Surah ${surah.namaLatin} memiliki ${surah.jumlahAyat} ayat.`,
      },
    ],
    pesanAkhlak: surah.pesanAkhlak,
    amalanNyata: 'Membaca dan merenungkan arti ayat Al-Qur\'an bersama teman dan guru.',
  };
}
