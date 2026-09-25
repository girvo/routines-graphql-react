/**
 * @generated SignedSource<<3ad6f78f8b13aee59b30b8d1ff58bdf2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AppShellQuery$variables = Record<PropertyKey, never>;
export type AppShellQuery$data = {
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"DesktopSidebar_me">;
  };
};
export type AppShellQuery = {
  response: AppShellQuery$data;
  variables: AppShellQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppShellQuery",
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
            "name": "DesktopSidebar_me"
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
    "name": "AppShellQuery",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d36b4e2e67b4f74edf614b9e87feb7b6",
    "id": null,
    "metadata": {},
    "name": "AppShellQuery",
    "operationKind": "query",
    "text": "query AppShellQuery {\n  me {\n    ...DesktopSidebar_me\n    id\n  }\n}\n\nfragment DesktopSidebar_me on User {\n  name\n  email\n  initials\n}\n"
  }
};

(node as any).hash = "66e2ebc7af3bda207963585d0f2e6474";

export default node;
