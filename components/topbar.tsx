"use client"

import { useState, useEffect } from "react"
import { Bell, Search, HelpCircle, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Topbar() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [userInitials, setUserInitials] = useState("MK")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstName = localStorage.getItem("way2b1_user_first_name") || ""
      const lastName = localStorage.getItem("way2b1_user_last_name") || ""
      const initials = (firstName?.[0] || "") + (lastName?.[0] || "") || "MK"
      setUserInitials(initials)
    }
  }, [])

  const handleSupport = () => {
    // Відкрити сторінку підтримки або відкрити модальне вікно
    console.log("Support clicked")
    // Можна додати відкриття модального вікна або переходу на сторінку
  }

  const handleFeedback = () => {
    // Відкрити форму зворотного зв'язку
    setShowFeedback(true)
    // Діспатчимо подію для відкриття feedback модального вікна
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("requestFeedback"))
    }
  }

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      {/* Left side: Search */}
      <div className="flex items-center gap-6 flex-1">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="user-search-input"
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-20 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">K</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4" id="actionButtons">
        <a id="user-current-gen-switch" href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Go to Way2B1
        </a>

        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar id="user-profile-avatar" className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem id="user-profile-support" onClick={handleSupport} className="cursor-pointer">
              <HelpCircle className="w-4 h-4 mr-2" />
              Support
            </DropdownMenuItem>
            <DropdownMenuItem id="user-profile-feedback" onClick={handleFeedback} className="cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
