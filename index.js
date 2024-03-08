import * as A from "@automerge/automerge/next";
import { patch } from "@onsetsoftware/automerge-patcher";

// Rollback a doc to the given heads.
export const rollbackDoc = (doc, heads) => {
  // get a diff from current to the older state
  const diffFromNewToOld = A.diff(doc, A.getHeads(doc), heads);

  // initialize a clone of the doc to roll back
  let rolledBackDoc = A.clone(doc);

  // iterate thru the patches in the diff and apply them
  for (const diffPatch of diffFromNewToOld) {
    rolledBackDoc = A.change(rolledBackDoc, (doc) => {
      patch(doc, diffPatch);
    });
  }

  return rolledBackDoc;
};
