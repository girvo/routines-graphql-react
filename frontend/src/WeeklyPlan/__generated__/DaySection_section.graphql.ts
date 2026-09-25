/**
 * @generated SignedSource<<1bcf21df69d1dcf1b79a7db093a70ab1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DaySection_section$data = {
  readonly slots: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly __typename: "RoutineSlotEdge";
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSection_section">;
  };
  readonly " $fragmentType": "DaySection_section";
};
export type DaySection_section$key = {
  readonly " $data"?: DaySection_section$data;
  readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "slots"
        ]
      }
    ]
  },
  "name": "DaySection_section",
  "selections": [
    {
      "alias": "slots",
      "args": null,
      "concreteType": "RoutineSlotConnection",
      "kind": "LinkedField",
      "name": "__DaySection_slots_connection",
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
            (v0/*: any*/),
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
                (v0/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "WeeklyPlanRoutineSection_section"
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
      "storageKey": null
    }
  ],
  "type": "DaySectionSlots",
  "abstractKey": null
};
})();

(node as any).hash = "cb4befe817169dc14014fda8f46f7fa0";

export default node;
