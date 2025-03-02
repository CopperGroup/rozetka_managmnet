"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { CheckCircle, type File, X, Plus } from "lucide-react"
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

const imageUploads = ["banner-hero.jpg", "1.jpg", "2.jpg", "3.jpg", "about-us.jpeg", "history-image.jpg", "loginbackground.jpg"]

export default function CreateTemplate({ onCreateTemplate }: CreateTemplateProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [gitHubUrl, setGitHubUrl] = useState("")
  const [exampleUrl, setExampleUrl] = useState("")
  const [uploads, setUploads] = useState<Record<string, File | null>>({})
  const [isLoading, setIsLoading] = useState(false)

  const { uploadFiles, isUploading, error } = useUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const fileUploads = Object.values(uploads).filter((file): file is File => file !== null);
  
      console.log(fileUploads)
      const uploadedFiles = await uploadFiles(fileUploads);
      
      if (!uploadedFiles || uploadedFiles.length !== fileUploads.length) {
        toast.error("Some files failed to upload");
        return;
      }
  
      await onCreateTemplate({
        name,
        author,
        gitHubUrl,
        exampleUrl,
        uploads: uploadedFiles
      });
  
      toast.success("Template created successfully!");
      setIsOpen(false);
      resetForm();
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to create template");
      console.log(error)
    }
  };
  

  const handleFileChange = (fileName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploads((prev) => ({ ...prev, [fileName]: e.target.files![0] }))
    }
  }

  const removeFile = (fileName: string) => {
    setUploads((prev) => ({ ...prev, [fileName]: null }))
  }

  const resetForm = () => {
    setName("")
    setAuthor("")
    setGitHubUrl("")
    setUploads({})
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
              accept={/\.(jpe?g|png|gif|webp|svg)$/i.test(fileName)  ? "image/*" : ".ts,.tsx"}
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
            <Button type="submit" className="w-full mt-4">
              Create Template
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
              </div>
            </ScrollArea>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

