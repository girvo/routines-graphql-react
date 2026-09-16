/**
 * @generated SignedSource<<79d270a463f104eb089c2aa236d0a163>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NotificationSettingsRemoveMutation$variables = {
  endpoint: string;
};
export type NotificationSettingsRemoveMutation$data = {
  readonly removePushSubscription: {
    readonly deletedId: string;
    readonly me: {
      readonly " $fragmentSpreads": FragmentRefs<"NotificationSettings_me">;
    };
  } | null | undefined;
};
export type NotificationSettingsRemoveMutation = {
  response: NotificationSettingsRemoveMutation$data;
  variables: NotificationSettingsRemoveMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "endpoint"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "endpoint",
    "variableName": "endpoint"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NotificationSettingsRemoveMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemovePushSubscriptionPayload",
        "kind": "LinkedField",
        "name": "removePushSubscription",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "name": "NotificationSettingsRemoveMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemovePushSubscriptionPayload",
        "kind": "LinkedField",
        "name": "removePushSubscription",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteRecord",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedId"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "me",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
                  (v3/*: any*/),
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
    "cacheID": "835a0ac51303234bc017f901289aefab",
    "id": null,
    "metadata": {},
    "name": "NotificationSettingsRemoveMutation",
    "operationKind": "mutation",
    "text": "mutation NotificationSettingsRemoveMutation(\n  $endpoint: String!\n) {\n  removePushSubscription(endpoint: $endpoint) {\n    deletedId\n    me {\n      ...NotificationSettings_me\n      id\n    }\n  }\n}\n\nfragment NotificationSettings_me on User {\n  id\n  morningReminderEnabled\n  pushSubscriptions {\n    id\n    endpoint\n    platform\n    createdAt\n    lastSeenAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "fb4717e8ab665890e0dc2b25749f8aa2";

export default node;
