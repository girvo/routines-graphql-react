/**
 * @generated SignedSource<<ffda3302ff7a3118ef69cc77fa07fc48>>
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
            "type": "Task",
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
                "name": "icon",
                "storageKey": null
              }
            ],
            "type": "Task",
            "abstractKey": null
          }
        ],
        "storageKey": "node(id:\"test_id\")"
      }
    ]
  },
  "params": {
    "cacheID": "32f18831bfc03e94a0fa43a07216306c",
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
        "node.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
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
    "name": "RoutineSlotItemStoryInnerQuery",
    "operationKind": "query",
    "text": "query RoutineSlotItemStoryInnerQuery {\n  node(id: \"test_id\") {\n    __typename\n    ... on Task {\n      ...RoutineSlotItem\n    }\n    id\n  }\n}\n\nfragment RoutineSlotItem on Task {\n  id\n  title\n  icon\n}\n"
  }
};
})();

(node as any).hash = "3961d46bcd37ab649e2735e341e35d28";

export default node;
