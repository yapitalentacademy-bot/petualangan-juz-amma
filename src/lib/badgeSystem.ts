export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon identifier
  requiredCount?: number;
}

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'penjelajah_pemula',
    name: 'Penjelajah Pemula',
    description: 'Menyelesaikan pos surah pertama',
    icon: '🌟',
  },
  {
    id: 'penjelajah',
    name: 'Penjelajah',
    description: 'Menuntaskan 5 pos surah dengan minimal 1 bintang',
    icon: '🧭',
    requiredCount: 5,
  },
  {
    id: 'penghafal_tangguh',
    name: 'Penghafal Tangguh',
    description: 'Menuntaskan 15 pos surah dengan gemilang',
    icon: '🏆',
    requiredCount: 15,
  },
  {
    id: 'bintang_kelas',
    name: 'Bintang Kelas',
    description: 'Meraih skor sempurna 100% pada 3 pos surah',
    icon: '⭐',
    requiredCount: 3,
  },
  {
    id: 'ahli_tajwid',
    name: 'Ahli Tajwid',
    description: 'Menuntaskan seluruh tantangan hukum tajwid',
    icon: '📖',
  },
  {
    id: 'hafidz_cilik',
    name: 'Hafidz Cilik Juz \'Amma',
    description: 'Menuntaskan seluruh 37 pos surah Juz 30',
    icon: '👑',
    requiredCount: 37,
  },
];

export function evaluateBadges(posSelesai: { [surahId: number]: { stars: number; skorTertinggi: number } }): string[] {
  const earned: string[] = ['Penjelajah Pemula'];
  const completedEntries = Object.values(posSelesai).filter((p) => p.stars >= 1);
  const totalCompleted = completedEntries.length;

  if (totalCompleted >= 5) {
    earned.push('Penjelajah');
  }
  if (totalCompleted >= 15) {
    earned.push('Penghafal Tangguh');
  }
  if (totalCompleted >= 37) {
    earned.push('Hafidz Cilik Juz \'Amma');
  }

  const perfectScores = Object.values(posSelesai).filter((p) => p.stars === 3 || p.skorTertinggi >= 100).length;
  if (perfectScores >= 3) {
    earned.push('Bintang Kelas');
  }

  return earned;
}
