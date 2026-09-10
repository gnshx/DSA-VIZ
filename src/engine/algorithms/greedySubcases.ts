import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// Greedy: Jump Game (Farthest Horizon Tracking - LC 55)
// ============================================================================
export const greedyJumpGameAlgorithm: AlgorithmDefinition = {
  id: "greedy_jump_game",
  name: "Greedy: Jump Game (Farthest Horizon Tracking)",
  category: "greedy",
  patternFamily: "greedy",
  subPatternId: "greedy_jump",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Greedily maintains the single farthest index 'max_reach' that can be arrived at from any traversed position. If current index i > max_reach, the target is unreachable (returns false). If max_reach >= n - 1, the goal is guaranteed in O(n) time and O(1) space.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "A flashlight beam with reach: each step i shines a beam to (i + nums[i]).",
    "We only ever need to remember the outermost boundary of illuminated road.",
    "If you ever step into complete darkness (i > max_reach), you can go no further."
  ],
  invariants: [
    "max_reach is monotonically non-decreasing: max_reach = max(max_reach, i + nums[i]).",
    "All indices <= max_reach are guaranteed reachable."
  ],
  commonMistakes: [
    "Attempting DP or recursion which takes O(n²), when a single forward greedy pass is O(n)."
  ],
  defaultInput: { array: [2, 3, 1, 1, 4] },
  code: {
    python: `def can_jump(nums):
    max_reach = 0
    for i in range(len(nums)):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + nums[i])
        if max_reach >= len(nums) - 1:
            return True
    return True`,
    javascript: `function canJump(nums) {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    return true;
}`,
    cpp: `bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
        if (maxReach >= nums.size() - 1) return true;
    }
    return true;
}`,
    java: `public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    return true;
}`
  },
  generateTrace: (input = { array: [2, 3, 1, 1, 4] }): ExecutionTrace => {
    const nums: number[] = input.array || [2, 3, 1, 1, 4];
    const n = nums.length;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let maxReach = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "max_reach = 0",
      explanation: `Initialized Greedy Jump Game: array length = ${n}, target goal index = ${n - 1}.`,
      variables: { maxReach: 0, goal: n - 1 },
      pointers: { maxReach: 0 },
      callStack: [{ id: "main", name: "can_jump", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...nums],
      windowRange: [0, 0]
    });

    for (let i = 0; i < n; i++) {
      if (i > maxReach) {
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 5,
          codeSnippet: `if i > max_reach: (${i} > ${maxReach}) -> return False`,
          explanation: `TRAPPED! Current index ${i} exceeds maximum reachable index ${maxReach}. Target is unreachable!`,
          expressionEvaluation: {
            rawExpression: "i > max_reach",
            substitutedExpression: `${i} > ${maxReach}`,
            result: true,
            effectDescription: "Cannot jump past this dead end"
          },
          variables: { i, maxReach, reachable: false },
          pointers: { stuckAt: i, maxReach },
          callStack: [{ id: "main", name: "can_jump", args: { i }, line: 5 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [i]
        });

        return {
          id: "greedy_jump_game_trace",
          algorithmId: "greedy_jump_game",
          title: "Greedy (Jump Game Horizon Tracking)",
          structureType: "array",
          totalSteps: events.length,
          events
        };
      }

      const prevReach = maxReach;
      const potential = i + nums[i];
      maxReach = Math.max(maxReach, potential);

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 6,
        codeSnippet: `max_reach = max(${prevReach}, ${i} + ${nums[i]}) = ${maxReach}`,
        explanation: `At index ${i} (jump power ${nums[i]}): can jump up to index ${potential}. Updated max_reach = ${maxReach}.`,
        expressionEvaluation: {
          rawExpression: "max(max_reach, i + nums[i])",
          substitutedExpression: `max(${prevReach}, ${i} + ${nums[i]}) = ${maxReach}`,
          result: maxReach,
          effectDescription: `Reachable horizon extended to index ${maxReach}`
        },
        variables: { i, jumpPower: nums[i], potential, maxReach, goal: n - 1 },
        pointers: { current: i, maxReach: Math.min(maxReach, n - 1) },
        callStack: [{ id: "main", name: "can_jump", args: { i, maxReach }, line: 6 }],
        structureType: "array",
        structureState: [...nums],
        windowRange: [0, Math.min(maxReach, n - 1)],
        highlightedIndices: [i, Math.min(maxReach, n - 1)]
      });

      if (maxReach >= n - 1) {
        events.push({
          step: ++step,
          type: "COMPLETE",
          sourceLine: 8,
          codeSnippet: `if max_reach >= len(nums) - 1: (${maxReach} >= ${n - 1}) -> return True`,
          explanation: `GOAL REACHED! Farthest reach ${maxReach} covers or surpasses the last index ${n - 1}. Success!`,
          expressionEvaluation: {
            rawExpression: "max_reach >= len(nums) - 1",
            substitutedExpression: `${maxReach} >= ${n - 1}`,
            result: true,
            effectDescription: `Guaranteed jump path to destination exists!`
          },
          variables: { maxReach, goal: n - 1, canReachGoal: true },
          pointers: { goal: n - 1 },
          callStack: [{ id: "main", name: "can_jump", args: {}, line: 8 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [n - 1]
        });

        return {
          id: "greedy_jump_game_trace",
          algorithmId: "greedy_jump_game",
          title: "Greedy (Jump Game Horizon Tracking)",
          structureType: "array",
          totalSteps: events.length,
          events
        };
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 9,
      codeSnippet: "return True",
      explanation: "Destination reached.",
      variables: { result: true },
      pointers: {},
      callStack: [{ id: "main", name: "can_jump", args: {}, line: 9 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "greedy_jump_game_trace",
      algorithmId: "greedy_jump_game",
      title: "Greedy (Jump Game Horizon Tracking)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
