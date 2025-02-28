"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AddChatUrlModalProps {
  sellerId: string
  onAddChatUrl: (sellerId: string, chatUrl: string) => Promise<void>
}

export function AddChatUrlModal({ sellerId, onAddChatUrl }: AddChatUrlModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chatUrl, setChatUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onAddChatUrl(sellerId, chatUrl)
      setIsOpen(false)
      setChatUrl("")
    } catch (error) {
      console.error("Failed to add chat URL:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Chat URL</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Chat URL</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="chatUrl">Chat URL</Label>
            <Input
              id="chatUrl"
              value={chatUrl}
              onChange={(e) => setChatUrl(e.target.value)}
              placeholder="Enter chat URL"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add URL
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

