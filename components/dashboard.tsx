"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Dashboard() {
  const [userName, setUserName] = useState("")
  const [userInitials, setUserInitials] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstName = localStorage.getItem("way2b1_user_first_name") || ""
      const lastName = localStorage.getItem("way2b1_user_last_name") || ""
      setUserName(firstName)
      setUserInitials(
        (firstName?.[0] || "") + (lastName?.[0] || "") || "MK"
      )
    }
  }, [])

  const handleCreateTask = () => {
    router.push("/tasks")
    setTimeout(() => {
      const event = new CustomEvent("createTask")
      window.dispatchEvent(event)
    }, 100)
  }

  const handleCreateDecision = () => {
    router.push("/decisions")
    setTimeout(() => {
      const event = new CustomEvent("createDecision")
      window.dispatchEvent(event)
    }, 100)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Welcome section */}
      {userName && (
        <div className="pt-6 pb-4">
          <div className="flex items-center justify-between px-6">
            <div id="home-welcome-section" className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome back, {userName}!
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="home-new-task-button"
                onClick={handleCreateTask}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New task
              </button>
              <button
                id="home-new-decision-button"
                onClick={handleCreateDecision}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New decision
              </button>
            </div>
          </div>
          <div className="border-b border-gray-200 mt-4"></div>
        </div>
      )}

      {/* Homepage empty state - centered vertically */}
      <div className="flex-1 flex items-center justify-center">
        <div id="home-empty-state" className="flex items-center justify-between gap-16 px-8 w-full max-w-7xl mx-auto">
          <div className="flex-1 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ah, a fresh homepage
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You don't have any assigned decisions or tasks yet, but when you do, you'll find them here.
            </p>
          </div>
          
          {/* Illustration */}
          <div className="flex-shrink-0">
            <img 
              src="/illustration-homepage.svg" 
              alt="Homepage illustration" 
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
