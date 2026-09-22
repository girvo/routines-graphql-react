/**
 * @generated SignedSource<<0e083c7401c2520fb0b17c5ab3304b8b>>
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
],
v7 = [
  (v4/*: any*/),
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
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
              },
              (v5/*: any*/)
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
v8 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "DaySectionSlots"
},
v9 = {
  "enumValues": [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ],
  "nullable": false,
  "plural": false,
  "type": "DayOfWeek"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v11 = {
  "enumValues": [
    "MORNING",
    "MIDDAY",
    "EVENING"
  ],
  "nullable": false,
  "plural": false,
  "type": "DaySection"
},
v12 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "RoutineSlotConnection"
},
v13 = {
  "enumValues": null,
  "nullable": false,
  "plural": true,
  "type": "RoutineSlotEdge"
},
v14 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v15 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "RoutineSlot"
},
v16 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Task"
},
v17 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v18 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "PageInfo"
},
v19 = {
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
    "cacheID": "17cf1ee52908c10add7bfa491758fdce",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "midday": (v8/*: any*/),
        "midday.dayOfWeek": (v9/*: any*/),
        "midday.id": (v10/*: any*/),
        "midday.section": (v11/*: any*/),
        "midday.slots": (v12/*: any*/),
        "midday.slots.__id": (v10/*: any*/),
        "midday.slots.edges": (v13/*: any*/),
        "midday.slots.edges.cursor": (v14/*: any*/),
        "midday.slots.edges.node": (v15/*: any*/),
        "midday.slots.edges.node.__typename": (v14/*: any*/),
        "midday.slots.edges.node.dayOfWeek": (v9/*: any*/),
        "midday.slots.edges.node.id": (v10/*: any*/),
        "midday.slots.edges.node.task": (v16/*: any*/),
        "midday.slots.edges.node.task.icon": (v17/*: any*/),
        "midday.slots.edges.node.task.id": (v10/*: any*/),
        "midday.slots.edges.node.task.title": (v14/*: any*/),
        "midday.slots.pageInfo": (v18/*: any*/),
        "midday.slots.pageInfo.endCursor": (v17/*: any*/),
        "midday.slots.pageInfo.hasNextPage": (v19/*: any*/),
        "morning": (v8/*: any*/),
        "morning.dayOfWeek": (v9/*: any*/),
        "morning.id": (v10/*: any*/),
        "morning.section": (v11/*: any*/),
        "morning.slots": (v12/*: any*/),
        "morning.slots.__id": (v10/*: any*/),
        "morning.slots.edges": (v13/*: any*/),
        "morning.slots.edges.cursor": (v14/*: any*/),
        "morning.slots.edges.node": (v15/*: any*/),
        "morning.slots.edges.node.__typename": (v14/*: any*/),
        "morning.slots.edges.node.dayOfWeek": (v9/*: any*/),
        "morning.slots.edges.node.id": (v10/*: any*/),
        "morning.slots.edges.node.task": (v16/*: any*/),
        "morning.slots.edges.node.task.icon": (v17/*: any*/),
        "morning.slots.edges.node.task.id": (v10/*: any*/),
        "morning.slots.edges.node.task.title": (v14/*: any*/),
        "morning.slots.pageInfo": (v18/*: any*/),
        "morning.slots.pageInfo.endCursor": (v17/*: any*/),
        "morning.slots.pageInfo.hasNextPage": (v19/*: any*/)
      }
    },
    "name": "DaySectionPairStoryQuery",
    "operationKind": "query",
    "text": "query DaySectionPairStoryQuery {\n  morning: daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  midday: daySectionSlots(dayOfWeek: MONDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n}\n\nfragment DaySection_section on DaySectionSlots {\n  id\n  dayOfWeek\n  section\n  slots(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    ...WeeklyPlanRoutineSection_section\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  dayOfWeek\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      task {\n        title\n        id\n      }\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "213db32d181c29cb7d701ee1c587971b";

export default node;
