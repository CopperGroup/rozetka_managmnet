"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import copy from "clipboard-copy"

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

const replaceRandomCyrillicWithLatin = (text: string): string => {
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

export default function CopyTextInput() {
  const [text, setText] = useState("");

  const handleCopy = () => {
    if (!text) {
      toast.error("Введіть текст для копіювання");
      return;
    }

    const transformedText = replaceRandomCyrillicWithLatin(text);
    copy(transformedText);

    toast.success(`Скопійовано: ${transformedText.substring(0, 50)}...`);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto bg-black p-6 rounded-2xl shadow-lg">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введіть текст..."
        className="bg-black text-white border border-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      />
      <Button
        onClick={handleCopy}
        className="w-full bg-white text-black font-semibold py-2 rounded-lg transition-all duration-200 hover:bg-gray-200 active:scale-95"
      >
        Скопіювати
      </Button>
    </div>
  );
}
