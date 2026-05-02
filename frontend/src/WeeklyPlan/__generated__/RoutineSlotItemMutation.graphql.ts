/**
 * @generated SignedSource<<9a4f56b9a71db027502c355bd44b0ff7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RoutineSlotItemMutation$variables = {
  connections: ReadonlyArray<string>;
  routineSlotId: string;
};
export type RoutineSlotItemMutation$data = {
  readonly deleteRoutineSlot: {
    readonly deletedId: string;
  } | null | undefined;
};
export type RoutineSlotItemMutation = {
  response: RoutineSlotItemMutation$data;
  variables: RoutineSlotItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "routineSlotId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "routineSlotId",
    "variableName": "routineSlotId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutineSlotItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "deleteRoutineSlot",
        "plural": false,
        "selections": [
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "RoutineSlotItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "deleteRoutineSlot",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedId",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "32002f83957a751902809e9341584ced",
    "id": null,
    "metadata": {},
    "name": "RoutineSlotItemMutation",
    "operationKind": "mutation",
    "text": "mutation RoutineSlotItemMutation(\n  $routineSlotId: ID!\n) {\n  deleteRoutineSlot(routineSlotId: $routineSlotId) {\n    deletedId\n  }\n}\n"
  }
};
})();

(node as any).hash = "e9f2334ecc50ace51ad2a4919fcbb846";

export default node;
