"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronRight, ChevronLeft } from "lucide-react"

interface CategoryStep {
  title: string
  content: string
  elementId: string | null
  position: "center" | "bottom" | "top" | "left" | "right"
  canSkip?: boolean
  waitForAction?: string
  wizardStep?: number // Step in CategoryWizard this corresponds to
}

const categorySteps: CategoryStep[] = [
  {
    title: "Create New Category",
    content:
      "Welcome! Let's create your first category. Categories help you organize decisions and quickly find important information. Click 'New category' to get started.",
    elementId: "btn-new-category",
    position: "right",
    canSkip: false,
    waitForAction: "btn-new-category", // Wait for New Category button click - opens wizard
    wizardStep: 1,
  },
  {
    title: "Enter Category Details",
    content:
      "Enter a name and select the appropriate category type. You can also choose an icon for your category to make it easier to identify.",
    elementId: "category-wizard-name-input",
    position: "bottom",
    canSkip: true,
    waitForAction: "category-wizard-continue-btn", // Wait for Continue button click
    wizardStep: 1,
  },
  {
    title: "Select Category Capsules",
    content:
      "Choose the information users must provide when creating new items in this category. For example, track amounts & budgets, upload attachments, or link related items.",
    elementId: "category-wizard-capsules",
    position: "bottom",
    canSkip: true,
    waitForAction: "category-wizard-continue-btn",
    wizardStep: 2,
  },
  {
    title: "Set Up Custom Fields (Optional)",
    content:
      "Add custom fields to capture more context for items in this category. You can create multiple custom sections, add relevant fields to each one, and organize information in a clear hierarchy.",
    elementId: "category-wizard-custom-fields",
    position: "bottom",
    canSkip: true,
    waitForAction: "category-wizard-continue-btn",
    wizardStep: 3,
  },
  {
    title: "Workflow Configuration",
    content:
      "Configure the approval workflow for items in this category. You can use the default workflow, select an existing one, set up ad hoc approval, or create a new workflow.",
    elementId: "category-wizard-workflow",
    position: "bottom",
    canSkip: true,
    waitForAction: "category-wizard-continue-btn",
    wizardStep: 4,
  },
  {
    title: "Preview",
    content:
      "Review all your category settings on this preview screen. Make sure everything looks correct before creating your category.",
    elementId: "category-wizard-step-5",
    position: "bottom",
    canSkip: false,
    waitForAction: "category-wizard-create-btn", // Final action - Create button completes walkthrough
    wizardStep: 5,
  },
]

interface CategoryWalkthroughProps {
  onClose: () => void
  onStepComplete?: (stepIndex: number) => void
  onComplete?: () => void
}

