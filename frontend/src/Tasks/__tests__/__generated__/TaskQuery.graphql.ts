/**
 * @generated SignedSource<<0bd20213a0f15d4f7782a21461dd8c58>>
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
  readonly tasks: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly $updatableFragmentSpreads: FragmentRefs<"EditTask_task">;
        readonly " $fragmentSpreads": FragmentRefs<"Task_task">;
      };
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
  };
};
export type TaskQuery = {
  response: TaskQuery$data;
  variables: TaskQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v2 = {
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
v3 = {
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
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v8 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "PageInfo"
},
v11 = {
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
    "name": "TaskQuery",
    "selections": [
      {
        "alias": "tasks",
        "args": null,
        "concreteType": "TaskConnection",
        "kind": "LinkedField",
        "name": "__TaskQuery_tasks_connection",
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "Task_task"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "EditTask_task"
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
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
        "args": (v4/*: any*/),
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
                  (v5/*: any*/),
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
                    "args": (v6/*: any*/),
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
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "section",
                                "storageKey": null
                              },
                              (v0/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v1/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": "slots(first:100)"
                  },
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "Task_slots",
                    "kind": "LinkedHandle",
                    "name": "slots"
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": "tasks(first:1)"
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "TaskQuery_tasks",
        "kind": "LinkedHandle",
        "name": "tasks"
      }
    ]
  },
  "params": {
    "cacheID": "65fdf154c6a6053c7f1e6a4a0219a5ef",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "tasks"
          ]
        }
      ],
      "relayTestingSelectionTypeInfo": {
        "tasks": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "TaskConnection"
        },
        "tasks.__id": (v7/*: any*/),
        "tasks.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "TaskEdge"
        },
        "tasks.edges.cursor": (v8/*: any*/),
        "tasks.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "tasks.edges.node.__typename": (v8/*: any*/),
        "tasks.edges.node.createdAt": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DateTime"
        },
        "tasks.edges.node.icon": (v9/*: any*/),
        "tasks.edges.node.id": (v7/*: any*/),
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
        "tasks.edges.node.slots.edges.cursor": (v8/*: any*/),
        "tasks.edges.node.slots.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "tasks.edges.node.slots.edges.node.__typename": (v8/*: any*/),
        "tasks.edges.node.slots.edges.node.id": (v7/*: any*/),
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
        "tasks.edges.node.slots.pageInfo": (v10/*: any*/),
        "tasks.edges.node.slots.pageInfo.endCursor": (v9/*: any*/),
        "tasks.edges.node.slots.pageInfo.hasNextPage": (v11/*: any*/),
        "tasks.edges.node.title": (v8/*: any*/),
        "tasks.pageInfo": (v10/*: any*/),
        "tasks.pageInfo.endCursor": (v9/*: any*/),
        "tasks.pageInfo.hasNextPage": (v11/*: any*/)
      }
    },
    "name": "TaskQuery",
    "operationKind": "query",
    "text": "query TaskQuery {\n  tasks(first: 1) {\n    edges {\n      node {\n        ...Task_task\n        __typename\n        id\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment Task_task on Task {\n  id\n  title\n  icon\n  createdAt\n  slots(first: 100) {\n    edges {\n      node {\n        id\n        section\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5227a848876ff48b58b4c442ec25b6d6";

export default node;
