/**
 * @generated SignedSource<<bc4f1d121994d1b51f875c6610aa44b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EditTaskUpdatable$data = {
  icon: string | null | undefined;
  readonly id: string;
  title: string;
  readonly " $fragmentType": "EditTaskUpdatable";
};
export type EditTaskUpdatable$key = {
  readonly " $data"?: EditTaskUpdatable$data;
  readonly $updatableFragmentSpreads: FragmentRefs<"EditTaskUpdatable">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditTaskUpdatable",
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

(node as any).hash = "9864c4a7fc8bcec534f0126de9093c60";

export default node;
