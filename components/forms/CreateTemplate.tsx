"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import type { TemplateType } from "@/lib/models/template.model"

interface CreateTemplateProps {
  onCreateTemplate: (template: Omit<TemplateType, "_id" | "createdAt" | "updatedAt">) => void
}

export function CreateTemplate({ onCreateTemplate }: CreateTemplateProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [gitHubUrl, setGitHubUrl] = useState("")
  const [exampleUrl, setExampleUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateTemplate({
      name,
      author,
      gitHubUrl,
      exampleUrl,
    })
    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setAuthor("")
    setGitHubUrl("")
    setExampleUrl("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gitHubUrl">GitHub URL</Label>
            <Input
              id="gitHubUrl"
              value={gitHubUrl}
              onChange={(e) => setGitHubUrl(e.target.value)}
              required
              type="url"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exampleUrl">Example URL (optional)</Label>
            <Input id="exampleUrl" value={exampleUrl} onChange={(e) => setExampleUrl(e.target.value)} type="url" />
          </div>
          <Button type="submit" className="w-full">
            Create Template
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

