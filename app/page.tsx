"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Dashboard } from "@/components/dashboard"
import { TutorialOverlay } from "@/components/tutorial-overlay"
import { Hotspots } from "@/components/hotspots"
import { FeedbackSurvey } from "@/components/feedback-survey"
import { RoleSelector } from "@/components/role-selector"
import { TutorialCenter } from "@/components/tutorial-center"
import { MilestoneCelebration } from "@/components/milestone-celebration"
import { AIAssistantButton } from "@/components/ai-assistant-button"
import { ModuleCompletionModal } from "@/components/module-completion-modal"
import { OnboardingTypeSelector } from "@/components/onboarding-type-selector"
import { LearnByDoingFeedback } from "@/components/learn-by-doing-feedback"
import { UserHomePageWalkthrough } from "@/components/user-homepage-walkthrough"
import { LoginWithRole } from "@/components/login-with-role"
import { NextGenWelcome } from "@/components/next-gen-welcome"
import { HomepageStepperTour } from "@/components/homepage-stepper-tour"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showNextGenWelcome, setShowNextGenWelcome] = useState(false)
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [flowType, setFlowType] = useState<"admin" | "advisor" | null>(null)
  const [showOnboardingTypeSelector, setShowOnboardingTypeSelector] = useState(false)
  const [onboardingType, setOnboardingType] = useState<"admin1" | "admin2" | "advisor" | null>(null)
  const [showTutorialCenter, setShowTutorialCenter] = useState(false)
  const [milestone, setMilestone] = useState<any>(null)
  const [showCompletionModal, setShowCompletionModal] = useState<any>(null)

  const [tutorialActive, setTutorialActive] = useState(false)
  const [showHotspots, setShowHotspots] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [showLearnFeedback, setShowLearnFeedback] = useState<any>(null)
  const [showUserWalkthrough, setShowUserWalkthrough] = useState(false)
  const [showHomepageStepper, setShowHomepageStepper] = useState(false)

  // Check for module completion modal
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const checkCompletion = () => {
      const saved = localStorage.getItem("way2b1_module_progress")
      const lastCompleted = localStorage.getItem("way2b1_last_completed_module")
      
      if (saved && lastCompleted) {
        try {
          const progress = JSON.parse(saved)
          const moduleId = lastCompleted
          
          // Check if module was just completed
          if (progress[moduleId] === true) {
            // Get module info
            const moduleInfo: Record<string, { title: string; nextId?: string; nextTitle?: string; nextRoute?: string }> = {
              "setup-domains": {
                title: "Create base category",
                nextId: "create-teams",
                nextTitle: "Create teams",
                nextRoute: "/team",
              },
              "create-teams": {
                title: "Create teams",
                nextId: "add-demo-items",
                nextTitle: "Add demo items",
                nextRoute: "/decisions",
              },
              "add-demo-items": {
                title: "Add demo items",
                nextId: "connect-integrations",
                nextTitle: "Connect integrations",
                nextRoute: "/resources",
              },
              "connect-integrations": {
                title: "Connect integrations",
                nextId: "add-team-member",
                nextTitle: "Invite key users",
                nextRoute: "/team",
              },
              "add-team-member": {
                title: "Invite key users",
                nextId: "configure-compliance",
                nextTitle: "Set up compliance tracking",
                nextRoute: "/compliance",
              },
            }
            
            const info = moduleInfo[moduleId]
            if (info) {
              setShowCompletionModal({
                moduleId,
                moduleTitle: info.title,
                nextModuleId: info.nextId,
                nextModuleTitle: info.nextTitle,
                nextModuleRoute: info.nextRoute,
              })
              localStorage.removeItem("way2b1_last_completed_module")
            }
          }
        } catch (e) {
          console.error("Failed to parse progress", e)
        }
      }
    }
    
    checkCompletion()
    
    // Listen for progress updates
    const handleProgressUpdate = () => {
      setTimeout(checkCompletion, 500)
    }
    
    window.addEventListener("onboardingProgressUpdate", handleProgressUpdate)
    return () => {
      window.removeEventListener("onboardingProgressUpdate", handleProgressUpdate)
    }
  }, [])

  useEffect(() => {
    // Перевіряємо чи користувач вже залогінений
    if (typeof window === "undefined") return
    
    const isLoggedIn = localStorage.getItem("way2b1_logged_in")
    const hasSeenNextGenWelcome = localStorage.getItem("way2b1_next_gen_welcome_seen")
    
    // Якщо не залогінений - показуємо логін
    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }
    
    // Перевіряємо чи треба показати NextGenWelcome після логіну
    const shouldShowNextGenWelcome = localStorage.getItem("way2b1_show_next_gen_welcome") === "true"
    if (isLoggedIn && shouldShowNextGenWelcome && !hasSeenNextGenWelcome) {
      localStorage.removeItem("way2b1_show_next_gen_welcome")
      setShowNextGenWelcome(true)
      return
    }
    
    // Якщо залогінений але не бачив Next Gen Welcome - показуємо welcome
    if (isLoggedIn && !hasSeenNextGenWelcome) {
      setShowNextGenWelcome(true)
      return
    }
    
    // Якщо залогінений і вже бачив Next Gen Welcome - перевіряємо чи бачив stepper tour
    if (isLoggedIn && hasSeenNextGenWelcome) {
      const hasSeenStepper = localStorage.getItem("way2b1_homepage_stepper_seen")
      if (!hasSeenStepper) {
        setTimeout(() => {
          setShowHomepageStepper(true)
        }, 500)
      } else {
        setTimeout(() => {
          setShowHotspots(true)
        }, 500)
      }
    }
  }, [])
  
  useEffect(() => {
    // Якщо все пройдено - показуємо основний контент
    const SURVEY_COOLDOWN_HOURS = 24
    const canShowSurvey = () => {
      if (typeof window === "undefined") return false
      const last = localStorage.getItem("way2b1_last_survey_prompt")
      if (!last) return true
      const elapsed = Date.now() - Number(last)
      return elapsed > SURVEY_COOLDOWN_HOURS * 60 * 60 * 1000
    }
    
    const savedFlowType = localStorage.getItem("way2b1_flow_type")
    const savedRole = localStorage.getItem("way2b1_user_role")
    const hasVisited = localStorage.getItem("way2b1_visited")
    const surveyShown = localStorage.getItem("way2b1_survey_shown")

    if (savedFlowType) {
      setFlowType(savedFlowType as "admin" | "advisor")
      
      // Для демо роль встановлюється автоматично при виборі флоу
      if (savedRole) {
        setUserRole(savedRole)
        if (!hasVisited) {
          setTimeout(() => {
            setShowWelcome(true)
          }, 1000)
        } else {
          setShowHotspots(true)
          if (!surveyShown && canShowSurvey()) {
            setTimeout(() => {
              setShowSurvey(true)
              localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
            }, 30000)
          }
        }
      }
    }

    const handleMilestone = (event: CustomEvent) => {
      setMilestone(event.detail)
    }
    window.addEventListener("milestone-reached" as any, handleMilestone)
    const handleRequestFeedback = () => {
      if (canShowSurvey()) {
        setShowSurvey(true)
        localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
      }
    }
    const handleLearnByDoingFeedback = (event: CustomEvent) => {
      setShowLearnFeedback(event.detail)
    }
    window.addEventListener("requestFeedback", handleRequestFeedback)
    window.addEventListener("learnByDoingFeedback", handleLearnByDoingFeedback as any)
    return () => {
      window.removeEventListener("milestone-reached" as any, handleMilestone)
      window.removeEventListener("requestFeedback", handleRequestFeedback)
      window.removeEventListener("learnByDoingFeedback", handleLearnByDoingFeedback as any)
    }
  }, [])

  const handleOnboardingTypeSelect = (type: "admin1" | "admin2" | "advisor") => {
    setOnboardingType(type)
    setShowOnboardingTypeSelector(false)
    localStorage.setItem("way2b1_onboarding_type", type)

    // Встановлюємо flowType та роль залежно від типу onboarding
    if (type === "admin1" || type === "admin2") {
      setFlowType("admin")
      localStorage.setItem("way2b1_flow_type", "admin")
      const adminRole = "family-principal"
      setUserRole(adminRole)
      localStorage.setItem("way2b1_user_role", adminRole)
      localStorage.setItem("way2b1_user_goals", JSON.stringify(["Review and approve key decisions", "Monitor family portfolio performance"]))
    } else {
      // advisor type - звичайний користувач
      setFlowType("advisor")
      localStorage.setItem("way2b1_flow_type", "advisor")
      const advisorRole = "investment-advisor"
      setUserRole(advisorRole)
      localStorage.setItem("way2b1_user_role", advisorRole)
      localStorage.setItem("way2b1_user_goals", JSON.stringify(["Create investment decisions", "Share documents with families"]))
      
      // Для звичайного користувача показуємо walkthrough замість welcome modal
      const hasSeenWalkthrough = localStorage.getItem("way2b1_user_walkthrough_completed") === "true"
      if (!hasSeenWalkthrough) {
        setTimeout(() => {
          setShowUserWalkthrough(true)
        }, 500)
      } else {
        // Якщо вже бачив walkthrough, показуємо welcome modal
        setTimeout(() => {
          setShowWelcome(true)
        }, 500)
      }
      return
    }

    // Показуємо welcome modal після вибору типу onboarding (для admin)
    setTimeout(() => {
      setShowWelcome(true)
    }, 500)
  }

  const handleRoleComplete = (role: string, goals: string[]) => {
    setUserRole(role)
    setShowRoleSelector(false)
    localStorage.setItem("way2b1_user_role", role)
    localStorage.setItem("way2b1_user_goals", JSON.stringify(goals))

    // Track analytics
    console.log("[v0] User role selected:", role, "Goals:", goals)

    // Show welcome modal after role selection
    setTimeout(() => {
      setShowWelcome(true)
    }, 500)
  }

  const handleStartTutorial = () => {
    setShowWelcome(false)
    setTutorialActive(true)
    setShowHotspots(false)
    console.log("[v0] Tutorial started")
  }

  const handleEndTutorial = () => {
    setTutorialActive(false)
    setShowHotspots(true)
    localStorage.setItem("way2b1_visited", "true")
    console.log("[v0] Tutorial completed")
    setTimeout(() => {
      setShowSurvey(true)
    }, 2000)
  }


  const handleUserWalkthroughComplete = () => {
    setShowUserWalkthrough(false)
    localStorage.setItem("way2b1_user_walkthrough_completed", "true")
    localStorage.setItem("way2b1_visited", "true")
    setShowHotspots(true)
    console.log("[v0] User walkthrough completed")
  }

  const handleUserWalkthroughSkip = () => {
    setShowUserWalkthrough(false)
    localStorage.setItem("way2b1_user_walkthrough_completed", "true")
    localStorage.setItem("way2b1_visited", "true")
    setShowHotspots(true)
    console.log("[v0] User walkthrough skipped")
  }

  const handleSurveySubmit = (feedback: { rating: "positive" | "negative"; comment: string }) => {
    console.log("[v0] Feedback submitted:", feedback)
    localStorage.setItem("way2b1_survey_shown", "true")
    localStorage.setItem("way2b1_feedback", JSON.stringify(feedback))
    localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
  }

  const handleSurveyClose = () => {
    setShowSurvey(false)
    localStorage.setItem("way2b1_survey_shown", "true")
    console.log("[v0] Survey closed")
    localStorage.setItem("way2b1_last_survey_prompt", String(Date.now()))
  }

  const handleOpenTutorialCenter = () => {
    setShowTutorialCenter(true)
  }

  const handleStartSpecificTutorial = (tutorialId: string) => {
    setShowTutorialCenter(false)
    setTutorialActive(true)
    console.log("[v0] Starting tutorial:", tutorialId)
  }

  const handleOpenFlowSelector = () => {
    setShowOnboardingTypeSelector(true)
  }

  const handleLogin = (email: string, role: string, position: string, firstName?: string, lastName?: string, phone?: string) => {
    // Зберігаємо дані логіну
    localStorage.setItem("way2b1_logged_in", "true")
    localStorage.setItem("way2b1_user_email", email)
    localStorage.setItem("way2b1_user_role", role)
    localStorage.setItem("way2b1_user_position", position)
    
    // Зберігаємо дані профілю
    if (firstName) localStorage.setItem("way2b1_user_first_name", firstName)
    if (lastName) localStorage.setItem("way2b1_user_last_name", lastName)
    if (phone) localStorage.setItem("way2b1_user_phone", phone)
    
    // Визначаємо flowType на основі ролі
    const isAdmin = role === "family-principal" || role === "operations-manager" || role === "cfo-accountant"
    const flowType = isAdmin ? "admin" : "advisor"
    localStorage.setItem("way2b1_flow_type", flowType)
    setFlowType(flowType)
    setUserRole(role)
    
    setShowLogin(false)
    // Після заповнення профілю - показуємо NextGenWelcome одразу на Home Page
    // Встановлюємо прапорець, що треба показати NextGenWelcome
    localStorage.setItem("way2b1_show_next_gen_welcome", "true")
    // Показуємо NextGenWelcome одразу
    setShowNextGenWelcome(true)
  }

  const handleNextGenWelcomeComplete = () => {
    localStorage.setItem("way2b1_next_gen_welcome_seen", "true")
    setShowNextGenWelcome(false)
    // Після NextGenWelcome показуємо stepper tour
    setTimeout(() => {
      setShowHomepageStepper(true)
    }, 500)
  }

  const handleNextGenWelcomeSkip = () => {
    localStorage.setItem("way2b1_next_gen_welcome_seen", "true")
    setShowNextGenWelcome(false)
    // Після пропуску NextGenWelcome показуємо stepper tour
    setTimeout(() => {
      setShowHomepageStepper(true)
    }, 500)
  }

  const handleHomepageStepperComplete = () => {
    localStorage.setItem("way2b1_homepage_stepper_seen", "true")
    setShowHomepageStepper(false)
    // Після завершення stepper tour показуємо hotspots
    setTimeout(() => {
      setShowHotspots(true)
    }, 300)
  }

  const handleHomepageStepperSkip = () => {
    localStorage.setItem("way2b1_homepage_stepper_seen", "true")
    setShowHomepageStepper(false)
    // Після пропуску stepper tour показуємо hotspots
    setTimeout(() => {
      setShowHotspots(true)
    }, 300)
  }

  // Якщо показуємо логін - не показуємо основний контент
  if (showLogin) {
    return (
      <>
        {showLogin && <LoginWithRole onLogin={handleLogin} />}
      </>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        onStartTutorial={handleStartTutorial} 
        onOpenTutorialCenter={handleOpenTutorialCenter}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto pb-6 pt-0 flex flex-col">
          <Dashboard />
        </main>
      </div>


      {showOnboardingTypeSelector && (
        <OnboardingTypeSelector
          onSelectType={handleOnboardingTypeSelect}
          onClose={() => setShowOnboardingTypeSelector(false)}
        />
      )}

      {showUserWalkthrough && (
        <UserHomePageWalkthrough
          onComplete={handleUserWalkthroughComplete}
          onSkip={handleUserWalkthroughSkip}
        />
      )}

      {showRoleSelector && <RoleSelector onComplete={handleRoleComplete} />}

      {showNextGenWelcome && (
        <NextGenWelcome 
          onComplete={handleNextGenWelcomeComplete} 
          onSkip={handleNextGenWelcomeSkip} 
        />
      )}

      {showHomepageStepper && (
        <HomepageStepperTour 
          onComplete={handleHomepageStepperComplete} 
          onSkip={handleHomepageStepperSkip} 
        />
      )}

      {tutorialActive && <TutorialOverlay onEnd={handleEndTutorial} />}
      {showHotspots && <Hotspots />}
      {showSurvey && <FeedbackSurvey onClose={handleSurveyClose} onSubmit={handleSurveySubmit} />}

      {showTutorialCenter && (
        <TutorialCenter onClose={() => setShowTutorialCenter(false)} onStartTutorial={handleStartSpecificTutorial} />
      )}

      {milestone && <MilestoneCelebration milestone={milestone} onClose={() => setMilestone(null)} />}

      {showCompletionModal && (
        <ModuleCompletionModal
          show={true}
          onClose={() => setShowCompletionModal(null)}
          moduleId={showCompletionModal.moduleId}
          moduleTitle={showCompletionModal.moduleTitle}
          nextModuleId={showCompletionModal.nextModuleId}
          nextModuleTitle={showCompletionModal.nextModuleTitle}
          nextModuleRoute={showCompletionModal.nextModuleRoute}
        />
      )}

      <AIAssistantButton />

      {/* Learn by Doing Feedback */}
      {showLearnFeedback && (
        <LearnByDoingFeedback
          show={true}
          onClose={() => setShowLearnFeedback(null)}
          actionType={showLearnFeedback.actionType || "task"}
          isFirstAction={showLearnFeedback.isFirstAction || false}
        />
      )}
    </div>
  )
}
