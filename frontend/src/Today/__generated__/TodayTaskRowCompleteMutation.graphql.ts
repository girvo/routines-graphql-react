/**
 * @generated SignedSource<<a17d3e3b7f833f4aa337965a62bb3224>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TodayTaskRowCompleteMutation$variables = {
  dailyTaskInstanceId: string;
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
    "name": "dailyTaskInstanceId"
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
        "name": "dailyTaskInstanceId",
        "variableName": "dailyTaskInstanceId"
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
    "cacheID": "da1ee98b5ef9ffd68bdabe304d8ce222",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowCompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowCompleteMutation(\n  $dailyTaskInstanceId: ID!\n) {\n  completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {\n    taskCompletionEdge {\n      node {\n        id\n        completedAt\n        dailyTaskInstance {\n          id\n          completion {\n            id\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "32384ea2d01665df4538ce5899cb4c63";

export default node;
