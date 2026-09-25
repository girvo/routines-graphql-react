/**
 * @generated SignedSource<<88fa92ca64d8f9757d4fd3afea334d3d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EditTask_task$data = {
  icon: string | null | undefined;
  title: string;
  readonly " $fragmentType": "EditTask_task";
};
export type EditTask_task$key = {
  readonly " $data"?: EditTask_task$data;
  readonly $updatableFragmentSpreads: FragmentRefs<"EditTask_task">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditTask_task",
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
  "type": "Task",
  "abstractKey": null
};

(node as any).hash = "a9b1649c4e7e27fd9faddaf8831389ae";

export default node;
