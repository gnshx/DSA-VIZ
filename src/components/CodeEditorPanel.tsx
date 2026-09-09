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
  onLanguageChange
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
    <div
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden"
      }}
    >
      {/* Editor Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.6rem 1rem",
          background: "rgba(0, 0, 0, 0.3)",
          borderBottom: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileCode2 size={16} color="var(--indigo-400)" />
          <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
            solution{getLanguageExtension(language)}
          </span>
          <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
            {language.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={handleCopy}
            className="btn btn-ghost"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", height: "28px" }}
            title="Copy Code"
          >
            {copied ? <Check size={13} color="var(--emerald-400)" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Code Text Area with Line Number Sync */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem 0",
          background: "var(--bg-code)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          lineHeight: "1.6"
        }}
      >
        {lines.map((lineText, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={lineNumber}
              className={isActive ? "code-active-line" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 1rem",
                position: "relative",
                background: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                transition: "background var(--transition-fast)"
              }}
            >
              {/* Line Number */}
              <span
                style={{
                  width: "36px",
                  userSelect: "none",
                  textAlign: "right",
                  paddingRight: "1rem",
                  color: isActive ? "var(--cyan-400)" : "var(--text-dim)",
                  fontWeight: isActive ? 700 : 400,
                  fontSize: "0.75rem"
                }}
              >
                {lineNumber}
              </span>

              {/* Active Marker Arrow */}
              <span
                style={{
                  width: "14px",
                  color: "var(--cyan-400)",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  visibility: isActive ? "visible" : "hidden"
                }}
              >
                ➔
              </span>

              {/* Code Line Content */}
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre",
                  color: isActive ? "#ffffff" : "var(--text-primary)",
                  fontWeight: isActive ? 600 : 400,
                  overflowX: "auto"
                }}
              >
                {lineText || " "}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
