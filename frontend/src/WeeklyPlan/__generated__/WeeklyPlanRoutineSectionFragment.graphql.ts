/**
 * @generated SignedSource<<bd7b2ed7b15beb5d591ff49113f5b57f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DaySection = "EVENING" | "MIDDAY" | "MORNING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanRoutineSectionFragment$data = {
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly createdAt: any;
      readonly id: string;
      readonly section: DaySection;
      readonly task: {
        readonly " $fragmentSpreads": FragmentRefs<"TaskDisplay">;
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
              "kind": "ScalarField",
              "name": "createdAt",
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
                  "name": "TaskDisplay"
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

(node as any).hash = "0d2d6b387b158b8ab536317c09308568";

export default node;
