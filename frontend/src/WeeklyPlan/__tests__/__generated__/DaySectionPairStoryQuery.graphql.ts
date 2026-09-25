/**
 * @generated SignedSource<<e7f757f0a5116d77b53d1c6d8d349e89>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DaySectionPairStoryQuery$variables = Record<PropertyKey, never>;
export type DaySectionPairStoryQuery$data = {
  readonly midday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly morning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
};
export type DaySectionPairStoryQuery = {
  response: DaySectionPairStoryQuery$data;
  variables: DaySectionPairStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "MONDAY"
},
v1 = [
  (v0/*: any*/),
  {
    "kind": "Literal",
    "name": "section",
    "value": "MORNING"
  }
],
v2 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "DaySection_section"
  }
],
v3 = [
  (v0/*: any*/),
  {
    "kind": "Literal",
    "name": "section",
    "value": "MIDDAY"
  }
],
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
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
    "args": (v4/*: any*/),
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
          (v5/*: any*/),
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
                  (v6/*: any*/),
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
    "args": (v4/*: any*/),
    "filters": null,
    "handle": "connection",
    "key": "DaySection_slots",
    "kind": "LinkedHandle",
    "name": "slots"
  },
  (v6/*: any*/)
],
v8 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "DaySectionSlots"
},
v9 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "RoutineSlotConnection"
},
v11 = {
  "enumValues": null,
  "nullable": false,
  "plural": true,
  "type": "RoutineSlotEdge"
},
v12 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v13 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "RoutineSlot"
},
v14 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Task"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v16 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "PageInfo"
},
v17 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DaySectionPairStoryQuery",
    "selections": [
      {
        "alias": "morning",
        "args": (v1/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
      },
      {
        "alias": "midday",
        "args": (v3/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MIDDAY\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DaySectionPairStoryQuery",
    "selections": [
      {
        "alias": "morning",
        "args": (v1/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v7/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
      },
      {
        "alias": "midday",
        "args": (v3/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v7/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MIDDAY\")"
      }
    ]
  },
  "params": {
    "cacheID": "5ffdc3f4832918d499de6be6cf3e3931",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "midday": (v8/*: any*/),
        "midday.id": (v9/*: any*/),
        "midday.slots": (v10/*: any*/),
        "midday.slots.__id": (v9/*: any*/),
        "midday.slots.edges": (v11/*: any*/),
        "midday.slots.edges.__typename": (v12/*: any*/),
        "midday.slots.edges.cursor": (v12/*: any*/),
        "midday.slots.edges.node": (v13/*: any*/),
        "midday.slots.edges.node.__typename": (v12/*: any*/),
        "midday.slots.edges.node.id": (v9/*: any*/),
        "midday.slots.edges.node.task": (v14/*: any*/),
        "midday.slots.edges.node.task.icon": (v15/*: any*/),
        "midday.slots.edges.node.task.id": (v9/*: any*/),
        "midday.slots.edges.node.task.title": (v12/*: any*/),
        "midday.slots.pageInfo": (v16/*: any*/),
        "midday.slots.pageInfo.endCursor": (v15/*: any*/),
        "midday.slots.pageInfo.hasNextPage": (v17/*: any*/),
        "morning": (v8/*: any*/),
        "morning.id": (v9/*: any*/),
        "morning.slots": (v10/*: any*/),
        "morning.slots.__id": (v9/*: any*/),
        "morning.slots.edges": (v11/*: any*/),
        "morning.slots.edges.__typename": (v12/*: any*/),
        "morning.slots.edges.cursor": (v12/*: any*/),
        "morning.slots.edges.node": (v13/*: any*/),
        "morning.slots.edges.node.__typename": (v12/*: any*/),
        "morning.slots.edges.node.id": (v9/*: any*/),
        "morning.slots.edges.node.task": (v14/*: any*/),
        "morning.slots.edges.node.task.icon": (v15/*: any*/),
        "morning.slots.edges.node.task.id": (v9/*: any*/),
        "morning.slots.edges.node.task.title": (v12/*: any*/),
        "morning.slots.pageInfo": (v16/*: any*/),
        "morning.slots.pageInfo.endCursor": (v15/*: any*/),
        "morning.slots.pageInfo.hasNextPage": (v17/*: any*/)
      }
    },
    "name": "DaySectionPairStoryQuery",
    "operationKind": "query",
    "text": "query DaySectionPairStoryQuery {\n  morning: daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  midday: daySectionSlots(dayOfWeek: MONDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n}\n\nfragment DaySection_section on DaySectionSlots {\n  slots(first: 100) {\n    edges {\n      __typename\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    ...WeeklyPlanRoutineSection_section\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      task {\n        title\n        id\n      }\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "213db32d181c29cb7d701ee1c587971b";

export default node;
