/**
 * @generated SignedSource<<6f628806d59aa8e204c5879ad77e9133>>
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
    readonly __typename: "Task";
    readonly $updatableFragmentSpreads: FragmentRefs<"EditTask_task">;
    readonly " $fragmentSpreads": FragmentRefs<"Task_task">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
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
              (v1/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "Task_task"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "EditTask_task"
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
                "name": "icon",
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
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 100
                  }
                ],
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
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "section",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "slots(first:100)"
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
    "cacheID": "1ec7dd519e19fc6bba589181b4c9c3ab",
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
        "node.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
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
        "node.slots.edges.node.id": (v4/*: any*/),
        "node.slots.edges.node.section": {
          "enumValues": [
            "MORNING",
            "MIDDAY",
            "EVENING"
          ],
          "nullable": false,
          "plural": false,
          "type": "DaySection"
        },
        "node.title": (v3/*: any*/)
      }
    },
    "name": "TaskQuery",
    "operationKind": "query",
    "text": "query TaskQuery {\n  node(id: \"\") {\n    __typename\n    ... on Task {\n      __typename\n      ...Task_task\n    }\n    id\n  }\n}\n\nfragment Task_task on Task {\n  id\n  title\n  icon\n  createdAt\n  slots(first: 100) {\n    edges {\n      node {\n        id\n        section\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cd2bf52ab0b6fb3eb49c808815d825c0";

export default node;
