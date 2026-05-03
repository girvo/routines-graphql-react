/**
 * @generated SignedSource<<dabcf4d313097bee58a1abc32a0d7191>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DaySection = "EVENING" | "MIDDAY" | "MORNING" | "%future added value";
export type CreateTaskMutation$variables = {
  connections: ReadonlyArray<string>;
  icon?: string | null | undefined;
  title: string;
};
export type CreateTaskMutation$data = {
  readonly createTask: {
    readonly taskEdge: {
      readonly cursor: string;
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"Task_task">;
      };
    };
  } | null | undefined;
};
export type CreateTaskMutation$rawResponse = {
  readonly createTask: {
    readonly taskEdge: {
      readonly cursor: string;
      readonly node: {
        readonly createdAt: any;
        readonly icon: string | null | undefined;
        readonly id: string;
        readonly slots: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly id: string;
              readonly section: DaySection;
            };
          }>;
        };
        readonly title: string;
      };
    };
  } | null | undefined;
};
export type CreateTaskMutation = {
  rawResponse: CreateTaskMutation$rawResponse;
  response: CreateTaskMutation$data;
  variables: CreateTaskMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "icon"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v3 = [
  {
    "kind": "Variable",
    "name": "icon",
    "variableName": "icon"
  },
  {
    "kind": "Variable",
    "name": "title",
    "variableName": "title"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateTaskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreateTaskPayload",
        "kind": "LinkedField",
        "name": "createTask",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TaskEdge",
            "kind": "LinkedField",
            "name": "taskEdge",
            "plural": false,
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "Task_task"
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateTaskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreateTaskPayload",
        "kind": "LinkedField",
        "name": "createTask",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TaskEdge",
            "kind": "LinkedField",
            "name": "taskEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 100
                      }
                    ],
                    "concreteType": "RoutineSlotConnection",
                    "kind": "LinkedField",
                    "name": "slots",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "RoutineSlotEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "RoutineSlot",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "section",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "slots(first:100)"
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "taskEdge",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "de0019b849b8d007e5aeb3f287e776d1",
    "id": null,
    "metadata": {},
    "name": "CreateTaskMutation",
    "operationKind": "mutation",
    "text": "mutation CreateTaskMutation(\n  $title: String!\n  $icon: String\n) {\n  createTask(icon: $icon, title: $title) {\n    taskEdge {\n      node {\n        ...Task_task\n        id\n      }\n      cursor\n    }\n  }\n}\n\nfragment Task_task on Task {\n  id\n  title\n  icon\n  createdAt\n  slots(first: 100) {\n    edges {\n      node {\n        id\n        section\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "30df2589dad68c2c3a6aabc092420994";

export default node;
