/**
 * @generated SignedSource<<ff29f257d3aa03f5b7914d7f2a9e256b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DesktopSidebarStoryQuery$variables = Record<PropertyKey, never>;
export type DesktopSidebarStoryQuery$data = {
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"DesktopSidebar_me">;
  };
};
export type DesktopSidebarStoryQuery = {
  response: DesktopSidebarStoryQuery$data;
  variables: DesktopSidebarStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DesktopSidebarStoryQuery",
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
    "name": "DesktopSidebarStoryQuery",
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
    "cacheID": "21f2f30f751e1c914df1a015d531c65a",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "User"
        },
        "me.email": (v0/*: any*/),
        "me.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "me.initials": (v0/*: any*/),
        "me.name": (v0/*: any*/)
      }
    },
    "name": "DesktopSidebarStoryQuery",
    "operationKind": "query",
    "text": "query DesktopSidebarStoryQuery {\n  me {\n    ...DesktopSidebar_me\n    id\n  }\n}\n\nfragment DesktopSidebar_me on User {\n  name\n  email\n  initials\n}\n"
  }
};
})();

(node as any).hash = "e58d8ed2db7739b133c2660ed17137dd";

export default node;
