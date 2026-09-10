import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// SUBCASE 2: Boundary Search (First Occurrence / Lower Bound)
// ============================================================================
export const binarySearchFirstOccurrenceAlgorithm: AlgorithmDefinition = {
  id: "binary_search_first_occurrence",
  name: "Binary Search: First Occurrence (Lower Bound)",
  category: "searching",
  patternFamily: "searching",
  subPatternId: "bs_boundary",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Unlike standard binary search which terminates immediately upon finding any match, boundary binary search records the matching index and continues searching to the LEFT (right = mid - 1) to find the very first (leftmost) occurrence in O(log n).",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "A boolean filter: [False, False, ..., True, True, True].",
    "We seek the exact transition index where the condition first switches to True.",
    "When arr[mid] == target, remember mid as candidate and clamp right = mid - 1."
  ],
  invariants: [
    "If first occurrence exists, it is <= current mid whenever arr[mid] == target.",
    "Candidates > mid are permanently discarded once a match at mid is discovered."
  ],
  commonMistakes: [
    "Returning mid immediately upon match instead of continuing leftward.",
    "Updating right = mid instead of right = mid - 1, which causes infinite loops."
  ],
  defaultInput: { array: [2, 4, 4, 4, 6, 8, 10], target: 4 },
  code: {
    python: `def find_first_occurrence(arr, target):
    left, right = 0, len(arr) - 1
    ans = -1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            ans = mid
            right = mid - 1  # keep searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return ans`,
    javascript: `function findFirstOccurrence(arr, target) {
    let left = 0, right = arr.length - 1;
    let ans = -1;
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        if (arr[mid] === target) {
            ans = mid;
            right = mid - 1; // explore left half
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return ans;
}`,
    cpp: `int findFirstOccurrence(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            ans = mid;
            right = mid - 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return ans;
}`,
    java: `public int findFirstOccurrence(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            ans = mid;
            right = mid - 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return ans;
}`
  },
  generateTrace: (input = { array: [2, 4, 4, 4, 6, 8, 10], target: 4 }): ExecutionTrace => {
    const arr: number[] = input.array || [2, 4, 4, 4, 6, 8, 10];
    const target: number = input.target ?? 4;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let left = 0;
    let right = arr.length - 1;
    let ans = -1;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "left, right = 0, len(arr) - 1; ans = -1",
      explanation: `Initialized Boundary Search: searching for FIRST occurrence of target ${target}.`,
      variables: { left, right, ans, target },
      pointers: { left, right },
      callStack: [{ id: "main", name: "find_first_occurrence", args: { target }, line: 2 }],
      structureType: "array",
      structureState: [...arr],
      windowRange: [left, right]
    });

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);
      const midVal = arr[mid];

      events.push({
        step: ++step,
        type: "POINTER_MOVE",
        sourceLine: 6,
        codeSnippet: `mid = ${left} + (${right} - ${left}) // 2 = ${mid} (arr[mid] = ${midVal})`,
        explanation: `Calculated midpoint: index ${mid} (${midVal}). Target = ${target}. Current best candidate ans = ${ans}.`,
        variables: { left, right, mid, ans, target },
        pointers: { left, right, mid },
        callStack: [{ id: "main", name: "find_first_occurrence", args: { mid }, line: 6 }],
        structureType: "array",
        structureState: [...arr],
        windowRange: [left, right],
        highlightedIndices: [mid]
      });

      if (midVal === target) {
        ans = mid;
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 8,
          codeSnippet: "ans = mid; right = mid - 1",
          explanation: `MATCH FOUND at index ${mid}! Saved ans = ${mid}. Continuing search strictly to the LEFT (right = ${mid - 1}) to confirm if an earlier match exists.`,
          expressionEvaluation: {
            rawExpression: "arr[mid] == target",
            substitutedExpression: `${midVal} == ${target}`,
            result: true,
            effectDescription: `Found candidate index ${mid}. Shifting right = ${mid - 1} to inspect earlier duplicates.`
          },
          variables: { left, right: mid - 1, mid, ans, target },
          pointers: { left, right: mid - 1, mid },
          callStack: [{ id: "main", name: "find_first_occurrence", args: { ans }, line: 8 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [left, Math.max(left, mid - 1)],
          highlightedIndices: [mid]
        });
        right = mid - 1;
      } else if (midVal < target) {
        left = mid + 1;
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 11,
          codeSnippet: "left = mid + 1",
          explanation: `arr[${mid}] (${midVal}) < target (${target}). Target must be in right half. Shifting left = ${left}.`,
          variables: { left, right, ans },
          pointers: { left, right },
          callStack: [{ id: "main", name: "find_first_occurrence", args: { left }, line: 11 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [left, right]
        });
      } else {
        right = mid - 1;
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 13,
          codeSnippet: "right = mid - 1",
          explanation: `arr[${mid}] (${midVal}) > target (${target}). Shifting right = ${right}.`,
          variables: { left, right, ans },
          pointers: { left, right },
          callStack: [{ id: "main", name: "find_first_occurrence", args: { right }, line: 13 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [left, right]
        });
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 14,
      codeSnippet: "return ans",
      explanation: `Boundary search concluded! The very first occurrence of ${target} is at index ${ans} (value = ${arr[ans]}).`,
      variables: { firstOccurrenceIndex: ans },
      pointers: { firstMatch: ans },
      callStack: [{ id: "main", name: "find_first_occurrence", args: {}, line: 14 }],
      structureType: "array",
      structureState: [...arr],
      highlightedIndices: [ans]
    });

    return {
      id: "binary_search_first_occurrence_trace",
      algorithmId: "binary_search_first_occurrence",
      title: "Binary Search (First Occurrence / Lower Bound)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// SUBCASE 3: Rotated Sorted Array Search (Pivot Inflection)
// ============================================================================
export const binarySearchRotatedAlgorithm: AlgorithmDefinition = {
  id: "binary_search_rotated",
  name: "Binary Search: Rotated Array (Pivot Inflection)",
  category: "searching",
  patternFamily: "searching",
  subPatternId: "bs_rotated",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Searches a sorted array that has been rotated around an unknown pivot. In any rotated sorted array, at least one half [left...mid] or [mid...right] is always normally sorted. By checking if target lies within the sorted half, we prune half the search space in O(log n).",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "A staircase cut in two pieces and rejoined.",
    "One segment will always be a smooth, monotonically increasing ramp.",
    "If target lies on that smooth ramp, explore it; otherwise, explore the other segment."
  ],
  invariants: [
    "Either arr[left] <= arr[mid] (left half sorted) OR arr[mid] <= arr[right] (right half sorted).",
    "Half of the remaining elements are eliminated every step."
  ],
  commonMistakes: [
    "Using strict inequality < instead of <= when determining which half is sorted.",
    "Forgetting to check boundary conditions target >= arr[left] && target < arr[mid]."
  ],
  defaultInput: { array: [4, 5, 6, 7, 0, 1, 2], target: 0 },
  code: {
    python: `def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        # Left half is normally sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is normally sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
    javascript: `function searchRotated(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}`,
    cpp: `int searchRotated(const vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}`,
    java: `public int searchRotated(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) right = mid - 1;
            else left = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}`
  },
  generateTrace: (input = { array: [4, 5, 6, 7, 0, 1, 2], target: 0 }): ExecutionTrace => {
    const nums: number[] = input.array || [4, 5, 6, 7, 0, 1, 2];
    const target: number = input.target ?? 0;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let left = 0;
    let right = nums.length - 1;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "left, right = 0, len(nums) - 1",
      explanation: `Initialized Rotated Binary Search on [${nums.join(", ")}], target = ${target}.`,
      variables: { left, right, target },
      pointers: { left, right },
      callStack: [{ id: "main", name: "search_rotated", args: { target }, line: 2 }],
      structureType: "array",
      structureState: [...nums],
      windowRange: [left, right]
    });

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);
      const midVal = nums[mid];

      events.push({
        step: ++step,
        type: "POINTER_MOVE",
        sourceLine: 5,
        codeSnippet: `mid = ${mid} (nums[mid] = ${midVal})`,
        explanation: `Examining pivot at index ${mid} (${midVal}). Left = [${left}] (${nums[left]}), Right = [${right}] (${nums[right]}).`,
        variables: { left, right, mid, midVal, target },
        pointers: { left, right, mid },
        callStack: [{ id: "main", name: "search_rotated", args: { mid }, line: 5 }],
        structureType: "array",
        structureState: [...nums],
        windowRange: [left, right],
        highlightedIndices: [mid]
      });

      if (midVal === target) {
        events.push({
          step: ++step,
          type: "COMPLETE",
          sourceLine: 6,
          codeSnippet: "return mid",
          explanation: `Target ${target} located in rotated array at index ${mid}!`,
          variables: { result: mid },
          pointers: { mid },
          callStack: [{ id: "main", name: "search_rotated", args: {}, line: 6 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [mid]
        });
        return {
          id: "binary_search_rotated_trace",
          algorithmId: "binary_search_rotated",
          title: "Binary Search (Rotated Sorted Array)",
          structureType: "array",
          totalSteps: events.length,
          events
        };
      }

      // Check if left half is sorted
      if (nums[left] <= midVal) {
        const inLeftHalf = nums[left] <= target && target < midVal;
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 9,
          codeSnippet: `nums[left] <= nums[mid] (${nums[left]} <= ${midVal}): Left Half is Sorted!`,
          explanation: `Left segment [${left} ... ${mid}] is sorted. Target ${target} ${
            inLeftHalf ? "falls inside" : "does NOT fall inside"
          } range [${nums[left]} ... ${midVal}).`,
          expressionEvaluation: {
            rawExpression: "nums[left] <= target < nums[mid]",
            substitutedExpression: `${nums[left]} <= ${target} < ${midVal}`,
            result: inLeftHalf,
            effectDescription: inLeftHalf ? "Target in left half: right = mid - 1" : "Target in right half: left = mid + 1"
          },
          variables: { left, right, inLeftHalf },
          pointers: { left, right },
          callStack: [{ id: "main", name: "search_rotated", args: { inLeftHalf }, line: 9 }],
          structureType: "array",
          structureState: [...nums],
          windowRange: [left, right]
        });

        if (inLeftHalf) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      } else {
        const inRightHalf = midVal < target && target <= nums[right];
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 15,
          codeSnippet: `Right Half is Sorted: [${midVal} ... ${nums[right]}]`,
          explanation: `Right segment [${mid} ... ${right}] is sorted. Target ${target} ${
            inRightHalf ? "falls inside" : "does NOT fall inside"
          } range (${midVal} ... ${nums[right]}].`,
          expressionEvaluation: {
            rawExpression: "nums[mid] < target <= nums[right]",
            substitutedExpression: `${midVal} < ${target} <= ${nums[right]}`,
            result: inRightHalf,
            effectDescription: inRightHalf ? "Target in right half: left = mid + 1" : "Target in left half: right = mid - 1"
          },
          variables: { left, right, inRightHalf },
          pointers: { left, right },
          callStack: [{ id: "main", name: "search_rotated", args: { inRightHalf }, line: 15 }],
          structureType: "array",
          structureState: [...nums],
          windowRange: [left, right]
        });

        if (inRightHalf) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 18,
      codeSnippet: "return -1",
      explanation: `Target ${target} not found in rotated array.`,
      variables: { result: -1 },
      pointers: {},
      callStack: [{ id: "main", name: "search_rotated", args: {}, line: 18 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "binary_search_rotated_trace",
      algorithmId: "binary_search_rotated",
      title: "Binary Search (Rotated Sorted Array)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
