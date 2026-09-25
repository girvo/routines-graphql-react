/**
 * @generated SignedSource<<cb95b8481ffd8d6ab918d017388f25dd>>
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
    "cacheID": "b2642a5786a6a6d1442fbc2add978d78",
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
    "text": "query NotificationSettingsStoryQuery {\n  me {\n    ...NotificationSettings_me\n    id\n  }\n}\n\nfragment NotificationSettings_me on User {\n  id\n  morningReminderEnabled\n  pushSubscriptions {\n    id\n    endpoint\n    platform\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "c7b0b3f0920b6d70475eed31d2767420";

export default node;
