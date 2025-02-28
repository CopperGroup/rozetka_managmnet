"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import type { TemplateType } from "@/lib/models/template.model"

interface TemplateCardProps {
  template: TemplateType
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`git clone ${template.gitHubUrl}`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const formatDate = (date: string) => {
    const now = new Date()
    const updateDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - updateDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ago ${diffHours}h`
    } else {
      return `${diffHours}h ago`
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={``}
          alt={template.name}
          width={800}
          height={400}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">by {template.author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Updated {formatDate(template.updatedAt)}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={copyToClipboard} variant={copied ? "outline" : "default"}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" /> Git Clone
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

