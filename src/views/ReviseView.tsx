import React, { useState } from "react";
import { KnowledgeGraph } from "../components/KnowledgeGraph";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Compass,
  FileText,
  Lightbulb,
  Zap
} from "lucide-react";

interface ReviseViewProps {
  onSelectAlgorithm: (algoId: string) => void;
}

interface PatternCard {
  id: string;
  title: string;
  category: string;
  recognitionSignals: string[];
  templateHint: string;
  commonMistake: string;
  algoId: string;
}

export const ReviseView: React.FC<ReviseViewProps> = ({ onSelectAlgorithm }) => {
  const [activeTab, setActiveTab] = useState<"graph" | "patterns">("graph");

  const patterns: PatternCard[] = [
    {
      id: "p1",
      title: "Two Pointers (Inward Convergence)",
      category: "Arrays & Sorting",
      recognitionSignals: [
        "Sorted array input",
        "Searching for pairs or triplets matching target sum",
        "Need O(n) time and O(1) space instead of O(n²) brute-force nested loops"
      ],
      templateHint: "left = 0, right = n - 1; while left < right: if sum == target return; elif sum < target left++ else right--",
      commonMistake: "Applying to unsorted array or moving both pointers simultaneously without checking conditions.",
      algoId: "two_pointers"
    },
    {
      id: "p2",
      title: "Binary Search Boundary Invariant",
      category: "Searching",
      recognitionSignals: [
        "Monotonic condition f(x) (e.g. false, false, ..., true, true)",
        "Search in logarithmic O(log n) time",
        "Finding first occurrence, last occurrence, or minimum capacity"
      ],
      templateHint: "while left <= right: mid = left + (right - left) // 2; if target <= arr[mid]: right = mid - 1; else: left = mid + 1",
      commonMistake: "Integer overflow in (left + right) / 2 and infinite loops from mid updates left = mid.",
      algoId: "binary_search"
    },
    {
      id: "p3",
      title: "LIFO Stack Matching",
      category: "Stacks & Parsing",
      recognitionSignals: [
        "Nested structures (parentheses, HTML tags, function call frames)",
        "Nearest previous greater or smaller element",
        "Reversible history / undo mechanisms"
      ],
      templateHint: "for char in s: if char in open_brackets: stack.push(char) else: top = stack.pop(); match(top, char)",
      commonMistake: "Popping from an empty stack or forgetting to check if stack is empty at end of string.",
      algoId: "valid_parentheses"
    },
    {
      id: "p4",
      title: "Breadth-First Level Traversal",
      category: "Graphs & BFS",
      recognitionSignals: [
        "Unweighted graph shortest path guarantee",
        "Level-by-level distance exploration",
        "Minimum number of moves or transitions"
      ],
      templateHint: "queue = [start], visited = {start}; while queue: node = queue.pop(0); for nbr in adj[node]: if nbr not in visited: visited.add(nbr); queue.push(nbr)",
      commonMistake: "Marking visited upon pop instead of push, causing duplicate additions and exponential queue bloat.",
      algoId: "bfs_traversal"
    },
    {
      id: "p5",
      title: "Heap Priority Invariant",
      category: "Heaps",
      recognitionSignals: [
        "Finding top K largest or smallest elements in streaming data",
        "Repeatedly needing minimum or maximum with dynamic insertions in O(log n)",
        "Continuous sorting maintenance"
      ],
      templateHint: "parent(i) = (i - 1) // 2; left(i) = 2*i + 1; sift_up by swapping child with parent while child < parent",
      commonMistake: "Using 1-based indexing formulas on 0-indexed arrays or confusing min-heap with max-heap comparisons.",
      algoId: "min_heap"
    }
  ];

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Tab Selector: Knowledge Graph vs Pattern Cheat Sheets */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("graph")}
            className="btn"
            style={{
              background: activeTab === "graph" ? "var(--indigo-500)" : "transparent",
              color: activeTab === "graph" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "graph" ? "1px solid var(--indigo-400)" : "none",
              fontSize: "0.85rem"
            }}
          >
            <Compass size={16} />
            <span>Interactive Concept Graph</span>
          </button>

          <button
            onClick={() => setActiveTab("patterns")}
            className="btn"
            style={{
              background: activeTab === "patterns" ? "var(--indigo-500)" : "transparent",
              color: activeTab === "patterns" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "patterns" ? "1px solid var(--indigo-400)" : "none",
              fontSize: "0.85rem"
            }}
          >
            <FileText size={16} />
            <span>Pattern Recognition Cheat Sheet</span>
          </button>
        </div>

        <span className="badge badge-cyan">CONTINUOUS KNOWLEDGE ENGINE</span>
      </div>

      {activeTab === "graph" ? (
        <KnowledgeGraph onSelectAlgorithm={onSelectAlgorithm} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
          {patterns.map((pat) => (
            <div
              key={pat.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>
                    {pat.category}
                  </span>
                  <h3 style={{ fontSize: "1.05rem", marginTop: "0.35rem" }}>{pat.title}</h3>
                </div>
              </div>

              {/* Signals */}
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Pattern Signals
                </div>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                  {pat.recognitionSignals.map((sig, i) => (
                    <li key={i} style={{ marginBottom: "0.2rem" }}>{sig}</li>
                  ))}
                </ul>
              </div>

              {/* Template hint */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--cyan-400)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                {pat.templateHint}
              </div>

              {/* Common Pitfall */}
              <div style={{ fontSize: "0.78rem", color: "var(--rose-400)", display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Trap:</strong> {pat.commonMistake}</span>
              </div>

              {/* Simulate Button */}
              <button
                onClick={() => onSelectAlgorithm(pat.algoId)}
                className="btn btn-secondary"
                style={{ marginTop: "auto", justifyContent: "space-between", padding: "0.5rem 0.85rem", fontSize: "0.8rem" }}
              >
                <span>Launch Observable Simulation</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
