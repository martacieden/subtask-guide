"use client"

import { useEffect, useState } from "react"
import { X, ArrowRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubtaskInteractiveGuideProps {
  targetElementId?: string
  targetUrl?: string
  scrollToSection?: string
  showHowSteps?: string[]
  isVisible: boolean
  onClose: () => void
}

export function SubtaskInteractiveGuide({
  targetElementId,
  targetUrl,
  scrollToSection,
  showHowSteps,
  isVisible,
  onClose,
}: SubtaskInteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlighted, setHighlighted] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0)
      setHighlighted(false)
      // Прибираємо підсвітку при закритті
      if (targetElementId) {
        const element = document.getElementById(targetElementId)
        if (element) {
          element.classList.remove("onboarding-highlight")
        }
      }
      return
    }

    // Підсвічуємо елемент, якщо є targetElementId
    if (targetElementId && !targetUrl) {
      // Спочатку скролуємо до секції, якщо вказано
      if (scrollToSection) {
        setTimeout(() => {
          const section = document.getElementById(scrollToSection)
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 300)
      }

      // Потім підсвічуємо елемент
      setTimeout(() => {
        const element = document.getElementById(targetElementId)
        if (element) {
          setHighlighted(true)
          element.classList.add("onboarding-highlight")
          
          // Скролуємо до елемента
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          
          // Прибираємо підсвітку через 3 секунди
          setTimeout(() => {
            element.classList.remove("onboarding-highlight")
            setHighlighted(false)
          }, 3000)
        }
      }, scrollToSection ? 800 : 300)
    } else if (scrollToSection) {
      // Якщо немає targetElementId, але є scrollToSection
      setTimeout(() => {
        const section = document.getElementById(scrollToSection)
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 300)
    }
  }, [isVisible, targetElementId, targetUrl, scrollToSection])

  if (!isVisible) return null

  const hasSteps = showHowSteps && showHowSteps.length > 0
  const totalSteps = hasSteps ? showHowSteps.length : 0

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      {/* Overlay для фокусу */}
      {highlighted && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      )}

      {/* Інтерактивний гайд */}
      {hasSteps && (
        <div className="fixed bottom-6 right-6 bg-card border border-border rounded-xl shadow-2xl p-6 max-w-md z-[100000] pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-blue-600 mb-1">
                  Step {currentStep + 1} of {totalSteps}
                </div>
                <h3 className="text-base font-bold text-foreground">Step-by-step instructions</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                {currentStep + 1}
              </span>
              <p className="text-sm text-foreground leading-relaxed flex-1">
                {showHowSteps[currentStep]}
              </p>
            </div>
          </div>

          {/* Прогрес індикатор */}
          <div className="mb-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Кнопки навігації */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              size="sm"
              className="flex-1 gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {currentStep === totalSteps - 1 ? "Complete" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

