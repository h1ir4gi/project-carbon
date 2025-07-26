"use client";

import { useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";

const maxCharLimit = 10000;

interface CodeEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {

    const handleChange = useCallback(
        (val: string) => {
            if (val.length <= maxCharLimit) {
                onChange(val);
            }
        },
        [onChange]
    );

    /* choose theme lazily to avoid re-creating extensions on every render */
    const extensions = useMemo(() => [
        cpp(),
        EditorView.theme({
            ".cm-scroller": { paddingBottom: "25em" },
        }),
    ], ["25em"]);
    const cmTheme = vscodeLight;

    return (
        <CodeMirror
            value={value}
            height="100%"
            theme={cmTheme}
            extensions={extensions}
            basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
                autocompletion: true,
                syntaxHighlighting: true,
                tabSize: 4,
            }}
            onChange={handleChange}
            className="rounded-lg"
        />
    );
}
