"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TasksEmptyState } from "@/components/tasks-empty-state"
import { TasksTable } from "@/components/tasks-table"
import { TasksHotspotOnboarding } from "@/components/tasks-hotspot-onboarding"
import { AdvancedFiltersModal } from "@/components/advanced-filters-modal"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Columns3,
  Share2,
  ChevronDown,
  Grid3x3,
  FileText,
  User,
  FolderTree,
  Building2,
  Monitor,
  ArrowRight,
  SquareCheckBig,
  DollarSign,
  Plane,
  RefreshCw,
  Users,
  TrendingUp,
  Gavel,
  List,
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
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [groupByParent, setGroupByParent] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(13)
  const [totalColumns, setTotalColumns] = useState(14)

  // Дефолтні категорії (окрім G2B)
  const defaultCategories = [
    { id: "accounting", name: "Accounting", icon: DollarSign },
    { id: "capital-projects", name: "Capital Projects", icon: Plane },
    { id: "compliance", name: "Compliance", icon: RefreshCw },
    { id: "facilities", name: "Facilities", icon: Building2 },
    { id: "human-resources", name: "Human Resources", icon: Users },
    { id: "investment", name: "Investment", icon: TrendingUp },
    { id: "it", name: "IT", icon: Monitor },
    { id: "legal", name: "Legal", icon: Gavel },
    { id: "lifestyle", name: "Lifestyle", icon: Plane },
  ]

  // Отримуємо категорії: дефолтні + унікальні з tasks (якщо є додаткові)
  const getCategories = () => {
    const taskCategories = new Set<string>()
    tasks.forEach(task => {
      if (task.category && task.category !== "—") {
        taskCategories.add(task.category)
      }
    })

    // Додаємо дефолтні категорії з кількістю задач
    const allCategories = defaultCategories.map(cat => ({
      ...cat,
      count: tasks.filter(t => t.category === cat.name).length,
    }))

    // Додаємо додаткові категорії з tasks, які не в дефолтному списку
    const defaultCategoryNames = new Set(defaultCategories.map(c => c.name))
    taskCategories.forEach(categoryName => {
      if (!defaultCategoryNames.has(categoryName)) {
        allCategories.push({
          id: categoryName.toLowerCase().replace(/\s+/g, "-"),
          name: categoryName,
          icon: FolderTree, // Default icon для невідомих категорій
          count: tasks.filter(t => t.category === categoryName).length,
        })
      }
    })

    return allCategories
  }

  const categories = getCategories()

  // Quick filter options
  const quickFilters = [
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
        // Для демонстрації - використовуємо порожній стан для показу empty state
        setTasks([]) // Порожній стан
        // setTasks(mockTasks) // Заповнений стан для тестування
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
        
        {/* Title "Tasks" - одразу під Topbar */}
        <div className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">Tasks</h1>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Left Sidebar - Categories */}
            <div 
              id="tasks-categories-sidebar" 
              className="border-r border-border bg-card" 
              style={{ 
                display: 'flex', 
                width: '206px', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                padding: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div className="space-y-1 w-full">
                {/* Always show "All Tasks" tab */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SquareCheckBig className="w-4 h-4" />
                    <span>All Tasks</span>
                  </div>
                  <span className={`text-xs ${selectedCategory === null ? "text-primary" : "text-muted-foreground"}`}>
                    {tasks.length}
                  </span>
                </button>

                {/* Show categories if they exist */}
                {categories.length > 0 && (
                  <>
                    {categories.map((category) => {
                      const Icon = category.icon
                      const isSelected = selectedCategory === category.id
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            isSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{category.name}</span>
                          </div>
                          <span className={`text-xs ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                            {category.count}
                          </span>
                        </button>
                      )
                    })}
                  </>
                )}
              </div>
              
              <button 
                className="w-full flex items-center gap-2 px-3 py-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New category</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

            {/* Controls Bar - показується завжди */}
            <div className="border-b border-border bg-secondary/30 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Filter button */}
                  <AdvancedFiltersModal
                    onApply={(filters, aiQuery) => {
                      // TODO: Застосувати фільтри
                      console.log("Applied filters:", filters, "AI query:", aiQuery)
                    }}
                  >
                    <Button 
                      id="tasks-advanced-filters"
                      variant="outline" 
                      size="sm" 
                      className="gap-2 bg-transparent"
                    >
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                  </AdvancedFiltersModal>

                  {/* Columns count - налаштуй view, яке тобі зручне - вибирай колонки і пересортуй їх як зручно */}
                  <Button 
                    id="tasks-table-customization"
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-transparent"
                    title="Налаштуй view, яке тобі зручне - вибирай колонки і пересортуй їх як зручно"
                  >
                    <Columns3 className="w-4 h-4" />
                    {visibleColumns}/{totalColumns} columns
                  </Button>

                  {/* Group by parent - без checkbox */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-transparent"
                  >
                    <FolderTree className="w-4 h-4" />
                    Group by parent
                  </Button>
                </div>

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

            {/* Quick Filters - показуються завжди */}
            <div className="border-b border-border bg-secondary/30 px-6 py-3">
              <div id="tasks-quick-filters-chips" className="flex items-center gap-2">
                {quickFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveQuickFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeQuickFilter === filter.id
                        ? "bg-[#4F7CFF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

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
                  <div id="tasks-category-column" className="col-span-1 flex items-center gap-2">
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
