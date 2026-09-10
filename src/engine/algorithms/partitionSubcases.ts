import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// SUBCASE: Dutch National Flag (3-Way Partitioning: Low, Mid, High)
// ============================================================================
export const dutchNationalFlagAlgorithm: AlgorithmDefinition = {
  id: "dutch_national_flag",
  name: "Partitioning: Dutch National Flag (3-Way Partition)",
  category: "sorting",
  patternFamily: "sorting",
  subPatternId: "dnf_partition",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Partitions an array into three distinct contiguous categories (e.g. 0s, 1s, and 2s) in a single pass using three pointers: 'low' (boundary of 0s), 'mid' (current scanning element), and 'high' (boundary of 2s) in O(n) time and O(1) space.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Three color zones on the flag of the Netherlands: Red (0), White (1), Blue (2).",
    "Pointers maintain four regions: [0..low-1] are 0s, [low..mid-1] are 1s, [mid..high] are unclassified, [high+1..n-1] are 2s.",
    "When arr[mid] == 2, swap with high and decrement high WITHOUT advancing mid, because the swapped item from high hasn't been classified yet!"
  ],
  invariants: [
    "Elements strictly before 'low' are 0.",
    "Elements between 'low' and 'mid - 1' are 1.",
    "Elements strictly after 'high' are 2."
  ],
  commonMistakes: [
    "Incrementing 'mid' when swapping with 'high'. The element brought from 'high' is unknown and must be re-evaluated at mid!",
    "Using two passes (counting sort) when single-pass O(1) space is required."
  ],
  defaultInput: { array: [2, 0, 2, 1, 1, 0] },
  code: {
    python: `def sort_colors(nums):
    low = 0
    mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else: # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    return nums`,
    javascript: `function sortColors(nums) {
    let low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
    return nums;
}`,
    cpp: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}`,
    java: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int temp = nums[low];
            nums[low++] = nums[mid];
            nums[mid++] = temp;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int temp = nums[mid];
            nums[mid] = nums[high];
            nums[high--] = temp;
        }
    }
}`
  },
  generateTrace: (input = { array: [2, 0, 2, 1, 1, 0] }): ExecutionTrace => {
    const nums: number[] = [...(input.array || [2, 0, 2, 1, 1, 0])];
    const events: ExecutionEvent[] = [];
    let step = 0;

    let low = 0;
    let mid = 0;
    let high = nums.length - 1;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "low = 0, mid = 0, high = len(nums) - 1",
      explanation: `Initialized Dutch National Flag 3-Way Partition: low = 0 (0s boundary), mid = 0 (scanner), high = ${high} (2s boundary).`,
      variables: { low, mid, high },
      pointers: { low, mid, high },
      callStack: [{ id: "main", name: "sort_colors", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...nums],
      highlightedIndices: [low, mid, high]
    });

    while (mid <= high) {
      const val = nums[mid];

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 7,
        codeSnippet: `if nums[mid] == ${val}: (mid = ${mid})`,
        explanation: `Inspecting element nums[${mid}] = ${val}.`,
        expressionEvaluation: {
          rawExpression: "nums[mid]",
          substitutedExpression: `nums[${mid}] = ${val}`,
          result: val === 0 ? "ZERO (Swap with low)" : val === 1 ? "ONE (Keep in middle)" : "TWO (Swap with high)",
          effectDescription:
            val === 0
              ? `0 belongs in left bucket: swap nums[${low}] and nums[${mid}]`
              : val === 1
              ? "1 belongs in center bucket: advance mid"
              : `2 belongs in right bucket: swap nums[${mid}] and nums[${high}], decrement high`
        },
        variables: { low, mid, high, "nums[mid]": val },
        pointers: { low, mid, high },
        callStack: [{ id: "main", name: "sort_colors", args: { mid, val }, line: 7 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: [low, mid, high]
      });

      if (val === 0) {
        const temp = nums[low];
        nums[low] = nums[mid];
        nums[mid] = temp;

        events.push({
          step: ++step,
          type: "SWAP",
          sourceLine: 8,
          codeSnippet: "nums[low], nums[mid] = nums[mid], nums[low]; low += 1; mid += 1",
          explanation: `Swapped nums[${low}] and nums[${mid}]. Advanced both low and mid.`,
          variables: { low: low + 1, mid: mid + 1, high },
          pointers: { low: low + 1, mid: mid + 1, high },
          callStack: [{ id: "main", name: "sort_colors", args: {}, line: 8 }],
          structureType: "array",
          structureState: [...nums],
          swappedIndices: [low, mid]
        });

        low++;
        mid++;
      } else if (val === 1) {
        mid++;
        events.push({
          step: ++step,
          type: "POINTER_MOVE",
          sourceLine: 12,
          codeSnippet: "mid += 1",
          explanation: `Value 1 is already in middle partition [low..mid]. Advanced mid to index ${mid}.`,
          variables: { low, mid, high },
          pointers: { low, mid: Math.min(mid, nums.length - 1), high },
          callStack: [{ id: "main", name: "sort_colors", args: {}, line: 12 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [low, Math.min(mid, nums.length - 1), high]
        });
      } else {
        const temp = nums[mid];
        nums[mid] = nums[high];
        nums[high] = temp;

        events.push({
          step: ++step,
          type: "SWAP",
          sourceLine: 14,
          codeSnippet: "nums[mid], nums[high] = nums[high], nums[mid]; high -= 1",
          explanation: `Swapped 2 into nums[${high}]. Decremented high to ${high - 1}. NOTE: mid remains at ${mid} to inspect the newly arrived element from high!`,
          variables: { low, mid, high: high - 1 },
          pointers: { low, mid, high: Math.max(high - 1, 0) },
          callStack: [{ id: "main", name: "sort_colors", args: {}, line: 14 }],
          structureType: "array",
          structureState: [...nums],
          swappedIndices: [mid, high]
        });

        high--;
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 16,
      codeSnippet: "return nums",
      explanation: `3-Way Partition complete! Array sorted into [0s, 1s, 2s]: [${nums.join(", ")}].`,
      variables: { result: [...nums] },
      pointers: {},
      callStack: [{ id: "main", name: "sort_colors", args: {}, line: 16 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "dutch_national_flag_trace",
      algorithmId: "dutch_national_flag",
      title: "Dutch National Flag (3-Way Partitioning)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
