"use client"

import { useEffect, useRef } from "react"

interface TerminalProps {
  output: string
}

export default function Terminal({ output }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const formatOutput = (text: string) => {
    const lines = text.split("\n")
    return lines.map((line, index) => {
      // Success messages
      if (line.includes("✅") || line.includes("🎉")) {
        return (
          <div key={index} className="text-emerald-600 font-medium py-1">
            {line}
          </div>
        )
      }

      // Error messages
      if (line.includes("❌") || line.includes("error:")) {
        return (
          <div key={index} className="text-red-500 font-medium py-1">
            {formatLineWithSyntax(line)}
          </div>
        )
      }

      // Warning messages
      if (line.includes("⚠️") || line.includes("warning:")) {
        return (
          <div key={index} className="text-amber-600 font-medium py-1">
            {formatLineWithSyntax(line)}
          </div>
        )
      }

      // Info messages with emojis
      if (line.includes("🔧") || line.includes("🚀") || line.includes("📊") || line.includes("💡")) {
        return (
          <div key={index} className="text-blue-600 font-medium py-1">
            {line}
          </div>
        )
      }

      // Code lines with line numbers
      if (line.match(/^\s*\d+\s*\|/)) {
        return (
          <div
            key={index}
            className="bg-slate-50 border-l-4 border-blue-200 px-4 py-2 my-1 rounded-r-lg font-mono text-sm"
          >
            {formatCodeLine(line)}
          </div>
        )
      }

      // Compiler command
      if (line.startsWith("gcc ")) {
        return (
          <div key={index} className="text-slate-600 font-mono text-sm bg-slate-100 px-3 py-1 rounded-md my-1">
            {line}
          </div>
        )
      }

      // Default formatting
      return (
        <div key={index} className="text-slate-700 py-0.5">
          {formatLineWithSyntax(line)}
        </div>
      )
    })
  }

  const formatLineWithSyntax = (line: string) => {
    // Highlight file references
    const fileRefMatch = line.match(/^([^:]+):(\d+):(\d+):/)
    if (fileRefMatch) {
      const [, file, lineNum, col] = fileRefMatch
      const rest = line.substring(fileRefMatch[0].length)
      return (
        <>
          <span className="text-blue-600 font-medium">{file}</span>
          <span className="text-slate-400">:</span>
          <span className="text-amber-600 font-medium">{lineNum}</span>
          <span className="text-slate-400">:</span>
          <span className="text-amber-600 font-medium">{col}</span>
          <span className="text-slate-400">:</span>
          <span className="ml-1">{rest}</span>
        </>
      )
    }

    return line
  }

  const formatCodeLine = (line: string) => {
    const parts = line.split("|")
    if (parts.length >= 2) {
      const lineNum = parts[0].trim()
      const code = parts.slice(1).join("|").trim()
      return (
        <>
          <span className="text-slate-500 mr-3 select-none">{lineNum.padStart(3)}</span>
          <span className="text-slate-400 mr-3 select-none">|</span>
          <span className="text-slate-800">{formatCCode(code)}</span>
        </>
      )
    }
    return line
  }

  const formatCCode = (code: string) => {
    // Simple C syntax highlighting for code snippets
    let formatted = code

    // Keywords
    const keywords = ["int", "char", "float", "double", "void", "return", "if", "else", "for", "while", "include"]
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g")
      formatted = formatted.replace(regex, `<span class="text-blue-600 font-medium">${keyword}</span>`)
    })

    // Strings
    formatted = formatted.replace(/"([^"]*)"/g, '<span class="text-emerald-600">"$1"</span>')

    // Functions
    formatted = formatted.replace(/(\w+)\s*\(/g, '<span class="text-red-500">$1</span>(')

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />
  }

  return (
    <div
      ref={terminalRef}
      className="h-full bg-white/60 backdrop-blur-sm text-slate-700 text-sm p-6 overflow-y-auto rounded-lg"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {output ? (
        <div className="space-y-1">{formatOutput(output)}</div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-slate-400">
            <div className="text-4xl mb-4">👋</div>
            <p className="text-lg font-medium mb-2">Ready to code!</p>
            <p className="text-sm">Click "Compile & Run" to see your program's output here</p>
          </div>
        </div>
      )}
    </div>
  )
}
