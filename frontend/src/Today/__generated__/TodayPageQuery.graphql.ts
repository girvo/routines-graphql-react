/**
 * @generated SignedSource<<543ced7c2e281dede235b8a3cb956753>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DayOfWeek = "FRIDAY" | "MONDAY" | "SATURDAY" | "SUNDAY" | "THURSDAY" | "TUESDAY" | "WEDNESDAY" | "%future added value";
export type TodayPageQuery$variables = {
  date?: any | null | undefined;
};
export type TodayPageQuery$data = {
  readonly dailyRoutine: {
    readonly date: any;
    readonly dayOfWeek: DayOfWeek;
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayOfWeek",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v5 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "TodaySection_section"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
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
          {
            "alias": null,
            "args": null,
            "concreteType": "RoutineSlot",
            "kind": "LinkedField",
            "name": "routineSlot",
            "plural": false,
            "selections": [
              (v6/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "icon",
                    "storageKey": null
                  },
                  (v6/*: any*/)
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
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          (v6/*: any*/)
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
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "morning",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "morning(first:100)"
          },
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "midday",
            "plural": false,
            "selections": (v5/*: any*/),
            "storageKey": "midday(first:100)"
          },
          {
            "alias": null,
            "args": (v4/*: any*/),
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
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "morning",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": "morning(first:100)"
          },
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "midday",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": "midday(first:100)"
          },
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": "DailyTaskInstanceConnection",
            "kind": "LinkedField",
            "name": "evening",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": "evening(first:100)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "156115caa218098fd84ababbbc98fe99",
    "id": null,
    "metadata": {},
    "name": "TodayPageQuery",
    "operationKind": "query",
    "text": "query TodayPageQuery(\n  $date: DateTime\n) {\n  dailyRoutine(date: $date) {\n    date\n    dayOfWeek\n    morning(first: 100) {\n      ...TodaySection_section\n    }\n    midday(first: 100) {\n      ...TodaySection_section\n    }\n    evening(first: 100) {\n      ...TodaySection_section\n    }\n  }\n}\n\nfragment TodaySection_section on DailyTaskInstanceConnection {\n  edges {\n    node {\n      routineSlot {\n        id\n      }\n      completion {\n        id\n      }\n      ...TodayTaskRow\n      id\n    }\n  }\n}\n\nfragment TodayTaskRow on DailyTaskInstance {\n  id\n  routineSlot {\n    id\n    task {\n      title\n      icon\n      id\n    }\n  }\n  completion {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5bd8384dc118770526d89614df749706";

export default node;
