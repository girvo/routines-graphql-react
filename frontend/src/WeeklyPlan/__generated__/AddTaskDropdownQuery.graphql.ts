/**
 * @generated SignedSource<<902a9bb68fa6ddceac6b964fb1645ff5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddTaskDropdownQuery$variables = Record<PropertyKey, never>;
export type AddTaskDropdownQuery$data = {
  readonly tasks: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly icon: string | null | undefined;
        readonly id: string;
        readonly title: string;
      };
    }>;
  };
};
export type AddTaskDropdownQuery = {
  response: AddTaskDropdownQuery$data;
  variables: AddTaskDropdownQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 100
      }
    ],
    "concreteType": "TaskConnection",
    "kind": "LinkedField",
    "name": "tasks",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TaskEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Task",
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
      }
    ],
    "storageKey": "tasks(first:100)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AddTaskDropdownQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AddTaskDropdownQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2676bae148b2b3012ac13cf33dd3cfa5",
    "id": null,
    "metadata": {},
    "name": "AddTaskDropdownQuery",
    "operationKind": "query",
    "text": "query AddTaskDropdownQuery {\n  tasks(first: 100) {\n    edges {\n      node {\n        id\n        title\n        icon\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6833292dd1e2ee52a64dd61a4269ab38";

export default node;
