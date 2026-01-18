/**
 * @generated SignedSource<<a1e38e1c66e5b0abbe5e770f6f4cd7cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EditTaskMutation_updatable$data = {
  icon: string | null | undefined;
  title: string;
  readonly " $fragmentType": "EditTaskMutation_updatable";
};
export type EditTaskMutation_updatable$key = {
  readonly " $data"?: EditTaskMutation_updatable$data;
  readonly $updatableFragmentSpreads: FragmentRefs<"EditTaskMutation_updatable">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditTaskMutation_updatable",
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

(node as any).hash = "398afe07445743d7d3dfb155a50a27fe";

export default node;
