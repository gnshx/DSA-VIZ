import React, { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pause,
  Play,
  Zap
} from "lucide-react";

interface UniversalTimelineProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onStepChange: (step: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
}

export const UniversalTimeline: React.FC<UniversalTimelineProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onStepChange,
  onTogglePlay,
  onSpeedChange
}) => {
  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (currentStep > 1) onStepChange(currentStep - 1);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (currentStep < totalSteps) onStepChange(currentStep + 1);
      } else if (e.code === "Home") {
        e.preventDefault();
        onStepChange(1);
      } else if (e.code === "End") {
        e.preventDefault();
        onStepChange(totalSteps);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, totalSteps, onTogglePlay, onStepChange]);

  const speeds = [0.5, 1, 2, 5];

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "0.85rem 1.25rem",
        background: "rgba(13, 19, 34, 0.95)"
      }}
    >
      {/* Scrubber Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <input
          type="range"
          min="1"
          max={Math.max(totalSteps, 1)}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="timeline-slider"
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.775rem",
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            minWidth: "90px",
            textAlign: "right"
          }}
        >
          {currentStep} / {totalSteps} steps
        </span>
      </div>

      {/* Control Buttons & Speed */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        {/* Playback Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {/* Jump to start */}
          <button
            onClick={() => onStepChange(1)}
            disabled={currentStep <= 1}
            className="btn btn-secondary btn-icon"
            title="Jump to Start (Home)"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Step back */}
          <button
            onClick={() => onStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep <= 1}
            className="btn btn-secondary btn-icon"
            title="Step Backward (Left Arrow)"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Play / Pause Primary */}
          <button
            onClick={onTogglePlay}
            className="btn btn-primary"
            style={{ padding: "0.45rem 1.25rem", gap: "0.4rem" }}
            title="Play / Pause (Space)"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          {/* Step forward */}
          <button
            onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))}
            disabled={currentStep >= totalSteps}
            className="btn btn-secondary btn-icon"
            title="Step Forward (Right Arrow)"
          >
            <ChevronRight size={16} />
          </button>

          {/* Jump to end */}
          <button
            onClick={() => onStepChange(totalSteps)}
            disabled={currentStep >= totalSteps}
            className="btn btn-secondary btn-icon"
            title="Jump to End (End)"
          >
            <ChevronsRight size={16} />
          </button>
        </div>

        {/* Speed Selector & Keyboard Hint */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(255, 255, 255, 0.04)", padding: "0.2rem", borderRadius: "8px" }}>
            <Zap size={14} color="var(--amber-400)" style={{ marginLeft: "0.4rem" }} />
            {speeds.map((s) => {
              const isSelected = playbackSpeed === s;
              return (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  style={{
                    border: "none",
                    background: isSelected ? "rgba(245, 158, 11, 0.25)" : "transparent",
                    color: isSelected ? "var(--amber-400)" : "var(--text-muted)",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  {s}x
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
            Tip: Press <kbd style={{ background: "rgba(255,255,255,0.1)", padding: "2px 4px", borderRadius: "4px" }}>Space</kbd> or <kbd style={{ background: "rgba(255,255,255,0.1)", padding: "2px 4px", borderRadius: "4px" }}>←</kbd> <kbd style={{ background: "rgba(255,255,255,0.1)", padding: "2px 4px", borderRadius: "4px" }}>→</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
