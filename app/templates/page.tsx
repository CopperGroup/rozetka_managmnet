"use client"

import { useState, useEffect } from "react"
import type { TemplateType } from "@/lib/models/template.model"
import { Header } from "@/components/shared/Header"
import { CreateTemplate } from "@/components/forms/CreateTemplate"
import { TemplateCard } from "@/components/cards/TemplateCard"
import { createTemplate } from "@/lib/actions/template.actions"

// Mock data for templates
const mockTemplates: TemplateType[] = [
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateType[]>([])

  useEffect(() => {
    // In a real application, you would fetch the templates from an API
    // For now, we'll use the mock data
    setTemplates(mockTemplates)
  }, [])

  const handleCreateTemplate = async (newTemplate: Omit<TemplateType, "_id" | "createdAt" | "updatedAt">) => {
    try {
      // Ensure `exampleUrl` is `undefined` instead of `null`
      const sanitizedTemplate = {
        ...newTemplate,
        exampleUrl: newTemplate.exampleUrl ?? undefined
      };
  
      const createdTemplate = await createTemplate(sanitizedTemplate);
  
      setTemplates((prevTemplates) => [createdTemplate, ...prevTemplates]);
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Templates</h1>
          <CreateTemplate onCreateTemplate={handleCreateTemplate} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template._id} template={template} />
          ))}
        </div>
      </main>
    </div>
  )
}

