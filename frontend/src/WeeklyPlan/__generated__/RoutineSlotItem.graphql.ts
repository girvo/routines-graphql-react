/**
 * @generated SignedSource<<dd98b1b4c19dd61893a65b939b68a031>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RoutineSlotItem$data = {
  readonly id: string;
  readonly task: {
    readonly icon: string | null | undefined;
    readonly title: string;
  };
  readonly " $fragmentType": "RoutineSlotItem";
};
export type RoutineSlotItem$key = {
  readonly " $data"?: RoutineSlotItem$data;
  readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RoutineSlotItem",
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

(node as any).hash = "841c462f317f5ffe17fdccfcb3b51677";

export default node;
