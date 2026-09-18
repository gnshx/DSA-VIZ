import React, { useState } from "react";
import { SupportedLanguage } from "../types/algorithm";
import { Check, Copy, FileCode2 } from "lucide-react";

interface CodeEditorPanelProps {
  code: string;
  language: SupportedLanguage;
  activeLine: number;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  language,
  activeLine,
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageExtension = (lang: SupportedLanguage) => {
    switch (lang) {
      case "python":
        return ".py";
      case "javascript":
        return ".js";
      case "cpp":
        return ".cpp";
      case "java":
        return ".java";
    }
  };

  return (
    <div className="glass-panel editor">
      <div className="editor-header">
        <div className="editor-file">
          <FileCode2 size={16} color="var(--indigo-400)" />
          <span className="editor-filename">
            solution{getLanguageExtension(language)}
          </span>
          <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
            {language.toUpperCase()}
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-ghost editor-copy-btn"
            title="Copy code"
            aria-live="polite"
          >
            {copied ? <Check size={13} color="var(--emerald-400)" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div className="editor-body" role="log" aria-label={`Active line ${activeLine}`}>
        {lines.map((lineText, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={lineNumber}
              className={isActive ? "editor-line code-active-line" : "editor-line"}
              data-active={isActive}
            >
              <span className="editor-gutter">
                {lineNumber}
              </span>

              <span className="editor-marker" aria-hidden="true">
                ➔
              </span>

              <pre className="editor-code">
                {lineText || " "}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
