import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// Binary Search on Answer / Monotonic Feasibility Predicate (Koko Eating Bananas - LC 875)
// ============================================================================
export const binarySearchOnAnswerAlgorithm: AlgorithmDefinition = {
  id: "binary_search_on_answer",
  name: "Searching: Binary Search on Answer Space (Koko Eating Bananas)",
  category: "searching",
  patternFamily: "searching",
  subPatternId: "search_answer",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Binary searches over a continuous or integer numeric answer space [1 ... max_val] rather than array indices. Evaluates a monotonic feasibility function canFinish(mid): if eating at speed 'mid' finishes within H hours, search for smaller speeds (right = mid - 1); otherwise speed is too slow (left = mid + 1). Solves capacity and optimization problems in O(n * log(max)) time.",
  timeComplexity: "O(n * log(max_val))",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Monotonic predicate pattern: [False, False, ..., True, True, True].",
    "If speed 10 works, any speed > 10 also works. We want the MINIMAL working speed.",
    "Instead of searching given array indices, we search the candidate speeds [1 ... max(piles)]."
  ],
  invariants: [
    "At all times, optimal minimum speed lies within [left ... right] (or was recorded in ans).",
    "canFinish(speed) is monotonically non-decreasing with respect to speed."
  ],
  commonMistakes: [
    "Setting left = 0 causing division by zero.",
    "Setting right too small (must be at least max(piles)).",
    "Using integer division instead of ceil: (pile + speed - 1) // speed."
  ],
  defaultInput: { piles: [3, 6, 7, 11], h: 8 },
  code: {
    python: `def min_eating_speed(piles, h):
    def hours_needed(speed):
        return sum((p + speed - 1) // speed for p in piles)
        
    left, right = 1, max(piles)
    ans = right
    
    while left <= right:
        mid_speed = left + (right - left) // 2
        needed = hours_needed(mid_speed)
        
        if needed <= h:
            ans = mid_speed
            right = mid_speed - 1  # try slower speed
        else:
            left = mid_speed + 1   # too slow, increase speed
            
    return ans`,
    javascript: `function minEatingSpeed(piles, h) {
    function hoursNeeded(speed) {
        return piles.reduce((acc, p) => acc + Math.ceil(p / speed), 0);
    }
    let left = 1, right = Math.max(...piles);
    let ans = right;
    while (left <= right) {
        const midSpeed = Math.floor(left + (right - left) / 2);
        if (hoursNeeded(midSpeed) <= h) {
            ans = midSpeed;
            right = midSpeed - 1;
        } else {
            left = midSpeed + 1;
        }
    }
    return ans;
}`,
    cpp: `int minEatingSpeed(vector<int>& piles, int h) {
    long long left = 1, right = *max_element(piles.begin(), piles.end());
    int ans = right;
    while (left <= right) {
        long long mid = left + (right - left) / 2;
        long long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) {
            ans = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return ans;
}`,
    java: `public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = 0;
    for (int p : piles) right = Math.max(right, p);
    int ans = right;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) {
            ans = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return ans;
}`
  },
  generateTrace: (input = { piles: [3, 6, 7, 11], h: 8 }): ExecutionTrace => {
    const piles: number[] = input.piles || [3, 6, 7, 11];
    const h = input.h ?? 8;
    const events: ExecutionEvent[] = [];
    let step = 0;

    let left = 1;
    let right = Math.max(...piles);
    let ans = right;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 4,
      codeSnippet: `left, right = 1, max(piles) = ${right}; limit H = ${h}`,
      explanation: `Initialized Binary Search on Answer Space: search range [1 ... ${right}] bananas/hr. Time limit = ${h} hours.`,
      variables: { piles, left, right, h, ans },
      pointers: { leftSpeed: left, rightSpeed: right },
      callStack: [{ id: "main", name: "min_eating_speed", args: { h }, line: 4 }],
      structureType: "array",
      structureState: [...piles]
    });

    while (left <= right) {
      const midSpeed = Math.floor(left + (right - left) / 2);
      const hoursNeeded = piles.reduce((acc, p) => acc + Math.ceil(p / midSpeed), 0);
      const isFeasible = hoursNeeded <= h;

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 8,
        codeSnippet: `mid_speed = ${midSpeed}; hours_needed = ${hoursNeeded} (limit: ${h})`,
        explanation: `EVALUATING CANDIDATE SPEED ${midSpeed} b/hr: takes ${hoursNeeded} hours. ${
          isFeasible
            ? `FEASIBLE (${hoursNeeded} <= ${h})! Try to find a slower minimum speed (right = ${midSpeed - 1}).`
            : `TOO SLOW (${hoursNeeded} > ${h})! Must increase speed (left = ${midSpeed + 1}).`
        }`,
        expressionEvaluation: {
          rawExpression: "hours_needed(mid_speed) <= h",
          substitutedExpression: `${hoursNeeded} <= ${h}`,
          result: isFeasible,
          effectDescription:
            isFeasible
              ? `Speed ${midSpeed} is valid. Record ans = ${midSpeed} and test slower speeds in [${left} ... ${midSpeed - 1}].`
              : `Speed ${midSpeed} is too slow. Discard speeds <= ${midSpeed}. Search [${midSpeed + 1} ... ${right}].`
        },
        variables: { midSpeed, hoursNeeded, h, isFeasible, currentBestAns: ans },
        pointers: { testSpeed: midSpeed },
        callStack: [{ id: "main", name: "min_eating_speed", args: { midSpeed, hoursNeeded }, line: 8 }],
        structureType: "array",
        structureState: [...piles],
        windowRange: [0, piles.length - 1]
      });

      if (isFeasible) {
        ans = midSpeed;
        right = midSpeed - 1;
      } else {
        left = midSpeed + 1;
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 16,
      codeSnippet: "return ans",
      explanation: `Binary search on answer complete! Minimal feasible speed is ${ans} bananas/hr.`,
      variables: { result: ans },
      pointers: { optimalSpeed: ans },
      callStack: [{ id: "main", name: "min_eating_speed", args: {}, line: 16 }],
      structureType: "array",
      structureState: [...piles]
    });

    return {
      id: "binary_search_on_answer_trace",
      algorithmId: "binary_search_on_answer",
      title: "Binary Search on Answer Space (Koko Eating Bananas)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
