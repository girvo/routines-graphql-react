/**
 * @generated SignedSource<<fc96cbf174a661f54383a7d1992d745a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NotificationSettingsStoryQuery$variables = Record<PropertyKey, never>;
export type NotificationSettingsStoryQuery$data = {
  readonly me: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"NotificationSettings_me">;
  };
};
export type NotificationSettingsStoryQuery = {
  response: NotificationSettingsStoryQuery$data;
  variables: NotificationSettingsStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "NotificationSettingsStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "NotificationSettings_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "NotificationSettingsStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
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
    ]
  },
  "params": {
    "cacheID": "ed46aee79eb441d31ad7be5a097e124d",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "User"
        },
        "me.id": (v1/*: any*/),
        "me.morningReminderEnabled": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.pushSubscriptions": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "PushSubscription"
        },
        "me.pushSubscriptions.createdAt": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "DateTime"
        },
        "me.pushSubscriptions.endpoint": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "String"
        },
        "me.pushSubscriptions.id": (v1/*: any*/),
        "me.pushSubscriptions.lastSeenAt": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "DateTime"
        },
        "me.pushSubscriptions.platform": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        }
      }
    },
    "name": "NotificationSettingsStoryQuery",
    "operationKind": "query",
    "text": "query NotificationSettingsStoryQuery {\n  me {\n    id\n    ...NotificationSettings_me\n  }\n}\n\nfragment NotificationSettings_me on User {\n  id\n  morningReminderEnabled\n  pushSubscriptions {\n    id\n    endpoint\n    platform\n    createdAt\n    lastSeenAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "a7bdcc7d73f155742a6dada737ad5c0b";

export default node;
