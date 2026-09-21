/**
 * @generated SignedSource<<e49bb45614b72ec2ec914a06765211c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SlotMoveDestination = "BOTTOM" | "TOP" | "%future added value";
export type MoveRoutineSlotInput = {
  afterRoutineSlotId?: string | null | undefined;
  beforeRoutineSlotId?: string | null | undefined;
  routineSlotId: string;
  to?: SlotMoveDestination | null | undefined;
};
export type DaySectionMoveTaskMutation$variables = {
  input: MoveRoutineSlotInput;
};
export type DaySectionMoveTaskMutation$data = {
  readonly moveRoutineSlot: {
    readonly movedRoutineSlotEdge: {
      readonly cursor: string;
      readonly node: {
        readonly id: string;
        readonly position: any;
      };
    };
    readonly section: {
      readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
    };
  } | null | undefined;
};
export type DaySectionMoveTaskMutation = {
  response: DaySectionMoveTaskMutation$data;
  variables: DaySectionMoveTaskMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "RoutineSlotEdge",
  "kind": "LinkedField",
  "name": "movedRoutineSlotEdge",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "RoutineSlot",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "position",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayOfWeek",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DaySectionMoveTaskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MoveRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "moveRoutineSlot",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySectionSlots",
            "kind": "LinkedField",
            "name": "section",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "DaySection_section"
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
    "name": "DaySectionMoveTaskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MoveRoutineSlotPayload",
        "kind": "LinkedField",
        "name": "moveRoutineSlot",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySectionSlots",
            "kind": "LinkedField",
            "name": "section",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
                "args": (v6/*: any*/),
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
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "RoutineSlot",
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
                          },
                          (v3/*: any*/),
                          (v5/*: any*/),
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
                "storageKey": "slots(first:100)"
              },
              {
                "alias": null,
                "args": (v6/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "DaySection_slots",
                "kind": "LinkedHandle",
                "name": "slots"
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
    "cacheID": "e093a5efe167ca9c9519bf53501c7b8b",
    "id": null,
    "metadata": {},
    "name": "DaySectionMoveTaskMutation",
    "operationKind": "mutation",
    "text": "mutation DaySectionMoveTaskMutation(\n  $input: MoveRoutineSlotInput!\n) {\n  moveRoutineSlot(input: $input) {\n    movedRoutineSlotEdge {\n      cursor\n      node {\n        id\n        position\n      }\n    }\n    section {\n      ...DaySection_section\n      id\n    }\n  }\n}\n\nfragment DaySection_section on DaySectionSlots {\n  id\n  dayOfWeek\n  section\n  slots(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    ...WeeklyPlanRoutineSection_section\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  dayOfWeek\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "515225a5ecf1e8a16cf57d3b8fe332ff";

export default node;
