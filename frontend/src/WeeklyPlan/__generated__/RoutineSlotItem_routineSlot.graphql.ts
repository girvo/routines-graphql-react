/**
 * @generated SignedSource<<75f766ce30e40792fd41a592cefe0921>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RoutineSlotItem_routineSlot$data = {
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

(node as any).hash = "c4f82c114fd6ae53084d486ad999ec6d";

export default node;
