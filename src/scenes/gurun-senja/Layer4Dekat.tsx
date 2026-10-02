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
        {/* Tanah Tepi Dekat Pasir Hangat */}
        <linearGradient id="foreSandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A84C20" />
          <stop offset="40%" stopColor="#7E3314" />
          <stop offset="100%" stopColor="#541F0A" />
        </linearGradient>

        {/* Air Oase Jernih Senja */}
        <linearGradient id="oasisWaterGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#125A6E" />
          <stop offset="40%" stopColor="#1B7A8C" />
          <stop offset="70%" stopColor="#E29244" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#104E5F" />
        </linearGradient>

        {/* Batang Pohon Kurma */}
        <linearGradient id="palmTrunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4A1E10" />
          <stop offset="50%" stopColor="#6E2F1A" />
          <stop offset="100%" stopColor="#3B1508" />
        </linearGradient>

        {/* Daun Kurma Zamrud Hangat */}
        <linearGradient id="palmFrondGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D664E" />
          <stop offset="100%" stopColor="#123B2A" />
        </linearGradient>

        {/* Batu Pasir Tepi */}
        <linearGradient id="desertRockGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C46E35" />
          <stop offset="60%" stopColor="#7E3314" />
          <stop offset="100%" stopColor="#4A1A08" />
        </linearGradient>
      </defs>

      {/* Kolam Air Oase di Tengah Lembah Gurun */}
      <path
        d="M 300,890 
           C 500,840 900,830 1300,860 
           C 1600,880 1800,920 1700,970 
           C 1500,1020 900,1030 500,1000 
           C 300,980 200,920 300,890 Z"
        fill="url(#oasisWaterGrad)"
      />

      {/* Riak & Pantulan Cahaya Matahari Senja di Air Oase */}
      <ellipse cx="1100" cy="910" rx="180" ry="12" fill="#FFE5A3" opacity="0.4" />
      <ellipse cx="1050" cy="935" rx="120" ry="8" fill="#FFC864" opacity="0.35" />
      <ellipse cx="1150" cy="955" rx="80" ry="6" fill="#FFF4D0" opacity="0.45" />

      {/* Dataran Pasir & Tanah Tepi Depan */}
      <path
        d="M 0,860 
           C 250,830 450,910 650,880 
           C 950,840 1250,890 1550,870 
           C 1750,850 1850,900 1920,890 
           L 1920,1080 L 0,1080 Z"
        fill="url(#foreSandGrad)"
      />

      {/* Bebatuan Gurun di Tepi Kiri & Kanan */}
      <g>
        {/* Bebatuan Kiri */}
        <path d="M 80,920 C 120,880 190,880 230,930 C 250,960 200,1000 130,1000 C 70,1000 50,950 80,920 Z" fill="url(#desertRockGrad)" />
        <path d="M 180,940 C 210,910 260,915 280,950 C 290,970 260,995 220,995 C 180,995 160,965 180,940 Z" fill="url(#desertRockGrad)" />

        {/* Bebatuan Kanan */}
        <path d="M 1650,910 C 1700,870 1780,870 1820,920 C 1850,960 1800,1010 1720,1010 C 1650,1010 1620,950 1650,910 Z" fill="url(#desertRockGrad)" />
      </g>

      {/* Pohon Kurma Besar di Tepi Kiri Oase */}
      <g>
        {/* Batang Kurma Melengkung Alami */}
        <path
          d="M 190,960 C 210,830 250,700 320,580 L 355,585 C 285,710 250,840 235,960 Z"
          fill="url(#palmTrunkGrad)"
        />
        {/* Cincin Ruas Batang Kurma */}
        <path d="M 205,910 L 225,914 M 218,860 L 240,864 M 235,800 L 260,804 M 255,740 L 282,744 M 280,680 L 310,684 M 305,625 L 335,628" stroke="#3B1508" strokeWidth="4" strokeLinecap="round" />

        {/* Mahkota Daun Kurma Kiri */}
        <g transform="translate(340, 580)">
          {/* Pelepah 1 - Ke Kiri Bawah */}
          <path d="M 0,0 C -60,20 -120,60 -180,120" stroke="url(#palmFrondGrad)" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M 0,0 C -60,20 -120,60 -180,120" stroke="#3E8264" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Pelepah 2 - Ke Kiri Mendatar */}
          <path d="M 0,0 C -80,-20 -150,-10 -220,40" stroke="url(#palmFrondGrad)" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M 0,0 C -80,-20 -150,-10 -220,40" stroke="#3E8264" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Pelepah 3 - Ke Kiri Atas */}
          <path d="M 0,0 C -70,-60 -120,-100 -160,-110" stroke="url(#palmFrondGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M 0,0 C -70,-60 -120,-100 -160,-110" stroke="#3E8264" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* Pelepah 4 - Ke Atas Tegak */}
          <path d="M 0,0 C -20,-80 -10,-140 20,-170" stroke="url(#palmFrondGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M 0,0 C -20,-80 -10,-140 20,-170" stroke="#3E8264" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* Pelepah 5 - Ke Kanan Atas */}
          <path d="M 0,0 C 60,-70 120,-90 170,-80" stroke="url(#palmFrondGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M 0,0 C 60,-70 120,-90 170,-80" stroke="#3E8264" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* Pelepah 6 - Ke Kanan Bawah */}
          <path d="M 0,0 C 80,-10 150,20 200,80" stroke="url(#palmFrondGrad)" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M 0,0 C 80,-10 150,20 200,80" stroke="#3E8264" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* Rerumputan Gurun di Kaki Pohon & Tepi Air */}
      <g stroke="#2D664E" strokeWidth="4" strokeLinecap="round">
        <path d="M 210,950 Q 195,910 175,900" />
        <path d="M 220,955 Q 225,915 235,895" />
        <path d="M 230,960 Q 250,920 270,910" />

        <path d="M 680,900 Q 670,870 655,860" />
        <path d="M 690,905 Q 700,865 715,855" />

        <path d="M 1520,890 Q 1505,860 1485,855" />
        <path d="M 1530,895 Q 1545,860 1560,850" />
      </g>
    </svg>
  );
};
