/**
 * @generated SignedSource<<9e555e17dbf56d8851e85ca24669a4c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanRoutineSectionFragment$data = {
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly id: string;
      readonly task: {
        readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem">;
      };
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
              "alias": null,
              "args": null,
              "concreteType": "Task",
              "kind": "LinkedField",
              "name": "task",
              "plural": false,
              "selections": [
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "RoutineSlotConnection",
  "abstractKey": null
};

(node as any).hash = "7a7cc9a0115084afd534de4fcd063e4e";

export default node;
