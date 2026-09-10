import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// 1. Subsets / Power Set (Include / Exclude Decision Tree - LC 78)
// ============================================================================
export const backtrackingSubsetsAlgorithm: AlgorithmDefinition = {
  id: "backtracking_subsets",
  name: "Backtracking: Subsets / Power Set (Include / Exclude)",
  category: "backtracking",
  patternFamily: "backtracking",
  subPatternId: "backtrack_subsets",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Generates all 2^n subsets using a binary decision tree. At each element index, branches twice: (1) include the element in the current subset, explore, and backtrack; (2) exclude the element and explore. Explores state transitions with recursive Choose -> Explore -> Undo.",
  timeComplexity: "O(n * 2^n)",
  spaceComplexity: "O(n) recursion stack",
  mentalModel: [
    "A binary choice tree of height n: for each item, flip a coin (YES include, or NO exclude).",
    "Backtracking restores the state so sibling branches start with a pristine canvas."
  ],
  invariants: [
    "At depth i in the recursion, decisions for elements 0 to i - 1 have been locked.",
    "Result contains exactly 2^n distinct subsets for an array of n unique elements."
  ],
  commonMistakes: [
    "Appending a mutable reference of 'current' to results instead of a copy (current[:]), resulting in empty lists at the end."
  ],
  defaultInput: { array: [1, 2, 3] },
  code: {
    python: `def subsets(nums):
    result = []
    
    def backtrack(index, current):
        if index == len(nums):
            result.append(list(current))
            return
            
        # Decision 1: INCLUDE nums[index]
        current.append(nums[index])
        backtrack(index + 1, current)
        
        # Undo decision (BACKTRACK)
        current.pop()
        
        # Decision 2: EXCLUDE nums[index]
        backtrack(index + 1, current)
        
    backtrack(0, [])
    return result`,
    javascript: `function subsets(nums) {
    const result = [];
    function backtrack(index, current) {
        if (index === nums.length) {
            result.push([...current]);
            return;
        }
        // Include
        current.push(nums[index]);
        backtrack(index + 1, current);
        // Backtrack
        current.pop();
        // Exclude
        backtrack(index + 1, current);
    }
    backtrack(0, []);
    return result;
}`,
    cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> current;
    function<void(int)> backtrack = [&](int index) {
        if (index == nums.size()) {
            result.push_back(current);
            return;
        }
        current.push_back(nums[index]);
        backtrack(index + 1);
        current.pop_back();
        backtrack(index + 1);
    };
    backtrack(0);
    return result;
}`,
    java: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), result);
    return result;
}
private void backtrack(int index, int[] nums, List<Integer> current, List<List<Integer>> result) {
    if (index == nums.length) {
        result.add(new ArrayList<>(current));
        return;
    }
    current.add(nums[index]);
    backtrack(index + 1, nums, current, result);
    current.remove(current.size() - 1);
    backtrack(index + 1, nums, current, result);
}`
  },
  generateTrace: (input = { array: [1, 2, 3] }): ExecutionTrace => {
    const nums: number[] = input.array || [1, 2, 3];
    const events: ExecutionEvent[] = [];
    let step = 0;
    const result: number[][] = [];
    const current: number[] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `result = [], nums = [${nums.join(", ")}]`,
      explanation: "Initialized Subsets Backtracking state tree.",
      variables: { nums, current: [] },
      pointers: {},
      callStack: [{ id: "main", name: "subsets", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...nums]
    });

    function dfs(index: number) {
      if (index === nums.length) {
        result.push([...current]);
        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 5,
          codeSnippet: `result.append([${current.join(", ")}]) (Leaf reached)`,
          explanation: `LEAF NODE: Recorded valid subset [${current.join(", ")}]. Total subsets recorded: ${result.length}/${Math.pow(2, nums.length)}.`,
          expressionEvaluation: {
            rawExpression: "index == len(nums)",
            substitutedExpression: `${index} == ${nums.length}`,
            result: true,
            effectDescription: `Formed complete subset [${current.join(", ")}]`
          },
          variables: { index, subset: [...current], totalSubsets: result.length },
          pointers: {},
          callStack: [{ id: "dfs", name: "backtrack", args: { index, current: [...current] }, line: 5 }],
          structureType: "array",
          structureState: [...current]
        });
        return;
      }

      // INCLUDE
      current.push(nums[index]);
      events.push({
        step: ++step,
        type: "PUSH",
        sourceLine: 9,
        codeSnippet: `current.append(${nums[index]}) (CHOOSE: include nums[${index}])`,
        explanation: `CHOOSE: Included element nums[${index}] = ${nums[index]}. Active subset is now [${current.join(", ")}]. Recursing to depth ${index + 1}.`,
        variables: { index, chosen: nums[index], current: [...current] },
        pointers: { inspecting: index },
        callStack: [{ id: "dfs", name: "backtrack", args: { index, action: "INCLUDE" }, line: 9 }],
        structureType: "array",
        structureState: [...current],
        highlightedIndices: [current.length - 1]
      });

      dfs(index + 1);

      // BACKTRACK
      const popped = current.pop();
      events.push({
        step: ++step,
        type: "POP",
        sourceLine: 13,
        codeSnippet: `current.pop() (BACKTRACK: undo choice of ${popped})`,
        explanation: `UNDO (Backtrack): Removed ${popped} from active subset. Active subset restored to [${current.join(", ")}].`,
        variables: { index, popped, current: [...current] },
        pointers: { inspecting: index },
        callStack: [{ id: "dfs", name: "backtrack", args: { index, action: "BACKTRACK" }, line: 13 }],
        structureType: "array",
        structureState: [...current]
      });

      // EXCLUDE
      events.push({
        step: ++step,
        type: "BRANCH",
        sourceLine: 16,
        codeSnippet: `backtrack(index + 1) (CHOOSE: exclude nums[${index}] = ${nums[index]})`,
        explanation: `BRANCH: Skipping element nums[${index}] = ${nums[index]}. Recursing to depth ${index + 1} without it.`,
        variables: { index, skipped: nums[index], current: [...current] },
        pointers: { inspecting: index },
        callStack: [{ id: "dfs", name: "backtrack", args: { index, action: "EXCLUDE" }, line: 16 }],
        structureType: "array",
        structureState: [...current]
      });

      dfs(index + 1);
    }

    dfs(0);

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 18,
      codeSnippet: "return result",
      explanation: `Subsets backtracking complete! Generated all 2^${nums.length} = ${result.length} subsets.`,
      variables: { totalSubsets: result.length, result },
      pointers: {},
      callStack: [{ id: "main", name: "subsets", args: {}, line: 18 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "backtracking_subsets_trace",
      algorithmId: "backtracking_subsets",
      title: "Backtracking (Subsets / Power Set Decision Tree)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// 2. Combination Sum (Target Subtraction & Pruning - LC 39)
// ============================================================================
export const backtrackingCombinationSumAlgorithm: AlgorithmDefinition = {
  id: "backtracking_combination_sum",
  name: "Backtracking: Combination Sum (Pruning with Target Subtraction)",
  category: "backtracking",
  patternFamily: "backtracking",
  subPatternId: "backtrack_combinations",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Finds all unique combinations summing to target where candidates can be reused. Recursively subtracts candidates from remaining target. Prunes search tree when remaining < 0, guaranteeing optimal exploration.",
  timeComplexity: "O(2^t)",
  spaceComplexity: "O(t / min_candidate)",
  mentalModel: [
    "A coin machine making change: subtract candidate value from remaining balance.",
    "If balance drops below 0: PRUNE this branch immediately.",
    "If balance reaches exactly 0: RECORD solution."
  ],
  invariants: [
    "Remaining target is strictly non-negative at every recursive step.",
    "Passing current candidate index 'start' allows reusing same element while preventing duplicate permutations."
  ],
  commonMistakes: [
    "Using start = index + 1 (which forbids reusing the same element).",
    "Forgetting to sort candidates for early break/pruning."
  ],
  defaultInput: { candidates: [2, 3, 6, 7], target: 7 },
  code: {
    python: `def combination_sum(candidates, target):
    result = []
    
    def backtrack(start, remain, current):
        if remain == 0:
            result.append(list(current))
            return
        if remain < 0:
            return  # PRUNE
            
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, remain - candidates[i], current)  # reuse candidate i
            current.pop()
            
    backtrack(0, target, [])
    return result`,
    javascript: `function combinationSum(candidates, target) {
    const result = [];
    function backtrack(start, remain, current) {
        if (remain === 0) {
            result.push([...current]);
            return;
        }
        if (remain < 0) return;
        for (let i = start; i < candidates.length; i++) {
            current.push(candidates[i]);
            backtrack(i, remain - candidates[i], current);
            current.pop();
        }
    }
    backtrack(0, target, []);
    return result;
}`,
    cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> result;
    vector<int> current;
    function<void(int, int)> backtrack = [&](int start, int remain) {
        if (remain == 0) { result.push_back(current); return; }
        if (remain < 0) return;
        for (int i = start; i < candidates.size(); i++) {
            current.push_back(candidates[i]);
            backtrack(i, remain - candidates[i]);
            current.pop_back();
        }
    };
    backtrack(0, target);
    return result;
}`,
    java: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(0, target, candidates, new ArrayList<>(), result);
    return result;
}
private void backtrack(int start, int remain, int[] candidates, List<Integer> current, List<List<Integer>> result) {
    if (remain == 0) { result.add(new ArrayList<>(current)); return; }
    if (remain < 0) return;
    for (int i = start; i < candidates.length; i++) {
        current.add(candidates[i]);
        backtrack(i, remain - candidates[i], candidates, current, result);
        current.remove(current.size() - 1);
    }
}`
  },
  generateTrace: (input = { candidates: [2, 3, 6, 7], target: 7 }): ExecutionTrace => {
    const candidates: number[] = input.candidates || [2, 3, 6, 7];
    const target = input.target ?? 7;
    const events: ExecutionEvent[] = [];
    let step = 0;
    const result: number[][] = [];
    const current: number[] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `candidates = [${candidates.join(", ")}], target = ${target}`,
      explanation: `Initialized Combination Sum backtracking. Target = ${target}. Candidates may be reused.`,
      variables: { candidates, target, current: [] },
      pointers: {},
      callStack: [{ id: "main", name: "combination_sum", args: { target }, line: 2 }],
      structureType: "array",
      structureState: [...candidates]
    });

    function dfs(start: number, remain: number) {
      if (remain === 0) {
        result.push([...current]);
        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 5,
          codeSnippet: `remain == 0: result.append([${current.join(", ")}])`,
          explanation: `SOLUTION FOUND: Combination [${current.join(", ")}] sums exactly to ${target}! Recorded solution #${result.length}.`,
          expressionEvaluation: {
            rawExpression: "remain == 0",
            substitutedExpression: `${remain} == 0`,
            result: true,
            effectDescription: `Target reached! Added [${current.join(", ")}] to result set.`
          },
          variables: { remain, current: [...current], totalSolutions: result.length },
          pointers: {},
          callStack: [{ id: "dfs", name: "backtrack", args: { remain }, line: 5 }],
          structureType: "array",
          structureState: [...current]
        });
        return;
      }
      if (remain < 0) {
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 7,
          codeSnippet: `remain < 0 (${remain}): PRUNE branch`,
          explanation: `PRUNE: Remaining target ${remain} < 0. Overshot target. Abandoning branch immediately.`,
          expressionEvaluation: {
            rawExpression: "remain < 0",
            substitutedExpression: `${remain} < 0`,
            result: true,
            effectDescription: "Pruned invalid subsegment"
          },
          variables: { remain, current: [...current] },
          pointers: {},
          callStack: [{ id: "dfs", name: "backtrack", args: { remain }, line: 7 }],
          structureType: "array",
          structureState: [...current]
        });
        return;
      }

      for (let i = start; i < candidates.length; i++) {
        const val = candidates[i];
        current.push(val);

        events.push({
          step: ++step,
          type: "PUSH",
          sourceLine: 10,
          codeSnippet: `current.append(${val}); remain -= ${val} (${remain} -> ${remain - val})`,
          explanation: `CHOOSE: Appended candidate ${val}. Remaining target = ${remain - val}. Recursing with index ${i} (allows reuse).`,
          variables: { i, val, newRemain: remain - val, current: [...current] },
          pointers: { candidate: i },
          callStack: [{ id: "dfs", name: "backtrack", args: { i, remain: remain - val }, line: 10 }],
          structureType: "array",
          structureState: [...current]
        });

        dfs(i, remain - val);

        current.pop();
        events.push({
          step: ++step,
          type: "POP",
          sourceLine: 12,
          codeSnippet: `current.pop() (BACKTRACK: removed ${val})`,
          explanation: `BACKTRACK: Removed candidate ${val}. Restored balance to ${remain}.`,
          variables: { remain, current: [...current] },
          pointers: { candidate: i },
          callStack: [{ id: "dfs", name: "backtrack", args: { remain }, line: 12 }],
          structureType: "array",
          structureState: [...current]
        });
      }
    }

    dfs(0, target);

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 15,
      codeSnippet: "return result",
      explanation: `Combination sum search complete! Found ${result.length} unique combinations summing to ${target}.`,
      variables: { result },
      pointers: {},
      callStack: [{ id: "main", name: "combination_sum", args: {}, line: 15 }],
      structureType: "array",
      structureState: [...candidates]
    });

    return {
      id: "backtracking_combination_sum_trace",
      algorithmId: "backtracking_combination_sum",
      title: "Backtracking (Combination Sum with Target Pruning)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
