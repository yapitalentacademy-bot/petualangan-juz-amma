import React from 'react';

export const Layer1Langit: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradien Langit Malam Safir Tua ke Biru Keemasan */}
        <linearGradient id="nightSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="40%" stopColor="#14233C" />
          <stop offset="75%" stopColor="#1E3D59" />
          <stop offset="100%" stopColor="#255A6E" />
        </linearGradient>

        {/* Gradien Nebula Kosmik Safir & Zamrud */}
        <radialGradient id="nebulaGlow" cx="40%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#0F7A5C" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#1E6F8C" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
        </radialGradient>

        {/* Gradien Cahaya Bulan Sabit */}
        <radialGradient id="moonGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDF7" stopOpacity="1" />
          <stop offset="30%" stopColor="#F6EBD9" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#D4A23A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#14233C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Latar Belakang Langit Malam */}
      <rect width="1920" height="1080" fill="url(#nightSkyGrad)" />

      {/* Nebula Halus Kosmik di Balik Bintang */}
      <circle cx="800" cy="350" r="600" fill="url(#nebulaGlow)" />
      <circle cx="1500" cy="250" r="450" fill="url(#nebulaGlow)" opacity="0.6" />

      {/* Taburan Bintang Statis di Langit Jauh */}
      <g fill="#FFFDF7">
        {[
          { cx: 120, cy: 90, r: 1.5, op: 0.8 },
          { cx: 280, cy: 150, r: 2.2, op: 0.9 },
          { cx: 450, cy: 80, r: 1.8, op: 0.7 },
          { cx: 620, cy: 210, r: 2.5, op: 0.95 },
          { cx: 750, cy: 110, r: 1.6, op: 0.8 },
          { cx: 920, cy: 180, r: 2.0, op: 0.85 },
          { cx: 1080, cy: 95, r: 2.4, op: 0.9 },
          { cx: 1240, cy: 220, r: 1.7, op: 0.75 },
          { cx: 1380, cy: 130, r: 2.2, op: 0.9 },
          { cx: 1560, cy: 170, r: 1.9, op: 0.8 },
          { cx: 1720, cy: 85, r: 2.6, op: 0.95 },
          { cx: 1840, cy: 190, r: 1.6, op: 0.75 },
          { cx: 200, cy: 300, r: 1.8, op: 0.7 },
          { cx: 500, cy: 320, r: 1.5, op: 0.65 },
          { cx: 850, cy: 290, r: 2.0, op: 0.8 },
          { cx: 1300, cy: 310, r: 1.8, op: 0.75 },
          { cx: 1650, cy: 280, r: 2.1, op: 0.85 },
        ].map((star, idx) => (
          <circle key={idx} cx={star.cx} cy={star.cy} r={star.r} opacity={star.op} />
        ))}
      </g>

      {/* Cahaya Pendar Bulan */}
      <circle cx="1450" cy="220" r="180" fill="url(#moonGlowGrad)" />

      {/* Bulan Sabit Anggun */}
      <g transform="translate(1415, 185)">
        <path
          d="M 45,0 A 45,45 0 1,0 45,90 A 35,35 0 1,1 45,0 Z"
          fill="#FFFDF7"
        />
      </g>
    </svg>
  );
};
