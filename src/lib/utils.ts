import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce click handler to prevent accidental double-tap on TV touchscreen (within 300ms)
 */
export function createTouchHandler(callback: () => void, debounceMs = 300) {
  let lastTouchTime = 0;
  return () => {
    const now = Date.now();
    if (now - lastTouchTime >= debounceMs) {
      lastTouchTime = now;
      callback();
    }
  };
}

/**
 * Format numbers into Indonesian formatted strings or pad numbers
 */
export function padSurahAyatNumber(num: number, length = 3): string {
  return String(num).padStart(length, '0');
}
