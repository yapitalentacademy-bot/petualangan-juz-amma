import React from 'react';

interface Layer5ElemenProps {
  sembunyikanHewan?: boolean;
  isPaused?: boolean;
}

export const Layer5Elemen: React.FC<Layer5ElemenProps> = ({
  sembunyikanHewan = false,
  isPaused = false,
}) => {
  const animState = isPaused ? 'paused' : 'running';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ animationPlayState: animState }}
    >
      {/* 3 Awan Melayang Halus (Gerak Horizontal Pelan) */}
      <div
        className="absolute top-16 -left-48 opacity-75"
        style={{
          animation: isPaused ? 'none' : 'geserAwan1 45s linear infinite',
          willChange: 'transform',
        }}
      >
        <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
          <path
            d="M30 60 C30 40 50 25 75 25 C90 10 125 10 145 25 C165 15 190 25 190 50 C205 50 215 65 210 75 C205 85 190 85 175 85 L35 85 C15 85 10 75 20 65 Z"
            fill="#FFFDF7"
            opacity="0.85"
          />
        </svg>
      </div>

      <div
        className="absolute top-36 -left-64 opacity-60"
        style={{
          animation: isPaused ? 'none' : 'geserAwan2 60s linear infinite 15s',
          willChange: 'transform',
        }}
      >
        <svg width="280" height="110" viewBox="0 0 280 110" fill="none">
          <path
            d="M40 75 C40 50 65 30 95 30 C115 10 160 10 185 30 C210 20 240 30 240 60 C260 60 275 80 265 95 C255 105 240 105 220 105 L45 105 C20 105 15 90 25 80 Z"
            fill="#FFFDF7"
            opacity="0.8"
          />
        </svg>
      </div>

      <div
        className="absolute top-8 -left-52 opacity-50"
        style={{
          animation: isPaused ? 'none' : 'geserAwan3 52s linear infinite 5s',
          willChange: 'transform',
        }}
      >
        <svg width="180" height="70" viewBox="0 0 180 70" fill="none">
          <path
            d="M25 45 C25 30 40 20 60 20 C70 8 100 8 115 20 C130 12 150 20 150 40 C165 40 175 52 170 60 L25 60 Z"
            fill="#FFFDF7"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Siluet Hewan (3 Burung Terbang + 3 Kupu-Kupu) */}
      {!sembunyikanHewan && (
        <>
          {/* Siluet Burung 1 */}
          <div
            className="absolute top-24 -left-20"
            style={{
              animation: isPaused ? 'none' : 'terbangBurung1 28s linear infinite',
              willChange: 'transform',
            }}
          >
            <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
              <path
                d="M2 12 Q9 2 17 9 Q25 2 32 12 Q25 8 17 12 Q9 8 2 12 Z"
                fill="#0B4F3E"
                opacity="0.7"
              />
            </svg>
          </div>

          {/* Siluet Burung 2 */}
          <div
            className="absolute top-32 -left-28"
            style={{
              animation: isPaused ? 'none' : 'terbangBurung2 32s linear infinite 4s',
              willChange: 'transform',
            }}
          >
            <svg width="26" height="16" viewBox="0 0 34 20" fill="none">
              <path
                d="M2 12 Q9 2 17 9 Q25 2 32 12 Q25 8 17 12 Q9 8 2 12 Z"
                fill="#0B4F3E"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Siluet Burung 3 */}
          <div
            className="absolute top-44 -left-36"
            style={{
              animation: isPaused ? 'none' : 'terbangBurung3 36s linear infinite 9s',
              willChange: 'transform',
            }}
          >
            <svg width="22" height="14" viewBox="0 0 34 20" fill="none">
              <path
                d="M2 12 Q9 2 17 9 Q25 2 32 12 Q25 8 17 12 Q9 8 2 12 Z"
                fill="#0B4F3E"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* 3 Siluet Kupu-kupu di dekat Bunga */}
          <div
            className="absolute bottom-28 left-1/4"
            style={{
              animation: isPaused ? 'none' : 'terbangKupuKupu 8s ease-in-out infinite',
              willChange: 'transform',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12 C8 4 2 6 4 11 C5 14 10 13 12 12 C14 13 19 14 20 11 C22 6 16 4 12 12 Z"
                fill="#D4A23A"
                opacity="0.8"
              />
            </svg>
          </div>
        </>
      )}

      {/* 4 Daun Melayang Berguguran Lembut */}
      <div
        className="absolute top-1/3 left-1/3 opacity-75"
        style={{
          animation: isPaused ? 'none' : 'gugurDaun 12s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <path
            d="M8 0 C14 6 16 14 8 22 C0 14 2 6 8 0 Z"
            fill="#34D399"
            opacity="0.85"
          />
        </svg>
      </div>

      <div
        className="absolute top-1/2 right-1/4 opacity-70"
        style={{
          animation: isPaused ? 'none' : 'gugurDaun 16s ease-in-out infinite 3s',
          willChange: 'transform',
        }}
      >
        <svg width="14" height="20" viewBox="0 0 16 22" fill="none">
          <path
            d="M8 0 C14 6 16 14 8 22 C0 14 2 6 8 0 Z"
            fill="#FDE68A"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Style Keyframes untuk TV 60 FPS Hardware-Accelerated */}
      <style>{`
        @keyframes geserAwan1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(2200px, 0, 0); }
        }
        @keyframes geserAwan2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(2300px, 0, 0); }
        }
        @keyframes geserAwan3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(2200px, 0, 0); }
        }
        @keyframes terbangBurung1 {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(1000px, -40px, 0) scale(1.05); }
          100% { transform: translate3d(2100px, -20px, 0) scale(1); }
        }
        @keyframes terbangBurung2 {
          0% { transform: translate3d(0, 0, 0) scale(0.9); }
          50% { transform: translate3d(1100px, -20px, 0) scale(0.95); }
          100% { transform: translate3d(2200px, -50px, 0) scale(0.9); }
        }
        @keyframes terbangBurung3 {
          0% { transform: translate3d(0, 0, 0) scale(0.8); }
          50% { transform: translate3d(900px, 30px, 0) scale(0.85); }
          100% { transform: translate3d(2100px, 10px, 0) scale(0.8); }
        }
        @keyframes terbangKupuKupu {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          25% { transform: translate3d(30px, -20px, 0) rotate(15deg); }
          50% { transform: translate3d(60px, 10px, 0) rotate(-10deg); }
          75% { transform: translate3d(20px, -30px, 0) rotate(10deg); }
        }
        @keyframes gugurDaun {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translate3d(80px, 160px, 0) rotate(180deg); }
          85% { opacity: 0.8; }
          100% { transform: translate3d(140px, 320px, 0) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
