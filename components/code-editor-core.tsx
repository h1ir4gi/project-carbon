"use client";

import { useCallback, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import { EditorState, Transaction } from "@codemirror/state";
import toast from "react-hot-toast";

// NOTE: does lot allow maxCharLimit to be 0.
const maxCharLimit = Number(process.env.MAX_SOURCE_LEN) || 10000;

interface CodeEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {

    const limitInputExtension = useMemo(() => EditorState.changeFilter.of((tr: Transaction) => {
        const inputLen = tr.newDoc.length;
        if (tr.docChanged && inputLen > maxCharLimit) {
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
            return false; 
        }
        return true;
    }), []);

    const extensions = useMemo(() => [
        cpp(),
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
            onChange={onChange}
            className="rounded-lg"
        />
    );
}
