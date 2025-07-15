import { TerminalIcon } from "lucide-react";

export default function Terminal({ output }: { output: string }) {
    return (
        <>
            <div className="bg-white/60 backdrop-blur-sm px-6 py-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                        Output
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                        Your results will appear here
                    </span>
                </div>
            </div>
            <div className="flex-1 bg-white/40 backdrop-blur-sm">
                <Terminal output={output} />
            </div>
        </>
    );
}
