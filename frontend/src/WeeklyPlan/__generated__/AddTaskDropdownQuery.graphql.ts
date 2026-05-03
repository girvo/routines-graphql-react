/**
 * @generated SignedSource<<2c37bf30fffcaa0a5c530a241c6d8201>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddTaskDropdownQuery$variables = Record<PropertyKey, never>;
export type AddTaskDropdownQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AddTaskDropdown_query">;
};
export type AddTaskDropdownQuery = {
  response: AddTaskDropdownQuery$data;
  variables: AddTaskDropdownQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AddTaskDropdownQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "AddTaskDropdown_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AddTaskDropdownQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 5
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
        "storageKey": "tasks(first:5)"
      }
    ]
  },
  "params": {
    "cacheID": "9f23472acbab63246461c91e265e53a3",
    "id": null,
    "metadata": {},
    "name": "AddTaskDropdownQuery",
    "operationKind": "query",
    "text": "query AddTaskDropdownQuery {\n  ...AddTaskDropdown_query\n}\n\nfragment AddTaskDropdown_query on Query {\n  tasks(first: 5) {\n    edges {\n      node {\n        id\n        title\n        icon\n      }\n    }\n  }\n}\n"
  }
};

(node as any).hash = "4ae62a89b358eee5ed24428d0b724029";

export default node;
