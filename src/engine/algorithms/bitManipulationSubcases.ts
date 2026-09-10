import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// 1. XOR Cancellation: Single Number (LC 136)
// ============================================================================
export const bitManipulationXorSingleNumberAlgorithm: AlgorithmDefinition = {
  id: "bit_manipulation_single_number",
  name: "Bit Manipulation: XOR Cancellation (Single Number)",
  category: "bit_manipulation",
  patternFamily: "bit_manipulation",
  subPatternId: "bit_single_number",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Finds the single non-duplicate number in an array where every other number appears exactly twice in O(n) time and strictly O(1) space. Leverages XOR algebraic properties: (1) x ^ x = 0 (self-cancellation); (2) x ^ 0 = x (identity); (3) Associativity and Commutativity. All duplicates cancel each other to 0, leaving only the unique number.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Light switches: flipping a light switch twice restores its original off state (x ^ x = 0).",
    "Flipping an odd number of times leaves it on.",
    "Order of numbers does not matter because XOR is commutative."
  ],
  invariants: [
    "running_xor tracks XOR sum of all elements seen so far.",
    "At end of array, all paired bits cancel to 0, leaving the lone odd-frequency element."
  ],
  commonMistakes: [
    "Initializing xor_acc with the first element and then looping from index 0 (XORing the first element twice)."
  ],
  defaultInput: { array: [4, 1, 2, 1, 2] },
  code: {
    python: `def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result`,
    javascript: `function singleNumber(nums) {
    let result = 0;
    for (const num of nums) {
        result ^= num;
    }
    return result;
}`,
    cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int num : nums) result ^= num;
    return result;
}`,
    java: `public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) result ^= num;
    return result;
}`
  },
  generateTrace: (input = { array: [4, 1, 2, 1, 2] }): ExecutionTrace => {
    const nums: number[] = input.array || [4, 1, 2, 1, 2];
    const events: ExecutionEvent[] = [];
    let step = 0;

    let result = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "result = 0",
      explanation: `Initialized XOR accumulator: result = 0 (binary: 0000). Identity property: 0 ^ x = x.`,
      variables: { result: 0, binary: "0000" },
      pointers: {},
      callStack: [{ id: "main", name: "single_number", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...nums]
    });

    for (let i = 0; i < nums.length; i++) {
      const prevResult = result;
      result ^= nums[i];

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 4,
        codeSnippet: `result ^= nums[${i}] (${prevResult} ^ ${nums[i]} = ${result})`,
        explanation: `XORing nums[${i}] = ${nums[i]}: (${prevResult.toString(2)} ^ ${nums[i].toString(2)} = ${result.toString(2)} in binary, decimal: ${result}).`,
        expressionEvaluation: {
          rawExpression: "result ^ num",
          substitutedExpression: `${prevResult} ^ ${nums[i]}`,
          result: result,
          effectDescription: `XOR accumulated to ${result} (binary: ${result.toString(2).padStart(4, "0")})`
        },
        variables: { i, num: nums[i], prevResult, result, binary: result.toString(2).padStart(4, "0") },
        pointers: { current: i },
        callStack: [{ id: "main", name: "single_number", args: { i, num: nums[i] }, line: 4 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: [i]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 5,
      codeSnippet: "return result",
      explanation: `All duplicate pairs cancelled to 0. Unique single number is ${result}!`,
      variables: { result },
      pointers: {},
      callStack: [{ id: "main", name: "single_number", args: {}, line: 5 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "bit_manipulation_single_number_trace",
      algorithmId: "bit_manipulation_single_number",
      title: "Bit Manipulation (XOR Cancellation - Single Number)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// 2. Brian Kernighan's Algorithm (Set Bit Counting - LC 191)
// ============================================================================
export const bitManipulationKernighanAlgorithm: AlgorithmDefinition = {
  id: "bit_manipulation_kernighan",
  name: "Bit Manipulation: Brian Kernighan (Counting Set Bits)",
  category: "bit_manipulation",
  patternFamily: "bit_manipulation",
  subPatternId: "bit_kernighan",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Counts the number of set bits (1s) in an integer in O(k) time where k is the number of 1s (rather than checking all 32 bits). The expression n & (n - 1) always clears the lowest set bit of n in a single operation.",
  timeComplexity: "O(number_of_set_bits)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Subtracting 1 flips the rightmost set bit and turns all trailing 0s into 1s.",
    "ANDing n with (n - 1) zeroes out that rightmost set bit without affecting higher bits.",
    "Runs in iterations equal to the number of 1s, skipping all zero bits."
  ],
  invariants: [
    "Each loop iteration strictly reduces the count of set bits in n by exactly 1.",
    "Loop terminates when n becomes 0."
  ],
  commonMistakes: [
    "Using a 32-iteration loop when Brian Kernighan's algorithm solves it in only k iterations."
  ],
  defaultInput: { n: 29 }, // 29 = 11101 in binary (4 set bits)
  code: {
    python: `def count_set_bits(n):
    count = 0
    while n > 0:
        n &= (n - 1)  # clears lowest set bit
        count += 1
    return count`,
    javascript: `function countSetBits(n) {
    let count = 0;
    while (n > 0) {
        n &= (n - 1); // clears lowest set bit
        count++;
    }
    return count;
}`,
    cpp: `int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
    java: `public int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`
  },
  generateTrace: (input = { n: 29 }): ExecutionTrace => {
    let n = input.n ?? 29;
    const initialN = n;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let count = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `n = ${n} (binary: ${n.toString(2)}), count = 0`,
      explanation: `Initialized Brian Kernighan's Algorithm: n = ${n} (${n.toString(2)} in binary). Counting number of 1-bits.`,
      variables: { n, binary: n.toString(2), count: 0 },
      pointers: {},
      callStack: [{ id: "main", name: "count_set_bits", args: { n }, line: 2 }],
      structureType: "array",
      structureState: [n]
    });

    while (n > 0) {
      const prevN = n;
      const bitCleared = n - (n & (n - 1));
      n &= n - 1;
      count++;

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 4,
        codeSnippet: `n &= (n - 1) (${prevN} & ${prevN - 1} = ${n}); count = ${count}`,
        explanation: `CLEARED LOWEST SET BIT: ${prevN.toString(2)} & ${(prevN - 1).toString(2)} = ${n.toString(2)}. Removed bit value ${bitCleared}. Set bits counted so far: ${count}.`,
        expressionEvaluation: {
          rawExpression: "n & (n - 1)",
          substitutedExpression: `${prevN.toString(2)} & ${(prevN - 1).toString(2)} = ${n.toString(2)}`,
          result: n,
          effectDescription: `Cleared rightmost 1-bit. Remaining: ${n > 0 ? n.toString(2) : "0"}`
        },
        variables: { prevBinary: prevN.toString(2), newBinary: n.toString(2), count, remainingN: n },
        pointers: {},
        callStack: [{ id: "main", name: "count_set_bits", args: { n, count }, line: 4 }],
        structureType: "array",
        structureState: [n]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 6,
      codeSnippet: "return count",
      explanation: `All set bits cleared! Number ${initialN} (${initialN.toString(2)} in binary) contains ${count} set bits.`,
      variables: { result: count },
      pointers: {},
      callStack: [{ id: "main", name: "count_set_bits", args: {}, line: 6 }],
      structureType: "array",
      structureState: [count]
    });

    return {
      id: "bit_manipulation_kernighan_trace",
      algorithmId: "bit_manipulation_kernighan",
      title: "Bit Manipulation (Brian Kernighan's Set-Bit Counting)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
