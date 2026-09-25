/**
 * @generated SignedSource<<5c6efbbcba89972ad64ebf06e5720007>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodayTaskRowCompleteMutation$variables = {
  dailyTaskInstanceId: string;
};
export type TodayTaskRowCompleteMutation$data = {
  readonly completeRoutineSlot: {
    readonly taskCompletionEdge: {
      readonly node: {
        readonly dailyTaskInstance: {
          readonly " $fragmentSpreads": FragmentRefs<"TodayTaskRow_instance">;
        };
      };
    };
  } | null | undefined;
};
export type TodayTaskRowCompleteMutation$rawResponse = {
  readonly completeRoutineSlot: {
    readonly taskCompletionEdge: {
      readonly node: {
        readonly dailyTaskInstance: {
          readonly completion: {
            readonly id: string;
          } | null | undefined;
          readonly id: string;
          readonly routineSlot: {
            readonly id: string;
            readonly task: {
              readonly icon: string | null | undefined;
              readonly id: string;
              readonly title: string;
            };
          };
        };
        readonly id: string;
      };
    };
  } | null | undefined;
};
export type TodayTaskRowCompleteMutation = {
  rawResponse: TodayTaskRowCompleteMutation$rawResponse;
  response: TodayTaskRowCompleteMutation$data;
  variables: TodayTaskRowCompleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "dailyTaskInstanceId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "dailyTaskInstanceId",
    "variableName": "dailyTaskInstanceId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodayTaskRowCompleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CompleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "completeRoutineSlot",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TaskCompletionEdge",
            "kind": "LinkedField",
            "name": "taskCompletionEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TaskCompletion",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DailyTaskInstance",
                    "kind": "LinkedField",
                    "name": "dailyTaskInstance",
                    "plural": false,
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "TodayTaskRow_instance"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodayTaskRowCompleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CompleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "completeRoutineSlot",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TaskCompletionEdge",
            "kind": "LinkedField",
            "name": "taskCompletionEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TaskCompletion",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DailyTaskInstance",
                    "kind": "LinkedField",
                    "name": "dailyTaskInstance",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "RoutineSlot",
                        "kind": "LinkedField",
                        "name": "routineSlot",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Task",
                            "kind": "LinkedField",
                            "name": "task",
                            "plural": false,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "title",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "icon",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "TaskCompletion",
                        "kind": "LinkedField",
                        "name": "completion",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ce38ce188faded20d73b6ac068d6d419",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowCompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowCompleteMutation(\n  $dailyTaskInstanceId: ID!\n) {\n  completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {\n    taskCompletionEdge {\n      node {\n        dailyTaskInstance {\n          ...TodayTaskRow_instance\n          id\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment TodayTaskRow_instance on DailyTaskInstance {\n  id\n  routineSlot {\n    id\n    task {\n      id\n      title\n      icon\n    }\n  }\n  completion {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "14c15d3ea0a33b5aa06df9ee2dd80042";

export default node;
