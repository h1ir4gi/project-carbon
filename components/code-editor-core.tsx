"use client";

import { useCallback, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
// import { EditorView } from "@codemirror/view";
import { EditorState, Transaction } from "@codemirror/state";
import toast from "react-hot-toast";

const maxCharLimit = 10000;

interface CodeEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
    const handleChange = useCallback(
        (val: string) => {
            onChange(val);
        },
        [onChange]
    );

    const limitInputExtension = useMemo(() => EditorState.transactionFilter.of((tr: Transaction) => {
        const newText = tr.newDoc.toString();
        if (tr.docChanged && newText.length > maxCharLimit) {
            toast.error("Character limit reached", {
                id: "character-limit-error",
                position: "top-right",
                style: {
                    backgroundColor: "#ffe0e0",
                    color: "#c00",
                    border: "1px solid #c00",
                    fontSize: "14px",
                  },
              });
            return []; 
        }
        return tr;
    }), []);

    const extensions = useMemo(() => [
        cpp(),
        // EditorView.theme({
        //     ".cm-scroller": { paddingBottom: "25em" },
        // }),
        limitInputExtension,
    ], [limitInputExtension]);

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
