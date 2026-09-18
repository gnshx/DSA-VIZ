import React, { useEffect, useMemo, useState } from "react";
import { AlgorithmDefinition } from "../types/algorithm";
import { ExecutionEvent } from "../types/trace";
import { SimulationStage } from "../visualizers/SimulationStage";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Sparkles } from "lucide-react";

interface IntuitionDemoProps {
  algorithm: AlgorithmDefinition;
}

const pickStoryEvents = (events: ExecutionEvent[]) => {
  const meaningful = events.filter((event, index) =>
    index === 0 || index === events.length - 1 || ["COMPARE", "BRANCH", "SWAP", "ASSIGN", "VISIT_NODE", "WRITE", "COMPLETE"].includes(event.type)
  );
  const limit = 6;
  if (meaningful.length <= limit) return meaningful;
  return Array.from({ length: limit }, (_, index) => meaningful[Math.round(index * (meaningful.length - 1) / (limit - 1))]);
};

export const IntuitionDemo: React.FC<IntuitionDemoProps> = ({ algorithm }) => {
  const story = useMemo(() => pickStoryEvents(algorithm.generateTrace().events), [algorithm]);
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const event = story[frame] ?? story[0];

  const [prevAlgoId, setPrevAlgoId] = useState(algorithm.id);
  if (prevAlgoId !== algorithm.id) {
    setPrevAlgoId(algorithm.id);
    setFrame(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      setFrame((current) => {
        if (current >= story.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [frame, isPlaying, story.length]);

  if (!event) return null;

  return (
    <section className="intuition-demo" aria-label={`${algorithm.name} intuition demo`}>
      <header className="intuition-demo-header">
        <div>
          <span className="workbench-eyebrow">No-code visual walkthrough</span>
          <h2>Watch the idea work</h2>
          <p>Follow the state changes first. You can open the code workbench only when the strategy feels clear.</p>
        </div>
        <div className="intuition-demo-progress" aria-live="polite">Scene {frame + 1} of {story.length}</div>
      </header>

      <div className="intuition-demo-grid">
        <div className="intuition-demo-stage"><SimulationStage event={event} title={`${algorithm.name} — intuition`} /></div>
        <aside className="intuition-demo-story glass-panel">
          <div className="intuition-story-label"><Sparkles size={16} /> What to notice</div>
          <p className="intuition-story-text">{event.explanation}</p>
          {event.expressionEvaluation && <div className="intuition-expression">{event.expressionEvaluation.effectDescription}</div>}
          <ol className="intuition-model-list">
            {algorithm.mentalModel.slice(0, 3).map((model, index) => <li className={index === frame % Math.min(3, algorithm.mentalModel.length) ? "is-active" : ""} key={model}>{model}</li>)}
          </ol>
        </aside>
      </div>

      <div className="intuition-controls">
        <button className="btn btn-secondary btn-icon" onClick={() => { setFrame((current) => Math.max(0, current - 1)); setIsPlaying(false); }} disabled={frame === 0} aria-label="Previous intuition scene"><ChevronLeft size={17} /></button>
        <button className="btn btn-primary" onClick={() => {
          if (frame === story.length - 1) setFrame(0);
          setIsPlaying((playing) => !playing);
        }}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}{frame === story.length - 1 ? "Replay idea" : isPlaying ? "Pause" : "Play idea"}
        </button>
        <button className="btn btn-secondary btn-icon" onClick={() => { setFrame((current) => Math.min(story.length - 1, current + 1)); setIsPlaying(false); }} disabled={frame === story.length - 1} aria-label="Next intuition scene"><ChevronRight size={17} /></button>
        <button className="btn btn-ghost" onClick={() => { setFrame(0); setIsPlaying(false); }}><RotateCcw size={15} /> Start over</button>
      </div>
    </section>
  );
};
