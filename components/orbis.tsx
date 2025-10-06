"use client"

import { useState, useEffect } from "react"
import { TopBar } from "./top-bar"
import { LeftNavigation } from "./left-navigation"
import { TodayScreen } from "./today-screen"
import { ReviewScreen } from "./review-screen"
import { FavoritesScreen } from "./favorites-screen"
import { TwoMinuteStartDrawer } from "./two-minute-start-drawer"
import { DemoOverlay } from "./demo-overlay"
import { ErrorBankScreen } from "./error-bank-screen"

export function Orbis() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [activeScreen, setActiveScreen] = useState("Today")
  const [isStartDrawerOpen, setIsStartDrawerOpen] = useState(true)
  const [isStartDrawerMinimized, setIsStartDrawerMinimized] = useState(false)
  const [demoEnabled, setDemoEnabled] = useState(false)

  useEffect(() => {
    function onOpenToday(e: any) {
      setActiveScreen("Today")
    }
    window.addEventListener("open-today", onOpenToday as any)
    return () => window.removeEventListener("open-today", onOpenToday as any)
  }, [])

  // Check if start drawer should be minimized on load
  useEffect(() => {
    const savedMinimized = sessionStorage.getItem("start-drawer-minimized")
    const autoMin = localStorage.getItem("start-automin") === "true"
    if (savedMinimized === "true" || autoMin) {
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
        demoEnabled={demoEnabled}
        setDemoEnabled={setDemoEnabled}
        openStartDrawer={() => { setDemoEnabled(false); setIsStartDrawerOpen(true) }}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftNavigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} isFocusMode={isFocusMode} />

        <main className={`flex-1 transition-layout ${isFocusMode ? "ml-0" : ""} min-h-0 overflow-y-auto`}>
          {activeScreen === "Today" && <TodayScreen isFocusMode={isFocusMode} />}
          {activeScreen === "Review" && <ReviewScreen isFocusMode={isFocusMode} />}
          {activeScreen === "Favorites" && <FavoritesScreen isFocusMode={isFocusMode} />}
          {activeScreen === "Error Bank" && <ErrorBankScreen />}
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

      <DemoOverlay enabled={demoEnabled} onClose={() => setDemoEnabled(false)} />
    </div>
  )
}
