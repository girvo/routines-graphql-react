/**
 * @generated SignedSource<<92c401fc3146312af6b4a9941cb81bd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RoutineSlotItemStoryQuery$variables = Record<PropertyKey, never>;
export type RoutineSlotItemStoryQuery$data = {
  readonly weeklySchedule: {
    readonly monday: {
      readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItemStory_mondayDay">;
    };
  };
};
export type RoutineSlotItemStoryQuery = {
  response: RoutineSlotItemStoryQuery$data;
  variables: RoutineSlotItemStoryQuery$variables;
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
    "name": "RoutineSlotItemStoryQuery",
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
                "name": "RoutineSlotItemStory_mondayDay"
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
    "name": "RoutineSlotItemStoryQuery",
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
                "key": "RoutineSlotItemStory_morning",
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
    "cacheID": "c8d80cc5550bd8763559d30f04fc1b45",
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
    "name": "RoutineSlotItemStoryQuery",
    "operationKind": "query",
    "text": "query RoutineSlotItemStoryQuery {\n  weeklySchedule {\n    monday {\n      ...RoutineSlotItemStory_mondayDay\n    }\n  }\n}\n\nfragment RoutineSlotItemStory_mondayDay on DaySchedule {\n  morning(first: 100) {\n    edges {\n      cursor\n      node {\n        id\n        ...RoutineSlotItem_routineSlot\n        __typename\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  dayOfWeek\n  task {\n    id\n    title\n    icon\n  }\n}\n"
  }
};
})();

(node as any).hash = "a1e256730aef6372e4aedb0ffbc5881a";

export default node;
