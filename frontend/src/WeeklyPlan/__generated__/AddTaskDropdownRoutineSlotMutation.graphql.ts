/**
 * @generated SignedSource<<2bbfcc60819eb98d122dc3d138ad0d28>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DayOfWeek = "FRIDAY" | "MONDAY" | "SATURDAY" | "SUNDAY" | "THURSDAY" | "TUESDAY" | "WEDNESDAY" | "%future added value";
export type DaySection = "EVENING" | "MIDDAY" | "MORNING" | "%future added value";
export type AddTaskDropdownRoutineSlotMutation$variables = {
  connections: ReadonlyArray<string>;
  dayOfWeek: DayOfWeek;
  daySection: DaySection;
  taskId: string;
};
export type AddTaskDropdownRoutineSlotMutation$data = {
  readonly createRoutineSlot: {
    readonly routineSlotEdge: {
      readonly node: {
        readonly section: DaySection;
        readonly task: {
          readonly title: string;
        };
        readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem_routineSlot">;
      };
    };
  } | null | undefined;
};
export type AddTaskDropdownRoutineSlotMutation$rawResponse = {
  readonly createRoutineSlot: {
    readonly routineSlotEdge: {
      readonly node: {
        readonly id: string;
        readonly section: DaySection;
        readonly task: {
          readonly icon: string | null | undefined;
          readonly id: string;
          readonly title: string;
        };
      };
    };
  } | null | undefined;
};
export type AddTaskDropdownRoutineSlotMutation = {
  rawResponse: AddTaskDropdownRoutineSlotMutation$rawResponse;
  response: AddTaskDropdownRoutineSlotMutation$data;
  variables: AddTaskDropdownRoutineSlotMutation$variables;
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
  "name": "dayOfWeek"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "daySection"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "taskId"
},
v4 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "dayOfWeek",
        "variableName": "dayOfWeek"
      },
      {
        "kind": "Variable",
        "name": "section",
        "variableName": "daySection"
      },
      {
        "kind": "Variable",
        "name": "taskId",
        "variableName": "taskId"
      }
    ],
    "kind": "ObjectValue",
    "name": "input"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "section",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v7 = {
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
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AddTaskDropdownRoutineSlotMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "CreateRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "createRoutineSlot",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "RoutineSlotEdge",
            "kind": "LinkedField",
            "name": "routineSlotEdge",
            "plural": false,
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
                    "concreteType": "Task",
                    "kind": "LinkedField",
                    "name": "task",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "RoutineSlotItem_routineSlot"
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
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AddTaskDropdownRoutineSlotMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "CreateRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "createRoutineSlot",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "RoutineSlotEdge",
            "kind": "LinkedField",
            "name": "routineSlotEdge",
            "plural": false,
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
                    "concreteType": "Task",
                    "kind": "LinkedField",
                    "name": "task",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "icon",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v7/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "routineSlotEdge",
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
    "cacheID": "05e76000a9b41bb45f204730fd8e14e5",
    "id": null,
    "metadata": {},
    "name": "AddTaskDropdownRoutineSlotMutation",
    "operationKind": "mutation",
    "text": "mutation AddTaskDropdownRoutineSlotMutation(\n  $taskId: ID!\n  $dayOfWeek: DayOfWeek!\n  $daySection: DaySection!\n) {\n  createRoutineSlot(input: {taskId: $taskId, dayOfWeek: $dayOfWeek, section: $daySection}) {\n    routineSlotEdge {\n      node {\n        section\n        task {\n          title\n          id\n        }\n        ...RoutineSlotItem_routineSlot\n        id\n      }\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  task {\n    id\n    title\n    icon\n  }\n}\n"
  }
};
})();

(node as any).hash = "b1eaa8df5a8346919e2e382c1cb3d0f9";

export default node;
