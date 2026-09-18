import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const monotonicDequeAlgorithm: AlgorithmDefinition = {
  id: "sliding_window_max_deque",
  name: "Sliding Window Maximum (Monotonic Deque)",
  category: "sliding_window",
  structureType: "array",
  difficulty: "Hard",
  description:
    "Finds the maximum value in every sliding window of size k moving across an array in strictly O(n) linear time. Employs a monotonic decreasing deque that stores candidate indices.",
  timeComplexity: "O(n) amortized (each element pushed and popped at most once)",
  spaceComplexity: "O(k) for the monotonic double-ended queue",
  mentalModel: [
    "A younger, stronger candidate eliminates all older, weaker candidates from the back of the queue.",
    "The front of the deque always holds the index of the maximum element in the active window.",
    "Expired indices (left of the window) are evicted from the front in O(1)."
  ],
  invariants: [
    "Indices in the deque are strictly within the current window [i - k + 1, i].",
    "Values corresponding to indices in the deque are strictly monotonically decreasing: nums[deque[0]] > nums[deque[1]] > ..."
  ],
  commonMistakes: [
    "Storing values instead of indices in the deque, making it impossible to check if the maximum has slid out of window bounds.",
    "Using an O(k) linear scan or heap with O(n log k) instead of the optimal O(n) deque."
  ],
  defaultInput: { array: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
  code: {
    python: `from collections import deque

def max_sliding_window(nums, k):
    q = deque() # stores indices
    result = []
    
    for i, x in enumerate(nums):
        # 1. Remove expired indices outside window
        if q and q[0] < i - k + 1:
            q.popleft()
            
        # 2. Maintain monotonic decreasing order
        while q and nums[q[-1]] <= x:
            q.pop()
            
        # 3. Add current index
        q.append(i)
        
        # 4. Record maximum once first window is formed
        if i >= k - 1:
            result.append(nums[q[0]])
            
    return result`,
    javascript: `function maxSlidingWindow(nums, k) {
    const deque = []; // stores indices
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // 1. Evict elements outside active window
        if (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // 2. Evict smaller elements from back
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }
        
        // 3. Append current index
        deque.push(i);
        
        // 4. Collect window max
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    return result;
}`,
    cpp: `std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    std::deque<int> dq;
    std::vector<int> result;
    
    for (int i = 0; i < (int)nums.size(); ++i) {
        if (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        dq.push_back(i);
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    return result;
}`,
    java: `public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>();
    int[] result = new int[nums.length - k + 1];
    int idx = 0;
    
    for (int i = 0; i < nums.length; i++) {
        if (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst();
        }
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
            deque.pollLast();
        }
        deque.offerLast(i);
        if (i >= k - 1) {
            result[idx++] = nums[deque.peekFirst()];
        }
    }
    return result;
}`
  },
  generateTrace: (input = { array: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }): ExecutionTrace => {
    const rawArr = (input.array as number[]) || [1, 3, -1, -3, 5, 3, 6, 7];
    const k = (input as { k?: number }).k || 3;
    const nums = [...rawArr];
    const events: ExecutionEvent[] = [];
    let step = 0;

    const deque: number[] = []; // stores indices
    const result: number[] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 4,
      codeSnippet: "q = deque(), result = []",
      explanation: `Initialize Monotonic Deque for sliding window of size k = ${k}. Array: [${nums.join(", ")}].`,
      variables: { k, arrayLength: nums.length, deque: [], result: [] },
      pointers: { i: 0 },
      callStack: [{ id: "main", name: "maxSlidingWindow", args: { k }, line: 4 }],
      structureType: "array",
      structureState: [...nums],
      windowRange: [0, Math.min(k - 1, nums.length - 1)]
    });

    for (let i = 0; i < nums.length; i++) {
      const windowStart = Math.max(0, i - k + 1);
      const x = nums[i];

      // 1. Remove expired
      if (deque.length > 0 && deque[0] < i - k + 1) {
        const expiredIdx = deque.shift()!;
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 9,
          codeSnippet: `if q[0] < ${i - k + 1}: q.popleft() (expired index ${expiredIdx})`,
          explanation: `Window advanced past index ${expiredIdx}. Evicted index ${expiredIdx} (val ${nums[expiredIdx]}) from front of deque.`,
          variables: { expiredIndex: expiredIdx, activeWindow: [windowStart, i], deque: [...deque] },
          pointers: { i, windowStart },
          callStack: [{ id: "main", name: "maxSlidingWindow", args: { i, expiredIdx }, line: 9 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [expiredIdx],
          windowRange: [windowStart, i]
        });
      }

      // 2. Remove smaller elements from back
      while (deque.length > 0 && nums[deque[deque.length - 1]] <= x) {
        const poppedIdx = deque.pop()!;
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 13,
          codeSnippet: `while q and nums[q[-1]] <= x: pop index ${poppedIdx}`,
          explanation: `Current element nums[${i}]=${x} dominates nums[${poppedIdx}]=${nums[poppedIdx]}. Popped index ${poppedIdx} from back of deque to preserve monotonic decreasing order.`,
          expressionEvaluation: {
            rawExpression: "nums[q[-1]] <= x",
            substitutedExpression: `${nums[poppedIdx]} <= ${x}`,
            result: true,
            effectDescription: `Evict weaker candidate index ${poppedIdx}`
          },
          variables: { currentIdx: i, currentVal: x, evictedIdx: poppedIdx, deque: [...deque] },
          pointers: { i, evicted: poppedIdx },
          callStack: [{ id: "main", name: "maxSlidingWindow", args: { i, poppedIdx }, line: 13 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [poppedIdx, i],
          windowRange: [windowStart, i]
        });
      }

      // 3. Append current index
      deque.push(i);
      events.push({
        step: ++step,
        type: "PUSH",
        sourceLine: 17,
        codeSnippet: `q.append(${i})  # val = ${x}`,
        explanation: `Pushed index ${i} (val ${x}) to back of deque. Deque indices: [${deque.join(", ")}], values: [${deque.map((d) => nums[d]).join(", ")}].`,
        variables: { currentIdx: i, currentVal: x, deque: [...deque], dequeValues: deque.map((d) => nums[d]) },
        pointers: { i, max: deque[0] },
        callStack: [{ id: "main", name: "maxSlidingWindow", args: { i, x }, line: 17 }],
        structureType: "array",
        structureState: [...nums],
        highlightedIndices: [i, deque[0]],
        windowRange: [windowStart, i]
      });

      // 4. Record max
      if (i >= k - 1) {
        const windowMax = nums[deque[0]];
        result.push(windowMax);
        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 21,
          codeSnippet: `result.append(nums[q[0]]) -> ${windowMax}`,
          explanation: `Window [${windowStart} ... ${i}] finalized! Window maximum is ${windowMax} (index ${deque[0]}). Result so far: [${result.join(", ")}].`,
          variables: { windowRange: [windowStart, i], windowMax, result: [...result] },
          pointers: { windowStart, windowEnd: i, maxIdx: deque[0] },
          callStack: [{ id: "main", name: "maxSlidingWindow", args: { windowMax }, line: 21 }],
          structureType: "array",
          structureState: [...nums],
          highlightedIndices: [deque[0]],
          windowRange: [windowStart, i]
        });
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 23,
      codeSnippet: "return result",
      explanation: `Sliding window maximum calculation finished! All window maximums: [${result.join(", ")}].`,
      variables: { result: [...result] },
      pointers: {},
      callStack: [],
      structureType: "array",
      structureState: [...nums],
      windowRange: [nums.length - k, nums.length - 1]
    });

    return {
      id: "sliding_window_max_deque_trace",
      algorithmId: "sliding_window_max_deque",
      title: "Sliding Window Maximum (Monotonic Deque) Execution Trace",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
