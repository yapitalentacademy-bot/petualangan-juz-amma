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
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes shootingStarAnim {
          0% { transform: translate3d(0, 0, 0) rotate(-35deg); opacity: 0; }
          5% { opacity: 1; }
          15% { transform: translate3d(-400px, 280px, 0) rotate(-35deg); opacity: 0; }
          100% { transform: translate3d(-400px, 280px, 0) rotate(-35deg); opacity: 0; }
        }
        @keyframes nightFogFloat {
          0% { transform: translate3d(-200px, 0, 0); }
          100% { transform: translate3d(2100px, 0, 0); }
        }
        @keyframes fireflyGlow {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.1; }
          50% { transform: translate3d(25px, -20px, 0); opacity: 0.9; }
        }
      `}</style>

      {/* Bintang Berkelip-kelip (Twinkling Stars) */}
      <div className="absolute inset-0 w-full h-full">
        {[
          { top: '12%', left: '15%', dur: '3.2s', del: '0s', size: 3.5 },
          { top: '22%', left: '35%', dur: '4.1s', del: '1.2s', size: 4 },
          { top: '10%', left: '55%', dur: '2.8s', del: '0.7s', size: 3 },
          { top: '25%', left: '72%', dur: '3.6s', del: '1.9s', size: 4.5 },
          { top: '15%', left: '88%', dur: '4.5s', del: '0.3s', size: 3 },
          { top: '32%', left: '20%', dur: '3.0s', del: '2.1s', size: 3.5 },
          { top: '28%', left: '48%', dur: '4.2s', del: '1.5s', size: 4 },
          { top: '18%', left: '65%', dur: '3.8s', del: '0.8s', size: 3.5 },
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute rounded-full will-change-transform"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#FFFDF7',
              boxShadow: '0 0 10px #D4A23A',
              animation: `starTwinkle ${star.dur} ease-in-out infinite`,
              animationDelay: star.del,
              animationPlayState: animState,
            }}
          />
        ))}
      </div>

      {/* Bintang Jatuh (Shooting Star) */}
      <div
        className="absolute top-[120px] right-[250px] w-[140px] h-[2px] will-change-transform"
        style={{
          background: 'linear-gradient(to right, rgba(255,253,247,0), rgba(255,253,247,0.9), rgba(212,162,58,1))',
          animation: 'shootingStarAnim 14s ease-out infinite',
          animationDelay: '3s',
          animationPlayState: animState,
        }}
      />

      {/* Kabut Malam Mengapung di Atas Danau */}
      <div
        className="absolute top-[760px] left-0 will-change-transform opacity-30"
        style={{
          animation: `nightFogFloat 80s linear infinite`,
          animationPlayState: animState,
        }}
      >
        <svg width="450" height="90" viewBox="0 0 450 90" fill="none">
          <path
            d="M 20,45 C 80,25 150,60 220,40 C 290,20 360,55 430,45 L 430,70 C 360,80 290,50 220,70 C 150,90 80,60 20,70 Z"
            fill="#EBF5FB"
          />
        </svg>
      </div>

      {/* Kunang-kunang di Tepi Danau (Dapat Disembunyikan) */}
      {!sembunyikanHewan && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {[
            { top: '86%', left: '22%', dur: '4s', del: '0s' },
            { top: '89%', left: '38%', dur: '5.2s', del: '1.5s' },
            { top: '84%', left: '76%', dur: '4.6s', del: '2.3s' },
            { top: '91%', left: '85%', dur: '3.8s', del: '0.7s' },
          ].map((ff, idx) => (
            <div
              key={idx}
              className="absolute w-[4px] h-[4px] rounded-full will-change-transform"
              style={{
                top: ff.top,
                left: ff.left,
                backgroundColor: '#98E4B8',
                boxShadow: '0 0 8px #0F7A5C',
                animation: `fireflyGlow ${ff.dur} ease-in-out infinite`,
                animationDelay: ff.del,
                animationPlayState: animState,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
