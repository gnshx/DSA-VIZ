import React, { useState } from "react";
import { ALL_PROBLEMS, ALL_ALGORITHMS } from "../engine/algorithms";
import { ProblemDefinition, SupportedLanguage } from "../types/algorithm";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import { SimulationStage } from "../visualizers/SimulationStage";
import { UniversalTimeline } from "../components/UniversalTimeline";
import {
  CheckCircle2,
  FileCode2,
  Sparkles
} from "lucide-react";

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

  const getDifficultyStyle = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return { bg: "rgba(16, 185, 129, 0.15)", color: "var(--emerald-400)", border: "1px solid rgba(16, 185, 129, 0.3)" };
      case "hard":
        return { bg: "rgba(244, 63, 94, 0.15)", color: "var(--rose-400)", border: "1px solid rgba(244, 63, 94, 0.3)" };
      default:
        return { bg: "rgba(245, 158, 11, 0.15)", color: "var(--amber-400)", border: "1px solid rgba(245, 158, 11, 0.3)" };
    }
  };

  const diffStyle = getDifficultyStyle(selectedProblem.difficulty);
  const isFinalStep = currentStep >= trace.totalSteps;

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* LeetCode Problem Selection Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          borderRadius: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileCode2 size={18} color="var(--cyan-400)" />
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
              LEETCODE INTERVIEW PROBLEMSET
            </span>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
            {ALL_PROBLEMS.length} CURATED PROBLEMS
          </span>
        </div>

        {/* Problem Selector Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap"
          }}
        >
          {ALL_PROBLEMS.map((prob) => {
            const isSelected = selectedProblem.id === prob.id;
            const probDiff = getDifficultyStyle(prob.difficulty);
            return (
              <button
                key={prob.id}
                onClick={() => handleSelectProblem(prob)}
                className="btn"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, var(--indigo-600), var(--indigo-500))"
                    : "var(--chip-inactive-bg)",
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  border: isSelected ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                  fontSize: "0.825rem",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: isSelected ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
                  cursor: "pointer"
                }}
              >
                <span>{prob.title}</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.1rem 0.35rem",
                    borderRadius: "4px",
                    background: probDiff.bg,
                    color: probDiff.color,
                    border: probDiff.border
                  }}
                >
                  {prob.difficulty}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
          gap: "1.25rem",
          minHeight: "640px"
        }}
      >
        {/* Left Column: Problem Description, Testcases & Starter Code */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Problem Statement Card */}
          <div
            className="glass-panel"
            style={{
              padding: "1.35rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              borderRadius: "14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                {selectedProblem.title}
              </h2>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.65rem",
                  borderRadius: "6px",
                  background: diffStyle.bg,
                  color: diffStyle.color,
                  border: diffStyle.border
                }}
              >
                {selectedProblem.difficulty}
              </span>
            </div>

            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {selectedProblem.statement}
            </p>

            {/* Test Cases Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                Test Cases & Target Assertions:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                {selectedProblem.examples.map((ex, idx) => {
                  const isSelectedTest = selectedTestIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedTestIndex(idx);
                        setCurrentStep(1);
                      }}
                      style={{
                        padding: "0.65rem 0.9rem",
                        borderRadius: "8px",
                        background: isSelectedTest ? "var(--indigo-glow)" : "var(--box-bg)",
                        border: isSelectedTest ? "2px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        fontSize: "0.825rem",
                        fontFamily: "var(--font-mono)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      <span style={{ color: "var(--cyan-400)", fontWeight: 600 }}>Input: {ex.input}</span>
                      <span style={{ color: "var(--emerald-400)", fontWeight: 600 }}>Expected: {ex.output}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Starter Code Editor */}
          <div style={{ flex: 1, minHeight: "320px" }}>
            <CodeEditorPanel
              code={selectedProblem.starterCode[language]}
              language={language}
              activeLine={currentEvent.sourceLine}
              onLanguageChange={onSelectLanguage}
            />
          </div>
        </div>

        {/* Right Column: Visual Test Runner Simulation Stage */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Assertion Verification Banner */}
          <div
            className="glass-panel"
            style={{
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "10px",
              background: isFinalStep ? "rgba(16, 185, 129, 0.1)" : "rgba(99, 102, 241, 0.1)",
              border: isFinalStep ? "1px solid var(--emerald-400)" : "1px solid var(--indigo-400)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {isFinalStep ? (
                <CheckCircle2 size={18} color="var(--emerald-400)" />
              ) : (
                <Sparkles size={18} color="var(--indigo-400)" />
              )}
              <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {isFinalStep ? "Execution Complete — Target Asserted" : "Trace Simulation Active"}
              </span>
            </div>
            <span className={isFinalStep ? "badge badge-emerald" : "badge badge-indigo"}>
              {isFinalStep ? "PASS" : `STEP ${currentStep}/${trace.totalSteps}`}
            </span>
          </div>

          {/* Dynamic Simulation Stage */}
          <div style={{ flex: 1, minHeight: "360px" }}>
            <SimulationStage
              event={currentEvent}
              title={`Test Case ${selectedTestIndex + 1}: ${selectedProblem.examples[selectedTestIndex]?.input}`}
              onReset={() => {
                setCurrentStep(1);
                setIsPlaying(false);
              }}
            />
          </div>

          {/* Universal Timeline Control */}
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
