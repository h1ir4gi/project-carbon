"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { examplePrograms } from "./example-programs";

type DropdownMenuProps = {
    selectedExample: string;
    handleExampleSelect: (exampleKey: string) => void;
};

export default function DropdownMenu({
    selectedExample,
    handleExampleSelect,
}: DropdownMenuProps) {
    return (
        <Select value={selectedExample} onValueChange={handleExampleSelect}>
            <SelectTrigger className="w-56 h-8 text-sm">
                <SelectValue placeholder="Load example program..." />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(examplePrograms).map(([key, example]) => (
                    <SelectItem key={key} value={key} className="text-base">
                        <div className="flex flex-col items-start">
                            <span className="text-base font-normal">{example.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
                    