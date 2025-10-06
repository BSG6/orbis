"use client"

import { useEffect, useRef, useState } from "react"
import { EditorView } from "@codemirror/view"
import { basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  readOnly?: boolean
  theme?: "light" | "dark"
}

export function CodeEditor({ 
  value, 
  onChange, 
  className, 
  placeholder = "// Start coding here...",
  readOnly = false,
  theme = "dark"
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [isReady, setIsReady] = useState(false)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!editorRef.current) return

    const startState = EditorState.create({
      doc: "",
      extensions: [
        basicSetup,
        javascript(),
        theme === "dark" ? oneDark : [],
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())
          }
        }),
        EditorState.readOnly.of(readOnly),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
            fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
          },
          ".cm-editor": {
            height: "100%"
          },
          ".cm-scroller": {
            height: "100%"
          },
          ".cm-content": {
            padding: "16px",
            minHeight: "100%"
          },
          ".cm-focused": {
            outline: "none"
          }
        }),
        ...(placeholder ? [EditorView.theme({
          ".cm-placeholder": {
            color: theme === "dark" ? "#6b7280" : "#9ca3af"
          }
        })] : [])
      ]
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    })

    viewRef.current = view
    setIsReady(true)

    return () => {
      view.destroy()
      viewRef.current = null
      setIsReady(false)
    }
  }, [theme, readOnly, placeholder])

  // Update content when value prop changes
  useEffect(() => {
    if (viewRef.current && isReady) {
      const currentValue = viewRef.current.state.doc.toString()
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value
          }
        })
      }
    }
  }, [value, isReady]) // onChange is intentionally omitted to avoid infinite loops

  return (
    <div 
      className={cn(
        "relative h-full w-full overflow-hidden rounded-md border border-border bg-background",
        className
      )}
    >
      <div ref={editorRef} className="h-full w-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-sm text-muted-foreground">Loading editor...</div>
        </div>
      )}
    </div>
  )
}
