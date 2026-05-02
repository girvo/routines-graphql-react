/**
 * @generated SignedSource<<6b5ed5f67fea7b7965a9025c522bf6b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DaySection = "EVENING" | "MIDDAY" | "MORNING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type TaskDisplay$data = {
  readonly createdAt: any;
  readonly icon: string | null | undefined;
  readonly id: string;
  readonly slots: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly section: DaySection;
      };
    }>;
  };
  readonly title: string;
  readonly " $fragmentType": "TaskDisplay";
};
export type TaskDisplay$key = {
  readonly " $data"?: TaskDisplay$data;
  readonly " $fragmentSpreads": FragmentRefs<"TaskDisplay">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TaskDisplay",
  "selections": [
    (v0/*: any*/),
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
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
              "concreteType": "RoutineSlot",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "section",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "slots(first:100)"
    }
  ],
  "type": "Task",
  "abstractKey": null
};
})();

(node as any).hash = "5651ae333df3fbe6f3534113d375f450";

export default node;
