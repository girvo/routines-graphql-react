/**
 * @generated SignedSource<<1c616bb499fe9195e404759166152f25>>
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
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
    };
    readonly monday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
    };
    readonly saturday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
    };
    readonly sunday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
    };
    readonly thursday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
    };
    readonly tuesday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
    };
    readonly wednesday: {
      readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
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
    "name": "WeeklyPlanDay"
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
  "name": "id",
  "storageKey": null
},
v3 = [
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Task",
            "kind": "LinkedField",
            "name": "task",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
v4 = [
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
    "selections": (v3/*: any*/),
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
    "selections": (v3/*: any*/),
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
    "selections": (v3/*: any*/),
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
            "selections": (v4/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "tuesday",
            "plural": false,
            "selections": (v4/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "wednesday",
            "plural": false,
            "selections": (v4/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "thursday",
            "plural": false,
            "selections": (v4/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "friday",
            "plural": false,
            "selections": (v4/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "saturday",
            "plural": false,
            "selections": (v4/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySchedule",
            "kind": "LinkedField",
            "name": "sunday",
            "plural": false,
            "selections": (v4/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "96f151b5f77895ceb14c3fa0d7025467",
    "id": null,
    "metadata": {},
    "name": "WeeklyPlanPageQuery",
    "operationKind": "query",
    "text": "query WeeklyPlanPageQuery {\n  weeklySchedule {\n    monday {\n      ...WeeklyPlanDay\n    }\n    tuesday {\n      ...WeeklyPlanDay\n    }\n    wednesday {\n      ...WeeklyPlanDay\n    }\n    thursday {\n      ...WeeklyPlanDay\n    }\n    friday {\n      ...WeeklyPlanDay\n    }\n    saturday {\n      ...WeeklyPlanDay\n    }\n    sunday {\n      ...WeeklyPlanDay\n    }\n  }\n}\n\nfragment RoutineSlotItem on Task {\n  id\n  title\n  icon\n}\n\nfragment WeeklyPlanDay on DaySchedule {\n  dayOfWeek\n  morning(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...WeeklyPlanRoutineSectionFragment\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  midday(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...WeeklyPlanRoutineSectionFragment\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  evening(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...WeeklyPlanRoutineSectionFragment\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment WeeklyPlanRoutineSectionFragment on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      task {\n        ...RoutineSlotItem\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ef4d53159422a8c69a42fa82fc2508c6";

export default node;
