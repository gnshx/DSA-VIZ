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
    <div className="glass-panel timeline">
      <div className="timeline-row">
        <input
          type="range"
          min="1"
          max={Math.max(totalSteps, 1)}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="timeline-slider"
          aria-label={`Step ${currentStep} of ${totalSteps}`}
          aria-valuetext={`Step ${currentStep} of ${totalSteps}`}
        />
        <span className="timeline-count">
          {currentStep} / {totalSteps} steps
        </span>
      </div>

      <div className="timeline-controls">
        <div className="timeline-buttons">
          <button
            type="button"
            onClick={() => onStepChange(1)}
            disabled={currentStep <= 1}
            className="btn btn-secondary btn-icon"
            title="Jump to Start (Home)"
            aria-label="Jump to first step"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => onStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep <= 1}
            className="btn btn-secondary btn-icon"
            title="Step Backward (Left Arrow)"
            aria-label="Previous step"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="btn btn-primary timeline-play"
            title="Play / Pause (Space)"
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            type="button"
            onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))}
            disabled={currentStep >= totalSteps}
            className="btn btn-secondary btn-icon"
            title="Step Forward (Right Arrow)"
            aria-label="Next step"
          >
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => onStepChange(totalSteps)}
            disabled={currentStep >= totalSteps}
            className="btn btn-secondary btn-icon"
            title="Jump to End (End)"
            aria-label="Jump to last step"
          >
            <ChevronsRight size={16} />
          </button>
        </div>

        <div className="timeline-buttons">
          <div className="segmented" role="group" aria-label="Playback speed">
            <Zap size={14} color="var(--amber-400)" style={{ marginLeft: "0.4rem" }} />
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className="segmented-btn"
                data-active={playbackSpeed === s}
                aria-pressed={playbackSpeed === s}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="timeline-hint">
            Tip: Press <kbd className="kbd">Space</kbd> or <kbd className="kbd">←</kbd> <kbd className="kbd">→</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
