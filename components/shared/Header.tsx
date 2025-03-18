"use client"

import Link from "next/link"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { createSellersJson } from "@/lib/actions/seller.actions"

export function Header() {
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className={`text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ${
              pathname === "/" ? "font-bold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/templates"
            className={`text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ${
              pathname === "/templates" ? "font-bold" : ""
            }`}
          >
            Templates
          </Link>
          <Link
            href="/replace-text"
            className={`text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ${
              pathname === "/replace-text" ? "font-bold" : ""
            }`}
          >
            Replace Text
          </Link>
          <Link
            href="/token"
            className={`text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors ${
              pathname === "/token" ? "font-bold" : ""
            }`}
          >
            Token
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}

