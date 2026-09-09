import React from "react";
import { SupportedLanguage } from "../types/algorithm";
import { Activity, BookOpen, Brain, CheckCircle2, Code2, Network, Terminal } from "lucide-react";

export type AppMode = "learn" | "visualize" | "solve" | "predict" | "revise";

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  language,
  onSelectLanguage
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode }[] = [
    { id: "learn", label: "Learn", icon: <BookOpen size={16} /> },
    { id: "visualize", label: "Visualize", icon: <Activity size={16} /> },
    { id: "solve", label: "Solve", icon: <CheckCircle2 size={16} /> },
    { id: "predict", label: "Predict Mode", icon: <Brain size={16} /> },
    { id: "revise", label: "Revise & Graph", icon: <Network size={16} /> }
  ];

  const languages: { id: SupportedLanguage; label: string }[] = [
    { id: "python", label: "Python" },
    { id: "javascript", label: "JavaScript" },
    { id: "cpp", label: "C++" },
    { id: "java", label: "Java" }
  ];

  return (
    <header
      style={{
        background: "rgba(8, 12, 20, 0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0.65rem 1.5rem"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1800px",
          margin: "0 auto",
          gap: "1.5rem"
        }}
      >
        {/* Brand & North Star */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--indigo-500), var(--cyan-500))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-glow-indigo)"
            }}
          >
            <Code2 size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                DSA<span style={{ color: "var(--cyan-400)" }}>-VIZ</span>
              </span>
              <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
                OBSERVABLE ENGINE
              </span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.01em" }}>
              Make Computation Observable
            </div>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(255, 255, 255, 0.04)", padding: "0.3rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className="btn"
                style={{
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.825rem",
                  background: isActive ? "linear-gradient(135deg, var(--indigo-500), #4f46e5)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--text-secondary)",
                  boxShadow: isActive ? "0 2px 10px rgba(99, 102, 241, 0.35)" : "none",
                  border: "none"
                }}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Language Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255, 255, 255, 0.03)", padding: "0.25rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
            <Terminal size={14} color="var(--text-muted)" style={{ marginLeft: "0.4rem" }} />
            {languages.map((lang) => {
              const isSelected = language === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => onSelectLanguage(lang.id)}
                  style={{
                    border: "none",
                    background: isSelected ? "rgba(6, 182, 212, 0.2)" : "transparent",
                    color: isSelected ? "var(--cyan-400)" : "var(--text-muted)",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
