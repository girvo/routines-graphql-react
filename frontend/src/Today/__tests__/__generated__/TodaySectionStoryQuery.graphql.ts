/**
 * @generated SignedSource<<5bc82d894140e65ad63dbd8661bad613>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodaySectionStoryQuery$variables = Record<PropertyKey, never>;
export type TodaySectionStoryQuery$data = {
  readonly dailyRoutine: {
    readonly morning: {
      readonly " $fragmentSpreads": FragmentRefs<"TodaySection_section">;
    };
  };
};
export type TodaySectionStoryQuery = {
  response: TodaySectionStoryQuery$data;
  variables: TodaySectionStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
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
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TodaySectionStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "DailyRoutinePayload",
        "kind": "LinkedField",
        "name": "dailyRoutine",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "morning",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TodaySection_section"
              }
            ],
            "storageKey": "morning(first:100)"
          }
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
    "name": "TodaySectionStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "DailyRoutinePayload",
        "kind": "LinkedField",
        "name": "dailyRoutine",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "morning",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "DailyTaskInstanceEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DailyTaskInstance",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
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
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "morning(first:100)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e1fce049e94562d3bd3146bcaf913f3d",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "dailyRoutine": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DailyRoutinePayload"
        },
        "dailyRoutine.morning": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DailyTaskInstanceConnection"
        },
        "dailyRoutine.morning.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "DailyTaskInstanceEdge"
        },
        "dailyRoutine.morning.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DailyTaskInstance"
        },
        "dailyRoutine.morning.edges.node.completion": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "TaskCompletion"
        },
        "dailyRoutine.morning.edges.node.completion.id": (v2/*: any*/),
        "dailyRoutine.morning.edges.node.id": (v2/*: any*/),
        "dailyRoutine.morning.edges.node.routineSlot": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "dailyRoutine.morning.edges.node.routineSlot.id": (v2/*: any*/),
        "dailyRoutine.morning.edges.node.routineSlot.task": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "dailyRoutine.morning.edges.node.routineSlot.task.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "dailyRoutine.morning.edges.node.routineSlot.task.id": (v2/*: any*/),
        "dailyRoutine.morning.edges.node.routineSlot.task.title": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "String"
        }
      }
    },
    "name": "TodaySectionStoryQuery",
    "operationKind": "query",
    "text": "query TodaySectionStoryQuery {\n  dailyRoutine {\n    morning(first: 100) {\n      ...TodaySection_section\n    }\n  }\n}\n\nfragment TodaySection_section on DailyTaskInstanceConnection {\n  edges {\n    node {\n      routineSlot {\n        id\n      }\n      completion {\n        id\n      }\n      ...TodayTaskRow_instance\n      id\n    }\n  }\n}\n\nfragment TodayTaskRow_instance on DailyTaskInstance {\n  id\n  routineSlot {\n    id\n    task {\n      title\n      icon\n      id\n    }\n  }\n  completion {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6a4478a9e1a9ef84193ed1b58d9e8263";

export default node;
