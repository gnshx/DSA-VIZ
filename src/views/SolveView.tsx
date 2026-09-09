import React, { useState } from "react";
import { ALL_PROBLEMS, ALL_ALGORITHMS } from "../engine/algorithms";
import { ProblemDefinition, SupportedLanguage } from "../types/algorithm";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { SimulationStage } from "../visualizers/SimulationStage";
import { UniversalTimeline } from "../components/UniversalTimeline";
import { CheckCircle2, Play, Terminal, Zap } from "lucide-react";

interface SolveViewProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const SolveView: React.FC<SolveViewProps> = ({ language, onSelectLanguage }) => {
  const [selectedProblem, setSelectedProblem] = useState<ProblemDefinition>(ALL_PROBLEMS[0]);
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Link problem to its trace generator
  const relatedAlgo =
    ALL_ALGORITHMS.find((a) => a.id === selectedProblem.algorithmId) || ALL_ALGORITHMS[0];

  const trace = relatedAlgo.generateTrace();
  const currentEvent =
    trace.events[Math.min(currentStep - 1, trace.events.length - 1)] || trace.events[0];

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

  const handleSelectProblem = (prob: ProblemDefinition) => {
    setSelectedProblem(prob);
    setSelectedTestIndex(0);
    setCurrentStep(1);
    setIsPlaying(false);
  };

  return (
    <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Problem Selection Pills */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
        {ALL_PROBLEMS.map((prob) => {
          const isSelected = selectedProblem.id === prob.id;
          return (
            <button
              key={prob.id}
              onClick={() => handleSelectProblem(prob)}
              className="btn"
              style={{
                background: isSelected ? "linear-gradient(135deg, var(--indigo-500), #4f46e5)" : "rgba(255, 255, 255, 0.04)",
                color: isSelected ? "#ffffff" : "var(--text-secondary)",
                border: isSelected ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                fontSize: "0.825rem",
                padding: "0.45rem 0.9rem",
                whiteSpace: "nowrap"
              }}
            >
              <CheckCircle2 size={14} color={isSelected ? "var(--cyan-400)" : "var(--text-muted)"} />
              <span>{prob.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "440px 1fr", gap: "1.25rem", minHeight: "620px" }}>
        {/* Left Column: Problem Statement & Starter Code */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Problem Statement Card */}
          <div className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "320px", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1.15rem", margin: 0 }}>{selectedProblem.title}</h2>
              <span className="badge badge-emerald">{selectedProblem.difficulty}</span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {selectedProblem.statement}
            </p>

            {/* Test Case Selection */}
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.4rem" }}>
                Test Cases
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {selectedProblem.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedTestIndex(idx);
                      setCurrentStep(1);
                    }}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                      background: selectedTestIndex === idx ? "rgba(99, 102, 241, 0.15)" : "rgba(0, 0, 0, 0.25)",
                      border: selectedTestIndex === idx ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      fontSize: "0.775rem",
                      fontFamily: "var(--font-mono)",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <span style={{ color: "var(--cyan-400)" }}>{ex.input}</span>
                    <span style={{ color: "var(--emerald-400)" }}>Expected: {ex.output}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Starter Code Editor */}
          <div style={{ flex: 1, minHeight: "260px" }}>
            <CodeEditorPanel
              code={selectedProblem.starterCode[language]}
              language={language}
              activeLine={currentEvent.sourceLine}
              onLanguageChange={onSelectLanguage}
            />
          </div>
        </div>

        {/* Right Column: Visual Test Runner Simulation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ flex: 1 }}>
            <SimulationStage
              event={currentEvent}
              title={`Test Case ${selectedTestIndex + 1}: ${selectedProblem.examples[selectedTestIndex]?.input}`}
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
      </div>
    </div>
  );
};
