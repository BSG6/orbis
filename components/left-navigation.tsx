"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, RotateCcw, Heart, Plus, History, Route, Award, Settings } from "lucide-react"

interface LeftNavigationProps {
  activeScreen: string
  setActiveScreen: (screen: string) => void
  isFocusMode: boolean
}

const navigationItems = [
  { id: "Today", label: "Today", icon: Calendar },
  { id: "Review", label: "Review", icon: RotateCcw },
  { id: "Favorites", label: "Favorites", icon: Heart },
  { id: "Error Bank", label: "Error Bank", icon: Award },
  { id: "Add", label: "Add", icon: Plus },
  { id: "History", label: "History", icon: History },
  { id: "Tracks", label: "Tracks", icon: Route },
  { id: "Badges", label: "Badges", icon: Award },
  { id: "Settings", label: "Settings", icon: Settings },
]

export function LeftNavigation({ activeScreen, setActiveScreen, isFocusMode }: LeftNavigationProps) {
  if (isFocusMode) {
    return null
  }

  return (
    <nav
      className="w-64 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col transition-layout"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Navigation</h2>
        <div className="space-y-1" role="list">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeScreen === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                  isActive && [
                    "bg-gradient-to-r from-violet-500/10 to-lime-400/10",
                    "border border-violet-500/20",
                    "text-foreground shadow-sm",
                  ],
                )}
                onClick={() => setActiveScreen(item.id)}
                role="listitem"
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
              >
                <Icon
                  className={cn("h-4 w-4 transition-colors", isActive ? "text-violet-500" : "text-muted-foreground")}
                />
                <span className="text-left">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Bottom section with user info placeholder */}
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-lime-400 flex items-center justify-center">
            <span className="text-white font-medium text-xs">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">Level 1 Coder</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
