import React from 'react';

export interface Layer5ElemenProps {
  sembunyikanHewan?: boolean;
  isPaused?: boolean;
}

export const Layer5Elemen: React.FC<Layer5ElemenProps> = ({
  sembunyikanHewan = false,
  isPaused = false,
}) => {
  const animState = isPaused ? 'paused' : 'running';

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      <style>{`
        @keyframes senjaCloudFloat1 {
          0% { transform: translate3d(-200px, 0, 0); }
          100% { transform: translate3d(2100px, 0, 0); }
        }
        @keyframes senjaCloudFloat2 {
          0% { transform: translate3d(-350px, 0, 0); }
          100% { transform: translate3d(2100px, 0, 0); }
        }
        @keyframes senjaBirdFly {
          0% { transform: translate3d(2100px, 260px, 0) scale(0.65); }
          50% { transform: translate3d(1000px, 210px, 0) scale(0.65); }
          100% { transform: translate3d(-200px, 250px, 0) scale(0.65); }
        }
        @keyframes goldDustGlow {
          0%, 100% { opacity: 0.2; transform: translate3d(0, 0, 0) scale(0.9); }
          50% { opacity: 0.85; transform: translate3d(30px, -25px, 0) scale(1.2); }
        }
      `}</style>

      {/* Awan Senja Lembayung Mengapung 1 */}
      <div
        className="absolute top-[180px] left-0 will-change-transform opacity-70"
        style={{
          animation: `senjaCloudFloat1 90s linear infinite`,
          animationPlayState: animState,
        }}
      >
        <svg width="260" height="70" viewBox="0 0 260 70" fill="none">
          <path
            d="M 20,40 C 40,20 80,15 110,30 C 130,10 170,10 200,25 C 230,20 250,35 240,55 C 210,65 50,65 20,40 Z"
            fill="#D4823A"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Awan Senja Mengapung 2 */}
      <div
        className="absolute top-[280px] left-0 will-change-transform opacity-60"
        style={{
          animation: `senjaCloudFloat2 120s linear infinite`,
          animationPlayState: animState,
          animationDelay: '-45s',
        }}
      >
        <svg width="320" height="85" viewBox="0 0 320 85" fill="none">
          <path
            d="M 30,50 C 60,25 110,20 150,38 C 180,15 230,18 265,35 C 295,30 315,48 300,70 C 260,80 60,80 30,50 Z"
            fill="#8C3A35"
            opacity="0.45"
          />
        </svg>
      </div>

      {/* Siluet Kawanan Burung Senja Melintas Pulang (Dapat Disembunyikan) */}
      {!sembunyikanHewan && (
        <div
          className="absolute top-0 left-0 will-change-transform"
          style={{
            animation: `senjaBirdFly 38s linear infinite`,
            animationPlayState: animState,
          }}
        >
          <svg width="140" height="70" viewBox="0 0 140 70" fill="#3B1508" opacity="0.85">
            {/* Burung 1 */}
            <path d="M 10,25 Q 22,12 34,25 Q 46,12 58,25 Q 46,19 34,27 Q 22,19 10,25 Z" />
            {/* Burung 2 */}
            <path d="M 60,45 Q 69,35 78,45 Q 87,35 96,45 Q 87,40 78,47 Q 69,40 60,45 Z" />
            {/* Burung 3 */}
            <path d="M 85,15 Q 93,6 102,15 Q 111,6 120,15 Q 111,10 102,17 Q 93,10 85,15 Z" />
          </svg>
        </div>
      )}

      {/* Partikel Debu Emas Gurun Berkilau Lembut */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {[
          { top: '65%', left: '25%', dur: '6s', del: '0s', size: 4 },
          { top: '72%', left: '45%', dur: '8s', del: '2s', size: 5 },
          { top: '60%', left: '70%', dur: '7s', del: '4s', size: 3.5 },
          { top: '78%', left: '80%', dur: '9s', del: '1s', size: 4.5 },
          { top: '85%', left: '35%', dur: '6.5s', del: '3s', size: 4 },
        ].map((dust, idx) => (
          <div
            key={idx}
            className="absolute rounded-full will-change-transform"
            style={{
              top: dust.top,
              left: dust.left,
              width: `${dust.size}px`,
              height: `${dust.size}px`,
              backgroundColor: '#FFE5A3',
              boxShadow: '0 0 8px #FFC864',
              animation: `goldDustGlow ${dust.dur} ease-in-out infinite`,
              animationDelay: dust.del,
              animationPlayState: animState,
            }}
          />
        ))}
      </div>
    </div>
  );
};
