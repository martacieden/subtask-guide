"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { useFirstTime } from "@/hooks/useFirstTime"

interface ContextualTooltipProps {
  tooltipKey: string
  targetElementId: string
  message: string
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
  onDismiss?: () => void
}

export function ContextualTooltip({ 
  tooltipKey,
  targetElementId, 
  message, 
  position = "bottom",
  delay = 1000,
  onDismiss
}: ContextualTooltipProps) {
  const [isFirstTime, markAsSeen] = useFirstTime(`tooltip_${tooltipKey}_${targetElementId}`)
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isFirstTime || typeof window === "undefined" || !mounted) return

    const calculatePosition = () => {
      const element = document.getElementById(targetElementId)
      if (!element) {
        return null
      }

      const rect = element.getBoundingClientRect()
      const margin = 12

      // Спочатку встановлюємо базову позицію без урахування розміру тултіпа
      let top = 0
      let left = 0

      switch (position) {
        case "top":
          top = rect.top - margin
          left = rect.left + rect.width / 2
          break
        case "bottom":
          top = rect.bottom + margin
          left = rect.left + rect.width / 2
          break
        case "left":
          top = rect.top + rect.height / 2
          left = rect.left - margin
          break
        case "right":
          top = rect.top + rect.height / 2
          left = rect.right + margin
          break
      }

      return { top, left, rect }
    }

    const adjustPosition = () => {
      if (!tooltipRef.current) {
        return
      }

      const initialPos = calculatePosition()
      if (!initialPos) {
        return
      }

      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const tooltipWidth = tooltipRect.width || 280
      const tooltipHeight = tooltipRect.height || 80
      const margin = 12
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let { top, left } = initialPos

      // Корекція позиції в залежності від напрямку
      switch (position) {
        case "top":
          left = left - tooltipWidth / 2
          top = top - tooltipHeight
          break
        case "bottom":
          left = left - tooltipWidth / 2
          break
        case "left":
          left = left - tooltipWidth
          top = top - tooltipHeight / 2
          break
        case "right":
          top = top - tooltipHeight / 2
          break
      }

      // Перевірка меж viewport
      if (left < margin) {
        left = margin
      }
      if (left + tooltipWidth > viewportWidth - margin) {
        left = viewportWidth - tooltipWidth - margin
      }
      if (top < margin) {
        top = margin
      }
      if (top + tooltipHeight > viewportHeight - margin) {
        top = viewportHeight - tooltipHeight - margin
      }

      setTooltipPosition({ top, left })
    }

    const showTooltip = () => {
      const element = document.getElementById(targetElementId)
      if (!element) {
        setTimeout(showTooltip, 100)
        return
      }

      // Спочатку встановлюємо позицію приблизно
      const initialPos = calculatePosition()
      if (initialPos) {
        setTooltipPosition({ top: initialPos.top, left: initialPos.left })
        setIsVisible(true)
        
        // Після рендерингу корегуємо позицію
        setTimeout(() => {
          adjustPosition()
        }, 0)
      }
    }

    const timeout = setTimeout(() => {
      showTooltip()
      setTimeout(() => {
        adjustPosition()
      }, delay)
    }, 300)

    const handleResize = () => {
      if (isVisible) {
        adjustPosition()
      }
    }

    const handleScroll = () => {
      if (isVisible) {
        adjustPosition()
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [isFirstTime, targetElementId, position, delay, mounted, isVisible])

  const handleDismiss = () => {
    markAsSeen()
    setIsVisible(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  if (!mounted || !isFirstTime || !tooltipPosition || !isVisible) return null

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="fixed pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        zIndex: 999999,
        isolation: 'isolate',
        position: 'fixed',
        pointerEvents: 'auto',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 max-w-xs min-w-[240px] relative" style={{ zIndex: 999999 }}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-gray-700 flex-1 leading-relaxed">{message}</p>
          <button
            onClick={handleDismiss}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        {/* Arrow */}
        <div
          className={`absolute w-2 h-2 bg-white border border-gray-200 transform rotate-45 ${
            position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-r-0" :
            position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2 border-b-0 border-l-0" :
            position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-b-0" :
            "left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0"
          }`}
        />
      </div>
    </div>
  )

  // Перевіряємо, чи document.body існує перед створенням Portal
  if (typeof document === "undefined" || !document.body) {
    return null
  }

  return createPortal(tooltipContent, document.body)
}

