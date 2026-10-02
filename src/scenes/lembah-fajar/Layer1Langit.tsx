import React from 'react';

export const Layer1Langit: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradien Langit Fajar */}
        <linearGradient id="langitFajarGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="35%" stopColor="#BAE6FD" />
          <stop offset="65%" stopColor="#FEF08A" />
          <stop offset="85%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F6EBD9" />
        </linearGradient>

        {/* Cahaya Matahari Fajar */}
        <radialGradient id="matahariFajarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDF7" stopOpacity="1" />
          <stop offset="30%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FDE047" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>

        {/* Gradien Awan Pagi 1 */}
        <linearGradient id="awanFajar1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.6" />
        </linearGradient>

        {/* Gradien Awan Pagi 2 */}
        <linearGradient id="awanFajar2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Latar Belakang Langit */}
      <rect width="1920" height="1080" fill="url(#langitFajarGrad)" />

      {/* Matahari Fajar Bercahaya di Cakrawala */}
      <g transform="translate(960, 520)">
        {/* Glow Luar */}
        <circle cx="0" cy="0" r="280" fill="url(#matahariFajarGlow)" />
        {/* Glow Tengah */}
        <circle cx="0" cy="0" r="140" fill="url(#matahariFajarGlow)" opacity="0.9" />
        {/* Inti Matahari */}
        <circle cx="0" cy="0" r="65" fill="#FFFDF7" />
      </g>

      {/* Awan-awan Statis di Langit Jauh */}
      <g opacity="0.85">
        {/* Awan Kiri Atas */}
        <path
          d="M180 240 C180 210 210 180 250 180 C270 150 320 140 360 160 C390 130 450 130 480 170 C520 170 550 200 550 240 C550 270 520 290 480 290 L230 290 C190 290 180 270 180 240 Z"
          fill="url(#awanFajar1)"
        />

        {/* Awan Kanan Tengah */}
        <path
          d="M1380 280 C1380 250 1410 220 1450 220 C1470 190 1520 180 1560 200 C1590 170 1650 170 1680 210 C1720 210 1750 240 1750 280 C1750 310 1720 330 1680 330 L1430 330 C1390 330 1380 310 1380 280 Z"
          fill="url(#awanFajar2)"
        />

        {/* Awan Tengah Tipis */}
        <path
          d="M780 340 C780 320 800 300 830 300 C850 280 890 270 920 290 C945 270 985 270 1010 300 C1040 300 1060 320 1060 340 C1060 360 1040 375 1010 375 L820 375 C790 375 780 360 780 340 Z"
          fill="url(#awanFajar1)"
          opacity="0.6"
        />
      </g>
    </svg>
  );
};
