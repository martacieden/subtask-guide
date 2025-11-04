"use client"

import { useState } from "react"
import { Users, Briefcase, Building2, UserCircle, Shield, TrendingUp, ArrowRight } from "lucide-react"

interface RoleSelectorProps {
  onComplete: (role: string, goals: string[]) => void
}

export function RoleSelector({ onComplete }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const roles = [
    {
      id: "wealth-advisor",
      title: "Wealth Advisor",
      description: "Manage investment strategies and provide financial advisory services",
      icon: <TrendingUp className="w-6 h-6" />,
      goals: [
        "Create investment decisions",
        "Share documents with families",
        "Track approval workflows",
        "Analyze portfolio performance",
      ],
    },
    {
      id: "operations-team",
      title: "Operations Team",
      description: "Handle day-to-day operations and task coordination",
      icon: <Briefcase className="w-6 h-6" />,
      goals: [
        "Manage team tasks and deadlines",
        "Coordinate decision workflows",
        "Share documents across teams",
        "Track operational metrics",
      ],
    },
    {
      id: "executive",
      title: "Executive",
      description: "Oversee family office operations and major decisions",
      icon: <Building2 className="w-6 h-6" />,
      goals: [
        "Review and approve key decisions",
        "Monitor family portfolio performance",
        "Collaborate with advisors",
        "Track multi-family workflows",
      ],
    },
    {
      id: "service-provider",
      title: "Service Provider",
      description: "Provide external services and support to the family office",
      icon: <Users className="w-6 h-6" />,
      goals: [
        "Complete assigned tasks",
        "Participate in decision workflows",
        "Share and review documents",
        "Communicate with team members",
      ],
    },
    {
      id: "client",
      title: "Client",
      description: "Family member or client accessing the platform",
      icon: <UserCircle className="w-6 h-6" />,
      goals: [
        "View family portfolio performance",
        "Review decisions and approvals",
        "Access documents and reports",
        "Communicate with advisors",
      ],
    },
  ]

  const currentRole = roles.find((r) => r.id === selectedRole)

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const handleContinue = () => {
    if (selectedRole && selectedGoals.length > 0) {
      onComplete(selectedRole, selectedGoals)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl p-8 max-w-3xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl animate-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-foreground">Welcome to Way2B1</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let's personalize your multi-family office experience. Tell us about your role and goals.
          </p>
        </div>

        {!selectedRole ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground mb-4">What's your role in the family office?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="flex items-start gap-4 p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">{role.title}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                {currentRole?.icon}
              </div>
              <div>
                <div className="font-semibold text-foreground">{currentRole?.title}</div>
                <button
                  onClick={() => {
                    setSelectedRole(null)
                    setSelectedGoals([])
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Change role
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-4">
                What are your main goals? (Select all that apply)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentRole?.goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedGoals.includes(goal)
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedGoals.includes(goal) ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {selectedGoals.includes(goal) && (
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={selectedGoals.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
