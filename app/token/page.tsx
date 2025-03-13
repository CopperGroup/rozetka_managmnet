"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Copy, Check } from "lucide-react"
import toast from "react-hot-toast"
import { createToken } from "@/lib/actions/token.actions"
import copy from "clipboard-copy"

const bookCharacters = [
  "Шерлок Холмс",
  "Гаррі Поттер",
  "Герміона Ґрейнджер",
  "Гендальф",
  "Фродо Беґінс",
  "Елізабет Беннет",
  "Аттікус Фінч",
  "Скаут Фінч",
  "Джей Ґетсбі",
  "Голден Колфілд",
  "Джейн Ейр",
  "Катніс Евердін",
  "Більбо Беґінс",
  "Гекльберрі Фінн",
  "Капітан Ахаб",
  "Дон Кіхот",
  "Ромео Монтеккі",
  "Джульєтта Капулетті",
  "Гамлет",
  "Ебенезер Скрудж",
  "Олівер Твіст",
  "Дракула",
  "Франкенштейн",
  "Аліса",
  "Дороті Ґейл",
  "Вінні-Пух",
  "Пітер Пен",
  "Матильда Вормвуд",
  "Енн Ширлі",
  "Джо Марч",
  "Аслан",
  "Арʼя Старк",
  "Джон Сноу",
  "Тіріон Ланністер",
]

// Функція для генерації випадкового токена
const generateToken = (length = 32) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// Функція для отримання випадкового персонажа
const getRandomCharacter = () => {
  return bookCharacters[Math.floor(Math.random() * bookCharacters.length)]
}

export default function TokenGenerator() {
  const [token, setToken] = useState("")
  const [character, setCharacter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerateToken = async () => {
    setIsLoading(true)
    try {
      const newToken = generateToken()
      const newCharacter = getRandomCharacter()

      setToken(newToken)
      setCharacter(newCharacter)

      // Збереження в базі даних
      await createToken({ name: newCharacter, key: newToken }, 'json') 

      toast.success("Ваш токен успішно згенеровано та збережено.")
    } catch (error) {
      console.error("Помилка при генерації токена:", error)
      toast.error("Не вдалося згенерувати та зберегти токен. Спробуйте ще раз.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    copy(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Токен скопійовано в буфер обміну.")
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Генератор Токенів</CardTitle>
          <CardDescription>Згенеруйте випадковий токен та привʼяжіть його до імені літературного персонажа</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {token && (
            <>
              <div className="space-y-2">
                <div className="text-sm font-medium">Ім'я Персонажа:</div>
                <div className="p-3 bg-muted rounded-md flex justify-between items-center">
                  <span className="font-mono">{character}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Ключ Токена:</div>
                <div className="p-3 bg-muted rounded-md flex justify-between items-center">
                  <span className="font-mono text-xs truncate">{token}</span>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateToken} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Генерація...
              </>
            ) : (
              "Згенерувати Новий Токен"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
