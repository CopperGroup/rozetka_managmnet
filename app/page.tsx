"use client"

import { useState, useEffect } from "react"
import { fetchSellers } from "@/lib/actions/seller.actions"
import type { SellerType } from "@/lib/models/seller.model"
import { Loader2 } from "lucide-react"
import { Toaster } from "react-hot-toast"
import Pagination from "@/components/table/Pagination"
import SellerTable from "@/components/table/SellerTable"
import TableSettings from "@/components/table/TableSettings"
import AddSeller from "@/components/forms/AddSeller"
import SearchFilters from "@/components/table/SearchFilters"
import { Header } from "@/components/shared/Header"
import { isSameDay } from "date-fns"

export default function Home() {
  const [sellers, setSellers] = useState<SellerType[]>([])
  const [filteredSellers, setFilteredSellers] = useState<SellerType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [personFilter, setPersonFilter] = useState("all")
  const [currentPerson, setCurrentPerson] = useState("")
  const [nicheName, setNicheName] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    status: true,
    person: true,
    lastUpdated: true,
    actions: true,
    chatLink: true,
    contactProduct: true,
    websiteLink: true,
  })

  useEffect(() => {
    const loadSellers = async () => {
      setIsLoading(true)
      try {
        const result = await fetchSellers("json");
        const fetchedSellers: SellerType[] = JSON.parse(result)

        const sortedSellers = fetchedSellers.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        setSellers(sortedSellers)
        setFilteredSellers(sortedSellers)
      } catch (error) {
        console.error("Failed to load sellers:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSellers()
  }, [])

  useEffect(() => {
    const filtered = sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || seller.status === statusFilter) &&
        (personFilter === "all" || seller.person === personFilter) &&
        (!dateFilter || isSameDay(new Date(seller.updatedAt), dateFilter)),
    )
    setFilteredSellers(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, statusFilter, personFilter, dateFilter, sellers])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSellers = filteredSellers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const persons = Array.from(new Set(sellers.map((seller) => seller.person)))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seller Management</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-2">
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            nicheName={nicheName}
            setNicheName={setNicheName}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            personFilter={personFilter}
            setPersonFilter={setPersonFilter}
            persons={persons}
            onOpenSettings={() => setIsSettingsOpen(true)}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter} 
            currentPerson={currentPerson} 
            setCurrentPerson={setCurrentPerson}          
          />
        </div>
        <div className="w-full flex justify-end mb-6">
          <AddSeller setSellers={setSellers} />
        </div>

        <TableSettings
          isOpen={isSettingsOpen}
          setIsOpen={setIsSettingsOpen}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

        <div className="overflow-x-auto mt-6">
          <SellerTable
            sellers={currentSellers}
            setSellers={setSellers}
            nicheName={nicheName}
            visibleColumns={visibleColumns}
          />
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      </main>
    </>
  )
}

