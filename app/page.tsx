"use client";

import CodeEditor from "@/components/code-editor";
import Header from "@/components/header";
import Terminal from "@/components/terminal-core";
import { useState } from "react";

export default function CodeEditorApp() {
    const [output, setOutput] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Header />
            <div className="flex h-[calc(100vh-73px)]">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <CodeEditor setOutput={setOutput} />
                </div>
                <div className="flex-1 flex flex-col border-l border-slate-200/60">
                    <Terminal output={output} />
                </div>
            </div>
        </div>
    );
}
