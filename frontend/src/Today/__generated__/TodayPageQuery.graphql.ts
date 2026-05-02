/**
 * @generated SignedSource<<17a957aba120de79ab8e84bf3ba1a2c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DayOfWeek = "FRIDAY" | "MONDAY" | "SATURDAY" | "SUNDAY" | "THURSDAY" | "TUESDAY" | "WEDNESDAY" | "%future added value";
export type TodayPageQuery$variables = {
  date?: any | null | undefined;
};
export type TodayPageQuery$data = {
  readonly dailyRoutine: {
    readonly date: any;
    readonly dayOfWeek: DayOfWeek;
    readonly morning: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly __typename: "DailyTaskInstance";
        };
      }>;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "date",
        "variableName": "date"
      }
    ],
    "concreteType": "DailyRoutinePayload",
    "kind": "LinkedField",
    "name": "dailyRoutine",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "dayOfWeek",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "DailyTaskInstanceConnection",
        "kind": "LinkedField",
        "name": "morning",
        "plural": false,
        "selections": [
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
                    "kind": "ScalarField",
                    "name": "__typename",
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
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TodayPageQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a1218ea16f9ac545b3db892ca070b82a",
    "id": null,
    "metadata": {},
    "name": "TodayPageQuery",
    "operationKind": "query",
    "text": "query TodayPageQuery(\n  $date: DateTime\n) {\n  dailyRoutine(date: $date) {\n    date\n    dayOfWeek\n    morning {\n      edges {\n        node {\n          __typename\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2820f6d378b6df177a95d99ace1d550c";

export default node;
