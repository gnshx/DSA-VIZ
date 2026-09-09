import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const minHeapAlgorithm: AlgorithmDefinition = {
  id: "min_heap",
  name: "Min Heap (Insert & Sift-Up)",
  category: "heaps",
  structureType: "heap",
  difficulty: "Medium",
  description:
    "A complete binary tree stored compactly in a contiguous array where every parent node is less than or equal to its children. Inserting a new element places it at the end and 'sifts up' through parent swaps until the heap property is restored.",
  timeComplexity: "O(log n) insert, O(1) peek",
  spaceComplexity: "O(1) auxiliary",
  mentalModel: [
    "Dual reality: stored as a flat array [root, L, R, LL, LR, RL, RR] but acts as a binary tree.",
    "Parent of index i is at floor((i - 1) / 2).",
    "Left child is at 2*i + 1, Right child is at 2*i + 2.",
    "A newly added light bubble floats upward towards the root."
  ],
  invariants: [
    "Heap Property: heap[parent(i)] <= heap[i] for all valid i > 0.",
    "Shape Property: Complete binary tree filled on all levels except possibly the last, which is filled from left to right."
  ],
  commonMistakes: [
    "Using 1-based formulas (parent = i / 2) when array is 0-indexed.",
    "Swapping with the larger child in min-heap (sift-down) instead of the smaller child."
  ],
  defaultInput: { initialHeap: [4, 7, 8, 12, 15, 9, 14], insertValue: 3 },
  code: {
    python: `def heap_insert(heap, val):
    heap.append(val)
    curr = len(heap) - 1
    
    while curr > 0:
        parent = (curr - 1) // 2
        if heap[curr] < heap[parent]:
            heap[curr], heap[parent] = heap[parent], heap[curr]
            curr = parent
        else:
            break
            
    return heap`,
    javascript: `function heapInsert(heap, val) {
    heap.push(val);
    let curr = heap.length - 1;
    
    while (curr > 0) {
        const parent = Math.floor((curr - 1) / 2);
        if (heap[curr] < heap[parent]) {
            [heap[curr], heap[parent]] = [heap[parent], heap[curr]];
            curr = parent;
        } else {
            break;
        }
    }
    return heap;
}`,
    cpp: `void heapInsert(std::vector<int>& heap, int val) {
    heap.push_back(val);
    int curr = heap.size() - 1;
    
    while (curr > 0) {
        int parent = (curr - 1) / 2;
        if (heap[curr] < heap[parent]) {
            std::swap(heap[curr], heap[parent]);
            curr = parent;
        } else {
            break;
        }
    }
}`,
    java: `public static void heapInsert(List<Integer> heap, int val) {
    heap.add(val);
    int curr = heap.size() - 1;
    
    while (curr > 0) {
        int parent = (curr - 1) / 2;
        if (heap.get(curr) < heap.get(parent)) {
            int temp = heap.get(curr);
            heap.set(curr, heap.get(parent));
            heap.set(parent, temp);
            curr = parent;
        } else {
            break;
        }
    }
}`
  },
  generateTrace: (input = { initialHeap: [4, 7, 8, 12, 15, 9, 14], insertValue: 3 }): ExecutionTrace => {
    const heap: number[] = [...(input.initialHeap || [4, 7, 8, 12, 15, 9, 14])];
    const valToInsert: number = input.insertValue ?? 3;
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `heap.append(${valToInsert})`,
      explanation: `Appending new element ${valToInsert} to the end of the heap array (maintains tree shape property).`,
      variables: { inserting: valToInsert, heapSize: heap.length },
      pointers: {},
      callStack: [{ id: "main", name: "heap_insert", args: { val: valToInsert }, line: 2 }],
      structureType: "heap",
      structureState: { array: [...heap], activeIndex: null, parentIndex: null }
    });

    heap.push(valToInsert);
    let curr = heap.length - 1;

    events.push({
      step: ++step,
      type: "PUSH",
      sourceLine: 3,
      codeSnippet: `curr = len(heap) - 1 (curr = ${curr})`,
      explanation: `Element ${valToInsert} placed at index ${curr}. Now beginning sift-up comparisons with parent.`,
      variables: { curr, "heap[curr]": heap[curr] },
      pointers: { curr },
      callStack: [{ id: "main", name: "heap_insert", args: { curr }, line: 3 }],
      structureType: "heap",
      structureState: { array: [...heap], activeIndex: curr, parentIndex: null },
      highlightedIndices: [curr]
    });

    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      const isSmaller = heap[curr] < heap[parent];

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 7,
        codeSnippet: `if heap[curr] < heap[parent]:`,
        explanation: `Comparing child heap[${curr}] (${heap[curr]}) with parent heap[${parent}] (${heap[parent]}). ${
          isSmaller
            ? `${heap[curr]} < ${heap[parent]}: Min-heap property violated! Must swap.`
            : `${heap[curr]} >= ${heap[parent]}: Heap property satisfied.`
        }`,
        expressionEvaluation: {
          rawExpression: "heap[curr] < heap[parent]",
          substitutedExpression: `${heap[curr]} < ${heap[parent]}`,
          result: isSmaller,
          effectDescription: isSmaller ? `Bubble up: swap child (${heap[curr]}) with parent (${heap[parent]})` : "Stop sifting"
        },
        variables: { curr, parent, "heap[curr]": heap[curr], "heap[parent]": heap[parent] },
        pointers: { curr, parent },
        callStack: [{ id: "main", name: "heap_insert", args: { curr, parent }, line: 7 }],
        structureType: "heap",
        structureState: { array: [...heap], activeIndex: curr, parentIndex: parent },
        highlightedIndices: [curr, parent],
        swappedIndices: isSmaller ? [curr, parent] : undefined,
        prediction: {
          question: `Child is ${heap[curr]} (index ${curr}), Parent is ${heap[parent]} (index ${parent}). Should they swap in Min-Heap?`,
          options: [
            {
              id: "swap",
              text: `Yes, swap! In a Min-Heap, parent must be smaller than child.`,
              isCorrect: isSmaller,
              explanation: isSmaller ? `Correct! ${heap[curr]} is smaller than ${heap[parent]}, violating min-heap.` : `Incorrect.`
            },
            {
              id: "no_swap",
              text: `No, stop sift-up.`,
              isCorrect: !isSmaller,
              explanation: !isSmaller ? `Correct!` : `Incorrect: ${heap[curr]} < ${heap[parent]}, so they must swap!`
            }
          ]
        }
      });

      if (isSmaller) {
        const temp = heap[curr];
        heap[curr] = heap[parent];
        heap[parent] = temp;

        events.push({
          step: ++step,
          type: "SWAP",
          sourceLine: 8,
          codeSnippet: `heap[curr], heap[parent] = heap[parent], heap[curr]`,
          explanation: `Swapped index ${curr} and parent index ${parent}.`,
          variables: { curr, parent, "heap[curr]": heap[curr], "heap[parent]": heap[parent] },
          pointers: { curr: parent, prev: curr },
          callStack: [{ id: "main", name: "heap_insert", args: { curr, parent }, line: 8 }],
          structureType: "heap",
          structureState: { array: [...heap], activeIndex: parent, parentIndex: null },
          highlightedIndices: [curr, parent],
          swappedIndices: [curr, parent]
        });

        curr = parent;
      } else {
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 11,
          codeSnippet: `else: break`,
          explanation: `Child ${heap[curr]} is >= parent ${heap[parent]}. Valid min-heap state reached!`,
          variables: { curr, parent },
          pointers: { curr },
          callStack: [{ id: "main", name: "heap_insert", args: { curr }, line: 11 }],
          structureType: "heap",
          structureState: { array: [...heap], activeIndex: curr, parentIndex: null },
          highlightedIndices: [curr]
        });
        break;
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 13,
      codeSnippet: `return heap`,
      explanation: `Insertion complete! Valid min-heap array: [${heap.join(", ")}].`,
      variables: { result: [...heap] },
      pointers: {},
      callStack: [{ id: "main", name: "heap_insert", args: {}, line: 13 }],
      structureType: "heap",
      structureState: { array: [...heap], activeIndex: null, parentIndex: null }
    });

    return {
      id: "min_heap_trace",
      algorithmId: "min_heap",
      title: "Min Heap Sift-Up Trace",
      structureType: "heap",
      totalSteps: events.length,
      events
    };
  }
};
