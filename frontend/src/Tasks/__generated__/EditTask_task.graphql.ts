/**
 * @generated SignedSource<<b24eba973c2c61c8ab6a06cb2048d7a1>>
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
  readonly id: string;
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

(node as any).hash = "eb7c345213042c3003c1349ab286ab59";

export default node;
