/**
 * @generated SignedSource<<be3797613df968ef18ad4fdb3185cebe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
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
      readonly cursor: string;
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
  "name": "id",
  "storageKey": null
},
v6 = {
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
      "kind": "ScalarField",
      "name": "cursor",
      "storageKey": null
    },
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
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Task",
          "kind": "LinkedField",
          "name": "task",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "title",
              "storageKey": null
            },
            (v5/*: any*/),
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
          (v6/*: any*/)
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
          (v6/*: any*/),
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
    "cacheID": "ecc7a6521f7adad2f4b4f7477bd6291a",
    "id": null,
    "metadata": {},
    "name": "AddTaskDropdownRoutineSlotMutation",
    "operationKind": "mutation",
    "text": "mutation AddTaskDropdownRoutineSlotMutation(\n  $taskId: ID!\n  $dayOfWeek: DayOfWeek!\n  $daySection: DaySection!\n) {\n  createRoutineSlot(input: {taskId: $taskId, dayOfWeek: $dayOfWeek, section: $daySection}) {\n    routineSlotEdge {\n      cursor\n      node {\n        id\n        section\n        task {\n          title\n          id\n          icon\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a998d8b85e0f02ce9ec158c42c0ad21f";

export default node;
