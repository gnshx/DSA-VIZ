import React, { useState } from "react";
import { ALL_ALGORITHMS } from "../engine/algorithms";
import { AlgorithmDefinition, SupportedLanguage } from "../types/algorithm";
import { SimulationStage } from "../visualizers/SimulationStage";
import { UniversalTimeline } from "../components/UniversalTimeline";
import { PredictionModal } from "../components/PredictionModal";
import { Award, Brain, CheckCircle2, Flame, HelpCircle, RotateCcw, Target } from "lucide-react";

interface PredictViewProps {
  language: SupportedLanguage;
}

export const PredictView: React.FC<PredictViewProps> = ({ language }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmDefinition>(ALL_ALGORITHMS[1]); // Binary search by default has great prediction points
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Gamification & Mental model metrics
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<any | null>(null);

  const trace = selectedAlgo.generateTrace();
  const currentEvent =
    trace.events[Math.min(currentStep - 1, trace.events.length - 1)] || trace.events[0];

  // Check if current event has a prediction challenge
  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    const targetEvent = trace.events[Math.min(newStep - 1, trace.events.length - 1)];
    if (targetEvent?.prediction && newStep > currentStep) {
      setIsPlaying(false);
      setActiveChallenge(targetEvent.prediction);
    }
  };

  const handlePredictionAnswer = (correct: boolean) => {
    setTotalAnswered((prev) => prev + 1);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setCurrentStreak((prev) => prev + 1);
    } else {
      setCurrentStreak(0);
    }
  };

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 100;

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header & Mental Model Metrics Banner */}
      <div
        className="glass-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-indigo">MENTAL MODEL GYM</span>
            <span className="badge badge-amber">INTERACTIVE PREDICTION</span>
          </div>
          <h1 style={{ fontSize: "1.6rem", marginTop: "0.4rem" }}>
            Predict The Next Step
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.2rem 0 0 0" }}>
            True mastery means knowing what the computer will do before pressing 'Next'. Step through the algorithm and forecast state changes.
          </p>
        </div>

        {/* Stats HUD */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Accuracy Score */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(6, 182, 212, 0.15)",
                border: "1px solid var(--cyan-400)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Target size={22} color="var(--cyan-400)" />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                Accuracy Score
              </div>
              <div style={{ fontSize: "1.25rem", fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--cyan-400)" }}>
                {accuracy}%
              </div>
            </div>
          </div>

          {/* Streak */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid var(--amber-400)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Flame size={22} color="var(--amber-400)" />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                Streak
              </div>
              <div style={{ fontSize: "1.25rem", fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--amber-400)" }}>
                {currentStreak}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Selector Pills */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {ALL_ALGORITHMS.map((algo) => {
          const isSelected = selectedAlgo.id === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => {
                setSelectedAlgo(algo);
                setCurrentStep(1);
                setIsPlaying(false);
              }}
              className="btn"
              style={{
                background: isSelected ? "var(--indigo-500)" : "rgba(255, 255, 255, 0.04)",
                color: isSelected ? "#ffffff" : "var(--text-secondary)",
                border: isSelected ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                fontSize: "0.8rem",
                padding: "0.4rem 0.8rem"
              }}
            >
              {algo.name}
            </button>
          );
        })}
      </div>

      {/* Main Simulation Stage & Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, minHeight: "500px" }}>
        <div style={{ flex: 1 }}>
          <SimulationStage
            event={currentEvent}
            title={`${selectedAlgo.name} (Mental Prediction Mode)`}
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
          onStepChange={handleStepChange}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSpeedChange={(s) => setSpeed(s)}
        />
      </div>

      {/* Trigger Challenge Modal when active */}
      {activeChallenge && (
        <PredictionModal
          challenge={activeChallenge}
          onAnswer={handlePredictionAnswer}
          onClose={() => setActiveChallenge(null)}
        />
      )}
    </div>
  );
};
