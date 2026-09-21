/**
 * @generated SignedSource<<74834fdda21ee1679486efeaf693f2f7>>
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
  readonly daySectionSlots: {
    readonly " $fragmentSpreads": FragmentRefs<"AddTaskDropdownStory_daySection">;
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
    "name": "dayOfWeek",
    "value": "MONDAY"
  },
  {
    "kind": "Literal",
    "name": "section",
    "value": "MORNING"
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
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v5 = {
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
        "args": (v0/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AddTaskDropdownStory_daySection"
          }
        ],
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
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
        "args": (v0/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
            "storageKey": "slots(first:100)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "AddTaskDropdownStory_slots",
            "kind": "LinkedHandle",
            "name": "slots"
          }
        ],
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
      }
    ]
  },
  "params": {
    "cacheID": "4bb809002a128f502caba8025b0c2dc9",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "daySectionSlots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DaySectionSlots"
        },
        "daySectionSlots.id": (v3/*: any*/),
        "daySectionSlots.slots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlotConnection"
        },
        "daySectionSlots.slots.__id": (v3/*: any*/),
        "daySectionSlots.slots.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "RoutineSlotEdge"
        },
        "daySectionSlots.slots.edges.cursor": (v4/*: any*/),
        "daySectionSlots.slots.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "daySectionSlots.slots.edges.node.__typename": (v4/*: any*/),
        "daySectionSlots.slots.edges.node.dayOfWeek": {
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
        "daySectionSlots.slots.edges.node.id": (v3/*: any*/),
        "daySectionSlots.slots.edges.node.task": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "daySectionSlots.slots.edges.node.task.icon": (v5/*: any*/),
        "daySectionSlots.slots.edges.node.task.id": (v3/*: any*/),
        "daySectionSlots.slots.edges.node.task.title": (v4/*: any*/),
        "daySectionSlots.slots.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "daySectionSlots.slots.pageInfo.endCursor": (v5/*: any*/),
        "daySectionSlots.slots.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "AddTaskDropdownStoryQuery",
    "operationKind": "query",
    "text": "query AddTaskDropdownStoryQuery {\n  daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {\n    ...AddTaskDropdownStory_daySection\n    id\n  }\n}\n\nfragment AddTaskDropdownStory_daySection on DaySectionSlots {\n  id\n  slots(first: 100) {\n    edges {\n      cursor\n      node {\n        id\n        ...RoutineSlotItem_routineSlot\n        __typename\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  dayOfWeek\n  task {\n    id\n    title\n    icon\n  }\n}\n"
  }
};
})();

(node as any).hash = "dc4e876062b405ae693b295eaeeaa7f9";

export default node;
