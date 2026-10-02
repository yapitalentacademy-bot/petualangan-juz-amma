import React from 'react';

export const Layer2Gunung: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradien Puncak Gunung Malam Jauh */}
        <linearGradient id="nightPeakFarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A4868" />
          <stop offset="60%" stopColor="#1B314B" />
          <stop offset="100%" stopColor="#101F33" />
        </linearGradient>

        {/* Gradien Puncak Gunung Menengah */}
        <linearGradient id="nightPeakMidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C3854" />
          <stop offset="60%" stopColor="#12253A" />
          <stop offset="100%" stopColor="#0B1726" />
        </linearGradient>

        {/* Salju di Puncak Gunung di Bawah Cahaya Bulan */}
        <linearGradient id="snowGlowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EBF5FB" />
          <stop offset="100%" stopColor="#9AB8D6" stopOpacity="0.4" />
        </linearGradient>

        {/* Kabut Malam Biru Safir di Kaki Gunung */}
        <linearGradient id="nightHazeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3D59" stopOpacity="0" />
          <stop offset="50%" stopColor="#1E3D59" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0B132B" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Barisan Puncak Gunung Bersalju Terjauh */}
      <g>
        {/* Gunung Jauh Kiri */}
        <path
          d="M 0,650 L 220,440 L 460,670 L 680,410 L 980,680 L 1350,380 L 1650,650 L 1920,490 L 1920,1080 L 0,1080 Z"
          fill="url(#nightPeakFarGrad)"
        />

        {/* Tutupan Salju Puncak Jauh */}
        {/* Puncak 1 */}
        <path d="M 220,440 L 260,490 L 235,480 L 220,510 L 205,480 L 180,490 Z" fill="url(#snowGlowGrad)" />
        {/* Puncak 2 */}
        <path d="M 680,410 L 730,470 L 700,455 L 680,490 L 660,455 L 630,470 Z" fill="url(#snowGlowGrad)" />
        {/* Puncak 3 (Tertinggi) */}
        <path d="M 1350,380 L 1410,450 L 1375,435 L 1350,475 L 1325,435 L 1290,450 Z" fill="url(#snowGlowGrad)" />
        {/* Puncak 4 */}
        <path d="M 1920,490 L 1920,560 L 1890,530 L 1860,550 Z" fill="url(#snowGlowGrad)" />
      </g>

      {/* Barisan Pegunungan Menengah */}
      <path
        d="M 0,680 
           L 180,560 L 390,690 
           L 580,520 L 820,680 
           L 1080,480 L 1320,670 
           L 1540,510 L 1780,680 
           L 1920,590 L 1920,1080 L 0,1080 Z"
        fill="url(#nightPeakMidGrad)"
      />

      {/* Salju Puncak Menengah */}
      <path d="M 580,520 L 620,570 L 595,555 L 580,580 L 565,555 L 540,570 Z" fill="url(#snowGlowGrad)" opacity="0.8" />
      <path d="M 1080,480 L 1130,540 L 1100,525 L 1080,555 L 1060,525 L 1030,540 Z" fill="url(#snowGlowGrad)" opacity="0.8" />
      <path d="M 1540,510 L 1585,560 L 1560,548 L 1540,575 L 1520,548 L 1495,560 Z" fill="url(#snowGlowGrad)" opacity="0.8" />

      {/* Kabut Haze Lembayung Safir di Kaki Pegunungan */}
      <rect x="0" y="600" width="1920" height="250" fill="url(#nightHazeGrad)" />
    </svg>
  );
};
