"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TasksEmptyState } from "@/components/tasks-empty-state"
import { TasksTable } from "@/components/tasks-table"
import { TasksHotspotOnboarding } from "@/components/tasks-hotspot-onboarding"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Columns3,
  Share2,
  ChevronDown,
  Grid3x3,
} from "lucide-react"

// Mock data для тестування заповненого стану
const mockTasks = [
  {
    id: "1",
    taskId: "PROJ-7",
    name: "Vendor shortlisting...",
    priority: "Normal",
    status: "Created",
    assignee: "MR Mohamed Raafat",
    dueDate: "Oct 31, 2025",
    reporter: "AM Anastasiya Mudryk",
    category: "Project",
    project: "Project",
    amount: "—",
  },
  {
    id: "2",
    taskId: "FAC-14",
    name: "Finalize contractor...",
    priority: "Normal",
    status: "Created",
    assignee: "A A A AM",
    dueDate: "Oct 24, 2025",
    reporter: "RL Richard Lopes",
    category: "Facilities",
    project: "Facilities",
    amount: "—",
  },
  {
    id: "3",
    taskId: "TEST-9",
    name: "Complete interior d...",
    priority: "Normal",
    status: "Created",
    assignee: "MM Marcus Mota",
    dueDate: "—",
    reporter: "MR Mohamed Raafat",
    category: "test",
    project: "test",
    amount: "—",
  },
  {
    id: "4",
    taskId: "EST-3",
    name: "Design & Permitting",
    priority: "Normal",
    status: "Created",
    assignee: "VM Volodymyr Merlenko",
    dueDate: "—",
    reporter: "MM Marcus Mota",
    category: "Emotional Support Turtles",
    project: "Emotional Support Turtles",
    amount: "—",
    hasSubtasks: true,
  },
  {
    id: "5",
    taskId: "IT-64",
    name: "Testing Assignees f...",
    priority: "Normal",
    status: "In Progress",
    assignee: "AM Anastasiya Mudryk",
    dueDate: "—",
    reporter: "PA Pedro Araujo",
    category: "IT",
    project: "IT",
    amount: "—",
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [showHotspotOnboarding, setShowHotspotOnboarding] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("all")
  const [groupByParent, setGroupByParent] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(13)
  const [totalColumns, setTotalColumns] = useState(14)

  // Quick filter options
  const quickFilters = [
    { id: "all", label: "All Tasks" },
    { id: "assigned-to-me", label: "Assigned to me" },
    { id: "created-by-me", label: "Created by me" },
    { id: "overdue", label: "Overdue" },
    { id: "unassigned", label: "Unassigned" },
    { id: "due-soon", label: "Due Soon" },
    { id: "recently-updated", label: "Recently Updated" },
    { id: "on-hold", label: "On Hold" },
    { id: "high-priority", label: "High Priority" },
  ]

  useEffect(() => {
    // Перевіряємо чи треба показати hotspot onboarding
    if (typeof window !== "undefined") {
      const hasSeenTasksOnboarding = localStorage.getItem("way2b1_tasks_onboarding_seen") === "true"
      const isLoggedIn = localStorage.getItem("way2b1_logged_in") === "true"
      const hasSeenNextGenWelcome = localStorage.getItem("way2b1_next_gen_welcome_seen") === "true"
      const shouldStartTour = localStorage.getItem("way2b1_start_tasks_tour") === "true"
      
      // Якщо прийшли з Home page через hotspot - запускаємо tour
      if (shouldStartTour) {
        localStorage.removeItem("way2b1_start_tasks_tour")
        setTimeout(() => {
          setShowHotspotOnboarding(true)
        }, 500)
        return
      }
      
      // Показуємо onboarding тільки якщо користувач залогінений, бачив welcome, але не бачив onboarding
      if (isLoggedIn && hasSeenNextGenWelcome && !hasSeenTasksOnboarding) {
        setTimeout(() => {
          setShowHotspotOnboarding(true)
        }, 500)
      }
    }

    // Завантажуємо задачі з localStorage або використовуємо mock дані для тестування
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("way2b1_tasks")
      if (saved) {
        try {
          const tasks = JSON.parse(saved)
          setTasks(tasks)
        } catch (e) {
          console.error("Failed to parse tasks", e)
          // Якщо помилка - використовуємо mock дані
          setTasks(mockTasks)
        }
      } else {
        // Для демонстрації - використовуємо mock дані
        // Для порожнього стану залиште setTasks([])
        // setTasks([]) // Порожній стан
        setTasks(mockTasks) // Заповнений стан
      }
    }
  }, [])

  const handleTaskComplete = (taskId: string) => {
    const updated = tasks.map((task) =>
      task.id === taskId ? { ...task, status: "completed" } : task,
    )
    setTasks(updated)
    localStorage.setItem("way2b1_tasks", JSON.stringify(updated))
  }

  const handleCreateTask = () => {
    // TODO: Реалізувати модалку створення задачі
    console.log("Create new task")
    // Додаємо нову задачу для тестування
    const newTask = {
      id: String(tasks.length + 1),
      taskId: `TASK-${tasks.length + 1}`,
      name: "New task",
      priority: "Normal",
      status: "Created",
      assignee: "—",
      dueDate: "—",
      reporter: "—",
      category: "—",
      project: "—",
      amount: "—",
    }
    setTasks([...tasks, newTask])
  }

  const handleTaskClick = (task: any) => {
    // TODO: Обробка кліку на задачу
    console.log("Task clicked", task)
  }

  const handleSelectTask = (taskId: string, selected: boolean) => {
    if (selected) {
      setSelectedTasks([...selectedTasks, taskId])
    } else {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
    }
  }

  const handleToggleAllTasks = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(tasks.map((task) => task.id))
    }
  }

  const hasTasks = tasks.length > 0
  const filteredTasks = tasks // Можна додати фільтрацію тут

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full flex-col">
            {/* Top Bar */}
            <div className="border-b border-border bg-card px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-foreground">Tasks</h1>
                <div className="flex items-center gap-4">
                  <Button 
                    id="tasks-quick-filters"
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-transparent"
                  >
                    <Filter className="w-4 h-4" />
                    Quick Filters
                  </Button>
                  <Button 
                    id="tasks-advanced-filters"
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-transparent"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                  </Button>
                  <Button 
                    id="tasks-table-customization"
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-transparent"
                  >
                    <Columns3 className="w-4 h-4" />
                    {visibleColumns}/{totalColumns} columns
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    id="tasks-new-task-button"
                    onClick={handleCreateTask}
                    className="flex items-center gap-2 bg-[#4F7CFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Task
                  </Button>
                </div>
              </div>
            </div>

            {/* Controls Bar - показується тільки коли є задачі */}
            {hasTasks && (
              <div className="border-b border-border bg-secondary/30 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* All Tasks button */}
                    <button
                      onClick={() => setActiveQuickFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeQuickFilter === "all"
                          ? "bg-[#4F7CFF] text-white"
                          : "bg-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All Tasks
                    </button>

                    {/* Filter button */}
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>

                    {/* Columns count */}
                    <span className="text-sm text-muted-foreground">
                      {visibleColumns}/{totalColumns} columns
                    </span>

                    {/* Group by parent checkbox */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="group-by-parent"
                        checked={groupByParent}
                        onCheckedChange={(checked) => setGroupByParent(checked as boolean)}
                      />
                      <label
                        htmlFor="group-by-parent"
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Group by parent
                      </label>
                    </div>
                  </div>

                  {/* Quick filter tabs */}
                  <div className="flex items-center gap-2">
                    {quickFilters.slice(1).map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveQuickFilter(filter.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          activeQuickFilter === filter.id
                            ? "bg-primary/10 text-primary"
                            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Table Header - показується тільки коли є задачі */}
            {hasTasks && (
              <div className="border-b border-border bg-secondary/30 px-6 py-3">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
                  <div className="col-span-1 flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    NAME
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    ID
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    PRIORITY
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    STATUS
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    ASSIGNEE
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    DUE DATE
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    REPORTER
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    CATEGORY
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    PROJECT
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    AMOUNT
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {hasTasks ? (
                <div id="tasks-table-container" className="flex-1 overflow-auto">
                  <TasksTable
                    tasks={filteredTasks}
                    onTaskComplete={handleTaskComplete}
                    onTaskClick={handleTaskClick}
                    onSelectTask={handleSelectTask}
                    selectedTasks={selectedTasks}
                  />
                </div>
              ) : (
                <TasksEmptyState onCreateTask={handleCreateTask} />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-card px-6 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Rows: {tasks.length}</span>
                <span>Filtered: {filteredTasks.length}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hotspot Onboarding */}
      {showHotspotOnboarding && (
        <TasksHotspotOnboarding
          onComplete={() => {
            setShowHotspotOnboarding(false)
            localStorage.setItem("way2b1_tasks_onboarding_seen", "true")
          }}
          onSkip={() => {
            setShowHotspotOnboarding(false)
            localStorage.setItem("way2b1_tasks_onboarding_seen", "true")
          }}
        />
      )}
    </div>
  )
}
