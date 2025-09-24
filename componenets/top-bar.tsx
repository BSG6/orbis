"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon, Sun, Focus, Maximize2 } from "lucide-react"

interface TopBarProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  isFocusMode: boolean
  setIsFocusMode: (value: boolean) => void
}

export function TopBar({ isDarkMode, setIsDarkMode, isFocusMode, setIsFocusMode }: TopBarProps) {
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-lime-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Orbis</h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <Label htmlFor="theme-toggle" className="text-sm text-muted-foreground sr-only">
            Toggle theme
          </Label>
          <Button
            id="theme-toggle"
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            className="h-9 w-9 p-0 hover:bg-accent focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-lime-400" /> : <Moon className="h-4 w-4 text-violet-500" />}
          </Button>
        </div>

        {/* Focus Mode Toggle */}
        <div className="flex items-center gap-3">
          <Label htmlFor="focus-toggle" className="text-sm text-muted-foreground flex items-center gap-2">
            {isFocusMode ? (
              <Maximize2 className="h-4 w-4 text-lime-400" />
            ) : (
              <Focus className="h-4 w-4 text-violet-500" />
            )}
            Focus Mode
          </Label>
          <Switch
            id="focus-toggle"
            checked={isFocusMode}
            onCheckedChange={setIsFocusMode}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-violet-500 data-[state=checked]:to-lime-400"
            aria-label="Toggle focus mode"
          />
        </div>
      </div>
    </header>
  )
}
