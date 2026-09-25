/**
 * @generated SignedSource<<6521b5ade5412f450c6545430df9e61f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NotificationSettings_me$data = {
  readonly id: string;
  readonly morningReminderEnabled: boolean;
  readonly pushSubscriptions: ReadonlyArray<{
    readonly createdAt: string;
    readonly endpoint: string;
    readonly id: string;
    readonly platform: string | null | undefined;
  }>;
  readonly " $fragmentType": "NotificationSettings_me";
};
export type NotificationSettings_me$key = {
  readonly " $data"?: NotificationSettings_me$data;
  readonly " $fragmentSpreads": FragmentRefs<"NotificationSettings_me">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "NotificationSettings_me",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "morningReminderEnabled",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PushSubscription",
      "kind": "LinkedField",
      "name": "pushSubscriptions",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endpoint",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "platform",
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
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};
})();

(node as any).hash = "e2846ac6ec03b57978a35b51ac34fe11";

export default node;
