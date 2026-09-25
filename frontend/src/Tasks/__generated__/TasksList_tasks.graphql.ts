/**
 * @generated SignedSource<<afa11a83cf3e01645fa7008ba416d814>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TasksList_tasks$data = {
  readonly tasks: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly $updatableFragmentSpreads: FragmentRefs<"EditTask_task">;
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"Task_task">;
      };
    }>;
  };
  readonly " $fragmentType": "TasksList_tasks";
};
export type TasksList_tasks$key = {
  readonly " $data"?: TasksList_tasks$data;
  readonly " $fragmentSpreads": FragmentRefs<"TasksList_tasks">;
};

import TasksListPaginationQuery_graphql from './TasksListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "tasks"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": 20,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "titleSearch"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": TasksListPaginationQuery_graphql
    }
  },
  "name": "TasksList_tasks",
  "selections": [
    {
      "alias": "tasks",
      "args": [
        {
          "kind": "Variable",
          "name": "titleSearch",
          "variableName": "titleSearch"
        }
      ],
      "concreteType": "TaskConnection",
      "kind": "LinkedField",
      "name": "__TasksList_tasks_connection",
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
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "Task_task"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "EditTask_task"
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "ClientExtension",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__id",
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "2c49fc71f16dba3db9f1d984d382d5e4";

export default node;
