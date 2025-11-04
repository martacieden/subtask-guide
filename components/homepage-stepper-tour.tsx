"use client"

import { useState, useEffect, useRef } from "react"
import { X, ArrowRight, Search, Settings, Sparkles } from "lucide-react"

interface TourStep {
  id: string
  title: string
  description: string
  elementId: string
  position: "top" | "bottom" | "left" | "right"
  icon: React.ReactNode
}

const steps: TourStep[] = [
  {
    id: "search",
    title: "Search",
    description: "Find anything instantly with our smart search. Use ⌘K to open search from anywhere in the app.",
    elementId: "user-search-input",
    position: "bottom",
    icon: <Search className="w-5 h-5" />,
  },
  {
    id: "profile",
    title: "Profile & Support",
    description: "If you have questions or need help, you can find Support and Feedback buttons here to reach out to us or share your thoughts.",
    elementId: "user-profile-avatar",
    position: "left",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    id: "way2b1-switch",
    title: "Go to Way2B1",
    description: "Switch to the current generation of Way2B1. This option will be removed in the future as we transition fully to Next Gen.",
    elementId: "user-current-gen-switch",
    position: "left",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    id: "fojo-assistant",
    title: "Fojo Assistant",
    description: "Get instant help from Fojo, your AI assistant. Ask questions, get guidance, and discover features powered by artificial intelligence.",
    elementId: "ai-assistant-button",
    position: "top",
    icon: <Sparkles className="w-5 h-5" />,
  },
]

interface HomepageStepperTourProps {
  onComplete: () => void
  onSkip: () => void
}

export function HomepageStepperTour({ onComplete, onSkip }: HomepageStepperTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({})
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  useEffect(() => {
    updatePositions()
    window.addEventListener("resize", updatePositions)
    window.addEventListener("scroll", updatePositions)
    return () => {
      window.removeEventListener("resize", updatePositions)
      window.removeEventListener("scroll", updatePositions)
    }
  }, [currentStep])

  const updatePositions = () => {
    if (!step.elementId) {
      setSpotlightStyle({ display: "none" })
      setTooltipStyle({})
      return
    }

    const element = document.getElementById(step.elementId)
    if (!element || !tooltipRef.current) {
      setTimeout(updatePositions, 100)
      return
    }

    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const padding = 16
    const gap = 20
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Spotlight positioning - підсвітка елемента
    setSpotlightStyle({
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      display: "block",
    })

    // Tooltip positioning
    let left = 0
    let top = 0

    switch (step.position) {
      case "bottom":
        left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2
        top = rect.bottom + scrollY + gap
        break
      case "top":
        left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2
        top = rect.top + scrollY - tooltipRect.height - gap
        break
      case "left":
        left = rect.left + scrollX - tooltipRect.width - gap
        top = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2
        break
      case "right":
        left = rect.right + scrollX + gap
        top = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2
        break
    }

    // Перевірка на вихід за межі екрану
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 20) left = 20
    if (left + tooltipRect.width > viewportWidth - 20) {
      left = viewportWidth - tooltipRect.width - 20
    }

    if (top < 20) top = 20
    if (top + tooltipRect.height > viewportHeight + scrollY - 20) {
      top = viewportHeight + scrollY - tooltipRect.height - 20
    }

    setTooltipStyle({
      left: `${left}px`,
      top: `${top}px`,
    })
  }

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, isLastStep])

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Dark overlay - прибрано */}

      {/* Spotlight - підсвітка елемента без затемнення */}
      <div
        className="absolute rounded-lg border-2 border-blue-500 pointer-events-none transition-all duration-300"
        style={spotlightStyle}
      />

      {/* Tooltip з описом */}
      <div
        ref={tooltipRef}
        className="absolute bg-white rounded-xl shadow-2xl p-6 max-w-sm pointer-events-auto"
        style={tooltipStyle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
              {step.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-600 mb-1">
                Step {currentStep + 1} of {steps.length}
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
        <div className={`flex items-center ${isLastStep ? "justify-end" : "justify-between"}`}>
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Skip tour
            </button>
          )}
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 rounded-lg transition-colors flex items-center gap-2"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

