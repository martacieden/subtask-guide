"use client"

import { useEffect, useRef, useState } from "react"
import { X, ChevronRight, ChevronLeft, ChevronDown, Folder, FileText, Users, Calendar, DollarSign, Scale, Plane, UtensilsCrossed, UserCheck, Calculator, Settings, Paperclip, Percent } from "lucide-react"

type CategoryDraft = {
  name: string
  type: string
  description?: string
  parent?: string
  permission: "view" | "manage"
  selectedIcon: string
  capsules: { id: string; enabled: boolean }[]
  trackAmountsSettings?: string
  noBudgetSubOption?: string
  workflowOption: string
  selectedWorkflow?: string
  adHocApproverScope?: string
}

const iconOptions = [
  { name: 'Folder', icon: Folder },
  { name: 'FileText', icon: FileText },
  { name: 'Users', icon: Users },
  { name: 'Calendar', icon: Calendar },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Scale', icon: Scale },
  { name: 'Plane', icon: Plane },
  { name: 'UtensilsCrossed', icon: UtensilsCrossed },
  { name: 'UserCheck', icon: UserCheck },
  { name: 'Calculator', icon: Calculator }
]

export function CategoryWizard({ onClose, onComplete }: { onClose: () => void; onComplete: (category: { name: string }) => void }) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<CategoryDraft>({
    name: "",
    type: "Decisions and tasks",
    description: "",
    parent: "",
    permission: "view",
    selectedIcon: "Folder",
    capsules: [
      { id: "amounts", enabled: false },
      { id: "attachments", enabled: false },
      { id: "linked", enabled: false },
      { id: "themes", enabled: false },
    ],
    workflowOption: "default",
    noBudgetSubOption: "track-amounts-only",
    adHocApproverScope: "any-member",
  })
  
  const [showIconDropdown, setShowIconDropdown] = useState(false)
  const [showTrackAmountsSettings, setShowTrackAmountsSettings] = useState(false)
  const iconDropdownRef = useRef<HTMLDivElement>(null)

  // Refs for walkthrough
  const nameRef = useRef<HTMLInputElement | null>(null)
  const nextBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconDropdownRef.current && !iconDropdownRef.current.contains(event.target as Node)) {
        setShowIconDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Listen for walkthrough sync events
  useEffect(() => {
    const handleGotoStep = (event: CustomEvent) => {
      const targetStep = event.detail?.step
      if (targetStep && targetStep >= 1 && targetStep <= 5) {
        setStep(targetStep)
      }
    }

    window.addEventListener("category-wizard-goto-step", handleGotoStep as EventListener)
    return () => {
      window.removeEventListener("category-wizard-goto-step", handleGotoStep as EventListener)
    }
  }, [])

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.name === iconName)
    return iconOption ? iconOption.icon : Folder
  }

  const canContinue = () => {
    if (step === 1) return draft.name.trim().length > 0 && draft.type.length > 0
    return true
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
      return
    }
    if (step === 2) {
      setStep(3)
      return
    }
    if (step === 3) {
      setStep(4)
      return
    }
    if (step === 4) {
      setStep(5)
      return
    }
    if (step === 5) {
      // Final step - Create category and mark module as complete
      try {
        const categoryData = {
          id: `category-${Date.now()}`,
          name: draft.name,
          iconName: draft.selectedIcon,
          count: 0,
        }
        
        // Save to localStorage
        localStorage.setItem("way2b1_new_category", JSON.stringify(categoryData))
        
        // Load existing categories and add new one
        const existingCategories = JSON.parse(localStorage.getItem("way2b1_categories") || "[]")
        existingCategories.push(categoryData)
        localStorage.setItem("way2b1_categories", JSON.stringify(existingCategories))
        
        // Mark setup-domains module as complete
        const progress = JSON.parse(localStorage.getItem("way2b1_module_progress") || "{}")
        progress["setup-domains"] = true
        localStorage.setItem("way2b1_module_progress", JSON.stringify(progress))
        window.dispatchEvent(new CustomEvent("onboardingProgressUpdate"))
        
        // Dispatch event to update categories list
        window.dispatchEvent(new CustomEvent("categoriesUpdated"))
        
        onComplete({ name: draft.name, id: categoryData.id, iconName: draft.selectedIcon })
      } catch {}
    }
  }

  const steps = [
    { number: 1, title: "Enter category details", active: step === 1, completed: step > 1 },
    { number: 2, title: "Select category capsules", active: step === 2, completed: step > 2 },
    { number: 3, title: "Set up custom fields", active: step === 3, completed: step > 3 },
    { number: 4, title: "Workflow configuration", active: step === 4, completed: step > 4 },
    { number: 5, title: "Preview", active: step === 5, completed: false },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-2xl w-[728px] h-[704px] max-h-[704px] min-w-[728px] max-w-[728px] flex flex-col overflow-hidden"
        style={{
          boxShadow: "0px 16px 36px -20px rgba(0, 6, 46, 0.20), 0px 16px 64px 0px rgba(0, 0, 85, 0.02), 0px 12px 60px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-4 gap-2">
          <h2 className="text-[16px] font-bold text-gray-900 flex-1">Create new category</h2>
          <button className="w-6 h-6 flex items-center justify-center" onClick={onClose}>
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Progress Container */}
        <div className="flex border-t border-b border-gray-200 mt-4 overflow-hidden flex-1">
          {/* Sidebar */}
          <div className="w-[200px] border-r border-gray-200 px-5 py-4 flex flex-col justify-start">
            <div className="flex flex-col gap-px">
              {steps.map((s, index) => (
                <div key={s.number}>
                  <div className="flex items-center gap-3 h-10">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 ${
                        s.active
                          ? "bg-blue-600 border-blue-600 text-white"
                          : s.completed
                          ? "bg-white border-blue-600 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500"
                      }`}
                    >
                      {s.number}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`text-[13px] font-medium ${s.active || s.completed ? "text-blue-600" : "text-gray-500"}`}
                      >
                        {s.title}
                      </span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex justify-start ml-3">
                      <div className="w-px h-6 bg-gray-300"></div>
                    </div>
                  )}
              </div>
            ))}
          </div>
            </div>

          {/* Main Content */}
          <div className="flex-1 px-8 py-8 flex flex-col overflow-y-auto overflow-x-hidden" style={{ width: "calc(728px - 200px)" }}>
              {step === 1 && (
              <div className="space-y-6" id="category-wizard-step-1">
                  <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter category details</h3>
                  <p className="text-[16px] text-gray-500 leading-relaxed">Enter a name and select the appropriate category type.</p>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                    Name
                    <span className="text-red-500 font-semibold">*</span>
                  </label>
                  <div className="flex items-stretch gap-1">
                    <div className="relative" ref={iconDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowIconDropdown(!showIconDropdown)}
                        className="w-10 h-10 border border-gray-300 rounded-lg bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
                      >
                        {(() => {
                          const Icon = getIconComponent(draft.selectedIcon)
                          return <Icon className="w-4 h-4 text-gray-600" />
                        })()}
                      </button>
                      {showIconDropdown && (
                        <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                          <div className="grid grid-cols-5 gap-1 p-2">
                            {iconOptions.map((option) => {
                              const Icon = option.icon
                              return (
                                <button
                                  key={option.name}
                                  type="button"
                                  onClick={() => {
                                    setDraft({ ...draft, selectedIcon: option.name })
                                    setShowIconDropdown(false)
                                  }}
                                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors ${
                                    draft.selectedIcon === option.name ? "bg-blue-100 text-blue-600" : "text-gray-600"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      id="category-wizard-name-input"
                      type="text"
                      placeholder="Enter category name..."
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ref={nameRef}
                    />
                  </div>
                </div>

                {/* Category Type Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                    Category type
                    <span className="text-red-500 font-semibold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category-wizard-type-select"
                      value={draft.type}
                      onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                      className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg text-[13px] text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Decisions and tasks">Decisions and tasks</option>
                      <option value="Decisions">Decisions</option>
                      <option value="Tasks">Tasks</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[12px] text-gray-500 leading-relaxed">Choose where this category will appear.</p>
                </div>

                {/* Parent Category Field */}
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-gray-900">Make this a subcategory of</label>
                  <div className="relative">
                    <select
                      value={draft.parent}
                      onChange={(e) => setDraft({ ...draft, parent: e.target.value })}
                      className={`w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        draft.parent ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      <option value="" disabled>
                        Choose a parent category (optional)
                      </option>
                      <option value="Philanthropy">Philanthropy</option>
                      <option value="Investment">Investment</option>
                      <option value="Legal">Legal</option>
                      <option value="Travel">Travel</option>
                      <option value="Food">Food</option>
                      <option value="HR">HR</option>
                      <option value="Accounting">Accounting</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-[12px] text-gray-500 leading-relaxed">Leave empty for a main category, or select a parent to group it under.</p>
                </div>

                {/* Permissions Section */}
                <div className="space-y-3">
                  <label className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                    How can organization members use this category?
                    <span className="text-red-500 font-semibold">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="permission"
                        value="view"
                        checked={draft.permission === "view"}
                        onChange={(e) => setDraft({ ...draft, permission: e.target.value as "view" | "manage" })}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-[13px] text-gray-900 leading-relaxed">View content only</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="permission"
                        value="manage"
                        checked={draft.permission === "manage"}
                        onChange={(e) => setDraft({ ...draft, permission: e.target.value as "view" | "manage" })}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-[13px] text-gray-900 leading-relaxed">Create and manage content</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3" id="category-wizard-step-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select category capsules</h3>
                  <p className="text-[16px] text-gray-500 leading-relaxed">
                    Choose the information users must provide when creating new items in this category.
                  </p>
                </div>

                <h4 className="text-[14px] font-semibold text-gray-900">Click to select:</h4>

                <div id="category-wizard-capsules" className="space-y-3">
                  {/* Track amounts & budgets */}
                  <div
                    className={`border rounded-xl p-4 bg-white cursor-pointer transition-colors ${
                      draft.capsules.find((c) => c.id === "amounts")?.enabled ? "border-blue-500" : "border-gray-200"
                    }`}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        capsules: draft.capsules.map((c) => (c.id === "amounts" ? { ...c, enabled: !c.enabled } : c)),
                      })
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 pr-4">
                        <h5 className="text-[14px] font-semibold text-gray-900 mb-1">Track amounts & budgets</h5>
                        <p className="text-[14px] text-gray-600 leading-relaxed">
                          Requires users to enter monetary values with budget tracking options
                        </p>
                      </div>
                      <button
                        className="px-2 py-1 text-[12px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowTrackAmountsSettings(!showTrackAmountsSettings)
                        }}
                      >
                        {showTrackAmountsSettings ? "hide" : "show"}
                      </button>
                      <div className="flex items-center">
                        <div
                          className={`relative inline-block w-11 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                            draft.capsules.find((c) => c.id === "amounts")?.enabled ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                              draft.capsules.find((c) => c.id === "amounts")?.enabled ? "translate-x-5" : "translate-x-0.5"
                            } mt-0.5`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {showTrackAmountsSettings && draft.capsules.find((c) => c.id === "amounts")?.enabled && (
                      <div className="mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                        <h6 className="text-[14px] font-semibold text-gray-900 mb-4">
                          What should happen when this decision is approved?
                        </h6>
                        <div className="space-y-4">
                  <div>
                            <label className="flex items-start gap-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    draft.trackAmountsSettings === "no-budget-impact"
                                      ? "border-blue-600 bg-white"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {draft.trackAmountsSettings === "no-budget-impact" && (
                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="radio"
                                  name="trackAmountsSettings"
                                  value="no-budget-impact"
                                  checked={draft.trackAmountsSettings === "no-budget-impact"}
                                  onChange={(e) => setDraft({ ...draft, trackAmountsSettings: e.target.value })}
                                  className="sr-only"
                                />
                                <div className="text-[14px] text-gray-900 font-medium">No budget impact (tracking only)</div>
                                <div className="text-[14px] text-gray-600">
                                  Decision amounts are tracked without affecting budgets
                                </div>
                              </div>
                            </label>

                            {/* Sub-options for No budget impact */}
                            {draft.trackAmountsSettings === "no-budget-impact" && (
                              <div className="ml-8 mt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                                <label className="flex items-start gap-3 cursor-pointer">
                                  <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        draft.noBudgetSubOption === "track-amounts-only"
                                          ? "border-blue-600 bg-white"
                                          : "border-gray-300 bg-white"
                                      }`}
                                    >
                                      {draft.noBudgetSubOption === "track-amounts-only" && (
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      type="radio"
                                      name="noBudgetSubOption"
                                      value="track-amounts-only"
                                      checked={draft.noBudgetSubOption === "track-amounts-only"}
                                      onChange={(e) => setDraft({ ...draft, noBudgetSubOption: e.target.value })}
                                      className="sr-only"
                                    />
                                    <div className="text-[14px] text-gray-900 font-medium">Track amounts only</div>
                                  </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                  <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        draft.noBudgetSubOption === "track-with-categories"
                                          ? "border-blue-600 bg-white"
                                          : "border-gray-300 bg-white"
                                      }`}
                                    >
                                      {draft.noBudgetSubOption === "track-with-categories" && (
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      type="radio"
                                      name="noBudgetSubOption"
                                      value="track-with-categories"
                                      checked={draft.noBudgetSubOption === "track-with-categories"}
                                      onChange={(e) => setDraft({ ...draft, noBudgetSubOption: e.target.value })}
                                      className="sr-only"
                                    />
                                    <div className="text-[14px] text-gray-900 font-medium">Track amounts with categories</div>
                                  </div>
                                </label>

                                {/* Dropdown for Track amounts with categories */}
                                {draft.noBudgetSubOption === "track-with-categories" && (
                                  <div className="ml-8 mt-3">
                                    <div className="relative">
                                      <select
                                        className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg text-[13px] text-gray-400 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      >
                                        <option value="">Select object category with accounting categories</option>
                                        <option value="office-expenses">Office Expenses</option>
                                        <option value="marketing-advertising">Marketing & Advertising</option>
                                        <option value="travel-entertainment">Travel & Entertainment</option>
                                        <option value="professional-services">Professional Services</option>
                                      </select>
                                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <label className="flex items-start gap-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  draft.trackAmountsSettings === "create-budget"
                                    ? "border-blue-600 bg-white"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {draft.trackAmountsSettings === "create-budget" && (
                                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <input
                                type="radio"
                                name="trackAmountsSettings"
                                value="create-budget"
                                checked={draft.trackAmountsSettings === "create-budget"}
                                onChange={(e) => setDraft({ ...draft, trackAmountsSettings: e.target.value })}
                                className="sr-only"
                              />
                              <div className="text-[14px] text-gray-900 font-medium">Create new budget</div>
                              <div className="text-[14px] text-gray-600">Upon approval, a new budget is created</div>
                            </div>
                      </label>
                          <label className="flex items-start gap-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  draft.trackAmountsSettings === "spend-from-budget"
                                    ? "border-blue-600 bg-white"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {draft.trackAmountsSettings === "spend-from-budget" && (
                                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <input
                                type="radio"
                                name="trackAmountsSettings"
                                value="spend-from-budget"
                                checked={draft.trackAmountsSettings === "spend-from-budget"}
                                onChange={(e) => setDraft({ ...draft, trackAmountsSettings: e.target.value })}
                                className="sr-only"
                              />
                              <div className="text-[14px] text-gray-900 font-medium">Spend from existing budget</div>
                              <div className="text-[14px] text-gray-600">Upon approval, amount deducted from selected budget</div>
                            </div>
                      </label>

                          {/* Dropdown for Spend from existing budget */}
                          {draft.trackAmountsSettings === "spend-from-budget" && (
                            <div className="ml-8 mt-3">
                              <div className="relative">
                                <select
                                  className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg text-[13px] text-gray-400 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select object category with accounting categories</option>
                                  <option value="office-expenses">Office Expenses</option>
                                  <option value="marketing-advertising">Marketing & Advertising</option>
                                  <option value="travel-entertainment">Travel & Entertainment</option>
                                  <option value="professional-services">Professional Services</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload attachments */}
                  <div
                    className={`border rounded-xl p-4 bg-white cursor-pointer transition-colors ${
                      draft.capsules.find((c) => c.id === "attachments")?.enabled ? "border-blue-500" : "border-gray-200"
                    }`}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        capsules: draft.capsules.map((c) => (c.id === "attachments" ? { ...c, enabled: !c.enabled } : c)),
                      })
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Paperclip className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 pr-4">
                        <h5 className="text-[14px] font-semibold text-gray-900 mb-1">Upload attachments</h5>
                        <p className="text-[14px] text-gray-600 leading-relaxed">
                          Require users to attach files from their computer or cloud drives
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`relative inline-block w-11 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                            draft.capsules.find((c) => c.id === "attachments")?.enabled ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                              draft.capsules.find((c) => c.id === "attachments")?.enabled ? "translate-x-5" : "translate-x-0.5"
                            } mt-0.5`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Link related items */}
                  <div
                    className={`border rounded-xl p-4 bg-white cursor-pointer transition-colors ${
                      draft.capsules.find((c) => c.id === "linked")?.enabled ? "border-blue-500" : "border-gray-200"
                    }`}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        capsules: draft.capsules.map((c) => (c.id === "linked" ? { ...c, enabled: !c.enabled } : c)),
                      })
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 pr-4">
                        <h5 className="text-[14px] font-semibold text-gray-900 mb-1">Link related items</h5>
                        <p className="text-[14px] text-gray-600 leading-relaxed">
                          Require users to link to other decisions, tasks, etc
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`relative inline-block w-11 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                            draft.capsules.find((c) => c.id === "linked")?.enabled ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                              draft.capsules.find((c) => c.id === "linked")?.enabled ? "translate-x-5" : "translate-x-0.5"
                            } mt-0.5`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Organize by themes */}
                  <div
                    className={`border rounded-xl p-4 bg-white cursor-pointer transition-colors ${
                      draft.capsules.find((c) => c.id === "themes")?.enabled ? "border-blue-500" : "border-gray-200"
                    }`}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        capsules: draft.capsules.map((c) => (c.id === "themes" ? { ...c, enabled: !c.enabled } : c)),
                      })
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Percent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 pr-4">
                        <h5 className="text-[14px] font-semibold text-gray-900 mb-1">Organize by themes</h5>
                        <p className="text-[14px] text-gray-600 leading-relaxed">
                          Require users to categorize items using themes and sub-themes
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`relative inline-block w-11 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                            draft.capsules.find((c) => c.id === "themes")?.enabled ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                              draft.capsules.find((c) => c.id === "themes")?.enabled ? "translate-x-5" : "translate-x-0.5"
                            } mt-0.5`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )}

              {step === 3 && (
              <div className="space-y-3" id="category-wizard-step-3">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Set up custom fields</h3>
                  <span className="px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-gray-100 rounded">Optional</span>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  Add custom fields to capture more context for items in this category. You can create multiple custom
                  sections, add relevant fields to each one, and organize information in a clear hierarchy.
                </p>

                <div id="category-wizard-custom-fields" className="space-y-3">
                  <div className="border border-gray-200 rounded-xl p-4 bg-white">
                    <div className="space-y-1 mb-4">
                      <label className="text-[12px] font-medium text-gray-900">Section title</label>
                      <input
                        type="text"
                        placeholder="Enter section title..."
                        className="w-full h-8 px-2 border border-gray-300 rounded-md text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-start gap-2 mb-4">
                      <div className="w-4 h-4 mt-0.5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 16 16">
                          <path
                            fillRule="evenodd"
                            d="M8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25ZM2.75 8C2.75 5.10051 5.10051 2.75 8 2.75C10.8995 2.75 13.25 5.10051 13.25 8C13.25 10.8995 10.8995 13.25 8 13.25C5.10051 13.25 2.75 10.8995 2.75 8ZM8 5.25C8.41421 5.25 8.75 5.58579 8.75 6C8.75 6.41421 8.41421 6.75 8 6.75C7.58579 6.75 7.25 6.41421 7.25 6C7.25 5.58579 7.58579 5.25 8 5.25ZM7.25 8C7.25 7.58579 7.58579 7.25 8 7.25C8.41421 7.25 8.75 7.58579 8.75 8V11C8.75 11.4142 8.41421 11.75 8 11.75C7.58579 11.75 7.25 11.4142 7.25 11V8Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        Add at least one custom field to save these custom details. You can also add subtitles to create
                        subsections within this section.
                      </p>
                    </div>
                    <div className="h-px bg-gray-200 mb-3"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
                            <path
                              fillRule="evenodd"
                              d="M8 2C8.41421 2 8.75 2.33579 8.75 2.75V7.25H13.25C13.6642 7.25 14 7.58579 14 8C14 8.41421 13.6642 8.75 13.25 8.75H8.75V13.25C8.75 13.6642 8.41421 14 8 14C7.58579 14 7.25 13.6642 7.25 13.25V8.75H2.75C2.33579 8.75 2 8.41421 2 8C2 7.58579 2.33579 7.25 2.75 7.25H7.25V2.75C7.25 2.33579 7.58579 2 8 2Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-[12px] font-semibold text-gray-900">New field</span>
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
                            <path
                              fillRule="evenodd"
                              d="M8 2C8.41421 2 8.75 2.33579 8.75 2.75V7.25H13.25C13.6642 7.25 14 7.58579 14 8C14 8.41421 13.6642 8.75 13.25 8.75H8.75V13.25C8.75 13.6642 8.41421 14 8 14C7.58579 14 7.25 13.6642 7.25 13.25V8.75H2.75C2.33579 8.75 2 8.41421 2 8C2 7.58579 2.33579 7.25 2.75 7.25H7.25V2.75C7.25 2.33579 7.58579 2 8 2Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-[12px] font-semibold text-gray-900">New group name</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors w-fit">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
                      <path
                        fillRule="evenodd"
                        d="M8 2C8.41421 2 8.75 2.33579 8.75 2.75V7.25H13.25C13.6642 7.25 14 7.58579 14 8C14 8.41421 13.6642 8.75 13.25 8.75H8.75V13.25C8.75 13.6642 8.41421 14 8 14C7.58579 14 7.25 13.6642 7.25 13.25V8.75H2.75C2.33579 8.75 2 8.41421 2 8C2 7.58579 2.33579 7.25 2.75 7.25H7.25V2.75C7.25 2.33579 7.58579 2 8 2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-[12px] font-semibold text-gray-900">New section</span>
                  </button>
                </div>
              </div>
              )}

              {step === 4 && (
              <div className="space-y-4" id="category-wizard-step-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Workflow configuration</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    Configure the approval workflow for items in this category.
                  </p>
                </div>

                <div id="category-wizard-workflow" className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="workflowOption"
                      value="default"
                      checked={draft.workflowOption === "default"}
                      onChange={(e) => setDraft({ ...draft, workflowOption: e.target.value })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-gray-900 mb-1">Use default workflow</div>
                      <div className="text-[13px] text-gray-600 mb-3">Standard approval process for this category type</div>
                      {draft.workflowOption === "default" && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center gap-0">
                            {/* Step 1 */}
                            <div className="flex flex-col items-start gap-2">
                              <div className="flex items-center gap-3">
                                <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 14 14">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.23077 1.75C4.15482 1.75 4.07504 1.78121 4.01097 1.84811C3.94585 1.91613 3.90385 2.01505 3.90385 2.12466V2.68699C3.90385 3.47222 3.60546 4.23148 3.0647 4.79621C2.70056 5.1765 2.24601 5.44766 1.75 5.58462V8.3103C1.75 8.56905 1.84873 8.811 2.01484 8.98447C2.17989 9.15684 2.39662 9.24729 2.61538 9.24729H6.38462C6.40238 9.24729 6.42014 9.24792 6.43786 9.24918C6.44728 9.24443 6.46977 9.23085 6.50126 9.19796C6.57835 9.11745 6.67185 8.95884 6.72736 8.71884L7.24662 6.00744C7.23544 5.91942 7.1972 5.84117 7.14287 5.78443C7.07881 5.71752 6.99903 5.68631 6.92308 5.68631H5.30769C4.89348 5.68631 4.55769 5.35053 4.55769 4.93631V2.12466C4.55769 2.01505 4.51569 1.91613 4.45057 1.84811C4.3865 1.78121 4.30672 1.75 4.23077 1.75ZM2.92757 0.810697C3.26742 0.455775 3.73548 0.25 4.23077 0.25C4.72605 0.25 5.19411 0.455775 5.53397 0.810697C5.87277 1.16451 6.05769 1.63771 6.05769 2.12466V4.18631H6.92308C7.41836 4.18631 7.88642 4.39209 8.22628 4.74701C8.56508 5.10083 8.75 5.57403 8.75 6.06098C8.75 6.10832 8.74552 6.15555 8.73661 6.20205L8.19815 9.0137C8.19667 9.02146 8.19506 9.02919 8.19333 9.0369C8.09364 9.48098 7.89493 9.91136 7.58467 10.2354C7.27613 10.5576 6.84701 10.7777 6.35722 10.7473H2.61538C1.97729 10.7473 1.37227 10.4823 0.931433 10.0219C0.491654 9.56262 0.25 8.94639 0.25 8.3103V4.93631C0.25 4.5221 0.585786 4.18631 1 4.18631C1.36157 4.18631 1.71527 4.03662 1.9813 3.7588C2.24839 3.47987 2.40385 3.09488 2.40385 2.68699V2.12466C2.40385 1.63771 2.58877 1.16451 2.92757 0.810697Z"
                                  />
                                </svg>
                              </div>
                              <div className="flex flex-col items-start gap-1 pr-4">
                                <div className="text-[13px] font-medium text-gray-900">Submit Request</div>
                                <div className="text-[12px] text-gray-500">Initial submission</div>
                                <div className="flex items-center gap-1">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                                    <span className="text-[10px] font-medium text-gray-600">JD</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-start gap-2">
                              <div className="flex items-center gap-3">
                                <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 14 14">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.23077 1.75C4.15482 1.75 4.07504 1.78121 4.01097 1.84811C3.94585 1.91613 3.90385 2.01505 3.90385 2.12466V2.68699C3.90385 3.47222 3.60546 4.23148 3.0647 4.79621C2.70056 5.1765 2.24601 5.44766 1.75 5.58462V8.3103C1.75 8.56905 1.84873 8.811 2.01484 8.98447C2.17989 9.15684 2.39662 9.24729 2.61538 9.24729H6.38462C6.40238 9.24729 6.42014 9.24792 6.43786 9.24918C6.44728 9.24443 6.46977 9.23085 6.50126 9.19796C6.57835 9.11745 6.67185 8.95884 6.72736 8.71884L7.24662 6.00744C7.23544 5.91942 7.1972 5.84117 7.14287 5.78443C7.07881 5.71752 6.99903 5.68631 6.92308 5.68631H5.30769C4.89348 5.68631 4.55769 5.35053 4.55769 4.93631V2.12466C4.55769 2.01505 4.51569 1.91613 4.45057 1.84811C4.3865 1.78121 4.30672 1.75 4.23077 1.75ZM2.92757 0.810697C3.26742 0.455775 3.73548 0.25 4.23077 0.25C4.72605 0.25 5.19411 0.455775 5.53397 0.810697C5.87277 1.16451 6.05769 1.63771 6.05769 2.12466V4.18631H6.92308C7.41836 4.18631 7.88642 4.39209 8.22628 4.74701C8.56508 5.10083 8.75 5.57403 8.75 6.06098C8.75 6.10832 8.74552 6.15555 8.73661 6.20205L8.19815 9.0137C8.19667 9.02146 8.19506 9.02919 8.19333 9.0369C8.09364 9.48098 7.89493 9.91136 7.58467 10.2354C7.27613 10.5576 6.84701 10.7777 6.35722 10.7473H2.61538C1.97729 10.7473 1.37227 10.4823 0.931433 10.0219C0.491654 9.56262 0.25 8.94639 0.25 8.3103V4.93631C0.25 4.5221 0.585786 4.18631 1 4.18631C1.36157 4.18631 1.71527 4.03662 1.9813 3.7588C2.24839 3.47987 2.40385 3.09488 2.40385 2.68699V2.12466C2.40385 1.63771 2.58877 1.16451 2.92757 0.810697Z"
                                  />
                                </svg>
                              </div>
                              <div className="flex flex-col items-start gap-1 pr-4">
                                <div className="text-[13px] font-medium text-gray-900">Review</div>
                                <div className="text-[12px] text-gray-500">Manager approval</div>
                                <div className="flex items-center gap-1">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                                    <span className="text-[10px] font-medium text-gray-600">AL</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-start gap-2">
                              <div className="flex items-center gap-3">
                                <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 14 14">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.23077 1.75C4.15482 1.75 4.07504 1.78121 4.01097 1.84811C3.94585 1.91613 3.90385 2.01505 3.90385 2.12466V2.68699C3.90385 3.47222 3.60546 4.23148 3.0647 4.79621C2.70056 5.1765 2.24601 5.44766 1.75 5.58462V8.3103C1.75 8.56905 1.84873 8.811 2.01484 8.98447C2.17989 9.15684 2.39662 9.24729 2.61538 9.24729H6.38462C6.40238 9.24729 6.42014 9.24792 6.43786 9.24918C6.44728 9.24443 6.46977 9.23085 6.50126 9.19796C6.57835 9.11745 6.67185 8.95884 6.72736 8.71884L7.24662 6.00744C7.23544 5.91942 7.1972 5.84117 7.14287 5.78443C7.07881 5.71752 6.99903 5.68631 6.92308 5.68631H5.30769C4.89348 5.68631 4.55769 5.35053 4.55769 4.93631V2.12466C4.55769 2.01505 4.51569 1.91613 4.45057 1.84811C4.3865 1.78121 4.30672 1.75 4.23077 1.75ZM2.92757 0.810697C3.26742 0.455775 3.73548 0.25 4.23077 0.25C4.72605 0.25 5.19411 0.455775 5.53397 0.810697C5.87277 1.16451 6.05769 1.63771 6.05769 2.12466V4.18631H6.92308C7.41836 4.18631 7.88642 4.39209 8.22628 4.74701C8.56508 5.10083 8.75 5.57403 8.75 6.06098C8.75 6.10832 8.74552 6.15555 8.73661 6.20205L8.19815 9.0137C8.19667 9.02146 8.19506 9.02919 8.19333 9.0369C8.09364 9.48098 7.89493 9.91136 7.58467 10.2354C7.27613 10.5576 6.84701 10.7777 6.35722 10.7473H2.61538C1.97729 10.7473 1.37227 10.4823 0.931433 10.0219C0.491654 9.56262 0.25 8.94639 0.25 8.3103V4.93631C0.25 4.5221 0.585786 4.18631 1 4.18631C1.36157 4.18631 1.71527 4.03662 1.9813 3.7588C2.24839 3.47987 2.40385 3.09488 2.40385 2.68699V2.12466C2.40385 1.63771 2.58877 1.16451 2.92757 0.810697Z"
                                  />
                                </svg>
                              </div>
                              <div className="flex flex-col items-start gap-1">
                                <div className="text-[13px] font-medium text-gray-900">Final Approval</div>
                                <div className="text-[12px] text-gray-500">Executive sign-off</div>
                                <div className="flex items-center gap-1">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                                    <span className="text-[10px] font-medium text-gray-600">SF</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="workflowOption"
                      value="existing"
                      checked={draft.workflowOption === "existing"}
                      onChange={(e) => setDraft({ ...draft, workflowOption: e.target.value })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-gray-900 mb-1">Select existing workflow</div>
                      <div className="text-[13px] text-gray-600 mb-3">Choose from your organization's workflows</div>
                      {draft.workflowOption === "existing" && (
                        <div className="space-y-3">
                          <select
                            value={draft.selectedWorkflow || ""}
                            onChange={(e) => setDraft({ ...draft, selectedWorkflow: e.target.value })}
                            className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg text-[13px] text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select a workflow</option>
                            <option value="standard-approval">Standard Approval Process</option>
                            <option value="financial-review">Financial Review Workflow</option>
                            <option value="executive-approval">Executive Approval Required</option>
                          </select>
                          {draft.selectedWorkflow && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex items-center gap-0">
                                <div className="flex flex-col items-start gap-2">
                                  <div className="text-[13px] font-medium text-gray-900">Submit Request</div>
                                  <div className="text-[12px] text-gray-500">Initial submission</div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                                      <span className="text-[10px] font-medium text-gray-600">JD</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-start gap-2 px-4">
                                  <div className="text-[13px] font-medium text-gray-900">Finance Review</div>
                                  <div className="text-[12px] text-gray-500">Budget validation</div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                                      <span className="text-[10px] font-medium text-gray-600">CF</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center -ml-1">
                                      <span className="text-[10px] font-medium text-gray-600">BM</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                  <div className="text-[13px] font-medium text-gray-900">Final Approval</div>
                                  <div className="text-[12px] text-gray-500">Executive decision</div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                                      <span className="text-[10px] font-medium text-gray-600">SF</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="workflowOption"
                      value="adhoc"
                      checked={draft.workflowOption === "adhoc"}
                      onChange={(e) => setDraft({ ...draft, workflowOption: e.target.value })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-gray-900 mb-1">Set up ad hoc approval</div>
                      <div className="text-[13px] text-gray-600 mb-3">
                        Allow item creators to select their own approver for each submission
                      </div>
                      {draft.workflowOption === "adhoc" && (
                        <div className="space-y-3">
                          <div className="border border-blue-100 rounded-lg p-3 bg-blue-50">
                            <div className="text-[13px] text-blue-800">
                              When creating items in this category, users will choose a specific person to approve their
                              request instead of following a predefined workflow.
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-900">Who can be selected as approver</label>
                            <select
                              value={draft.adHocApproverScope || "any-member"}
                              onChange={(e) => setDraft({ ...draft, adHocApproverScope: e.target.value })}
                              className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg text-[13px] text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="any-member">Any organization member</option>
                              <option value="john-doe">John Doe</option>
                              <option value="sarah-fisher">Sarah Fisher</option>
                              <option value="alex-chen">Alex Chen</option>
                              <option value="maria-garcia">Maria Garcia</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="workflowOption"
                      value="create"
                      checked={draft.workflowOption === "create"}
                      onChange={(e) => setDraft({ ...draft, workflowOption: e.target.value })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-gray-900 mb-1">Create new workflow</div>
                      <div className="text-[13px] text-gray-600 mb-3">Design a custom workflow for this category</div>
                      {draft.workflowOption === "create" && (
                        <div className="border border-blue-100 rounded-lg p-3 bg-blue-50">
                          <div className="text-[13px] text-blue-800">
                            A new draft workflow will be created. You can configure it in the Workflow Builder after
                            completing this process.
                          </div>
                        </div>
                      )}
                  </div>
                  </label>
                </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4" id="category-wizard-step-5">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Preview</h3>
                    <p className="text-[14px] text-gray-600 leading-relaxed">
                      Review your category settings before creating it.
                    </p>
                  </div>

                  <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {/* Category Name */}
                    <div className="space-y-1">
                      <div className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Category Name</div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = getIconComponent(draft.selectedIcon)
                          return <Icon className="w-4 h-4 text-gray-600" />
                        })()}
                        <span className="text-[14px] font-medium text-gray-900">{draft.name || "Untitled Category"}</span>
                      </div>
                    </div>

                    {/* Category Type */}
                    <div className="space-y-1">
                      <div className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Category Type</div>
                      <span className="text-[14px] text-gray-900">{draft.type}</span>
                    </div>

                    {/* Parent Category */}
                    {draft.parent && (
                      <div className="space-y-1">
                        <div className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Parent Category</div>
                        <span className="text-[14px] text-gray-900">{draft.parent}</span>
                      </div>
                    )}

                    {/* Permissions */}
                    <div className="space-y-1">
                      <div className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Permissions</div>
                      <span className="text-[14px] text-gray-900">
                        {draft.permission === "view" ? "View content only" : "Create and manage content"}
                      </span>
                    </div>

                    {/* Capsules */}
                    <div className="space-y-1">
                      <div className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Enabled Capsules</div>
                      <div className="flex flex-wrap gap-2">
                        {draft.capsules
                          .filter((c) => c.enabled)
                          .map((c) => (
                            <span
                              key={c.id}
                              className="px-2 py-1 text-[12px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded"
                            >
                              {c.id === "amounts" && "Track amounts & budgets"}
                              {c.id === "attachments" && "Upload attachments"}
                              {c.id === "linked" && "Link related items"}
                              {c.id === "themes" && "Organize by themes"}
                            </span>
                          ))}
                        {draft.capsules.filter((c) => c.enabled).length === 0 && (
                          <span className="text-[13px] text-gray-500">No capsules enabled</span>
                        )}
                      </div>
                    </div>

                    {/* Workflow */}
                    <div className="space-y-1">
                      <div className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">Workflow</div>
                      <span className="text-[14px] text-gray-900">
                        {draft.workflowOption === "default" && "Use default workflow"}
                        {draft.workflowOption === "existing" && `Selected: ${draft.selectedWorkflow || "None"}`}
                        {draft.workflowOption === "adhoc" && "Set up ad hoc approval"}
                        {draft.workflowOption === "create" && "Create new workflow"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>
            </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200">
          <button
            className="px-4 py-2 text-[13px] font-semibold text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => {
                  const newStep = step - 1
                  setStep(newStep)
                  // Sync with walkthrough
                  // Walkthrough steps: 0="Create New Category" (before wizard, wizardStep:1), 1="Enter Details" (wizardStep:1), 2="Capsules" (wizardStep:2), etc.
                  // When wizard is on step 1, walkthrough should be on step 1 (not step 0)
                  // When wizard is on step 2, walkthrough should be on step 2
                  // So: wizard step N maps to walkthrough step N
                  const walkthroughStepIndex = newStep
                  window.dispatchEvent(
                    new CustomEvent("category-walkthrough-goto-step", {
                      detail: { step: walkthroughStepIndex },
                    })
                  )
                }}
                className="px-4 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Go back
              </button>
            )}
            <button
              id={step === 5 ? "category-wizard-create-btn" : "category-wizard-continue-btn"}
              ref={nextBtnRef}
              onClick={handleContinue}
              disabled={!canContinue()}
              className={`px-6 py-2 text-[13px] font-semibold text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors ${
                !canContinue() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {step === 5 ? "Create" : "Continue"}
                </button>
          </div>
        </div>
      </div>
    </div>
  )
}
