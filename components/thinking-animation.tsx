"use client"

import { useEffect, useState } from "react"
import { getRandomThinkingMessage } from "@/lib/thinking-messages"
import { Zap } from "lucide-react"

interface ThinkingAnimationProps {
  isVisible: boolean
}

export function ThinkingAnimation({ isVisible }: ThinkingAnimationProps) {
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([])

  useEffect(() => {
    if (!isVisible) {
      setDisplayedMessages([])
      return
    }

    const messages: string[] = []
    const interval = setInterval(() => {
      const newMessage = getRandomThinkingMessage()
      messages.unshift(newMessage)
      // Keep only last 4 messages for scrolling effect
      if (messages.length > 4) {
        messages.pop()
      }
      setDisplayedMessages([...messages])
    }, 1200)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Agent working in background</span>
      </div>

      <div className="rounded-lg bg-card/50 border border-border p-4 min-h-32 space-y-2 overflow-hidden">
        {displayedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            <Zap className="h-5 w-5 mr-2 text-accent" />
            <span className="text-sm">Initializing process...</span>
          </div>
        ) : (
          displayedMessages.map((message, index) => (
            <div
              key={index}
              className={`text-sm transition-all duration-500 ${
                index === 0 ? "text-foreground opacity-100 animate-pulse" : "text-muted-foreground opacity-60"
              }`}
            >
              <span className="text-accent mr-2">›</span>
              {message}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
