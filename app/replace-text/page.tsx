"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"
import copy from "clipboard-copy"
import { replaceRandomCyrillicWithLatin } from "@/lib/utils"
import { Copy } from "lucide-react"

export default function CopyTextInput() {
  const [text, setText] = useState("")
  const [transformedText, setTransformedText] = useState("")

  // Update transformed text whenever input changes
  useEffect(() => {
    if (text) {
      setTransformedText(replaceRandomCyrillicWithLatin(text))
    } else {
      setTransformedText("")
    }
  }, [text])

  const handleCopy = () => {
    if (!text) {
      toast.error("Введіть текст для копіювання")
      return
    }

    copy(transformedText)
      .then(() => {
        toast.success(`Скопійовано: ${transformedText.substring(0, 50)}${transformedText.length > 50 ? "..." : ""}`)
      })
      .catch(() => {
        toast.error("Не вдалося скопіювати текст")
      })
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col gap-5 w-full max-w-4xl p-8 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-xl font-bold text-center mb-2">Конвертер тексту</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="input-text" className="text-sm font-medium">
              Оригінальний текст:
            </label>
            <Textarea
              id="input-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введіть текст..."
              className="border border-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent min-h-[200px] resize-none"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label htmlFor="output-text" className="text-sm font-medium">
              Трансформований текст:
            </label>
            <Textarea
              id="output-text"
              value={transformedText}
              readOnly
              className="border border-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 min-h-[200px] resize-none"
            />
          </div>
        </div>

        <Button
          onClick={handleCopy}
          className="w-full font-semibold py-3 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Скопіювати трансформований текст
        </Button>
      </div>
    </div>
  )
}

