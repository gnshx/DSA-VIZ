import React, { useState } from "react";
import { PredictionChallenge } from "../types/trace";
import { Brain, CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface PredictionModalProps {
  challenge: PredictionChallenge;
  onAnswer: (correct: boolean) => void;
  onClose: () => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  challenge,
  onAnswer,
  onClose
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);

    const chosenOption = challenge.options.find((o) => o.id === selectedOptionId);
    const isCorrect = chosenOption?.isCorrect ?? false;

    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onAnswer(isCorrect);
  };

  const selectedOption = challenge.options.find((o) => o.id === selectedOptionId);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(8, 12, 20, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem"
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "580px",
          padding: "1.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-glow)"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "rgba(99, 102, 241, 0.2)",
              border: "1px solid var(--indigo-400)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Brain size={20} color="var(--indigo-400)" />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Predict Next Step
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Train your internal mental execution engine
            </div>
          </div>
        </div>

        {/* Question */}
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: 1.5,
            color: "#ffffff",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)"
          }}
        >
          {challenge.question}
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {challenge.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optBackground = isSelected ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.03)";
            let optBorder = isSelected ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)";

            if (hasSubmitted) {
              if (opt.isCorrect) {
                optBackground = "rgba(16, 185, 129, 0.2)";
                optBorder = "1px solid var(--emerald-400)";
              } else if (isSelected && !opt.isCorrect) {
                optBackground = "rgba(244, 63, 94, 0.2)";
                optBorder = "1px solid var(--rose-400)";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={hasSubmitted}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  background: optBackground,
                  border: optBorder,
                  color: "var(--text-primary)",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  cursor: hasSubmitted ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all var(--transition-fast)"
                }}
              >
                <span>{opt.text}</span>
                {hasSubmitted && opt.isCorrect && <CheckCircle2 size={18} color="var(--emerald-400)" />}
                {hasSubmitted && isSelected && !opt.isCorrect && <XCircle size={18} color="var(--rose-400)" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Feedback if Submitted */}
        {hasSubmitted && selectedOption && (
          <div
            style={{
              padding: "0.85rem",
              borderRadius: "8px",
              background: selectedOption.isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
              border: selectedOption.isCorrect ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(244, 63, 94, 0.3)",
              fontSize: "0.825rem",
              color: "var(--text-primary)",
              lineHeight: 1.4
            }}
          >
            <strong>{selectedOption.isCorrect ? "🎉 Correct!" : "❌ Not quite:"}</strong>{" "}
            {selectedOption.explanation}
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="btn btn-primary"
              style={{ padding: "0.55rem 1.5rem" }}
            >
              Submit Prediction
            </button>
          ) : (
            <button onClick={onClose} className="btn btn-primary" style={{ padding: "0.55rem 1.5rem" }}>
              Continue Simulation ➔
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
