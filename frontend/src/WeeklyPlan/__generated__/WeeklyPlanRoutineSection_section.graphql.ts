/**
 * @generated SignedSource<<d07e6e88a850a5f43c803d692810efe4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanRoutineSection_section$data = {
  readonly __id: string;
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem_routineSlot">;
    };
  }>;
  readonly " $fragmentType": "WeeklyPlanRoutineSection_section";
};
export type WeeklyPlanRoutineSection_section$key = {
  readonly " $data"?: WeeklyPlanRoutineSection_section$data;
  readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSection_section">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WeeklyPlanRoutineSection_section",
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
          "concreteType": "RoutineSlot",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "RoutineSlotItem_routineSlot"
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
    }
  ],
  "type": "RoutineSlotConnection",
  "abstractKey": null
};

(node as any).hash = "295be559866377dad7af5524c1cc5905";

export default node;
