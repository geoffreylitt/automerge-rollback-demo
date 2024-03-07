import * as A from "@automerge/automerge/next";
import { patch } from "@onsetsoftware/automerge-patcher";

// Rollback a doc to the given heads
export const rollbackDoc = (doc, heads) => {
  const diffFromNewToOld = A.diff(doc, A.getHeads(doc), heads);

  let rolledBackDoc = A.clone(doc);
  for (const diffPatch of diffFromNewToOld) {
    rolledBackDoc = A.change(rolledBackDoc, (doc) => {
      patch(doc, diffPatch);
    });
  }

  return rolledBackDoc;
};
