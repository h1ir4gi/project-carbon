"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
}

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])

  useEffect(() => {
    const lines = value.split("\n").length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + "    " + value.substring(end)
      onChange(newValue)

      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }

  return (
    <div className="w-full h-full bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex h-full">
        {/* Line numbers */}
        <div className="bg-slate-50 px-3 py-4 border-r border-slate-200 select-none">
          <div className="text-sm text-slate-500 font-mono leading-6">
            {lineNumbers.map((num) => (
              <div key={num} className="text-right">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Code editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-6 text-slate-800"
            style={{
              fontFamily: "'Fira Code', 'SF Mono', Consolas, monospace",
              tabSize: 4,
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Start typing your C code here..."
          />
        </div>
      </div>
    </div>
  )
}
