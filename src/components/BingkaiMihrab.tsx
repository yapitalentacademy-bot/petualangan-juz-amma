import React from 'react';

interface BingkaiMihrabProps {
  imageSrc: string;
  altText?: string;
  className?: string;
  aspectRatio?: string;
  overlayGradient?: boolean;
}

/**
 * Bingkai Mihrab: Bentuk lengkung ogee islami dengan garis ganda
 * (luar: --zamrud-tua / --emas, dalam: --zamrud-garis)
 * Berisi gambar pemandangan realistis yang tenang dan mewah.
 */
export const BingkaiMihrab: React.FC<BingkaiMihrabProps> = ({
  imageSrc,
  altText = 'Pemandangan Wilayah',
  className = '',
  overlayGradient = true
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Mihrab Arch SVG Clip Mask Container */}
      <div className="relative p-1.5 rounded-t-[100px] md:rounded-t-[140px] rounded-b-[28px] bg-gradient-to-b from-[var(--emas)] via-[var(--zamrud-tua)] to-[var(--zamrud-tua)] shadow-2xl border-2 border-[var(--emas)]/80">
        {/* Inner Secondary Line (zamrud-garis) */}
        <div className="p-1.5 rounded-t-[92px] md:rounded-t-[132px] rounded-b-[22px] border border-[var(--zamrud-garis)]/70 bg-[var(--zamrud-tua)]">
          {/* Inner Image Frame */}
          <div className="relative overflow-hidden rounded-t-[84px] md:rounded-t-[124px] rounded-b-[18px] bg-[#0A261A]">
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {overlayGradient && (
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--zamrud-tua)]/80 via-transparent to-black/20 pointer-events-none" />
            )}
            
            {/* Soft gold light accent at top curve */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[var(--emas)]/25 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
