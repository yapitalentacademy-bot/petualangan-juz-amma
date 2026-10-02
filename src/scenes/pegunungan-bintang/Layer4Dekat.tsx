import React from 'react';

export const Layer4Dekat: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Tanah Tepi Dekat Lereng Malam */}
        <linearGradient id="nightForeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#102528" />
          <stop offset="60%" stopColor="#081416" />
          <stop offset="100%" stopColor="#04090B" />
        </linearGradient>

        {/* Air Danau Malam Safir Jernih */}
        <linearGradient id="nightLakeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E2338" />
          <stop offset="50%" stopColor="#15324D" />
          <stop offset="100%" stopColor="#091724" />
        </linearGradient>

        {/* Pohon Pinus Dekat */}
        <linearGradient id="pineTreeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#051714" />
          <stop offset="50%" stopColor="#0E2D27" />
          <stop offset="100%" stopColor="#040F0D" />
        </linearGradient>

        {/* Batang Kayu Pinus */}
        <linearGradient id="pineTrunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1B1510" />
          <stop offset="50%" stopColor="#2E231B" />
          <stop offset="100%" stopColor="#120D0A" />
        </linearGradient>
      </defs>

      {/* Danau Cermin Pegunungan Malam */}
      <path
        d="M 200,850 
           C 500,800 1000,790 1450,830 
           C 1750,860 1920,910 1850,970 
           C 1650,1030 950,1040 400,1000 
           C 150,970 100,900 200,850 Z"
        fill="url(#nightLakeGrad)"
      />

      {/* Pantulan Cahaya Bulan & Riak Lembut di Air Danau */}
      <ellipse cx="1400" cy="880" rx="140" ry="10" fill="#EBF5FB" opacity="0.3" />
      <ellipse cx="1370" cy="905" rx="90" ry="6" fill="#FFFDF7" opacity="0.4" />
      <ellipse cx="1420" cy="925" rx="60" ry="5" fill="#EBF5FB" opacity="0.35" />

      {/* Dataran Tepi Depan */}
      <path
        d="M 0,870 
           C 300,840 550,920 850,890 
           C 1150,860 1450,920 1700,890 
           C 1850,870 1920,910 1920,910 
           L 1920,1080 L 0,1080 Z"
        fill="url(#nightForeGrad)"
      />

      {/* Bebatuan Tepi Danau Malam */}
      <g fill="#0D1E22">
        <path d="M 120,930 C 160,890 230,900 260,940 C 280,970 230,1010 160,1010 C 100,1010 80,960 120,930 Z" />
        <path d="M 220,950 C 250,920 300,925 320,960 C 330,980 300,1000 260,1000 C 220,1000 200,975 220,950 Z" />
        <path d="M 1600,920 C 1650,880 1720,885 1760,930 C 1780,965 1740,1010 1670,1010 C 1610,1010 1580,960 1600,920 Z" />
      </g>

      {/* Pohon Pinus Rindang Besar di Kiri Depan */}
      <g>
        {/* Batang Pohon Pinus */}
        <path d="M 170,980 L 195,980 L 190,680 L 175,680 Z" fill="url(#pineTrunkGrad)" />

        {/* Lapisan Daun Pinus (Bentuk Segitiga Bertingkat Halus) */}
        {/* Tingkat 1 (Bawah) */}
        <path d="M 70,820 L 182,680 L 295,820 C 240,810 125,810 70,820 Z" fill="url(#pineTreeGrad)" />
        {/* Tingkat 2 */}
        <path d="M 90,740 L 182,610 L 275,740 C 230,730 135,730 90,740 Z" fill="url(#pineTreeGrad)" />
        {/* Tingkat 3 */}
        <path d="M 110,660 L 182,540 L 255,660 C 215,650 150,650 110,660 Z" fill="url(#pineTreeGrad)" />
        {/* Tingkat 4 (Puncak) */}
        <path d="M 130,580 L 182,470 L 235,580 C 205,570 160,570 130,580 Z" fill="url(#pineTreeGrad)" />
      </g>

      {/* Pohon Pinus Kedua di Kiri (Lebih Kecil) */}
      <g>
        <path d="M 285,960 L 305,960 L 300,720 L 290,720 Z" fill="url(#pineTrunkGrad)" />
        <path d="M 205,840 L 295,720 L 385,840 C 340,830 250,830 205,840 Z" fill="url(#pineTreeGrad)" />
        <path d="M 225,760 L 295,650 L 365,760 C 330,750 260,750 225,760 Z" fill="url(#pineTreeGrad)" />
        <path d="M 245,690 L 295,590 L 345,690 C 320,680 270,680 245,690 Z" fill="url(#pineTreeGrad)" />
      </g>

      {/* Rerumputan & Bunga Malam Berkelip */}
      <g stroke="#0F7A5C" strokeWidth="3" strokeLinecap="round">
        <path d="M 180,970 Q 165,930 150,920" />
        <path d="M 190,975 Q 195,935 205,915" />
        <path d="M 310,965 Q 325,930 340,920" />
        <path d="M 820,910 Q 810,880 795,870" />
        <path d="M 830,915 Q 840,875 855,865" />
        <path d="M 1520,910 Q 1535,875 1550,865" />
      </g>
    </svg>
  );
};
