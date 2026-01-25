/**
 * @generated SignedSource<<bf56d02a8f314989b6db60f375ef86d1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RoutineSlotItem$data = {
  readonly icon: string | null | undefined;
  readonly id: string;
  readonly title: string;
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
  "type": "Task",
  "abstractKey": null
};

(node as any).hash = "ff0729e98aa58a5190cf3f68d6104ce8";

export default node;
