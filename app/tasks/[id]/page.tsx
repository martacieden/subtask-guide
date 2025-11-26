"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, ArrowLeft, Share2, MoreVertical, Sparkles, X, Send, Search, MessageSquare, Equal, ChevronDown, RefreshCw, List, Plus, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { OnboardingCompletionCelebration } from "@/components/onboarding/OnboardingCompletionCelebration"
import { InteractiveChecklistHint } from "@/components/onboarding/InteractiveChecklistHint"
import { Toast } from "@/components/ui/toast"

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface Subtask {
  id: string
  name: string
  status: string
  assignees?: string[]
  priority: string
  dueDate?: string
}

interface Task {
  id: string
  taskId?: string
  name: string
  title?: string
  description?: string
  status: string
  priority: string
  assignee?: string
  dueDate?: string
  reporter?: string
  category?: string
  project?: string
  amount?: string
  checklistItems?: ChecklistItem[]
  subtasks?: Subtask[]
  createdAt?: string
  lastModified?: string
}

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params?.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>([])
  const [localSubtasks, setLocalSubtasks] = useState<Subtask[]>([])
  const [activeSection, setActiveSection] = useState<string>("summary")
  const [showSummary, setShowSummary] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<Array<{ id: string; text: string; author: string; timestamp: string }>>([])
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" })
  
  // Calculate progress for subtasks (based on status "Done")
  const subtaskProgress = localSubtasks.length > 0
    ? Math.round((localSubtasks.filter(item => item.status === "Done").length / localSubtasks.length) * 100)
    : 0
  const completedSubtasksCount = localSubtasks.filter(item => item.status === "Done").length
  const totalSubtasksCount = localSubtasks.length
  

  useEffect(() => {
    if (typeof window === "undefined" || !taskId) return

    // Завантажуємо завдання з localStorage
    const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
    const foundTask = tasks.find((t: any) => t.id === taskId || t.taskId === taskId)

    if (foundTask) {
      setTask(foundTask)
      
      // Завантажуємо subtasks (якщо є)
      if (foundTask.subtasks && foundTask.subtasks.length > 0) {
        setLocalSubtasks(foundTask.subtasks)
      } else if (foundTask.checklistItems && foundTask.checklistItems.length > 0) {
        // Конвертуємо checklistItems в subtasks для зворотної сумісності
        const convertedSubtasks: Subtask[] = foundTask.checklistItems.map((item, index) => ({
          id: item.id,
          name: item.text,
          status: item.completed ? "Done" : "Created",
          assignees: [],
          priority: "Normal",
          dueDate: undefined,
        }))
        setLocalSubtasks(convertedSubtasks)
        
        // Оновлюємо task з новими subtasks
        const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
        const updatedTasks = tasks.map((t: any) => {
          if (t.id === foundTask.id) {
            return { ...t, subtasks: convertedSubtasks }
          }
          return t
        })
        localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
      } else {
        setLocalSubtasks([])
      }
      
      // Зберігаємо checklistItems для зворотної сумісності
      if (foundTask.checklistItems && foundTask.checklistItems.length > 0) {
        setLocalChecklist(foundTask.checklistItems)
      } else {
        setLocalChecklist([])
      }
    } else {
      // Якщо завдання не знайдено, повертаємось на сторінку Tasks
      router.push("/tasks")
    }
  }, [taskId, router])

  // Плавний скрол до сабтасків для onboarding task
  useEffect(() => {
    if (!task || typeof window === "undefined") return

    const isOnboardingTask = task.name === "Welcome to NextGen — Your Quick Start Guide"
    
    if (isOnboardingTask && localSubtasks.length > 0) {
      // Чекаємо трохи, щоб сторінка встигла відрендеритися
      const scrollTimer = setTimeout(() => {
        const subtasksSection = document.getElementById("subtasks")
        if (subtasksSection) {
          setActiveSection("subtasks")
          subtasksSection.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
          })
        }
      }, 300)

      return () => clearTimeout(scrollTimer)
    }
  }, [task, localSubtasks])

  const handleChecklistToggle = (itemId: string, completed: boolean) => {
    if (!task) return

    const updated = localChecklist.map((item) =>
      item.id === itemId ? { ...item, completed } : item
    )
    setLocalChecklist(updated)

    // Оновлюємо localStorage
    const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
    const updatedTasks = tasks.map((t: any) => {
      if (t.id === task.id) {
        return {
          ...t,
          checklistItems: updated,
        }
      }
      return t
    })
    localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
    
    // Оновлюємо локальний стан
    setTask({ ...task, checklistItems: updated })
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent("taskUpdated"))
    
    // Check if onboarding is completed
    const newCompletedCount = updated.filter(item => item.completed).length
    const isOnboardingTask = task.name === "Welcome to NextGen — Your Quick Start Guide"
    if (isOnboardingTask && newCompletedCount === updated.length && updated.length > 0) {
      // Show celebration after a short delay
      setTimeout(() => {
        setShowCelebration(true)
      }, 500)
    }
  }

  const handleSubtaskUpdate = (subtaskId: string, updates: Partial<Subtask>) => {
    if (!task) return

    const updated = localSubtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
    )
    setLocalSubtasks(updated)

    // Оновлюємо localStorage
    const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
    const updatedTasks = tasks.map((t: any) => {
      if (t.id === task.id) {
        return {
          ...t,
          subtasks: updated,
        }
      }
      return t
    })
    localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
    
    // Оновлюємо локальний стан
    setTask({ ...task, subtasks: updated })
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent("taskUpdated"))
    
    // Check if onboarding is completed (all subtasks done)
    const doneCount = updated.filter(item => item.status === "Done").length
    const isOnboardingTask = task.name === "Welcome to NextGen — Your Quick Start Guide"
    if (isOnboardingTask && doneCount === updated.length && updated.length > 0) {
      setTimeout(() => {
        setShowCelebration(true)
      }, 500)
    }
  }

  const handleAddSubtask = () => {
    if (!task) return

    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}`,
      name: "New subtask",
      status: "Created",
      assignees: [],
      priority: "Normal",
      dueDate: undefined,
    }

    const updated = [...localSubtasks, newSubtask]
    setLocalSubtasks(updated)

    // Оновлюємо localStorage
    const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
    const updatedTasks = tasks.map((t: any) => {
      if (t.id === task.id) {
        return {
          ...t,
          subtasks: updated,
        }
      }
      return t
    })
    localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
    
    // Оновлюємо локальний стан
    setTask({ ...task, subtasks: updated })
    
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent("taskUpdated"))
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    )
  }

  const taskName = task.title || task.name
  const displayId = task.taskId || task.id
  const createdDate = task.createdAt || "Nov 18, 2025"
  const lastModified = task.lastModified || "Today at 4:25 PM"

  return (
    <div className="flex h-screen bg-background overflow-hidden page-transition-enter page-transition-enter-active">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Central Panel - Task Details */}
          <div className="flex-1 flex flex-col overflow-hidden bg-card">
            {/* Top Header */}
            <div className="border-b border-border bg-card px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => router.push("/tasks")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Go to Tasks
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <List className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{displayId}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {task.status}
                    </span>
                    <span className="text-sm text-muted-foreground">Created on {createdDate}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">{taskName}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <div className="flex items-center gap-2 justify-end">
                      <p className="text-sm text-muted-foreground">Last modified by • {lastModified}</p>
                      {/* Аватари співробітників - можна додати пізніше */}
                      {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                          {task.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    Actions
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                  <button
                    onClick={() => router.push("/tasks")}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area with Anchor Navigation */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar - Anchor Navigation */}
              <div className="w-48 border-r border-border bg-secondary/30 p-4 flex-shrink-0 overflow-y-auto">
                <nav className="space-y-1">
                  <button
                    onClick={() => scrollToSection("summary")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === "summary"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => scrollToSection("details")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === "details"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => scrollToSection("description")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === "description"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => scrollToSection("subtasks")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === "subtasks"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    Subtasks
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Summary Section */}
                  {showSummary && (
                    <section id="summary" className="scroll-mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">Summary</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            aria-label="Update summary"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSummary(false)}
                            className="h-6 px-3 text-xs font-semibold border border-border hover:bg-secondary"
                          >
                            Hide
                          </Button>
                        </div>
                      </div>
                      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                          {task.description || "A new IT onboarding task that guides users through NextGen with a short checklist (review homepage, explore navigation/modules, leave a comment, change status, and mark complete); the task was just created and remains open."}
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Details Section */}
                  <section id="details" className="scroll-mt-6">
                    <div className="mb-4 flex items-center gap-2 w-full">
                      <h2 className="text-lg font-semibold text-foreground">Details</h2>
                    </div>
                    <div className="grid gap-1 grid-flow-col auto-cols-max gap-x-4" style={{ gridTemplateColumns: "repeat(1, minmax(112px, max-content) auto 1fr)", gridTemplateRows: "repeat(5, auto)" }}>
                      {/* Status */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Status</div>
                        <div className="flex items-center min-h-7">
                          <select
                            id="task-status"
                            value={task.status}
                            onChange={(e) => {
                              const newStatus = e.target.value
                              // Оновлюємо статус в localStorage
                              const tasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
                              const updatedTasks = tasks.map((t: any) => {
                                if (t.id === task.id) {
                                  return { ...t, status: newStatus }
                                }
                                return t
                              })
                              localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
                              setTask({ ...task, status: newStatus })
                              
                              // Якщо це onboarding task і статус змінився
                              if (task.name === "Welcome to NextGen — Your Quick Start Guide" && newStatus !== task.status) {
                                // Відмічаємо subtask-4 (Change status) якщо ще не відмічений
                                const statusSubtask = localSubtasks.find(item => item.id === "subtask-4")
                                if (statusSubtask && statusSubtask.status !== "Done") {
                                  handleSubtaskUpdate("subtask-4", { status: "Done" })
                                  // Показуємо toast
                                  setToast({ show: true, message: "Great! You've completed: Change task status" })
                                }
                                
                                // Якщо статус змінено на "Done", автоматично відмічаємо subtask-6
                                if (newStatus === "Done") {
                                  const completeSubtask = localSubtasks.find(item => item.id === "subtask-6")
                                  if (completeSubtask && completeSubtask.status !== "Done") {
                                    handleSubtaskUpdate("subtask-6", { status: "Done" })
                                    // Показуємо toast
                                    setTimeout(() => {
                                      setToast({ show: true, message: "Great! You've completed: Mark task as complete" })
                                    }, 500)
                                  }
                                }
                              }
                            }}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="Created">Created</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Assignee */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Assignee</div>
                        <div className="flex items-center min-h-7 w-full">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <div className="shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                {task.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <span className="text-sm text-foreground">{task.assignee}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Due date */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Due date</div>
                        <div className="flex items-center min-h-7">
                          <span className="text-sm text-muted-foreground">
                            {task.dueDate && task.dueDate !== "—" ? task.dueDate : "Select a date"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Priority */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Priority</div>
                        <div className="flex items-center min-h-7">
                          <div className="flex items-center gap-2">
                            <Equal className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">{task.priority}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Project */}
                      <div className="grid grid-cols-subgrid col-span-3">
                        <div className="flex items-start font-medium py-1.5 text-sm">Project</div>
                        <div className="flex items-center min-h-7">
                          <span className="text-sm text-muted-foreground">
                            {task.project && task.project !== "—" ? task.project : "Select Project"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 h-8 px-3 text-xs font-semibold border border-border hover:bg-secondary">
                      Show more
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </section>

                  {/* Description Section */}
                  <section id="description" className="scroll-mt-6">
                    <div className="mb-4 flex items-center justify-between w-full">
                      <h2 className="text-lg font-semibold text-foreground">Description</h2>
                    </div>
                    <div className="rounded-md hover:bg-secondary/30 max-w-[696px] border border-border p-4 min-h-[112px]">
                      <div className="prose prose-sm max-w-full">
                        <h2 className="text-2xl font-bold text-foreground my-3">Welcome!</h2>
                        <p className="my-3 text-foreground">
                          We've created a few quick tasks to help you get started. Complete them in any order—they'll take about 5 minutes total. Mark each subtask complete as you go. Need help? Click the [?] icon or visit our{" "}
                          <a href="#" className="text-primary hover:underline">
                            Help Center
                          </a>
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Subtasks Section */}
                  <section id="subtasks" className="scroll-mt-6">
                    <div className="mb-4 flex items-center justify-between w-full">
                      <h2 className="text-lg font-semibold text-foreground">Subtasks</h2>
                      <div className="flex items-center gap-3">
                        {localSubtasks.length > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${subtaskProgress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                              {completedSubtasksCount}/{totalSubtasksCount}
                            </span>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddSubtask}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add subtask
                        </Button>
                      </div>
                    </div>

                    {localSubtasks.length > 0 ? (
                      <div className="border border-border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-secondary/30 border-b border-border">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Assignees
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Priority
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Due Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-border">
                            {localSubtasks.map((subtask) => {
                              const isDone = subtask.status === "Done"
                              return (
                                <tr 
                                  key={subtask.id} 
                                  onClick={() => {
                                    handleSubtaskUpdate(subtask.id, {
                                      status: isDone ? "Created" : "Done",
                                    })
                                  }}
                                  className={`hover:bg-secondary/30 transition-colors cursor-pointer ${
                                    isDone ? "opacity-60" : ""
                                  }`}
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        checked={isDone}
                                        onCheckedChange={(checked) => {
                                          handleSubtaskUpdate(subtask.id, {
                                            status: checked ? "Done" : "Created",
                                          })
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <input
                                        type="text"
                                        value={subtask.name}
                                        onChange={(e) => {
                                          handleSubtaskUpdate(subtask.id, { name: e.target.value })
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${
                                          isDone 
                                            ? "line-through text-muted-foreground" 
                                            : "text-foreground"
                                        }`}
                                        onBlur={(e) => {
                                          if (!e.target.value.trim()) {
                                            handleSubtaskUpdate(subtask.id, { name: "New subtask" })
                                          }
                                        }}
                                      />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                      isDone
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}>
                                      {isDone ? "Done" : "To Do"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-sm text-muted-foreground">
                                      {subtask.assignees && subtask.assignees.length > 0
                                        ? subtask.assignees.join(", ")
                                        : "—"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <Equal className="w-4 h-4 text-primary" />
                                      <span className="text-sm text-foreground">{subtask.priority}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-sm text-muted-foreground">
                                      {subtask.dueDate || "—"}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-border rounded-lg p-12 text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          No subtasks yet. Click "Add subtask" to create one.
                        </p>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Comments */}
          <div className="w-80 border-l border-border bg-card flex flex-col">
            {/* Tabs */}
            <div className="border-b border-border flex">
              <button className="flex-1 px-4 py-3 text-sm font-medium text-foreground border-b-2 border-primary">
                Comments
              </button>
              <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                History
              </button>
            </div>

            {/* Comments Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in comments..."
                    className="w-full px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-auto p-4">
                {comments.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Start the conversation</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary">
                            {comment.author.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-2">
                  <textarea
                    id="comment-input"
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={2}
                  />
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => {
                      if (commentText.trim()) {
                        // Створюємо новий коментар
                        const newComment = {
                          id: `comment-${Date.now()}`,
                          text: commentText,
                          author: task?.assignee || "You",
                          timestamp: new Date().toLocaleString("en-US", { 
                            month: "short", 
                            day: "numeric", 
                            hour: "numeric", 
                            minute: "2-digit" 
                          }),
                        }
                        
                        // Додаємо коментар до списку
                        setComments([...comments, newComment])
                        
                        // Перевіряємо, чи є @ в коментарі
                        const hasMention = commentText.includes("@")
                        
                        // Якщо це onboarding task і є @, автоматично відмічаємо сабтаск
                        // Це допомагає користувачу зрозуміти, що він виконує завдання правильно
                        if (task && task.name === "Welcome to NextGen — Your Quick Start Guide" && hasMention) {
                          const commentSubtask = localSubtasks.find(item => item.id === "subtask-3")
                          if (commentSubtask && commentSubtask.status !== "Done") {
                            handleSubtaskUpdate("subtask-3", { status: "Done" })
                            // Показуємо toast з підтвердженням
                            setToast({ 
                              show: true, 
                              message: "✅ Subtask completed! You've learned how to use @mentions in comments." 
                            })
                          }
                        } else if (task && task.name === "Welcome to NextGen — Your Quick Start Guide" && !hasMention) {
                          // Якщо коментар без @, підказуємо користувачу
                          const commentSubtask = localSubtasks.find(item => item.id === "subtask-3")
                          if (commentSubtask && commentSubtask.status !== "Done") {
                            // Не відмічаємо автоматично, але можемо показати підказку
                            // (залишаємо користувачу можливість відмітити вручну)
                          }
                        }
                        
                        // Очищаємо поле вводу
                        setCommentText("")
                      }
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Completion Celebration */}
      <OnboardingCompletionCelebration
        show={showCelebration}
        onClose={() => {
          setShowCelebration(false)
          // Navigate to homepage after closing the celebration
          router.push("/")
        }}
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  )
}

