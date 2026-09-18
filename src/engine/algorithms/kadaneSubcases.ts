import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const kadaneAlgorithm: AlgorithmDefinition = {
  id: "kadane_max_subarray",
  name: "Kadane's Algorithm (Max Subarray Sum)",
  category: "arrays",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum. Maintains the maximum subarray ending at the current position, greedily discarding negative prefixes.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Discard the past if it is a net burden (curr_sum < 0).",
    "At every step, decide whether to append current element to existing running subarray or start a fresh subarray at this element.",
    "Global maximum records the all-time peak subarray sum encountered so far."
  ],
  invariants: [
    "curr_sum at index i is strictly max(nums[i], curr_sum + nums[i]).",
    "max_sum at index i is the global maximum of all valid contiguous subarrays ending at or before index i."
  ],
  commonMistakes: [
    "Initializing max_sum to 0 instead of -Infinity or nums[0], which fails when all numbers are negative.",
    "Not tracking subarray start and end pointers properly when reconstructing the optimal window."
  ],
  defaultInput: { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  code: {
    python: `def max_sub_array(nums):
    max_sum = nums[0]
    curr_sum = 0
    start = best_start = best_end = 0
    
    for i, x in enumerate(nums):
        if curr_sum < 0:
            curr_sum = x
            start = i
        else:
            curr_sum += x
            
        if curr_sum > max_sum:
            max_sum = curr_sum
            best_start = start
            best_end = i
            
    return max_sum`,
    javascript: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currSum = 0;
    let start = 0, bestStart = 0, bestEnd = 0;
    
    for (let i = 0; i < nums.length; i++) {
        const x = nums[i];
        if (currSum < 0) {
            currSum = x;
            start = i;
        } else {
            currSum += x;
        }
        
        if (currSum > maxSum) {
            maxSum = currSum;
            bestStart = start;
            bestEnd = i;
        }
    }
    return maxSum;
}`,
    cpp: `int maxSubArray(const std::vector<int>& nums) {
    int maxSum = nums[0];
    int currSum = 0;
    int start = 0, bestStart = 0, bestEnd = 0;
    
    for (int i = 0; i < (int)nums.size(); ++i) {
        int x = nums[i];
        if (currSum < 0) {
            currSum = x;
            start = i;
        } else {
            currSum += x;
        }
        
        if (currSum > maxSum) {
            maxSum = currSum;
            bestStart = start;
            bestEnd = i;
        }
    }
    return maxSum;
}`,
    java: `public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currSum = 0;
    int start = 0, bestStart = 0, bestEnd = 0;
    
    for (int i = 0; i < nums.length; i++) {
        int x = nums[i];
        if (currSum < 0) {
            currSum = x;
            start = i;
        } else {
            currSum += x;
        }
        
        if (currSum > maxSum) {
            maxSum = currSum;
            bestStart = start;
            bestEnd = i;
        }
    }
    return maxSum;
}`
  },
  generateTrace: (input = { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }): ExecutionTrace => {
    const rawArr = (input.array as number[]) || [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const nums = [...rawArr];
    const events: ExecutionEvent[] = [];
    let step = 0;

    let maxSum = nums[0];
    let currSum = 0;
    let start = 0;
    let bestStart = 0;
    let bestEnd = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "max_sum = nums[0], curr_sum = 0",
      explanation: `Initialize Kadane's algorithm. Base max_sum = ${maxSum}. Running curr_sum = 0.`,
      variables: { maxSum, currSum, start, bestStart, bestEnd },
      pointers: { i: 0 },
      callStack: [{ id: "main", name: "maxSubArray", args: { length: nums.length }, line: 2 }],
      structureType: "array",
      structureState: [...nums],
      highlightedIndices: [0],
      windowRange: [0, 0]
    });

    for (let i = 0; i < nums.length; i++) {
      const x = nums[i];
      const reset = currSum < 0;

      if (reset) {
        currSum = x;
        start = i;
      } else {
        currSum += x;
      }

      events.push({
        step: ++step,
        type: reset ? "BRANCH" : "ASSIGN",
        sourceLine: reset ? 8 : 11,
        codeSnippet: reset ? `curr_sum = x (${x}), start = ${i}` : `curr_sum += x (${currSum})`,
        explanation: reset
          ? `Index ${i} (value ${x}): Previous curr_sum was negative. Discard prefix! Start fresh subarray from index ${i}. curr_sum = ${x}.`
          : `Index ${i} (value ${x}): Added ${x} to running subarray. New curr_sum = ${currSum}.`,
        expressionEvaluation: {
          rawExpression: "curr_sum < 0",
          substitutedExpression: `${reset ? "Negative prefix" : "Positive/zero prefix"}`,
          result: reset,
          effectDescription: reset ? `Start new subarray at index ${i}` : `Extend existing subarray to index ${i}`
        },
        variables: { i, x, currSum, maxSum, start, bestStart, bestEnd },
        pointers: { i, start, bestStart, bestEnd },
        callStack: [{ id: "main", name: "maxSubArray", args: { i, x, currSum }, line: reset ? 8 : 11 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: [i],
        windowRange: [start, i]
      });

      if (currSum > maxSum) {
        maxSum = currSum;
        bestStart = start;
        bestEnd = i;

        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 14,
          codeSnippet: `max_sum = curr_sum (${maxSum}), best_start = ${bestStart}, best_end = ${bestEnd}`,
          explanation: `New all-time maximum sum discovered! max_sum = ${maxSum} over subarray [${bestStart} ... ${bestEnd}].`,
          variables: { i, x, currSum, maxSum, bestStart, bestEnd },
          pointers: { bestStart, bestEnd, i },
          callStack: [{ id: "main", name: "maxSubArray", args: { maxSum, bestStart, bestEnd }, line: 14 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [bestStart, bestEnd],
          windowRange: [bestStart, bestEnd]
        });
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 19,
      codeSnippet: "return max_sum",
      explanation: `Kadane's algorithm complete! Maximum contiguous subarray sum is ${maxSum} for nums[${bestStart}..${bestEnd}]: [${nums.slice(bestStart, bestEnd + 1).join(", ")}].`,
      variables: { result: maxSum, bestStart, bestEnd },
      pointers: { bestStart, bestEnd },
      callStack: [{ id: "main", name: "maxSubArray", args: {}, line: 19 }],
      structureType: "array",
      structureState: [...nums],
      highlightedIndices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
      windowRange: [bestStart, bestEnd]
    });

    return {
      id: "kadane_trace",
      algorithmId: "kadane_max_subarray",
      title: "Kadane's Algorithm Execution Trace",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
