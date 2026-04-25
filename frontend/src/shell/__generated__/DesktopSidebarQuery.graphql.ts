/**
 * @generated SignedSource<<2ce6d154c326bb0a2bcebc08f02d9b76>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DesktopSidebarQuery$variables = Record<PropertyKey, never>;
export type DesktopSidebarQuery$data = {
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"DesktopSidebar_me">;
  };
};
export type DesktopSidebarQuery = {
  response: DesktopSidebarQuery$data;
  variables: DesktopSidebarQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DesktopSidebarQuery",
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
    "name": "DesktopSidebarQuery",
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
    "cacheID": "bdaa44ac6263d8d9ff4b9bad8357fd67",
    "id": null,
    "metadata": {},
    "name": "DesktopSidebarQuery",
    "operationKind": "query",
    "text": "query DesktopSidebarQuery {\n  me {\n    ...DesktopSidebar_me\n    id\n  }\n}\n\nfragment DesktopSidebar_me on User {\n  name\n  email\n  initials\n}\n"
  }
};

(node as any).hash = "6ad3d9a8845d98b57bb17209ca3f6582";

export default node;
