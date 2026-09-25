/**
 * @generated SignedSource<<498c583194c0c1310138c0695f47b6e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateTaskStoryQuery$variables = Record<PropertyKey, never>;
export type CreateTaskStoryQuery$data = {
  readonly tasks: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly __typename: "TaskEdge";
    }>;
  };
};
export type CreateTaskStoryQuery = {
  response: CreateTaskStoryQuery$data;
  variables: CreateTaskStoryQuery$variables;
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
    "value": 20
  }
],
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v6 = {
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
    "name": "CreateTaskStoryQuery",
    "selections": [
      {
        "alias": "tasks",
        "args": null,
        "concreteType": "TaskConnection",
        "kind": "LinkedField",
        "name": "__CreateTaskStory_tasks_connection",
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
              (v0/*: any*/),
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v0/*: any*/)
                ],
                "storageKey": null
              }
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
    "name": "CreateTaskStoryQuery",
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
              (v0/*: any*/),
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": "tasks(first:20)"
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "CreateTaskStory_tasks",
        "kind": "LinkedHandle",
        "name": "tasks"
      }
    ]
  },
  "params": {
    "cacheID": "5f2a4726061812cb374f07090d266c3d",
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
        "tasks.__id": (v5/*: any*/),
        "tasks.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "TaskEdge"
        },
        "tasks.edges.__typename": (v6/*: any*/),
        "tasks.edges.cursor": (v6/*: any*/),
        "tasks.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "tasks.edges.node.__typename": (v6/*: any*/),
        "tasks.edges.node.id": (v5/*: any*/),
        "tasks.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "tasks.pageInfo.endCursor": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "tasks.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "CreateTaskStoryQuery",
    "operationKind": "query",
    "text": "query CreateTaskStoryQuery {\n  tasks(first: 20) {\n    edges {\n      __typename\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3e6e55e44663696446a8c9e9550e925f";

export default node;
