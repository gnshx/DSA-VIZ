import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const validParenthesesAlgorithm: AlgorithmDefinition = {
  id: "valid_parentheses",
  name: "Valid Parentheses",
  category: "stack_queue",
  structureType: "stack",
  difficulty: "Easy",
  description:
    "Determines if an input string of brackets '()[]{}' is valid. Open brackets must be closed by the same type of brackets in the correct order. Solved cleanly using a Last-In, First-Out (LIFO) stack.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  mentalModel: [
    "A cafeteria tray dispenser: each opening bracket is a tray pushed down.",
    "When a closing bracket arrives, it MUST match the topmost tray on the stack.",
    "If stack is empty or doesn't match, string is invalid."
  ],
  invariants: [
    "All open brackets waiting to be closed reside on the stack in reverse order of appearance."
  ],
  commonMistakes: [
    "Popping from an empty stack when a closing bracket appears first (e.g. ')' or '}]').",
    "Not checking if stack is empty at the end (e.g. '(((' has open brackets leftover)."
  ],
  defaultInput: "({[]})",
  code: {
    python: `def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
            
    return not stack`,
    javascript: `function isValid(s) {
    const stack = [];
    const mapping = { ')': '(', '}': '{', ']': '[' };
    
    for (let char of s) {
        if (char in mapping) {
            const topElement = stack.length > 0 ? stack.pop() : '#';
            if (mapping[char] !== topElement) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`,
    cpp: `bool isValid(std::string s) {
    std::stack<char> st;
    std::unordered_map<char, char> mapping = {{')', '('}, {'}', '{'}, {']', '['}};
    
    for (char c : s) {
        if (mapping.count(c)) {
            char topElement = st.empty() ? '#' : st.top();
            if (!st.empty()) st.pop();
            if (mapping[c] != topElement) return false;
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`,
    java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> mapping = Map.of(')', '(', '}', '{', ']', '[');
    
    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) {
            char topElement = stack.isEmpty() ? '#' : stack.pop();
            if (mapping.get(c) != topElement) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.isEmpty();
}`
  },
  generateTrace: (input = "({[]})"): ExecutionTrace => {
    const s: string = typeof input === "string" ? input : "({[]})";
    const mapping: Record<string, string> = { ")": "(", "}": "{", "]": "[" };
    const stack: string[] = [];
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "stack = []",
      explanation: `Initialize empty LIFO stack. Testing string: "${s}".`,
      variables: { input: s, stackSize: 0 },
      pointers: {},
      callStack: [{ id: "main", name: "is_valid", args: { s }, line: 2 }],
      structureType: "stack",
      structureState: [...stack]
    });

    for (let i = 0; i < s.length; i++) {
      const char = s[i];

      events.push({
        step: ++step,
        type: "LINE",
        sourceLine: 5,
        codeSnippet: `for char in s: (char = '${char}' at index ${i})`,
        explanation: `Inspecting character '${char}' at index ${i}.`,
        variables: { i, char, stackTop: stack[stack.length - 1] || "empty" },
        pointers: { current_char: i },
        callStack: [{ id: "main", name: "is_valid", args: { char, i }, line: 5 }],
        structureType: "stack",
        structureState: [...stack]
      });

      if (char in mapping) {
        // Closing bracket
        const expected = mapping[char];
        const topElement = stack.length > 0 ? stack.pop()! : "#";

        events.push({
          step: ++step,
          type: "POP",
          sourceLine: 7,
          codeSnippet: "top_element = stack.pop() if stack else '#'",
          explanation: `Encountered closing bracket '${char}'. Popping top element from stack: popped '${topElement}'. Must match expected '${expected}'.`,
          expressionEvaluation: {
            rawExpression: "mapping[char] == top_element",
            substitutedExpression: `'${expected}' == '${topElement}'`,
            result: expected === topElement,
            effectDescription:
              expected === topElement
                ? `Valid match! '${char}' pairs with '${topElement}'.`
                : `MISMATCH! Expected '${expected}', but found '${topElement}'.`
          },
          variables: { char, expected, topElement, stackSize: stack.length },
          pointers: { current_char: i },
          callStack: [{ id: "main", name: "is_valid", args: { char, topElement }, line: 7 }],
          structureType: "stack",
          structureState: [...stack],
          prediction: {
            question: `Closing bracket is '${char}'. Stack top was '${topElement}'. Is this bracket valid?`,
            options: [
              {
                id: "valid",
                text: `Valid match! Continue processing.`,
                isCorrect: expected === topElement,
                explanation: expected === topElement ? `Correct! '${char}' matches '${topElement}'.` : `Incorrect: Mismatched brackets!`
              },
              {
                id: "invalid",
                text: `Invalid! Return False immediately.`,
                isCorrect: expected !== topElement,
                explanation: expected !== topElement ? `Correct! Mismatched bracket causes immediate failure.` : `Incorrect: They match!`
              }
            ]
          }
        });

        if (expected !== topElement) {
          events.push({
            step: ++step,
            type: "COMPLETE",
            sourceLine: 9,
            codeSnippet: "return False",
            explanation: `Bracket mismatch detected ('${char}' vs '${topElement}'). Returning False.`,
            variables: { result: false },
            pointers: {},
            callStack: [{ id: "main", name: "is_valid", args: {}, line: 9 }],
            structureType: "stack",
            structureState: [...stack]
          });

          return {
            id: "valid_parentheses_trace",
            algorithmId: "valid_parentheses",
            title: "Valid Parentheses Execution Trace",
            structureType: "stack",
            totalSteps: events.length,
            events
          };
        }
      } else {
        // Opening bracket -> Push
        stack.push(char);

        events.push({
          step: ++step,
          type: "PUSH",
          sourceLine: 11,
          codeSnippet: "stack.append(char)",
          explanation: `Encountered opening bracket '${char}'. Pushing onto stack. Stack now contains: [${stack.join(", ")}].`,
          expressionEvaluation: {
            rawExpression: "stack.append(char)",
            substitutedExpression: `stack.push('${char}')`,
            result: `New height: ${stack.length}`,
            effectDescription: `Tray '${char}' loaded on top of stack.`
          },
          variables: { char, stackSize: stack.length },
          pointers: { current_char: i },
          callStack: [{ id: "main", name: "is_valid", args: { char }, line: 11 }],
          structureType: "stack",
          structureState: [...stack]
        });
      }
    }

    const isValid = stack.length === 0;
    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 13,
      codeSnippet: "return not stack",
      explanation: isValid
        ? "All brackets matched and stack is completely empty! Returning True."
        : `Unmatched opening brackets remaining: [${stack.join(", ")}]. Returning False.`,
      variables: { result: isValid, remainingStack: [...stack] },
      pointers: {},
      callStack: [{ id: "main", name: "is_valid", args: {}, line: 13 }],
      structureType: "stack",
      structureState: [...stack]
    });

    return {
      id: "valid_parentheses_trace",
      algorithmId: "valid_parentheses",
      title: "Valid Parentheses Execution Trace",
      structureType: "stack",
      totalSteps: events.length,
      events
    };
  }
};
