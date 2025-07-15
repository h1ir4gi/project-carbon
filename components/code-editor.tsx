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

        // Simulate compilation process
        //await new Promise((resolve) => setTimeout(resolve, 1200))

        setOutput(`YOU INPUTTED: ${stdin}\n THE CODE WAS: ${code}`);

        setIsCompiling(false);
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
