/**
 * @generated SignedSource<<635171cfecc6d19318a4b6733b1d7357>>
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "taskCompletionId",
        "variableName": "taskCompletionId"
      }
    ],
    "concreteType": "UncompleteRoutineSlotPayload",
    "kind": "LinkedField",
    "name": "uncompleteRoutineSlot",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedId",
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
    "name": "TodayTaskRowUncompleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodayTaskRowUncompleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7acc9a63c40e983d44cb978a66aa63cc",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowUncompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowUncompleteMutation(\n  $taskCompletionId: ID!\n) {\n  uncompleteRoutineSlot(taskCompletionId: $taskCompletionId) {\n    deletedId\n  }\n}\n"
  }
};
})();

(node as any).hash = "8a0813bde737a0ece113fba21f127064";

export default node;
