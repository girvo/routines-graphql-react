/**
 * @generated SignedSource<<afb4a045f06380739d7aa25b61129280>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateTask$data = {
  readonly __id: string;
  readonly " $fragmentType": "CreateTask";
};
export type CreateTask$key = {
  readonly " $data"?: CreateTask$data;
  readonly " $fragmentSpreads": FragmentRefs<"CreateTask">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreateTask",
  "selections": [
    {
      "kind": "ClientExtension",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__id",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "TaskConnection",
  "abstractKey": null
};

(node as any).hash = "3b23784b68c0da201cfc1af27d074eed";

export default node;
