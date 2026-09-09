import React, { useState, useEffect } from "react";
import { ALL_ALGORITHMS } from "../engine/algorithms";
import { AlgorithmDefinition, SupportedLanguage } from "../types/algorithm";
import { parseUserInput } from "../engine/codeTracer";
import { SimulationStage } from "../visualizers/SimulationStage";
import { UniversalTimeline } from "../components/UniversalTimeline";
import { ComputerVisionHUD } from "../components/ComputerVisionHUD";
import { MemoryInspector } from "../components/MemoryInspector";
import { CallStackPanel } from "../components/CallStackPanel";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { Play, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

interface VisualizeViewProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  initialAlgorithmId?: string;
}

export const VisualizeView: React.FC<VisualizeViewProps> = ({
  language,
  onSelectLanguage,
  initialAlgorithmId
}) => {
  const initialAlgo =
    ALL_ALGORITHMS.find((a) => a.id === initialAlgorithmId) || ALL_ALGORITHMS[0];

  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmDefinition>(initialAlgo);
  const [customInputText, setCustomInputText] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Sync if initialAlgorithmId prop updates
  useEffect(() => {
    if (initialAlgorithmId) {
      const match = ALL_ALGORITHMS.find((a) => a.id === initialAlgorithmId);
      if (match) {
        setSelectedAlgo(match);
        setCurrentStep(1);
        setIsPlaying(false);
      }
    }
  }, [initialAlgorithmId]);

  // Generate trace based on custom or default input
  const parsedInput = customInputText
    ? parseUserInput(customInputText, selectedAlgo.structureType)
    : undefined;

  const trace = selectedAlgo.generateTrace(parsedInput);
  const currentEvent =
    trace.events[Math.min(currentStep - 1, trace.events.length - 1)] || trace.events[0];

  // Playback timer
  useEffect(() => {
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

  const handleAlgoChange = (algoId: string) => {
    const found = ALL_ALGORITHMS.find((a) => a.id === algoId);
    if (found) {
      setSelectedAlgo(found);
      setCustomInputText("");
      setCurrentStep(1);
      setIsPlaying(false);
    }
  };

  const handleApplyCustomInput = () => {
    setCurrentStep(1);
    setIsPlaying(false);
  };

  return (
    <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Top Toolbar: Algorithm Selector & Custom Input Bar */}
      <div
        className="glass-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {/* Algorithm Picker */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
              ALGORITHM:
            </span>
            <select
              value={selectedAlgo.id}
              onChange={(e) => handleAlgoChange(e.target.value)}
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-medium)",
                borderRadius: "8px",
                padding: "0.45rem 0.85rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer"
              }}
            >
              {ALL_ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} ({algo.structureType.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Custom Input Field for Arrays/Heaps/Strings */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
              CUSTOM INPUT:
            </span>
            <input
              type="text"
              placeholder={
                selectedAlgo.structureType === "stack"
                  ? "e.g. ({[]})"
                  : "e.g. 7, 2, 9, 1, 5"
              }
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "0.4rem 0.75rem",
                fontSize: "0.825rem",
                fontFamily: "var(--font-mono)",
                width: "220px",
                outline: "none"
              }}
            />
            <button
              onClick={handleApplyCustomInput}
              className="btn btn-secondary"
              style={{ padding: "0.4rem 0.75rem", fontSize: "0.775rem" }}
            >
              Run Trace
            </button>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="badge badge-cyan">{selectedAlgo.timeComplexity}</span>
          <span className="badge badge-emerald">{selectedAlgo.spaceComplexity}</span>
          <span className="badge badge-indigo">
            {trace.totalSteps} TRACE STEPS
          </span>
        </div>
      </div>

      {/* Main 3-Pane Workbench */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr 340px",
          gap: "1rem",
          minHeight: "560px"
        }}
      >
        {/* Left Pane: Code Studio with Active Line Sync */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CodeEditorPanel
            code={selectedAlgo.code[language]}
            language={language}
            activeLine={currentEvent.sourceLine}
            onLanguageChange={onSelectLanguage}
          />
        </div>

        {/* Center Pane: Dynamic Simulation Canvas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ flex: 1 }}>
            <SimulationStage
              event={currentEvent}
              title={selectedAlgo.name}
              onReset={() => {
                setCurrentStep(1);
                setIsPlaying(false);
              }}
            />
          </div>

          {/* Timeline Scrubber */}
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

        {/* Right Pane: State & Memory Inspector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <ComputerVisionHUD event={currentEvent} />
          <div style={{ flex: 1, minHeight: "220px" }}>
            <MemoryInspector event={currentEvent} />
          </div>
          <div style={{ height: "160px" }}>
            <CallStackPanel callStack={currentEvent.callStack} />
          </div>
        </div>
      </div>
    </div>
  );
};
