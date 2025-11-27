"use client"

import { useState, useEffect } from "react"
import { ContextualTooltip } from "./ContextualTooltip"
import { useFirstTime } from "@/hooks/useFirstTime"

interface TooltipConfig {
  tooltipKey: string
  targetElementId: string
  message: string
  position?: "top" | "bottom" | "left" | "right"
}

interface SequentialTooltipsProps {
  tooltips: TooltipConfig[]
  startDelay?: number
  gapBetweenTooltips?: number
  storageKey?: string
}

export function SequentialTooltips({ 
  tooltips, 
  startDelay = 2000,
  gapBetweenTooltips = 3000,
  storageKey = "sequential_tooltips"
}: SequentialTooltipsProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [dismissedTooltips, setDismissedTooltips] = useState<Set<string>>(new Set())
  const [isFirstTime, markAsSeen] = useFirstTime(storageKey)

  useEffect(() => {
    if (tooltips.length === 0 || !isFirstTime) return

    // Починаємо показ першого тултіпа після startDelay
    const initialTimeout = setTimeout(() => {
      setCurrentIndex(0)
    }, startDelay)

    return () => clearTimeout(initialTimeout)
  }, [tooltips.length, startDelay, isFirstTime])

  const handleTooltipDismiss = (tooltipKey: string) => {
    setDismissedTooltips(prev => new Set(prev).add(tooltipKey))
    
    // Знаходимо індекс поточного тултіпа
    const currentTooltipIndex = tooltips.findIndex(t => t.tooltipKey === tooltipKey)
    
    if (currentTooltipIndex !== -1 && currentTooltipIndex < tooltips.length - 1) {
      // Показуємо наступний тултіп через gapBetweenTooltips
      setTimeout(() => {
        setCurrentIndex(currentTooltipIndex + 1)
      }, gapBetweenTooltips)
    } else {
      // Всі тултіпи показані - позначаємо як завершено
      markAsSeen()
      setCurrentIndex(null)
    }
  }

  if (!isFirstTime) return null

  return (
    <>
      {tooltips.map((tooltip, index) => {
        const isVisible = currentIndex === index && !dismissedTooltips.has(tooltip.tooltipKey)
        
        if (!isVisible) return null

        return (
          <ContextualTooltip
            key={tooltip.tooltipKey}
            tooltipKey={tooltip.tooltipKey}
            targetElementId={tooltip.targetElementId}
            message={tooltip.message}
            position={tooltip.position || "bottom"}
            delay={0} // Не використовуємо delay, бо контролюємо послідовність вручну
            onDismiss={() => handleTooltipDismiss(tooltip.tooltipKey)}
          />
        )
      })}
    </>
  )
}

