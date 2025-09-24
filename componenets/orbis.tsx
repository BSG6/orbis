"use client"

import { useState, useEffect } from "react"
import { TopBar } from "./top-bar"
import { LeftNavigation } from "./left-navigation"
import { TodayScreen } from "./today-screen"
import { ReviewScreen } from "./review-screen"
import { FavoritesScreen } from "./favorites-screen"
import { TwoMinuteStartDrawer } from "./two-minute-start-drawer"

export function Orbis() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [activeScreen, setActiveScreen] = useState("Today")
  const [isStartDrawerOpen, setIsStartDrawerOpen] = useState(true)
  const [isStartDrawerMinimized, setIsStartDrawerMinimized] = useState(false)

  // Check if start drawer should be minimized on load
  useEffect(() => {
    const savedMinimized = sessionStorage.getItem("start-drawer-minimized")
    if (savedMinimized === "true") {
      setIsStartDrawerOpen(false)
      setIsStartDrawerMinimized(true)
    }
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftNavigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} isFocusMode={isFocusMode} />

        <main className={`flex-1 transition-layout ${isFocusMode ? "ml-0" : ""}`}>
          {activeScreen === "Today" && <TodayScreen isFocusMode={isFocusMode} />}
          {activeScreen === "Review" && <ReviewScreen isFocusMode={isFocusMode} />}
          {activeScreen === "Favorites" && <FavoritesScreen isFocusMode={isFocusMode} />}
          {!["Today", "Review", "Favorites"].includes(activeScreen) && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-muted-foreground mb-2">{activeScreen}</h2>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <TwoMinuteStartDrawer
        isOpen={isStartDrawerOpen}
        onClose={() => setIsStartDrawerOpen(false)}
        onMinimize={() => {
          setIsStartDrawerOpen(false)
          setIsStartDrawerMinimized(true)
        }}
        isMinimized={isStartDrawerMinimized}
      />
    </div>
  )
}
