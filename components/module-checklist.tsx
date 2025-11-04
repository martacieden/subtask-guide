"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Sparkles, FolderTree, Users, ClipboardList, PlugZap, Shield } from "lucide-react"
import { ModuleChecklistItem } from "./module-checklist-item"

interface Module {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  emptyStateTitle: string
  emptyStateDescription: string
  actionLabel: string
  route: string
  estimatedTime: string
}

function ProgressAnimation({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="animate-in zoom-in fade-in duration-500">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          <span className="text-xl font-bold">+20% Progress!</span>
        </div>
      </div>
    </div>
  )
}

function CompletionModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (show) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!show) return null

  const handleGoToResources = () => {
    onClose()
    router.push("/resources")
  }

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#4F7CFF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][
                    Math.floor(Math.random() * 5)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You completed onboarding!</h2>
            <p className="text-gray-600 mb-6">Welcome to Way2B1. Your multi-family office workspace is ready.</p>
            <button
              onClick={handleGoToResources}
              className="bg-[#4F7CFF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4F7CFF]/90 transition-colors w-full"
            >
              Go to Resources & Guides
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function ModuleChecklist() {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([
    {
      id: "setup-domains",
      title: "Create base category",
      description: "Categories in domains, decisions, tasks",
      icon: <FolderTree className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No category structure",
      emptyStateDescription: "Create categories in domains, decisions, and tasks to organize your workspace",
      actionLabel: "Create category",
      route: "/decisions",
      estimatedTime: "3 min",
    },
    {
      id: "create-teams",
      title: "Create teams",
      description: "Set up team structure and groups",
      icon: <Users className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No teams created",
      emptyStateDescription: "Create teams to organize your team members and assign permissions",
      actionLabel: "Create team",
      route: "/team",
      estimatedTime: "2 min",
    },
    {
      id: "add-demo-items",
      title: "Add demo items",
      description: "1 decision, 1 task, 1 property, 1 document",
      icon: <ClipboardList className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No demo content",
      emptyStateDescription: "Create a sample decision and task, add a property and a key document",
      actionLabel: "Add item",
      route: "/decisions",
      estimatedTime: "4 min",
    },
    {
      id: "connect-integrations",
      title: "Connect integrations",
      description: "Bill.com, QuickBooks, Drive/OneDrive, Calendar",
      icon: <PlugZap className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No integrations connected",
      emptyStateDescription: "Connect finance, storage and calendar tools to streamline workflows",
      actionLabel: "Connect",
      route: "/resources",
      estimatedTime: "3 min",
    },
    {
      id: "add-team-member",
      title: "Invite key users",
      description: "CEO/Principal, CFO/Accountant, Ops Manager, EA",
      icon: <Users className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "No teammates invited",
      emptyStateDescription: "Invite the core team and add them to your teams",
      actionLabel: "Invite",
      route: "/team",
      estimatedTime: "2 min",
    },
    {
      id: "configure-compliance",
      title: "Set up compliance tracking",
      description: "Enable audit trail and regulatory reporting",
      icon: <Shield className="w-5 h-5" />,
      completed: false,
      emptyStateTitle: "Compliance not configured",
      emptyStateDescription: "Enable compliance tracking to keep audit logs and generate reports",
      actionLabel: "Set up",
      route: "/compliance",
      estimatedTime: "2 min",
    },
  ])

  const [showProgressAnimation, setShowProgressAnimation] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  // Перевіряємо чи користувач вже завершив онбординг раніше
  const [checklistHidden, setChecklistHidden] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("way2b1_onboarding_completed") === "true"
  })

  useEffect(() => {
    // Load initial progress from localStorage
    const savedProgress = localStorage.getItem("way2b1_module_progress")
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setModules((prev) => {
          const updated = prev.map((module) => ({
            ...module,
            completed: progress[module.id] || false,
          }))
          
          // Перевіряємо чи всі модулі вже завершені
          const allCompleted = updated.every((module) => progress[module.id] === true)
          if (allCompleted && updated.length > 0) {
            setChecklistHidden(true)
          }
          
          return updated
        })
      } catch (e) {
        console.error("Failed to parse progress", e)
      }
    }
  }, [])

  // Listen for progress updates from other components (e.g., CategoryWizard)
  useEffect(() => {
    const handleProgressUpdate = () => {
      const savedProgress = localStorage.getItem("way2b1_module_progress")
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress)
          setModules((prev) =>
            prev.map((module) => ({
              ...module,
              completed: progress[module.id] || false,
            })),
          )
        } catch (e) {
          console.error("Failed to parse progress", e)
        }
      }
    }

    // Initial load
    handleProgressUpdate()

    // Listen for updates
    window.addEventListener("onboardingProgressUpdate", handleProgressUpdate)

    return () => {
      window.removeEventListener("onboardingProgressUpdate", handleProgressUpdate)
    }
  }, [])

  useEffect(() => {
    const completedCount = modules.filter((m) => m.completed).length
    const totalCount = modules.length

    if (completedCount === totalCount && completedCount > 0) {
      // Приховуємо чекліст одразу коли всі модулі завершені
      setChecklistHidden(true)
      localStorage.setItem("way2b1_onboarding_completed", "true")
      // Показуємо модалку завершення
      setTimeout(() => {
        setShowCompletionModal(true)
      }, 500)
    }
  }, [modules])

  const toggleModule = (moduleId: string) => {
    setModules((prev) => {
      const updated = prev.map((module) =>
        module.id === moduleId ? { ...module, completed: !module.completed } : module,
      )

      const progress = updated.reduce(
        (acc, module) => ({
          ...acc,
          [module.id]: module.completed,
        }),
        {},
      )
      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))

      // Dispatch custom event to notify OnboardingProgressBadge (defer to avoid setState during render)
      setTimeout(() => window.dispatchEvent(new CustomEvent("onboardingProgressUpdate")), 0)

      const wasCompleted = prev.find((m) => m.id === moduleId)?.completed
      const isNowCompleted = updated.find((m) => m.id === moduleId)?.completed
      if (!wasCompleted && isNowCompleted) {
        setShowProgressAnimation(true)
        setTimeout(() => setShowProgressAnimation(false), 2000)
      }

      return updated
    })
  }

  const handleResetModule = (moduleId: string) => {
    setModules((prev) => {
      const updated = prev.map((module) =>
        module.id === moduleId ? { ...module, completed: false } : module,
      )

      const progress = updated.reduce(
        (acc, module) => ({
          ...acc,
          [module.id]: module.completed,
        }),
        {},
      )
      localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))

      // Dispatch custom event to notify OnboardingProgressBadge
      setTimeout(() => window.dispatchEvent(new CustomEvent("onboardingProgressUpdate")), 0)

      return updated
    })
  }

  const handleActionClick = (route: string, moduleId: string) => {
    localStorage.setItem("way2b1_active_module", moduleId)
    if (moduleId === "setup-domains") {
      // Redirect to decisions page and highlight New Category button with hotspot
      try {
        localStorage.setItem("way2b1_start_category_flow", "true")
        localStorage.setItem("way2b1_highlight_new_category", "true")
      } catch {}
      router.push("/decisions")
      return
    }
    if (moduleId === "create-teams") {
      // Start walkthrough for creating teams
      localStorage.setItem("way2b1_start_team_walkthrough", "true")
      router.push("/team")
      return
    }
    if (moduleId === "add-team-member") {
      // Start walkthrough directly for inviting users
      localStorage.setItem("way2b1_start_team_walkthrough", "true")
      router.push("/team")
      return
    }
    router.push(route)
  }

  const completedCount = modules.filter((m) => m.completed).length
  const totalCount = modules.length
  const progress = (completedCount / totalCount) * 100
  const allCompleted = completedCount === totalCount && totalCount > 0

  // Приховуємо чекліст якщо він вже прихований або всі модулі завершені
  if (checklistHidden) {
    return (
      <>
        <ProgressAnimation show={showProgressAnimation} />
        <CompletionModal show={showCompletionModal} onClose={() => {
          setShowCompletionModal(false)
        }} />
      </>
    )
  }

  return (
    <>
      <ProgressAnimation show={showProgressAnimation} />

      <CompletionModal show={showCompletionModal} onClose={() => {
        setShowCompletionModal(false)
        setChecklistHidden(true)
      }} />

      <div className="bg-card rounded-xl">
        <div className="px-0 pt-6 pb-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">Family Office Setup</h3>
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {completedCount} of {totalCount}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {modules.map((module) => (
            <ModuleChecklistItem
              key={module.id}
              module={module}
              onActionClick={handleActionClick}
              onResetClick={handleResetModule}
            />
          ))}
        </div>

        {allCompleted && (
          <div className="mx-6 mb-6 mt-6 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎉</div>
              <div>
                <div className="font-semibold text-emerald-900">Congratulations!</div>
                <div className="text-sm text-emerald-700">Your multi-family collaboration workspace is ready</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
