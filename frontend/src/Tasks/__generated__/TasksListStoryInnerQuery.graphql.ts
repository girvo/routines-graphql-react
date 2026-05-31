/**
 * @generated SignedSource<<09ee41106b4fb66466de02dd3cbe5525>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TasksListStoryInnerQuery$variables = Record<PropertyKey, never>;
export type TasksListStoryInnerQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"TasksList_tasks">;
};
export type TasksListStoryInnerQuery = {
  response: TasksListStoryInnerQuery$data;
  variables: TasksListStoryInnerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v5 = {
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
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v9 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "PageInfo"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TasksListStoryInnerQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "TasksList_tasks"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TasksListStoryInnerQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
                  (v1/*: any*/),
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
                    "args": (v2/*: any*/),
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "section",
                                "storageKey": null
                              },
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": "slots(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v2/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "Task_slots",
                    "kind": "LinkedHandle",
                    "name": "slots"
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v5/*: any*/),
          {
            "kind": "ClientExtension",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__id",
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": "tasks(first:20)"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "filters": [
          "titleSearch"
        ],
        "handle": "connection",
        "key": "TasksList_tasks",
        "kind": "LinkedHandle",
        "name": "tasks"
      }
    ]
  },
  "params": {
    "cacheID": "6b474785fae1a820edd16b9a8cb653c8",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "tasks": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "TaskConnection"
        },
        "tasks.__id": (v6/*: any*/),
        "tasks.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "TaskEdge"
        },
        "tasks.edges.cursor": (v7/*: any*/),
        "tasks.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "tasks.edges.node.__typename": (v7/*: any*/),
        "tasks.edges.node.createdAt": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DateTime"
        },
        "tasks.edges.node.icon": (v8/*: any*/),
        "tasks.edges.node.id": (v6/*: any*/),
        "tasks.edges.node.slots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlotConnection"
        },
        "tasks.edges.node.slots.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "RoutineSlotEdge"
        },
        "tasks.edges.node.slots.edges.cursor": (v7/*: any*/),
        "tasks.edges.node.slots.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "tasks.edges.node.slots.edges.node.__typename": (v7/*: any*/),
        "tasks.edges.node.slots.edges.node.id": (v6/*: any*/),
        "tasks.edges.node.slots.edges.node.section": {
          "enumValues": [
            "MORNING",
            "MIDDAY",
            "EVENING"
          ],
          "nullable": false,
          "plural": false,
          "type": "DaySection"
        },
        "tasks.edges.node.slots.pageInfo": (v9/*: any*/),
        "tasks.edges.node.slots.pageInfo.endCursor": (v8/*: any*/),
        "tasks.edges.node.slots.pageInfo.hasNextPage": (v10/*: any*/),
        "tasks.edges.node.title": (v7/*: any*/),
        "tasks.pageInfo": (v9/*: any*/),
        "tasks.pageInfo.endCursor": (v8/*: any*/),
        "tasks.pageInfo.hasNextPage": (v10/*: any*/)
      }
    },
    "name": "TasksListStoryInnerQuery",
    "operationKind": "query",
    "text": "query TasksListStoryInnerQuery {\n  ...TasksList_tasks\n}\n\nfragment Task_task on Task {\n  id\n  title\n  icon\n  createdAt\n  slots(first: 100) {\n    edges {\n      node {\n        id\n        section\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment TasksList_tasks on Query {\n  tasks(first: 20) {\n    edges {\n      node {\n        id\n        title\n        ...Task_task\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "821d5fcc218c89bd24bc834705631a63";

export default node;
