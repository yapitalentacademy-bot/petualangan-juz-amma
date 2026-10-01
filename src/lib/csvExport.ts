import { KelasProgress } from '../types/surah';
import sampleSurahsData from '../data/sample-surahs.json';
import surahListData from '../data/surah-list.json';

const surahsRecord = sampleSurahsData as Record<string, { namaLatin: string; arti: string }>;

export function generateClassRecapCSV(progress: KelasProgress): string {
  const headers = ['Nomor Pos', 'Nomor Surah', 'Nama Surah', 'Arti', 'Bintang (1-3)', 'Skor Tertinggi', 'Status Pos', 'Terakhir Dimainkan'];

  const rows: string[][] = [headers];

  surahListData.forEach((surah) => {
    const detail = progress.posSelesai[surah.id];
    const isUnlocked = progress.posTerbuka.includes(surah.id);
    const surahName = surahsRecord[String(surah.id)]?.namaLatin || surah.namaLatin;
    const surahArti = surahsRecord[String(surah.id)]?.arti || surah.arti;

    const stars = detail ? detail.stars : 0;
    const score = detail ? detail.skorTertinggi : 0;
    const status = detail && detail.stars >= 1 ? 'Selesai' : isUnlocked ? 'Terbuka (Belum Selesai)' : 'Terkunci';
    const lastPlayed = detail?.terakhirDimainkan ? new Date(detail.terakhirDimainkan).toLocaleDateString('id-ID') : '-';

    rows.push([
      String(surah.urutanPos),
      String(surah.id),
      `"${surahName}"`,
      `"${surahArti}"`,
      String(stars),
      String(score),
      `"${status}"`,
      `"${lastPlayed}"`,
    ]);
  });

  return rows.map((r) => r.join(',')).join('\n');
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
