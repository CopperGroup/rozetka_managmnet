"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Copy, ExternalLink, Edit2, Check, X } from "lucide-react"
import Link from "next/link"
import copy from "clipboard-copy"
import toast from "react-hot-toast"
import { AddChatUrlModal } from "@/components/Modals/AddChatUrl"
import { AddContactProductLinkModal } from "@/components/Modals/AddContactProductLink"
import { AddWebsiteUrlModal } from "@/components/Modals/AddWebsiteUrlModal"
import { changeSellerStatus, updateSeller } from "@/lib/actions/seller.actions"
import type { SellerType } from "@/lib/models/seller.model"
import {
  getAvailableStatuses,
  getStatusColor,
  getStatusIcon,
  getClipboardText,
  isStatusMoreThan,
} from "@/lib/seller.utils"
import { cn, replaceRandomCyrillicWithLatin } from "@/lib/utils"

interface SellerTableProps {
  sellers: SellerType[]
  setSellers: React.Dispatch<React.SetStateAction<SellerType[]>>
  nicheName: string
  currentPerson: string
  visibleColumns: {
    name: boolean
    status: boolean
    person: boolean
    lastUpdated: boolean
    actions: boolean
    chatLink: boolean
    contactProduct: boolean
    websiteLink: boolean
  }
}

