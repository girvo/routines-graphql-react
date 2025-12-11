/**
 * @generated SignedSource<<4be62f19b539f0eb38815151b4f94aa8>>
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v4 = {
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
          (v1/*: any*/),
          (v2/*: any*/),
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
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "RoutineSlotConnection",
                "kind": "LinkedField",
                "name": "slots",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "RoutineSlotEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "RoutineSlot",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasNextPage",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
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
    "cacheID": "84eb0c69f4cd0261c002eaa84c0751be",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Node"
        },
        "node.__typename": (v3/*: any*/),
        "node.createdAt": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DateTime"
        },
        "node.id": (v4/*: any*/),
        "node.slots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlotConnection"
        },
        "node.slots.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "RoutineSlotEdge"
        },
        "node.slots.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "node.slots.edges.node.__typename": (v3/*: any*/),
        "node.slots.edges.node.id": (v4/*: any*/),
        "node.slots.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "node.slots.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "node.title": (v3/*: any*/)
      }
    },
    "name": "TaskQuery",
    "operationKind": "query",
    "text": "query TaskQuery {\n  node(id: \"\") {\n    __typename\n    ... on Task {\n      ...TaskDisplay\n    }\n    id\n  }\n}\n\nfragment TaskDisplay on Task {\n  id\n  title\n  createdAt\n  slots {\n    edges {\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fbc668389184811bf5b048de2273330b";

export default node;