export function CategoryWalkthrough({ onClose, onStepComplete, onComplete }: CategoryWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [canSkipStep, setCanSkipStep] = useState(true)

  const step = categorySteps[currentStep]
  const isLastStep = currentStep === categorySteps.length - 1

  // Validate required fields for step 2 (Enter Category Details)
  const validateRequiredFields = useCallback(() => {
    if (currentStep === 1) {
      // Step 2 is "Enter Category Details" - check Name and Category type
      const nameInput = document.getElementById("category-wizard-name-input") as HTMLInputElement
      const typeSelect = document.getElementById("category-wizard-type-select") as HTMLSelectElement
      
      const nameFilled = nameInput?.value?.trim().length > 0
      const typeFilled = typeSelect?.value?.trim().length > 0
      
      // Can skip only if both required fields are filled
      setCanSkipStep(nameFilled && typeFilled)
    } else {
      setCanSkipStep(step.canSkip ?? true)
    }
  }, [currentStep, step.canSkip])

  // Function to mark module as complete
  const markModuleComplete = useCallback(() => {
    const saved = localStorage.getItem("way2b1_module_progress")
    const progress = saved ? JSON.parse(saved) : {}
    progress["setup-domains"] = true
    localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
    localStorage.removeItem("way2b1_active_module")
    // Dispatch event to update progress in other components
    window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  // Function to advance to next step
  const advanceToNext = useCallback(() => {
    setCurrentStep((prev) => {
      const nextIndex = prev + 1
      if (nextIndex >= categorySteps.length) {
        // Mark module as complete when walkthrough finishes
        markModuleComplete()
        onClose()
        return prev
      }

      if (onStepComplete) {
        onStepComplete(prev)
      }

      return nextIndex
    })
  }, [onClose, onStepComplete, markModuleComplete])

  // Listen for wizard sync events
  useEffect(() => {
    const handleGotoStep = (event: CustomEvent) => {
      const targetStep = event.detail?.step
      if (targetStep !== undefined && targetStep >= 0 && targetStep < categorySteps.length) {
        setCurrentStep(targetStep)
      }
    }

    window.addEventListener("category-walkthrough-goto-step", handleGotoStep as EventListener)
    return () => {
      window.removeEventListener("category-walkthrough-goto-step", handleGotoStep as EventListener)
    }
  }, [])

  // Auto-sync with wizard when it opens (if we're on step 0)
  useEffect(() => {
    // If walkthrough is on step 0 (Create New Category) and wizard opens, move to step 1
    if (currentStep === 0) {
      const checkWizardOpen = () => {
        const wizardModal = document.querySelector('[class*="bg-black/50"]')
        const wizardStep1 = document.getElementById("category-wizard-step-1")
        if (wizardModal && wizardStep1) {
          // Wizard is open on step 1, sync walkthrough to step 1
          setCurrentStep(1)
        }
      }
      
      // Check immediately and with a delay
      checkWizardOpen()
      const timer = setTimeout(checkWizardOpen, 500)
      const interval = setInterval(checkWizardOpen, 500)
      
      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [currentStep])

  useEffect(() => {
    // Validate fields when step changes
    validateRequiredFields()
    
    // Also validate on input changes (for step 2)
    if (currentStep === 1) {
      const nameInput = document.getElementById("category-wizard-name-input")
      const typeSelect = document.getElementById("category-wizard-type-select")
      
      const handleInputChange = () => {
        validateRequiredFields()
      }
      
      nameInput?.addEventListener("input", handleInputChange)
      nameInput?.addEventListener("change", handleInputChange)
      typeSelect?.addEventListener("change", handleInputChange)
      
      // Check periodically
      const interval = setInterval(validateRequiredFields, 300)
      
      return () => {
        nameInput?.removeEventListener("input", handleInputChange)
        nameInput?.removeEventListener("change", handleInputChange)
        typeSelect?.removeEventListener("change", handleInputChange)
        clearInterval(interval)
      }
    }
  }, [currentStep, validateRequiredFields])

  useEffect(() => {
    // Force initial update
    updatePositions()
    
    // Initial delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updatePositions()
    }, 100)
    
    // Another delay for modal elements
    const timer2 = setTimeout(() => {
      updatePositions()
    }, 500)
    
    window.addEventListener("resize", updatePositions)
    window.addEventListener("scroll", updatePositions, true)
    
    // Also update periodically in case element appears later
    const interval = setInterval(() => {
      updatePositions()
    }, 300)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      clearInterval(interval)
      window.removeEventListener("resize", updatePositions)
      window.removeEventListener("scroll", updatePositions, true)
    }
  }, [currentStep, step.elementId])

  // Add visual highlighting for elements
  useEffect(() => {
    if (step.elementId) {
      const element = document.getElementById(step.elementId)
      if (element) {
        element.classList.add("walkthrough-highlight")
        return () => {
          element.classList.remove("walkthrough-highlight")
        }
      }
    }
  }, [currentStep, step.elementId])

  // Listen for user actions to auto-advance steps
  useEffect(() => {
    if (!step.waitForAction) return

    const handleAction = () => {
      // If clicking Create button, complete the walkthrough
      if (step.waitForAction === "category-wizard-create-btn") {
        markModuleComplete()
        onClose()
        return
      }

      // If clicking New Category button, wait for wizard to open before advancing
      if (step.waitForAction === "btn-new-category") {
        setTimeout(() => {
          // Check if wizard modal is actually open and step 1 is visible
          const modal = document.querySelector('[class*="bg-black/50"]')
          const wizardStep1 = document.getElementById("category-wizard-step-1")
          if (modal && wizardStep1) {
            // Wizard is open on step 1, move walkthrough to step 1 (Enter Category Details)
            setCurrentStep(1)
          }
        }, 300) // Delay for modal to fully render
      } else {
        // For Continue buttons inside wizard, check if we're on the right step
        if (step.waitForAction === "category-wizard-continue-btn") {
          // Wait for wizard step to change
          setTimeout(() => {
            advanceToNext()
          }, 300)
        } else {
          // For other actions, shorter delay
          setTimeout(() => {
            advanceToNext()
          }, 300)
        }
      }
    }

    // Listen for clicks on the target element
    const targetElement = document.getElementById(step.waitForAction)
    if (targetElement) {
      targetElement.addEventListener("click", handleAction, { once: true })
      return () => {
        targetElement.removeEventListener("click", handleAction)
      }
    }
  }, [currentStep, step.waitForAction, advanceToNext, markModuleComplete, onClose])

  const updatePositions = () => {
    if (!step.elementId) {
      // Center tooltip if no element
      setTooltipStyle({
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      })
      return
    }

    const element = document.getElementById(step.elementId)
    if (!element) {
      // If element not found, try to position in center
      if (tooltipRef.current) {
        setTooltipStyle({
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        })
      }
      return
    }

    if (!tooltipRef.current) return

    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    // Check if element is inside a modal
    let isInModal = false
    let modalContentRect: DOMRect | null = null

    let parent = element.parentElement
    while (parent && parent !== document.body) {
      const classes = parent.className
      if (typeof classes === "string" && classes.includes("fixed") && classes.includes("bg-black/50")) {
        isInModal = true
        const modalContent = parent.querySelector('[class*="rounded"], [class*="shadow"], [class*="max-w"]')
        if (modalContent) {
          modalContentRect = modalContent.getBoundingClientRect()
        }
        break
      }
      parent = parent.parentElement
    }

    // Tooltip positioning
    let tooltipPos: React.CSSProperties = {}

    if (isInModal && modalContentRect) {
      const margin = 16
      const viewportWidth = window.innerWidth
      const tooltipWidth = tooltipRect.width || 340

      const spaceOnRight = viewportWidth - modalContentRect.right
      if (spaceOnRight >= tooltipWidth + margin) {
        tooltipPos = {
          left: `${modalContentRect.right + margin}px`,
          top: `${Math.max(16, modalContentRect.top + 40)}px`,
          transform: "none",
          maxWidth: `${Math.min(tooltipWidth, 340)}px`,
        }
      } else {
        tooltipPos = {
          left: `${modalContentRect.left + modalContentRect.width / 2}px`,
          top: `${modalContentRect.bottom + margin}px`,
          transform: "translateX(-50%)",
          maxWidth: `${Math.min(tooltipWidth, modalContentRect.width)}px`,
        }
      }
    } else {
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
      }
    }

    setTooltipStyle(tooltipPos)
  }

  const handleNext = () => {
    advanceToNext()
  }

  const handleSkipStep = () => {
    advanceToNext()
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => {
        const newStep = prev - 1
        // Sync with wizard step if we're inside wizard
        const stepInfo = categorySteps[newStep]
        if (stepInfo?.wizardStep) {
          // Dispatch event to sync wizard step
          window.dispatchEvent(
            new CustomEvent("category-wizard-goto-step", {
              detail: { step: stepInfo.wizardStep },
            })
          )
        }
        return newStep
      })
    }
  }

  const handleSkip = () => {
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="organization-walkthrough-overlay" style={{ zIndex: 10000 }}>
      {/* Hotspot indicator for target element */}
      {step.waitForAction && <WalkthroughHotspot elementId={step.waitForAction} />}

      {/* Tooltip with instruction - always visible */}
      <div
        ref={tooltipRef}
        className="organization-walkthrough-tooltip"
        style={{
          ...(Object.keys(tooltipStyle).length > 0 ? tooltipStyle : {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }),
          opacity: 1,
          visibility: 'visible',
          display: 'block',
          zIndex: 10001,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-xs font-medium text-primary mb-1">
              Step {currentStep + 1} of {categorySteps.length}
            </div>
            <h3 className="text-base font-bold text-foreground">{step.title}</h3>
          </div>
          <button onClick={handleSkip} className="p-0.5 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{step.content}</p>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-4">
          {/* Progress dots */}
          <div className="flex gap-1">
            {categorySteps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentStep ? "bg-primary w-5" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-xs font-medium transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            )}

            {step.waitForAction && step.canSkip && (
              <button
                onClick={handleSkipStep}
                disabled={!canSkipStep}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  canSkipStep
                    ? "bg-transparent hover:bg-secondary/50 text-muted-foreground"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                }`}
              >
                Skip
              </button>
            )}

            {!step.waitForAction && (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-medium transition-colors"
              >
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hotspot component for highlighting clickable elements
function WalkthroughHotspot({ elementId }: { elementId: string }) {
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null)

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(elementId)
      if (element) {
        const rect = element.getBoundingClientRect()
        // Position hotspot on the right side of the button, centered vertically
        setPosition({
          top: rect.top + rect.height / 2 - 12,
          left: rect.right + 12,
          width: rect.width,
          height: rect.height,
        })
      }
    }

    // Initial update
    updatePosition()
    
    // Also update after a short delay to ensure element is rendered
    const timer = setTimeout(updatePosition, 100)
    
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    // Check periodically in case element appears later
    const interval = setInterval(updatePosition, 200)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
      clearInterval(interval)
    }
  }, [elementId])

  if (!position) return null

  return (
    <div
      className="fixed pointer-events-none z-[10002]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <span className="absolute inline-flex rounded-full bg-blue-500/60 opacity-75 animate-ping" style={{ width: 28, height: 28, top: -2, left: -2 }} />
      <span className="relative inline-flex rounded-full bg-blue-500 shadow-lg border-2 border-white" style={{ width: 24, height: 24 }}>
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">!</span>
      </span>
    </div>
  )
}

