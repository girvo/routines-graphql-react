/**
 * @generated SignedSource<<0a385b2431087cf641d4d0b051ff01ad>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TodayTaskRowCompleteMutation$variables = {
  routineSlotId: string;
};
export type TodayTaskRowCompleteMutation$data = {
  readonly completeRoutineSlot: {
    readonly taskCompletionEdge: {
      readonly node: {
        readonly completedAt: any;
        readonly dailyTaskInstance: {
          readonly completion: {
            readonly id: string;
          } | null | undefined;
          readonly id: string;
        };
        readonly id: string;
      };
    };
  } | null | undefined;
};
export type TodayTaskRowCompleteMutation = {
  response: TodayTaskRowCompleteMutation$data;
  variables: TodayTaskRowCompleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "routineSlotId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "routineSlotId",
        "variableName": "routineSlotId"
      }
    ],
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
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "completedAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "DailyTaskInstance",
                "kind": "LinkedField",
                "name": "dailyTaskInstance",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TaskCompletion",
                    "kind": "LinkedField",
                    "name": "completion",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/)
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodayTaskRowCompleteMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodayTaskRowCompleteMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c0ff968e131f23c99cfa3eec0be3e7b0",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowCompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowCompleteMutation(\n  $routineSlotId: ID!\n) {\n  completeRoutineSlot(routineSlotId: $routineSlotId) {\n    taskCompletionEdge {\n      node {\n        id\n        completedAt\n        dailyTaskInstance {\n          id\n          completion {\n            id\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "657f18ec933e9ecef99d6a52bbc3c777";

export default node;
