/**
 * @generated SignedSource<<8ee2491465673eaeb9732a4969b8ec96>>
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
  readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanRoutineSection_section">;
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
      "name": "WeeklyPlanRoutineSection_section"
    }
  ],
  "type": "RoutineSlotConnection",
  "abstractKey": null
};

(node as any).hash = "1ff8bb7ceef46bd669b07cf8bd1614bf";

export default node;
