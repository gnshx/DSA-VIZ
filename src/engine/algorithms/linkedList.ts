import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export interface ListNodeSnapshot {
  id: string;
  val: number;
  nextId: string | null;
}

export const reverseLinkedListAlgorithm: AlgorithmDefinition = {
  id: "reverse_linked_list",
  name: "Reverse Linked List",
  category: "linked_list",
  structureType: "linked_list",
  difficulty: "Easy",
  description:
    "Reverses a singly linked list in-place by redirecting each node's next pointer to point to its predecessor instead of its successor.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  mentalModel: [
    "Three-pointer tango: prev, curr, and next.",
    "Before breaking curr.next to point backward, stash curr.next into a temporary variable so you don't lose the rest of the train.",
    "Advance prev to curr, then curr to next."
  ],
  invariants: [
    "Sublist ending at 'prev' is completely reversed.",
    "Sublist starting at 'curr' is yet to be processed."
  ],
  commonMistakes: [
    "Severing curr.next before saving next_temp, permanently losing reference to subsequent nodes.",
    "Returning head instead of prev at the end."
  ],
  defaultInput: [1, 2, 3, 4, 5],
  code: {
    python: `def reverse_list(head):
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
        
    return prev`,
    javascript: `function reverseList(head) {
    let prev = null;
    let curr = head;
    
    while (curr !== null) {
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
    cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
    java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
  },
  generateTrace: (input = [1, 2, 3, 4, 5]): ExecutionTrace => {
    const rawValues: number[] = Array.isArray(input) ? input : [1, 2, 3, 4, 5];
    const events: ExecutionEvent[] = [];
    let step = 0;

    // Build initial list structure
    let nodes: ListNodeSnapshot[] = rawValues.map((val, idx) => ({
      id: `node_${idx}`,
      val,
      nextId: idx < rawValues.length - 1 ? `node_${idx + 1}` : null
    }));

    let prevId: string | null = null;
    let currId: string | null = nodes.length > 0 ? nodes[0].id : null;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "prev = None, curr = head",
      explanation: "Initialize prev = null and curr = head. Ready to reverse pointers.",
      variables: { prev: "null", curr: currId ? `Node(${nodes[0].val})` : "null" },
      pointers: { prev: prevId || "null", curr: currId || "null" },
      callStack: [{ id: "main", name: "reverse_list", args: { head: currId }, line: 2 }],
      structureType: "linked_list",
      structureState: {
        nodes: JSON.parse(JSON.stringify(nodes)),
        headId: currId,
        prevId: null,
        currId,
        nextTempId: null
      }
    });

    while (currId !== null) {
      const currNode = nodes.find((n) => n.id === currId)!;
      const nextTempId = currNode.nextId;
      const nextNode = nextTempId ? nodes.find((n) => n.id === nextTempId) : null;

      // 1. Save next
      events.push({
        step: ++step,
        type: "ASSIGN",
        sourceLine: 6,
        codeSnippet: "next_temp = curr.next",
        explanation: `Save next pointer: next_temp = ${nextNode ? `Node(${nextNode.val})` : "null"}. Crucial so we do not lose remaining list!`,
        expressionEvaluation: {
          rawExpression: "curr.next",
          substitutedExpression: `Node(${currNode.val}).next`,
          result: nextNode ? `Node(${nextNode.val})` : "null",
          effectDescription: "Preserve reference to remainder of linked list"
        },
        variables: {
          prev: prevId || "null",
          curr: `Node(${currNode.val})`,
          next_temp: nextNode ? `Node(${nextNode.val})` : "null"
        },
        pointers: {
          prev: prevId || "null",
          curr: currId,
          next_temp: nextTempId || "null"
        },
        callStack: [{ id: "main", name: "reverse_list", args: { curr: currNode.val }, line: 6 }],
        structureType: "linked_list",
        structureState: {
          nodes: JSON.parse(JSON.stringify(nodes)),
          headId: nodes[0].id,
          prevId,
          currId,
          nextTempId
        },
        activeNodes: [currId]
      });

      // 2. Reverse link
      currNode.nextId = prevId;

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 7,
        codeSnippet: "curr.next = prev",
        explanation: `Reversed pointer! Node(${currNode.val}).next now points back to ${prevId ? `prev Node` : "null"}.`,
        expressionEvaluation: {
          rawExpression: "curr.next = prev",
          substitutedExpression: `Node(${currNode.val}).next = ${prevId ? "prev" : "null"}`,
          result: "LINK REVERSED",
          effectDescription: `Arrow for Node(${currNode.val}) now flips backwards`
        },
        variables: {
          prev: prevId || "null",
          curr: `Node(${currNode.val})`,
          next_temp: nextNode ? `Node(${nextNode.val})` : "null"
        },
        pointers: {
          prev: prevId || "null",
          curr: currId,
          next_temp: nextTempId || "null"
        },
        callStack: [{ id: "main", name: "reverse_list", args: { curr: currNode.val }, line: 7 }],
        structureType: "linked_list",
        structureState: {
          nodes: JSON.parse(JSON.stringify(nodes)),
          headId: nodes[0].id,
          prevId,
          currId,
          nextTempId
        },
        activeNodes: [currId]
      });

      // 3. Move prev
      prevId = currId;
      events.push({
        step: ++step,
        type: "POINTER_MOVE",
        sourceLine: 8,
        codeSnippet: "prev = curr",
        explanation: `Advance prev pointer forward to Node(${currNode.val}).`,
        variables: { prev: `Node(${currNode.val})`, curr: `Node(${currNode.val})` },
        pointers: { prev: prevId, curr: currId, next_temp: nextTempId || "null" },
        callStack: [{ id: "main", name: "reverse_list", args: { prev: currNode.val }, line: 8 }],
        structureType: "linked_list",
        structureState: {
          nodes: JSON.parse(JSON.stringify(nodes)),
          headId: nodes[0].id,
          prevId,
          currId,
          nextTempId
        }
      });

      // 4. Move curr
      currId = nextTempId;
      events.push({
        step: ++step,
        type: "POINTER_MOVE",
        sourceLine: 9,
        codeSnippet: "curr = next_temp",
        explanation: `Advance curr pointer forward to next_temp (${currId ? "next node" : "null"}).`,
        variables: { prev: `Node(${currNode.val})`, curr: currId ? "Node" : "null" },
        pointers: { prev: prevId, curr: currId || "null" },
        callStack: [{ id: "main", name: "reverse_list", args: { curr: currId }, line: 9 }],
        structureType: "linked_list",
        structureState: {
          nodes: JSON.parse(JSON.stringify(nodes)),
          headId: prevId,
          prevId,
          currId,
          nextTempId: null
        }
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 11,
      codeSnippet: "return prev",
      explanation: `Reversal complete! 'prev' is now the new head of the completely reversed linked list.`,
      variables: { new_head: prevId },
      pointers: { head: prevId || "null" },
      callStack: [{ id: "main", name: "reverse_list", args: {}, line: 11 }],
      structureType: "linked_list",
      structureState: {
        nodes: JSON.parse(JSON.stringify(nodes)),
        headId: prevId,
        prevId,
        currId: null,
        nextTempId: null
      }
    });

    return {
      id: "reverse_linked_list_trace",
      algorithmId: "reverse_linked_list",
      title: "Reverse Linked List Execution Trace",
      structureType: "linked_list",
      totalSteps: events.length,
      events
    };
  }
};
