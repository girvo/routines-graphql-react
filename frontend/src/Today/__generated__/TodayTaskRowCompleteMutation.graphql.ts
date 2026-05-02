/**
 * @generated SignedSource<<9a906c2d212c9b22cedeca32e64b95a7>>
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
v1 = [
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "completedAt",
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
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodayTaskRowCompleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "38bb48af0d8b48ece17e2f4e7269c8c0",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowCompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowCompleteMutation(\n  $routineSlotId: ID!\n) {\n  completeRoutineSlot(routineSlotId: $routineSlotId) {\n    taskCompletionEdge {\n      node {\n        id\n        completedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "88454ef4eac142ffe9dcad90bf4f3227";

export default node;
