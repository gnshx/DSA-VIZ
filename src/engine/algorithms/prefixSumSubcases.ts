import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// 1. 1D Prefix Sum & Range Query (O(1) Query Time)
// ============================================================================
export const prefixSum1DAlgorithm: AlgorithmDefinition = {
  id: "prefix_sum_1d",
  name: "Arrays: 1D Prefix Sum (O(1) Range Queries)",
  category: "arrays",
  patternFamily: "arrays",
  subPatternId: "prefix_1d",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Precomputes cumulative running sums into an array prefix[i] = prefix[i-1] + arr[i]. Allows any subsequent subarray sum query [left ... right] to be answered in strictly O(1) time via prefix[right + 1] - prefix[left].",
  timeComplexity: "O(n) precompute, O(1) query",
  spaceComplexity: "O(n)",
  mentalModel: [
    "A tape measure where total distance up to any mark is already stamped.",
    "Distance between mark A and B is simply reading(B) - reading(A).",
    "Trading O(n) one-time preprocessing to eliminate repetitive O(n) scan loops."
  ],
  invariants: [
    "prefix[k] strictly stores the sum of all elements in arr[0 ... k - 1].",
    "rangeSum(L, R) = prefix[R + 1] - prefix[L]."
  ],
  commonMistakes: [
    "Forgetting the 1-based indexing offset (prefix[0] = 0) leading to index-out-of-bounds or subtraction errors when L = 0."
  ],
  defaultInput: { array: [3, 1, 4, 1, 5, 9, 2], query: [2, 5] },
  code: {
    python: `def build_prefix_sum(arr, L, R):
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    # O(1) Query
    range_sum = prefix[R + 1] - prefix[L]
    return range_sum`,
    javascript: `function buildPrefixSum(arr, L, R) {
    const n = arr.length;
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + arr[i];
    }
    const rangeSum = prefix[R + 1] - prefix[L];
    return rangeSum;
}`,
    cpp: `int rangeSum(vector<int>& arr, int L, int R) {
    int n = arr.size();
    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + arr[i];
    return prefix[R + 1] - prefix[L];
}`,
    java: `public int rangeSum(int[] arr, int L, int R) {
    int n = arr.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + arr[i];
    return prefix[R + 1] - prefix[L];
}`
  },
  generateTrace: (input = { array: [3, 1, 4, 1, 5, 9, 2], query: [2, 5] }): ExecutionTrace => {
    const arr: number[] = input.array || [3, 1, 4, 1, 5, 9, 2];
    const [L, R] = input.query || [2, 5];
    const n = arr.length;
    const prefix: number[] = new Array(n + 1).fill(0);
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "prefix = [0] * (n + 1)",
      explanation: `Initialized Prefix Sum array of size ${n + 1} with base prefix[0] = 0.`,
      variables: { arr, prefix: [...prefix] },
      pointers: {},
      callStack: [{ id: "main", name: "build_prefix_sum", args: { L, R }, line: 2 }],
      structureType: "array",
      structureState: [...prefix]
    });

    for (let i = 0; i < n; i++) {
      prefix[i + 1] = prefix[i] + arr[i];

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 5,
        codeSnippet: `prefix[${i + 1}] = prefix[${i}] + arr[${i}] (${prefix[i]} + ${arr[i]} = ${prefix[i + 1]})`,
        explanation: `Accumulating prefix: prefix[${i + 1}] = ${prefix[i]} + ${arr[i]} = ${prefix[i + 1]}.`,
        expressionEvaluation: {
          rawExpression: "prefix[i] + arr[i]",
          substitutedExpression: `${prefix[i]} + ${arr[i]}`,
          result: prefix[i + 1],
          effectDescription: `Total cumulative sum from index 0 to ${i} is ${prefix[i + 1]}`
        },
        variables: { i, "arr[i]": arr[i], "prefix[i+1]": prefix[i + 1] },
        pointers: { current: i + 1 },
        callStack: [{ id: "main", name: "build_prefix_sum", args: { i }, line: 5 }],
        structureType: "array",
        structureState: [...prefix],
        highlightedIndices: [i + 1]
      });
    }

    const rangeSum = prefix[R + 1] - prefix[L];
    events.push({
      step: ++step,
      type: "COMPARE",
      sourceLine: 7,
      codeSnippet: `range_sum = prefix[${R + 1}] - prefix[${L}] (${prefix[R + 1]} - ${prefix[L]} = ${rangeSum})`,
      explanation: `O(1) RANGE QUERY [${L} ... ${R}]: prefix[${R + 1}] (${prefix[R + 1]}) - prefix[${L}] (${prefix[L]}) = ${rangeSum}.`,
      expressionEvaluation: {
        rawExpression: "prefix[R + 1] - prefix[L]",
        substitutedExpression: `${prefix[R + 1]} - ${prefix[L]}`,
        result: rangeSum,
        effectDescription: `Direct constant-time evaluation without loop: sum of arr[${L}..${R}] = ${rangeSum}`
      },
      variables: { L, R, prefixR: prefix[R + 1], prefixL: prefix[L], rangeSum },
      pointers: { leftBound: L, rightBound: R + 1 },
      callStack: [{ id: "main", name: "build_prefix_sum", args: { rangeSum }, line: 7 }],
      structureType: "array",
      structureState: [...prefix],
      highlightedIndices: [L, R + 1]
    });

    return {
      id: "prefix_sum_1d_trace",
      algorithmId: "prefix_sum_1d",
      title: "1D Prefix Sum & O(1) Range Query",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// 2. Prefix Sum + HashMap Combination (Subarray Sum Equals K - LC 560)
// ============================================================================
export const prefixSumHashMapAlgorithm: AlgorithmDefinition = {
  id: "prefix_sum_hashmap",
  name: "Arrays & Hashing: Prefix Sum + HashMap (Subarray Sum K)",
  category: "hashing",
  patternFamily: "hashing",
  subPatternId: "prefix_hashmap",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Combination pattern: Tracks running prefix sum while storing prefix sum frequencies in a hash map. If (curr_sum - k) was previously recorded, every occurrence represents a valid contiguous subarray summing to k, solving LC 560 in O(n) linear time.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  mentalModel: [
    "If cumulative sum at index j is S, and earlier at index i it was S - k, then subarray arr[i+1 ... j] has sum k!",
    "Hashmap acts as a temporal frequency register: map[curr_sum - k] gives count of matching start boundaries."
  ],
  invariants: [
    "map[0] = 1 handles subarrays that sum to k starting from index 0.",
    "curr_sum strictly maintains sum(arr[0 ... i])."
  ],
  commonMistakes: [
    "Forgetting to seed map[0] = 1 before the loop.",
    "Adding curr_sum to hashmap before looking up (curr_sum - k), causing 0-length false matches if k == 0."
  ],
  defaultInput: { array: [1, 2, 3, -2, 2, 1], k: 3 },
  code: {
    python: `def subarray_sum_k(nums, k):
    count = 0
    curr_sum = 0
    prefix_map = {0: 1}
    for num in nums:
        curr_sum += num
        if (curr_sum - k) in prefix_map:
            count += prefix_map[curr_sum - k]
        prefix_map[curr_sum] = prefix_map.get(curr_sum, 0) + 1
    return count`,
    javascript: `function subarraySumK(nums, k) {
    let count = 0, currSum = 0;
    const map = new Map([[0, 1]]);
    for (const num of nums) {
        currSum += num;
        if (map.has(currSum - k)) {
            count += map.get(currSum - k);
        }
        map.set(currSum, (map.get(currSum) || 0) + 1);
    }
    return count;
}`,
    cpp: `int subarraySum(vector<int>& nums, int k) {
    int count = 0, currSum = 0;
    unordered_map<int, int> map;
    map[0] = 1;
    for (int num : nums) {
        currSum += num;
        if (map.count(currSum - k)) count += map[currSum - k];
        map[currSum]++;
    }
    return count;
}`,
    java: `public int subarraySum(int[] nums, int k) {
    int count = 0, currSum = 0;
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1);
    for (int num : nums) {
        currSum += num;
        if (map.containsKey(currSum - k)) count += map.get(currSum - k);
        map.put(currSum, map.getOrDefault(currSum, 0) + 1);
    }
    return count;
}`
  },
  generateTrace: (input = { array: [1, 2, 3, -2, 2, 1], k: 3 }): ExecutionTrace => {
    const nums: number[] = input.array || [1, 2, 3, -2, 2, 1];
    const k = input.k ?? 3;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let count = 0;
    let currSum = 0;
    const prefixMap: Record<number, number> = { 0: 1 };

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "count = 0, curr_sum = 0, prefix_map = {0: 1}",
      explanation: `Initialized Prefix Sum + HashMap: target k = ${k}. Seeded map with { 0: 1 } for base matches.`,
      variables: { k, count: 0, currSum: 0, prefixMap: { ...prefixMap } },
      pointers: {},
      callStack: [{ id: "main", name: "subarray_sum_k", args: { k }, line: 2 }],
      structureType: "array",
      structureState: [...nums]
    });

    for (let i = 0; i < nums.length; i++) {
      currSum += nums[i];
      const targetPrefix = currSum - k;
      const matches = prefixMap[targetPrefix] || 0;

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 6,
        codeSnippet: `curr_sum += ${nums[i]} (${currSum}); targetPrefix = ${currSum} - ${k} = ${targetPrefix}`,
        explanation: `Element nums[${i}] = ${nums[i]}. Running sum = ${currSum}. Looking up complement (curr_sum - k) = ${targetPrefix} in hashmap. ${
          matches > 0 ? `FOUND ${matches} matching prefix(es)!` : "No matching prefix yet."
        }`,
        expressionEvaluation: {
          rawExpression: "curr_sum - k in prefix_map",
          substitutedExpression: `${currSum} - ${k} = ${targetPrefix} in map`,
          result: matches > 0,
          effectDescription:
            matches > 0
              ? `Prefix sum ${targetPrefix} was seen ${matches} time(s). Added ${matches} to total count!`
              : `Prefix sum ${targetPrefix} not seen previously.`
        },
        variables: { i, num: nums[i], currSum, targetPrefix, matches, count: count + matches, prefixMap: { ...prefixMap } },
        pointers: { current: i },
        callStack: [{ id: "main", name: "subarray_sum_k", args: { currSum, targetPrefix }, line: 6 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: [i]
      });

      if (matches > 0) {
        count += matches;
      }

      prefixMap[currSum] = (prefixMap[currSum] || 0) + 1;

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 8,
        codeSnippet: `prefix_map[${currSum}] = ${prefixMap[currSum]}`,
        explanation: `Registered running prefix sum ${currSum} into hashmap (frequency: ${prefixMap[currSum]}). Total subarrays found so far: ${count}.`,
        variables: { currSum, frequency: prefixMap[currSum], totalCount: count, prefixMap: { ...prefixMap } },
        pointers: { current: i },
        callStack: [{ id: "main", name: "subarray_sum_k", args: { count }, line: 8 }],
        structureType: "array",
        structureState: [...nums]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 9,
      codeSnippet: "return count",
      explanation: `Prefix Sum + HashMap traversal complete! Total subarrays summing to ${k}: ${count}.`,
      variables: { result: count },
      pointers: {},
      callStack: [{ id: "main", name: "subarray_sum_k", args: {}, line: 9 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "prefix_sum_hashmap_trace",
      algorithmId: "prefix_sum_hashmap",
      title: "Prefix Sum + HashMap (Subarray Sum Equals K)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// 3. Difference Array (Range Updates + Reconstruction - LC 1109)
// ============================================================================
export const differenceArrayAlgorithm: AlgorithmDefinition = {
  id: "difference_array",
  name: "Arrays: Difference Array (O(1) Range Updates)",
  category: "arrays",
  patternFamily: "arrays",
  subPatternId: "diff_array",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Allows applying multiple batch range additions [L, R, +val] in O(1) time per query by updating diff[L] += val and diff[R + 1] -= val. A single final prefix sum pass reconstructs the updated array in O(n) total time.",
  timeComplexity: "O(n + q)",
  spaceComplexity: "O(n)",
  mentalModel: [
    "Turning on a water hose at index L (+val) and turning it off at index R + 1 (-val).",
    "A running prefix sum accumulates the flow, applying +val to every element between [L ... R] automatically."
  ],
  invariants: [
    "diff[i] = arr[i] - arr[i - 1].",
    "Prefix sum of difference array exactly reconstructs the original updated array."
  ],
  commonMistakes: [
    "Forgetting to check if R + 1 < n before applying diff[R + 1] -= val."
  ],
  defaultInput: {
    length: 6,
    updates: [
      [1, 3, 5], // add 5 to indices [1..3]
      [2, 4, 10], // add 10 to indices [2..4]
      [0, 2, 2] // add 2 to indices [0..2]
    ]
  },
  code: {
    python: `def range_addition(n, updates):
    diff = [0] * (n + 1)
    for L, R, val in updates:
        diff[L] += val
        if R + 1 < n:
            diff[R + 1] -= val
    # Prefix sum reconstruction
    arr = [0] * n
    arr[0] = diff[0]
    for i in range(1, n):
        arr[i] = arr[i - 1] + diff[i]
    return arr`,
    javascript: `function rangeAddition(n, updates) {
    const diff = new Array(n + 1).fill(0);
    for (const [L, R, val] of updates) {
        diff[L] += val;
        if (R + 1 < n) diff[R + 1] -= val;
    }
    const arr = new Array(n).fill(0);
    arr[0] = diff[0];
    for (let i = 1; i < n; i++) {
        arr[i] = arr[i - 1] + diff[i];
    }
    return arr;
}`,
    cpp: `vector<int> rangeAddition(int n, vector<vector<int>>& updates) {
    vector<int> diff(n + 1, 0);
    for (auto& u : updates) {
        diff[u[0]] += u[2];
        if (u[1] + 1 < n) diff[u[1] + 1] -= u[2];
    }
    vector<int> arr(n, 0);
    arr[0] = diff[0];
    for (int i = 1; i < n; i++) arr[i] = arr[i - 1] + diff[i];
    return arr;
}`,
    java: `public int[] rangeAddition(int n, int[][] updates) {
    int[] diff = new int[n + 1];
    for (int[] u : updates) {
        diff[u[0]] += u[2];
        if (u[1] + 1 < n) diff[u[1] + 1] -= u[2];
    }
    int[] arr = new int[n];
    arr[0] = diff[0];
    for (int i = 1; i < n; i++) arr[i] = arr[i - 1] + diff[i];
    return arr;
}`
  },
  generateTrace: (input = { length: 6, updates: [[1, 3, 5], [2, 4, 10], [0, 2, 2]] }): ExecutionTrace => {
    const n = input.length ?? 6;
    const updates = input.updates || [[1, 3, 5], [2, 4, 10], [0, 2, 2]];
    const diff: number[] = new Array(n + 1).fill(0);
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "diff = [0] * (n + 1)",
      explanation: `Initialized Difference Array of size ${n + 1} with zeroes. Ready for batch O(1) range updates.`,
      variables: { n, diff: [...diff] },
      pointers: {},
      callStack: [{ id: "main", name: "range_addition", args: { n }, line: 2 }],
      structureType: "array",
      structureState: [...diff]
    });

    for (let uIdx = 0; uIdx < updates.length; uIdx++) {
      const [L, R, val] = updates[uIdx];
      diff[L] += val;
      if (R + 1 < n) diff[R + 1] -= val;

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 4,
        codeSnippet: `diff[${L}] += ${val}; diff[${R + 1}] -= ${val}`,
        explanation: `O(1) Range Update #${uIdx + 1}: add +${val} to [${L} ... ${R}]. Updated diff[${L}] = ${diff[L]}, diff[${R + 1}] = ${diff[R + 1]}.`,
        expressionEvaluation: {
          rawExpression: "diff[L] += val, diff[R + 1] -= val",
          substitutedExpression: `diff[${L}] += ${val}, diff[${R + 1}] -= ${val}`,
          result: `[${L}..${R}] += ${val}`,
          effectDescription: `Hose turned on at index ${L}, turned off after index ${R}`
        },
        variables: { update: [L, R, val], diff: [...diff] },
        pointers: { left: L, rightCancel: Math.min(R + 1, n - 1) },
        callStack: [{ id: "main", name: "range_addition", args: { L, R, val }, line: 4 }],
        structureType: "array",
        structureState: [...diff.slice(0, n)],
        highlightedIndices: [L, Math.min(R + 1, n - 1)]
      });
    }

    // Reconstruction
    const arr: number[] = new Array(n).fill(0);
    arr[0] = diff[0];
    events.push({
      step: ++step,
      type: "WRITE",
      sourceLine: 8,
      codeSnippet: `arr[0] = diff[0] = ${arr[0]}`,
      explanation: `Reconstruction Phase: arr[0] = diff[0] = ${arr[0]}.`,
      variables: { arr: [...arr] },
      pointers: { current: 0 },
      callStack: [{ id: "main", name: "range_addition", args: {}, line: 8 }],
      structureType: "array",
      structureState: [...arr],
      highlightedIndices: [0]
    });

    for (let i = 1; i < n; i++) {
      arr[i] = arr[i - 1] + diff[i];
      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 10,
        codeSnippet: `arr[${i}] = arr[${i - 1}] + diff[${i}] (${arr[i - 1]} + ${diff[i]} = ${arr[i]})`,
        explanation: `Reconstructing index ${i}: accumulated sum = ${arr[i]}.`,
        variables: { i, "arr[i]": arr[i], arr: [...arr] },
        pointers: { current: i },
        callStack: [{ id: "main", name: "range_addition", args: { i }, line: 10 }],
        structureType: "array",
        structureState: [...arr],
        highlightedIndices: [i]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 11,
      codeSnippet: "return arr",
      explanation: `Difference array reconstruction complete! Final values: [${arr.join(", ")}].`,
      variables: { result: [...arr] },
      pointers: {},
      callStack: [{ id: "main", name: "range_addition", args: {}, line: 11 }],
      structureType: "array",
      structureState: [...arr]
    });

    return {
      id: "difference_array_trace",
      algorithmId: "difference_array",
      title: "Difference Array (O(1) Range Additions + Prefix Reconstruction)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
