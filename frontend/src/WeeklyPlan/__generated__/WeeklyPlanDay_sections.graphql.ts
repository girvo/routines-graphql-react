/**
 * @generated SignedSource<<b042e60324c74c113686824a826de0fc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WeeklyPlanDay_sections$data = {
  readonly evening: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly midday: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly morning: {
    readonly " $fragmentSpreads": FragmentRefs<"DaySection_section">;
  };
  readonly " $fragmentType": "WeeklyPlanDay_sections";
};
export type WeeklyPlanDay_sections$key = {
  readonly " $data"?: WeeklyPlanDay_sections$data;
  readonly " $fragmentSpreads": FragmentRefs<"WeeklyPlanDay_sections">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Variable",
  "name": "dayOfWeek",
  "variableName": "dayOfWeek"
},
v1 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "DaySection_section"
  }
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "dayOfWeek"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "WeeklyPlanDay_sections",
  "selections": [
    {
      "alias": "morning",
      "args": [
        (v0/*: any*/),
        {
          "kind": "Literal",
          "name": "section",
          "value": "MORNING"
        }
      ],
      "concreteType": "DaySectionSlots",
      "kind": "LinkedField",
      "name": "daySectionSlots",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": "midday",
      "args": [
        (v0/*: any*/),
        {
          "kind": "Literal",
          "name": "section",
          "value": "MIDDAY"
        }
      ],
      "concreteType": "DaySectionSlots",
      "kind": "LinkedField",
      "name": "daySectionSlots",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": "evening",
      "args": [
        (v0/*: any*/),
        {
          "kind": "Literal",
          "name": "section",
          "value": "EVENING"
        }
      ],
      "concreteType": "DaySectionSlots",
      "kind": "LinkedField",
      "name": "daySectionSlots",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "fc4e958e2de3a4913fb4af0a9453d69d";

export default node;
