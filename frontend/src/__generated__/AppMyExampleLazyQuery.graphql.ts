/**
 * @generated SignedSource<<da1c7cd5e8e3f44c7d7d103b9a3e1a5c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AppMyExampleLazyQuery$variables = Record<PropertyKey, never>;
export type AppMyExampleLazyQuery$data = {
  readonly hello: string;
};
export type AppMyExampleLazyQuery = {
  response: AppMyExampleLazyQuery$data;
  variables: AppMyExampleLazyQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "hello",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppMyExampleLazyQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppMyExampleLazyQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2d4a044568c6b57c0021efe9e7342c3d",
    "id": null,
    "metadata": {},
    "name": "AppMyExampleLazyQuery",
    "operationKind": "query",
    "text": "query AppMyExampleLazyQuery {\n  hello\n}\n"
  }
};
})();

(node as any).hash = "dd1c8b1a1de13a87d95c857936bca122";

export default node;
