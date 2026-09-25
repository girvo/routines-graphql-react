/**
 * @generated SignedSource<<7e7127f5269d6d3a5b41e8dec62a4312>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DayOfWeek = "FRIDAY" | "MONDAY" | "SATURDAY" | "SUNDAY" | "THURSDAY" | "TUESDAY" | "WEDNESDAY" | "%future added value";
export type WeeklyPlanPageQuery$variables = {
  dayOfWeek: DayOfWeek;
};
export type WeeklyPlanPageQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_sections">;
};
export type WeeklyPlanPageQuery = {
  response: WeeklyPlanPageQuery$data;
  variables: WeeklyPlanPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "dayOfWeek"
  }
],
v1 = {
  "kind": "Variable",
  "name": "dayOfWeek",
  "variableName": "dayOfWeek"
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
  "name": "id",
  "storageKey": null
},
v5 = [
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
          (v3/*: any*/),
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
              (v3/*: any*/),
              (v4/*: any*/),
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
                  (v4/*: any*/),
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
    "args": (v2/*: any*/),
    "filters": null,
    "handle": "connection",
    "key": "DaySection_slots",
    "kind": "LinkedHandle",
    "name": "slots"
  },
  (v4/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WeeklyPlanPageQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "WeeklyPlanDay_sections"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WeeklyPlanPageQuery",
    "selections": [
      {
        "alias": "morning",
        "args": [
          (v1/*: any*/),
          {
            "kind": "Literal",
            "name": "section",
            "value": "MORNING"
          }
        ],
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      },
      {
        "alias": "midday",
        "args": [
          (v1/*: any*/),
          {
            "kind": "Literal",
            "name": "section",
            "value": "MIDDAY"
          }
        ],
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      },
      {
        "alias": "evening",
        "args": [
          (v1/*: any*/),
          {
            "kind": "Literal",
            "name": "section",
            "value": "EVENING"
          }
        ],
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2962660dca12df210789e8585054dbb5",
    "id": null,
    "metadata": {},
    "name": "WeeklyPlanPageQuery",
    "operationKind": "query",
    "text": "query WeeklyPlanPageQuery(\n  $dayOfWeek: DayOfWeek!\n) {\n  ...WeeklyPlanDay_sections_2OjLUs\n}\n\nfragment DaySection_section on DaySectionSlots {\n  slots(first: 100) {\n    edges {\n      __typename\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...WeeklyPlanRoutineSection_section\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanDay_sections_2OjLUs on Query {\n  morning: daySectionSlots(dayOfWeek: $dayOfWeek, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  midday: daySectionSlots(dayOfWeek: $dayOfWeek, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  evening: daySectionSlots(dayOfWeek: $dayOfWeek, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      task {\n        title\n        id\n      }\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a92ce21ca8c67703fb3feb26e9ab4652";

export default node;
