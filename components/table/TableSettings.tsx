import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TableSettingsProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
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
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<{
      name: boolean
      status: boolean
      person: boolean
      lastUpdated: boolean
      actions: boolean
      chatLink: boolean
      contactProduct: boolean
      websiteLink: boolean
    }>
  >
}

export default function TableSettings({ isOpen, setIsOpen, visibleColumns, setVisibleColumns }: TableSettingsProps) {
  // Define required columns that cannot be toggled off
  const requiredColumns = ["name", "status", "person", "lastUpdated", "actions", "chatLink"]

  const handleToggleColumn = (column: string) => {
    // Don't allow toggling off required columns
    if (requiredColumns.includes(column)) return

    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof visibleColumns],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Table Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select which columns to display in the table. Required columns cannot be disabled.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="column-name" checked={visibleColumns.name} disabled={true} />
              <Label htmlFor="column-name" className={requiredColumns.includes("name") ? "font-medium" : ""}>
                Name{" "}
                {requiredColumns.includes("name") && <span className="text-xs text-muted-foreground">(Required)</span>}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="column-status" checked={visibleColumns.status} disabled={true} />
              <Label htmlFor="column-status" className={requiredColumns.includes("status") ? "font-medium" : ""}>
                Status{" "}
                {requiredColumns.includes("status") && (
                  <span className="text-xs text-muted-foreground">(Required)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="column-person" checked={visibleColumns.person} disabled={true} />
              <Label htmlFor="column-person" className={requiredColumns.includes("person") ? "font-medium" : ""}>
                Person{" "}
                {requiredColumns.includes("person") && (
                  <span className="text-xs text-muted-foreground">(Required)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="column-lastUpdated" checked={visibleColumns.lastUpdated} disabled={true} />
              <Label
                htmlFor="column-lastUpdated"
                className={requiredColumns.includes("lastUpdated") ? "font-medium" : ""}
              >
                Last Updated{" "}
                {requiredColumns.includes("lastUpdated") && (
                  <span className="text-xs text-muted-foreground">(Required)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="column-actions" checked={visibleColumns.actions} disabled={true} />
              <Label htmlFor="column-actions" className={requiredColumns.includes("actions") ? "font-medium" : ""}>
                Actions{" "}
                {requiredColumns.includes("actions") && (
                  <span className="text-xs text-muted-foreground">(Required)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="column-chatLink" checked={visibleColumns.chatLink} disabled={true} />
              <Label htmlFor="column-chatLink" className={requiredColumns.includes("chatLink") ? "font-medium" : ""}>
                Chat Link{" "}
                {requiredColumns.includes("chatLink") && (
                  <span className="text-xs text-muted-foreground">(Required)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="column-contactProduct"
                checked={visibleColumns.contactProduct}
                onCheckedChange={() => handleToggleColumn("contactProduct")}
              />
              <Label htmlFor="column-contactProduct">Contact Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="column-websiteLink"
                checked={visibleColumns.websiteLink}
                onCheckedChange={() => handleToggleColumn("websiteLink")}
              />
              <Label htmlFor="column-websiteLink">Website Link</Label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

