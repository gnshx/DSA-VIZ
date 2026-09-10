import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// SUBCASE: Merge Overlapping Intervals
// ============================================================================
export const mergeIntervalsAlgorithm: AlgorithmDefinition = {
  id: "merge_intervals",
  name: "Intervals: Merge Overlapping Intervals",
  category: "intervals",
  patternFamily: "intervals",
  subPatternId: "intervals_merge",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Sort intervals by start time. Iterate through intervals: if the current interval overlaps with the previous merged interval (curr.start <= prev.end), merge them by extending the end to max(prev.end, curr.end). Otherwise, start a new disjoint interval.",
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  mentalModel: [
    "Meeting room schedule blocks on a timeline.",
    "Once sorted by start time, each interval can only possibly overlap with the immediately preceding active block.",
    "Merged block absorbs all subsequent blocks whose start times lie before its end."
  ],
  invariants: [
    "Intervals in merged array are strictly non-overlapping and sorted by start time.",
    "last_merged.end = max(last_merged.end, curr.end) covers all overlapping segments."
  ],
  commonMistakes: [
    "Forgetting to sort intervals by start time before processing.",
    "Assuming intervals are sorted by end time or length."
  ],
  defaultInput: {
    intervals: [
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18]
    ]
  },
  code: {
    python: `def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
            
    return merged`,
    javascript: `function mergeIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const interval of intervals) {
        if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
            merged.push(interval);
        } else {
            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
        }
    }
    return merged;
}`,
    cpp: `vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for (const auto& interval : intervals) {
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}`,
    java: `public int[][] mergeIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
            merged.add(interval);
        } else {
            merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}`
  },
  generateTrace: (input = { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }): ExecutionTrace => {
    const raw: [number, number][] = input.intervals || [[1, 3], [2, 6], [8, 10], [15, 18]];
    const intervals: [number, number][] = [...raw].sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "intervals.sort(key=lambda x: x[0])",
      explanation: `Intervals sorted by start time: ${intervals.map((i) => `[${i[0]}, ${i[1]}]`).join(", ")}.`,
      variables: { intervals },
      pointers: {},
      callStack: [{ id: "main", name: "merge_intervals", args: {}, line: 2 }],
      structureType: "array",
      structureState: intervals.map((i) => `${i[0]}-${i[1]}`)
    });

    for (let i = 0; i < intervals.length; i++) {
      const curr = intervals[i];

      if (merged.length === 0 || merged[merged.length - 1][1] < curr[0]) {
        merged.push([...curr]);

        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 6,
          codeSnippet: `merged.append([${curr[0]}, ${curr[1]}]) (No overlap)`,
          explanation: `Interval [${curr[0]}, ${curr[1]}] does not overlap with previous block. Started new merged block.`,
          expressionEvaluation: {
            rawExpression: "merged[-1][1] < interval[0]",
            substitutedExpression: `${merged.length > 1 ? merged[merged.length - 2][1] : "None"} < ${curr[0]}`,
            result: true,
            effectDescription: `Created disjoint interval block [${curr[0]} ... ${curr[1]}]`
          },
          variables: { curr, merged: merged.map((m) => `[${m[0]}, ${m[1]}]`) },
          pointers: { inspecting: i },
          callStack: [{ id: "main", name: "merge_intervals", args: { i }, line: 6 }],
          structureType: "array",
          structureState: merged.map((m) => `${m[0]}-${m[1]}`),
          highlightedIndices: [merged.length - 1]
        });
      } else {
        const prev = merged[merged.length - 1];
        const oldEnd = prev[1];
        prev[1] = Math.max(prev[1], curr[1]);

        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 8,
          codeSnippet: `merged[-1][1] = max(${oldEnd}, ${curr[1]}) = ${prev[1]} (OVERLAP DETECTED)`,
          explanation: `OVERLAP! Interval [${curr[0]}, ${curr[1]}] starts before previous end ${oldEnd}. Merged into [${prev[0]}, ${prev[1]}].`,
          expressionEvaluation: {
            rawExpression: "max(merged[-1][1], interval[1])",
            substitutedExpression: `max(${oldEnd}, ${curr[1]})`,
            result: prev[1],
            effectDescription: `Extended end of block [${prev[0]} ... ${oldEnd}] to ${prev[1]}`
          },
          variables: { prevBefore: `[${prev[0]}, ${oldEnd}]`, curr: `[${curr[0]}, ${curr[1]}]`, mergedAfter: `[${prev[0]}, ${prev[1]}]` },
          pointers: { inspecting: i },
          callStack: [{ id: "main", name: "merge_intervals", args: { i }, line: 8 }],
          structureType: "array",
          structureState: merged.map((m) => `${m[0]}-${m[1]}`),
          highlightedIndices: [merged.length - 1]
        });
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 10,
      codeSnippet: "return merged",
      explanation: `Interval merging complete! Final non-overlapping intervals: ${merged.map((m) => `[${m[0]}, ${m[1]}]`).join(", ")}.`,
      variables: { result: merged },
      pointers: {},
      callStack: [{ id: "main", name: "merge_intervals", args: {}, line: 10 }],
      structureType: "array",
      structureState: merged.map((m) => `${m[0]}-${m[1]}`)
    });

    return {
      id: "merge_intervals_trace",
      algorithmId: "merge_intervals",
      title: "Intervals (Merge Overlapping Intervals)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
