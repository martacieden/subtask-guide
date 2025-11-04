"use client"

import { useState, useEffect, useRef } from "react"
import { X, ArrowRight, Filter, Plus, FolderTree, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface HotspotStep {
  id: string
  title: string
  description: string
  elementId: string
  position: "top" | "bottom" | "left" | "right" | "center"
  icon: React.ReactNode
  highlightNextTab?: string
  highlightNextTabLabel?: string
}

const steps: HotspotStep[] = [
  {
    id: "quick-filters",
    title: "Quick Filters",
    description: "Quick Filters work as UNION logic - they show results that match ANY selected criteria. This means if you select multiple filters, you'll see all tasks that match any one of them.",
    elementId: "tasks-quick-filters",
    position: "bottom",
    icon: <Filter className="w-5 h-5" />,
  },
  {
    id: "advanced-filters",
    title: "Advanced Filters",
    description: "Advanced Filters use conditional logic (AND) to narrow down results precisely. Combine multiple conditions to find exactly what you're looking for.",
    elementId: "tasks-advanced-filters",
    position: "bottom",
    icon: <Filter className="w-5 h-5" />,
  },
  {
    id: "table-customization",
    title: "Table Customization",
    description: "Customize your table columns to match your workflow. Show or hide columns, adjust their order, and organize your tasks exactly how you need.",
    elementId: "tasks-table-customization",
    position: "bottom",
    icon: <FolderTree className="w-5 h-5" />,
  },
  {
    id: "navigate-decisions",
    title: "Navigate to Decisions",
    description: "Ready to explore more? Check out Decisions to see how categories work and manage your decision-making workflow.",
    elementId: "sidebar-decisions-link",
    position: "right",
    icon: <CheckCircle2 className="w-5 h-5" />,
    highlightNextTab: "/decisions",
    highlightNextTabLabel: "Decisions",
  },
]

interface TasksHotspotOnboardingProps {
  onComplete: () => void
  onSkip: () => void
}

export function TasksHotspotOnboarding({ onComplete, onSkip }: TasksHotspotOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({})
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  useEffect(() => {
    updatePositions()
    window.addEventListener("resize", updatePositions)
    return () => window.removeEventListener("resize", updatePositions)
  }, [currentStep])

  const updatePositions = () => {
    if (!step.elementId) {
      setSpotlightStyle({ display: "none" })
      setTooltipStyle({})
      return
    }

    const element = document.getElementById(step.elementId)
    if (!element || !tooltipRef.current) {
      // Якщо елемент ще не завантажився, спробуємо ще раз через невелику затримку
      setTimeout(updatePositions, 100)
      return
    }

    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const padding = 16

    // Spotlight positioning - підсвітка елемента
    setSpotlightStyle({
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      display: "block",
    })

    // Tooltip positioning - позиціонування підказки
    let tooltipPos: React.CSSProperties = {}

    switch (step.position) {
      case "bottom":
        tooltipPos = {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.bottom + 24}px`,
          transform: "translateX(-50%)",
        }
        break
      case "top":
        tooltipPos = {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.top - tooltipRect.height - 24}px`,
          transform: "translateX(-50%)",
        }
        break
      case "left":
        tooltipPos = {
          left: `${rect.left - tooltipRect.width - 24}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: "translateY(-50%)",
        }
        break
      case "right":
        tooltipPos = {
          left: `${rect.right + 24}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: "translateY(-50%)",
        }
        break
      case "center":
        tooltipPos = {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }
        break
    }

    setTooltipStyle(tooltipPos)
  }

  const handleNext = () => {
    if (isLastStep) {
      // На останньому кроці можна перейти на Decisions або завершити
      if (step.highlightNextTab) {
        // Зберігаємо, що треба показати highlight на Decisions
        localStorage.setItem("way2b1_highlight_decisions", "true")
        onComplete()
        router.push(step.highlightNextTab)
      } else {
        onComplete()
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip()
      } else if (e.key === "ArrowRight" && !isLastStep) {
        handleNext()
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        handlePrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, isLastStep])

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop з затемненням */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={handleSkip}
      />

      {/* Spotlight - підсвітка поточного елемента */}
      {step.elementId && (
        <div
          className="absolute border-4 border-blue-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none animate-pulse"
          style={spotlightStyle}
        />
      )}

      {/* Tooltip з описом */}
      <div
        ref={tooltipRef}
        className={`absolute bg-white rounded-xl shadow-2xl p-6 max-w-sm pointer-events-auto ${
          !step.elementId ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : ""
        }`}
        style={!step.elementId ? {} : tooltipStyle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
              {step.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-600 mb-1">
                Крок {currentStep + 1} з {steps.length}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">{step.description}</p>

        {step.highlightNextTab && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 Next: We'll show you <strong>{step.highlightNextTabLabel}</strong> next
            </p>
          </div>
        )}

        {/* Індикатор прогресу */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? "bg-blue-500 w-8" : "bg-gray-200 w-2"
              }`}
            />
          ))}
        </div>

        {/* Кнопки навігації */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Пропустити
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                Назад
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {isLastStep ? "Завершити" : "Далі"}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



