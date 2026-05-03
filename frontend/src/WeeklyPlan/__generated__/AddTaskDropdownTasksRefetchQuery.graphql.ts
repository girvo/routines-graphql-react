/**
 * @generated SignedSource<<555894844a67713a010348668e076941>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddTaskDropdownTasksRefetchQuery$variables = {
  titleSearch?: string | null | undefined;
};
export type AddTaskDropdownTasksRefetchQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AddTaskDropdown_query">;
};
export type AddTaskDropdownTasksRefetchQuery = {
  response: AddTaskDropdownTasksRefetchQuery$data;
  variables: AddTaskDropdownTasksRefetchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "titleSearch"
  }
],
v1 = {
  "kind": "Variable",
  "name": "titleSearch",
  "variableName": "titleSearch"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddTaskDropdownTasksRefetchQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "AddTaskDropdown_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddTaskDropdownTasksRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 5
          },
          (v1/*: any*/)
        ],
        "concreteType": "TaskConnection",
        "kind": "LinkedField",
        "name": "tasks",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TaskEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "icon",
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
    "cacheID": "18ab81d56effd295f881d3644462d670",
    "id": null,
    "metadata": {},
    "name": "AddTaskDropdownTasksRefetchQuery",
    "operationKind": "query",
    "text": "query AddTaskDropdownTasksRefetchQuery(\n  $titleSearch: String = null\n) {\n  ...AddTaskDropdown_query_3WkQrj\n}\n\nfragment AddTaskDropdown_query_3WkQrj on Query {\n  tasks(first: 5, titleSearch: $titleSearch) {\n    edges {\n      node {\n        id\n        title\n        icon\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "757065c9220c17b2c312c927367fb8f2";

export default node;
