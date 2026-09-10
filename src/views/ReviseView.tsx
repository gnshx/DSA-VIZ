import React, { useState } from "react";
import { KnowledgeGraph } from "../components/KnowledgeGraph";
import { PatternNavigator } from "../components/PatternNavigator";
import {
  AlertTriangle,
  ArrowRight,
  Compass,
  FileText,
  Layers
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
  const [activeTab, setActiveTab] = useState<"patterns" | "graph" | "cheatsheet">("patterns");

  const patterns: PatternCard[] = [
    {
      id: "p1",
      title: "Two Pointers: Converging (Start & End)",
      category: "Two Pointers",
      recognitionSignals: [
        "Sorted array input",
        "Searching for pairs matching target sum or condition",
        "Need O(n) time and O(1) space instead of O(n²) brute-force nested loops"
      ],
      templateHint: "left = 0, right = n - 1; while left < right: if sum == target return; elif sum < target left++ else right--",
      commonMistake: "Applying to unsorted array or moving both pointers simultaneously without checking conditions.",
      algoId: "two_pointers_opposite_ends"
    },
    {
      id: "p2",
      title: "Two Pointers: Both at End (Backward Merge)",
      category: "Two Pointers",
      recognitionSignals: [
        "Two sorted arrays, merging into the first array with trailing buffer",
        "Writing from front would overwrite unprocessed elements",
        "Need in-place O(1) extra space"
      ],
      templateHint: "p1 = m - 1, p2 = n - 1, write = m + n - 1; while p2 >= 0: if p1 >= 0 and nums1[p1] > nums2[p2]: nums1[write--] = nums1[p1--] else: nums1[write--] = nums2[p2--]",
      commonMistake: "Stopping when p1 < 0 instead of checking p2 >= 0.",
      algoId: "two_pointers_both_at_end"
    },
    {
      id: "p3",
      title: "Two Pointers: One Fixed, Two Shifting (3Sum)",
      category: "Two Pointers",
      recognitionSignals: [
        "Triplet search: a + b + c = target",
        "Reduces O(n³) brute force down to O(n²)",
        "Pre-sorting enables skipping duplicate triplets"
      ],
      templateHint: "for i in range(n - 2): if i > 0 and nums[i] == nums[i-1] continue; left = i + 1, right = n - 1; while left < right: ...",
      commonMistake: "Forgetting to skip duplicates after finding a match, producing duplicate triplet outputs.",
      algoId: "two_pointers_one_fixed_two_shifting"
    },
    {
      id: "p4",
      title: "Two Pointers: Fast & Slow (Tortoise & Hare)",
      category: "Two Pointers",
      recognitionSignals: [
        "Cycle detection in linked list or array reference chains",
        "Finding middle element in single pass",
        "Happy numbers or state transitions"
      ],
      templateHint: "slow = head, fast = head; while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow == fast: cycle found",
      commonMistake: "Calling fast.next.next without verifying fast and fast.next are non-null.",
      algoId: "two_pointers_fast_slow"
    },
    {
      id: "p5",
      title: "Two Pointers: Read & Write Compaction",
      category: "Two Pointers",
      recognitionSignals: [
        "In-place array modification (e.g. Move Zeroes, Remove Duplicates)",
        "Write pointer anchors clean partition; read pointer scans ahead",
        "O(n) time and strictly O(1) auxiliary memory"
      ],
      templateHint: "write = 0; for read in range(n): if condition(arr[read]): arr[write] = arr[read]; write += 1",
      commonMistake: "Using array.splice() or slice() inside loop which causes O(n²) shifts.",
      algoId: "two_pointers_read_write"
    },
    {
      id: "p6",
      title: "Sliding Window (Fixed vs Variable)",
      category: "Sliding Window",
      recognitionSignals: [
        "Continuous subarrays or substrings meeting a sum, length, or uniqueness criteria",
        "Fixed width k: slide right in O(1) via: sum += arr[i] - arr[i - k]",
        "Variable width: expand right, shrink left until valid"
      ],
      templateHint: "for right in range(n): add(arr[right]); while invalid(): remove(arr[left]); left += 1; update_best()",
      commonMistake: "Resetting left to 0 instead of incrementally advancing left, degrading to O(n²).",
      algoId: "sliding_window_dynamic"
    },
    {
      id: "p7",
      title: "Binary Search & Lower Bound",
      category: "Searching",
      recognitionSignals: [
        "Monotonic condition f(x) (e.g. false, false, ..., true, true)",
        "Search in logarithmic O(log n) time",
        "Finding first occurrence, last occurrence, or minimum capacity"
      ],
      templateHint: "while left <= right: mid = left + (right - left) // 2; if target <= arr[mid]: ans = mid; right = mid - 1; else: left = mid + 1",
      commonMistake: "Integer overflow in (left + right) / 2 and infinite loops from updates left = mid.",
      algoId: "binary_search_first_occurrence"
    },
    {
      id: "p8",
      title: "Monotonic Stack (Next Greater Element)",
      category: "Stacks",
      recognitionSignals: [
        "Nearest previous or next greater/smaller element in sequence",
        "Span calculations (e.g. Daily Temperatures, Stock Span)",
        "Every element pushed and popped at most once (O(n) total)"
      ],
      templateHint: "for i in range(n): while stack and arr[i] > arr[stack[-1]]: top = stack.pop(); ans[top] = i - top; stack.append(i)",
      commonMistake: "Storing values instead of indices on stack, preventing distance calculations.",
      algoId: "monotonic_stack_temperatures"
    },
    {
      id: "p9",
      title: "Dutch National Flag (3-Way Partition)",
      category: "Sorting",
      recognitionSignals: [
        "Classifying array into three segments in a single pass",
        "Pointers: low (0s boundary), mid (scanner), high (2s boundary)",
        "Strictly O(n) time and O(1) space"
      ],
      templateHint: "while mid <= high: if arr[mid] == 0: swap(low++, mid++); elif arr[mid] == 1: mid++; else: swap(mid, high--)",
      commonMistake: "Advancing mid after swapping with high, missing unclassified elements.",
      algoId: "dutch_national_flag"
    }
  ];

  return (
    <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Tab Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "0.75rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("patterns")}
            className="btn"
            style={{
              background: activeTab === "patterns" ? "var(--indigo-500)" : "transparent",
              color: activeTab === "patterns" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "patterns" ? "1px solid var(--indigo-400)" : "none",
              fontSize: "0.85rem",
              fontWeight: activeTab === "patterns" ? 700 : 500
            }}
          >
            <Layers size={16} />
            <span>All Patterns & Subcases Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("graph")}
            className="btn"
            style={{
              background: activeTab === "graph" ? "var(--indigo-500)" : "transparent",
              color: activeTab === "graph" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "graph" ? "1px solid var(--indigo-400)" : "none",
              fontSize: "0.85rem",
              fontWeight: activeTab === "graph" ? 700 : 500
            }}
          >
            <Compass size={16} />
            <span>Concept Graph</span>
          </button>

          <button
            onClick={() => setActiveTab("cheatsheet")}
            className="btn"
            style={{
              background: activeTab === "cheatsheet" ? "var(--indigo-500)" : "transparent",
              color: activeTab === "cheatsheet" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "cheatsheet" ? "1px solid var(--indigo-400)" : "none",
              fontSize: "0.85rem",
              fontWeight: activeTab === "cheatsheet" ? 700 : 500
            }}
          >
            <FileText size={16} />
            <span>Recognition Signals & Traps</span>
          </button>
        </div>

        <span className="badge badge-cyan">CONTINUOUS KNOWLEDGE REPOSITORY</span>
      </div>

      {activeTab === "patterns" && (
        <PatternNavigator onSelectSubcase={onSelectAlgorithm} />
      )}

      {activeTab === "graph" && (
        <KnowledgeGraph onSelectAlgorithm={onSelectAlgorithm} />
      )}

      {activeTab === "cheatsheet" && (
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
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-dim)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "0.3rem"
                  }}
                >
                  Pattern Recognition Signals
                </div>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                  {pat.recognitionSignals.map((sig, i) => (
                    <li key={i} style={{ marginBottom: "0.2rem" }}>
                      {sig}
                    </li>
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
                <span>
                  <strong>Trap:</strong> {pat.commonMistake}
                </span>
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
