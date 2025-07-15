"use client"

import { Play } from "lucide-react";
import { Button } from "./ui/button";

export default function CompileButton({
    onCompile,
    isCompiling,
}: {
    onCompile: () => void;
    isCompiling: boolean;
}) {
    return (
        <Button
            onClick={onCompile}
            disabled={isCompiling}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
            <Play className="w-5 h-5 mr-2" />
            {isCompiling ? "Compiling your code..." : "Compile & Run"}
        </Button>
    );
}
