import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// 1. 0/1 Knapsack Decision Table (Dynamic Programming)
// ============================================================================
export const knapsack01Algorithm: AlgorithmDefinition = {
  id: "knapsack_01",
  name: "Dynamic Programming: 0/1 Knapsack Problem",
  category: "dp",
  patternFamily: "dp",
  subPatternId: "dp_knapsack",
  structureType: "grid",
  difficulty: "Medium",
  description:
    "Given weights and values of n items, determines the maximum value that fits into a knapsack of capacity W. At each item i and capacity w, decides whether to exclude the item: dp[i-1][w], or include it: val[i-1] + dp[i-1][w - wt[i-1]], populating a 2D table in O(n * W) time.",
  timeComplexity: "O(n * W)",
  spaceComplexity: "O(n * W)",
  mentalModel: [
    "A 2D matrix of decisions: rows represent items considered so far; columns represent available bag capacity.",
    "For each cell: taking the item burns weight wt[i] to gain value val[i]. We compare value with item vs without item."
  ],
  invariants: [
    "dp[i][w] strictly stores the maximal value achievable using any subset of items 0..i-1 with total weight <= w.",
    "Each item can be included at most ONCE (0/1 constraint)."
  ],
  commonMistakes: [
    "Reusing items (unbounded knapsack) when item can only be taken once.",
    "Not handling wt[i-1] > w boundary check, causing negative index errors."
  ],
  defaultInput: {
    weights: [1, 2, 3],
    values: [6, 10, 12],
    capacity: 5
  },
  code: {
    python: `def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i - 1][w],                         # exclude
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]  # include
                )
            else:
                dp[i][w] = dp[i - 1][w]
                
    return dp[n][capacity]`,
    javascript: `function knapsack01(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}`,
    cpp: `int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
    java: `public int knapsack(int[] weights, int[] values, int W) {
    int n = weights.length;
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`
  },
  generateTrace: (input = { weights: [1, 2, 3], values: [6, 10, 12], capacity: 5 }): ExecutionTrace => {
    const weights: number[] = input.weights || [1, 2, 3];
    const values: number[] = input.values || [6, 10, 12];
    const capacity = input.capacity ?? 5;
    const n = weights.length;
    const events: ExecutionEvent[] = [];
    let step = 0;

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `dp = [[0] * (${capacity} + 1) for _ in range(${n} + 1)]`,
      explanation: `Initialized 0/1 Knapsack DP table of dimensions (${n + 1} items) x (${capacity + 1} capacity).`,
      variables: { weights, values, capacity },
      pointers: {},
      callStack: [{ id: "main", name: "knapsack_01", args: { capacity }, line: 2 }],
      structureType: "grid",
      structureState: dp.map((row) => [...row])
    });

    for (let i = 1; i <= n; i++) {
      const wt = weights[i - 1];
      const val = values[i - 1];

      for (let w = 1; w <= capacity; w++) {
        if (wt <= w) {
          const excludeVal = dp[i - 1][w];
          const includeVal = val + dp[i - 1][w - wt];
          dp[i][w] = Math.max(excludeVal, includeVal);

          events.push({
            step: ++step,
            type: "WRITE",
            sourceLine: 8,
            codeSnippet: `dp[${i}][${w}] = max(${excludeVal}, ${val} + ${dp[i - 1][w - wt]}) = ${dp[i][w]}`,
            explanation: `Item ${i} (wt=${wt}, val=${val}) fits in capacity ${w}: exclude=${excludeVal} vs include=${includeVal}. Chose ${dp[i][w]}.`,
            expressionEvaluation: {
              rawExpression: "max(exclude, include)",
              substitutedExpression: `max(${excludeVal}, ${includeVal}) = ${dp[i][w]}`,
              result: dp[i][w],
              effectDescription: includeVal > excludeVal ? `Taking item ${i} yielded higher value!` : `Better off leaving item ${i}.`
            },
            variables: { item: i, wt, val, capacity: w, maxVal: dp[i][w] },
            pointers: { row: i, col: w },
            callStack: [{ id: "main", name: "knapsack_01", args: { i, w }, line: 8 }],
            structureType: "grid",
            structureState: dp.map((row) => [...row])
          });
        } else {
          dp[i][w] = dp[i - 1][w];
          events.push({
            step: ++step,
            type: "WRITE",
            sourceLine: 12,
            codeSnippet: `wt > w (${wt} > ${w}): dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}`,
            explanation: `Item ${i} (weight ${wt}) exceeds capacity ${w}. Cannot take item: copied value ${dp[i][w]} from row above.`,
            variables: { item: i, wt, capacity: w, copiedVal: dp[i][w] },
            pointers: { row: i, col: w },
            callStack: [{ id: "main", name: "knapsack_01", args: { i, w }, line: 12 }],
            structureType: "grid",
            structureState: dp.map((row) => [...row])
          });
        }
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 14,
      codeSnippet: `return dp[${n}][${capacity}] = ${dp[n][capacity]}`,
      explanation: `0/1 Knapsack solution complete! Maximum achievable value with weight <= ${capacity} is ${dp[n][capacity]}.`,
      variables: { maxValue: dp[n][capacity] },
      pointers: { optimalCell: `dp[${n}][${capacity}]` },
      callStack: [{ id: "main", name: "knapsack_01", args: {}, line: 14 }],
      structureType: "grid",
      structureState: dp.map((row) => [...row])
    });

    return {
      id: "knapsack_01_trace",
      algorithmId: "knapsack_01",
      title: "Dynamic Programming (0/1 Knapsack Table Filling)",
      structureType: "grid",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// 2. Longest Common Subsequence (2D String DP - LC 1143)
// ============================================================================
export const lcsStringDpAlgorithm: AlgorithmDefinition = {
  id: "lcs_string_dp",
  name: "Dynamic Programming: Longest Common Subsequence (LCS)",
  category: "dp",
  patternFamily: "dp",
  subPatternId: "dp_string_lcs",
  structureType: "grid",
  difficulty: "Medium",
  description:
    "Finds the length of the longest subsequence present in both strings s1 and s2. If characters match (s1[i-1] == s2[j-1]), diagonal transition: 1 + dp[i-1][j-1]. If characters differ, take the max of top or left: max(dp[i-1][j], dp[i][j-1]) in O(m * n) time.",
  timeComplexity: "O(m * n)",
  spaceComplexity: "O(m * n)",
  mentalModel: [
    "A 2D character cross-comparison grid.",
    "Diagonal match (+1): two characters match, advancing both string pointers.",
    "Orthogonal mismatch: skip character from s1 (move down) or s2 (move right) taking the best previous match."
  ],
  invariants: [
    "dp[i][j] strictly stores the LCS length between prefix s1[0..i-1] and s2[0..j-1]."
  ],
  commonMistakes: [
    "Confusing subsequence (can skip characters) with contiguous substring."
  ],
  defaultInput: { s1: "abcde", s2: "ace" },
  code: {
    python: `def longest_common_subsequence(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]`,
    javascript: `function longestCommonSubsequence(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`,
    cpp: `int longestCommonSubsequence(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
    java: `public int longestCommonSubsequence(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`
  },
  generateTrace: (input = { s1: "abcde", s2: "ace" }): ExecutionTrace => {
    const s1 = input.s1 || "abcde";
    const s2 = input.s2 || "ace";
    const m = s1.length;
    const n = s2.length;
    const events: ExecutionEvent[] = [];
    let step = 0;

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `dp = [[0] * (${n} + 1) for _ in range(${m} + 1)]`,
      explanation: `Initialized LCS 2D table for s1="${s1}" and s2="${s2}".`,
      variables: { s1, s2, m, n },
      pointers: {},
      callStack: [{ id: "main", name: "longest_common_subsequence", args: { s1, s2 }, line: 2 }],
      structureType: "grid",
      structureState: dp.map((r) => [...r])
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = s1[i - 1];
        const char2 = s2[j - 1];

        if (char1 === char2) {
          dp[i][j] = 1 + dp[i - 1][j - 1];
          events.push({
            step: ++step,
            type: "WRITE",
            sourceLine: 7,
            codeSnippet: `s1[${i - 1}] == s2[${j - 1}] ('${char1}' == '${char2}'): MATCH! dp[${i}][${j}] = 1 + ${dp[i - 1][j - 1]} = ${dp[i][j]}`,
            explanation: `CHARACTER MATCH ('${char1}'): diagonal transition 1 + dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
            expressionEvaluation: {
              rawExpression: "1 + dp[i - 1][j - 1]",
              substitutedExpression: `1 + ${dp[i - 1][j - 1]} = ${dp[i][j]}`,
              result: dp[i][j],
              effectDescription: `Matched '${char1}' in both strings!`
            },
            variables: { char1, char2, match: true, lcs: dp[i][j] },
            pointers: { row: i, col: j },
            callStack: [{ id: "main", name: "longest_common_subsequence", args: { i, j }, line: 7 }],
            structureType: "grid",
            structureState: dp.map((r) => [...r])
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          events.push({
            step: ++step,
            type: "WRITE",
            sourceLine: 9,
            codeSnippet: `s1[${i - 1}] != s2[${j - 1}] ('${char1}' != '${char2}'): dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
            explanation: `Mismatch ('${char1}' vs '${char2}'): max(top: ${dp[i - 1][j]}, left: ${dp[i][j - 1]}) = ${dp[i][j]}.`,
            expressionEvaluation: {
              rawExpression: "max(dp[i - 1][j], dp[i][j - 1])",
              substitutedExpression: `max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
              result: dp[i][j],
              effectDescription: "Carried forward best preceding subsequence"
            },
            variables: { char1, char2, match: false, lcs: dp[i][j] },
            pointers: { row: i, col: j },
            callStack: [{ id: "main", name: "longest_common_subsequence", args: { i, j }, line: 9 }],
            structureType: "grid",
            structureState: dp.map((r) => [...r])
          });
        }
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 11,
      codeSnippet: `return dp[${m}][${n}] = ${dp[m][n]}`,
      explanation: `Longest Common Subsequence length = ${dp[m][n]}. Matching characters form subsequence "ace".`,
      variables: { result: dp[m][n] },
      pointers: { optimalCell: `dp[${m}][${n}]` },
      callStack: [{ id: "main", name: "longest_common_subsequence", args: {}, line: 11 }],
      structureType: "grid",
      structureState: dp.map((r) => [...r])
    });

    return {
      id: "lcs_string_dp_trace",
      algorithmId: "lcs_string_dp",
      title: "Dynamic Programming (Longest Common Subsequence 2D Grid)",
      structureType: "grid",
      totalSteps: events.length,
      events
    };
  }
};
