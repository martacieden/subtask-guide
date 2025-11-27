"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface HoverTooltipProps {
  message: string
  position?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
  className?: string
}

export function HoverTooltip({ 
  message, 
  position = "bottom",
  children,
  className = ""
}: HoverTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculatePosition = () => {
    if (!wrapperRef.current) return null

    const rect = wrapperRef.current.getBoundingClientRect()
    const margin = 8

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
    if (!tooltipRef.current) return

    const initialPos = calculatePosition()
    if (!initialPos) return

    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const tooltipWidth = tooltipRect.width || 200
    const tooltipHeight = tooltipRect.height || 40
    const margin = 8
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let { top, left } = initialPos

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

  const handleMouseEnter = () => {
    setIsVisible(true)
    setTimeout(() => {
      adjustPosition()
    }, 0)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
    setTooltipPosition(null)
  }

  useEffect(() => {
    if (isVisible) {
      adjustPosition()
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const handleResize = () => {
      adjustPosition()
    }

    const handleScroll = () => {
      adjustPosition()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [isVisible])

  if (!mounted) {
    return <div ref={wrapperRef} className={className}>{children}</div>
  }

  const tooltipContent = isVisible && tooltipPosition ? (
    <div
      ref={tooltipRef}
      className="fixed pointer-events-none z-[999999] animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        zIndex: 999999,
      }}
    >
      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg max-w-xs whitespace-normal">
        {message}
        {/* Arrow */}
        <div
          className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" :
            position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" :
            position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" :
            "left-[-4px] top-1/2 -translate-y-1/2"
          }`}
        />
      </div>
    </div>
  ) : null

  return (
    <>
      <div
        ref={wrapperRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {typeof document !== "undefined" && document.body && tooltipContent
        ? createPortal(tooltipContent, document.body)
        : null}
    </>
  )
}

