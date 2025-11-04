"use client"

import { ClipboardList, Plus } from "lucide-react"

interface TasksEmptyStateProps {
  onCreateTask?: () => void
}

export function TasksEmptyState({ onCreateTask }: TasksEmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-6">
          <ClipboardList className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">No records to show</h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Add new records or import data to get started. Try adjusting your filters or search settings if
          you're expecting to see something specific.
        </p>
        {onCreateTask && (
          <button
            onClick={onCreateTask}
            className="inline-flex items-center gap-2 bg-[#4F7CFF] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New task
          </button>
        )}
      </div>
    </div>
  )
}