export default function SellerTable({
  sellers,
  setSellers,
  nicheName,
  currentPerson,
  visibleColumns,
}: SellerTableProps) {
  const [editingSeller, setEditingSeller] = useState<string | null>(null)
  const [editedValues, setEditedValues] = useState<Partial<SellerType>>({})

  const handleEdit = (sellerId: string) => {
    setEditingSeller(sellerId)
    setEditedValues(sellers.find((s) => s._id === sellerId) || {})
  }

  const handleCancelEdit = () => {
    setEditingSeller(null)
    setEditedValues({})
  }

  const handleSaveEdit = async (sellerId: string) => {
    try {
      await updateSeller(sellerId, editedValues)
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId ? { ...seller, ...editedValues, updatedAt: new Date().toISOString() } : seller,
        ),
      )
      setEditingSeller(null)
      setEditedValues({})
      toast.success("Seller updated successfully")
    } catch (error) {
      console.error("Failed to update seller:", error)
      toast.error("Failed to update seller")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SellerType) => {
    setEditedValues((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleStatusChange = async (sellerId: string, newStatus: string) => {
    await changeSellerStatus({ sellerId, newStatus })
    setSellers((prevSellers) =>
      prevSellers.map((seller) =>
        seller._id === sellerId ? { ...seller, status: newStatus, updatedAt: new Date().toISOString() } : seller,
      ),
    )

    const seller = sellers.find((s) => s._id === sellerId)
    if (seller) {
      const clipboardText = replaceRandomCyrillicWithLatin(getClipboardText(newStatus, nicheName || seller.name) || "")
      if (clipboardText) {
        copy(clipboardText)
          .then(() => {
            toast.success(`Статус оновлено та скопійовано: ${clipboardText.substring(0, 50)}...`)
          })
          .catch(() => {
            toast.error("Статус оновлено, але не вдалося скопіювати текст")
          })
      } else {
        toast.success("Статус оновлено")
      }
    }
  }

  const handleCopyToClipboard = (status: string, sellerName: string) => {
    const text = replaceRandomCyrillicWithLatin(getClipboardText(status, nicheName || sellerName) || "")
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

  const handleChatAdd = async (sellerId: string, chatUrl: string) => {
    try {
      await updateSeller(sellerId, { chatUrl })
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId ? { ...seller, chatUrl: chatUrl, updatedAt: new Date().toISOString() } : seller,
        ),
      )
      toast.success("Chat URL added successfully")
    } catch (error) {
      console.error("Failed to add chat URL:", error)
      toast.error("Failed to add chat URL")
    }
  }

  const handleAddContactProductLink = async (sellerId: string, contactProductLink: string) => {
    try {
      await updateSeller(sellerId, { contactProductLink })
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId
            ? { ...seller, contactProductLink: contactProductLink, updatedAt: new Date().toISOString() }
            : seller,
        ),
      )
      toast.success("Contact product link added successfully")
    } catch (error) {
      console.error("Failed to add contact product link:", error)
      toast.error("Failed to add contact product link")
    }
  }

  const handleAddWebsiteUrl = async (sellerId: string, websiteUrl: string) => {
    try {
      await updateSeller(sellerId, { websiteUrl })
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId ? { ...seller, websiteUrl: websiteUrl, updatedAt: new Date().toISOString() } : seller,
        ),
      )
      toast.success("Website URL added successfully")
    } catch (error) {
      console.error("Failed to add website URL:", error)
      toast.error("Failed to add website URL")
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr>
            {visibleColumns.name && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
            )}
            {visibleColumns.status && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            )}
            {visibleColumns.person && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Person
              </th>
            )}
            {visibleColumns.lastUpdated && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Updated
              </th>
            )}
            {visibleColumns.actions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            )}
            {visibleColumns.chatLink && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Chat link
              </th>
            )}
            {visibleColumns.contactProduct && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact product
              </th>
            )}
            {visibleColumns.websiteLink && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Website link
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Edit
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-zinc-950 dark:divide-zinc-700">
          {sellers.map((seller) => (
            <tr key={seller._id} className="hover:bg-gray-50 dark:hover:bg-zinc-900">
              {visibleColumns.name && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {editingSeller === seller._id ? (
                    <Input
                      value={editedValues.name || ""}
                      onChange={(e) => handleInputChange(e, "name")}
                      className="w-full"
                    />
                  ) : (
                    seller.name
                  )}
                </td>
              )}
              {visibleColumns.status && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn("flex items-center", getStatusColor(seller.status))}>
                    {getStatusIcon(seller.status)}
                    {seller.status}
                  </span>
                </td>
              )}
              {visibleColumns.person && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {editingSeller === seller._id ? (
                    <Input
                      value={editedValues.person || ""}
                      onChange={(e) => handleInputChange(e, "person")}
                      className="w-full"
                    />
                  ) : (
                    seller.person
                  )}
                </td>
              )}
              {visibleColumns.lastUpdated && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {new Date(seller.updatedAt).toLocaleString()}
                </td>
              )}
              {visibleColumns.actions && (
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
              )}
              {visibleColumns.chatLink && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingSeller === seller._id ? (
                    <Input
                      value={editedValues.chatUrl || ""}
                      onChange={(e) => handleInputChange(e, "chatUrl")}
                      className="w-full"
                      placeholder="Enter chat URL"
                    />
                  ) : seller.chatUrl ? (
                    <Link
                      href={seller.chatUrl}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <div className="flex gap-1 items-center">
                        <span>Chat</span>
                        <ExternalLink className="size-4" />
                      </div>
                    </Link>
                  ) : (
                    <AddChatUrlModal sellerId={seller._id} onAddChatUrl={handleChatAdd} />
                  )}
                </td>
              )}
              {visibleColumns.contactProduct && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingSeller === seller._id ? (
                    <Input
                      value={editedValues.contactProductLink || ""}
                      onChange={(e) => handleInputChange(e, "contactProductLink")}
                      className="w-full"
                      placeholder="Enter contact product link"
                    />
                  ) : seller.contactProductLink ? (
                    <Link
                      href={seller.contactProductLink}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <div className="flex gap-1 items-center">
                        <span>Product</span>
                        <ExternalLink className="size-4" />
                      </div>
                    </Link>
                  ) : (
                    <AddContactProductLinkModal
                      sellerId={seller._id}
                      onAddContactProductLink={handleAddContactProductLink}
                    />
                  )}
                </td>
              )}
              {visibleColumns.websiteLink && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingSeller === seller._id ? (
                    <Input
                      value={editedValues.websiteUrl || ""}
                      onChange={(e) => handleInputChange(e, "websiteUrl")}
                      className="w-full"
                      placeholder="Enter website URL"
                    />
                  ) : seller.websiteUrl ? (
                    <Link
                      href={seller.websiteUrl}
                      target="_blank"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <div className="flex gap-1 items-center">
                        <span>Website</span>
                        <ExternalLink className="size-4" />
                      </div>
                    </Link>
                  ) : (
                    isStatusMoreThan(seller.status, "Запропонували") && (
                      <AddWebsiteUrlModal sellerId={seller._id} onAddWebsiteUrl={handleAddWebsiteUrl} />
                    )
                  )}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {editingSeller === seller._id ? (
                    <>
                      <Button variant="outline" size="icon" onClick={() => handleSaveEdit(seller._id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleCancelEdit} className="ml-1">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="icon" onClick={() => handleEdit(seller._id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

