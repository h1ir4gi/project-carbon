"use client"

import { Code, Sparkles } from "lucide-react";
const assetPath = process.env.NEXTJS_PUBLIC_BASE ?? "";

export default function Header() {
    return (
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <img src={assetPath + "/logo.svg"} />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-800">
                        dcc-help
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
