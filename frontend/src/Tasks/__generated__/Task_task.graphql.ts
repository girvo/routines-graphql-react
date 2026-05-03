/**
 * @generated SignedSource<<9c1c6e3519bd28718e15832786705daa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DaySection = "EVENING" | "MIDDAY" | "MORNING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type Task_task$data = {
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
  readonly " $fragmentType": "Task_task";
};
export type Task_task$key = {
  readonly " $data"?: Task_task$data;
  readonly " $fragmentSpreads": FragmentRefs<"Task_task">;
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
  "name": "Task_task",
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

(node as any).hash = "fd1f491895c3a0b4ad3307deb7e4da09";

export default node;
