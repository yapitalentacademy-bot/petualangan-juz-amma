import React from 'react';

export const Layer2Gunung: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradien Gunung Paling Jauh (Siluet Lembut) */}
        <linearGradient id="gunungJauhGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.4" />
        </linearGradient>

        {/* Gradien Gunung Menengah Hijau-Kebiruan */}
        <linearGradient id="gunungMenengahGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#0F766E" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0.5" />
        </linearGradient>

        {/* Gradien Gunung Ketiga dengan Aksen Zamrud */}
        <linearGradient id="gunungDekatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="60%" stopColor="#115E59" />
          <stop offset="100%" stopColor="#99F6E4" stopOpacity="0.6" />
        </linearGradient>

        {/* Kabut Pagi di Lembah */}
        <linearGradient id="kabutPagiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0" />
          <stop offset="60%" stopColor="#FEF08A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFDF7" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Barisan Pegunungan Siluet Paling Jauh */}
      <path
        d="M-50 620 L180 430 Q360 310 520 440 L720 370 Q880 290 1060 410 L1280 340 Q1450 280 1620 400 L1820 360 L2000 520 L2000 780 L-50 780 Z"
        fill="url(#gunungJauhGrad)"
      />

      {/* Barisan Pegunungan Lapisan Menengah */}
      <path
        d="M-50 670 L120 510 Q280 410 440 530 L660 460 Q820 380 980 490 L1220 420 Q1390 350 1560 470 L1780 430 L2000 580 L2000 850 L-50 850 Z"
        fill="url(#gunungMenengahGrad)"
      />

      {/* Barisan Pegunungan Lapisan Ketiga (Aksen Zamrud & Tebing Halus) */}
      <path
        d="M-50 720 L220 560 Q400 470 580 580 L840 510 Q1040 440 1240 550 L1520 480 Q1700 430 1880 540 L2000 600 L2000 900 L-50 900 Z"
        fill="url(#gunungDekatGrad)"
      />

      {/* Kabut Pagi Membentang di Kaki Gunung */}
      <rect x="0" y="580" width="1920" height="240" fill="url(#kabutPagiGrad)" />
      <path
        d="M0 640 Q240 600 480 630 T960 610 T1440 635 T1920 610 L1920 740 L0 740 Z"
        fill="#FFFDF7"
        opacity="0.35"
      />
    </svg>
  );
};
