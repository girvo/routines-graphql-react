/**
 * @generated SignedSource<<464c362f4ffa552cd95e1b522439ec37>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodayTaskRow$data = {
  readonly completion: {
    readonly id: string;
  } | null | undefined;
  readonly id: string;
  readonly routineSlot: {
    readonly id: string;
    readonly task: {
      readonly icon: string | null | undefined;
      readonly title: string;
    };
  };
  readonly " $fragmentType": "TodayTaskRow";
};
export type TodayTaskRow$key = {
  readonly " $data"?: TodayTaskRow$data;
  readonly " $fragmentSpreads": FragmentRefs<"TodayTaskRow">;
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
  "name": "TodayTaskRow",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "RoutineSlot",
      "kind": "LinkedField",
      "name": "routineSlot",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "icon",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TaskCompletion",
      "kind": "LinkedField",
      "name": "completion",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "DailyTaskInstance",
  "abstractKey": null
};
})();

(node as any).hash = "b53681f28e9116428b5dd897a3123afc";

export default node;
