"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Sparkles, ArrowRight, X, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface CategoryAhaMomentProps {
  show: boolean
  onClose: () => void
  onNext?: () => void
}

export function CategoryAhaMoment({ show, onClose, onNext }: CategoryAhaMomentProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState({ completed: 0, total: 6 })

  useEffect(() => {
    if (show) {
      setMounted(true)
      // Update progress when modal is shown
      const updateProgress = () => {
        try {
          const savedProgress = localStorage.getItem("way2b1_module_progress")
          if (savedProgress) {
            const parsed = JSON.parse(savedProgress)
            const completed = Object.values(parsed).filter(Boolean).length
            setProgress({ completed, total: 6 })
          }
        } catch (e) {
          console.error("Failed to parse progress", e)
        }
      }
      updateProgress()
      
      // Listen for progress updates
      window.addEventListener("onboardingProgressUpdate", updateProgress)
      return () => {
        window.removeEventListener("onboardingProgressUpdate", updateProgress)
      }
    }
  }, [show])

  if (!show || !mounted) return null

  const handleNextStep = () => {
    // Set flags for navigation BEFORE closing modal
    localStorage.setItem("way2b1_active_module", "create-teams")
    localStorage.setItem("way2b1_start_team_walkthrough", "true")
    
    // Close AHA moment first
    onClose()
    
    // Navigate after modal closes - use longer delay to ensure modal is fully closed
    setTimeout(() => {
      router.push("/team")
    }, 500)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      {/* Confetti animation */}
      <div className="fixed inset-0 pointer-events-none z-[10001]">
        {Array.from({ length: 50 }).map((_, i) => (
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

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] animate-in fade-in duration-300">
        <div className="bg-card rounded-2xl p-8 max-w-lg mx-4 shadow-2xl animate-in zoom-in duration-500 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Sparkles className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Great job! 🎉</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              You've successfully created your first category! Categories help you organize decisions and quickly find important information.
            </p>

            {/* Progress info */}
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <div className="text-sm text-muted-foreground mb-2">Onboarding Progress</div>
              <div className="text-2xl font-bold text-foreground">
                {progress.completed} of {progress.total}
              </div>
            </div>

            {/* Next step suggestion */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground mb-1">Ready for the next step?</div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create teams to organize your team members and assign permissions. This will help you collaborate more effectively.
                  </p>
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Create teams
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

