/**
 * @generated SignedSource<<5ec7c107bfffa16146610e305a277c47>>
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
    readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSectionFragment">;
  };
  readonly midday: {
    readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSectionFragment">;
  };
  readonly morning: {
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
    "args": null,
    "kind": "FragmentSpread",
    "name": "WeeklyPlanRoutineSectionFragment"
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
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
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "RoutineSlotConnection",
      "kind": "LinkedField",
      "name": "morning",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": "morning(first:100)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "RoutineSlotConnection",
      "kind": "LinkedField",
      "name": "midday",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "RoutineSlotConnection",
      "kind": "LinkedField",
      "name": "evening",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "DaySchedule",
  "abstractKey": null
};
})();

(node as any).hash = "0aee08ba659505d12423b57cc1a38073";

export default node;
