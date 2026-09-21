/**
 * @generated SignedSource<<ed043f8309898ebd8fa2c316bfc4f93a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DayOfWeek = "FRIDAY" | "MONDAY" | "SATURDAY" | "SUNDAY" | "THURSDAY" | "TUESDAY" | "WEDNESDAY" | "%future added value";
export type DaySection = "EVENING" | "MIDDAY" | "MORNING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type DaySection_section$data = {
  readonly dayOfWeek: DayOfWeek;
  readonly id: string;
  readonly section: DaySection;
  readonly slots: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
    readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSection_section">;
  };
  readonly " $fragmentType": "DaySection_section";
};
export type DaySection_section$key = {
  readonly " $data"?: DaySection_section$data;
  readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
};

const node: ReaderFragment = {
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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
      "kind": "ScalarField",
      "name": "section",
      "storageKey": null
    },
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "WeeklyPlanRoutineSection_section"
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

(node as any).hash = "21dfef40cd67ca0813aa7acb108f983e";

export default node;
