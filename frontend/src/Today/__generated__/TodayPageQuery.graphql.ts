/**
 * @generated SignedSource<<c65f00b8a7161130f4661f1f551011fe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodayPageQuery$variables = {
  date?: string | null | undefined;
};
export type TodayPageQuery$data = {
  readonly dailyRoutine: {
    readonly evening: {
      readonly " $fragmentSpreads": FragmentRefs<"TodaySection_section">;
    };
    readonly midday: {
      readonly " $fragmentSpreads": FragmentRefs<"TodaySection_section">;
    };
    readonly morning: {
      readonly " $fragmentSpreads": FragmentRefs<"TodaySection_section">;
    };
  };
};
export type TodayPageQuery = {
  response: TodayPageQuery$data;
  variables: TodayPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "date"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "date",
    "variableName": "date"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v3 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "TodaySection_section"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "DailyTaskInstanceEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "DailyTaskInstance",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TaskCompletion",
            "kind": "LinkedField",
            "name": "completion",
            "plural": false,
            "selections": [
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "RoutineSlot",
            "kind": "LinkedField",
            "name": "routineSlot",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "task",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TodayPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DailyRoutinePayload",
        "kind": "LinkedField",
        "name": "dailyRoutine",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "morning",
            "plural": false,
            "selections": (v3/*: any*/),
            "storageKey": "morning(first:100)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "midday",
            "plural": false,
            "selections": (v3/*: any*/),
            "storageKey": "midday(first:100)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "evening",
            "plural": false,
            "selections": (v3/*: any*/),
            "storageKey": "evening(first:100)"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodayPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DailyRoutinePayload",
        "kind": "LinkedField",
        "name": "dailyRoutine",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "morning",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "morning(first:100)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "midday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "midday(first:100)"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "evening",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "evening(first:100)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a2d28045f91df2bc53c7410b932725fa",
    "id": null,
    "metadata": {},
    "name": "TodayPageQuery",
    "operationKind": "query",
    "text": "query TodayPageQuery(\n  $date: DateTime\n) {\n  dailyRoutine(date: $date) {\n    morning(first: 100) {\n      ...TodaySection_section\n    }\n    midday(first: 100) {\n      ...TodaySection_section\n    }\n    evening(first: 100) {\n      ...TodaySection_section\n    }\n  }\n}\n\nfragment TodaySection_section on DailyTaskInstanceConnection {\n  edges {\n    node {\n      id\n      completion {\n        id\n      }\n      ...TodayTaskRow_instance\n    }\n  }\n}\n\nfragment TodayTaskRow_instance on DailyTaskInstance {\n  id\n  routineSlot {\n    id\n    task {\n      id\n      title\n      icon\n    }\n  }\n  completion {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1b19eeb8027511d36164303cf0a8bf94";

export default node;
