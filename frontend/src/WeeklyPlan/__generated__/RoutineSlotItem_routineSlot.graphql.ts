/**
 * @generated SignedSource<<5be3272db3a43ed3247377d73c374009>>
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
    readonly title: string;
  };
  readonly " $fragmentType": "RoutineSlotItem_routineSlot";
};
export type RoutineSlotItem_routineSlot$key = {
  readonly " $data"?: RoutineSlotItem_routineSlot$data;
  readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem_routineSlot">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RoutineSlotItem_routineSlot",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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

(node as any).hash = "c2805c04fa423444b76d4fca763ddc28";

export default node;
