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
      if (line.startsWith("Don't understand?")) {
        return (
          <div key={index} className="text-slate-700 py-0.5"/>
        )
      }
      // replace program name with main.c
      if (line.includes("/tmp/program.c")) {
        line = line.replace("/tmp/program.c", "main.c")
      }
      // Success messages
      if (line.startsWith("[!]")) {
        return (
          <div key={index} className="text-red-600 py-1 font-bold">
            {line}
          </div>
        )
      }

      // dcc-help line
      if (line.startsWith("[?]")) {
        return (
          <div key={index} className="text-emerald-600 py-1 font-bold">
            {line}
          </div>
        )
      }

      // Error messages
      if (line.includes("error:")) {
        return (
          <div key={index} className="text-red-500 font-medium py-1">
            {formatLineWithSyntax(line)}
          </div>
        )
      }

      // Warning messages
      if (line.includes("warning:")) {
        return (
          <div key={index} className="text-amber-600 font-medium py-1">
            {formatLineWithSyntax(line)}
          </div>
        )
      }

      // Info messages from dcc-help
      if (line.startsWith("#")) {
        return (
          <div key={index} className="text-blue-600 font-medium py-1">
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


  return (
    <div
      ref={terminalRef}
      className="h-full bg-white/60 backdrop-blur-sm text-slate-700 text-sm p-12 overflow-y-auto rounded-lg font-mono"
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
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
