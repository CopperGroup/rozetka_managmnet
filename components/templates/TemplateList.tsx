"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, ExternalLink } from 'lucide-react'
import Link from "next/link"
import type { TemplateType } from "@/lib/models/template.model"

interface TemplateListProps {
  templates: TemplateType[]
}

export default function TemplateList({ templates }: TemplateListProps) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (template: TemplateType) => {
    setDownloading(template._id);
  
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
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(null);
    }
  };
  

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead>View</TableHead>
            <TableHead>Example</TableHead>
            <TableHead>Download</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template._id}>
              <TableCell className="font-medium">{template.name}</TableCell>
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
  )
}
