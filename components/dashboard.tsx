"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Workflow, Info, MoreHorizontal, ChevronDown, Target, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { HoverTooltip } from "@/components/ui/hover-tooltip"
import { TaskRowTooltip } from "@/components/ui/task-row-tooltip"

export function Dashboard() {
  const [userName, setUserName] = useState("")
  const [userInitials, setUserInitials] = useState("")
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  // Розкриваємо всі таски з сабтасками за замовчуванням
  useEffect(() => {
    const tasksWithSubtasks = tasks
      .filter((t: any) => !t.parentTaskId)
      .filter((task: any) => {
        const taskSubtasks = tasks.filter((t: any) => t.parentTaskId === task.id)
        return taskSubtasks.length > 0
      })
      .map((task: any) => task.id)
    
    if (tasksWithSubtasks.length > 0) {
      setExpandedTasks(new Set(tasksWithSubtasks))
    }
  }, [tasks])
  const [showPulsingButton, setShowPulsingButton] = useState(false)
  const [isBannerDismissed, setIsBannerDismissed] = useState(false)
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
  
  // Перевіряємо чи банер був закритий
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("way2b1_onboarding_banner_dismissed")
      if (dismissed === "true") {
        setIsBannerDismissed(true)
      }
    }
  }, [])

  // Показуємо банер тільки якщо є onboarding tasks, вони не всі завершені, і банер не закритий
  const showOnboardingBanner = hasOnboardingTasks && !allOnboardingTasksCompleted && !isBannerDismissed

  // Обробник закриття банера
  const handleDismissBanner = () => {
    setIsBannerDismissed(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("way2b1_onboarding_banner_dismissed", "true")
    }
  }

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
              <HoverTooltip
                message="Click here to create a new task and start organizing your work"
                position="bottom"
              >
                <button
                  id="home-new-task-button"
                  onClick={handleCreateTask}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New task
                </button>
              </HoverTooltip>
              <HoverTooltip
                message="Create a decision to track important choices and approvals"
                position="bottom"
              >
                <button
                  id="home-new-decision-button"
                  onClick={handleCreateDecision}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New decision
                </button>
              </HoverTooltip>
            </div>
          </div>
          <div className="border-b border-gray-200 mt-4"></div>
        </div>
      )}

      {/* Onboarding Banner - прибрано, оскільки тепер підсвітка в таблиці */}

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
          
          {/* Onboarding Banner - вище таблиці */}
          {showOnboardingBanner && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-4 relative mb-6 rounded-lg">
              {/* Кнопка закриття */}
              <button
                onClick={handleDismissBanner}
                className="absolute top-4 right-4 p-1.5 hover:bg-blue-100 rounded-lg transition-colors z-10"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4 text-blue-700" />
              </button>

              <div className="flex items-center gap-3 pr-8">
                <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-blue-900 mb-1">
                    ONBOARDING TASKS
                  </h3>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Complete tasks with <span className="font-semibold">"Onboarding"</span> badge below. These tasks will help you get familiar with the platform and learn how to use key features in just 5-6 minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {tasks.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
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
                        CATEGORY
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {tasks
                      .filter((t: any) => !t.parentTaskId) // Показуємо тільки основні таски, не сабтаски
                      .map((task) => {
                      // Знаходимо сабтаски для цієї таски (таски з parentTaskId = task.id)
                      const taskSubtasks = tasks.filter((t: any) => t.parentTaskId === task.id)
                      const hasSubtasks = taskSubtasks.length > 0 || (task.subtasks && task.subtasks.length > 0)
                      const isExpanded = expandedTasks.has(task.id)
                      const isOnboarding = task.name === "Welcome to NextGen — Your Quick Start Guide" || task.category === "Onboarding"
                      const taskId = task.id
                      const isSelected = selectedItems.includes(taskId)
                      const displayId = task.taskId || task.id
                      const taskName = task.title || task.name
                      
                      // Create ref for this row
                      const rowRef = { current: null as HTMLTableRowElement | null }

                      return (
                        <React.Fragment key={taskId}>
                          {/* Task Row */}
                          <TaskRowTooltip task={task} rowRef={rowRef as React.RefObject<HTMLTableRowElement>} />
                          <tr
                            ref={(el) => { rowRef.current = el }}
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
                                const newStatus = task.status === "Done" ? "To Do" : "Done"
                                const updatedTasks = tasks.map((t: any) => 
                                  t.id === task.id ? { ...t, status: newStatus } : t
                                )
                                localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
                                setTasks(updatedTasks)
                                window.dispatchEvent(new CustomEvent("taskUpdated"))
                              }}
                              className="hover:bg-secondary/30 transition-colors cursor-pointer"
                            >
                                <td className="px-4 py-3 whitespace-nowrap">
                              <Checkbox
                                checked={task.status === "Done"}
                                onCheckedChange={(checked) => {
                                  // Toggle статус task при кліку на checkbox
                                  const newStatus = checked ? "Done" : "To Do"
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
                                  className="truncate max-w-xs hover:text-primary transition-colors cursor-pointer"
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
                                  : task.status === "To Do" || !task.status
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
                              {isOnboarding ? "Onboarding" : (task.category || "—")}
                            </td>
                            </tr>
                          
                          {/* Subtasks Rows - показуємо тільки якщо task розгорнутий */}
                          {hasSubtasks && isExpanded && (() => {
                            // Використовуємо окремі таски-сабтаски, якщо є, інакше старі subtasks для зворотної сумісності
                            const subtasksToShow = taskSubtasks.length > 0 
                              ? taskSubtasks 
                              : (task.subtasks || []).map((st: any) => ({
                                  id: st.id,
                                  name: st.name,
                                  status: st.status,
                                  priority: st.priority,
                                  assignee: st.assignees && st.assignees.length > 0 ? st.assignees[0] : undefined,
                                }))
                            
                            return subtasksToShow.map((subtask: any) => {
                              const isDone = subtask.status === "Done"
                              const subtaskId = subtask.id
                              const isSubtaskSelected = selectedItems.includes(subtaskId)
                              
                              // Create ref for this subtask row
                              const subtaskRowRef = { current: null as HTMLTableRowElement | null }

                              return (
                                <React.Fragment key={subtaskId}>
                                  <TaskRowTooltip task={subtask} rowRef={subtaskRowRef as React.RefObject<HTMLTableRowElement>} />
                                  <tr
                                    ref={(el) => { subtaskRowRef.current = el }}
                                    className="hover:bg-secondary/30 transition-colors"
                                  >
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <Checkbox
                                      checked={isDone}
                                      onCheckedChange={(checked) => {
                                        // Toggle статус сабтаски при кліку на чекбокс
                                        const newStatus = checked ? "Done" : "To Do"
                                        const updatedTasks = tasks.map((t: any) => {
                                          if (t.id === subtaskId) {
                                            // Оновлюємо таску-сабтаску
                                            return { ...t, status: newStatus, lastModified: new Date().toISOString() }
                                          }
                                          return t
                                        })
                                        localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
                                        setTasks(updatedTasks)
                                        window.dispatchEvent(new CustomEvent("taskUpdated"))
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </td>
                                  <td 
                                    className="px-4 py-3 text-sm text-foreground cursor-pointer"
                                    onClick={() => {
                                      // Відкриваємо сторінку деталей сабтаски
                                      router.push(`/tasks/${subtask.id}`)
                                    }}
                                  >
                                    <div className="flex items-center gap-2 pl-10">
                                      <span 
                                        className="truncate max-w-xs hover:text-primary transition-colors text-foreground"
                                        title={subtask.name || subtask.title}
                                      >
                                        {subtask.name || subtask.title}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                    {subtask.taskId || subtask.id}
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
                                    {subtask.assignee ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                          {subtask.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                        <span>{subtask.assignee}</span>
                                      </div>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                    —
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                    {subtask.category || "Onboarding"}
                                  </td>
                                </tr>
                              </React.Fragment>
                            )
                            })
                          })()}
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
