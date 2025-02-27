"use client"

import { useState, useEffect } from "react"
import { fetchSellers, createSeller, changeSellerStatus, changeSellerPerson } from "@/lib/actions/seller.actions"
import type { SellerType } from "@/lib/models/seller.model"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Loader2, Copy } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import copy from "clipboard-copy"

const statusFlow = [
  "Запитали за товар",
  "Дякую",
  "Запропонували",
  "Хочуть подивитися",
  "Надіслали сайт",
  "Взяли/Дали контакт",
  "Zoom",
  "В процесі",
  "Клієнт",
  "Відмовили",
  "Не хочуть подивитися",
]

const getNextStatuses = (currentStatus: string) => {
  switch (currentStatus) {
    case "Запитали за товар":
      return ["Дякую"]
    case "Дякую":
      return ["Запропонували"]
    case "Запропонували":
      return ["Хочуть подивитися", "Не хочуть подивитися"]
    case "Хочуть подивитися":
      return ["Надіслали сайт"]
    case "Надіслали сайт":
      return ["Взяли/Дали контакт", "Відмовили"]
    case "Взяли/Дали контакт":
      return ["Zoom"]
    case "Zoom":
      return ["В процесі"]
    case "В процесі":
      return ["Клієнт"]
    default:
      return []
  }
}

const getPreviousStatus = (currentStatus: string) => {
  const currentIndex = statusFlow.indexOf(currentStatus)
  if (currentIndex <= 0) return null
  if (currentStatus === "Відмовили" || currentStatus === "Не хочуть подивитися") {
    return "Запропонували"
  }
  return statusFlow[currentIndex - 1]
}

const getAvailableStatuses = (currentStatus: string) => {
  const previousStatus = getPreviousStatus(currentStatus)
  const nextStatuses = getNextStatuses(currentStatus)

  let availableStatuses = [currentStatus]

  if (previousStatus) {
    availableStatuses.unshift(previousStatus)
  }

  if (nextStatuses.length > 0) {
    availableStatuses = availableStatuses.concat(nextStatuses)
  }

  return availableStatuses
}

const getStatusColor = (status: string) => {
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Клієнт":
      return <CheckCircle2 className="inline-block mr-2" size={16} />
    case "Відмовили":
    case "Не хочуть подивитися":
      return <XCircle className="inline-block mr-2" size={16} />
    default:
      return null
  }
}

const getDayTime = () => {
  const hours = new Date().getHours();

  if (hours >= 5 && hours < 12) {
    return "ранку"; // morning
  } else if (hours >= 12 && hours < 18) {
    return "дня"; // afternoon
  } else {
    return "вечора"; // evening
  }
}

const getClipboardText = (status: string) => {
  const dayTime = getDayTime();  // Get the current time of day

  switch (status) {
    case "Запитали за товар":
      return `Доброго ${dayTime}!) У вас є веб-сторінка де можна весь каталог джинсів глянути?)`
    case "Дякую":
      return `Дякую!)`
    case "Запропонували":
      return `Доброго ${dayTime}, я тут посидів трохи вчора і зробив вам власний інтернет магазин. Якщо хочете глянути, то можу кинути лінк. Переніс деякі ваші товари)`
    case "Надіслали сайт":
      return `Доброго ${dayTime}, даруйте, що так пізно, були пари. Ось покликання, воно частинами, адже Розетка блокує, якщо кидати повним`
    default:
      return null
  }
}

export default function Home() {
  const [sellers, setSellers] = useState<SellerType[]>([])
  const [filteredSellers, setFilteredSellers] = useState<SellerType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [personFilter, setPersonFilter] = useState("all")
  const [newSellerName, setNewSellerName] = useState("")
  const [newSellerPerson, setNewSellerPerson] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingPerson, setEditingPerson] = useState<string | null>(null)

  useEffect(() => {
    const loadSellers = async () => {
      setIsLoading(true)
      try {
        const fetchedSellers = await fetchSellers()
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
        (personFilter === "all" || seller.person === personFilter),
    )
    setFilteredSellers(filtered)
  }, [searchTerm, statusFilter, personFilter, sellers])

  const handleCopyToClipboard = (status: string) => {
    const text = getClipboardText(status)
    if (text) {
      copy(text)
        .then(() => {
          toast.success(`Скопійовано: ${text.substring(0, 50)}...`)
        })
        .catch(() => {
          toast.error("Не вдалося скопіювати текст")
        })
    }
  }

  const handleStatusChange = async (sellerId: string, newStatus: string) => {
    await changeSellerStatus({ sellerId, newStatus })
    const updatedSellers = sellers.map((seller) =>
      seller._id === sellerId ? { ...seller, status: newStatus, updatedAt: new Date().toISOString() } : seller,
    )
    setSellers(updatedSellers)
  }

  const handlePersonChange = async (sellerId: string, newPerson: string) => {
    await changeSellerPerson({ sellerId, newPerson })
    const updatedSellers = sellers.map((seller) =>
      seller._id === sellerId ? { ...seller, person: newPerson, updatedAt: new Date().toISOString() } : seller,
    )
    setSellers(updatedSellers)
    setEditingPerson(null)
  }

  const handleCreateSeller = async () => {
    setIsCreating(true)
    try {
      const result = await createSeller({ name: newSellerName, person: newSellerPerson }, "json")
      setSellers((prevSellers) => [JSON.parse(result), ...prevSellers])
      setNewSellerName("")
      setNewSellerPerson("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create seller:", error)
    } finally {
      setIsCreating(false)
    }
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
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8">Seller Management</h1>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusFlow.map((status) => (
              <SelectItem key={status} value={status}>
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2" size={20} /> Add Seller
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Seller</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newSellerName}
                  onChange={(e) => setNewSellerName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="person" className="text-right">
                  Person
                </Label>
                <Input
                  id="person"
                  value={newSellerPerson}
                  onChange={(e) => setNewSellerPerson(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleCreateSeller} disabled={isCreating}>
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Seller
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSellers.map((seller) => (
              <tr key={seller._id}>
                <td className="px-6 py-4 whitespace-nowrap">{seller.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusColor(seller.status)}>
                    {getStatusIcon(seller.status)}
                    {seller.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingPerson === seller._id ? (
                    <Input
                      value={seller.person}
                      onChange={(e) => {
                        const updatedSellers = sellers.map((s) =>
                          s._id === seller._id ? { ...s, person: e.target.value } : s,
                        )
                        setSellers(updatedSellers)
                      }}
                      onBlur={() => handlePersonChange(seller._id, seller.person)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handlePersonChange(seller._id, seller.person)
                        }
                      }}
                      className="w-full"
                    />
                  ) : (
                    <span onClick={() => setEditingPerson(seller._id)} className="cursor-pointer hover:underline">
                      {seller.person}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(seller.updatedAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Select value={seller.status} onValueChange={(value) => handleStatusChange(seller._id, value)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableStatuses(seller.status).map((status, index) => (
                          <SelectItem key={status} value={status}>
                            <span className={`flex items-center ${getStatusColor(status)}`}>
                              {index === 0 && status !== seller.status && <ArrowLeft className="mr-2" size={16} />}
                              {status === seller.status && <span className="font-bold mr-2">Current:</span>}
                              {index > 0 && status !== seller.status && <ArrowRight className="mr-2" size={16} />}
                              {getStatusIcon(status)}
                              {status}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getClipboardText(seller.status, seller.name) && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyToClipboard(seller.status, seller.name)}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

