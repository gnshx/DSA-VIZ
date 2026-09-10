import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// 1. Two Sum with HashMap (Complement Lookup in O(n) Time - LC 1)
// ============================================================================
export const hashTableTwoSumAlgorithm: AlgorithmDefinition = {
  id: "hash_table_two_sum",
  name: "Hashing: Two Sum Complement Lookup (O(n) Time)",
  category: "hashing",
  patternFamily: "hashing",
  subPatternId: "hash_table_lookup",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Solves Two Sum on an unsorted array in linear O(n) time. For each element x, checks if its complement (target - x) already exists in a hash map. If yes, returns their indices; otherwise, inserts x -> index into the map.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  mentalModel: [
    "A lost-and-found registry: before entering your number into the book, check if someone has already logged the matching puzzle piece (target - x)!",
    "Transforms an O(n²) nested search into an O(1) expected lookup per element."
  ],
  invariants: [
    "All elements stored in hash map precede the current index i.",
    "If a valid pair exists, the second element will discover the first in O(1)."
  ],
  commonMistakes: [
    "Inserting the current element into the map BEFORE checking for the complement (can match the element with itself if target = 2 * x)."
  ],
  defaultInput: { array: [2, 11, 7, 15], target: 9 },
  code: {
    python: `def two_sum_hash(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    javascript: `function twoSumHash(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int comp = target - nums[i];
        if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`
  },
  generateTrace: (input = { array: [2, 11, 7, 15], target: 9 }): ExecutionTrace => {
    const nums: number[] = input.array || [2, 11, 7, 15];
    const target = input.target ?? 9;
    const events: ExecutionEvent[] = [];
    let step = 0;

    const seen: Record<number, number> = {};

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "seen = {}",
      explanation: `Initialized empty HashMap seen: {}. Searching for pair summing to ${target}.`,
      variables: { target, seen: {} },
      pointers: {},
      callStack: [{ id: "main", name: "two_sum_hash", args: { target }, line: 2 }],
      structureType: "array",
      structureState: [...nums]
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const complement = target - num;
      const found = complement in seen;

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 4,
        codeSnippet: `complement = ${target} - ${num} = ${complement}; in seen?`,
        explanation: `Inspecting nums[${i}] = ${num}. Complement needed is ${target} - ${num} = ${complement}. Checking hashmap: ${
          found ? `MATCH FOUND at index ${seen[complement]}!` : "Not in map yet."
        }`,
        expressionEvaluation: {
          rawExpression: "target - num in seen",
          substitutedExpression: `${target} - ${num} = ${complement} in seen`,
          result: found,
          effectDescription:
            found
              ? `Pair located! Indices [${seen[complement]}, ${i}] sum to ${target}.`
              : `Complement ${complement} not present in map.`
        },
        variables: { i, num, complement, found, seen: { ...seen } },
        pointers: { current: i },
        callStack: [{ id: "main", name: "two_sum_hash", args: { i, complement }, line: 4 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: found ? [seen[complement], i] : [i]
      });

      if (found) {
        events.push({
          step: ++step,
          type: "COMPLETE",
          sourceLine: 5,
          codeSnippet: `return [${seen[complement]}, ${i}]`,
          explanation: `Result found: indices [${seen[complement]}, ${i}] with values ${nums[seen[complement]]} + ${num} = ${target}.`,
          variables: { result: [seen[complement], i] },
          pointers: { first: seen[complement], second: i },
          callStack: [{ id: "main", name: "two_sum_hash", args: {}, line: 5 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [seen[complement], i]
        });
        return {
          id: "hash_table_two_sum_trace",
          algorithmId: "hash_table_two_sum",
          title: "Hashing (Two Sum Complement Lookup)",
          structureType: "array",
          totalSteps: events.length,
          events
        };
      }

      seen[num] = i;
      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 6,
        codeSnippet: `seen[${num}] = ${i}`,
        explanation: `Added entry to HashMap: ${num} -> index ${i}. Map contents: { ${Object.entries(seen).map(([k, v]) => `${k}: ${v}`).join(", ")} }.`,
        variables: { seen: { ...seen } },
        pointers: { current: i },
        callStack: [{ id: "main", name: "two_sum_hash", args: {}, line: 6 }],
        structureType: "array",
        structureState: [...nums]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 7,
      codeSnippet: "return []",
      explanation: "No pair found.",
      variables: { result: [] },
      pointers: {},
      callStack: [{ id: "main", name: "two_sum_hash", args: {}, line: 7 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "hash_table_two_sum_trace",
      algorithmId: "hash_table_two_sum",
      title: "Hashing (Two Sum Complement Lookup)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};

// ============================================================================
// 2. Longest Consecutive Sequence via HashSet (O(n) Time - LC 128)
// ============================================================================
export const hashSetConsecutiveSequenceAlgorithm: AlgorithmDefinition = {
  id: "hash_set_consecutive_sequence",
  name: "Hashing: Longest Consecutive Sequence (HashSet O(n))",
  category: "hashing",
  patternFamily: "hashing",
  subPatternId: "hash_consecutive",
  structureType: "array",
  difficulty: "Medium",
  description:
    "Finds the length of the longest consecutive sequence in an unsorted array in strictly O(n) time. Inserts all numbers into a HashSet. Only starts counting from numbers where (x - 1) is NOT in the set (i.e. the true start of a streak), guaranteeing each element is visited at most twice.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  mentalModel: [
    "Identifying the head of a train: if (x - 1) exists in the set, x is NOT the start of a sequence, so skip it!",
    "Only streak heads initiate counting, ensuring linear 2N operations total."
  ],
  invariants: [
    "A sequence is only explored starting from its minimal element.",
    "Each number belongs to exactly one maximal consecutive streak."
  ],
  commonMistakes: [
    "Counting forward from every number without the (num - 1 not in set) guard, causing worst-case O(n²) runtime."
  ],
  defaultInput: { array: [100, 4, 200, 1, 3, 2] },
  code: {
    python: `def longest_consecutive(nums):
    num_set = set(nums)
    longest_streak = 0
    
    for num in num_set:
        # Check if num is the start of a streak
        if (num - 1) not in num_set:
            curr_num = num
            curr_streak = 1
            while (curr_num + 1) in num_set:
                curr_num += 1
                curr_streak += 1
            longest_streak = max(longest_streak, curr_streak)
            
    return longest_streak`,
    javascript: `function longestConsecutive(nums) {
    const set = new Set(nums);
    let longest = 0;
    for (const num of set) {
        if (!set.has(num - 1)) {
            let curr = num;
            let streak = 1;
            while (set.has(curr + 1)) {
                curr++;
                streak++;
            }
            longest = Math.max(longest, streak);
        }
    }
    return longest;
}`,
    cpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int longest = 0;
    for (int num : s) {
        if (!s.count(num - 1)) {
            int curr = num, streak = 1;
            while (s.count(curr + 1)) { curr++; streak++; }
            longest = max(longest, streak);
        }
    }
    return longest;
}`,
    java: `public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int longest = 0;
    for (int num : set) {
        if (!set.contains(num - 1)) {
            int curr = num, streak = 1;
            while (set.contains(curr + 1)) { curr++; streak++; }
            longest = Math.max(longest, streak);
        }
    }
    return longest;
}`
  },
  generateTrace: (input = { array: [100, 4, 200, 1, 3, 2] }): ExecutionTrace => {
    const nums: number[] = input.array || [100, 4, 200, 1, 3, 2];
    const numSet = new Set(nums);
    const events: ExecutionEvent[] = [];
    let step = 0;

    let longestStreak = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `num_set = set([${nums.join(", ")}])`,
      explanation: `Loaded all elements into HashSet for O(1) membership lookup: {${Array.from(numSet).join(", ")}}.`,
      variables: { numSet: Array.from(numSet), longestStreak: 0 },
      pointers: {},
      callStack: [{ id: "main", name: "longest_consecutive", args: {}, line: 2 }],
      structureType: "array",
      structureState: [...nums]
    });

    for (const num of Array.from(numSet)) {
      const isStart = !numSet.has(num - 1);

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 7,
        codeSnippet: `if (${num - 1}) not in num_set:`,
        explanation: `Inspecting ${num}: is (${num - 1}) in set? ${
          isStart ? `NO! ${num} is the START of a consecutive sequence.` : `YES (${num - 1} exists). Skip to avoid duplicate work.`
        }`,
        expressionEvaluation: {
          rawExpression: "num - 1 not in set",
          substitutedExpression: `${num - 1} not in set`,
          result: isStart,
          effectDescription: isStart ? `Initiate streak counting from ${num}` : `Skip ${num} (not sequence head)`
        },
        variables: { num, isStart, longestStreak },
        pointers: {},
        callStack: [{ id: "main", name: "longest_consecutive", args: { num }, line: 7 }],
        structureType: "array",
        structureState: [...nums]
      });

      if (isStart) {
        let currNum = num;
        let currStreak = 1;

        while (numSet.has(currNum + 1)) {
          currNum += 1;
          currStreak += 1;

          events.push({
            step: ++step,
            type: "WRITE",
            sourceLine: 12,
            codeSnippet: `curr_streak += 1 (${currNum} found, streak = ${currStreak})`,
            explanation: `Found consecutive number ${currNum}! Current streak length = ${currStreak}.`,
            variables: { head: num, current: currNum, currStreak, longestStreak },
            pointers: {},
            callStack: [{ id: "main", name: "longest_consecutive", args: { currNum }, line: 12 }],
            structureType: "array",
            structureState: [...nums]
          });
        }

        longestStreak = Math.max(longestStreak, currStreak);
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 13,
          codeSnippet: `longest_streak = max(${longestStreak}, ${currStreak}) = ${longestStreak}`,
          explanation: `Streak from ${num} to ${currNum} concluded (length = ${currStreak}). Peak streak = ${longestStreak}.`,
          variables: { longestStreak },
          pointers: {},
          callStack: [{ id: "main", name: "longest_consecutive", args: { longestStreak }, line: 13 }],
          structureType: "array",
          structureState: [...nums]
        });
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 15,
      codeSnippet: "return longest_streak",
      explanation: `Longest consecutive sequence search finished! Result = ${longestStreak}.`,
      variables: { result: longestStreak },
      pointers: {},
      callStack: [{ id: "main", name: "longest_consecutive", args: {}, line: 15 }],
      structureType: "array",
      structureState: [...nums]
    });

    return {
      id: "hash_set_consecutive_sequence_trace",
      algorithmId: "hash_set_consecutive_sequence",
      title: "Hashing (Longest Consecutive Sequence)",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
