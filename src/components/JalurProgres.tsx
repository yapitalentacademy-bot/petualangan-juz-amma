import React from 'react';
import { Footprints } from 'lucide-react';

interface JalurProgresProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * JalurProgres — Jalan setapak dengan jejak langkah kafilah
 * Bertambah satu jejak per soal selesai
 */
export const JalurProgres: React.FC<JalurProgresProps> = ({
  currentStep,
  totalSteps,
  className = '',
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-2 px-4 py-2 bg-[#FFFDF7]/90 rounded-full border-2 border-[#E8D2A6] shadow-sm ${className}`}>
      <span className="font-teks font-black text-sm md:text-base text-[#0B4F3E] mr-1">
        Langkah {currentStep}/{totalSteps}
      </span>

      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {steps.map((step) => {
          const isPassed = step <= currentStep;
          const isCurrent = step === currentStep;

          return (
            <div
              key={step}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
                ${
                  isPassed
                    ? 'bg-[#0F7A5C] text-[#FFFDF7] shadow-sm ring-2 ring-[#0B4F3E]/30'
                    : 'bg-[#E8D2A6]/60 text-[#14233C]/40'
                }
                ${isCurrent ? 'scale-110 ring-2 ring-[#D4A23A]' : ''}
              `}
            >
              <Footprints className="w-4 h-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
