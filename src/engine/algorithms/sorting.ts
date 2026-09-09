import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const bubbleSortAlgorithm: AlgorithmDefinition = {
  id: "bubble_sort",
  name: "Bubble Sort",
  category: "sorting",
  structureType: "array",
  difficulty: "Easy",
  description:
    "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element 'bubbles up' to its correct position at the end of each pass.",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Imagine heavier bubbles sinking and lighter bubbles rising.",
    "After pass i, the last i elements are guaranteed to be in their final sorted positions.",
    "Adjacent comparisons detect local inversions and push them towards the boundary."
  ],
  invariants: [
    "Array slice arr[n - i .. n - 1] is sorted and contains the largest i elements.",
    "At step (i, j), all elements before j have been compared with their adjacent neighbors."
  ],
  commonMistakes: [
    "Inner loop bound: looping all the way to n instead of n - 1 - i, wasting comparisons on already sorted elements.",
    "Off-by-one errors with j + 1 indexing."
  ],
  defaultInput: [5, 2, 8, 1, 9, 3],
  code: {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`,
    cpp: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
  },
  generateTrace: (input = [5, 2, 8, 1, 9, 3]): ExecutionTrace => {
    const arr = [...input];
    const n = arr.length;
    const events: ExecutionEvent[] = [];
    let step = 0;

    // Initial state
    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "n = len(arr)",
      explanation: `Initialize array of size ${n}. Ready to begin bubble passes.`,
      variables: { n, i: 0 },
      pointers: {},
      callStack: [{ id: "main", name: "bubble_sort", args: { arr: [...arr] }, line: 2 }],
      structureType: "array",
      structureState: [...arr]
    });

    for (let i = 0; i < n; i++) {
      let swapped = false;
      events.push({
        step: ++step,
        type: "LINE",
        sourceLine: 3,
        codeSnippet: `for i in range(n): (pass i = ${i})`,
        explanation: `Starting Pass ${i + 1}. We will compare adjacent elements up to index ${n - i - 1}.`,
        variables: { n, i, swapped: false },
        pointers: { i },
        callStack: [{ id: "main", name: "bubble_sort", args: { i }, line: 3 }],
        structureType: "array",
        structureState: [...arr]
      });

      for (let j = 0; j < n - i - 1; j++) {
        const val1 = arr[j];
        const val2 = arr[j + 1];
        const shouldSwap = val1 > val2;

        // Comparison step
        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 6,
          codeSnippet: `if arr[j] > arr[j + 1]:`,
          explanation: `Comparing arr[${j}] (${val1}) with arr[${j + 1}] (${val2}). ${
            shouldSwap ? `${val1} > ${val2}: inversion found! Must swap.` : `${val1} <= ${val2}: correct order, no swap.`
          }`,
          expressionEvaluation: {
            rawExpression: "arr[j] > arr[j + 1]",
            substitutedExpression: `${val1} > ${val2}`,
            result: shouldSwap,
            effectDescription: shouldSwap ? "Swap elements at indices " + j + " and " + (j + 1) : "Keep order, move to next pair"
          },
          variables: { i, j, "arr[j]": val1, "arr[j+1]": val2 },
          pointers: { i, j, "j+1": j + 1 },
          callStack: [{ id: "main", name: "bubble_sort", args: { i, j }, line: 6 }],
          structureType: "array",
          structureState: [...arr],
          highlightedIndices: [j, j + 1],
          prediction: (i === 0 && (j === 0 || j === 2)) ? {
            question: `At arr[${j}] = ${val1} and arr[${j + 1}] = ${val2}, what state transition occurs?`,
            options: [
              {
                id: "swap",
                text: `Swap ${val1} and ${val2} because ${val1} > ${val2}`,
                isCorrect: shouldSwap,
                explanation: shouldSwap ? `Correct! ${val1} is greater than ${val2}, so an inversion is resolved.` : `Incorrect: ${val1} is not greater than ${val2}.`
              },
              {
                id: "no_swap",
                text: `Do not swap, advance j pointer`,
                isCorrect: !shouldSwap,
                explanation: !shouldSwap ? `Correct! ${val1} <= ${val2}, so elements remain in place.` : `Incorrect: ${val1} > ${val2}, so they must swap!`
              }
            ]
          } : undefined
        });

        if (shouldSwap) {
          // Perform swap
          arr[j] = val2;
          arr[j + 1] = val1;
          swapped = true;

          events.push({
            step: ++step,
            type: "SWAP",
            sourceLine: 7,
            codeSnippet: `arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
            explanation: `Swapped arr[${j}] and arr[${j + 1}]. Now arr[${j}] = ${val2}, arr[${j + 1}] = ${val1}.`,
            variables: { i, j, swapped: true },
            pointers: { j, "j+1": j + 1 },
            callStack: [{ id: "main", name: "bubble_sort", args: { i, j }, line: 7 }],
            structureType: "array",
            structureState: [...arr],
            swappedIndices: [j, j + 1],
            highlightedIndices: [j, j + 1]
          });
        }
      }

      if (!swapped) {
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 10,
          codeSnippet: `if not swapped: break`,
          explanation: `No swaps occurred in Pass ${i + 1}. The entire array is already sorted early!`,
          variables: { i, swapped: false },
          pointers: {},
          callStack: [{ id: "main", name: "bubble_sort", args: { i }, line: 10 }],
          structureType: "array",
          structureState: [...arr]
        });
        break;
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 11,
      codeSnippet: `return arr`,
      explanation: `Bubble sort finished. The array is fully sorted in non-decreasing order!`,
      variables: { result: [...arr] },
      pointers: {},
      callStack: [{ id: "main", name: "bubble_sort", args: {}, line: 11 }],
      structureType: "array",
      structureState: [...arr]
    });

    return {
      id: "bubble_sort_trace",
      algorithmId: "bubble_sort",
      title: "Bubble Sort Execution Trace",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
