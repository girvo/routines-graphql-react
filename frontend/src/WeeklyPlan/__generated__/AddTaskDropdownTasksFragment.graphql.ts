/**
 * @generated SignedSource<<9e75b0a4438dc72c146f9d61ade9f6a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddTaskDropdownTasksFragment$data = {
  readonly tasks: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly icon: string | null | undefined;
        readonly id: string;
        readonly title: string;
      };
    }>;
  };
  readonly " $fragmentType": "AddTaskDropdownTasksFragment";
};
export type AddTaskDropdownTasksFragment$key = {
  readonly " $data"?: AddTaskDropdownTasksFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddTaskDropdownTasksFragment">;
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
  "name": "AddTaskDropdownTasksFragment",
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

(node as any).hash = "69ab2859893e1d78eb59b3a1c8a7435e";

export default node;
