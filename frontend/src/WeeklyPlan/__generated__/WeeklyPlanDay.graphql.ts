/**
 * @generated SignedSource<<7b2d63f80a17e6a6befe6c6965b10ebb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DayOfWeek = "FRIDAY" | "MONDAY" | "SATURDAY" | "SUNDAY" | "THURSDAY" | "TUESDAY" | "WEDNESDAY" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanDay$data = {
  readonly dayOfWeek: DayOfWeek;
  readonly evening: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSectionFragment">;
  };
  readonly midday: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSectionFragment">;
  };
  readonly morning: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSectionFragment">;
  };
  readonly " $fragmentType": "WeeklyPlanDay";
};
export type WeeklyPlanDay$key = {
  readonly " $data"?: WeeklyPlanDay$data;
  readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "WeeklyPlanRoutineSectionFragment"
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
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "morning"
        ]
      },
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "midday"
        ]
      },
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "evening"
        ]
      }
    ]
  },
  "name": "WeeklyPlanDay",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dayOfWeek",
      "storageKey": null
    },
    {
      "alias": "morning",
      "args": null,
      "concreteType": "RoutineSlotConnection",
      "kind": "LinkedField",
      "name": "__WeeklyPlanDaySlots_morning_connection",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": "midday",
      "args": null,
      "concreteType": "RoutineSlotConnection",
      "kind": "LinkedField",
      "name": "__WeeklyPlanDaySlots_midday_connection",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": "evening",
      "args": null,
      "concreteType": "RoutineSlotConnection",
      "kind": "LinkedField",
      "name": "__WeeklyPlanDaySlots_evening_connection",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "DaySchedule",
  "abstractKey": null
};
})();

(node as any).hash = "3c574c490c148d5bea1570a57a979846";

export default node;
