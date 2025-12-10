/**
 * @generated SignedSource<<48ef283e6b57f2a533c61fd8a92d27d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HelloMyCoolQuery$variables = Record<PropertyKey, never>;
export type HelloMyCoolQuery$data = {
  readonly hello: string;
  readonly me: {
    readonly id: string;
  };
};
export type HelloMyCoolQuery = {
  response: HelloMyCoolQuery$data;
  variables: HelloMyCoolQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "hello",
    "storageKey": null
  },
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
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "HelloMyCoolQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "HelloMyCoolQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2af1ac07f6612b5d922321ed3f47f2cc",
    "id": null,
    "metadata": {},
    "name": "HelloMyCoolQuery",
    "operationKind": "query",
    "text": "query HelloMyCoolQuery {\n  hello\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "cff39c493d819a8f8f43e5d6e13fd625";

export default node;
