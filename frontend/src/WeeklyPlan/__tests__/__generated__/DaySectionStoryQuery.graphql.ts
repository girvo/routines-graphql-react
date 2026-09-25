/**
 * @generated SignedSource<<e33cb94409de11b3549abd440a9b1c74>>
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
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v6 = {
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
          {
            "alias": null,
            "args": (v1/*: any*/),
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
                  (v2/*: any*/),
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
                      (v2/*: any*/),
                      (v3/*: any*/),
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
                          (v3/*: any*/),
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
              }
            ],
            "storageKey": "slots(first:100)"
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "DaySection_slots",
            "kind": "LinkedHandle",
            "name": "slots"
          },
          (v3/*: any*/)
        ],
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
      }
    ]
  },
  "params": {
    "cacheID": "384ced63cc462566815011cce64b490b",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "daySectionSlots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DaySectionSlots"
        },
        "daySectionSlots.id": (v4/*: any*/),
        "daySectionSlots.slots": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlotConnection"
        },
        "daySectionSlots.slots.__id": (v4/*: any*/),
        "daySectionSlots.slots.edges": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "RoutineSlotEdge"
        },
        "daySectionSlots.slots.edges.__typename": (v5/*: any*/),
        "daySectionSlots.slots.edges.cursor": (v5/*: any*/),
        "daySectionSlots.slots.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "RoutineSlot"
        },
        "daySectionSlots.slots.edges.node.__typename": (v5/*: any*/),
        "daySectionSlots.slots.edges.node.id": (v4/*: any*/),
        "daySectionSlots.slots.edges.node.task": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Task"
        },
        "daySectionSlots.slots.edges.node.task.icon": (v6/*: any*/),
        "daySectionSlots.slots.edges.node.task.id": (v4/*: any*/),
        "daySectionSlots.slots.edges.node.task.title": (v5/*: any*/),
        "daySectionSlots.slots.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "daySectionSlots.slots.pageInfo.endCursor": (v6/*: any*/),
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
    "text": "query DaySectionStoryQuery {\n  daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n}\n\nfragment DaySection_section on DaySectionSlots {\n  slots(first: 100) {\n    edges {\n      __typename\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...WeeklyPlanRoutineSection_section\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      task {\n        title\n        id\n      }\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "07fade2a031ea513786e279524456aea";

export default node;
