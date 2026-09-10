import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// SUBCASE 1: Fixed-Size Window (Max Sum Subarray of Size K)
// ============================================================================
export const slidingWindowFixedAlgorithm: AlgorithmDefinition = {
  id: "sliding_window_fixed",
  name: "Sliding Window: Fixed Size (Max Subarray Sum)",
  category: "sliding_window",
  patternFamily: "sliding_window",
  subPatternId: "sw_fixed",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Window maintaining an exact fixed width of K elements. When moving right by 1 index, the outgoing element (left) is subtracted and the incoming element (right) is added in O(1) time, avoiding recomputing the sum from scratch.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "A magnifying lens of fixed width K moving along a strip of tape.",
    "Constant time update: new_sum = old_sum - outgoing + incoming."
  ],
  invariants: [
    "At step i >= k - 1, window covers exactly indices [i - k + 1 ... i].",
    "Max sum tracks the highest window sum encountered so far."
  ],
  commonMistakes: [
    "Recalculating sum using a nested loop, degrading to O(n * k).",
    "Off-by-one errors when subtracting outgoing index i - k."
  ],
  defaultInput: { array: [2, 1, 5, 1, 3, 2], k: 3 },
  code: {
    python: `def max_sub_array_k(arr, k):
    max_sum = 0
    window_sum = 0
    for i in range(len(arr)):
        window_sum += arr[i]
        if i >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[i - k + 1]
    return max_sum`,
    javascript: `function maxSubArrayK(arr, k) {
    let maxSum = 0, windowSum = 0;
    for (let i = 0; i < arr.length; i++) {
        windowSum += arr[i];
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
            windowSum -= arr[i - k + 1];
        }
    }
    return maxSum;
}`,
    cpp: `int maxSubArrayK(const vector<int>& arr, int k) {
    int maxSum = 0, windowSum = 0;
    for (int i = 0; i < arr.size(); i++) {
        windowSum += arr[i];
        if (i >= k - 1) {
            maxSum = max(maxSum, windowSum);
            windowSum -= arr[i - k + 1];
        }
    }
    return maxSum;
}`,
    java: `public int maxSubArrayK(int[] arr, int k) {
    int maxSum = 0, windowSum = 0;
    for (int i = 0; i < arr.length; i++) {
        windowSum += arr[i];
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
            windowSum -= arr[i - k + 1];
        }
    }
    return maxSum;
}`
  },
  generateTrace: (input = { array: [2, 1, 5, 1, 3, 2], k: 3 }): ExecutionTrace => {
    const arr: number[] = input.array || [2, 1, 5, 1, 3, 2];
    const k: number = input.k ?? 3;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let maxSum = 0;
    let windowSum = 0;
    let windowStart = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "max_sum = 0, window_sum = 0",
      explanation: `Initialized Fixed Sliding Window: width k = ${k}.`,
      variables: { k, max_sum: 0, window_sum: 0 },
      pointers: {},
      callStack: [{ id: "main", name: "max_sub_array_k", args: { k }, line: 2 }],
      structureType: "array",
      structureState: [...arr]
    });

    for (let i = 0; i < arr.length; i++) {
      windowSum += arr[i];

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 5,
        codeSnippet: `window_sum += arr[${i}] (${arr[i]})`,
        explanation: `Added incoming element arr[${i}] (${arr[i]}). Current window sum = ${windowSum}.`,
        expressionEvaluation: {
          rawExpression: "window_sum += arr[i]",
          substitutedExpression: `${windowSum - arr[i]} + ${arr[i]} = ${windowSum}`,
          result: windowSum,
          effectDescription: `Window expanded to cover right boundary [${windowStart} ... ${i}]`
        },
        variables: { windowStart, i, windowSum, maxSum },
        pointers: { left: windowStart, right: i },
        callStack: [{ id: "main", name: "max_sub_array_k", args: { i, windowSum }, line: 5 }],
        structureType: "array",
        structureState: [...arr],
        windowRange: [windowStart, i],
        highlightedIndices: [i]
      });

      if (i >= k - 1) {
        const prevMax = maxSum;
        maxSum = Math.max(maxSum, windowSum);

        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 7,
          codeSnippet: "max_sum = max(max_sum, window_sum)",
          explanation: `Window reached full size ${k} [${windowStart} ... ${i}]. Comparing window_sum (${windowSum}) vs max_sum (${prevMax}). ${
            windowSum > prevMax ? `New max = ${windowSum}!` : `Max remains ${maxSum}.`
          }`,
          expressionEvaluation: {
            rawExpression: "max(max_sum, window_sum)",
            substitutedExpression: `max(${prevMax}, ${windowSum})`,
            result: maxSum,
            effectDescription: windowSum > prevMax ? "Updated maximum subarray sum!" : "Window sum <= current maximum"
          },
          variables: { windowStart, right: i, windowSum, maxSum },
          pointers: { left: windowStart, right: i },
          callStack: [{ id: "main", name: "max_sub_array_k", args: { maxSum }, line: 7 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [windowStart, i],
          highlightedIndices: Array.from({ length: k }, (_, idx) => windowStart + idx)
        });

        const outgoing = arr[windowStart];
        windowSum -= outgoing;

        events.push({
          step: ++step,
          type: "POINTER_MOVE",
          sourceLine: 8,
          codeSnippet: `window_sum -= arr[${windowStart}] (${outgoing})`,
          explanation: `Sliding window forward: subtracted outgoing element arr[${windowStart}] (${outgoing}). Shifted left boundary to ${windowStart + 1}.`,
          variables: { outgoing, windowSum, maxSum },
          pointers: { left: windowStart + 1, right: i },
          callStack: [{ id: "main", name: "max_sub_array_k", args: {}, line: 8 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [windowStart + 1, i]
        });

        windowStart++;
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 9,
      codeSnippet: "return max_sum",
      explanation: `Fixed window traversal complete! Maximum sum found = ${maxSum}.`,
      variables: { result: maxSum },
      pointers: {},
      callStack: [{ id: "main", name: "max_sub_array_k", args: {}, line: 9 }],
      structureType: "array",
      structureState: [...arr]
    });

    return {
      id: "sliding_window_fixed_trace",
      algorithmId: "sliding_window_fixed",
      title: "Sliding Window (Fixed Size K)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// SUBCASE 2: Dynamic / Variable-Size Window (Longest Unique Substring)
// ============================================================================
export const slidingWindowDynamicAlgorithm: AlgorithmDefinition = {
  id: "sliding_window_dynamic",
  name: "Sliding Window: Dynamic (Longest Unique Substring)",
  category: "sliding_window",
  patternFamily: "sliding_window",
  subPatternId: "sw_dynamic",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Window dynamically expands by moving 'right' until an invalid condition occurs (e.g. duplicate character). Then 'left' contracts the window until validity is restored, finding the optimal subarray length in O(n) amortized time.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(min(n, m))",
  mentalModel: [
    "An accordion or caterpillar: right foot expands forward, and left foot catches up when tension builds.",
    "Each element enters the window once and leaves at most once, yielding 2N operations = O(n)."
  ],
  invariants: [
    "Subarray within window [left ... right] contains only unique characters at the end of each expansion/shrink cycle.",
    "max_len = max(max_len, right - left + 1)."
  ],
  commonMistakes: [
    "Resetting left all the way back to start upon finding a duplicate (degrades to O(n²)).",
    "Forgetting to delete outgoing elements from the frequency map/set while shrinking left."
  ],
  defaultInput: { array: [1, 2, 3, 1, 2, 4, 5] },
  code: {
    python: `def longest_unique_subarray(arr):
    seen = set()
    left = 0
    max_len = 0
    for right in range(len(arr)):
        while arr[right] in seen:
            seen.remove(arr[left])
            left += 1
        seen.add(arr[right])
        max_len = max(max_len, right - left + 1)
    return max_len`,
    javascript: `function longestUniqueSubarray(arr) {
    const seen = new Set();
    let left = 0, maxLen = 0;
    for (let right = 0; right < arr.length; right++) {
        while (seen.has(arr[right])) {
            seen.delete(arr[left]);
            left++;
        }
        seen.add(arr[right]);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    cpp: `int longestUniqueSubarray(const vector<int>& arr) {
    unordered_set<int> seen;
    int left = 0, maxLen = 0;
    for (int right = 0; right < arr.size(); right++) {
        while (seen.count(arr[right])) {
            seen.erase(arr[left++]);
        }
        seen.insert(arr[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    java: `public int longestUniqueSubarray(int[] arr) {
    Set<Integer> seen = new HashSet<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < arr.length; right++) {
        while (seen.contains(arr[right])) {
            seen.remove(arr[left++]);
        }
        seen.add(arr[right]);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`
  },
  generateTrace: (input = { array: [1, 2, 3, 1, 2, 4, 5] }): ExecutionTrace => {
    const arr: number[] = input.array || [1, 2, 3, 1, 2, 4, 5];
    const events: ExecutionEvent[] = [];
    let step = 0;

    const seen = new Set<number>();
    let left = 0;
    let maxLen = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "seen = set(), left = 0, max_len = 0",
      explanation: "Initialized Dynamic Window: tracking longest window of unique numbers.",
      variables: { left, max_len: 0, seen: [] },
      pointers: { left },
      callStack: [{ id: "main", name: "longest_unique_subarray", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...arr]
    });

    for (let right = 0; right < arr.length; right++) {
      const incoming = arr[right];

      // Shrink left if duplicate exists
      while (seen.has(incoming)) {
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 6,
          codeSnippet: `while arr[${right}] in seen: (${incoming} is duplicate!)`,
          explanation: `DUPLICATE DETECTED: value ${incoming} already exists in active window. Shrinking left boundary from index ${left} (${arr[left]}).`,
          expressionEvaluation: {
            rawExpression: "arr[right] in seen",
            substitutedExpression: `${incoming} in [${Array.from(seen).join(", ")}]`,
            result: true,
            effectDescription: `Window invalid! Evicting arr[${left}] (${arr[left]}) to restore uniqueness`
          },
          variables: { left, right, duplicate: incoming, seen: Array.from(seen) },
          pointers: { left, right },
          callStack: [{ id: "main", name: "longest_unique_subarray", args: { left, right }, line: 6 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [left, right],
          highlightedIndices: [left, right]
        });

        seen.delete(arr[left]);
        left++;
      }

      seen.add(incoming);
      const currentLen = right - left + 1;
      maxLen = Math.max(maxLen, currentLen);

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 9,
        codeSnippet: `seen.add(${incoming}); max_len = max(${maxLen}, ${currentLen})`,
        explanation: `Added ${incoming} to window. Window [${left} ... ${right}] is valid with length ${currentLen}. Peak max_len = ${maxLen}.`,
        expressionEvaluation: {
          rawExpression: "right - left + 1",
          substitutedExpression: `${right} - ${left} + 1 = ${currentLen}`,
          result: currentLen,
          effectDescription: `Current valid window elements: [${arr.slice(left, right + 1).join(", ")}]`
        },
        variables: { left, right, currentLen, maxLen, seen: Array.from(seen) },
        pointers: { left, right },
        callStack: [{ id: "main", name: "longest_unique_subarray", args: { currentLen }, line: 9 }],
        structureType: "array",
        structureState: [...arr],
        windowRange: [left, right],
        highlightedIndices: [right]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 11,
      codeSnippet: "return max_len",
      explanation: `Dynamic sliding window scan finished! Longest unique subarray length = ${maxLen}.`,
      variables: { result: maxLen },
      pointers: {},
      callStack: [{ id: "main", name: "longest_unique_subarray", args: {}, line: 11 }],
      structureType: "array",
      structureState: [...arr]
    });

    return {
      id: "sliding_window_dynamic_trace",
      algorithmId: "sliding_window_dynamic",
      title: "Sliding Window (Dynamic Variable Size)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
