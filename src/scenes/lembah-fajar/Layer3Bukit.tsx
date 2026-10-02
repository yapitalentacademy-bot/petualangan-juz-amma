import React from 'react';

export const Layer3Bukit: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradien Bukit Hijau Zamrud Lembut */}
        <linearGradient id="bukitHijauGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="40%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="bukitHijauGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>

        {/* Gradien Terasering Sawah Keemasan Fajar */}
        <linearGradient id="teraseringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.8" />
        </linearGradient>

        {/* Gradien Air Terjun Lembah */}
        <linearGradient id="airTerjunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="50%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Kontur Perbukitan Lapis Belakang */}
      <path
        d="M-50 780 Q200 600 480 660 T1040 640 T1580 620 T2000 680 L2000 950 L-50 950 Z"
        fill="url(#bukitHijauGrad1)"
      />

      {/* Terasering Sawah Bergelombang (Garis-Garis Halus Pematang) */}
      <g stroke="url(#teraseringGrad)" strokeWidth="3.5" fill="none" opacity="0.85">
        <path d="M120 720 Q280 670 440 700 T760 690" />
        <path d="M160 750 Q320 700 480 730 T800 720" />
        <path d="M200 780 Q360 730 520 760 T840 750" />

        <path d="M1240 680 Q1400 650 1560 670 T1880 660" />
        <path d="M1200 710 Q1360 680 1520 700 T1840 690" />
        <path d="M1160 740 Q1320 710 1480 730 T1800 720" />
      </g>

      {/* Kontur Perbukitan Lapis Depan */}
      <path
        d="M-50 820 Q260 670 580 740 T1180 710 T1740 690 T2000 760 L2000 1020 L-50 1020 Z"
        fill="url(#bukitHijauGrad2)"
      />

      {/* Air Terjun Mini di Lereng Kiri */}
      <g transform="translate(380, 680)">
        {/* Aliran Air Terjun */}
        <path
          d="M0 0 C5 25, -5 50, 2 80 C8 110, 0 130, 4 160"
          stroke="url(#airTerjunGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* Kolam Percikan Mini */}
        <ellipse cx="6" cy="162" rx="20" ry="6" fill="#BAE6FD" opacity="0.9" />
        <ellipse cx="6" cy="162" rx="12" ry="3" fill="#FFFDF7" />
      </g>

      {/* Air Terjun Mini di Lereng Kanan */}
      <g transform="translate(1480, 690)">
        <path
          d="M0 0 C-4 20, 6 45, 0 75 C-5 105, 4 125, 0 150"
          stroke="url(#airTerjunGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="0" cy="152" rx="16" ry="5" fill="#BAE6FD" opacity="0.9" />
        <ellipse cx="0" cy="152" rx="9" ry="2.5" fill="#FFFDF7" />
      </g>
    </svg>
  );
};
