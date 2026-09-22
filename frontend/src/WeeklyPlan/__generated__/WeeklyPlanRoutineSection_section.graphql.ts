/**
 * @generated SignedSource<<aa295ba615ae5e88f244a791aefff717>>
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
      readonly task: {
        readonly title: string;
      };
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
                }
              ],
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

(node as any).hash = "1ccb096b9f5d64ccdde1d635cc0cf9fc";

export default node;
