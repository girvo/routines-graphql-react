/**
 * @generated SignedSource<<d5e2404496736fee0cc553b1984f1cd7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TaskQuery$variables = Record<PropertyKey, never>;
export type TaskQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"TaskDisplay">;
  } | null | undefined;
};
export type TaskQuery = {
  response: TaskQuery$data;
  variables: TaskQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": ""
  }
],
v1 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TaskQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TaskDisplay"
              }
            ],
            "type": "Task",
            "abstractKey": null
          }
        ],
        "storageKey": "node(id:\"\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TaskQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
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
                "name": "createdAt",
                "storageKey": null
              }
            ],
            "type": "Task",
            "abstractKey": null
          }
        ],
        "storageKey": "node(id:\"\")"
      }
    ]
  },
  "params": {
    "cacheID": "9a78c3b6e6087d3eda52faa431d114eb",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Node"
        },
        "node.__typename": (v1/*: any*/),
        "node.createdAt": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DateTime"
        },
        "node.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "node.title": (v1/*: any*/)
      }
    },
    "name": "TaskQuery",
    "operationKind": "query",
    "text": "query TaskQuery {\n  node(id: \"\") {\n    __typename\n    ... on Task {\n      ...TaskDisplay\n    }\n    id\n  }\n}\n\nfragment TaskDisplay on Task {\n  id\n  title\n  createdAt\n}\n"
  }
};
})();

(node as any).hash = "fbc668389184811bf5b048de2273330b";

export default node;
