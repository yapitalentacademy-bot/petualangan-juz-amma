import React from 'react';

export const Layer2Gunung: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradien Formasi Tebing & Mesa Gurun Kejauhan */}
        <linearGradient id="mesaDistantGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7E3339" />
          <stop offset="60%" stopColor="#9C4436" />
          <stop offset="100%" stopColor="#C46842" />
        </linearGradient>

        <linearGradient id="mesaMidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#692830" />
          <stop offset="70%" stopColor="#8A362D" />
          <stop offset="100%" stopColor="#B35638" />
        </linearGradient>

        {/* Haze / Kabut Hangat Senja di Kaki Tebing */}
        <linearGradient id="senjaHazeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2A154" stopOpacity="0" />
          <stop offset="50%" stopColor="#E2A154" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C0603A" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Barisan Tebing & Mesa Terjauh */}
      <path
        d="M 0,620 
           L 120,570 L 260,570 L 320,620 
           L 480,590 L 560,540 L 700,540 L 780,610 
           L 920,580 L 1050,520 L 1220,520 L 1340,610 
           L 1480,570 L 1580,530 L 1720,530 L 1820,600 
           L 1920,580 L 1920,1080 L 0,1080 Z"
        fill="url(#mesaDistantGrad)"
        opacity="0.85"
      />

      {/* Barisan Tebing & Pegunungan Batu Menengah */}
      <path
        d="M 0,660 
           L 180,660 L 280,580 L 440,580 L 540,670 
           L 720,670 L 840,590 L 1020,590 L 1140,680 
           L 1300,650 L 1420,570 L 1600,570 L 1720,670 
           L 1920,660 L 1920,1080 L 0,1080 Z"
        fill="url(#mesaMidGrad)"
      />

      {/* Kabut Hangat / Haze Senja di Kaki Tebing */}
      <rect x="0" y="620" width="1920" height="200" fill="url(#senjaHazeGrad)" />
    </svg>
  );
};
