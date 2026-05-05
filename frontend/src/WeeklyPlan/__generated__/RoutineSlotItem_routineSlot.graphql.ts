/**
 * @generated SignedSource<<d6e1d14d2e75f43e3a09fbbd83d48612>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DayOfWeek = "FRIDAY" | "MONDAY" | "SATURDAY" | "SUNDAY" | "THURSDAY" | "TUESDAY" | "WEDNESDAY" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type RoutineSlotItem_routineSlot$data = {
  readonly dayOfWeek: DayOfWeek;
  readonly id: string;
  readonly task: {
    readonly icon: string | null | undefined;
    readonly id: string;
    readonly title: string;
  };
  readonly " $fragmentType": "RoutineSlotItem_routineSlot";
};
export type RoutineSlotItem_routineSlot$key = {
  readonly " $data"?: RoutineSlotItem_routineSlot$data;
  readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem_routineSlot">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RoutineSlotItem_routineSlot",
  "selections": [
    (v0/*: any*/),
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
        (v0/*: any*/),
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
  "type": "RoutineSlot",
  "abstractKey": null
};
})();

(node as any).hash = "fc9bff870e184b57bf5f3f7340a5ca0b";

export default node;
