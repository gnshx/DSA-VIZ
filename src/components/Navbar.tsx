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
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-mark">
            <Code2 size={22} color="#ffffff" />
          </div>
          <div>
            <div className="navbar-title">
              <span>
                DSA<em>-VIZ</em>
              </span>
              <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
                OBSERVABLE ENGINE
              </span>
            </div>
            <div className="navbar-subtitle">
              State-Driven Algorithmic Intelligence
            </div>
          </div>
        </div>

        <nav aria-label="Primary modes" className="nav-dock">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-current={currentMode === m.id ? "page" : undefined}
              onClick={() => onSelectMode(m.id)}
              className="nav-dock-btn"
              data-active={currentMode === m.id}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        <div className="navbar-controls">
          <div className="lang-dock" role="group" aria-label="Programming language">
            <Terminal size={14} color="var(--text-muted)" style={{ marginLeft: "0.4rem", marginRight: "0.1rem" }} />
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                aria-pressed={language === lang.id}
                onClick={() => onSelectLanguage(lang.id)}
                className="lang-dock-btn"
                data-active={language === lang.id}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="tooltip-container">
            <button
              type="button"
              onClick={onToggleTheme}
              className="btn btn-ghost btn-icon theme-toggle"
              data-theme={theme}
              style={{ borderRadius: "10px", border: "1px solid var(--border-subtle)" }}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              aria-pressed={theme === "light"}
            >
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="tooltip-text">
              {theme === "light" ? "Switch to Night Mode" : "Switch to Day Mode"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
