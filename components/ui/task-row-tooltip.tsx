"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Calendar, User, Tag, Folder, AlertCircle } from "lucide-react"

interface Task {
  id: string
  taskId?: string
  name: string
  description?: string
  status?: string
  priority?: string
  assignee?: string
  category?: string
  project?: string
  dueDate?: string
  createdAt?: string
}

interface TaskRowTooltipProps {
  task: Task
  rowRef: React.RefObject<HTMLTableRowElement>
}

export function TaskRowTooltip({ task, rowRef }: TaskRowTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculatePosition = () => {
    if (!rowRef.current) return null

    const rect = rowRef.current.getBoundingClientRect()
    const margin = 12

    // Позиція знизу рядка, по центру
    return {
      top: rect.bottom + margin,
      left: rect.left + rect.width / 2,
      rect
    }
  }

  const adjustPosition = () => {
    if (!tooltipRef.current) return

    const initialPos = calculatePosition()
    if (!initialPos) return

    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const tooltipWidth = tooltipRect.width || 320
    const tooltipHeight = tooltipRect.height || 200
    const margin = 12
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let { top, left } = initialPos

    // Центруємо по горизонталі
    left = left - tooltipWidth / 2

    // Перевірка меж viewport
    if (left < margin) {
      left = margin
    }
    if (left + tooltipWidth > viewportWidth - margin) {
      left = viewportWidth - tooltipWidth - margin
    }
    if (top + tooltipHeight > viewportHeight - margin) {
      // Якщо не поміщається знизу, показуємо зверху
      top = initialPos.rect.top - tooltipHeight - margin
    }
    if (top < margin) {
      top = margin
    }

    setTooltipPosition({ top, left })
  }

  useEffect(() => {
    if (!rowRef.current) return

    const rowElement = rowRef.current

    const handleMouseEnter = () => {
      setIsVisible(true)
      setTimeout(() => {
        adjustPosition()
      }, 0)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
      setTooltipPosition(null)
    }

    rowElement.addEventListener("mouseenter", handleMouseEnter)
    rowElement.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      rowElement.removeEventListener("mouseenter", handleMouseEnter)
      rowElement.removeEventListener("mouseleave", handleMouseLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowRef])

  useEffect(() => {
    if (isVisible) {
      adjustPosition()
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const handleResize = () => {
      adjustPosition()
    }

    const handleScroll = () => {
      adjustPosition()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [isVisible])

  if (!mounted) {
    return null
  }

  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === "—") return "—"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      })
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700"
    const statusLower = status.toLowerCase()
    if (statusLower.includes("done") || statusLower.includes("completed")) {
      return "bg-green-100 text-green-700"
    }
    if (statusLower.includes("progress")) {
      return "bg-blue-100 text-blue-700"
    }
    if (statusLower.includes("pending") || statusLower.includes("created")) {
      return "bg-yellow-100 text-yellow-700"
    }
    return "bg-gray-100 text-gray-700"
  }

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "text-gray-600"
    const priorityLower = priority.toLowerCase()
    if (priorityLower.includes("high") || priorityLower.includes("urgent")) {
      return "text-red-600"
    }
    if (priorityLower.includes("medium") || priorityLower.includes("normal")) {
      return "text-yellow-600"
    }
    if (priorityLower.includes("low")) {
      return "text-green-600"
    }
    return "text-gray-600"
  }

  const tooltipContent = isVisible && tooltipPosition ? (
    <div
      ref={tooltipRef}
      className="fixed pointer-events-none z-[999999] animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        zIndex: 999999,
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm min-w-[280px]">
        {/* Header */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
            {task.name}
          </h4>
          {task.taskId && (
            <p className="text-xs text-gray-500 font-mono">{task.taskId}</p>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Details Grid */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          {task.status && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">Status:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
          )}

          {task.priority && (
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">Priority:</span>
              <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          )}

          {task.assignee && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">Assignee:</span>
              <span className="text-xs text-gray-700">{task.assignee}</span>
            </div>
          )}

          {task.category && (
            <div className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">Category:</span>
              <span className="text-xs text-gray-700">{task.category}</span>
            </div>
          )}

          {task.dueDate && task.dueDate !== "—" && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">Due Date:</span>
              <span className="text-xs text-gray-700">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div
          className="absolute w-2 h-2 bg-white border-l border-b border-gray-200 transform rotate-45 top-[-4px] left-1/2 -translate-x-1/2"
        />
      </div>
    </div>
  ) : null

  return (
    <>
      {typeof document !== "undefined" && document.body && tooltipContent
        ? createPortal(tooltipContent, document.body)
        : null}
    </>
  )
}
