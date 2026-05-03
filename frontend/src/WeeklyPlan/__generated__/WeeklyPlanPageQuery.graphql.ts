/**
 * @generated SignedSource<<8886139985903a9b82107843fff9fdd9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanPageQuery$variables = Record<PropertyKey, never>;
export type WeeklyPlanPageQuery$data = {
  readonly weeklySchedule: {
    readonly friday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_day">;
    };
    readonly monday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_day">;
    };
    readonly saturday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_day">;
    };
    readonly sunday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_day">;
    };
    readonly thursday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_day">;
    };
    readonly tuesday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_day">;
    };
    readonly wednesday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_day">;
    };
  };
};
export type WeeklyPlanPageQuery = {
  response: WeeklyPlanPageQuery$data;
  variables: WeeklyPlanPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "WeeklyPlanDay_day"
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
v4 = [
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "icon",
                "storageKey": null
              },
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v2/*: any*/)
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
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "dayOfWeek",
    "storageKey": null
  },
  {
    "alias": null,
    "args": (v1/*: any*/),
    "concreteType": "RoutineSlotConnection",
    "kind": "LinkedField",
    "name": "morning",
    "plural": false,
    "selections": (v4/*: any*/),
    "storageKey": "morning(first:100)"
  },
  {
    "alias": null,
    "args": (v1/*: any*/),
    "filters": null,
    "handle": "connection",
    "key": "WeeklyPlanDaySlots_morning",
    "kind": "LinkedHandle",
    "name": "morning"
  },
  {
    "alias": null,
    "args": (v1/*: any*/),
    "concreteType": "RoutineSlotConnection",
    "kind": "LinkedField",
    "name": "midday",
    "plural": false,
    "selections": (v4/*: any*/),
    "storageKey": "midday(first:100)"
  },
  {
    "alias": null,
    "args": (v1/*: any*/),
    "filters": null,
    "handle": "connection",
    "key": "WeeklyPlanDaySlots_midday",
    "kind": "LinkedHandle",
    "name": "midday"
  },
  {
    "alias": null,
    "args": (v1/*: any*/),
    "concreteType": "RoutineSlotConnection",
    "kind": "LinkedField",
    "name": "evening",
    "plural": false,
    "selections": (v4/*: any*/),
    "storageKey": "evening(first:100)"
  },
  {
    "alias": null,
    "args": (v1/*: any*/),
    "filters": null,
    "handle": "connection",
    "key": "WeeklyPlanDaySlots_evening",
    "kind": "LinkedHandle",
    "name": "evening"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "WeeklyPlanPageQuery",
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
            "selections": (v0/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "tuesday",
            "plural": false,
            "selections": (v0/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "wednesday",
            "plural": false,
            "selections": (v0/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "thursday",
            "plural": false,
            "selections": (v0/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "friday",
            "plural": false,
            "selections": (v0/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "saturday",
            "plural": false,
            "selections": (v0/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "sunday",
            "plural": false,
            "selections": (v0/*: any*/),
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
    "name": "WeeklyPlanPageQuery",
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
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "tuesday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "wednesday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "thursday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "friday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "saturday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "sunday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fe0bc0ce7466cf014b69d74741385a42",
    "id": null,
    "metadata": {},
    "name": "WeeklyPlanPageQuery",
    "operationKind": "query",
    "text": "query WeeklyPlanPageQuery {\n  weeklySchedule {\n    monday {\n      ...WeeklyPlanDay_day\n    }\n    tuesday {\n      ...WeeklyPlanDay_day\n    }\n    wednesday {\n      ...WeeklyPlanDay_day\n    }\n    thursday {\n      ...WeeklyPlanDay_day\n    }\n    friday {\n      ...WeeklyPlanDay_day\n    }\n    saturday {\n      ...WeeklyPlanDay_day\n    }\n    sunday {\n      ...WeeklyPlanDay_day\n    }\n  }\n}\n\nfragment DaySection_section on RoutineSlotConnection {\n  edges {\n    __typename\n  }\n  ...WeeklyPlanRoutineSection_section\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  task {\n    title\n    icon\n    id\n  }\n}\n\nfragment WeeklyPlanDay_day on DaySchedule {\n  dayOfWeek\n  morning(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...DaySection_section\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  midday(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...DaySection_section\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  evening(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...DaySection_section\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b6bfc6db4585c7bd33d34966025a2c18";

export default node;
