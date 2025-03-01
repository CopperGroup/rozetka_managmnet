import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const replaceRandomCyrillicWithLatin = (text: string): string => {
  const cyrillicToLatinMap: Record<string, string> = {
    "а": "a",
    "і": "i",
    "е": "e",
    "у": "y",
    "о": "o",
    "х": "x",
    "р": "p",
    "с": "c"
  };

  const cyrillicIndices: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (cyrillicToLatinMap[text[i]]) {
      cyrillicIndices.push(i);
    }
  }

  if (cyrillicIndices.length === 0) return text;

  const numToReplace = Math.max(1, Math.floor(Math.random() * cyrillicIndices.length) + 1);

  const shuffledIndices = cyrillicIndices.sort(() => Math.random() - 0.5).slice(0, numToReplace);

  const textArray = text.split("");

  for (const index of shuffledIndices) {
    textArray[index] = cyrillicToLatinMap[textArray[index]];
  }

  return textArray.join("");
};