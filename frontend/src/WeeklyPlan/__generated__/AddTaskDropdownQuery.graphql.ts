/**
 * @generated SignedSource<<c25dfb88995ec631fcef8e2283c6c3f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddTaskDropdownQuery$variables = {
  titleSearch?: string | null | undefined;
};
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "titleSearch"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 100
      },
      {
        "kind": "Variable",
        "name": "titleSearch",
        "variableName": "titleSearch"
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddTaskDropdownQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddTaskDropdownQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e9c569f5d2af0d5403c754b79d308d1c",
    "id": null,
    "metadata": {},
    "name": "AddTaskDropdownQuery",
    "operationKind": "query",
    "text": "query AddTaskDropdownQuery(\n  $titleSearch: String\n) {\n  tasks(first: 100, titleSearch: $titleSearch) {\n    edges {\n      node {\n        id\n        title\n        icon\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c37aeef7bdca643676c871009c945f8c";

export default node;
