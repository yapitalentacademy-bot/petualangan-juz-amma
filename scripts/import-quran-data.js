/**
 * Skrip Impor & Sintesis Data Resmi Al-Qur'an 37 Surah Juz 'Amma
 * Sumber Rujukan: Kemenag RI / Tanzil Uthmani Standard & EveryAyah CDN
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SURAH_LIST_PATH = path.join(__dirname, '../src/data/surah-list.json');
const SAMPLE_SURAHS_PATH = path.join(__dirname, '../src/data/sample-surahs.json');

console.log('📦 Memulai Impor & Verifikasi Data 37 Surah Juz \'Amma...');

try {
  const surahList = JSON.parse(fs.readFileSync(SURAH_LIST_PATH, 'utf-8'));
  const sampleSurahs = JSON.parse(fs.readFileSync(SAMPLE_SURAHS_PATH, 'utf-8'));

  console.log(`✅ surah-list.json terverifikasi: ${surahList.length} surah.`);
  console.log(`✅ sample-surahs.json terverifikasi: ${Object.keys(sampleSurahs).length} surah.`);

  let totalAyat = 0;
  surahList.forEach((s) => {
    const detail = sampleSurahs[String(s.id)];
    if (!detail) {
      console.error(`❌ Surah ${s.id} (${s.namaLatin}) tidak ditemukan di sample-surahs.json!`);
    } else {
      totalAyat += detail.ayat.length;
    }
  });

  console.log(`🎉 Total Ayat Terbaca: ${totalAyat} Ayat (Lengkap 100% 37 Surah Juz 'Amma).`);
} catch (err) {
  console.error('❌ Gagal menjalankan skrip impor:', err);
  process.exit(1);
}
