import React, { useState } from "react";
import { ALL_ALGORITHMS } from "../engine/algorithms";
import { AlgorithmDefinition, SupportedLanguage } from "../types/algorithm";
import { SimulationStage } from "../visualizers/SimulationStage";
import { UniversalTimeline } from "../components/UniversalTimeline";
import { ComputerVisionHUD } from "../components/ComputerVisionHUD";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Code2,
  Database,
  Lightbulb
} from "lucide-react";

interface LearnViewProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ language, onSelectLanguage }) => {
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

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Course Header & Algorithm Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-indigo">GUIDED CONCEPT PATHWAY</span>
            <span className="badge badge-cyan">{selectedAlgo.difficulty}</span>
          </div>
          <h1 style={{ fontSize: "2rem", marginTop: "0.4rem" }}>{selectedAlgo.name}</h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "800px", marginTop: "0.4rem", lineHeight: 1.5 }}>
            {selectedAlgo.description}
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", maxWidth: "600px" }}>
          {ALL_ALGORITHMS.map((algo) => {
            const isSelected = selectedAlgo.id === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => handleSelectAlgo(algo)}
                className="btn"
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.78rem",
                  background: isSelected ? "var(--indigo-500)" : "rgba(255, 255, 255, 0.04)",
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  border: isSelected ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)"
                }}
              >
                {algo.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Complexity & Core Invariants Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {/* Time & Space Complexity */}
        <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={18} color="var(--amber-400)" />
            <h3 style={{ fontSize: "0.95rem", margin: 0 }}>Complexity Blueprint</h3>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Time:</span>
              <div style={{ fontSize: "1.1rem", fontFamily: "var(--font-mono)", color: "var(--cyan-400)", fontWeight: 700 }}>
                {selectedAlgo.timeComplexity}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Aux Space:</span>
              <div style={{ fontSize: "1.1rem", fontFamily: "var(--font-mono)", color: "var(--emerald-400)", fontWeight: 700 }}>
                {selectedAlgo.spaceComplexity}
              </div>
            </div>
          </div>
        </div>

        {/* Mental Model */}
        <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lightbulb size={18} color="var(--cyan-400)" />
            <h3 style={{ fontSize: "0.95rem", margin: 0 }}>Mental Model</h3>
          </div>
          <ul style={{ paddingLeft: "1.2rem", fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            {selectedAlgo.mentalModel.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "0.25rem" }}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Common Traps */}
        <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={18} color="var(--rose-400)" />
            <h3 style={{ fontSize: "0.95rem", margin: 0 }}>Common Pitfalls</h3>
          </div>
          <ul style={{ paddingLeft: "1.2rem", fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            {selectedAlgo.commonMistakes.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "0.25rem" }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Synchronized Simulation & Code Stage */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "1.5rem", minHeight: "520px" }}>
        {/* Left: Simulation Canvas & Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ComputerVisionHUD event={currentEvent} />
          <div style={{ flex: 1, minHeight: "340px" }}>
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
  );
};
