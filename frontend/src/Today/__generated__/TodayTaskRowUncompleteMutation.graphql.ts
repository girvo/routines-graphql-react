/**
 * @generated SignedSource<<8939999079fc66a0a7c76803894e793d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TodayTaskRowUncompleteMutation$variables = {
  taskCompletionId: string;
};
export type TodayTaskRowUncompleteMutation$data = {
  readonly uncompleteRoutineSlot: {
    readonly dailyTaskInstance: {
      readonly id: string;
    };
    readonly deletedId: string;
  } | null | undefined;
};
export type TodayTaskRowUncompleteMutation = {
  response: TodayTaskRowUncompleteMutation$data;
  variables: TodayTaskRowUncompleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "taskCompletionId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "taskCompletionId",
    "variableName": "taskCompletionId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "DailyTaskInstance",
  "kind": "LinkedField",
  "name": "dailyTaskInstance",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodayTaskRowUncompleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UncompleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "uncompleteRoutineSlot",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "TodayTaskRowUncompleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UncompleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "uncompleteRoutineSlot",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteRecord",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedId"
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "72ff93b174cbbffe928a25b89062dd44",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowUncompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowUncompleteMutation(\n  $taskCompletionId: ID!\n) {\n  uncompleteRoutineSlot(taskCompletionId: $taskCompletionId) {\n    deletedId\n    dailyTaskInstance {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "41762142502ec4b759a0f28a79ff0f33";

export default node;
