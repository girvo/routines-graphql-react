/**
 * @generated SignedSource<<1791bd30555773fc89e13e4bca02ef81>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TodayTaskRow_instance$data = {
  readonly completion: {
    readonly id: string;
  } | null | undefined;
  readonly id: string;
  readonly routineSlot: {
    readonly id: string;
    readonly task: {
      readonly icon: string | null | undefined;
      readonly id: string;
      readonly title: string;
    };
  };
  readonly " $fragmentType": "TodayTaskRow_instance";
};
export type TodayTaskRow_instance$key = {
  readonly " $data"?: TodayTaskRow_instance$data;
  readonly " $fragmentSpreads": FragmentRefs<"TodayTaskRow_instance">;
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
  "name": "TodayTaskRow_instance",
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

(node as any).hash = "0db36ed09c08a513deaccf3d5ce6c099";

export default node;
