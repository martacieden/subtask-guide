"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Workflow, Info, MoreHorizontal, ChevronDown, Target, HelpCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ContextualTooltip } from "@/components/contextual-tooltips/ContextualTooltip"

export function Dashboard() {
  const [userName, setUserName] = useState("")
  const [userInitials, setUserInitials] = useState("")
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [showPulsingButton, setShowPulsingButton] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstName = localStorage.getItem("way2b1_user_first_name") || ""
      const lastName = localStorage.getItem("way2b1_user_last_name") || ""
      setUserName(firstName)
      setUserInitials(
        (firstName?.[0] || "") + (lastName?.[0] || "") || "MK"
      )

      // Завантажуємо задачі
      const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
        setTasks(savedTasks)
        
        // Автоматично розгортаємо tasks з subtasks для onboarding
        const expanded = new Set<string>()
        savedTasks.forEach((task: any) => {
          if (task.subtasks && task.subtasks.length > 0) {
            if (task.name === "Welcome to NextGen — Your Quick Start Guide" || task.category === "Onboarding") {
              expanded.add(task.id)
            }
          }
        })
        setExpandedTasks(expanded)
      }

      loadTasks()

      // Слухаємо оновлення задач
      const handleTaskUpdate = () => {
        loadTasks()
      }
      window.addEventListener("taskUpdated", handleTaskUpdate)
      window.addEventListener("storage", handleTaskUpdate)

      return () => {
        window.removeEventListener("taskUpdated", handleTaskUpdate)
        window.removeEventListener("storage", handleTaskUpdate)
      }
    }
  }, [])

  const handleCreateTask = () => {
    router.push("/tasks")
    setTimeout(() => {
      const event = new CustomEvent("createTask")
      window.dispatchEvent(event)
    }, 100)
  }

  const handleCreateDecision = () => {
    router.push("/decisions")
    setTimeout(() => {
      const event = new CustomEvent("createDecision")
      window.dispatchEvent(event)
    }, 100)
  }

  const handleTaskClick = (task: any) => {
    router.push(`/tasks/${task.id}`)
  }

  const handleItemClick = (item: { type: 'task' | 'subtask'; data: any; parentTask?: any }) => {
    if (item.type === 'task') {
      router.push(`/tasks/${item.data.id}`)
    } else if (item.parentTask) {
      // Якщо це subtask, переходимо до батьківського task
      router.push(`/tasks/${item.parentTask.id}`)
    }
  }

  // Перевіряємо чи є onboarding tasks та чи вони всі завершені
  const onboardingTasks = tasks.filter((task: any) => 
    task.name === "Welcome to NextGen — Your Quick Start Guide" || 
    task.category === "Onboarding"
  )
  
  const hasOnboardingTasks = onboardingTasks.length > 0
  
  // Перевіряємо чи всі onboarding tasks та їхні subtasks завершені
  const allOnboardingTasksCompleted = onboardingTasks.every((task: any) => {
    // Task має бути Done
    if (task.status !== "Done") return false
    
    // Якщо є subtasks, всі вони мають бути Done
    if (task.subtasks && task.subtasks.length > 0) {
      return task.subtasks.every((subtask: any) => subtask.status === "Done")
    }
    
    return true
  })
  
  // Показуємо банер тільки якщо є onboarding tasks і вони не всі завершені
  const showOnboardingBanner = hasOnboardingTasks && !allOnboardingTasksCompleted

  // Перевіряємо чи користувач вже бачив мигаючу кнопку (тільки один раз)
  useEffect(() => {
    if (typeof window !== "undefined" && showOnboardingBanner) {
      const hasSeenPulsingButton = localStorage.getItem("way2b1_onboarding_banner_seen")
      if (!hasSeenPulsingButton) {
        setShowPulsingButton(true)
        // Після 5 секунд приховуємо анімацію та зберігаємо, що користувач вже бачив
        const timer = setTimeout(() => {
          setShowPulsingButton(false)
          localStorage.setItem("way2b1_onboarding_banner_seen", "true")
        }, 5000)
        return () => clearTimeout(timer)
      }
    }
  }, [showOnboardingBanner])

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
    <div className="flex flex-col h-full">
      {/* Welcome section */}
      {userName && (
        <div className="pt-6 pb-4">
          <div className="flex items-center justify-between px-6">
            <div id="home-welcome-section" className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome back, {userName}!
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="home-new-task-button"
                onClick={handleCreateTask}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New task
              </button>
              <button
                id="home-new-decision-button"
                onClick={handleCreateDecision}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New decision
              </button>
            </div>
          </div>
          <div className="border-b border-gray-200 mt-4"></div>
        </div>
      )}

      {/* Onboarding Banner - прибрано, оскільки тепер підсвітка в таблиці */}

      {/* Contextual Tooltips */}
      <ContextualTooltip
        tooltipKey="new-task"
        targetElementId="home-new-task-button"
        message="Click here to create a new task and start organizing your work"
        position="bottom"
        delay={2000}
      />
      <ContextualTooltip
        tooltipKey="new-decision"
        targetElementId="home-new-decision-button"
        message="Create a decision to track important choices and approvals"
        position="bottom"
        delay={2500}
      />

      {/* Content sections */}
      <div className="flex-1 px-16 py-6 space-y-6">
        {/* Decisions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Decisions</h2>
            <button
              onClick={handleCreateDecision}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Decision
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add your first decision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Create requests needing approval and record keeping
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            <button
              id="home-new-task-button"
              onClick={handleCreateTask}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
          {tasks.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Onboarding Banner */}
              {showOnboardingBanner && (
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b-2 border-blue-400 shadow-sm px-6 py-4 relative">
                  <div className="flex items-center gap-3">
                    <div className={`relative w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm ${
                      showPulsingButton ? 'animate-pulse' : ''
                    }`}>
                      <Target className="w-5 h-5 text-blue-700" />
                      {/* Hotspot indicator */}
                      {showPulsingButton && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-blue-900">
                          ONBOARDING TASKS
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-bold bg-blue-300 text-blue-900 rounded-full uppercase tracking-wide ${
                          showPulsingButton ? 'animate-pulse' : ''
                        }`}>
                          Get Started
                        </span>
                        {/* Hotspot tooltip trigger */}
                        <div className="relative group">
                          <HelpCircle className="w-4 h-4 text-blue-600 cursor-help" />
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                              These tasks will help you get familiar with the platform
                              <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Complete tasks with <span className="font-semibold">"Onboarding"</span> badge below
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/30 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        NAME
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        PRIORITY
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        ASSIGNEE
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        DUE DATE
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        REPORTER
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        CATEGORY
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {tasks.map((task) => {
                      const hasSubtasks = task.subtasks && task.subtasks.length > 0
                      const isExpanded = expandedTasks.has(task.id)
                      const isOnboarding = task.name === "Welcome to NextGen — Your Quick Start Guide" || task.category === "Onboarding"
                      const taskId = task.id
                      const isSelected = selectedItems.includes(taskId)
                      const displayId = task.taskId || task.id
                      const taskName = task.title || task.name
                      
                      return (
                        <React.Fragment key={taskId}>
                          {/* Task Row */}
                          <tr
                            onClick={(e) => {
                              // Якщо клікнули на checkbox - не виконуємо інші дії
                              if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
                                return
                              }
                              // Якщо клікнули на назву task - переходимо на сторінку деталей
                              if ((e.target as HTMLElement).closest('span[title]')) {
                                handleTaskClick(task)
                                return
                              }
                              // Якщо клікнули на dropdown button - не toggle статус
                              if ((e.target as HTMLElement).closest('button')) {
                                return
                              }
                              // Для task - toggle статус при кліку по рядку
                              const newStatus = task.status === "Done" ? "Created" : "Done"
                              const updatedTasks = tasks.map((t: any) => 
                                t.id === task.id ? { ...t, status: newStatus } : t
                              )
                              localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
                              setTasks(updatedTasks)
                              window.dispatchEvent(new CustomEvent("taskUpdated"))
                            }}
                            className={`hover:bg-secondary/30 transition-colors cursor-pointer ${
                              task.status === "Done" ? 'opacity-60' : ''
                            }`}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Checkbox
                                checked={task.status === "Done"}
                                onCheckedChange={(checked) => {
                                  // Toggle статус task при кліку на checkbox
                                  const newStatus = checked ? "Done" : "Created"
                                  const updatedTasks = tasks.map((t: any) => 
                                    t.id === task.id ? { ...t, status: newStatus } : t
                                  )
                                  localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
                                  setTasks(updatedTasks)
                                  window.dispatchEvent(new CustomEvent("taskUpdated"))
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              <div className="flex items-center gap-2">
                                {hasSubtasks && (
                                  <button 
                                    className="p-0.5 hover:bg-secondary rounded"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleTaskExpansion(taskId)
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
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleTaskClick(task)
                                  }}
                                  className={`truncate max-w-xs hover:text-primary transition-colors cursor-pointer ${
                                    task.status === "Done" 
                                      ? 'line-through text-muted-foreground' 
                                      : ''
                                  }`}
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
                              {task.priority ? `= ${task.priority}` : "= Normal"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                task.status === "Done"
                                  ? "bg-green-100 text-green-700"
                                  : task.status === "In Progress" 
                                  ? "bg-blue-100 text-blue-700" 
                                  : task.status === "Created" || !task.status
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {task.status === "Done" ? "Done" : (task.status || "To Do")}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                              {task.assignee ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                    {task.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                  </div>
                                  <span>{task.assignee}</span>
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                              {task.dueDate && task.dueDate !== "—" ? task.dueDate : "—"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                              {task.reporter ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                    {task.reporter.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                  </div>
                                  <span>{task.reporter}</span>
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                              {task.category || "—"}
                            </td>
                          </tr>
                          
                          {/* Subtasks Rows - показуємо тільки якщо task розгорнутий */}
                          {hasSubtasks && isExpanded && task.subtasks.map((subtask: any) => {
                            const isDone = subtask.status === "Done"
                            const subtaskId = `${taskId}-${subtask.id}`
                            const isSubtaskSelected = selectedItems.includes(subtaskId)
                            
                            return (
                              <tr
                                key={subtaskId}
                                onClick={(e) => {
                                  if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
                                    return
                                  }
                                  // Для subtask - toggle статус при кліку
                                  const newStatus = isDone ? "Created" : "Done"
                                  const updatedTasks = tasks.map((t: any) => {
                                    if (t.id === task.id) {
                                      const updatedSubtasks = (t.subtasks || []).map((st: any) => 
                                        st.id === subtask.id ? { ...st, status: newStatus } : st
                                      )
                                      return { ...t, subtasks: updatedSubtasks }
                                    }
                                    return t
                                  })
                                  localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
                                  setTasks(updatedTasks)
                                  window.dispatchEvent(new CustomEvent("taskUpdated"))
                                }}
                                className={`hover:bg-secondary/30 transition-colors cursor-pointer ${
                                  isDone ? 'opacity-60' : ''
                                }`}
                              >
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <Checkbox
                                    checked={isSubtaskSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedItems([...selectedItems, subtaskId])
                                      } else {
                                        setSelectedItems(selectedItems.filter(id => id !== subtaskId))
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">
                                  <div className="flex items-center gap-2 pl-10">
                                    <span 
                                      className={`truncate max-w-xs ${
                                        isDone 
                                          ? 'line-through text-muted-foreground' 
                                          : 'text-foreground'
                                      }`}
                                      title={subtask.name}
                                    >
                                      {subtask.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                  —
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                  {subtask.priority ? `= ${subtask.priority}` : "= Normal"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                    isDone
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                    {isDone ? "Done" : "To Do"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                                  —
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                  —
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                  —
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                  —
                                </td>
                              </tr>
                            )
                          })}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add your first task</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Create tasks to track work items and assign them to team members
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
