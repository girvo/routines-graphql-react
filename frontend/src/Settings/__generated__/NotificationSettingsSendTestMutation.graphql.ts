/**
 * @generated SignedSource<<43a1932b676bcfefaca5e89d562c9117>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NotificationSettingsSendTestMutation$variables = {
  endpoint: string;
};
export type NotificationSettingsSendTestMutation$data = {
  readonly sendTestPush: {
    readonly deletedId: string | null | undefined;
    readonly delivered: boolean;
    readonly me: {
      readonly " $fragmentSpreads": FragmentRefs<"NotificationSettings_me">;
    };
    readonly message: string;
  } | null | undefined;
};
export type NotificationSettingsSendTestMutation = {
  response: NotificationSettingsSendTestMutation$data;
  variables: NotificationSettingsSendTestMutation$variables;
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
  "name": "delivered",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedId",
  "storageKey": null
},
v5 = {
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
    "name": "NotificationSettingsSendTestMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SendTestPushPayload",
        "kind": "LinkedField",
        "name": "sendTestPush",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
    "name": "NotificationSettingsSendTestMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SendTestPushPayload",
        "kind": "LinkedField",
        "name": "sendTestPush",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
              (v5/*: any*/),
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
                  (v5/*: any*/),
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f6928ddb4ac4656987481780dabfbe7f",
    "id": null,
    "metadata": {},
    "name": "NotificationSettingsSendTestMutation",
    "operationKind": "mutation",
    "text": "mutation NotificationSettingsSendTestMutation(\n  $endpoint: String!\n) {\n  sendTestPush(endpoint: $endpoint) {\n    delivered\n    message\n    deletedId\n    me {\n      ...NotificationSettings_me\n      id\n    }\n  }\n}\n\nfragment NotificationSettings_me on User {\n  id\n  morningReminderEnabled\n  pushSubscriptions {\n    id\n    endpoint\n    platform\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "0ad014dc869eae7cb66405ed6f4344cf";

export default node;
