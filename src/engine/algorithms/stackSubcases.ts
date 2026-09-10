import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// SUBCASE: Monotonic Decreasing Stack (Next Greater Element / Daily Temperatures)
// ============================================================================
export const monotonicStackDailyTemperaturesAlgorithm: AlgorithmDefinition = {
  id: "monotonic_stack_temperatures",
  name: "Stack: Monotonic Decreasing (Next Greater Element)",
  category: "stack_queue",
  patternFamily: "stack_queue",
  subPatternId: "stack_monotonic",
  structureType: "stack",
  difficulty: "Medium",
  description:
    "Maintains elements in strictly monotonic decreasing order inside a stack. When an incoming element is larger than the stack top, it acts as the 'Next Greater Element' for the top: we pop the top and record the span/answer in O(n) linear total time.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  mentalModel: [
    "A line of people waiting for a taller person to appear.",
    "The stack holds indices waiting for their next warmer day.",
    "Every index enters the stack once and leaves the stack at most once (2n operations = O(n))."
  ],
  invariants: [
    "Elements in the stack correspond to temperatures in strictly non-increasing order from bottom to top.",
    "When popping an index, the current incoming element is strictly the first warmer day to its right."
  ],
  commonMistakes: [
    "Storing values instead of indices on the stack, which prevents calculating the distance/span.",
    "Using a nested loop instead of monotonic stack, degrading performance to O(n²)."
  ],
  defaultInput: { array: [73, 74, 75, 71, 69, 72, 76, 73] },
  code: {
    python: `def daily_temperatures(temperatures):
    n = len(temperatures)
    ans = [0] * n
    stack = []  # stores indices
    
    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            ans[prev_day] = i - prev_day
        stack.append(i)
        
    return ans`,
    javascript: `function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const ans = new Array(n).fill(0);
    const stack = []; // stores indices
    
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevDay = stack.pop();
            ans[prevDay] = i - prevDay;
        }
        stack.push(i);
    }
    return ans;
}`,
    cpp: `vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> ans(n, 0);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prev = st.top(); st.pop();
            ans[prev] = i - prev;
        }
        st.push(i);
    }
    return ans;
}`,
    java: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    Stack<Integer> stack = new Stack<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prev = stack.pop();
            ans[prev] = i - prev;
        }
        stack.push(i);
    }
    return ans;
}`
  },
  generateTrace: (input = { array: [73, 74, 75, 71, 69, 72, 76, 73] }): ExecutionTrace => {
    const temps: number[] = input.array || [73, 74, 75, 71, 69, 72, 76, 73];
    const n = temps.length;
    const ans = new Array(n).fill(0);
    const stack: number[] = [];
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "ans = [0] * n, stack = []",
      explanation: `Initialized Monotonic Decreasing Stack for temperatures: [${temps.join(", ")}].`,
      variables: { ans: [...ans], stack: [] },
      pointers: {},
      callStack: [{ id: "main", name: "daily_temperatures", args: { n }, line: 2 }],
      structureType: "stack",
      structureState: []
    });

    for (let i = 0; i < n; i++) {
      const currentTemp = temps[i];

      events.push({
        step: ++step,
        type: "LINE",
        sourceLine: 6,
        codeSnippet: `for i in range(n): (day ${i}, temp = ${currentTemp})`,
        explanation: `Day ${i} with temperature ${currentTemp}°F arrived. Checking against stack top.`,
        variables: { day: i, temp: currentTemp, stackTop: stack.length > 0 ? temps[stack[stack.length - 1]] : "empty" },
        pointers: { currentDay: i },
        callStack: [{ id: "main", name: "daily_temperatures", args: { i, currentTemp }, line: 6 }],
        structureType: "stack",
        structureState: stack.map((idx) => `${idx}: ${temps[idx]}°`)
      });

      while (stack.length > 0 && currentTemp > temps[stack[stack.length - 1]]) {
        const prevDay = stack.pop()!;
        const prevTemp = temps[prevDay];
        const waitDays = i - prevDay;
        ans[prevDay] = waitDays;

        events.push({
          step: ++step,
          type: "POP",
          sourceLine: 7,
          codeSnippet: `prev_day = stack.pop(); ans[${prevDay}] = ${i} - ${prevDay} = ${waitDays}`,
          explanation: `WARMER DAY FOUND! Day ${i} (${currentTemp}°F) > Day ${prevDay} (${prevTemp}°F). Popped Day ${prevDay}; waited ${waitDays} days.`,
          expressionEvaluation: {
            rawExpression: "temperatures[i] > temperatures[stack[-1]]",
            substitutedExpression: `${currentTemp} > ${prevTemp}`,
            result: true,
            effectDescription: `Resolved next warmer temperature for day ${prevDay} after ${waitDays} day(s)`
          },
          variables: { poppedDay: prevDay, poppedTemp: prevTemp, waitDays, currentDay: i, ans: [...ans] },
          pointers: { currentDay: i, resolvedDay: prevDay },
          callStack: [{ id: "main", name: "daily_temperatures", args: { prevDay, waitDays }, line: 7 }],
          structureType: "stack",
          structureState: stack.map((idx) => `${idx}: ${temps[idx]}°`)
        });
      }

      stack.push(i);
      events.push({
        step: ++step,
        type: "PUSH",
        sourceLine: 9,
        codeSnippet: `stack.append(${i}) (push day ${i} = ${currentTemp}°F)`,
        explanation: `Pushed day ${i} (${currentTemp}°F) onto monotonic stack. Stack holds non-increasing temperatures waiting for warmer days.`,
        variables: { pushedDay: i, pushedTemp: currentTemp, stack: stack.map((idx) => `${idx}: ${temps[idx]}°`) },
        pointers: { currentDay: i },
        callStack: [{ id: "main", name: "daily_temperatures", args: { i }, line: 9 }],
        structureType: "stack",
        structureState: stack.map((idx) => `${idx}: ${temps[idx]}°`)
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 11,
      codeSnippet: "return ans",
      explanation: `Monotonic stack traversal complete! Result: days to wait = [${ans.join(", ")}].`,
      variables: { result: [...ans] },
      pointers: {},
      callStack: [{ id: "main", name: "daily_temperatures", args: {}, line: 11 }],
      structureType: "stack",
      structureState: stack.map((idx) => `${idx}: ${temps[idx]}°`)
    });

    return {
      id: "monotonic_stack_temperatures_trace",
      algorithmId: "monotonic_stack_temperatures",
      title: "Monotonic Decreasing Stack (Daily Temperatures)",
      structureType: "stack",
      totalSteps: events.length,
      events
    };
  }
};
