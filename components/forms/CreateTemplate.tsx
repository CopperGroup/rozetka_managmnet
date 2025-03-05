"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { CheckCircle, X, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TemplateType } from "@/lib/models/template.model"
import { useUpload } from "@/hooks/useUpload"

interface CreateTemplateProps {
  onCreateTemplate: (template: Omit<TemplateType, "_id" | "createdAt" | "updatedAt">) => Promise<void>
}

const componentUploads = [
  "Header.tsx",
  "BannerHero.tsx",
  "AboutUs.tsx",
  "Brand.tsx",
  "Categories.tsx",
  "History.tsx",
  "Footer.tsx",
  "BurgerMenu.tsx",
  "ProductCard.tsx",
]

const imageUploads = [
  "banner-hero.jpg",
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "about-us.jpeg",
  "history-image.jpg",
  "loginbackground.jpg",
]

export default function CreateTemplate({ onCreateTemplate }: CreateTemplateProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [gitHubUrl, setGitHubUrl] = useState("")
  const [exampleUrl, setExampleUrl] = useState("")
  const [uploads, setUploads] = useState<Record<string, File | null>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [customUploads, setCustomUploads] = useState<File[]>([])

  const { uploadFiles, isUploading, error } = useUpload()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const fileUploads = Object.values(uploads).filter((file): file is File => file !== null)

      // Add custom uploads to the fileUploads array
      const allFileUploads = [...fileUploads, ...customUploads]

      console.log(allFileUploads)
      const uploadedFiles = await uploadFiles(allFileUploads)

      if (!uploadedFiles || uploadedFiles.length !== allFileUploads.length) {
        toast.error("Some files failed to upload")
        return
      }

      await onCreateTemplate({
        name,
        author,
        gitHubUrl,
        exampleUrl,
        uploads: uploadedFiles,
      })

      toast.success("Template created successfully!")
      setIsOpen(false)
      resetForm()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to create template")
      console.log(error)
    }
  }

  const handleFileChange = (fileName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploads((prev) => ({ ...prev, [fileName]: e.target.files![0] }))
    }
  }

  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setCustomUploads((prev) => [...prev, ...newFiles])
    }
  }

  const removeCustomFile = (index: number) => {
    setCustomUploads((prev) => prev.filter((_, i) => i !== index))
  }

  const removeFile = (fileName: string) => {
    setUploads((prev) => ({ ...prev, [fileName]: null }))
  }

  const resetForm = () => {
    setName("")
    setAuthor("")
    setGitHubUrl("")
    setUploads({})
    setCustomUploads([])
  }

  const FileUploadItem = ({ fileName }: { fileName: string }) => (
    <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
      <span
        className={`flex-1 text-sm ${fileName.endsWith(".ts") || fileName.endsWith(".tsx") ? "italic font-medium" : ""}`}
      >
        {fileName}
      </span>
      <div className="flex items-center gap-2">
        {uploads[fileName] ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(fileName)} className="p-1 h-auto">
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <label htmlFor={fileName} className="cursor-pointer">
            <Plus className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            <Input
              id={fileName}
              type="file"
              onChange={handleFileChange(fileName)}
              className="hidden"
              accept={/\.(jpe?g|png|gif|webp|svg)$/i.test(fileName) ? "image/*" : ".ts,.tsx"}
            />
          </label>
        )}
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Template</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gitHubUrl">GitHub URL</Label>
              <Input
                id="gitHubUrl"
                value={gitHubUrl}
                onChange={(e) => setGitHubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exampleUrl">Example URL</Label>
              <Input
                id="exampleUrl"
                value={exampleUrl}
                onChange={(e) => setExampleUrl(e.target.value)}
                placeholder="https://website.com"
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Template"}
            </Button>
          </div>
          <div className="flex-1">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Component Files</h3>
                  <div className="space-y-2">
                    {componentUploads.map((fileName) => (
                      <FileUploadItem key={fileName} fileName={fileName} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Image Files</h3>
                  <div className="space-y-2">
                    {imageUploads.map((fileName) => (
                      <FileUploadItem key={fileName} fileName={fileName} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Custom Uploads</h3>
                    <label htmlFor="custom-file-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => document.getElementById("custom-file-upload")?.click()}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add File
                      </Button>
                      <Input
                        id="custom-file-upload"
                        type="file"
                        onChange={handleCustomFileChange}
                        className="hidden"
                        multiple
                      />
                    </label>
                  </div>
                  <div className="space-y-2">
                    {customUploads.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                      >
                        <span className="flex-1 text-sm truncate">{file.name}</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomFile(index)}
                            className="p-1 h-auto"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {customUploads.length === 0 && (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Click the "Add File" button to add custom uploads
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

