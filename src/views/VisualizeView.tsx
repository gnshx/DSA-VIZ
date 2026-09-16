import React, { useState, useEffect } from "react";
import { ALL_ALGORITHMS } from "../engine/algorithms";
import { ALL_PATTERN_FAMILIES } from "../engine/patterns";
import { AlgorithmDefinition, SupportedLanguage } from "../types/algorithm";
import { parseUserInput } from "../engine/codeTracer";
import { SimulationStage } from "../visualizers/SimulationStage";
import { UniversalTimeline } from "../components/UniversalTimeline";
import { ComputerVisionHUD } from "../components/ComputerVisionHUD";
import { MemoryInspector } from "../components/MemoryInspector";
import { CallStackPanel } from "../components/CallStackPanel";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { PatternNavigator } from "../components/PatternNavigator";
import {
  Compass,
  ChevronDown,
  ChevronUp,
  Tag,
  Code2,
  Sparkles
} from "lucide-react";

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
  const [showPatternDirectory, setShowPatternDirectory] = useState(false);

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

  // Find active pattern family and subcase metadata
  const currentFamily = ALL_PATTERN_FAMILIES.find((fam) =>
    fam.subcases.some((sub) => sub.algorithmId === selectedAlgo.id)
  );
  const currentSubcase = currentFamily?.subcases.find(
    (sub) => sub.algorithmId === selectedAlgo.id
  );

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

  const handleSelectFromNavigator = (algoId: string) => {
    handleAlgoChange(algoId);
    setShowPatternDirectory(false);
  };

  const handleApplyCustomInput = () => {
    setCurrentStep(1);
    setIsPlaying(false);
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Pattern Catalog Collapsible Drawer Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "0.6rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          background: showPatternDirectory ? "var(--indigo-glow)" : "var(--bg-tertiary)",
          border: showPatternDirectory ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
          borderRadius: "10px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Compass size={18} color="var(--cyan-400)" />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
            DSA Pattern Master Catalog Drawer
          </span>
          <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>
            19 PATTERN FAMILIES
          </span>
        </div>

        <button
          onClick={() => setShowPatternDirectory(!showPatternDirectory)}
          className="btn btn-secondary"
          style={{ padding: "0.35rem 0.8rem", fontSize: "0.78rem" }}
        >
          {showPatternDirectory ? (
            <>
              <span>Close Directory Drawer</span>
              <ChevronUp size={14} />
            </>
          ) : (
            <>
              <span>Explore All Patterns & Subcases</span>
              <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>

      {/* Collapsible Pattern Directory */}
      {showPatternDirectory && (
        <div style={{ marginBottom: "0.5rem" }}>
          <PatternNavigator
            onSelectSubcase={handleSelectFromNavigator}
            selectedAlgorithmId={selectedAlgo.id}
          />
        </div>
      )}

      {/* Top Toolbar: Algorithm Selector & Custom Input Bar */}
      <div
        className="glass-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          flexWrap: "wrap",
          gap: "1rem",
          borderRadius: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {/* Algorithm Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
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
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
                maxWidth: "340px"
              }}
            >
              {ALL_ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Input Field */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              CUSTOM INPUT:
            </span>
            <input
              type="text"
              placeholder={
                selectedAlgo.structureType === "stack"
                  ? "e.g. 70, 72, 69, 75"
                  : "e.g. 1, 4, 6, 9, 12, 16, 23, 38, 56, 72"
              }
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              style={{
                background: "var(--bg-tertiary)",
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
          <span className="badge badge-cyan">Time: {selectedAlgo.timeComplexity}</span>
          <span className="badge badge-emerald">Aux Space: {selectedAlgo.spaceComplexity}</span>
          <span className="badge badge-indigo">{trace.totalSteps} STEPS</span>
        </div>
      </div>

      {/* Subcase Quick Switcher Chips */}
      {currentFamily && (
        <div
          className="glass-panel"
          style={{
            padding: "0.6rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            flexWrap: "wrap",
            background: "var(--chip-container-bg)",
            borderRadius: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginRight: "0.4rem" }}>
            <Tag size={14} color="var(--indigo-400)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              {currentFamily.name} Subcases:
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", flex: 1 }}>
            {currentFamily.subcases.map((sub) => {
              const isActive = sub.algorithmId === selectedAlgo.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleAlgoChange(sub.algorithmId)}
                  className="btn"
                  style={{
                    padding: "0.3rem 0.65rem",
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: "6px",
                    background: isActive ? "var(--indigo-500)" : "var(--chip-inactive-bg)",
                    color: isActive ? "#ffffff" : "var(--chip-inactive-text)",
                    border: isActive ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                    boxShadow: isActive ? "0 2px 8px rgba(99, 102, 241, 0.35)" : "none"
                  }}
                >
                  {sub.subcaseTitle}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pointer Topology HUD */}
      {currentSubcase && (
        <div
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: "rgba(6, 182, 212, 0.06)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.78rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ color: "var(--cyan-400)", fontWeight: 700 }}>
              TOPOLOGY: {currentSubcase.visualSummary}
            </span>
            <span style={{ color: "var(--border-medium)" }}>|</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {currentSubcase.coreMechanism}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {Object.entries(currentSubcase.pointerRoles).map(([ptr, role]) => (
              <span key={ptr} style={{ fontSize: "0.72rem" }}>
                <strong style={{ color: "var(--indigo-300)" }}>{ptr}</strong>:{" "}
                <span style={{ color: "var(--text-dim)" }}>{role}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main IDE Workbench Layout (2-Column Architecture) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "1.25rem",
          minHeight: "620px"
        }}
      >
        {/* Left Column: Code Editor Studio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ flex: 1, minHeight: "420px" }}>
            <CodeEditorPanel
              code={selectedAlgo.code[language]}
              language={language}
              activeLine={currentEvent.sourceLine}
              onLanguageChange={onSelectLanguage}
            />
          </div>
        </div>

        {/* Right Main Column: Prominent Simulation Canvas & Inspectors */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Simulation Stage (Maximized width, zero scrollbars) */}
          <div style={{ flex: 1, minHeight: "340px" }}>
            <SimulationStage
              event={currentEvent}
              title={selectedAlgo.name}
              onReset={() => {
                setCurrentStep(1);
                setIsPlaying(false);
              }}
            />
          </div>

          {/* Universal Scrubber Timeline */}
          <UniversalTimeline
            currentStep={currentStep}
            totalSteps={trace.totalSteps}
            isPlaying={isPlaying}
            playbackSpeed={speed}
            onStepChange={(s) => setCurrentStep(s)}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSpeedChange={(sp) => setSpeed(sp)}
          />

          {/* Bottom State & Memory Inspectors */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <ComputerVisionHUD event={currentEvent} />
            <MemoryInspector event={currentEvent} />
            <CallStackPanel callStack={currentEvent.callStack} />
          </div>
        </div>
      </div>
    </div>
  );
};
