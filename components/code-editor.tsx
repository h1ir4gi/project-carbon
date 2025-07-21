"use client";

import React, { useState } from "react";
import CodeEditorCore from "./code-editor-core";
import { StdinTextarea } from "./stdin-textarea";
import CompileButton from "./compile-button";

const defaultCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

export default function CodeEditor({
    setOutput,
}: {
    setOutput: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [isCompiling, setIsCompiling] = useState(false);
    const [code, setCode] = useState(defaultCode);
    const [stdin, setStdin] = useState("");

    const handleCompile = async () => {
      setIsCompiling(true);
      setOutput("✨ Starting compilation...\n");

      try {
        const response = await fetch("/api/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: code, stdin }),
        });

        if (!response.ok) {
          const err = await response.json();
          setOutput(`❌ Error: ${err.error || "Unknown error"}`);
        } else {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          if (reader) {
            let { done, value } = await reader.read();
            while (!done) {
                setOutput(prev => prev + decoder.decode(value));
              ({done, value} = await reader.read());
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setOutput(`❌ Unexpected error: ${error.message}`);
        } else {
          setOutput("❌ An unknown error occurred.");
        }
      } finally {
        setIsCompiling(false);
      }
    };

    return (
        <>
            <div className="bg-white/60 backdrop-blur-sm px-6 py-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-sm font-medium text-slate-700">
                        main.c
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                        Ready to code
                    </span>
                </div>
            </div>
            <div className="flex-1 bg-white/40 backdrop-blur-sm overflow-hidden">
                <div className="h-full overflow-auto">
                    <CodeEditorCore value={code} onChange={setCode} />
                </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border-t border-slate-200/60">
                <StdinTextarea stdin={stdin} setStdin={setStdin} />
            </div>
            <div className="p-6 bg-white/60 backdrop-blur-sm border-t border-slate-200/60">
                <CompileButton
                    onCompile={handleCompile}
                    isCompiling={isCompiling}
                />
            </div>
        </>
    );
}
