"use client"

import { useState } from "react"
import { X, Sparkles, Filter, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FilterRule {
  id: string
  filter: string
  operation: string
  value: string
}

interface AdvancedFiltersModalProps {
  children: React.ReactNode
  onApply: (filters: FilterRule[], aiQuery?: string) => void
}

export function AdvancedFiltersModal({ children, onApply }: AdvancedFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState("")
  const [filterRules, setFilterRules] = useState<FilterRule[]>([
    { id: "1", filter: "", operation: "", value: "" },
  ])

  const handleAddFilter = () => {
    setFilterRules([
      ...filterRules,
      { id: String(Date.now()), filter: "", operation: "", value: "" },
    ])
  }

  const handleRemoveFilter = (id: string) => {
    if (filterRules.length > 1) {
      setFilterRules(filterRules.filter((rule) => rule.id !== id))
    }
  }

  const handleUpdateFilter = (id: string, field: keyof FilterRule, value: string) => {
    setFilterRules(
      filterRules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)),
    )
  }

  const handleClearAll = () => {
    setFilterRules([{ id: "1", filter: "", operation: "", value: "" }])
    setAiQuery("")
  }

  const handleApply = () => {
    onApply(filterRules, aiQuery)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const hasFilters = filterRules.some((rule) => rule.filter || rule.operation || rule.value) || aiQuery

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        sideOffset={8}
        className="w-[600px] p-0 bg-white rounded-xl shadow-2xl"
      >
        <div className="bg-white rounded-xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Filter</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Filter with AI Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-foreground">Filter with AI</h3>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                disabled={!aiQuery.trim()}
                className="bg-[#4F7CFF] text-white hover:bg-[#4F7CFF]/90 disabled:bg-gray-200 disabled:text-gray-400"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Standard Filtering Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-foreground">Standard Filtering</h3>
            </div>

            {/* Filter Rules */}
            <div className="space-y-3">
              {filterRules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-2">
                  <Select
                    value={rule.filter}
                    onValueChange={(value) => handleUpdateFilter(rule.id, "filter", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="assignee">Assignee</SelectItem>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={rule.operation}
                    onValueChange={(value) => handleUpdateFilter(rule.id, "operation", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greaterThan">Greater than</SelectItem>
                      <SelectItem value="lessThan">Less than</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    placeholder="Value"
                    value={rule.value}
                    onChange={(e) => handleUpdateFilter(rule.id, "value", e.target.value)}
                    className="flex-1"
                  />

                  <button
                    onClick={() => handleRemoveFilter(rule.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Filter and Clear All */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handleAddFilter}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add filter
              </Button>
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <Button onClick={handleCancel} variant="outline" className="bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!hasFilters}
            className="bg-gray-200 text-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            Apply
          </Button>
        </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

