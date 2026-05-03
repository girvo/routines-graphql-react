/**
 * @generated SignedSource<<146f4203e0b3d9da3313c7786b603551>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TodayTaskRowUncompleteMutation$variables = {
  dailyTaskInstanceId: string;
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
    "cacheID": "b7f6d4ab2c0f585543026f820b04e7c7",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowUncompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowUncompleteMutation(\n  $dailyTaskInstanceId: ID!\n) {\n  uncompleteRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {\n    deletedId\n    dailyTaskInstance {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "74207d4346b2a145392494cad5b16390";

export default node;
