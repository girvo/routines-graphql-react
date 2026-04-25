/**
 * @generated SignedSource<<611141535453cb5003a30b3cf864aa7b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DaySection_section$data = {
  readonly edges: ReadonlyArray<{
    readonly __typename: "RoutineSlotEdge";
  }>;
  readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSectionFragment">;
  readonly " $fragmentType": "DaySection_section";
};
export type DaySection_section$key = {
  readonly " $data"?: DaySection_section$data;
  readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DaySection_section",
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
          "name": "__typename",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WeeklyPlanRoutineSectionFragment"
    }
  ],
  "type": "RoutineSlotConnection",
  "abstractKey": null
};

(node as any).hash = "16e5f2e5356eb1188a7f69088a9deef8";

export default node;
