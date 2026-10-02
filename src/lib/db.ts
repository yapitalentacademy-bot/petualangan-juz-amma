import Dexie, { type Table } from 'dexie';
import { KelasProgress } from '../types/surah';

export interface GameLogEntry {
  id?: number;
  namaKelas: string;
  surahId: number;
  surahLatin: string;
  gameType: string;
  skor: number;
  stars: number;
  akurasi: number;
  timestamp: string;
}

export interface TeacherSettingsEntry {
  id: string; // e.g. "default"
  pin: string;
  focusSurahId?: number;
}

export class AppDatabase extends Dexie {
  classes!: Table<KelasProgress & { updatedAt: string; focusSurahId?: number }, string>;
  gameLogs!: Table<GameLogEntry, number>;
  teacherSettings!: Table<TeacherSettingsEntry, string>;

  constructor() {
    super('PetualanganJuzAmmaDB');
    this.version(1).stores({
      classes: 'namaKelas, level, updatedAt',
      gameLogs: '++id, namaKelas, surahId, gameType, timestamp',
      teacherSettings: 'id',
    });
  }
}

export const db = new AppDatabase();

// Helper to initialize default class in Dexie if empty
export const SAMPLE_SURAH_IDS = [105, 106, 107, 108, 112, 114];

export const defaultClassData: KelasProgress = {
  namaKelas: '5A',
  level: 4,
  posTerbuka: SAMPLE_SURAH_IDS,
  posSelesai: {
    105: { stars: 3, skorTertinggi: 100, terakhirDimainkan: new Date().toISOString() },
    108: { stars: 2, skorTertinggi: 80, terakhirDimainkan: new Date().toISOString() },
    112: { stars: 3, skorTertinggi: 100, terakhirDimainkan: new Date().toISOString() },
  },
  lencana: ['Penjelajah Pemula'],
  pengaturan: {
    suaraEfek: true,
    audioQari: true,
    teksLatin: true,
    terjemah: true,
    kecepatanAudio: 1.0,
    qariTerpilih: 'misyari',
    nurTanpaWajah: false,
    sembunyikanHewan: false,
  },
};

export async function getClassProgress(namaKelas: string): Promise<KelasProgress> {
  try {
    const record = await db.classes.get(namaKelas);
    if (record) {
      return record;
    }
    // Create if doesn't exist
    const newRecord: KelasProgress & { updatedAt: string; focusSurahId?: number } = {
      ...defaultClassData,
      namaKelas,
      updatedAt: new Date().toISOString(),
      focusSurahId: 105,
    };
    await db.classes.put(newRecord);
    return newRecord;
  } catch (err) {
    console.error('Failed to get class progress from Dexie:', err);
    return defaultClassData;
  }
}

export async function saveClassProgress(progress: KelasProgress, focusSurahId?: number) {
  try {
    await db.classes.put({
      ...progress,
      updatedAt: new Date().toISOString(),
      focusSurahId,
    });
  } catch (err) {
    console.error('Failed to save class progress to Dexie:', err);
  }
}

export async function logGameScore(log: Omit<GameLogEntry, 'id'>) {
  try {
    await db.gameLogs.add(log);
  } catch (err) {
    console.error('Failed to log game score:', err);
  }
}

export async function getAllGameLogs(namaKelas?: string): Promise<GameLogEntry[]> {
  try {
    if (namaKelas) {
      return await db.gameLogs.where('namaKelas').equals(namaKelas).reverse().toArray();
    }
    return await db.gameLogs.reverse().toArray();
  } catch (err) {
    console.error('Failed to get game logs:', err);
    return [];
  }
}
