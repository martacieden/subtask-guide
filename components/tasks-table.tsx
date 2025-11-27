"use client"

import { useState, Fragment, useRef, useEffect } from "react"
import { CheckCircle2, Circle, Info, Play, MoreHorizontal, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskRowTooltip } from "@/components/ui/task-row-tooltip"

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface Task {
  id: string
  taskId?: string // ID like PROJ-7, FAC-14
  status: "pending" | "completed" | "To Do" | "In Progress" | string
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
  checklistItems?: ChecklistItem[]
  parentTaskId?: string
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
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  // Розкриваємо всі таски з сабтасками за замовчуванням
  useEffect(() => {
    const tasksWithSubtasks = tasks
      .filter((t) => !t.parentTaskId)
      .filter((task) => {
        const taskSubtasks = tasks.filter((t) => t.parentTaskId === task.id)
        return taskSubtasks.length > 0
      })
      .map((task) => task.id)
    
    if (tasksWithSubtasks.length > 0) {
      setExpandedTasks(new Set(tasksWithSubtasks))
    }
  }, [tasks])

  if (tasks.length === 0) {
    return null
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (onSelectTask) {
      onSelectTask(taskId, checked)
    }
  }

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
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
          {tasks
            .filter((t) => !t.parentTaskId) // Показуємо тільки основні таски, не сабтаски
            .map((task) => {
              // Знаходимо сабтаски для цієї таски (таски з parentTaskId = task.id)
              const taskSubtasks = tasks.filter((t) => t.parentTaskId === task.id)
              const hasSubtasks = taskSubtasks.length > 0
              const isExpanded = expandedTasks.has(task.id)
              const isSelected = selectedTasks.includes(task.id)
              const taskName = task.title || task.name
              const displayId = task.taskId || task.id
              const isOnboarding = task.name === "Welcome to NextGen — Your Quick Start Guide" || task.category === "Onboarding"

              // Create ref for this row
              const rowRef = { current: null as HTMLTableRowElement | null }

              return (
                <Fragment key={task.id}>
                  {/* Task Row */}
                  <TaskRowTooltip task={task} rowRef={rowRef as React.RefObject<HTMLTableRowElement>} />
                  <tr
                    ref={(el) => { rowRef.current = el }}
                    data-task-id={task.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                      />
                    </td>
                    <td 
                      className="px-4 py-3 text-sm text-foreground"
                    >
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onTaskClick && onTaskClick(task)}
                      >
                        {hasSubtasks && (
                          <button 
                            className="p-0.5 hover:bg-secondary rounded"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleTaskExpansion(task.id)
                            }}
                          >
                            <ChevronDown 
                              className={`w-4 h-4 text-muted-foreground transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        )}
                        <span 
                          className="truncate max-w-xs hover:text-primary transition-colors" 
                          title={taskName}
                        >
                          {taskName}
                        </span>
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
                          : task.status === "To Do" || task.status === "Created"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {task.status || "To Do"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                      {task.assignee || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {task.dueDate || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {isOnboarding ? "Onboarding" : (task.category || "—")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {task.project || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {task.amount || "—"}
                    </td>
                    </tr>

                  {/* Subtasks Rows - показуємо тільки якщо task розгорнутий */}
                  {hasSubtasks && isExpanded && taskSubtasks.map((subtask) => {
                    const isSubtaskSelected = selectedTasks.includes(subtask.id)
                    const subtaskName = subtask.title || subtask.name
                    const subtaskDisplayId = subtask.taskId || subtask.id
                    const isSubtaskDone = subtask.status === "Done"
                    const isSubtaskOnboarding = subtask.category === "Onboarding"

                    // Create ref for this subtask row
                    const subtaskRowRef = { current: null as HTMLTableRowElement | null }

                    return (
                      <Fragment key={subtask.id}>
                        <TaskRowTooltip task={subtask} rowRef={subtaskRowRef as React.RefObject<HTMLTableRowElement>} />
                        <tr
                          ref={(el) => { subtaskRowRef.current = el }}
                          data-task-id={subtask.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Checkbox
                            checked={isSubtaskSelected}
                            onCheckedChange={(checked) => handleSelectTask(subtask.id, checked as boolean)}
                          />
                        </td>
                        <td 
                          className="px-4 py-3 text-sm text-foreground"
                        >
                          <div 
                            className="flex items-center gap-2 pl-10 cursor-pointer"
                            onClick={() => onTaskClick && onTaskClick(subtask)}
                          >
                            <span 
                              className="truncate max-w-xs hover:text-primary transition-colors" 
                              title={subtaskName}
                            >
                              {subtaskName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {subtaskDisplayId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {subtask.priority || "Normal"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isSubtaskDone
                              ? "bg-green-100 text-green-700"
                              : subtask.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {isSubtaskDone ? "Done" : (subtask.status || "To Do")}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                          {subtask.assignee || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {subtask.dueDate || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {isSubtaskOnboarding ? "Onboarding" : (subtask.category || "—")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {subtask.project || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                          {subtask.amount || "—"}
                        </td>
                        </tr>
                      </Fragment>
                    )
                  })}
                </Fragment>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

