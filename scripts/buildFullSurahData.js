// Script to fetch and populate all 37 surahs of Juz 'Amma (Surah 78 to 114)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const surahListPath = path.join(__dirname, '../src/data/surah-list.json');
const sampleSurahsPath = path.join(__dirname, '../src/data/sample-surahs.json');

const surahList = JSON.parse(fs.readFileSync(surahListPath, 'utf8'));
let existingData = {};
if (fs.existsSync(sampleSurahsPath)) {
  try {
    existingData = JSON.parse(fs.readFileSync(sampleSurahsPath, 'utf8'));
  } catch (e) {
    existingData = {};
  }
}

const kisahData = {
  78: {
    ringkasanKisah: "Menjelaskan tentang berita besar Hari Kebangkitan yang diingkari oleh kaum musyrikin, serta penciptaan bumi, gunung sebagai pasak, dan pembalasan di akhirat.",
    pesanAkhlak: "Meyakini adanya hari pembalasan dan selalu mempersiapkan amal kebaikan selagi masih hidup di dunia."
  },
  79: {
    ringkasanKisah: "Menceritakan malaikat pencabut nyawa, kisah Nabi Musa AS menghadapi Firaun yang sombong, serta penegasan bahwa Hari Kiamat pasti datang.",
    pesanAkhlak: "Menjauhi sifat sombong seperti Firaun dan menundukkan hawa nafsu demi meraih keridhaan Allah."
  },
  80: {
    ringkasanKisah: "Teguran kasih sayang kepada Nabi Muhammad SAW saat bermuka masam kepada Abdullah bin Ummi Maktum, seorang sahabat tunanetra yang ingin belajar agama.",
    pesanAkhlak: "Memuliakan semua pencari ilmu tanpa memandang rupa, harta, maupun keterbatasan fisik."
  },
  81: {
    ringkasanKisah: "Menggambarkan dahsyatnya peristiwa kiamat ketika matahari digulung, bintang berjatuhan, dan setiap jiwa mengetahui apa yang telah diperbuatnya.",
    pesanAkhlak: "Al-Qur'an adalah petunjuk mulia dari Allah yang dibawa oleh malaikat Jibril untuk keselamatan manusia."
  },
  82: {
    ringkasanKisah: "Menguraikan langit yang terbelah dan malaikat Raqib-Atid yang mencatat segala perbuatan manusia.",
    pesanAkhlak: "Selalu berbuat jujur dan amanah karena semua amal dicatat oleh malaikat yang mulia."
  },
  83: {
    ringkasanKisah: "Peringatan keras bagi orang-orang yang curang dalam menimbang dan menakar, serta ganjaran kenikmatan bagi orang yang berbakti.",
    pesanAkhlak: "Menegakkan kejujuran dan keadilan dalam berniaga serta menghindari segala bentuk kecurangan."
  },
  84: {
    ringkasanKisah: "Langit yang patuh terbelah dan setiap insan yang menerima catatan amal dengan tangan kanan akan dihisab dengan mudah.",
    pesanAkhlak: "Bersemangat beramal saleh agar kelak menerima buku catatan amal dari sebelah kanan dengan gembira."
  },
  85: {
    ringkasanKisah: "Kisah keteguhan Ashabul Ukhdud (orang-orang beriman) yang dimasukkan ke dalam parit api karena mempertahankan tauhid kepada Allah.",
    pesanAkhlak: "Teguh dalam memegang keimanan dan keyakinan kepada Allah meskipun menghadapi ujian yang berat."
  },
  86: {
    ringkasanKisah: "Sumpah demi langit dan bintang yang bersinar terang (At-Thariq) bahwa setiap jiwa selalu memiliki malaikat penjaga.",
    pesanAkhlak: "Merenungkan asal penciptaan manusia agar senantiasa bersyukur dan tunduk kepada Sang Pencipta."
  },
  87: {
    ringkasanKisah: "Perintah menyucikan nama Allah Yang Maha Tinggi yang telah menciptakan dan menyempurnakan segala sesuatu.",
    pesanAkhlak: "Senantiasa berdzikir memuji Allah dan mendahulukan kehidupan akhirat yang lebih kekal."
  },
  88: {
    ringkasanKisah: "Menggambarkan suasana Hari Kiamat: wajah orang berdosa yang tertunduk dan wajah orang beriman yang berseri-seri di surga.",
    pesanAkhlak: "Merenungkan ciptaan Allah (unta, langit, gunung, bumi) sebagai bukti kebesaran-Nya."
  },
  89: {
    ringkasanKisah: "Sumpah demi waktu fajar dan peringatan dari kisah kaum 'Ad, Tsamud, dan Firaun yang dibinasakan karena melampaui batas.",
    pesanAkhlak: "Memuliakan anak yatim, memberi makan fakir miskin, dan menyambut panggilan Allah dengan jiwa yang tenang."
  },
  90: {
    ringkasanKisah: "Perjuangan manusia menempuh jalan yang mendaki dan sukar (Al-'Aqabah) dengan memerdekakan hamba sahaya dan menyantuni sesama.",
    pesanAkhlak: "Saling berpesan untuk bersabar dan berkasih sayang kepada sesama manusia."
  },
  91: {
    ringkasanKisah: "Sumpah demi matahari, bulan, siang, malam, dan jiwa manusia. Sungguh beruntung orang yang menyucikan jiwanya dan merugi orang yang mengotorinya.",
    pesanAkhlak: "Menjaga kebersihan hati dan tidak menentang perintah Allah seperti kaum Tsamud."
  },
  92: {
    ringkasanKisah: "Perbedaan balasan bagi orang yang suka memberi dan bertakwa dengan orang yang kikir dan merasa dirinya serba cukup.",
    pesanAkhlak: "Gemar berinfaq di jalan Allah dan yakin bahwa Allah akan memudahkan jalan menuju kebaikan."
  },
  93: {
    ringkasanKisah: "Hiburan dan janji Allah kepada Nabi Muhammad SAW bahwa masa depan akan lebih baik daripada masa lalu, dan Allah tidak pernah meninggalkannya.",
    pesanAkhlak: "Jangan berlaku sewenang-wenang kepada anak yatim, jangan menghardik peminta-minta, dan siarkanlah nikmat Allah."
  },
  94: {
    ringkasanKisah: "Kelapangan dada yang Allah berikan kepada Rasulullah SAW dan jaminan bahwa bersama kesulitan selalu ada kemudahan.",
    pesanAkhlak: "Optimis menghadapi kesulitan dan terus giat beramal saat selesai satu urusan (Fa idza faraghta fanshab)."
  },
  95: {
    ringkasanKisah: "Sumpah demi buah Tin, Zaitun, Bukit Sinai, dan Kota Makkah bahwa manusia diciptakan dalam bentuk yang sebaik-baiknya.",
    pesanAkhlak: "Menjaga kemuliaan diri dengan iman dan amal saleh agar tidak jatuh ke derajat yang paling rendah."
  },
  96: {
    ringkasanKisah: "Wahyu pertama Al-Qur'an yang memerintahkan membaca (Iqra') dengan nama Tuhan yang menciptakan manusia dari segumpal darah.",
    pesanAkhlak: "Semangat menuntut ilmu dan membaca, serta tidak sombong ketika merasa serba cukup."
  },
  97: {
    ringkasanKisah: "Malam kemuliaan Lailatul Qadr di mana Al-Qur'an diturunkan dan malaikat turun membawa kedamaian hingga terbit fajar.",
    pesanAkhlak: "Memperbanyak ibadah di malam-malam bulan Ramadhan untuk meraih kemuliaan yang lebih baik dari seribu bulan."
  },
  98: {
    ringkasanKisah: "Penjelasan tentang bukti nyata (Al-Bayyinah) dari Allah yang menyeru manusia untuk beribadah ikhlas dan mendirikan shalat.",
    pesanAkhlak: "Ikhlas dalam beragama, rajin shalat, dan menunaikan zakat sebagai sebaik-baik makhluk."
  },
  99: {
    ringkasanKisah: "Bumi yang digoncangkan sedahsyat-dahsyatnya pada hari kiamat dan mengeluarkan segala rahasia yang dikandungnya.",
    pesanAkhlak: "Sekecil apa pun kebaikan (seberat dzarrah) akan dibalas, dan sekecil apa pun keburukan juga akan dibalas."
  },
  100: {
    ringkasanKisah: "Kuda perang yang berlari kencang memercikkan bunga api dalam membela kebenaran, mengingatkan manusia agar tidak kufur nikmat.",
    pesanAkhlak: "Bersyukur atas nikmat Allah dan tidak terlalu cinta harta secara berlebihan."
  },
  101: {
    ringkasanKisah: "Peristiwa dahsyat Al-Qari'ah di mana manusia bagaikan anai-anai beterbangan dan gunung-gunung bagaikan bulu yang dihambur-hamburkan.",
    pesanAkhlak: "Memperberat timbangan kebaikan amal agar meraih kehidupan yang memuaskan di surga."
  },
  102: {
    ringkasanKisah: "Teguran bagi orang yang terlena oleh perlombaan memperbanyak harta hingga masuk ke liang kubur.",
    pesanAkhlak: "Menggunakan nikmat umur dan rezeki untuk ketaatan, karena kelak akan ditanya tentang segala kenikmatan."
  },
  103: {
    ringkasanKisah: "Sumpah demi masa bahwa sesungguhnya manusia berada dalam kerugian, kecuali orang yang beriman, beramal saleh, dan saling berpesan dalam kebenaran dan kesabaran.",
    pesanAkhlak: "Menghargai waktu dengan amal produktif dan saling menasehati dalam kebenaran dan kesabaran."
  },
  104: {
    ringkasanKisah: "Peringatan keras bagi para pengumpat, pencela, dan penimbun harta yang mengira hartanya dapat mengekalkannya.",
    pesanAkhlak: "Menjaga lisan dari ghibah dan mencela orang lain, serta gemar berbagi rezeki."
  },
  105: {
    ringkasanKisah: "Pasukan gajah yang dipimpin Abrahah ingin menghancurkan Ka'bah, namun Allah mengirimkan burung Ababil yang melempari mereka dengan batu panas dari tanah liat terbakar.",
    pesanAkhlak: "Kekuasaan manusia tidak ada artinya di hadapan keagungan Allah. Selalu rendah hati dan memohon perlindungan-Nya."
  },
  106: {
    ringkasanKisah: "Nikmat keamanan dan kemakmuran yang Allah anugerahkan kepada suku Quraisy dalam perjalanan dagang musim dingin dan musim panas.",
    pesanAkhlak: "Mensyukuri rezeki dan keamanan dengan beribadah hanya kepada Allah Tuhan pemilik Ka'bah."
  },
  107: {
    ringkasanKisah: "Ciri orang yang mendustakan agama: menghardik anak yatim, tidak menganjurkan memberi makan orang miskin, riya dalam shalat, dan enggan memberi bantuan barang berguna.",
    pesanAkhlak: "Menyayangi anak yatim, menolong fakir miskin, dan shalat dengan khusyuk demi Allah."
  },
  108: {
    ringkasanKisah: "Nikmat yang berlimpah (Al-Kautsar) yang Allah anugerahkan kepada Rasulullah SAW, serta perintah shalat dan berqurban.",
    pesanAkhlak: "Senantiasa mendirikan shalat dan berqurban sebagai wujud syukur atas limpahan nikmat Allah."
  },
  109: {
    ringkasanKisah: "Penegasan keteguhan tauhid Nabi Muhammad SAW menolak tawaran kaum kafir Quraisy untuk bergantian menyembah berhala.",
    pesanAkhlak: "Teguh dalam aqidah Islamiyah dan menjunjung toleransi beragama (Bagimu agamamu, bagiku agamaku)."
  },
  110: {
    ringkasanKisah: "Kabar gembira tentang pertolongan Allah dan pembebasan kota Makkah (Fathu Makkah) di mana manusia berbondong-bondong masuk Islam.",
    pesanAkhlak: "Banyak bertasbih memuji Allah dan beristighfar memohon ampun saat meraih kesuksesan."
  },
  111: {
    ringkasanKisah: "Kisah kebinasaan Abu Lahab dan istrinya yang selalu memusuhi dakwah Islam dan menyebarkan duri untuk menghalangi Rasulullah SAW.",
    pesanAkhlak: "Harta dan kedudukan tidak dapat menyelamatkan seseorang dari azab Allah jika tidak beriman."
  },
  112: {
    ringkasanKisah: "Penjelasan murni tentang sifat keesaan Allah: Dia Maha Esa, tempat bergantung segala sesuatu, tidak beranak dan tidak diperanakkan, serta tidak ada yang setara dengan-Nya.",
    pesanAkhlak: "Memurnikan tauhid dan keyakinan hanya kepada Allah Yang Maha Esa."
  },
  113: {
    ringkasanKisah: "Doa perlindungan kepada Allah Tuhan fajar subuh dari segala kejahatan makhluk, kegelapan malam, sihir, dan orang yang dengki.",
    pesanAkhlak: "Memohon perlindungan hanya kepada Allah dari segala keburukan dan menjauhi sifat iri dengki."
  },
  114: {
    ringkasanKisah: "Doa perlindungan kepada Allah Raja dan Sembahan manusia dari bisikan jahat setan yang bersembunyi, baik dari golongan jin maupun manusia.",
    pesanAkhlak: "Selalu berdzikir mengingat Allah agar hati terlindung dari bisikan dan godaan jahat."
  }
};

