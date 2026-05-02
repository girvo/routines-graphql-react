/**
 * @generated SignedSource<<2b8ff90f7590a654cc12ab1ba8112114>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodaySection_section$data = {
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly completion: {
        readonly id: string;
      } | null | undefined;
      readonly routineSlot: {
        readonly id: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"TodayTaskRow">;
    };
  }>;
  readonly " $fragmentType": "TodaySection_section";
};
export type TodaySection_section$key = {
  readonly " $data"?: TodaySection_section$data;
  readonly " $fragmentSpreads": FragmentRefs<"TodaySection_section">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TodaySection_section",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "DailyTaskInstanceEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "DailyTaskInstance",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "RoutineSlot",
              "kind": "LinkedField",
              "name": "routineSlot",
              "plural": false,
              "selections": (v0/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "TaskCompletion",
              "kind": "LinkedField",
              "name": "completion",
              "plural": false,
              "selections": (v0/*: any*/),
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "TodayTaskRow"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DailyTaskInstanceConnection",
  "abstractKey": null
};
})();

(node as any).hash = "adf68a72b9d57f9779b0bf1cc8ea61fe";

export default node;
