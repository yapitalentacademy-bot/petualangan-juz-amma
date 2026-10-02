import React from 'react';

export const Layer3Bukit: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradien Bukit Pasir Senja Jauh */}
        <linearGradient id="duneFarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8733B" />
          <stop offset="50%" stopColor="#AD532C" />
          <stop offset="100%" stopColor="#8C3A1E" />
        </linearGradient>

        {/* Gradien Bukit Pasir Menengah Emas Senja */}
        <linearGradient id="duneMidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E59B4C" />
          <stop offset="50%" stopColor="#C46E35" />
          <stop offset="100%" stopColor="#9E4624" />
        </linearGradient>

        {/* Gradien Sisi Terang Pasir Senja */}
        <linearGradient id="duneLightGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6C578" />
          <stop offset="100%" stopColor="#D4823A" />
        </linearGradient>
      </defs>

      {/* Barisan Sand Dunes 1 (Latar Belakang Bukit Pasir) */}
      <path
        d="M 0,690 
           C 250,620 500,740 850,660 
           C 1200,580 1550,720 1920,640 
           L 1920,1080 L 0,1080 Z"
        fill="url(#duneFarGrad)"
      />

      {/* Siluet Pohon Kurma di Atas Punggung Bukit Jauh */}
      <g fill="#7A2D19" opacity="0.85">
        {/* Pohon Kurma Jauh 1 */}
        <path d="M 845,662 Q 848,635 850,615 Q 852,635 855,662 Z" />
        <path d="M 850,615 Q 835,608 825,618 M 850,615 Q 842,600 838,590 M 850,615 Q 855,595 862,590 M 850,615 Q 865,605 875,616 M 850,615 Q 862,625 870,630 M 850,615 Q 838,625 830,630" stroke="#7A2D19" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Pohon Kurma Jauh 2 */}
        <path d="M 865,665 Q 868,642 870,625 Q 872,642 875,665 Z" />
        <path d="M 870,625 Q 858,620 850,628 M 870,625 Q 862,612 860,605 M 870,625 Q 876,610 882,605 M 870,625 Q 884,618 890,626" stroke="#7A2D19" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      {/* Sand Dunes 2: Sisi Bayangan & Sisi Terang Emas */}
      <path
        d="M 0,760 
           C 300,700 650,810 1050,720 
           C 1450,630 1700,750 1920,710 
           L 1920,1080 L 0,1080 Z"
        fill="url(#duneMidGrad)"
      />

      {/* Ridge Line / Punggung Pasir Bercahaya Emas */}
      <path
        d="M 0,760 
           C 300,700 650,810 1050,720 
           C 1450,630 1700,750 1920,710 
           L 1920,725 
           C 1700,765 1450,645 1050,735 
           C 650,825 300,715 0,775 Z"
        fill="url(#duneLightGrad)"
        opacity="0.8"
      />

      {/* Lembah Pasir Depan Menuju Oase */}
      <path
        d="M 0,810 
           C 400,750 750,840 1200,770 
           C 1550,710 1750,790 1920,770 
           L 1920,1080 L 0,1080 Z"
        fill="url(#duneFarGrad)"
        opacity="0.9"
      />
    </svg>
  );
};
