"use client"

import { Code, Sparkles } from "lucide-react";

export default function Header() {
    return (
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-800">
                        DCC-HELP
                    </h1>
                </div>
                <div className="ml-auto flex items-center gap-2 text-sm text-slate-600">
                    <Sparkles className="w-4 h-4" />
                    <span>Perfect for beginners</span>
                </div>
            </div>
        </div>
    );
}
