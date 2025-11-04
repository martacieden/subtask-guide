"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, Sparkles, Filter, Table2, FolderTree, CheckCircle2 } from "lucide-react"

interface NextGenWelcomeProps {
  onComplete: () => void
  onSkip: () => void
}

interface Slide {
  title: string
  subtitle?: string
  description: string
  icon: React.ReactNode
  image?: string
  features?: string[]
}

const slides: Slide[] = [
  {
    title: "Welcome to Way2B1 Next Gen",
    subtitle: "Your upgraded Digital Chief of Staff",
    description: "We've rebuilt the platform from the ground up with powerful new features to make your work faster, smarter, and more intuitive.",
    icon: <Sparkles className="w-12 h-12 text-[#94A3B8] stroke-[1.5]" />,
  },
  {
    title: "Meet Fojo: Your AI Assistant",
    subtitle: "Intelligence that amplifies your expertise",
    description: "Fojo analyzes patterns, surfaces insights, and automates routine tasks. Get proactive suggestions, smart prioritization, and instant answers—all while you maintain full control.",
    icon: <Sparkles className="w-12 h-12 text-[#94A3B8] stroke-[1.5]" />,
    features: [
      "Automatic task prioritization based on urgency and impact",
      "Pattern recognition across decisions and workflows",
      "Proactive insights and recommendations",
      "Natural language queries for instant information",
    ],
  },
  {
    title: "Smart Filtering System",
    subtitle: "Find exactly what you need, instantly",
    description: "New conditional filters and quick filters work together to give you precise control over your view.",
    icon: <Filter className="w-12 h-12 text-[#94A3B8] stroke-[1.5]" />,
    features: [
      "Quick Filters: Combine multiple criteria (works as UNION, showing items matching ANY filter)",
      "Advanced Filters: Narrow down with precise conditions (works as AND, refining your results)",
      "Categories: Group decisions by type for better organization",
      "Save custom filter combinations for recurring needs",
    ],
  },
]

export function NextGenWelcome({ onComplete, onSkip }: NextGenWelcomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const currentSlideData = slides[currentSlide]
  const isLastSlide = currentSlide === slides.length - 1
  const progress = ((currentSlide + 1) / slides.length) * 100

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl p-8 max-w-2xl mx-4 shadow-2xl animate-in zoom-in duration-300 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-1 transition-all z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className="flex justify-center mb-4">
            {currentSlide === 0 ? (
              <img 
                src="/logo-next.svg" 
                alt="Way2B1 Next Gen Logo" 
                className="w-20 h-20"
              />
            ) : (
              currentSlideData.icon
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-foreground text-balance">
              {currentSlideData.title}
            </h2>
            {currentSlideData.subtitle && (
              <p className="text-primary font-bold text-sm mb-3">
                {currentSlideData.subtitle}
              </p>
            )}
            <p className="text-gray-700 leading-relaxed text-pretty mb-4">
              {currentSlideData.description}
            </p>
          </div>

          {currentSlideData.features && (
            <div className="space-y-2 mt-4">
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-[#4F7CFF] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              Step {currentSlide + 1} of {slides.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Back
            </button>
          )}
          {currentSlide === 0 && !isLastSlide && (
            <button
              onClick={onSkip}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Skip tour
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
              isLastSlide 
                ? "bg-[#4F7CFF] text-white hover:bg-[#4F7CFF]/90 hover:shadow-lg" 
                : "bg-[#4F7CFF] text-white hover:bg-[#4F7CFF]/90 hover:shadow-lg"
            }`}
          >
            {isLastSlide ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}



