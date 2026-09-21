/**
 * @generated SignedSource<<9fd8018f2dbe3bdf5349680b9706fc79>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DaySectionStoryQuery$variables = Record<PropertyKey, never>;
export type DaySectionStoryQuery$data = {
  readonly daySectionSlots: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
};
export type DaySectionStoryQuery = {
  response: DaySectionStoryQuery$data;
  variables: DaySectionStoryQuery$variables;
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayOfWeek",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v4 = {
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
},
v7 = {
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
    "name": "DaySectionStoryQuery",
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
            "name": "DaySection_section"
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
    "name": "DaySectionStoryQuery",
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "section",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      },
                      (v1/*: any*/),
                      (v2/*: any*/),
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
            "args": (v3/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "DaySection_slots",
            "kind": "LinkedHandle",
            "name": "slots"
          }
        ],
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
      }
    ]
  },
  "params": {
    "cacheID": "af4c695901bc4f9e8e5a6d657e45c780",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "daySectionSlots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DaySectionSlots"
        },
        "daySectionSlots.dayOfWeek": (v4/*: any*/),
        "daySectionSlots.id": (v5/*: any*/),
        "daySectionSlots.section": {
          "enumValues": [
            "MORNING",
            "MIDDAY",
            "EVENING"
          ],
          "nullable": false,
          "plural": false,
          "type": "DaySection"
        },
        "daySectionSlots.slots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlotConnection"
        },
        "daySectionSlots.slots.__id": (v5/*: any*/),
        "daySectionSlots.slots.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "RoutineSlotEdge"
        },
        "daySectionSlots.slots.edges.cursor": (v6/*: any*/),
        "daySectionSlots.slots.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "daySectionSlots.slots.edges.node.__typename": (v6/*: any*/),
        "daySectionSlots.slots.edges.node.dayOfWeek": (v4/*: any*/),
        "daySectionSlots.slots.edges.node.id": (v5/*: any*/),
        "daySectionSlots.slots.edges.node.task": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "daySectionSlots.slots.edges.node.task.icon": (v7/*: any*/),
        "daySectionSlots.slots.edges.node.task.id": (v5/*: any*/),
        "daySectionSlots.slots.edges.node.task.title": (v6/*: any*/),
        "daySectionSlots.slots.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "daySectionSlots.slots.pageInfo.endCursor": (v7/*: any*/),
        "daySectionSlots.slots.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "DaySectionStoryQuery",
    "operationKind": "query",
    "text": "query DaySectionStoryQuery {\n  daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n}\n\nfragment DaySection_section on DaySectionSlots {\n  id\n  dayOfWeek\n  section\n  slots(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    ...WeeklyPlanRoutineSection_section\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  dayOfWeek\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "07fade2a031ea513786e279524456aea";

export default node;
