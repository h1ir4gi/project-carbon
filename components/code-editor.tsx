"use client";

import React, { useState } from "react";
import CodeEditorCore from "./code-editor-core";
import { StdinTextarea } from "./stdin-textarea";
import CompileButton from "./compile-button";
import { examplePrograms } from "./example-programs";
import DropdownMenu from "./dropdown-menu";

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
    const [selectedExample, setSelectedExample] = useState("")

    const handleExampleSelect = (exampleKey: string) => {
        if (exampleKey && examplePrograms[exampleKey as keyof typeof examplePrograms]) {
            const example = examplePrograms[exampleKey as keyof typeof examplePrograms]
            setCode(example.code)
            setStdin(example.stdin)
            setSelectedExample(exampleKey)
            setOutput("") 
        }
    }

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
            const data = await response.json();
            // console.log(data);  
            setOutput(data);
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
                    <span className="text-sm font-medium text-slate-700">main.c</span>
                    <span className="text-xs text-slate-500 ml-2">Ready to code</span>
                    <div className="ml-auto">
                        <DropdownMenu selectedExample={selectedExample} handleExampleSelect={handleExampleSelect} />
                    </div>
                </div>
            </div>
            <div className="h-full overflow-auto">
                <CodeEditorCore value={code} onChange={setCode} />
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
