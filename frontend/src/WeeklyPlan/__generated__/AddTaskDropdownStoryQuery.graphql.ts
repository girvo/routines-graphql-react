/**
 * @generated SignedSource<<3c186dc0450cb3fadd3cfc5c9cdd3a1f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddTaskDropdownStoryQuery$variables = Record<PropertyKey, never>;
export type AddTaskDropdownStoryQuery$data = {
  readonly weeklySchedule: {
    readonly monday: {
      readonly " $fragmentSpreads": FragmentRefs<"AddTaskDropdownStory_mondayDay">;
    };
  };
};
export type AddTaskDropdownStoryQuery = {
  response: AddTaskDropdownStoryQuery$data;
  variables: AddTaskDropdownStoryQuery$variables;
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
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AddTaskDropdownStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "WeeklySchedulePayload",
        "kind": "LinkedField",
        "name": "weeklySchedule",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "monday",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AddTaskDropdownStory_mondayDay"
              }
            ],
            "storageKey": null
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
    "name": "AddTaskDropdownStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "WeeklySchedulePayload",
        "kind": "LinkedField",
        "name": "weeklySchedule",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "monday",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v0/*: any*/),
                "concreteType": "RoutineSlotConnection",
                "kind": "LinkedField",
                "name": "morning",
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
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      },
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
                            "name": "dayOfWeek",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Task",
                            "kind": "LinkedField",
                            "name": "task",
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
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "__typename",
                            "storageKey": null
                          }
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
                "storageKey": "morning(first:100)"
              },
              {
                "alias": null,
                "args": (v0/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "AddTaskDropdownStory_morning",
                "kind": "LinkedHandle",
                "name": "morning"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7a8edf7db34c8be929975a30adc10954",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "weeklySchedule": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "WeeklySchedulePayload"
        },
        "weeklySchedule.monday": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DaySchedule"
        },
        "weeklySchedule.monday.morning": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlotConnection"
        },
        "weeklySchedule.monday.morning.__id": (v2/*: any*/),
        "weeklySchedule.monday.morning.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "RoutineSlotEdge"
        },
        "weeklySchedule.monday.morning.edges.cursor": (v3/*: any*/),
        "weeklySchedule.monday.morning.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "weeklySchedule.monday.morning.edges.node.__typename": (v3/*: any*/),
        "weeklySchedule.monday.morning.edges.node.dayOfWeek": {
          "enumValues": [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"
          ],
          "nullable": false,
          "plural": false,
          "type": "DayOfWeek"
        },
        "weeklySchedule.monday.morning.edges.node.id": (v2/*: any*/),
        "weeklySchedule.monday.morning.edges.node.task": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "weeklySchedule.monday.morning.edges.node.task.icon": (v4/*: any*/),
        "weeklySchedule.monday.morning.edges.node.task.id": (v2/*: any*/),
        "weeklySchedule.monday.morning.edges.node.task.title": (v3/*: any*/),
        "weeklySchedule.monday.morning.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "weeklySchedule.monday.morning.pageInfo.endCursor": (v4/*: any*/),
        "weeklySchedule.monday.morning.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "AddTaskDropdownStoryQuery",
    "operationKind": "query",
    "text": "query AddTaskDropdownStoryQuery {\n  weeklySchedule {\n    monday {\n      ...AddTaskDropdownStory_mondayDay\n    }\n  }\n}\n\nfragment AddTaskDropdownStory_mondayDay on DaySchedule {\n  morning(first: 100) {\n    edges {\n      cursor\n      node {\n        id\n        ...RoutineSlotItem_routineSlot\n        __typename\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  dayOfWeek\n  task {\n    id\n    title\n    icon\n  }\n}\n"
  }
};
})();

(node as any).hash = "2811283972fea99303984cd6f6d30d23";

export default node;
