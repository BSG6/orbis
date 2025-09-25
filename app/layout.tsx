import type React from "react"
import type { Metadata } from "next"
import "./global.css"

export const metadata: Metadata = {
  title: "Orbis",
  description: "Your daily companion for coding practice and improvement",
}

function SeedOnLoad() {
  if (typeof window !== "undefined") {
    // dynamically import to avoid SSR issues
    import("@/lib/seed").then((m) => m.seedProblemsIfEmpty()).catch(() => {})
  }
  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <SeedOnLoad />
        {children}
      </body>
    </html>
  )
}
