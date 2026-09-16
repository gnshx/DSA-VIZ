import React from "react";
import { SupportedLanguage } from "../types/algorithm";
import { Activity, BookOpen, Brain, Code2, Sun, Moon, Terminal } from "lucide-react";

export type AppMode = "learn" | "visualize" | "predict";

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  language,
  onSelectLanguage,
  theme,
  onToggleTheme
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode }[] = [
    { id: "learn", label: "Learn & Catalog", icon: <BookOpen size={16} /> },
    { id: "visualize", label: "Visualize Workbench", icon: <Activity size={16} /> },
    { id: "predict", label: "Predict Mode", icon: <Brain size={16} /> }
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
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0.6rem 1.5rem",
        transition: "background var(--transition-normal)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1800px",
          margin: "0 auto",
          gap: "1rem",
          flexWrap: "wrap"
        }}
      >
        {/* Brand & North Star */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--indigo-500), var(--cyan-500))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-glow-indigo)",
              flexShrink: 0
            }}
          >
            <Code2 size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                DSA<span style={{ color: "var(--cyan-400)" }}>-VIZ</span>
              </span>
              <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
                OBSERVABLE ENGINE
              </span>
            </div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", letterSpacing: "0.01em" }}>
              State-Driven Algorithmic Intelligence
            </div>
          </div>
        </div>

        {/* Mode Navigation Dock (3 Core Pillars) */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "var(--bg-tertiary)",
            padding: "0.3rem",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)"
          }}
        >
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className="btn"
                style={{
                  padding: "0.45rem 0.95rem",
                  fontSize: "0.825rem",
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? "linear-gradient(135deg, var(--indigo-500), #4f46e5)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--text-secondary)",
                  boxShadow: isActive ? "0 2px 10px rgba(99, 102, 241, 0.35)" : "none",
                  border: "none",
                  borderRadius: "8px"
                }}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Language Selector & Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {/* Multi-language Selector Pill Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "var(--bg-tertiary)",
              padding: "0.25rem",
              borderRadius: "10px",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <Terminal size={14} color="var(--text-muted)" style={{ marginLeft: "0.4rem", marginRight: "0.1rem" }} />
            {languages.map((lang) => {
              const isSelected = language === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => onSelectLanguage(lang.id)}
                  style={{
                    border: "none",
                    background: isSelected ? "var(--indigo-glow)" : "transparent",
                    color: isSelected ? "var(--cyan-400)" : "var(--text-muted)",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.775rem",
                    padding: "0.35rem 0.65rem",
                    minHeight: "32px",
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

          {/* Theme Toggle Button */}
          <div className="tooltip-container">
            <button
              onClick={onToggleTheme}
              className="btn btn-ghost btn-icon"
              style={{
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                background: theme === "light" ? "rgba(245, 158, 11, 0.15)" : "rgba(99, 102, 241, 0.15)",
                color: theme === "light" ? "var(--amber-500)" : "var(--indigo-400)",
                transition: "all var(--transition-fast)"
              }}
              aria-label="Toggle Theme Pilot"
            >
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="tooltip-text">
              {theme === "light" ? "Switch to Night Mode 🌙" : "Switch to Day Mode ☀️"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
