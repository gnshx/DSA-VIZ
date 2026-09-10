import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// SUBCASE 1: Opposite Ends / Converging (One at Start, One at End)
// ============================================================================
export const twoPointersOppositeEndsAlgorithm: AlgorithmDefinition = {
  id: "two_pointers_opposite_ends",
  name: "Two Pointers: Converging (Start & End)",
  category: "two_pointers",
  patternFamily: "two_pointers",
  subPatternId: "tp_opposite_ends",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Pointers start at extreme opposite boundaries (left = 0, right = n - 1) and converge inward. Monotonicity of sorted input guarantees we can eliminate either the leftmost or rightmost element in O(1) time without missing any valid pair.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Caliper jaws closing inward on a sorted ruler.",
    "If sum is less than target, the only way to increase it is to step the left pointer rightward.",
    "If sum is greater than target, only decrementing the right pointer can reduce it."
  ],
  invariants: [
    "Any pair (x, y) with x < left or y > right cannot sum to target and is discarded.",
    "Search window [left, right] monotonically shrinks by 1 each iteration."
  ],
  commonMistakes: [
    "Applying inward converging pointers on an unsorted array.",
    "Updating both pointers simultaneously without verifying the sum."
  ],
  defaultInput: { array: [1, 2, 4, 7, 11, 15], target: 15 },
  code: {
    python: `def two_sum_sorted(arr, target):
    left = 0
    right = len(arr) - 1
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    javascript: `function twoSumSorted(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        const currSum = arr[left] + arr[right];
        if (currSum === target) return [left, right];
        if (currSum < target) left++;
        else right--;
    }
    return [];
}`,
    cpp: `vector<int> twoSumSorted(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        if (sum < target) left++;
        else right--;
    }
    return {};
}`,
    java: `public int[] twoSumSorted(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`
  },
  generateTrace: (input = { array: [1, 2, 4, 7, 11, 15], target: 15 }): ExecutionTrace => {
    const arr: number[] = input.array || [1, 2, 4, 7, 11, 15];
    const target: number = input.target ?? 15;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let left = 0;
    let right = arr.length - 1;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "left = 0, right = len(arr) - 1",
      explanation: `Initialized Converging Two Pointers: left = 0 (${arr[0]}), right = ${right} (${arr[right]}). Target = ${target}.`,
      variables: { left, right, target },
      pointers: { left, right },
      callStack: [{ id: "main", name: "two_sum_sorted", args: { target }, line: 2 }],
      structureType: "array",
      structureState: [...arr],
      windowRange: [left, right],
      highlightedIndices: [left, right]
    });

    while (left < right) {
      const sum = arr[left] + arr[right];

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 5,
        codeSnippet: "curr_sum = arr[left] + arr[right]",
        explanation: `Comparing pair: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${sum}. Target is ${target}.`,
        expressionEvaluation: {
          rawExpression: "arr[left] + arr[right] == target",
          substitutedExpression: `${arr[left]} + ${arr[right]} = ${sum} vs ${target}`,
          result: sum === target ? "EQUAL" : sum < target ? "TOO SMALL" : "TOO LARGE",
          effectDescription:
            sum === target
              ? "Match found!"
              : sum < target
              ? `Sum ${sum} < ${target}: advance left pointer to increase total sum`
              : `Sum ${sum} > ${target}: decrement right pointer to decrease total sum`
        },
        variables: { left, right, curr_sum: sum, target },
        pointers: { left, right },
        callStack: [{ id: "main", name: "two_sum_sorted", args: { left, right, sum }, line: 5 }],
        structureType: "array",
        structureState: [...arr],
        windowRange: [left, right],
        highlightedIndices: [left, right]
      });

      if (sum === target) {
        events.push({
          step: ++step,
          type: "COMPLETE",
          sourceLine: 7,
          codeSnippet: "return [left, right]",
          explanation: `Pair located! Indices [${left}, ${right}] with values (${arr[left]} + ${arr[right]} = ${target}).`,
          variables: { result: [left, right] },
          pointers: { left, right },
          callStack: [{ id: "main", name: "two_sum_sorted", args: {}, line: 7 }],
          structureType: "array",
          structureState: [...arr],
          highlightedIndices: [left, right]
        });
        return {
          id: "two_pointers_opposite_ends_trace",
          algorithmId: "two_pointers_opposite_ends",
          title: "Two Pointers (Converging Start & End)",
          structureType: "array",
          totalSteps: events.length,
          events
        };
      } else if (sum < target) {
        left++;
        events.push({
          step: ++step,
          type: "POINTER_MOVE",
          sourceLine: 9,
          codeSnippet: "left += 1",
          explanation: `Shifted left pointer forward to index ${left} (${arr[left]}).`,
          variables: { left, right, target },
          pointers: { left, right },
          callStack: [{ id: "main", name: "two_sum_sorted", args: { left, right }, line: 9 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [left, right],
          highlightedIndices: [left, right]
        });
      } else {
        right--;
        events.push({
          step: ++step,
          type: "POINTER_MOVE",
          sourceLine: 11,
          codeSnippet: "right -= 1",
          explanation: `Shifted right pointer backward to index ${right} (${arr[right]}).`,
          variables: { left, right, target },
          pointers: { left, right },
          callStack: [{ id: "main", name: "two_sum_sorted", args: { left, right }, line: 11 }],
          structureType: "array",
          structureState: [...arr],
          windowRange: [left, right],
          highlightedIndices: [left, right]
        });
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 12,
      codeSnippet: "return []",
      explanation: "Pointers crossed without finding target pair.",
      variables: { result: [] },
      pointers: {},
      callStack: [{ id: "main", name: "two_sum_sorted", args: {}, line: 12 }],
      structureType: "array",
      structureState: [...arr]
    });

    return {
      id: "two_pointers_opposite_ends_trace",
      algorithmId: "two_pointers_opposite_ends",
      title: "Two Pointers (Converging Start & End)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// SUBCASE 2: Both at End / Backward Direction (In-Place Fill)
// ============================================================================
export const twoPointersBothAtEndAlgorithm: AlgorithmDefinition = {
  id: "two_pointers_both_at_end",
  name: "Two Pointers: Both at End (Backward Merge)",
  category: "two_pointers",
  patternFamily: "two_pointers",
  subPatternId: "tp_both_at_end",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Both source pointers and the write pointer start at the END and move backward. By populating the array from the highest index downwards, we overwrite only unused or already processed cells, achieving O(1) auxiliary space.",
  timeComplexity: "O(m + n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Reverse parking: placing the largest items into the back of a truck first.",
    "Eliminates the need for shifting elements rightward, which would take O(n²).",
    "Pointers p1, p2, and write all travel from right to left."
  ],
  invariants: [
    "Index 'write' is always >= max(p1, p2), so unprocessed elements in nums1 are never prematurely overwritten.",
    "Array elements from index 'write + 1' to end are fully sorted."
  ],
  commonMistakes: [
    "Merging from the front (index 0) which causes nums1 elements to be overwritten.",
    "Stopping when p1 < 0 instead of checking if elements remain in nums2."
  ],
  defaultInput: {
    nums1: [1, 3, 7, 0, 0, 0],
    m: 3,
    nums2: [2, 5, 8],
    n: 3
  },
  code: {
    python: `def merge_sorted_backward(nums1, m, nums2, n):
    p1 = m - 1
    p2 = n - 1
    write = m + n - 1
    
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[write] = nums1[p1]
            p1 -= 1
        else:
            nums1[write] = nums2[p2]
            p2 -= 1
        write -= 1
    return nums1`,
    javascript: `function mergeSortedBackward(nums1, m, nums2, n) {
    let p1 = m - 1;
    let p2 = n - 1;
    let write = m + n - 1;
    
    while (p2 >= 0) {
        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
            nums1[write] = nums1[p1];
            p1--;
        } else {
            nums1[write] = nums2[p2];
            p2--;
        }
        write--;
    }
    return nums1;
}`,
    cpp: `void mergeSortedBackward(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int p1 = m - 1, p2 = n - 1, write = m + n - 1;
    while (p2 >= 0) {
        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
            nums1[write--] = nums1[p1--];
        } else {
            nums1[write--] = nums2[p2--];
        }
    }
}`,
    java: `public void mergeSortedBackward(int[] nums1, int m, int[] nums2, int n) {
    int p1 = m - 1, p2 = n - 1, write = m + n - 1;
    while (p2 >= 0) {
        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
            nums1[write--] = nums1[p1--];
        } else {
            nums1[write--] = nums2[p2--];
        }
    }
}`
  },
  generateTrace: (input = { nums1: [1, 3, 7, 0, 0, 0], m: 3, nums2: [2, 5, 8], n: 3 }): ExecutionTrace => {
    const nums1: number[] = [...(input.nums1 || [1, 3, 7, 0, 0, 0])];
    const m = input.m ?? 3;
    const nums2: number[] = [...(input.nums2 || [2, 5, 8])];
    const n = input.n ?? 3;

    const events: ExecutionEvent[] = [];
    let step = 0;

    let p1 = m - 1;
    let p2 = n - 1;
    let write = m + n - 1;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "p1 = m - 1, p2 = n - 1, write = m + n - 1",
      explanation: `Initialized Backward Two Pointers: p1 at end of nums1 (${p1}), p2 at end of nums2 (${p2}), write pointer at tail (${write}).`,
      variables: { p1, p2, write, "nums1[p1]": nums1[p1], "nums2[p2]": nums2[p2] },
      pointers: { p1, p2, write },
      callStack: [{ id: "main", name: "merge_sorted_backward", args: { m, n }, line: 2 }],
      structureType: "array",
      structureState: [...nums1],
      highlightedIndices: [p1, write]
    });

    while (p2 >= 0) {
      const val1 = p1 >= 0 ? nums1[p1] : -Infinity;
      const val2 = nums2[p2];

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 7,
        codeSnippet: "if p1 >= 0 and nums1[p1] > nums2[p2]:",
        explanation: `Comparing tail candidates: nums1[${p1}] (${val1}) vs nums2[${p2}] (${val2}).`,
        expressionEvaluation: {
          rawExpression: "nums1[p1] > nums2[p2]",
          substitutedExpression: `${val1} > ${val2}`,
          result: val1 > val2,
          effectDescription:
            val1 > val2
              ? `nums1[${p1}] (${val1}) is larger: place it at nums1[${write}]`
              : `nums2[${p2}] (${val2}) is >= nums1: place it at nums1[${write}]`
        },
        variables: { p1, p2, write, val1, val2 },
        pointers: { p1: Math.max(p1, 0), p2, write },
        callStack: [{ id: "main", name: "merge_sorted_backward", args: { write }, line: 7 }],
        structureType: "array",
        structureState: [...nums1],
        highlightedIndices: [write, Math.max(p1, 0)]
      });

      if (p1 >= 0 && nums1[p1] > nums2[p2]) {
        nums1[write] = nums1[p1];
        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 8,
          codeSnippet: "nums1[write] = nums1[p1]; p1 -= 1",
          explanation: `Placed ${nums1[p1]} into nums1[${write}]. Decremented p1 to ${p1 - 1}.`,
          variables: { write, placed: nums1[write], next_p1: p1 - 1 },
          pointers: { p1: Math.max(p1 - 1, 0), write },
          callStack: [{ id: "main", name: "merge_sorted_backward", args: { write }, line: 8 }],
          structureType: "array",
          structureState: [...nums1],
          swappedIndices: [write, p1]
        });
        p1--;
      } else {
        nums1[write] = nums2[p2];
        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 11,
          codeSnippet: "nums1[write] = nums2[p2]; p2 -= 1",
          explanation: `Placed nums2[${p2}] (${nums2[p2]}) into nums1[${write}]. Decremented p2 to ${p2 - 1}.`,
          variables: { write, placed: nums1[write], next_p2: p2 - 1 },
          pointers: { p2: Math.max(p2 - 1, 0), write },
          callStack: [{ id: "main", name: "merge_sorted_backward", args: { write }, line: 11 }],
          structureType: "array",
          structureState: [...nums1],
          highlightedIndices: [write]
        });
        p2--;
      }

      write--;
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 14,
      codeSnippet: "return nums1",
      explanation: "Backward merge complete! Array nums1 is now fully sorted in-place with O(1) extra space.",
      variables: { result: [...nums1] },
      pointers: {},
      callStack: [{ id: "main", name: "merge_sorted_backward", args: {}, line: 14 }],
      structureType: "array",
      structureState: [...nums1]
    });

    return {
      id: "two_pointers_both_at_end_trace",
      algorithmId: "two_pointers_both_at_end",
      title: "Two Pointers (Both at End - Backward Merge)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// SUBCASE 3: One Fixed, Two Shifting (Multi-Pointer / 3Sum)
// ============================================================================
export const twoPointersOneFixedTwoShiftingAlgorithm: AlgorithmDefinition = {
  id: "two_pointers_one_fixed_two_shifting",
  name: "Two Pointers: One Fixed, Two Shifting (3Sum)",
  category: "two_pointers",
  patternFamily: "two_pointers",
  subPatternId: "tp_one_fixed_two_shifting",
  structureType: "array",
  difficulty: "Medium",
  description:
    "An outer loop fixes pointer 'i' as an anchor element. For each fixed 'i', two inner pointers ('left' and 'right') converge inward from (i + 1) and (n - 1) to find complementary pairs where nums[i] + nums[left] + nums[right] == 0.",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Anchoring one tent pole (fixed i), while adjusting the two movable guylines (left & right).",
    "Reduces 3-variable search O(n³) down to O(n * n) = O(n²).",
    "Skip duplicate elements after finding a triplet to avoid duplicate solutions."
  ],
  invariants: [
    "Array is pre-sorted: nums[i] <= nums[left] <= nums[right].",
    "For each fixed i, all valid triplets starting at i will be checked within [i + 1 ... n - 1]."
  ],
  commonMistakes: [
    "Not sorting the array first.",
    "Forgetting to skip duplicates on 'i', 'left', and 'right', causing redundant triplets."
  ],
  defaultInput: { array: [-4, -1, -1, 0, 1, 2] },
  code: {
    python: `def three_sum(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
            
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result`,
    javascript: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const total = nums[i] + nums[left] + nums[right];
            if (total === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
            } else if (total < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
    cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    for (int i = 0; i < nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.size() - 1;
        while (left < right) {
            int total = nums[i] + nums[left] + nums[right];
            if (total == 0) {
                result.push_back({nums[i], nums[left], nums[right]});
                left++; right--;
            } else if (total < 0) left++;
            else right--;
        }
    }
    return result;
}`,
    java: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int total = nums[i] + nums[left] + nums[right];
            if (total == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++; right--;
            } else if (total < 0) left++;
            else right--;
        }
    }
    return result;
}`
  },
  generateTrace: (input = { array: [-4, -1, -1, 0, 1, 2] }): ExecutionTrace => {
    const nums: number[] = [...(input.array || [-4, -1, -1, 0, 1, 2])].sort((a, b) => a - b);
    const events: ExecutionEvent[] = [];
    let step = 0;
    const result: number[][] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "nums.sort()",
      explanation: `Sorted array for 3Sum: [${nums.join(", ")}]. Strategy: Fix index 'i', then converge 'left' and 'right'.`,
      variables: { nums },
      pointers: {},
      callStack: [{ id: "main", name: "three_sum", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...nums]
    });

    for (let i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        continue;
      }

      let left = i + 1;
      let right = nums.length - 1;

      events.push({
        step: ++step,
        type: "POINTER_MOVE",
        sourceLine: 8,
        codeSnippet: `left, right = i + 1, len(nums) - 1 (i = ${i}, fixed = ${nums[i]})`,
        explanation: `ANCHOR FIXED: index i = ${i} (value ${nums[i]}). Initialized inner shifting pointers: left = ${left} (${nums[left]}), right = ${right} (${nums[right]}).`,
        variables: { i, fixed_val: nums[i], left, right },
        pointers: { i, left, right },
        callStack: [{ id: "main", name: "three_sum", args: { i, left, right }, line: 8 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: [i, left, right]
      });

      while (left < right) {
        const total = nums[i] + nums[left] + nums[right];

        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 10,
          codeSnippet: "total = nums[i] + nums[left] + nums[right]",
          explanation: `Triplet sum: nums[${i}] (${nums[i]}) + nums[${left}] (${nums[left]}) + nums[${right}] (${nums[right]}) = ${total}. (Target = 0)`,
          expressionEvaluation: {
            rawExpression: "nums[i] + nums[left] + nums[right] == 0",
            substitutedExpression: `${nums[i]} + ${nums[left]} + ${nums[right]} = ${total}`,
            result: total === 0 ? "ZERO MATCH" : total < 0 ? "TOO SMALL" : "TOO LARGE",
            effectDescription:
              total === 0
                ? "Valid triplet discovered!"
                : total < 0
                ? "Total < 0: advance left to increase sum"
                : "Total > 0: decrement right to decrease sum"
          },
          variables: { i, left, right, total },
          pointers: { i, left, right },
          callStack: [{ id: "main", name: "three_sum", args: { total }, line: 10 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [i, left, right]
        });

        if (total === 0) {
          result.push([nums[i], nums[left], nums[right]]);
          events.push({
            step: ++step,
            type: "WRITE",
            sourceLine: 12,
            codeSnippet: "result.append([nums[i], nums[left], nums[right]])",
            explanation: `Recorded triplet: [${nums[i]}, ${nums[left]}, ${nums[right]}]. Advancing left and decrementing right.`,
            variables: { found: [nums[i], nums[left], nums[right]], total_triplets: result.length },
            pointers: { i, left, right },
            callStack: [{ id: "main", name: "three_sum", args: {}, line: 12 }],
            structureType: "array",
            structureState: [...nums],
            highlightedIndices: [i, left, right]
          });
          left++;
          right--;
        } else if (total < 0) {
          left++;
        } else {
          right--;
        }
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 18,
      codeSnippet: "return result",
      explanation: `All anchor positions evaluated! Total triplets found: ${result.length}.`,
      variables: { result },
      pointers: {},
      callStack: [{ id: "main", name: "three_sum", args: {}, line: 18 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "two_pointers_one_fixed_two_shifting_trace",
      algorithmId: "two_pointers_one_fixed_two_shifting",
      title: "Two Pointers (One Fixed, Two Shifting - 3Sum)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// SUBCASE 4: Fast and Slow Pointers (Tortoise & Hare)
// ============================================================================
export const twoPointersFastSlowAlgorithm: AlgorithmDefinition = {
  id: "two_pointers_fast_slow",
  name: "Two Pointers: Fast & Slow (Tortoise & Hare)",
  category: "two_pointers",
  patternFamily: "two_pointers",
  subPatternId: "tp_fast_slow",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Two pointers move in the SAME direction but at DIFFERENT speeds (slow advances by 1 step, fast advances by 2 steps). Used to find middle elements, detect cycles, or identify circular repeating sequences in O(n) time and O(1) space.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "The Tortoise (1 mph) and the Hare (2 mph) running on a track.",
    "When the Hare finishes the track (reaches the end), the Tortoise is exactly in the middle!",
    "If the track is circular (has a loop), the Hare will inevitably lap and meet the Tortoise."
  ],
  invariants: [
    "At any step k, slow is at index k, and fast is at index 2k.",
    "Distance between fast and slow increases by 1 each step."
  ],
  commonMistakes: [
    "Checking fast.next without checking fast != null first (causing null pointer exceptions).",
    "Moving slow by 2 steps instead of 1."
  ],
  defaultInput: { array: [10, 20, 30, 40, 50, 60, 70] },
  code: {
    python: `def find_middle_element(arr):
    slow = 0
    fast = 0
    
    while fast < len(arr) and fast + 1 < len(arr):
        slow += 1
        fast += 2
        
    return arr[slow]`,
    javascript: `function findMiddleElement(arr) {
    let slow = 0;
    let fast = 0;
    
    while (fast < arr.length && fast + 1 < arr.length) {
        slow += 1;
        fast += 2;
    }
    return arr[slow];
}`,
    cpp: `int findMiddleElement(const vector<int>& arr) {
    int slow = 0, fast = 0;
    while (fast < arr.size() && fast + 1 < arr.size()) {
        slow += 1;
        fast += 2;
    }
    return arr[slow];
}`,
    java: `public int findMiddleElement(int[] arr) {
    int slow = 0, fast = 0;
    while (fast < arr.length && fast + 1 < arr.length) {
        slow += 1;
        fast += 2;
    }
    return arr[slow];
}`
  },
  generateTrace: (input = { array: [10, 20, 30, 40, 50, 60, 70] }): ExecutionTrace => {
    const arr: number[] = input.array || [10, 20, 30, 40, 50, 60, 70];
    const events: ExecutionEvent[] = [];
    let step = 0;

    let slow = 0;
    let fast = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "slow = 0, fast = 0",
      explanation: `Initialized Fast & Slow pointers: slow (1x speed) at index 0 (${arr[0]}), fast (2x speed) at index 0 (${arr[0]}).`,
      variables: { slow, fast },
      pointers: { slow, fast },
      callStack: [{ id: "main", name: "find_middle_element", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...arr],
      highlightedIndices: [slow]
    });

    while (fast < arr.length && fast + 1 < arr.length) {
      slow += 1;
      fast += 2;

      events.push({
        step: ++step,
        type: "POINTER_MOVE",
        sourceLine: 6,
        codeSnippet: "slow += 1; fast += 2",
        explanation: `Slow stepped 1 index to [${slow}] (${arr[slow]}). Fast leaped 2 indices to [${Math.min(fast, arr.length - 1)}] (${arr[Math.min(fast, arr.length - 1)]}).`,
        expressionEvaluation: {
          rawExpression: "fast + 2 < len(arr)",
          substitutedExpression: `${fast} < ${arr.length}`,
          result: fast < arr.length,
          effectDescription: `Fast has covered ${fast}/${arr.length} of the sequence; slow is precisely at the midpoint of explored range.`
        },
        variables: { slow, fast, "arr[slow]": arr[slow] },
        pointers: { slow, fast: Math.min(fast, arr.length - 1) },
        callStack: [{ id: "main", name: "find_middle_element", args: { slow, fast }, line: 6 }],
        structureType: "array",
        structureState: [...arr],
        highlightedIndices: [slow, Math.min(fast, arr.length - 1)]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 8,
      codeSnippet: "return arr[slow]",
      explanation: `Fast reached the end of the array! Slow pointer is located exactly at the middle element: arr[${slow}] = ${arr[slow]}.`,
      variables: { middleIndex: slow, middleValue: arr[slow] },
      pointers: { slow },
      callStack: [{ id: "main", name: "find_middle_element", args: {}, line: 8 }],
      structureType: "array",
      structureState: [...arr],
      highlightedIndices: [slow]
    });

    return {
      id: "two_pointers_fast_slow_trace",
      algorithmId: "two_pointers_fast_slow",
      title: "Two Pointers (Fast & Slow - Tortoise & Hare)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// SUBCASE 5: Same Direction / Read-Write (In-Place Compaction)
// ============================================================================
export const twoPointersReadWriteAlgorithm: AlgorithmDefinition = {
  id: "two_pointers_read_write",
  name: "Two Pointers: Same Direction (Read & Write Compaction)",
  category: "two_pointers",
  patternFamily: "two_pointers",
  subPatternId: "tp_read_write",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Both pointers move in the SAME direction. A 'read' (or runner) pointer iterates through every element, while a 'write' (or anchor) pointer marks the position where the next valid element must be placed. Compresses arrays in-place in O(n) time and O(1) space.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "A conveyor belt inspector (read) scanning each box and packing only good boxes into a clean shipping crate (write).",
    "The write pointer never moves ahead of the read pointer, so uninspected elements are never lost."
  ],
  invariants: [
    "All elements strictly before 'write' index satisfy the problem constraints (e.g. non-zero or unique).",
    "write <= read at all times."
  ],
  commonMistakes: [
    "Incrementing write pointer when the element should be skipped.",
    "Using splice or shift in array which degrades runtime from O(n) to O(n²)."
  ],
  defaultInput: { array: [0, 1, 0, 3, 12, 0, 8] },
  code: {
    python: `def move_zeroes(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            write += 1
    return nums`,
    javascript: `function moveZeroes(nums) {
    let write = 0;
    for (let read = 0; read < nums.length; read++) {
        if (nums[read] !== 0) {
            [nums[write], nums[read]] = [nums[read], nums[write]];
            write++;
        }
    }
    return nums;
}`,
    cpp: `void moveZeroes(vector<int>& nums) {
    int write = 0;
    for (int read = 0; read < nums.size(); read++) {
        if (nums[read] != 0) {
            swap(nums[write], nums[read]);
            write++;
        }
    }
}`,
    java: `public void moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) {
            int temp = nums[write];
            nums[write] = nums[read];
            nums[read] = temp;
            write++;
        }
    }
}`
  },
  generateTrace: (input = { array: [0, 1, 0, 3, 12, 0, 8] }): ExecutionTrace => {
    const nums: number[] = [...(input.array || [0, 1, 0, 3, 12, 0, 8])];
    const events: ExecutionEvent[] = [];
    let step = 0;

    let write = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "write = 0",
      explanation: "Initialized Read-Write Pointers: write pointer at index 0 (clean zone boundary).",
      variables: { write },
      pointers: { write },
      callStack: [{ id: "main", name: "move_zeroes", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...nums],
      highlightedIndices: [write]
    });

    for (let read = 0; read < nums.length; read++) {
      const isNonZero = nums[read] !== 0;

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 4,
        codeSnippet: "if nums[read] != 0:",
        explanation: `Read pointer inspecting nums[${read}] = ${nums[read]}. ${
          isNonZero ? `Non-zero value! Swap with write position [${write}].` : "Zero encountered. Skip write increment."
        }`,
        expressionEvaluation: {
          rawExpression: "nums[read] != 0",
          substitutedExpression: `${nums[read]} != 0`,
          result: isNonZero,
          effectDescription: isNonZero ? `Compact non-zero ${nums[read]} into write slot ${write}` : "Leave zero behind"
        },
        variables: { read, write, "nums[read]": nums[read] },
        pointers: { read, write },
        callStack: [{ id: "main", name: "move_zeroes", args: { read, write }, line: 4 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: [read, write]
      });

      if (isNonZero) {
        const temp = nums[write];
        nums[write] = nums[read];
        nums[read] = temp;

        events.push({
          step: ++step,
          type: "SWAP",
          sourceLine: 5,
          codeSnippet: "nums[write], nums[read] = nums[read], nums[write]; write += 1",
          explanation: `Swapped nums[${write}] and nums[${read}]. Advanced write pointer to index ${write + 1}.`,
          variables: { read, write: write + 1 },
          pointers: { read, write: write + 1 },
          callStack: [{ id: "main", name: "move_zeroes", args: { read, write }, line: 5 }],
          structureType: "array",
          structureState: [...nums],
          swappedIndices: [write, read]
        });

        write++;
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 7,
      codeSnippet: "return nums",
      explanation: `Compaction finished! All ${write} non-zero elements compacted to the front, all zeroes shifted to the back.`,
      variables: { nonZeroCount: write, result: [...nums] },
      pointers: { write },
      callStack: [{ id: "main", name: "move_zeroes", args: {}, line: 7 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "two_pointers_read_write_trace",
      algorithmId: "two_pointers_read_write",
      title: "Two Pointers (Same Direction - Read & Write Compaction)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// SUBCASE 6: Two Sequences Parallel (Merge Two Sorted Arrays)
// ============================================================================
export const twoPointersTwoArraysAlgorithm: AlgorithmDefinition = {
  id: "two_pointers_two_arrays",
  name: "Two Pointers: Two Sequences (Merge Sorted Lists)",
  category: "two_pointers",
  patternFamily: "two_pointers",
  subPatternId: "tp_two_sequences",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Two independent pointers traverse two separate sorted arrays simultaneously (pA on array A, pB on array B). At each step, compare elements and advance only the pointer that points to the smaller element.",
  timeComplexity: "O(n + m)",
  spaceComplexity: "O(n + m)",
  mentalModel: [
    "Zipper teeth interlocking from two distinct zipper tracks.",
    "Advancing the smaller element ensures the resulting merged stream is monotonically sorted."
  ],
  invariants: [
    "Output array contains all elements processed so far in strictly sorted order.",
    "Unprocessed elements in A and B are all >= the last merged element."
  ],
  commonMistakes: [
    "Forgetting to append the remaining tail of whichever array has unexhausted elements after the loop."
  ],
  defaultInput: { arrA: [1, 4, 7, 9], arrB: [2, 3, 6, 8, 10] },
  code: {
    python: `def merge_two_sorted(arrA, arrB):
    pA, pB = 0, 0
    merged = []
    
    while pA < len(arrA) and pB < len(arrB):
        if arrA[pA] <= arrB[pB]:
            merged.append(arrA[pA])
            pA += 1
        else:
            merged.append(arrB[pB])
            pB += 1
            
    merged.extend(arrA[pA:])
    merged.extend(arrB[pB:])
    return merged`,
    javascript: `function mergeTwoSorted(arrA, arrB) {
    let pA = 0, pB = 0;
    const merged = [];
    while (pA < arrA.length && pB < arrB.length) {
        if (arrA[pA] <= arrB[pB]) {
            merged.push(arrA[pA++]);
        } else {
            merged.push(arrB[pB++]);
        }
    }
    return merged.concat(arrA.slice(pA)).concat(arrB.slice(pB));
}`,
    cpp: `vector<int> mergeTwoSorted(const vector<int>& A, const vector<int>& B) {
    int pA = 0, pB = 0;
    vector<int> merged;
    while (pA < A.size() && pB < B.size()) {
        if (A[pA] <= B[pB]) merged.push_back(A[pA++]);
        else merged.push_back(B[pB++]);
    }
    while (pA < A.size()) merged.push_back(A[pA++]);
    while (pB < B.size()) merged.push_back(B[pB++]);
    return merged;
}`,
    java: `public int[] mergeTwoSorted(int[] A, int[] B) {
    int pA = 0, pB = 0, k = 0;
    int[] merged = new int[A.length + B.length];
    while (pA < A.length && pB < B.length) {
        if (A[pA] <= B[pB]) merged[k++] = A[pA++];
        else merged[k++] = B[pB++];
    }
    while (pA < A.length) merged[k++] = A[pA++];
    while (pB < B.length) merged[k++] = B[pB++];
    return merged;
}`
  },
  generateTrace: (input = { arrA: [1, 4, 7, 9], arrB: [2, 3, 6, 8, 10] }): ExecutionTrace => {
    const arrA: number[] = input.arrA || [1, 4, 7, 9];
    const arrB: number[] = input.arrB || [2, 3, 6, 8, 10];
    const events: ExecutionEvent[] = [];
    let step = 0;

    let pA = 0;
    let pB = 0;
    const merged: number[] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "pA, pB = 0, 0",
      explanation: `Initialized Dual Sequence Pointers: pA at A[0] (${arrA[0]}), pB at B[0] (${arrB[0]}).`,
      variables: { pA, pB, arrA, arrB },
      pointers: { pA, pB },
      callStack: [{ id: "main", name: "merge_two_sorted", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...merged]
    });

    while (pA < arrA.length && pB < arrB.length) {
      const valA = arrA[pA];
      const valB = arrB[pB];

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 6,
        codeSnippet: "if arrA[pA] <= arrB[pB]:",
        explanation: `Comparing arrA[${pA}] (${valA}) vs arrB[${pB}] (${valB}).`,
        expressionEvaluation: {
          rawExpression: "arrA[pA] <= arrB[pB]",
          substitutedExpression: `${valA} <= ${valB}`,
          result: valA <= valB,
          effectDescription:
            valA <= valB
              ? `Select ${valA} from Array A; advance pA`
              : `Select ${valB} from Array B; advance pB`
        },
        variables: { pA, pB, valA, valB },
        pointers: { pA, pB },
        callStack: [{ id: "main", name: "merge_two_sorted", args: { pA, pB }, line: 6 }],
        structureType: "array",
        structureState: [...merged]
      });

      if (valA <= valB) {
        merged.push(valA);
        pA++;
      } else {
        merged.push(valB);
        pB++;
      }

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 7,
        codeSnippet: "merged.append(...) (merged size = " + merged.length + ")",
        explanation: `Appended ${merged[merged.length - 1]} into merged output stream. Current merged: [${merged.join(", ")}].`,
        variables: { merged: [...merged], pA, pB },
        pointers: { pA: Math.min(pA, arrA.length - 1), pB: Math.min(pB, arrB.length - 1) },
        callStack: [{ id: "main", name: "merge_two_sorted", args: {}, line: 7 }],
        structureType: "array",
        structureState: [...merged],
        highlightedIndices: [merged.length - 1]
      });
    }

    // Remaining elements
    while (pA < arrA.length) {
      merged.push(arrA[pA]);
      pA++;
    }
    while (pB < arrB.length) {
      merged.push(arrB[pB]);
      pB++;
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 14,
      codeSnippet: "return merged",
      explanation: `Finished merging both arrays! Final sorted result has ${merged.length} elements: [${merged.join(", ")}].`,
      variables: { result: merged },
      pointers: {},
      callStack: [{ id: "main", name: "merge_two_sorted", args: {}, line: 14 }],
      structureType: "array",
      structureState: [...merged]
    });

    return {
      id: "two_pointers_two_arrays_trace",
      algorithmId: "two_pointers_two_arrays",
      title: "Two Pointers (Two Sequences - Merge Sorted Arrays)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
