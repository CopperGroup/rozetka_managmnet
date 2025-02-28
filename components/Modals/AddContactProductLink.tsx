"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AddContactProductLinkModalProps {
  sellerId: string
  onAddContactProductLink: (sellerId: string, contactProductLink: string) => Promise<void>
}

export function AddContactProductLinkModal({ sellerId, onAddContactProductLink }: AddContactProductLinkModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [contactProductLink, setContactProductLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onAddContactProductLink(sellerId, contactProductLink)
      setIsOpen(false)
      setContactProductLink("")
    } catch (error) {
      console.error("Failed to add contact product link:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Contact Product Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact Product Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="contactProductLink">Contact Product Link</Label>
            <Input
              id="contactProductLink"
              value={contactProductLink}
              onChange={(e) => setContactProductLink(e.target.value)}
              placeholder="Enter contact product link"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Link
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}