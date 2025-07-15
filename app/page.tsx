"use client"

import { useState } from "react"
import CodeEditor from "@/components/code-editor"
import Terminal from "@/components/terminal"
import { Button } from "@/components/ui/button"
import { Play, Code, TerminalIcon, Sparkles } from "lucide-react"

const defaultCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`

export default function CodeEditorApp() {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState("")
  const [isCompiling, setIsCompiling] = useState(false)
  const [stdin, setStdin] = useState("")

  const handleCompile = async () => {
    setIsCompiling(true)
    setOutput("✨ Starting compilation...\n")

    // Simulate compilation process
    //await new Promise((resolve) => setTimeout(resolve, 1200))

    setOutput(`YOU INPUTTED: ${stdin}\n THE CODE WAS: ${code}`)

    setIsCompiling(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800">PROJECT CARBON</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-600">
            <Sparkles className="w-4 h-4" />
            <span>Perfect for beginners</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left side - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white/60 backdrop-blur-sm px-6 py-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700">main.c</span>
              <span className="text-xs text-slate-500 ml-2">Ready to code</span>
            </div>
          </div>
          <div className="flex-1 bg-white/40 backdrop-blur-sm">
            <CodeEditor value={code} onChange={setCode} language="c" />
          </div>
          {/* Stdin Input Area */}
          <div className="bg-white/60 backdrop-blur-sm border-t border-slate-200/60">
            <div className="px-6 py-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Program Input (stdin)</span>
                <span className="text-xs text-slate-500 ml-2">Optional input for your program</span>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="w-full h-20 p-3 bg-white border border-slate-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter input for your program here (e.g., numbers, text)..."
                style={{
                  fontFamily: "'Fira Code', 'SF Mono', Consolas, monospace",
                }}
              />
              <p className="text-xs text-slate-500 mt-2">
                💡 This input will be sent to your program's stdin when it runs
              </p>
            </div>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm border-t border-slate-200/60">
            <Button
              onClick={handleCompile}
              disabled={isCompiling}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              <Play className="w-5 h-5 mr-2" />
              {isCompiling ? "Compiling your code..." : "Compile & Run"}
            </Button>
          </div>
        </div>

        {/* Right side - Terminal Output */}
        <div className="flex-1 flex flex-col border-l border-slate-200/60">
          <div className="bg-white/60 backdrop-blur-sm px-6 py-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Output</span>
              <span className="text-xs text-slate-500 ml-2">Your results will appear here</span>
            </div>
          </div>
          <div className="flex-1 bg-white/40 backdrop-blur-sm">
            <Terminal output={output} />
          </div>
        </div>
      </div>
    </div>
  )
}
