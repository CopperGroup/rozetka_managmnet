"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Plus } from "lucide-react"
import { createSeller } from "@/lib/actions/seller.actions"
import type { SellerType } from "@/lib/models/seller.model"

interface AddSellerProps {
  setSellers: React.Dispatch<React.SetStateAction<SellerType[]>>
}

export default function AddSeller({ setSellers }: AddSellerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSellerName, setNewSellerName] = useState("")
  const [newSellerPerson, setNewSellerPerson] = useState("")
  const [contactProductLink, setContactProductLink] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateSeller = async () => {
    setIsCreating(true)
    try {
      const result = await createSeller({ name: newSellerName, person: newSellerPerson, contactProductLink }, "json")
      setSellers((prevSellers) => [JSON.parse(result), ...prevSellers])
      setNewSellerName("")
      setContactProductLink("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create seller:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactProductLink" className="text-right">
              Contact product link
            </Label>
            <Input
              id="contactProductLink"
              value={contactProductLink}
              onChange={(e) => setContactProductLink(e.target.value)}
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
  )
}

