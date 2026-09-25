/**
 * @generated SignedSource<<c4eec8c576e15bbe023c7e54d2897c65>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RoutineSlotItem_routineSlot$data = {
  readonly id: string;
  readonly task: {
    readonly icon: string | null | undefined;
    readonly id: string;
    readonly title: string;
  };
  readonly " $fragmentType": "RoutineSlotItem_routineSlot";
};
export type RoutineSlotItem_routineSlot$key = {
  readonly " $data"?: RoutineSlotItem_routineSlot$data;
  readonly " $fragmentSpreads": FragmentRefs<"RoutineSlotItem_routineSlot">;
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
  "name": "RoutineSlotItem_routineSlot",
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
  "type": "RoutineSlot",
  "abstractKey": null
};
})();

(node as any).hash = "4311eb665b8503b47008689619e59cf4";

export default node;
