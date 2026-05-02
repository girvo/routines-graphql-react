/**
 * @generated SignedSource<<99d3b1484eee7f9a064b16f71ab63dec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RoutineSlotItemStoryInnerQuery$variables = Record<PropertyKey, never>;
export type RoutineSlotItemStoryInnerQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem">;
  } | null | undefined;
};
export type RoutineSlotItemStoryInnerQuery = {
  response: RoutineSlotItemStoryInnerQuery$data;
  variables: RoutineSlotItemStoryInnerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "test_id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RoutineSlotItemStoryInnerQuery",
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
                "name": "RoutineSlotItem"
              }
            ],
            "type": "RoutineSlot",
            "abstractKey": null
          }
        ],
        "storageKey": "node(id:\"test_id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RoutineSlotItemStoryInnerQuery",
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
          (v1/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "task",
                "plural": false,
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
                    "name": "icon",
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "RoutineSlot",
            "abstractKey": null
          }
        ],
        "storageKey": "node(id:\"test_id\")"
      }
    ]
  },
  "params": {
    "cacheID": "8e582475e61f13c69b6857c272095da0",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Node"
        },
        "node.__typename": (v2/*: any*/),
        "node.id": (v3/*: any*/),
        "node.task": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "node.task.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "node.task.id": (v3/*: any*/),
        "node.task.title": (v2/*: any*/)
      }
    },
    "name": "RoutineSlotItemStoryInnerQuery",
    "operationKind": "query",
    "text": "query RoutineSlotItemStoryInnerQuery {\n  node(id: \"test_id\") {\n    __typename\n    ... on RoutineSlot {\n      ...RoutineSlotItem\n    }\n    id\n  }\n}\n\nfragment RoutineSlotItem on RoutineSlot {\n  id\n  task {\n    title\n    icon\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a3f2179e87ac03d5c0e2220b81d82dc4";

export default node;
