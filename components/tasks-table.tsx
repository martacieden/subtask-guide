"use client"

import { CheckCircle2, Circle, Info, Play, MoreHorizontal, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Task {
  id: string
  taskId?: string // ID like PROJ-7, FAC-14
  status: "pending" | "completed" | "Created" | "In Progress" | string
  organization?: string
  name: string
  title?: string
  description?: string
  priority: string
  dueDate?: string
  assignee?: string
  reporter?: string
  category?: string
  project?: string
  amount?: string
  hint?: string
  videoUrl?: string
  steps?: string[]
  hasSubtasks?: boolean
  isExpanded?: boolean
}

interface TasksTableProps {
  tasks: Task[]
  onTaskComplete?: (taskId: string) => void
  onTaskClick?: (task: Task) => void
  onSelectTask?: (taskId: string, selected: boolean) => void
  selectedTasks?: string[]
}

export function TasksTable({ 
  tasks, 
  onTaskComplete, 
  onTaskClick,
  onSelectTask,
  selectedTasks = []
}: TasksTableProps) {
  if (tasks.length === 0) {
    return null
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (onSelectTask) {
      onSelectTask(taskId, checked)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-secondary/30 border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                NAME
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                ID
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                PRIORITY
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                STATUS
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                ASSIGNEE
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                DUE DATE
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                REPORTER
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                CATEGORY
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                PROJECT
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                AMOUNT
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {tasks.map((task, index) => {
            const isSelected = selectedTasks.includes(task.id)
            const taskName = task.title || task.name
            const displayId = task.taskId || task.id

            return (
              <tr
                key={task.id}
                className="hover:bg-secondary/30 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    {task.hasSubtasks && (
                      <button className="p-0.5 hover:bg-secondary rounded">
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    <span className="truncate max-w-xs">{taskName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {displayId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {task.priority || "Normal"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === "In Progress" 
                      ? "bg-blue-100 text-blue-700" 
                      : task.status === "Created"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {task.status || "Created"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                  {task.assignee || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {task.dueDate || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {task.reporter || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {task.category || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {task.project || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {task.amount || "—"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

