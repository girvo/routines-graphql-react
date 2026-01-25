/**
 * @generated SignedSource<<5a3353ef8f4a858e6eed4cbeb8ee2d56>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  taskId: string;
};
export type TaskDeleteMutation$data = {
  readonly deleteTask: {
    readonly deletedId: string;
  } | null | undefined;
};
export type TaskDeleteMutation = {
  response: TaskDeleteMutation$data;
  variables: TaskDeleteMutation$variables;
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
  "name": "taskId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "taskId",
    "variableName": "taskId"
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
    "name": "TaskDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteTaskPayload",
        "kind": "LinkedField",
        "name": "deleteTask",
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
    "name": "TaskDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteTaskPayload",
        "kind": "LinkedField",
        "name": "deleteTask",
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
    "cacheID": "e5730cd0fb76a787a5c77fea75506c84",
    "id": null,
    "metadata": {},
    "name": "TaskDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation TaskDeleteMutation(\n  $taskId: ID!\n) {\n  deleteTask(taskId: $taskId) {\n    deletedId\n  }\n}\n"
  }
};
})();

(node as any).hash = "32556c5af02be70dcfaf7ba5ee9c18e5";

export default node;