async function buildAllSurahs() {
  console.log('Starting full 37 surahs compilation...');
  const result = { ...existingData };

  for (const s of surahList) {
    const id = s.id;
    console.log(`Processing Surah ${id}: ${s.namaLatin}...`);

    if (result[String(id)] && result[String(id)].ayat && result[String(id)].ayat.length > 0 && id >= 105) {
      console.log(`Using existing data for Surah ${id}`);
      continue;
    }

    try {
      const resp = await fetch(`https://equran.id/api/v2/surat/${id}`);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const json = await resp.json();
      const data = json.data;

      const level = id >= 93 ? 4 : id >= 87 ? 5 : 6;
      const ringkasan = kisahData[id]?.ringkasanKisah || `Surah ${s.namaLatin} diturunkan di ${data.tempatTurun} dan terdiri dari ${data.jumlahAyat} ayat.`;
      const pesan = kisahData[id]?.pesanAkhlak || `Mengambil pelajaran berharga dari surah ${s.namaLatin} untuk diamalkan dalam kehidupan sehari-hari.`;

      const ayatList = data.ayat.map((a) => {
        const cleanArab = a.teksArab.trim();
        const words = cleanArab.split(/\s+/).filter(w => w.length > 0);
        return {
          nomor: a.nomorAyat,
          arab: cleanArab,
          kata: words,
          latin: a.teksLatin,
          terjemah: a.teksIndonesia,
          audio: `${String(id).padStart(3, '0')}${String(a.nomorAyat).padStart(3, '0')}.mp3`,
          tajwid: []
        };
      });

      result[String(id)] = {
        id: id,
        namaLatin: s.namaLatin,
        namaArab: s.namaArab || data.nama,
        arti: s.arti || data.arti,
        jumlahAyat: data.jumlahAyat,
        tempatTurun: data.tempatTurun,
        level: level,
        ringkasanKisah: ringkasan,
        pesanAkhlak: pesan,
        ayat: ayatList
      };

      console.log(`Successfully processed Surah ${id}: ${s.namaLatin} (${ayatList.length} ayat)`);
    } catch (err) {
      console.error(`Failed to fetch Surah ${id}:`, err.message);
    }
  }

  fs.writeFileSync(sampleSurahsPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Saved full dataset with ${Object.keys(result).length} surahs to ${sampleSurahsPath}`);
}

buildAllSurahs();
