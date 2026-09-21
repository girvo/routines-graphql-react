/**
 * @generated SignedSource<<434c626523105bcff2afe36fe0c9a6e1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanPageQuery$variables = Record<PropertyKey, never>;
export type WeeklyPlanPageQuery$data = {
  readonly fridayEvening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly fridayMidday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly fridayMorning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly mondayEvening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly mondayMidday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly mondayMorning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly saturdayEvening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly saturdayMidday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly saturdayMorning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly sundayEvening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly sundayMidday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly sundayMorning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly thursdayEvening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly thursdayMidday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly thursdayMorning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly tuesdayEvening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly tuesdayMidday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly tuesdayMorning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly wednesdayEvening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly wednesdayMidday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly wednesdayMorning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
};
export type WeeklyPlanPageQuery = {
  response: WeeklyPlanPageQuery$data;
  variables: WeeklyPlanPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "MONDAY"
},
v1 = {
  "kind": "Literal",
  "name": "section",
  "value": "MORNING"
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
],
v3 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "DaySection_section"
  }
],
v4 = {
  "kind": "Literal",
  "name": "section",
  "value": "MIDDAY"
},
v5 = [
  (v0/*: any*/),
  (v4/*: any*/)
],
v6 = {
  "kind": "Literal",
  "name": "section",
  "value": "EVENING"
},
v7 = [
  (v0/*: any*/),
  (v6/*: any*/)
],
v8 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "TUESDAY"
},
v9 = [
  (v8/*: any*/),
  (v1/*: any*/)
],
v10 = [
  (v8/*: any*/),
  (v4/*: any*/)
],
v11 = [
  (v8/*: any*/),
  (v6/*: any*/)
],
v12 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "WEDNESDAY"
},
v13 = [
  (v12/*: any*/),
  (v1/*: any*/)
],
v14 = [
  (v12/*: any*/),
  (v4/*: any*/)
],
v15 = [
  (v12/*: any*/),
  (v6/*: any*/)
],
v16 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "THURSDAY"
},
v17 = [
  (v16/*: any*/),
  (v1/*: any*/)
],
v18 = [
  (v16/*: any*/),
  (v4/*: any*/)
],
v19 = [
  (v16/*: any*/),
  (v6/*: any*/)
],
v20 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "FRIDAY"
},
v21 = [
  (v20/*: any*/),
  (v1/*: any*/)
],
v22 = [
  (v20/*: any*/),
  (v4/*: any*/)
],
v23 = [
  (v20/*: any*/),
  (v6/*: any*/)
],
v24 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "SATURDAY"
},
v25 = [
  (v24/*: any*/),
  (v1/*: any*/)
],
v26 = [
  (v24/*: any*/),
  (v4/*: any*/)
],
v27 = [
  (v24/*: any*/),
  (v6/*: any*/)
],
v28 = {
  "kind": "Literal",
  "name": "dayOfWeek",
  "value": "SUNDAY"
},
v29 = [
  (v28/*: any*/),
  (v1/*: any*/)
],
v30 = [
  (v28/*: any*/),
  (v4/*: any*/)
],
v31 = [
  (v28/*: any*/),
  (v6/*: any*/)
],
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dayOfWeek",
  "storageKey": null
},
v34 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v35 = [
  (v32/*: any*/),
  (v33/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "section",
    "storageKey": null
  },
  {
    "alias": null,
    "args": (v34/*: any*/),
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
              (v32/*: any*/),
              (v33/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Task",
                "kind": "LinkedField",
                "name": "task",
                "plural": false,
                "selections": [
                  (v32/*: any*/),
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
    "args": (v34/*: any*/),
    "filters": null,
    "handle": "connection",
    "key": "DaySection_slots",
    "kind": "LinkedHandle",
    "name": "slots"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "WeeklyPlanPageQuery",
    "selections": [
      {
        "alias": "mondayMorning",
        "args": (v2/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
      },
      {
        "alias": "mondayMidday",
        "args": (v5/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "mondayEvening",
        "args": (v7/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"EVENING\")"
      },
      {
        "alias": "tuesdayMorning",
        "args": (v9/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"TUESDAY\",section:\"MORNING\")"
      },
      {
        "alias": "tuesdayMidday",
        "args": (v10/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"TUESDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "tuesdayEvening",
        "args": (v11/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"TUESDAY\",section:\"EVENING\")"
      },
      {
        "alias": "wednesdayMorning",
        "args": (v13/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"WEDNESDAY\",section:\"MORNING\")"
      },
      {
        "alias": "wednesdayMidday",
        "args": (v14/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"WEDNESDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "wednesdayEvening",
        "args": (v15/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"WEDNESDAY\",section:\"EVENING\")"
      },
      {
        "alias": "thursdayMorning",
        "args": (v17/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"THURSDAY\",section:\"MORNING\")"
      },
      {
        "alias": "thursdayMidday",
        "args": (v18/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"THURSDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "thursdayEvening",
        "args": (v19/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"THURSDAY\",section:\"EVENING\")"
      },
      {
        "alias": "fridayMorning",
        "args": (v21/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"FRIDAY\",section:\"MORNING\")"
      },
      {
        "alias": "fridayMidday",
        "args": (v22/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"FRIDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "fridayEvening",
        "args": (v23/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"FRIDAY\",section:\"EVENING\")"
      },
      {
        "alias": "saturdayMorning",
        "args": (v25/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SATURDAY\",section:\"MORNING\")"
      },
      {
        "alias": "saturdayMidday",
        "args": (v26/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SATURDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "saturdayEvening",
        "args": (v27/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SATURDAY\",section:\"EVENING\")"
      },
      {
        "alias": "sundayMorning",
        "args": (v29/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SUNDAY\",section:\"MORNING\")"
      },
      {
        "alias": "sundayMidday",
        "args": (v30/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SUNDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "sundayEvening",
        "args": (v31/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SUNDAY\",section:\"EVENING\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "WeeklyPlanPageQuery",
    "selections": [
      {
        "alias": "mondayMorning",
        "args": (v2/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MORNING\")"
      },
      {
        "alias": "mondayMidday",
        "args": (v5/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "mondayEvening",
        "args": (v7/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"MONDAY\",section:\"EVENING\")"
      },
      {
        "alias": "tuesdayMorning",
        "args": (v9/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"TUESDAY\",section:\"MORNING\")"
      },
      {
        "alias": "tuesdayMidday",
        "args": (v10/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"TUESDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "tuesdayEvening",
        "args": (v11/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"TUESDAY\",section:\"EVENING\")"
      },
      {
        "alias": "wednesdayMorning",
        "args": (v13/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"WEDNESDAY\",section:\"MORNING\")"
      },
      {
        "alias": "wednesdayMidday",
        "args": (v14/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"WEDNESDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "wednesdayEvening",
        "args": (v15/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"WEDNESDAY\",section:\"EVENING\")"
      },
      {
        "alias": "thursdayMorning",
        "args": (v17/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"THURSDAY\",section:\"MORNING\")"
      },
      {
        "alias": "thursdayMidday",
        "args": (v18/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"THURSDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "thursdayEvening",
        "args": (v19/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"THURSDAY\",section:\"EVENING\")"
      },
      {
        "alias": "fridayMorning",
        "args": (v21/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"FRIDAY\",section:\"MORNING\")"
      },
      {
        "alias": "fridayMidday",
        "args": (v22/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"FRIDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "fridayEvening",
        "args": (v23/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"FRIDAY\",section:\"EVENING\")"
      },
      {
        "alias": "saturdayMorning",
        "args": (v25/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SATURDAY\",section:\"MORNING\")"
      },
      {
        "alias": "saturdayMidday",
        "args": (v26/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SATURDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "saturdayEvening",
        "args": (v27/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SATURDAY\",section:\"EVENING\")"
      },
      {
        "alias": "sundayMorning",
        "args": (v29/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SUNDAY\",section:\"MORNING\")"
      },
      {
        "alias": "sundayMidday",
        "args": (v30/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SUNDAY\",section:\"MIDDAY\")"
      },
      {
        "alias": "sundayEvening",
        "args": (v31/*: any*/),
        "concreteType": "DaySectionSlots",
        "kind": "LinkedField",
        "name": "daySectionSlots",
        "plural": false,
        "selections": (v35/*: any*/),
        "storageKey": "daySectionSlots(dayOfWeek:\"SUNDAY\",section:\"EVENING\")"
      }
    ]
  },
  "params": {
    "cacheID": "d6b448d41d55c7fe9fadebc209a60ed8",
    "id": null,
    "metadata": {},
    "name": "WeeklyPlanPageQuery",
    "operationKind": "query",
    "text": "query WeeklyPlanPageQuery {\n  mondayMorning: daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  mondayMidday: daySectionSlots(dayOfWeek: MONDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  mondayEvening: daySectionSlots(dayOfWeek: MONDAY, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n  tuesdayMorning: daySectionSlots(dayOfWeek: TUESDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  tuesdayMidday: daySectionSlots(dayOfWeek: TUESDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  tuesdayEvening: daySectionSlots(dayOfWeek: TUESDAY, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n  wednesdayMorning: daySectionSlots(dayOfWeek: WEDNESDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  wednesdayMidday: daySectionSlots(dayOfWeek: WEDNESDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  wednesdayEvening: daySectionSlots(dayOfWeek: WEDNESDAY, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n  thursdayMorning: daySectionSlots(dayOfWeek: THURSDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  thursdayMidday: daySectionSlots(dayOfWeek: THURSDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  thursdayEvening: daySectionSlots(dayOfWeek: THURSDAY, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n  fridayMorning: daySectionSlots(dayOfWeek: FRIDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  fridayMidday: daySectionSlots(dayOfWeek: FRIDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  fridayEvening: daySectionSlots(dayOfWeek: FRIDAY, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n  saturdayMorning: daySectionSlots(dayOfWeek: SATURDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  saturdayMidday: daySectionSlots(dayOfWeek: SATURDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  saturdayEvening: daySectionSlots(dayOfWeek: SATURDAY, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n  sundayMorning: daySectionSlots(dayOfWeek: SUNDAY, section: MORNING) {\n    ...DaySection_section\n    id\n  }\n  sundayMidday: daySectionSlots(dayOfWeek: SUNDAY, section: MIDDAY) {\n    ...DaySection_section\n    id\n  }\n  sundayEvening: daySectionSlots(dayOfWeek: SUNDAY, section: EVENING) {\n    ...DaySection_section\n    id\n  }\n}\n\nfragment DaySection_section on DaySectionSlots {\n  id\n  dayOfWeek\n  section\n  slots(first: 100) {\n    edges {\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    ...WeeklyPlanRoutineSection_section\n  }\n}\n\nfragment RoutineSlotItem_routineSlot on RoutineSlot {\n  id\n  dayOfWeek\n  task {\n    id\n    title\n    icon\n  }\n}\n\nfragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {\n  edges {\n    node {\n      id\n      ...RoutineSlotItem_routineSlot\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "090d87bda3a532797d3b512e83396bbd";

export default node;
