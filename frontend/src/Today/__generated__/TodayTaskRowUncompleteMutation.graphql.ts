/**
 * @generated SignedSource<<74a5216ffd404bdbc13e6caffbd73879>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodayTaskRowUncompleteMutation$variables = {
  dailyTaskInstanceId: string;
};
export type TodayTaskRowUncompleteMutation$data = {
  readonly uncompleteRoutineSlot: {
    readonly dailyTaskInstance: {
      readonly " $fragmentSpreads": FragmentRefs<"TodayTaskRow_instance">;
    };
    readonly deletedId: string;
  } | null | undefined;
};
export type TodayTaskRowUncompleteMutation$rawResponse = {
  readonly uncompleteRoutineSlot: {
    readonly dailyTaskInstance: {
      readonly completion: {
        readonly id: string;
      } | null | undefined;
      readonly id: string;
      readonly routineSlot: {
        readonly id: string;
        readonly task: {
          readonly icon: string | null | undefined;
          readonly id: string;
          readonly title: string;
        };
      };
    };
    readonly deletedId: string;
  } | null | undefined;
};
export type TodayTaskRowUncompleteMutation = {
  rawResponse: TodayTaskRowUncompleteMutation$rawResponse;
  response: TodayTaskRowUncompleteMutation$data;
  variables: TodayTaskRowUncompleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "dailyTaskInstanceId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "dailyTaskInstanceId",
    "variableName": "dailyTaskInstanceId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodayTaskRowUncompleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UncompleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "uncompleteRoutineSlot",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "DailyTaskInstance",
            "kind": "LinkedField",
            "name": "dailyTaskInstance",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TodayTaskRow_instance"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodayTaskRowUncompleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UncompleteRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "uncompleteRoutineSlot",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteRecord",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedId"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DailyTaskInstance",
            "kind": "LinkedField",
            "name": "dailyTaskInstance",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "RoutineSlot",
                "kind": "LinkedField",
                "name": "routineSlot",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Task",
                    "kind": "LinkedField",
                    "name": "task",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
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
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "TaskCompletion",
                "kind": "LinkedField",
                "name": "completion",
                "plural": false,
                "selections": [
                  (v3/*: any*/)
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
    "cacheID": "f4c9732f39a2a4055e5e1e4d89041cfd",
    "id": null,
    "metadata": {},
    "name": "TodayTaskRowUncompleteMutation",
    "operationKind": "mutation",
    "text": "mutation TodayTaskRowUncompleteMutation(\n  $dailyTaskInstanceId: ID!\n) {\n  uncompleteRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {\n    deletedId\n    dailyTaskInstance {\n      ...TodayTaskRow_instance\n      id\n    }\n  }\n}\n\nfragment TodayTaskRow_instance on DailyTaskInstance {\n  id\n  routineSlot {\n    id\n    task {\n      id\n      title\n      icon\n    }\n  }\n  completion {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "04a6bc2840ae0bf320b0e7bf88bc0db4";

export default node;
