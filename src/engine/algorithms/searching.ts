import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const binarySearchAlgorithm: AlgorithmDefinition = {
  id: "binary_search",
  name: "Binary Search",
  category: "searching",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Finds the position of a target value within a sorted array. Compares target value to middle element; if unequal, the half in which the target cannot lie is eliminated, repeating on the remaining half in logarithmic O(log n) time.",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Dividing a phone book in half with each query.",
    "The search space is strictly bounded between [left, right].",
    "Each comparison eliminates half of the remaining elements."
  ],
  invariants: [
    "If target is present in the array, it must lie within index range [left, right].",
    "All elements strictly to the left of 'left' are < target (or > target depending on monotonicity)."
  ],
  commonMistakes: [
    "Integer overflow in (left + right) / 2 for languages like C++/Java: use left + (right - left) // 2.",
    "Off-by-one errors with left <= right vs left < right.",
    "Updating boundaries: using left = mid instead of left = mid + 1 causing infinite loops."
  ],
  defaultInput: { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 },
  code: {
    python: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
    javascript: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    cpp: `int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    java: `public static int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`
  },
  generateTrace: (input = { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 }): ExecutionTrace => {
    const arr: number[] = input.array || [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    const target: number = input.target ?? 23;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let left = 0;
    let right = arr.length - 1;

    // Step 1: Initialize boundaries
    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "left = 0, right = len(arr) - 1",
      explanation: `Search space initialized to entire array: left = 0, right = ${right}, target = ${target}.`,
      variables: { left: 0, right, target },
      pointers: { left: 0, right },
      callStack: [{ id: "main", name: "binary_search", args: { target }, line: 2 }],
      structureType: "array",
      structureState: [...arr],
      windowRange: [left, right]
    });

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);
      const midVal = arr[mid];

      // Mid calculation step
      events.push({
        step: ++step,
        type: "POINTER_MOVE",
        sourceLine: 6,
        codeSnippet: "mid = left + (right - left) // 2",
        explanation: `Calculated middle index: mid = ${left} + (${right} - ${left}) // 2 = ${mid}. arr[${mid}] = ${midVal}.`,
        expressionEvaluation: {
          rawExpression: "left + (right - left) // 2",
          substitutedExpression: `${left} + (${right - left}) // 2`,
          result: mid,
          effectDescription: `Examining pivot element at index ${mid} (${midVal})`
        },
        variables: { left, right, mid, "arr[mid]": midVal, target },
        pointers: { left, right, mid },
        callStack: [{ id: "main", name: "binary_search", args: { left, right, mid }, line: 6 }],
        structureType: "array",
        structureState: [...arr],
        highlightedIndices: [mid],
        windowRange: [left, right],
        prediction: {
          question: `Given target = ${target} and arr[mid] = ${midVal} at mid = ${mid}, which branch will execute?`,
          options: [
            {
              id: "equal",
              text: `arr[mid] == target (Target Found)`,
              isCorrect: midVal === target,
              explanation: midVal === target ? `Correct! ${midVal} == ${target}. Target found!` : `Incorrect: ${midVal} !== ${target}.`
            },
            {
              id: "less",
              text: `arr[mid] < target (Eliminate left half: left = mid + 1)`,
              isCorrect: midVal < target,
              explanation: midVal < target ? `Correct! ${midVal} < ${target}, so target must be in the right half.` : `Incorrect.`
            },
            {
              id: "greater",
              text: `arr[mid] > target (Eliminate right half: right = mid - 1)`,
              isCorrect: midVal > target,
              explanation: midVal > target ? `Correct! ${midVal} > ${target}, so target must be in the left half.` : `Incorrect.`
            }
          ]
        }
      });

      // Comparison with target
      if (midVal === target) {
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 8,
          codeSnippet: "if arr[mid] == target: return mid",
          explanation: `arr[${mid}] (${midVal}) === target (${target})! Target successfully located at index ${mid}.`,
          expressionEvaluation: {
            rawExpression: "arr[mid] == target",
            substitutedExpression: `${midVal} == ${target}`,
            result: true,
            effectDescription: `MATCH FOUND! Returning index ${mid}`
          },
          variables: { left, right, mid, result: mid },
          pointers: { mid },
          callStack: [{ id: "main", name: "binary_search", args: { left, right, mid }, line: 8 }],
          structureType: "array",
          structureState: [...arr],
          highlightedIndices: [mid],
          windowRange: [mid, mid]
        });
        return {
          id: "binary_search_trace",
          algorithmId: "binary_search",
          title: "Binary Search Execution Trace",
          structureType: "array",
          totalSteps: events.length,
          events
        };
      } else if (midVal < target) {
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 10,
          codeSnippet: "elif arr[mid] < target: left = mid + 1",
          explanation: `${midVal} < ${target}: target is strictly greater. Eliminating left partition [${left}..${mid}]. Shifting left = ${mid + 1}.`,
          expressionEvaluation: {
            rawExpression: "arr[mid] < target",
            substitutedExpression: `${midVal} < ${target}`,
            result: true,
            effectDescription: `Discarding left half up to index ${mid}. Next search space: [${mid + 1}..${right}]`
          },
          variables: { left: mid + 1, right, mid, target },
          pointers: { left: mid + 1, right },
          callStack: [{ id: "main", name: "binary_search", args: { left: mid + 1, right }, line: 10 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [mid + 1, right]
        });
        left = mid + 1;
      } else {
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 12,
          codeSnippet: "else: right = mid - 1",
          explanation: `${midVal} > ${target}: target is strictly smaller. Eliminating right partition [${mid}..${right}]. Shifting right = ${mid - 1}.`,
          expressionEvaluation: {
            rawExpression: "arr[mid] > target",
            substitutedExpression: `${midVal} > ${target}`,
            result: true,
            effectDescription: `Discarding right half from index ${mid}. Next search space: [${left}..${mid - 1}]`
          },
          variables: { left, right: mid - 1, mid, target },
          pointers: { left, right: mid - 1 },
          callStack: [{ id: "main", name: "binary_search", args: { left, right: mid - 1 }, line: 12 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [left, mid - 1]
        });
        right = mid - 1;
      }
    }

    // Not found step
    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 14,
      codeSnippet: "return -1",
      explanation: `Search space exhausted (left > right). Target ${target} does not exist in array.`,
      variables: { left, right, result: -1 },
      pointers: {},
      callStack: [{ id: "main", name: "binary_search", args: {}, line: 14 }],
      structureType: "array",
      structureState: [...arr]
    });

    return {
      id: "binary_search_trace",
      algorithmId: "binary_search",
      title: "Binary Search Execution Trace",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

export const twoPointersAlgorithm: AlgorithmDefinition = {
  id: "two_pointers",
  name: "Two Pointers (Pair Sum)",
  category: "two_pointers",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Finds two numbers in a sorted array that add up to a target value. Uses one pointer at the start and another at the end, moving them inward based on the current sum relative to target.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "A vise or calipers closing in from both ends.",
    "If sum is too small, only moving left pointer rightward can increase it.",
    "If sum is too large, only moving right pointer leftward can decrease it."
  ],
  invariants: [
    "The target pair cannot lie in elements strictly left of 'left' or strictly right of 'right'."
  ],
  commonMistakes: [
    "Applying two pointers to an unsorted array without sorting first.",
    "Updating both pointers simultaneously without checking current sum."
  ],
  defaultInput: { array: [1, 3, 4, 6, 8, 9, 11, 15], target: 14 },
  code: {
    python: `def two_sum_sorted(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
            
    return []`,
    javascript: `function twoSumSorted(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        const currentSum = arr[left] + arr[right];
        if (currentSum === target) {
            return [left, right];
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return [];
}`,
    cpp: `std::vector<int> twoSumSorted(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left < right) {
        int current_sum = arr[left] + arr[right];
        if (current_sum == target) {
            return {left, right};
        } else if (current_sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {};
}`,
    java: `public static int[] twoSumSorted(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target) {
            return new int[]{left, right};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{};
}`
  },
  generateTrace: (input = { array: [1, 3, 4, 6, 8, 9, 11, 15], target: 14 }): ExecutionTrace => {
    const arr: number[] = input.array || [1, 3, 4, 6, 8, 9, 11, 15];
    const target: number = input.target ?? 14;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let left = 0;
    let right = arr.length - 1;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "left = 0, right = len(arr) - 1",
      explanation: `Initialize two pointers at opposite ends of sorted array. Target sum = ${target}.`,
      variables: { left, right, target },
      pointers: { left, right },
      callStack: [{ id: "main", name: "two_sum_sorted", args: { target }, line: 2 }],
      structureType: "array",
      structureState: [...arr],
      highlightedIndices: [left, right]
    });

    while (left < right) {
      const sum = arr[left] + arr[right];

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 6,
        codeSnippet: "current_sum = arr[left] + arr[right]",
        explanation: `Sum at pointers: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${sum}. Target is ${target}.`,
        expressionEvaluation: {
          rawExpression: "arr[left] + arr[right] == target",
          substitutedExpression: `${arr[left]} + ${arr[right]} = ${sum} vs ${target}`,
          result: sum === target ? "EQUAL" : sum < target ? "TOO SMALL" : "TOO LARGE",
          effectDescription:
            sum === target
              ? "Match found!"
              : sum < target
              ? "Sum too small. Advance left pointer to increase sum."
              : "Sum too large. Decrement right pointer to decrease sum."
        },
        variables: { left, right, current_sum: sum, target },
        pointers: { left, right },
        callStack: [{ id: "main", name: "two_sum_sorted", args: { left, right, sum }, line: 6 }],
        structureType: "array",
        structureState: [...arr],
        highlightedIndices: [left, right]
      });

      if (sum === target) {
        events.push({
          step: ++step,
          type: "COMPLETE",
          sourceLine: 8,
          codeSnippet: "return [left, right]",
          explanation: `Pair found! Indices [${left}, ${right}] with values ${arr[left]} and ${arr[right]} sum to ${target}.`,
          variables: { result: [left, right] },
          pointers: { left, right },
          callStack: [{ id: "main", name: "two_sum_sorted", args: {}, line: 8 }],
          structureType: "array",
          structureState: [...arr],
          highlightedIndices: [left, right]
        });
        return {
          id: "two_pointers_trace",
          algorithmId: "two_pointers",
          title: "Two Pointers Execution Trace",
          structureType: "array",
          totalSteps: events.length,
          events
        };
      } else if (sum < target) {
        left++;
        events.push({
          step: ++step,
          type: "POINTER_MOVE",
          sourceLine: 10,
          codeSnippet: "left += 1",
          explanation: `Sum was too small (${sum} < ${target}). Shifted left pointer to index ${left} (${arr[left]}).`,
          variables: { left, right, target },
          pointers: { left, right },
          callStack: [{ id: "main", name: "two_sum_sorted", args: { left, right }, line: 10 }],
          structureType: "array",
          structureState: [...arr],
          highlightedIndices: [left, right]
        });
      } else {
        right--;
        events.push({
          step: ++step,
          type: "POINTER_MOVE",
          sourceLine: 12,
          codeSnippet: "right -= 1",
          explanation: `Sum was too large (${sum} > ${target}). Shifted right pointer to index ${right} (${arr[right]}).`,
          variables: { left, right, target },
          pointers: { left, right },
          callStack: [{ id: "main", name: "two_sum_sorted", args: { left, right }, line: 12 }],
          structureType: "array",
          structureState: [...arr],
          highlightedIndices: [left, right]
        });
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 14,
      codeSnippet: "return []",
      explanation: "Pointers met. No pair found that sums to target.",
      variables: { result: [] },
      pointers: {},
      callStack: [{ id: "main", name: "two_sum_sorted", args: {}, line: 14 }],
      structureType: "array",
      structureState: [...arr]
    });

    return {
      id: "two_pointers_trace",
      algorithmId: "two_pointers",
      title: "Two Pointers Execution Trace",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
