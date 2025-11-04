"use client"

import { Sparkles } from "lucide-react"
import { useState } from "react"

export function AIAssistantButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      id="ai-assistant-button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 bg-[#4F7CFF] text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all z-[9997] flex items-center gap-2 font-medium text-sm"
      aria-label="Open Fojo Assistant"
    >
      <Sparkles className="w-5 h-5" />
      <span>Fojo Assistant</span>
    </button>
  )
}

