const maxCharLimit = 100;

export function StdinTextarea({
    stdin,
    setStdin,
}: {
    stdin: string;
    setStdin: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <>
            <div className="px-6 py-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">
                        Program Input (stdin)
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                        Optional input for your program
                    </span>
                </div>
            </div>
            <div className="p-4">
                <textarea
                    value={stdin}
                    onChange={(e) => {
                        if (e.target.value.length <= maxCharLimit) {
                            setStdin(e.target.value);
                        }
                    }}
                    className="w-full h-20 p-3 bg-white border border-slate-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter input for your program here (e.g., numbers, text)..."
                    style={{
                        fontFamily:
                            "'Fira Code', 'SF Mono', Consolas, monospace",
                    }}
                />
                <p className="text-xs text-slate-500 mt-2">
                    💡 This input will be sent to your program's stdin when it
                    runs
                </p>
            </div>
        </>
    );
}
