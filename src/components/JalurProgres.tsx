import React from 'react';
import { Check } from 'lucide-react';

interface JalurProgresProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * JalurProgres: Garis emas berkilau dengan simpul bulat emas,
 * Meniru alur infografis pada halaman "Rangkaian Learning Experience".
 */
export const JalurProgres: React.FC<JalurProgresProps> = ({
  currentStep,
  totalSteps,
  className = '',
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-3 px-5 py-2.5 bg-[#FFFDF6] rounded-full border-2 border-[#0E4D34] shadow-md shadow-[#C9A04A]/15 ${className}`}>
      <span className="font-['Montserrat'] font-bold text-sm md:text-base text-[#0E4D34] whitespace-nowrap">
        Langkah <span className="font-['Marcellus'] font-black text-lg text-[#C9A04A]">{currentStep}</span>/{totalSteps}
      </span>

      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {steps.map((step, idx) => {
          const isPassed = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <React.Fragment key={step}>
              {idx > 0 && (
                <div
                  className={`h-0.5 w-3.5 md:w-5 transition-colors ${
                    step <= currentStep
                      ? 'bg-gradient-to-r from-[#C9A04A] to-[#F3D88A]'
                      : 'bg-[#D9CBB0]'
                  }`}
                />
              )}
              <div
                className={`
                  flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full font-['Marcellus'] font-bold text-xs md:text-sm transition-all duration-200
                  ${
                    isPassed
                      ? 'bg-[#0E4D34] text-[#F3D88A] border border-[#C9A04A] shadow-sm'
                      : isCurrent
                      ? 'bg-gradient-to-br from-[#F3D88A] to-[#C9A04A] text-[#0E4D34] border border-[#FFFDF6] ring-2 ring-[#C9A04A] scale-110 shadow-md'
                      : 'bg-[#FFFDF6] text-[#2B2A26]/40 border border-[#D9CBB0]'
                  }
                `}
              >
                {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
