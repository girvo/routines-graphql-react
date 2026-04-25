/**
 * @generated SignedSource<<b8521e365e1032d225782cb7b76bb771>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DesktopSidebar_me$data = {
  readonly email: string;
  readonly initials: string;
  readonly name: string;
  readonly " $fragmentType": "DesktopSidebar_me";
};
export type DesktopSidebar_me$key = {
  readonly " $data"?: DesktopSidebar_me$data;
  readonly " $fragmentSpreads": FragmentRefs<"DesktopSidebar_me">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DesktopSidebar_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "initials",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "65b3e850f7d0202c6a65e0a95dc57b85";

export default node;
