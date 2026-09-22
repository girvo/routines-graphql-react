/**
 * @generated SignedSource<<737be59f6d3b87f3293f430eb7929e8a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodayTaskRowStoryInnerQuery$variables = Record<PropertyKey, never>;
export type TodayTaskRowStoryInnerQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"TodayTaskRow_instance">;
  } | null | undefined;
};
export type TodayTaskRowStoryInnerQuery = {
  response: TodayTaskRowStoryInnerQuery$data;
  variables: TodayTaskRowStoryInnerQuery$variables;
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
    "name": "TodayTaskRowStoryInnerQuery",
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
                "name": "TodayTaskRow_instance"
              }
            ],
            "type": "DailyTaskInstance",
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
    "name": "TodayTaskRowStoryInnerQuery",
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
                "concreteType": "RoutineSlot",
                "kind": "LinkedField",
                "name": "routineSlot",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
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
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "TaskCompletion",
                "kind": "LinkedField",
                "name": "completion",
                "plural": false,
                "selections": [
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "DailyTaskInstance",
            "abstractKey": null
          }
        ],
        "storageKey": "node(id:\"test_id\")"
      }
    ]
  },
  "params": {
    "cacheID": "e8b799aeda57f6814e40b07535f89659",
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
        "node.completion": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "TaskCompletion"
        },
        "node.completion.id": (v3/*: any*/),
        "node.id": (v3/*: any*/),
        "node.routineSlot": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "node.routineSlot.id": (v3/*: any*/),
        "node.routineSlot.task": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "node.routineSlot.task.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "node.routineSlot.task.id": (v3/*: any*/),
        "node.routineSlot.task.title": (v2/*: any*/)
      }
    },
    "name": "TodayTaskRowStoryInnerQuery",
    "operationKind": "query",
    "text": "query TodayTaskRowStoryInnerQuery {\n  node(id: \"test_id\") {\n    __typename\n    ... on DailyTaskInstance {\n      ...TodayTaskRow_instance\n    }\n    id\n  }\n}\n\nfragment TodayTaskRow_instance on DailyTaskInstance {\n  id\n  routineSlot {\n    id\n    task {\n      title\n      icon\n      id\n    }\n  }\n  completion {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1dc4ec4a39e3906e62a661e4847a469e";

export default node;
