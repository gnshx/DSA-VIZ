import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const uniquePathsAlgorithm: AlgorithmDefinition = {
  id: "unique_paths",
  name: "Unique Paths (2D Grid DP)",
  category: "sliding_window", // or dynamic programming
  structureType: "grid",
  difficulty: "Medium",
  description:
    "A robot is located at the top-left corner of an m x n grid. The robot can only move either down or right at any point in time. Computes the number of possible unique paths to reach the bottom-right corner using 2D Dynamic Programming.",
  timeComplexity: "O(m * n)",
  spaceComplexity: "O(m * n)",
  mentalModel: [
    "To arrive at cell (r, c), you could only have come from (r - 1, c) [above] or (r, c - 1) [left].",
    "Principle of Optimality: paths(r, c) = paths(r - 1, c) + paths(r, c - 1).",
    "Base cases: All cells in the first row and first column have exactly 1 path."
  ],
  invariants: [
    "Every cell (i, j) contains the exact sum of paths from cell (0, 0).",
    "Table is filled strictly in row-major topological order."
  ],
  commonMistakes: [
    "Off-by-one errors with 0-indexed vs 1-indexed table sizes.",
    "Not initializing the entire first row and first column to 1."
  ],
  defaultInput: { rows: 3, cols: 4 },
  code: {
    python: `def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
            
    return dp[m - 1][n - 1]`,
    javascript: `function uniquePaths(m, n) {
    const dp = Array.from({ length: m }, () => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
    cpp: `int uniquePaths(int m, int n) {
    std::vector<std::vector<int>> dp(m, std::vector<int>(n, 1));
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
    java: `public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`
  },
  generateTrace: (input = { rows: 3, cols: 4 }): ExecutionTrace => {
    const m = input.rows || 3;
    const n = input.cols || 4;
    const events: ExecutionEvent[] = [];
    let step = 0;

    const rowLabels = Array.from({ length: m }, (_, i) => `Row ${i}`);
    const colLabels = Array.from({ length: n }, (_, j) => `Col ${j}`);

    // Create empty table
    const dp: (number | null)[][] = Array.from({ length: m }, () =>
      Array(n).fill(null)
    );

    const baseCases: [number, number][] = [];
    for (let i = 0; i < m; i++) baseCases.push([i, 0]);
    for (let j = 0; j < n; j++) baseCases.push([0, j]);

    // Step 1: Initialize table
    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "dp = [[1] * n for _ in range(m)]",
      explanation: `Initialize ${m}x${n} Dynamic Programming table. The robot starts at (0, 0).`,
      variables: { m, n },
      pointers: {},
      callStack: [{ id: "main", name: "unique_paths", args: { m, n }, line: 2 }],
      structureType: "grid",
      structureState: {
        grid: JSON.parse(JSON.stringify(dp)),
        activeCell: null,
        dependencyCells: [],
        baseCases: [],
        rowLabels,
        colLabels,
        formula: "dp[i][j] = dp[i-1][j] + dp[i][j-1]"
      }
    });

    // Populate base cases: Row 0 and Col 0 are 1
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    for (let i = 0; i < m; i++) dp[i][0] = 1;

    events.push({
      step: ++step,
      type: "ASSIGN",
      sourceLine: 2,
      codeSnippet: "dp[i][0] = 1, dp[0][j] = 1",
      explanation: `Base Cases set: all cells in first row and first column have exactly 1 unique path (only right or only down).`,
      variables: { baseCasesInitialized: true },
      pointers: {},
      callStack: [{ id: "main", name: "unique_paths", args: {}, line: 2 }],
      structureType: "grid",
      structureState: {
        grid: JSON.parse(JSON.stringify(dp)),
        activeCell: null,
        dependencyCells: [],
        baseCases,
        rowLabels,
        colLabels,
        formula: "Base cases: dp[i][0] = 1, dp[0][j] = 1"
      }
    });

    // Fill the remaining cells
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const fromTop = dp[i - 1][j] as number;
        const fromLeft = dp[i][j - 1] as number;
        const total = fromTop + fromLeft;

        // Inspecting dependencies
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 5,
          codeSnippet: "dp[i][j] = dp[i - 1][j] + dp[i][j - 1]",
          explanation: `Evaluating cell (${i}, ${j}): paths from top (${fromTop}) + paths from left (${fromLeft}) = ${total}.`,
          expressionEvaluation: {
            rawExpression: "dp[i - 1][j] + dp[i][j - 1]",
            substitutedExpression: `${fromTop} + ${fromLeft}`,
            result: total,
            effectDescription: `Subproblem solutions combine into dp[${i}][${j}] = ${total}`
          },
          variables: { i, j, "dp[i-1][j]": fromTop, "dp[i][j-1]": fromLeft },
          pointers: { row: i, col: j },
          callStack: [{ id: "main", name: "unique_paths", args: { i, j }, line: 5 }],
          structureType: "grid",
          structureState: {
            grid: JSON.parse(JSON.stringify(dp)),
            activeCell: [i, j],
            dependencyCells: [
              [i - 1, j],
              [i, j - 1]
            ],
            baseCases,
            rowLabels,
            colLabels,
            formula: `dp[${i}][${j}] = ${fromTop} (above) + ${fromLeft} (left)`
          },
          prediction: (i === 1 && j === 1) ? {
            question: `For cell (1, 1), top neighbor has ${fromTop} path and left neighbor has ${fromLeft} path. How many unique paths reach (1, 1)?`,
            options: [
              {
                id: "add",
                text: `${fromTop} + ${fromLeft} = 2 paths`,
                isCorrect: true,
                explanation: "Correct! Add the disjoint paths coming from the top and left neighbors."
              },
              {
                id: "multiply",
                text: `${fromTop} * ${fromLeft} = 1 path`,
                isCorrect: false,
                explanation: "Incorrect: Paths coming from mutually exclusive directions sum together."
              }
            ]
          } : undefined
        });

        dp[i][j] = total;

        // Written state
        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 6,
          codeSnippet: `dp[${i}][${j}] = ${total}`,
          explanation: `Stored ${total} into dp[${i}][${j}].`,
          variables: { i, j, [`dp[${i}][${j}]`]: total },
          pointers: { row: i, col: j },
          callStack: [{ id: "main", name: "unique_paths", args: { i, j }, line: 6 }],
          structureType: "grid",
          structureState: {
            grid: JSON.parse(JSON.stringify(dp)),
            activeCell: [i, j],
            dependencyCells: [],
            baseCases,
            rowLabels,
            colLabels,
            formula: `dp[${i}][${j}] = ${total}`
          }
        });
      }
    }

    const finalAnswer = dp[m - 1][n - 1];
    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 8,
      codeSnippet: "return dp[m - 1][n - 1]",
      explanation: `Destination reached at bottom-right cell (${m - 1}, ${n - 1})! Total unique paths = ${finalAnswer}.`,
      variables: { result: finalAnswer },
      pointers: { target: `(${m - 1}, ${n - 1})` },
      callStack: [{ id: "main", name: "unique_paths", args: {}, line: 8 }],
      structureType: "grid",
      structureState: {
        grid: JSON.parse(JSON.stringify(dp)),
        activeCell: [m - 1, n - 1],
        dependencyCells: [],
        baseCases,
        rowLabels,
        colLabels,
        formula: `Final Answer: ${finalAnswer} paths`
      }
    });

    return {
      id: "unique_paths_trace",
      algorithmId: "unique_paths",
      title: "Unique Paths (2D DP) Execution Trace",
      structureType: "grid",
      totalSteps: events.length,
      events
    };
  }
};
