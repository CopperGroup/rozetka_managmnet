"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import type { TemplateType } from "@/lib/models/template.model"

interface TemplateListProps {
  templates: TemplateType[]
}

export default function TemplateList({ templates }: TemplateListProps) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)

  const authors = useMemo(() => {
    const authorSet = new Set(templates.map((template) => template.author))
    return Array.from(authorSet)
  }, [templates])

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const nameMatch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
      const authorMatch = !selectedAuthor || template.author === selectedAuthor
      return nameMatch && authorMatch
    })
  }, [templates, searchTerm, selectedAuthor])

  const handleDownload = async (template: TemplateType) => {
    setDownloading(template._id)
    try {
        const response = await fetch("/api/download-files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: template.name, files: template.uploads }),
        });
    
        if (!response.ok) throw new Error("Failed to download");
    
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template.name}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      setDownloading(null)
    } catch (error) {
      console.error("Download failed:", error)
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <Select value={selectedAuthor || ""} onValueChange={(value) => setSelectedAuthor(value || null)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {authors.map((author) => (
              <SelectItem key={author} value={author}>
                {author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>View</TableHead>
              <TableHead>Example</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template._id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>{template.author}</TableCell>
                <TableCell>
                  <Link
                    href={template.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    View <ExternalLink className="w-4 h-4" />
                  </Link>
                </TableCell>
                <TableCell>
                  {template.exampleUrl && (
                    <Link
                      href={template.exampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      Example <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(template)}
                    disabled={downloading === template._id}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading === template._id ? "Downloading..." : "Download"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

