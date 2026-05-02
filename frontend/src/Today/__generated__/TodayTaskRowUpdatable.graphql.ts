/**
 * @generated SignedSource<<3203daa440bbf4410a1c0d984740ca41>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodayTaskRowUpdatable$data = {
  get completion(): {
    readonly id: string;
  } | null | undefined;
  set completion(value: null | undefined);
  readonly " $fragmentType": "TodayTaskRowUpdatable";
};
export type TodayTaskRowUpdatable$key = {
  readonly " $data"?: TodayTaskRowUpdatable$data;
  readonly $updatableFragmentSpreads: FragmentRefs<"TodayTaskRowUpdatable">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TodayTaskRowUpdatable",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TaskCompletion",
      "kind": "LinkedField",
      "name": "completion",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DailyTaskInstance",
  "abstractKey": null
};

(node as any).hash = "394c8725a37d99f7a2e141d5f69307fc";

export default node;
