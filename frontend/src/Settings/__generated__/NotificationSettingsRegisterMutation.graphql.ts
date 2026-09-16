/**
 * @generated SignedSource<<eca823e994e122e3ec1a28a6c8c0fa35>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RegisterPushSubscriptionInput = {
  endpoint: string;
  keys: PushSubscriptionKeysInput;
  platform?: string | null | undefined;
};
export type PushSubscriptionKeysInput = {
  auth: string;
  p256dh: string;
};
export type NotificationSettingsRegisterMutation$variables = {
  input: RegisterPushSubscriptionInput;
};
export type NotificationSettingsRegisterMutation$data = {
  readonly registerPushSubscription: {
    readonly me: {
      readonly " $fragmentSpreads": FragmentRefs<"NotificationSettings_me">;
    };
    readonly pushSubscription: {
      readonly id: string;
    };
  } | null | undefined;
};
export type NotificationSettingsRegisterMutation = {
  response: NotificationSettingsRegisterMutation$data;
  variables: NotificationSettingsRegisterMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "PushSubscription",
  "kind": "LinkedField",
  "name": "pushSubscription",
  "plural": false,
  "selections": [
    (v2/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NotificationSettingsRegisterMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RegisterPushSubscriptionPayload",
        "kind": "LinkedField",
        "name": "registerPushSubscription",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "me",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "NotificationSettings_me"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NotificationSettingsRegisterMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RegisterPushSubscriptionPayload",
        "kind": "LinkedField",
        "name": "registerPushSubscription",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "me",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
                  (v2/*: any*/),
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lastSeenAt",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3c3b6c80571d4269e61b845e0beb4c05",
    "id": null,
    "metadata": {},
    "name": "NotificationSettingsRegisterMutation",
    "operationKind": "mutation",
    "text": "mutation NotificationSettingsRegisterMutation(\n  $input: RegisterPushSubscriptionInput!\n) {\n  registerPushSubscription(input: $input) {\n    pushSubscription {\n      id\n    }\n    me {\n      ...NotificationSettings_me\n      id\n    }\n  }\n}\n\nfragment NotificationSettings_me on User {\n  id\n  morningReminderEnabled\n  pushSubscriptions {\n    id\n    endpoint\n    platform\n    createdAt\n    lastSeenAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "83c79521b4a914ecb5d2d56395a1c885";

export default node;
