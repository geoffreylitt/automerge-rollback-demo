// sum.test.js
import { expect, it } from "vitest";
import * as A from "@automerge/automerge/next";
import { rollbackDoc } from "../index";

it("does a simple rollback", () => {
  // A demonstration of rolling back an automerge doc
  // We will step thru states 1 -> 2 -> 3, and then do a "revert change" to get back to
  // state 2

  // Make an initial doc
  const doc1 = A.from({
    title: "title 1",
    content: "content 1",
    resolved: false,
  });

  // Update the data (we get back a new doc)
  const doc2 = A.change(doc1, (d) => {
    d.title = "title 2";
    d.content = "content 2";
    d.resolved = false;
  });

  // Update data again (get back yet another new doc)
  const doc3 = A.change(doc2, (d) => {
    d.title = "title 3";
    d.content = "content 3";
    d.resolved = true;
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
  expect(A.getAllChanges(rolledBackDoc).length).toBeGreaterThan(
    A.getAllChanges(doc3).length
  );
});
