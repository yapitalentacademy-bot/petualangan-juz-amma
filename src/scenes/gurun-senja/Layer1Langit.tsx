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
        {/* Gradien Langit Senja Lembayung: Ungu Malam ke Jingga Emas Gurun */}
        <linearGradient id="senjaSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2544" />
          <stop offset="35%" stopColor="#4A2840" />
          <stop offset="65%" stopColor="#8C3A35" />
          <stop offset="85%" stopColor="#C0603A" />
          <stop offset="100%" stopColor="#E2A154" />
        </linearGradient>

        {/* Gradien Matahari Terbenam Gurun */}
        <radialGradient id="sunSunsetGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF4D0" stopOpacity="1" />
          <stop offset="25%" stopColor="#FFC864" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#D4823A" stopOpacity="0.5" />
          <stop offset="75%" stopColor="#C0603A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#C0603A" stopOpacity="0" />
        </radialGradient>

        {/* Awan Senja Lembayung */}
        <linearGradient id="sunsetCloudGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5A2F4C" stopOpacity="0" />
          <stop offset="20%" stopColor="#7C3B4E" stopOpacity="0.65" />
          <stop offset="60%" stopColor="#A85449" stopOpacity="0.75" />
          <stop offset="80%" stopColor="#D4823A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#D4823A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Latar Langit Senja */}
      <rect width="1920" height="1080" fill="url(#senjaSkyGrad)" />

      {/* Lingkaran Cahaya Lembut Matahari Terbenam */}
      <circle cx="1200" cy="580" r="380" fill="url(#sunSunsetGlow)" />
      {/* Piringan Matahari Senja */}
      <circle cx="1200" cy="580" r="85" fill="#FFF8E7" opacity="0.95" />

      {/* Lapisan Awan Tipis Senja di Cakrawala */}
      <path
        d="M 100,320 C 350,300 550,340 850,315 C 1150,290 1450,340 1820,310 C 1880,305 1920,325 1920,335 C 1920,345 1860,355 1800,350 C 1450,380 1150,330 850,355 C 550,380 350,340 100,360 Z"
        fill="url(#sunsetCloudGrad)"
      />
      <path
        d="M 0,440 C 250,420 600,450 950,430 C 1300,410 1600,440 1920,425 L 1920,455 C 1600,470 1300,440 950,460 C 600,480 250,450 0,470 Z"
        fill="url(#sunsetCloudGrad)"
        opacity="0.8"
      />
      <path
        d="M 200,200 C 450,180 750,210 1050,195 C 1350,180 1650,210 1900,195 L 1900,215 C 1650,230 1350,200 1050,215 C 750,230 450,200 200,220 Z"
        fill="url(#sunsetCloudGrad)"
        opacity="0.4"
      />
    </svg>
  );
};
