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
        {/* Gradien Bukit Pinus Malam Jauh */}
        <linearGradient id="pineHillFarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16383E" />
          <stop offset="60%" stopColor="#0E2429" />
          <stop offset="100%" stopColor="#081418" />
        </linearGradient>

        {/* Gradien Bukit Pinus Menengah */}
        <linearGradient id="pineHillMidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B4D46" />
          <stop offset="60%" stopColor="#0F332E" />
          <stop offset="100%" stopColor="#081E1B" />
        </linearGradient>
      </defs>

      {/* Bukit Pinus Jauh */}
      <path
        d="M 0,720 
           C 350,650 650,760 1050,680 
           C 1450,600 1750,730 1920,680 
           L 1920,1080 L 0,1080 Z"
        fill="url(#pineHillFarGrad)"
      />

      {/* Siluet Pepohonan Cemara / Pinus Jauh di Punggung Bukit */}
      <g fill="#0B2024" opacity="0.9">
        {[
          180, 220, 260, 310, 480, 520, 560, 720, 760, 800, 840, 
          1020, 1060, 1100, 1280, 1320, 1360, 1420, 1600, 1640, 1680, 1820, 1860
        ].map((xPos, idx) => {
          const yPos = 650 + Math.sin(xPos * 0.005) * 35;
          const h = 28 + (idx % 3) * 6;
          return (
            <path
              key={idx}
              d={`M ${xPos},${yPos} L ${xPos + 7},${yPos + h} L ${xPos - 7},${yPos + h} Z`}
            />
          );
        })}
      </g>

      {/* Bukit Pinus Menengah */}
      <path
        d="M 0,790 
           C 400,720 750,830 1200,740 
           C 1600,660 1800,780 1920,750 
           L 1920,1080 L 0,1080 Z"
        fill="url(#pineHillMidGrad)"
      />

      {/* Siluet Pepohonan Cemara Menengah */}
      <g fill="#061815">
        {[
          120, 165, 210, 380, 430, 600, 650, 700, 920, 970, 1020, 
          1180, 1230, 1390, 1440, 1500, 1720, 1770, 1830
        ].map((xPos, idx) => {
          const yPos = 720 + Math.cos(xPos * 0.004) * 30;
          const h = 42 + (idx % 3) * 8;
          return (
            <path
              key={idx}
              d={`M ${xPos},${yPos} L ${xPos + 11},${yPos + h} L ${xPos - 11},${yPos + h} Z`}
            />
          );
        })}
      </g>
    </svg>
  );
};
