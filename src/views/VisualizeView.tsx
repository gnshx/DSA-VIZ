import React, { useEffect, useMemo, useState } from "react";
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
import { ChevronDown, ChevronUp, Compass } from "lucide-react";

interface VisualizeViewProps {
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  initialAlgorithmId?: string;
}

export const VisualizeView: React.FC<VisualizeViewProps> = ({ language, onSelectLanguage, initialAlgorithmId }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmDefinition>(
    () => ALL_ALGORITHMS.find((algo) => algo.id === initialAlgorithmId) ?? ALL_ALGORITHMS[0]
  );
  const [customInputText, setCustomInputText] = useState("");
  const [appliedInput, setAppliedInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showDirectory, setShowDirectory] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const next = ALL_ALGORITHMS.find((algo) => algo.id === initialAlgorithmId);
    if (next && next.id !== selectedAlgo.id) {
      setSelectedAlgo(next);
      setCustomInputText("");
      setAppliedInput("");
      setCurrentStep(1);
      setIsPlaying(false);
    }
  }, [initialAlgorithmId, selectedAlgo.id]);

  const parsedInput = useMemo(
    () => (appliedInput ? parseUserInput(appliedInput, selectedAlgo.structureType) : undefined),
    [appliedInput, selectedAlgo.structureType]
  );
  const trace = useMemo(() => selectedAlgo.generateTrace(parsedInput), [selectedAlgo, parsedInput]);
  const currentEvent = trace.events[Math.min(currentStep - 1, trace.events.length - 1)] ?? trace.events[0];
  const currentFamily = ALL_PATTERN_FAMILIES.find((family) => family.subcases.some((sub) => sub.algorithmId === selectedAlgo.id));

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentStep((step) => {
        if (step >= trace.totalSteps) {
          setIsPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 1000 / speed);
    return () => window.clearInterval(timer);
  }, [isPlaying, speed, trace.totalSteps]);

  const selectAlgorithm = (id: string) => {
    const next = ALL_ALGORITHMS.find((algo) => algo.id === id);
    if (!next) return;
    setSelectedAlgo(next);
    setCustomInputText("");
    setAppliedInput("");
    setCurrentStep(1);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    // Give Play an immediate, visible response; a completed trace starts fresh.
    setCurrentStep((step) => (step >= trace.totalSteps ? 1 : Math.min(step + 1, trace.totalSteps)));
    setIsPlaying(true);
  };

  const applyInput = () => {
    setAppliedInput(customInputText);
    setCurrentStep(1);
    setIsPlaying(false);
  };

  return (
    <div className="workbench page-container">
      <section className="workbench-header" aria-label="Algorithm controls">
        <div className="workbench-title">
          <span className="workbench-eyebrow">Algorithm workspace</span>
          <h1>{selectedAlgo.name}</h1>
          <p>{selectedAlgo.description}</p>
        </div>
        <div className="workbench-meta">
          <span>Time <strong>{selectedAlgo.timeComplexity}</strong></span>
          <span>Space <strong>{selectedAlgo.spaceComplexity}</strong></span>
          <span>{trace.totalSteps} steps</span>
        </div>
      </section>

      <section className="workbench-toolbar glass-panel">
        <label className="field-group">
          <span>Algorithm</span>
          <select value={selectedAlgo.id} onChange={(event) => selectAlgorithm(event.target.value)} aria-label="Algorithm">
            {ALL_ALGORITHMS.map((algo) => <option key={algo.id} value={algo.id}>{algo.name}</option>)}
          </select>
        </label>
        <label className="field-group workbench-input">
          <span>Custom input</span>
          <input value={customInputText} onChange={(event) => setCustomInputText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") applyInput(); }} placeholder="Example: 1, 4, 6, 9, 12" aria-label="Custom input" />
        </label>
        <button className="btn btn-secondary" onClick={applyInput}>Run input</button>
        <button className="btn btn-ghost workbench-directory" onClick={() => setShowDirectory((show) => !show)} aria-expanded={showDirectory}><Compass size={16} /> Patterns {showDirectory ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
      </section>

      {showDirectory && <section className="workbench-directory-panel"><PatternNavigator onSelectSubcase={(id) => { selectAlgorithm(id); setShowDirectory(false); }} selectedAlgorithmId={selectedAlgo.id} /></section>}

      <section className="workbench-main">
        <aside className="workbench-code"><CodeEditorPanel code={selectedAlgo.code[language]} language={language} activeLine={currentEvent.sourceLine} onLanguageChange={onSelectLanguage} /></aside>
        <section className="workbench-simulation">
          <SimulationStage event={currentEvent} title={selectedAlgo.name} onReset={() => { setCurrentStep(1); setIsPlaying(false); }} />
          <UniversalTimeline currentStep={currentStep} totalSteps={trace.totalSteps} isPlaying={isPlaying} playbackSpeed={speed} onStepChange={(step) => { setCurrentStep(step); setIsPlaying(false); }} onTogglePlay={togglePlayback} onSpeedChange={setSpeed} />
          {currentFamily && <div className="workbench-family">Pattern: {currentFamily.name}</div>}
        </section>
      </section>

      <section className="workbench-details glass-panel">
        <button className="workbench-details-toggle" onClick={() => setShowDetails((show) => !show)} aria-expanded={showDetails}>Current state and explanation {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        {showDetails && <div className="workbench-inspectors"><ComputerVisionHUD event={currentEvent} /><MemoryInspector event={currentEvent} /><CallStackPanel callStack={currentEvent.callStack} /></div>}
      </section>
    </div>
  );
};
