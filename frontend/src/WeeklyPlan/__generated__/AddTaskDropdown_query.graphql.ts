/**
 * @generated SignedSource<<cc5f3406403bcad2470ee0221af157dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddTaskDropdown_query$data = {
  readonly tasks: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly icon: string | null | undefined;
        readonly id: string;
        readonly title: string;
      };
    }>;
  };
  readonly " $fragmentType": "AddTaskDropdown_query";
};
export type AddTaskDropdown_query$key = {
  readonly " $data"?: AddTaskDropdown_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddTaskDropdown_query">;
};

import AddTaskDropdownTasksRefetchQuery_graphql from './AddTaskDropdownTasksRefetchQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "titleSearch"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [],
      "operation": AddTaskDropdownTasksRefetchQuery_graphql
    }
  },
  "name": "AddTaskDropdown_query",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        },
        {
          "kind": "Variable",
          "name": "titleSearch",
          "variableName": "titleSearch"
        }
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
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "757065c9220c17b2c312c927367fb8f2";

export default node;
