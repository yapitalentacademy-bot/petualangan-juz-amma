export interface TajwidMarker {
  hukum: 'ghunnah' | 'ikhfa' | 'idgham' | 'qalqalah' | 'mad_thabii';
  indeksHuruf: number[];
  label?: string;
}

export interface Ayat {
  nomor: number;
  arab: string;
  kata: string[];
  latin: string;
  terjemah: string;
  audio: string;
  tajwid?: TajwidMarker[];
}

export interface SurahDetail {
  id: number;
  namaLatin: string;
  namaArab: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: 'Makkiyah' | 'Madaniyah';
  level: number; // 4, 5, atau 6
  ringkasanKisah: string;
  pesanAkhlak: string;
  ayat: Ayat[];
}

export interface SurahMeta {
  id: number;
  nomorSurah: number; // 78 s.d. 114
  namaLatin: string;
  namaArab: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: 'Makkiyah' | 'Madaniyah';
  urutanPos: number; // 1 s.d. 37
  levelRekomendasi: 4 | 5 | 6;
  unlocked?: boolean;
  stars?: number; // 0 s.d. 3
}

export type KelasLevel = 4 | 5 | 6;

export interface KelasProgress {
  namaKelas: string; // misal "5B"
  level: KelasLevel;
  posTerbuka: number[]; // array of surah id yang sudah terbuka
  posSelesai: {
    [surahId: number]: {
      stars: number;
      skorTertinggi: number;
      terakhirDimainkan: string;
    };
  };
  lencana: string[];
  pengaturan: {
    suaraEfek: boolean;
    audioQari: boolean;
    teksLatin: boolean;
    terjemah: boolean;
    kecepatanAudio: number;
    qariTerpilih: string;
    nurTanpaWajah?: boolean;
  };
}
