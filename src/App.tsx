import React, { useState, useEffect } from "react";
import { Navbar, AppMode } from "./components/Navbar";
import { SupportedLanguage } from "./types/algorithm";
import { LearnView } from "./views/LearnView";
import { VisualizeView } from "./views/VisualizeView";
import { PredictView } from "./views/PredictView";
import { Sparkles, Terminal } from "lucide-react";

export function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>("visualize");
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string>("binary_search");

  const handleNavigateToVisualize = (algoId?: string) => {
    if (algoId) {
      setSelectedAlgorithmId(algoId);
    }
    setCurrentMode("visualize");
  };

  // Day/Night Theme Pilot State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("dsa_viz_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dsa_viz_theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* Navbar with mode routing, multi-language switch, and theme pilot */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        language={language}
        onSelectLanguage={setLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Container */}
      <main id="main-content" className="app-main">
        {currentMode === "learn" && (
          <LearnView
            selectedAlgorithmId={selectedAlgorithmId}
            onSelectAlgorithm={setSelectedAlgorithmId}
            onNavigateToVisualize={handleNavigateToVisualize}
          />
        )}
        {currentMode === "visualize" && (
          <VisualizeView
            language={language}
            onSelectLanguage={setLanguage}
            selectedAlgorithmId={selectedAlgorithmId}
            onSelectAlgorithm={setSelectedAlgorithmId}
          />
        )}
        {currentMode === "predict" && (
          <PredictView
            language={language}
            selectedAlgorithmId={selectedAlgorithmId}
            onSelectAlgorithm={setSelectedAlgorithmId}
          />
        )}
      </main>

      {/* Global Status Footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="app-footer-brand">
            <strong>DSA-VIZ</strong>
            <span aria-hidden="true">•</span>
            <span className="app-footer-tagline">
              &quot;Don&apos;t visualize code. Visualize the state changes caused by code.&quot;
            </span>
          </div>

          <div className="app-footer-meta">
            <span className="app-footer-item">
              <Terminal size={14} color="var(--indigo-400)" />
              Languages: Python • JavaScript • C++ • Java
            </span>
            <span aria-hidden="true">•</span>
            <span className="app-footer-item">
              <Sparkles size={14} color="var(--emerald-400)" />
              Deterministic Execution Traces
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
