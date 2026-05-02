/**
 * @generated SignedSource<<8a56c7a4ae215a65fdbf8f51f7fd05a2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanRoutineSectionFragment$data = {
  readonly __id: string;
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem">;
    };
  }>;
  readonly " $fragmentType": "WeeklyPlanRoutineSectionFragment";
};
export type WeeklyPlanRoutineSectionFragment$key = {
  readonly " $data"?: WeeklyPlanRoutineSectionFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSectionFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WeeklyPlanRoutineSectionFragment",
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
              "name": "RoutineSlotItem"
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

(node as any).hash = "43c8d7dcefc47e1b14d00624dbbaf60f";

export default node;
