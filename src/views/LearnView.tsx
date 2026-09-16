import React, { useState } from "react";
import { ALL_ALGORITHMS } from "../engine/algorithms";
import { AlgorithmDefinition, SupportedLanguage } from "../types/algorithm";
import { SimulationStage } from "../visualizers/SimulationStage";
import { UniversalTimeline } from "../components/UniversalTimeline";
import { ComputerVisionHUD } from "../components/ComputerVisionHUD";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { PatternNavigator } from "../components/PatternNavigator";
import {
  AlertTriangle,
  BookOpen,
  Clock,
  Layers,
  Lightbulb
} from "lucide-react";

interface LearnViewProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ language, onSelectLanguage }) => {
  const [activeTab, setActiveTab] = useState<"pathway" | "showcase">("showcase");
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmDefinition>(ALL_ALGORITHMS[0]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const trace = selectedAlgo.generateTrace();
  const currentEvent = trace.events[Math.min(currentStep - 1, trace.events.length - 1)] || trace.events[0];

  // Playback timer
  React.useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= trace.totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, trace.totalSteps]);

  const handleSelectAlgo = (algo: AlgorithmDefinition) => {
    setSelectedAlgo(algo);
    setCurrentStep(1);
    setIsPlaying(false);
  };

  const handleSelectAlgoById = (algoId: string) => {
    const found = ALL_ALGORITHMS.find((a) => a.id === algoId);
    if (found) {
      handleSelectAlgo(found);
      setActiveTab("pathway");
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {activeTab === "showcase" ? (
        <PatternNavigator
          onSelectSubcase={handleSelectAlgoById}
          selectedAlgorithmId={selectedAlgo.id}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header Bar when in Pathway Mode */}
          <div
            className="glass-panel"
            style={{
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              borderRadius: "14px"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge badge-indigo">GUIDED CONCEPT PATHWAY</span>
                <span className="badge badge-cyan">{selectedAlgo.difficulty}</span>
              </div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "0.4rem", letterSpacing: "-0.015em" }}>{selectedAlgo.name}</h1>
              <p style={{ color: "var(--text-secondary)", maxWidth: "820px", marginTop: "0.4rem", lineHeight: 1.55, fontSize: "0.9rem" }}>
                {selectedAlgo.description}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                onClick={() => setActiveTab("showcase")}
                className="btn btn-secondary"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  borderRadius: "8px"
                }}
              >
                <Layers size={15} />
                <span>Explore All Patterns</span>
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "240px" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Select Blueprint:
                </span>
                <select
                  value={selectedAlgo.id}
                  onChange={(e) => {
                    const found = ALL_ALGORITHMS.find((a) => a.id === e.target.value);
                    if (found) handleSelectAlgo(found);
                  }}
                  style={{
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  {ALL_ALGORITHMS.map((algo) => (
                    <option key={algo.id} value={algo.id}>
                      {algo.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Complexity & Core Invariants Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {/* Time & Space Complexity */}
            <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", borderRadius: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={18} color="var(--amber-400)" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Complexity Blueprint</h3>
              </div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>Time:</span>
                  <div style={{ fontSize: "1.15rem", fontFamily: "var(--font-mono)", color: "var(--cyan-400)", fontWeight: 700 }}>
                    {selectedAlgo.timeComplexity}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>Aux Space:</span>
                  <div style={{ fontSize: "1.15rem", fontFamily: "var(--font-mono)", color: "var(--emerald-400)", fontWeight: 700 }}>
                    {selectedAlgo.spaceComplexity}
                  </div>
                </div>
              </div>
            </div>

            {/* Mental Model */}
            <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", borderRadius: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Lightbulb size={18} color="var(--cyan-400)" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Mental Model</h3>
              </div>
              <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                {selectedAlgo.mentalModel.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "0.3rem" }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Common Traps */}
            <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", borderRadius: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertTriangle size={18} color="var(--rose-400)" />
                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Common Pitfalls</h3>
              </div>
              <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                {selectedAlgo.commonMistakes.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "0.3rem" }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Synchronized Simulation & Code Stage */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem", minHeight: "540px" }}>
            {/* Left: Simulation Canvas & Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ flex: 1 }}>
                <SimulationStage
                  event={currentEvent}
                  title={`${selectedAlgo.name} Simulation`}
                  onReset={() => {
                    setCurrentStep(1);
                    setIsPlaying(false);
                  }}
                />
              </div>

              <UniversalTimeline
                currentStep={currentStep}
                totalSteps={trace.totalSteps}
                isPlaying={isPlaying}
                playbackSpeed={speed}
                onStepChange={(s) => setCurrentStep(s)}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onSpeedChange={(sp) => setSpeed(sp)}
              />
            </div>

            {/* Right: Code Sync & What Computer Sees */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <ComputerVisionHUD event={currentEvent} />
              <div style={{ flex: 1, minHeight: "360px" }}>
                <CodeEditorPanel
                  code={selectedAlgo.code[language]}
                  language={language}
                  activeLine={currentEvent.sourceLine}
                  onLanguageChange={onSelectLanguage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

