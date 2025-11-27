"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Building2, Edit, Key, Minus, Upload, Trash2, Plus } from "lucide-react"
import { OrganizationWalkthrough } from "@/components/organization-walkthrough"
import { ModuleCompletionModal } from "@/components/module-completion-modal"

export default function OrganizationProfilePage() {
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const [organizationName, setOrganizationName] = useState("Cresset")
  const [organizationLogo, setOrganizationLogo] = useState<string | null>(null)
  const [createdDate] = useState("Sep 9, 2024")
  const [ownerName] = useState("Robert Spencer")
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  useEffect(() => {
    // Check if walkthrough should be shown
    const activeModule = localStorage.getItem("way2b1_active_module")
    const shouldShowWalkthrough = localStorage.getItem("way2b1_start_org_walkthrough") === "true"
    
    if (activeModule === "org-setup" && shouldShowWalkthrough) {
      // Small delay for page to load
      setTimeout(() => {
        setShowWalkthrough(true)
        localStorage.removeItem("way2b1_start_org_walkthrough")
      }, 300)
    }
  }, [])

  const handleEditDetails = () => {
    setShowEditModal(true)
  }

  const handleSaveEdit = (name: string, logo: string | null) => {
    setOrganizationName(name)
    setOrganizationLogo(logo)
    setShowEditModal(false)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar onStartTutorial={() => {}} onOpenTutorialCenter={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-6 min-w-0">
              <nav className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0" aria-label="Breadcrumb">
                <button
                  onClick={() => router.push("/more")}
                  className="hover:text-foreground transition-colors flex-shrink-0 px-1.5 py-0.5 rounded hover:bg-secondary/50 truncate max-w-[150px]"
                  title="Admin"
                >
                  Admin
                </button>
                <span className="flex-shrink-0 text-muted-foreground/60">/</span>
                <button
                  onClick={() => router.push("/more/organization")}
                  className="hover:text-foreground transition-colors flex-shrink-0 px-1.5 py-0.5 rounded hover:bg-secondary/50 truncate max-w-[200px]"
                  title={organizationName}
                >
                  {organizationName}
                </button>
                <span className="flex-shrink-0 text-muted-foreground/60">/</span>
                <span className="text-foreground truncate max-w-[200px] px-1.5 py-0.5" title="Organization profile">
                  Organization profile
                </span>
              </nav>
            </div>

            {/* Page Title */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Organization profile</h1>
              </div>
            </div>

            {/* Organization Details */}
            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div
                  id="org-avatar"
                  className="flex-shrink-0 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-border"
                >
                  {organizationLogo ? (
                    <img
                      src={organizationLogo}
                      alt={organizationName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    organizationName.substring(0, 2).toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 id="org-name" className="text-2xl font-bold text-foreground mb-2">
                        {organizationName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Created: {createdDate} • Owner: {ownerName}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        id="btn-deactivate"
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <Minus className="w-4 h-4" />
                        Deactivate
                      </button>
                      <button
                        id="btn-transfer"
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                      >
                        <Key className="w-4 h-4" />
                        Transfer ownership
                      </button>
                      <button
                        id="btn-edit"
                        onClick={handleEditDetails}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Managed Organizations Section */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Managed organizations</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Create separate workspaces under your main account. Use Managed Organizations for
                departments, teams, or clients needing independent permissions and data boundaries.
              </p>
              <button
                id="btn-new-org"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                New organization
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditOrganizationModal
          organizationName={organizationName}
          organizationLogo={organizationLogo}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Walkthrough */}
      {showWalkthrough && (
        <OrganizationWalkthrough
          onClose={() => setShowWalkthrough(false)}
          onStepComplete={(stepIndex) => {
            // Handle step completion if needed
            console.log("Step completed:", stepIndex)
          }}
          onComplete={() => {
            // Walkthrough completed - modal will show on dashboard
            setShowWalkthrough(false)
          }}
        />
      )}

    </div>
  )
}

// Edit Organization Modal Component
function EditOrganizationModal({
  organizationName: initialName,
  organizationLogo: initialLogo,
  onSave,
  onClose,
}: {
  organizationName: string
  organizationLogo: string | null
  onSave: (name: string, logo: string | null) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initialName)
  const [logo, setLogo] = useState<string | null>(initialLogo)
  const [subOrgName, setSubOrgName] = useState("Child organization")

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteLogo = () => {
    setLogo(null)
  }

  const handleSave = () => {
    onSave(name, logo)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl p-8 max-w-2xl mx-4 shadow-2xl animate-in zoom-in duration-500 w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Edit organization details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Organization Photo */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Organization photo
            </label>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border-2 border-border overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Organization logo" className="w-full h-full object-cover" />
                ) : (
                  name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="flex gap-3 mb-2">
                  <label
                    id="btn-upload-photo"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Upload photo
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {logo && (
                    <button
                      onClick={handleDeleteLogo}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">PNG or JPEG, up to 5 MB</p>
              </div>
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Organization name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Sub-organization Naming */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What would you like to call your sub-organizations?
            </label>
            <input
              type="text"
              value={subOrgName}
              onChange={(e) => setSubOrgName(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This will rename the default "Child organization" throughout the entire platform.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            id="btn-save-org"
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

