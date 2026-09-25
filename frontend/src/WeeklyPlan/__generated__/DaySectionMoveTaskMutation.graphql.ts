/**
 * @generated SignedSource<<62c0819114c6833fac40fdfb180455fd>>
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
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
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
          {
            "alias": null,
            "args": null,
            "concreteType": "DaySectionSlots",
            "kind": "LinkedField",
            "name": "section",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v2/*: any*/),
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
                      (v3/*: any*/),
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
                          (v3/*: any*/),
                          (v4/*: any*/),
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
                              (v4/*: any*/),
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
                  }
                ],
                "storageKey": "slots(first:100)"
              },
              {
                "alias": null,
                "args": (v2/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "DaySection_slots",
                "kind": "LinkedHandle",
                "name": "slots"
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fc62f546f51d318aad54b44a050e4aa1",
    "id": null,
    "metadata": {},
    "name": "DaySectionMoveTaskMutation",
    "operationKind": "mutation",
    "text": "mutation DaySectionMoveTaskMutation(\n  $input: MoveRoutineSlotInput!\n) {\n  moveRoutineSlot(input: $input) {\n    section {\n      ...DaySection_section\n      id\n    }\n  }\n}\n\nfragment DaySection_section on DaySectionSlots {\n  slots(first: 100) {\n    edges {\n      __typename\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...WeeklyPlanRoutineSection_section\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      task {\n        title\n        id\n      }\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a726d31606745f7585f7b4e996e5ab18";

export default node;
