import React, { useState } from "react";
import { Navbar, AppMode } from "./components/Navbar";
import { SupportedLanguage } from "./types/algorithm";
import { LearnView } from "./views/LearnView";
import { VisualizeView } from "./views/VisualizeView";
import { SolveView } from "./views/SolveView";
import { PredictView } from "./views/PredictView";
import { ReviseView } from "./views/ReviseView";
import { Code2, Sparkles, Terminal } from "lucide-react";

export function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>("visualize");
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string>("binary_search");

  const handleSelectAlgorithm = (algoId: string) => {
    setSelectedAlgorithmId(algoId);
    setCurrentMode("visualize");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      {/* Navbar with mode routing and multi-language switch */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        language={language}
        onSelectLanguage={setLanguage}
      />

      {/* Main View Container */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {currentMode === "learn" && (
          <LearnView language={language} onSelectLanguage={setLanguage} />
        )}
        {currentMode === "visualize" && (
          <VisualizeView
            language={language}
            onSelectLanguage={setLanguage}
            initialAlgorithmId={selectedAlgorithmId}
          />
        )}
        {currentMode === "solve" && (
          <SolveView language={language} onSelectLanguage={setLanguage} />
        )}
        {currentMode === "predict" && <PredictView language={language} />}
        {currentMode === "revise" && (
          <ReviseView onSelectAlgorithm={handleSelectAlgorithm} />
        )}
      </main>

      {/* Global Status Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(8, 12, 20, 0.9)",
          padding: "1rem 1.5rem",
          marginTop: "auto"
        }}
      >
        <div
          style={{
            maxWidth: "1800px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>DSA-VIZ</span>
            <span>•</span>
            <span style={{ color: "var(--cyan-400)" }}>
              "Don't visualize code. Visualize the state changes caused by code."
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Terminal size={14} color="var(--indigo-400)" />
              Languages: Python • JavaScript • C++ • Java
            </span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
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
