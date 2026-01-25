/**
 * @generated SignedSource<<1ad043a1343c97f46df91c13cecb6320>>
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
  readonly " $fragmentSpreads": FragmentRefs<"AddTaskDropdownTasksFragment">;
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
        "name": "AddTaskDropdownTasksFragment"
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
    "cacheID": "4d49ec2a29f074cfaf4256aba917ce1b",
    "id": null,
    "metadata": {},
    "name": "AddTaskDropdownTasksRefetchQuery",
    "operationKind": "query",
    "text": "query AddTaskDropdownTasksRefetchQuery(\n  $titleSearch: String = null\n) {\n  ...AddTaskDropdownTasksFragment_3WkQrj\n}\n\nfragment AddTaskDropdownTasksFragment_3WkQrj on Query {\n  tasks(first: 5, titleSearch: $titleSearch) {\n    edges {\n      node {\n        id\n        title\n        icon\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "69ab2859893e1d78eb59b3a1c8a7435e";

export default node;
