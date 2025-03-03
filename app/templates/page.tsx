"use client"

import { useState, useEffect } from "react"
import type { TemplateType } from "@/lib/models/template.model"
import CreateTemplate from "@/components/forms/CreateTemplate"
import { createTemplate, fetchTemplates } from "@/lib/actions/template.actions"
import TemplateList from "@/components/templates/TemplateList"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateType[]>([])

  useEffect(() => {
    const getTemplates = async () => {
      const result = await fetchTemplates("json")

      setTemplates(JSON.parse(result))
    }

    getTemplates()
  }, [])

  const handleCreateTemplate = async (newTemplate: Omit<TemplateType, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const createdTemplate = await createTemplate(newTemplate)
      setTemplates((prevTemplates) => [createdTemplate, ...prevTemplates])
    } catch (error) {
      console.error("Failed to create template:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Templates</h1>
          <CreateTemplate onCreateTemplate={handleCreateTemplate} />
        </div>
        <TemplateList templates={templates} />
      </main>
    </div>
  )
}

