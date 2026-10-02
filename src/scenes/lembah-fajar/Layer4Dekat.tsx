import React from 'react';

export const Layer4Dekat: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradien Tanah & Rumput Tepi Dekat */}
        <linearGradient id="tanahDekatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="35%" stopColor="#047857" />
          <stop offset="70%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>

        {/* Gradien Sungai Jernih Fajar */}
        <linearGradient id="sungaiFajarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#7DD3FC" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#BAE6FD" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
        </linearGradient>

        {/* Gradien Batang Kayu & Bambu Jembatan */}
        <linearGradient id="kayuJembatanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Daun Rindang & Pohon Kelapa */}
        <linearGradient id="daunPohonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>

        {/* Bunga-bunga Tepi Sungai */}
        <radialGradient id="bungaKuningGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </radialGradient>
      </defs>

      {/* Sungai Jernih Berkelok dari Tengah ke Kanan Bawah */}
      <path
        d="M920 780 C880 830, 760 880, 840 940 C920 1000, 1140 1020, 1260 1080 L1460 1080 C1320 1010, 1080 970, 1020 910 C960 850, 1040 810, 1000 780 Z"
        fill="url(#sungaiFajarGrad)"
      />

      {/* Tanah & Daratan Tepi Sungai Kiri */}
      <path
        d="M-50 860 Q340 810 680 870 T980 890 L880 1080 L-50 1080 Z"
        fill="url(#tanahDekatGrad)"
      />

      {/* Tanah & Daratan Tepi Sungai Kanan */}
      <path
        d="M960 890 Q1240 840 1560 880 T2000 850 L2000 1080 L1280 1080 Z"
        fill="url(#tanahDekatGrad)"
      />

      {/* Jembatan Bambu / Kayu Kecil Melintasi Sungai */}
      <g transform="translate(860, 860)">
        {/* Tiang Penyangga Jembatan */}
        <rect x="20" y="15" width="8" height="35" rx="3" fill="#78350F" />
        <rect x="140" y="20" width="8" height="38" rx="3" fill="#78350F" />
        {/* Papan Utama Melengkung */}
        <path
          d="M0 25 Q85 10 170 30 L168 42 Q85 22 0 37 Z"
          fill="url(#kayuJembatanGrad)"
          stroke="#78350F"
          strokeWidth="2"
        />
        {/* Pagar / Pegangan Jembatan */}
        <path
          d="M5 8 Q85 -5 165 12"
          stroke="#D97706"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <line x1="30" y1="18" x2="30" y2="4" stroke="#B45309" strokeWidth="3" />
        <line x1="85" y1="13" x2="85" y2="-2" stroke="#B45309" strokeWidth="3" />
        <line x1="140" y1="22" x2="140" y2="8" stroke="#B45309" strokeWidth="3" />
      </g>

      {/* Pohon Rindang & Kelapa di Kiri */}
      <g transform="translate(140, 700)">
        {/* Batang Pohon Kelapa Melengkung */}
        <path
          d="M120 280 C110 200, 140 120, 80 40"
          stroke="#78350F"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        {/* Daun Kelapa Menjuntai */}
        <path d="M80 40 Q20 30 -20 80 Q30 40 80 40" fill="url(#daunPohonGrad)" />
        <path d="M80 40 Q40 -20 -10 -40 Q40 0 80 40" fill="url(#daunPohonGrad)" />
        <path d="M80 40 Q110 -30 140 -50 Q115 5 80 40" fill="url(#daunPohonGrad)" />
        <path d="M80 40 Q150 10 200 40 Q140 30 80 40" fill="url(#daunPohonGrad)" />
        <path d="M80 40 Q130 70 170 120 Q115 65 80 40" fill="url(#daunPohonGrad)" />

        {/* Pohon Rindang Bulat di Dekatnya */}
        <ellipse cx="20" cy="220" rx="60" ry="50" fill="url(#daunPohonGrad)" />
        <ellipse cx="50" cy="190" rx="45" ry="40" fill="#10B981" />
        <ellipse cx="-10" cy="200" rx="40" ry="35" fill="#047857" />
        <rect x="15" y="240" width="14" height="60" rx="4" fill="#78350F" />
      </g>

      {/* Pohon Rindang & Semak di Kanan */}
      <g transform="translate(1700, 720)">
        <ellipse cx="40" cy="200" rx="75" ry="60" fill="url(#daunPohonGrad)" />
        <ellipse cx="10" cy="170" rx="55" ry="45" fill="#34D399" opacity="0.9" />
        <ellipse cx="65" cy="180" rx="50" ry="45" fill="#047857" />
        <rect x="32" y="230" width="16" height="70" rx="5" fill="#78350F" />
      </g>

      {/* Bebatuan Halus dan Bunga-Bunga di Tepi Bawah */}
      <g>
        {/* Batu-batu Sungai */}
        <ellipse cx="780" cy="940" rx="22" ry="12" fill="#E8D2A6" stroke="#B45309" strokeWidth="2" />
        <ellipse cx="815" cy="950" rx="14" ry="8" fill="#F6EBD9" />
        <ellipse cx="1120" cy="970" rx="28" ry="14" fill="#E8D2A6" stroke="#B45309" strokeWidth="2" />
        <ellipse cx="1155" cy="980" rx="16" ry="9" fill="#F6EBD9" />

        {/* Kumpulan Bunga Warna-Warni */}
        {/* Bunga Kiri */}
        <circle cx="340" cy="980" r="8" fill="url(#bungaKuningGrad)" />
        <circle cx="355" cy="975" r="6" fill="#F43F5E" />
        <circle cx="370" cy="985" r="7" fill="url(#bungaKuningGrad)" />
        <circle cx="520" cy="990" r="9" fill="#FB7185" />
        <circle cx="538" cy="982" r="7" fill="url(#bungaKuningGrad)" />

        {/* Bunga Kanan */}
        <circle cx="1520" cy="980" r="8" fill="url(#bungaKuningGrad)" />
        <circle cx="1540" cy="972" r="7" fill="#38BDF8" />
        <circle cx="1555" cy="985" r="9" fill="url(#bungaKuningGrad)" />
        <circle cx="1680" cy="990" r="8" fill="#FB7185" />
      </g>
    </svg>
  );
};
