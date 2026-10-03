import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleSurahsPath = path.join(__dirname, '../src/data/sample-surahs.json');
const surahsData = JSON.parse(fs.readFileSync(sampleSurahsPath, 'utf8'));

// Precise rule detector per word
function detectTajwidInWord(word, nextWord) {
  const results = [];

  // 1. Ghunnah: Nun or Mim with Shaddah (نّ or مّ)
  if (/ن\u0651/.test(word) || /ن[\u0640-\u0650\u0652-\u0670]*\u0651/.test(word) || /نّ/.test(word)) {
    results.push({ hukum: 'ghunnah', label: 'Ghunnah (Nun Bertasydid)', huruf: 'نّ' });
  } else if (/م\u0651/.test(word) || /م[\u0640-\u0650\u0652-\u0670]*\u0651/.test(word) || /مّ/.test(word)) {
    results.push({ hukum: 'ghunnah', label: 'Ghunnah (Mim Bertasydid)', huruf: 'مّ' });
  }

  // 2. Qalqalah: Huruf Ba, Jim, Dal, Tha, Qaf (ب ج د ط ق) yang bersukun atau waqaf di akhir
  if (/[ب]\u0652|ب$/.test(word) || (/ب[\u064B-\u0650\u0652]?$/.test(word) && !word.includes('ب\u0651'))) {
    if (/[ب]\u0652|ب$/.test(word)) results.push({ hukum: 'qalqalah', label: 'Qalqalah (Huruf Ba)', huruf: 'ب' });
  }
  if (/[ج]\u0652|ج$/.test(word)) {
    results.push({ hukum: 'qalqalah', label: 'Qalqalah (Huruf Jim)', huruf: 'ج' });
  }
  if (/[د]\u0652|د$/.test(word)) {
    results.push({ hukum: 'qalqalah', label: 'Qalqalah (Huruf Dal)', huruf: 'د' });
  }
  if (/[ط]\u0652|ط$/.test(word)) {
    results.push({ hukum: 'qalqalah', label: 'Qalqalah (Huruf Tha)', huruf: 'ط' });
  }
  if (/[ق]\u0652|ق$/.test(word)) {
    results.push({ hukum: 'qalqalah', label: 'Qalqalah (Huruf Qaf)', huruf: 'ق' });
  }

  // 3. Ikhfa:
  // Nun sukun atau tanwin bertemu huruf ikhfa
  const ikhfaLetters = ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'];
  const hasTanwin = /[\u064B\u064C\u064D]/.test(word);
  const endsWithNunSukun = /ن\u0652$|ن$/.test(word);
  
  if (nextWord) {
    const firstLetterOfNext = nextWord.replace(/[\u064B-\u065F\u0670\u0651]/g, '').charAt(0);
    if ((hasTanwin || endsWithNunSukun) && ikhfaLetters.includes(firstLetterOfNext)) {
      results.push({ hukum: 'ikhfa', label: `Ikhfa (bertemu huruf ${firstLetterOfNext})`, huruf: firstLetterOfNext });
    }
    // Ikhfa Syafawi: Mim sukun bertemu Ba
    if ((/م\u0652$/.test(word) || /م$/.test(word)) && firstLetterOfNext === 'ب') {
      results.push({ hukum: 'ikhfa', label: 'Ikhfa Syafawi (Mim sukun bertemu Ba)', huruf: 'مْ + ب' });
    }
    // Idgham: Tanwin atau Nun sukun bertemu ي ن م و ل ر
    const idghamLetters = ['ي', 'ن', 'م', 'و', 'ل', 'ر'];
    if ((hasTanwin || endsWithNunSukun) && idghamLetters.includes(firstLetterOfNext)) {
      results.push({ hukum: 'idgham', label: `Idgham (bertemu huruf ${firstLetterOfNext})`, huruf: firstLetterOfNext });
    }
  }

  // 4. Mad Thabi'i:
  if (!word.includes('\u0653') && results.length === 0) { // Prioritize specific tajwid, or include distinct mad
    if (/[\u0670]/.test(word)) {
      results.push({ hukum: 'mad_thabii', label: "Mad Thabi'i (Alif Khanjariyah)", huruf: 'ـٰ' });
    } else if (/[\u064E][اى]/.test(word) && !/أ|إ|ء/.test(word)) {
      results.push({ hukum: 'mad_thabii', label: "Mad Thabi'i (Alif setelah Fathah)", huruf: 'ـَا' });
    } else if (/[\u0650]ي/.test(word) && !/ي\u0651/.test(word)) {
      results.push({ hukum: 'mad_thabii', label: "Mad Thabi'i (Ya setelah Kasrah)", huruf: 'ـِي' });
    } else if (/[\u064F]و/.test(word) && !/و\u0651/.test(word)) {
      results.push({ hukum: 'mad_thabii', label: "Mad Thabi'i (Wawu setelah Dhammah)", huruf: 'ـُو' });
    }
  }

  return results;
}

let totalTargetsCount = 0;

for (const surahId in surahsData) {
  const surah = surahsData[surahId];
  surah.ayat.forEach((ayat) => {
    const kataList = ayat.kata || ayat.arab.split(/\s+/).filter(w => w.length > 0);
    ayat.kata = kataList;
    ayat.tajwid = [];

    kataList.forEach((kata, wordIdx) => {
      const nextWord = kataList[wordIdx + 1] || '';
      const detected = detectTajwidInWord(kata, nextWord);
      
      detected.forEach((det) => {
        ayat.tajwid.push({
          hukum: det.hukum,
          label: det.label,
          kataIndex: wordIdx, // EXACT UNIQUE WORD INDEX
          huruf: det.huruf,
          indeksHuruf: [wordIdx]
        });
        totalTargetsCount++;
      });
    });
  });
}

fs.writeFileSync(sampleSurahsPath, JSON.stringify(surahsData, null, 2), 'utf8');
console.log(`Successfully generated ${totalTargetsCount} exact-word tajwid targets across all 37 surahs!`);
