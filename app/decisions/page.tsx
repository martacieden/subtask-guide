"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { CategoryWizard } from "@/components/category-wizard"
import { FlowStartModal } from "@/components/flow-start-modal"
import { GuidedTour } from "@/components/guided-tour"
import { LearnByDoingFeedback } from "@/components/learn-by-doing-feedback"
import { DecisionsEmptyState } from "@/components/decisions-empty-state"
import { CategoryWalkthrough } from "@/components/category-walkthrough"
import { CategoryAhaMoment } from "@/components/category-aha-moment"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  X,
  ChevronDown,
  Workflow,
  Users,
  FileText,
  DollarSign,
  Briefcase,
  Scale,
  Utensils,
  UtensilsCrossed,
  UserCircle,
  UserCheck,
  Calculator,
  Calendar,
  Plane,
  Folder,
  Columns3,
  Share2,
  ChevronRight,
} from "lucide-react"

// Icon mapping for categories
const iconMap: Record<string, any> = {
  Folder: Folder,
  FileText: FileText,
  Users: Users,
  Calendar: Calendar,
  DollarSign: DollarSign,
  Scale: Scale,
  Plane: Plane,
  UtensilsCrossed: Utensils,
  UserCheck: UserCircle,
  Calculator: Calculator,
}

export default function DecisionsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number; icon: any }>>([])
  const [walkthroughStep, setWalkthroughStep] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCategoryWizard, setShowCategoryWizard] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [decisionName, setDecisionName] = useState("")
  const [prefilledCategory, setPrefilledCategory] = useState<string | null>(null)
  const [showCategoryIntro, setShowCategoryIntro] = useState(false)
  const [showCategoryTour, setShowCategoryTour] = useState(false)
  const newCategoryBtnRef = useRef<HTMLButtonElement | null>(null)
  const [showCategoryWalkthrough, setShowCategoryWalkthrough] = useState(false)
  const [showAhaMoment, setShowAhaMoment] = useState(false)

  // Load categories from localStorage on mount and when updated
  useEffect(() => {
    const loadCategories = () => {
      try {
        const savedCategories = localStorage.getItem("way2b1_categories")
        if (savedCategories) {
          const parsed = JSON.parse(savedCategories)
          const loaded = parsed.map((cat: any) => ({
            ...cat,
            icon: iconMap[cat.iconName] || Folder,
          }))
          setCategories(loaded)
        }
      } catch (e) {
        console.error("Failed to load categories", e)
      }
    }
    loadCategories()

    // Listen for category updates
    const handleCategoriesUpdate = () => {
      loadCategories()
    }
    window.addEventListener("categoriesUpdated", handleCategoriesUpdate)
    return () => {
      window.removeEventListener("categoriesUpdated", handleCategoriesUpdate)
    }
  }, [])

  useEffect(() => {
    const activeModule = localStorage.getItem("way2b1_active_module")
    if (activeModule === "first-decision") {
      setWalkthroughStep(1)
    }
    // Check if we need to show Category Hotspot (from checklist)
    const shouldHighlight = localStorage.getItem("way2b1_highlight_new_category") === "true"
    if (shouldHighlight) {
      localStorage.removeItem("way2b1_highlight_new_category")
      // Remove category flow flag if it exists to prevent showing FlowStartModal
      localStorage.removeItem("way2b1_start_category_flow")
      // Show walkthrough after a short delay to ensure page is loaded
      setTimeout(() => {
        setShowCategoryWalkthrough(true)
        // Auto-scroll to button after a short delay
        setTimeout(() => {
          newCategoryBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 500)
      }, 500)
      return
    }
    
    // Legacy flow - only show FlowStartModal if not coming from checklist
    const shouldStart = localStorage.getItem("way2b1_start_category_flow")
    if (shouldStart) {
      setShowCategoryIntro(true)
      localStorage.removeItem("way2b1_start_category_flow")
    }
  }, [])

  const handleCreateClick = () => {
    setShowCreateModal(true)
  }

  const handleNewCategory = () => {
    setShowCategoryWizard(true)
    // Keep walkthrough open when wizard opens
    // Walkthrough will handle navigation between steps inside wizard
  }

  const [showFeedback, setShowFeedback] = useState(false)
  const [isFirstDecision, setIsFirstDecision] = useState(false)

  const handleSubmitDecision = () => {
    setShowCreateModal(false)
    
    // Перевіряємо, чи це перший decision
    const hasCreatedDecision = localStorage.getItem("way2b1_first_decision_created") === "true"
    const isFirst = !hasCreatedDecision
    
    if (isFirst) {
      localStorage.setItem("way2b1_first_decision_created", "true")
      setIsFirstDecision(true)
      setShowFeedback(true)
      
      // Створюємо приклади задач у чергу користувача
      createExampleTasks()
    } else {
      setShowToast(true)
    }

    // Mark module as complete
    const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
    progress["first-decision"] = true
    localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
    localStorage.removeItem("way2b1_active_module")

    // Dispatch event to update progress badge
    window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))

    // Redirect back to dashboard after showing feedback
    if (isFirst) {
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } else {
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  }

  const createExampleTasks = () => {
    // Створюємо приклади задач для навчання з підказками
    const exampleTasks = [
      {
        id: `task-${Date.now()}-1`,
        title: "Rename your workspace",
        description: "Give your workspace a meaningful name",
        hint: "Click on your workspace name in the top-left corner to edit it. Choose a name that reflects your organization or family office.",
        steps: ["Find workspace name", "Click to edit", "Enter new name", "Save changes"],
        status: "pending",
        priority: "medium",
        createdAt: new Date().toISOString(),
      },
      {
        id: `task-${Date.now()}-2`,
        title: "Assign your first decision",
        description: "Learn how to assign decisions to team members",
        hint: "Open any decision and look for the 'Assign' button. You can assign decisions to specific team members for review or action.",
        steps: ["Open a decision", "Click 'Assign'", "Select team member", "Add note (optional)", "Send assignment"],
        videoUrl: "/videos/assign-decision.mp4",
        status: "pending",
        priority: "medium",
        createdAt: new Date().toISOString(),
      },
    ]

    // Зберігаємо задачі в localStorage
    const existingTasks = JSON.parse(localStorage.getItem("way2b1_example_tasks") || "[]")
    const allTasks = [...existingTasks, ...exampleTasks]
    localStorage.setItem("way2b1_example_tasks", JSON.stringify(allTasks))
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Left Sidebar - Categories */}
            <div className="w-72 border-r border-border bg-card p-4">
              <div className="space-y-1">
                {/* Always show "All decisions" tab */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4" />
                    <span>All decisions</span>
                  </div>
                  <span className={`text-xs ${selectedCategory === null ? "text-primary" : "text-muted-foreground"}`}>
                    0
                  </span>
                </button>

                {/* Show categories if they exist */}
                {categories.length > 0 && (
                  <>
                {categories.map((category) => {
                  const Icon = category.icon
                  const isSelected = selectedCategory === category.id
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        isSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                      <span className={`text-xs ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                        {category.count}
                      </span>
                    </button>
                  )
                })}
                  </>
                )}
              </div>
              
              <button 
                id="btn-new-category"
                ref={newCategoryBtnRef} 
                onClick={() => {
                  // Don't close walkthrough - it will auto-advance after modal opens
                  handleNewCategory()
                }} 
                className="w-full flex items-center gap-2 px-3 py-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New category</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Top Bar */}
              <div className="border-b border-border bg-card px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Filter className="w-4 h-4" />
                      Filters
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Columns3 className="w-4 h-4" />
                      12/28 columns
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Search className="w-4 h-4" />
                      Search
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <div className="relative">
                      {walkthroughStep === 1 && (
                        <>
                          <div className="absolute -inset-2 bg-blue-500/20 rounded-lg animate-ping" />
                          <div className="absolute -inset-2 bg-blue-500/30 rounded-lg" />

                          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-8 w-80 bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl z-10">
                            <div className="font-semibold text-white mb-2">Step 1: Create Your First Decision</div>
                            <div className="text-gray-300 leading-relaxed">
                              Click the "New decision" button to open the decision creation form. Fill in the details
                              and submit to complete this onboarding step.
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-gray-900 rotate-45" />
                          </div>
                        </>
                      )}
                      <button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 bg-[#4F7CFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4F7CFF]/90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        New decision
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="border-b border-border bg-secondary/30 px-6 py-3">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
                  <div className="col-span-1 flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" />
                    ID
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    Name
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    Status
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    Steps
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                  <div className="col-span-2">Current step</div>
                  <div className="col-span-2">Approver</div>
                  <div className="col-span-1 flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" />
                    Due
                  </div>
                </div>
              </div>

              {/* Empty State */}
              <DecisionsEmptyState onCreateDecision={handleCreateClick} />

              {/* Footer */}
              <div className="border-t border-border bg-card px-6 py-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Rows: 0</span>
                  <span>Filtered: 0</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Category Walkthrough - works both on page and inside wizard modal */}
      {showCategoryWalkthrough && (
        <CategoryWalkthrough
          onClose={() => {
            setShowCategoryWalkthrough(false)
          }}
          onComplete={() => {
            setShowCategoryWalkthrough(false)
          }}
        />
      )}

      {/* Category Wizard */}
      {showCategoryWizard && (
        <CategoryWizard
          onClose={() => {
            setShowCategoryWizard(false)
            setShowCategoryWalkthrough(false)
          }}
          onComplete={(cat) => {
            setShowCategoryWizard(false)
            setShowCategoryWalkthrough(false)
            setPrefilledCategory(cat.name)
            // Reload categories to show the new one
            const loadCategories = () => {
              try {
                const savedCategories = localStorage.getItem("way2b1_categories")
                if (savedCategories) {
                  const parsed = JSON.parse(savedCategories)
                  const loaded = parsed.map((c: any) => ({
                    ...c,
                    icon: iconMap[c.iconName] || Folder,
                  }))
                  setCategories(loaded)
                }
              } catch (e) {
                console.error("Failed to load categories", e)
              }
            }
            loadCategories()
            
            // Wait for progress update to propagate, then show AHA moment
            // This ensures the progress bar and badge are updated before showing the modal
            setTimeout(() => {
              setShowAhaMoment(true)
            }, 800)
          }}
        />
      )}

      {/* AHA Moment - shows after category creation */}
      {showAhaMoment && (
        <CategoryAhaMoment
          show={true}
          onClose={() => {
            setShowAhaMoment(false)
            // Only navigate to dashboard if not navigating to next step
            // Check if we're navigating to next step (flag set in handleNextStep)
            const isNavigatingToNextStep = localStorage.getItem("way2b1_active_module") === "create-teams" && 
                                          localStorage.getItem("way2b1_start_team_walkthrough") === "true"
            if (!isNavigatingToNextStep) {
              // Only navigate to dashboard if not going to teams
              setTimeout(() => {
                router.push("/")
              }, 100)
            }
          }}
          onNext={() => {
            // Flag will be set in handleNextStep before this is called
          }}
        />
      )}

      {showCategoryIntro && (
        <FlowStartModal
          title="Create a category"
          description="You’re about to set up a new category. We’ll guide you through the key steps: details, capsules and workflow."
          onStart={() => {
            setShowCategoryIntro(false)
            setShowCategoryTour(true)
          }}
          onSkip={() => setShowCategoryIntro(false)}
        />
      )}

      {showCategoryTour && (
        <GuidedTour
          steps={[
            {
              id: "new-category",
              getTarget: () => newCategoryBtnRef.current,
              content: (
                <div>
                  Click here to create your first category. This will open the category form.
                </div>
              ),
            },
          ]}
          open={true}
          initialStep={0}
          onClose={() => {
            setShowCategoryTour(false)
            setShowCategoryWizard(true)
          }}
        />
      )}

      {/* Create Decision Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex relative">
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-semibold text-gray-900">Create new decision</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Breadcrumb & Share */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Decisions</span>
                  <span>/</span>
                  <span>New decision</span>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Decision Name */}
              <div className="px-6 py-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter decision name"
                    value={decisionName}
                    onChange={(e) => setDecisionName(e.target.value)}
                    className="flex-1 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Details Section */}
              <div className="px-6 py-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Organization <span className="text-red-500">*</span>
                      </label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Select organization
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Workspace <span className="text-red-500">*</span>
                      </label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Select workspace
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 border border-gray-300 rounded-lg bg-white">
                        {prefilledCategory || "Select category"}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Project</label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Select project
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Due date</label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Select date
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Priority</label>
                      <button className="w-full px-3 py-2 text-left text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Select priority
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <textarea
                    placeholder="Start typing..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Save as draft
                  </button>
                  <button
                    onClick={handleSubmitDecision}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4F7CFF] rounded-lg hover:bg-[#4F7CFF]/90 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Add to decision</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  Attachment
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4" />
                  Linked to
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  <Workflow className="w-4 h-4" />
                  Tasks
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  <DollarSign className="w-4 h-4" />
                  Amount
                </button>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Workflow</h3>
                  <button className="p-0.5 hover:bg-white rounded transition-colors">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeWidth="2" d="M12 16v-4m0-4h.01" />
                    </svg>
                  </button>
                </div>
                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span>Preview workflow</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-xl">🎉</span>
          </div>
          <div>
            <div className="font-semibold text-emerald-700">Decision created!</div>
            <div className="text-sm text-foreground">Your progress has been updated</div>
          </div>
        </div>
      )}

      {/* Learn by Doing Feedback */}
      {showFeedback && (
        <LearnByDoingFeedback
          show={showFeedback}
          onClose={() => setShowFeedback(false)}
          actionType="decision"
          isFirstAction={isFirstDecision}
        />
      )}
    </div>
  )
}
