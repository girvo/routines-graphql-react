/**
 * @generated SignedSource<<5daada8d35d0d54da29c39f0e253bed3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TaskDisplay$data = {
  readonly createdAt: any;
  readonly id: string;
  readonly title: string;
  readonly " $fragmentType": "TaskDisplay";
};
export type TaskDisplay$key = {
  readonly " $data"?: TaskDisplay$data;
  readonly " $fragmentSpreads": FragmentRefs<"TaskDisplay">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TaskDisplay",
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
      "name": "createdAt",
      "storageKey": null
    }
  ],
  "type": "Task",
  "abstractKey": null
};

(node as any).hash = "3d38e0f5b73cbe8407633eee5805d094";

export default node;
