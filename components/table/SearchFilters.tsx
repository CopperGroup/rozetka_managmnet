"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Settings } from "lucide-react"
import { statusFlow } from "@/constants/status-flow"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  nicheName: string
  setNicheName: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  personFilter: string
  setPersonFilter: (value: string) => void
  persons: string[]
  onOpenSettings: () => void
}

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  nicheName,
  setNicheName,
  statusFilter,
  setStatusFilter,
  personFilter,
  setPersonFilter,
  persons,
  onOpenSettings,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
      <div className="relative w-full md:w-1/3">
        <Input
          type="text"
          placeholder="Search sellers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <div className="relative w-full md:w-1/3">
        <Input
          type="text"
          placeholder="Enter products name..."
          value={nicheName}
          onChange={(e) => setNicheName(e.target.value)}
          className="pl-3"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statusFlow.map((status) => (
            <SelectItem key={status} value={status} className={getStatusColor(status)}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={personFilter} onValueChange={setPersonFilter}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by person" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Persons</SelectItem>
          {persons.map((person) => (
            <SelectItem key={person} value={person}>
              {person}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={onOpenSettings} title="Table Settings" className="min-w-9 h-9">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "Клієнт":
      return "text-green-600"
    case "Відмовили":
    case "Не хочуть подивитися":
      return "text-red-600"
    case "В процесі":
    case "Zoom":
    case "Взяли/Дали контакт":
      return "text-blue-600"
    default:
      return "text-gray-600"
  }
}

