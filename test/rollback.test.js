// sum.test.js
import { expect, it } from "vitest";
import * as A from "@automerge/automerge/next";
import { rollbackDoc } from "../index";

it("does a simple rollback", () => {
  // Make an initial doc
  const doc1 = A.from({
    title: "title 1",
  });

  const doc2 = A.change(doc1, (d) => {
    d.title = "title 2";
  });

  const doc3 = A.change(doc2, (d) => {
    d.title = "title 3";
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);

  // note: the rolled back doc has more changes than the previous doc.
  // we've added a revert change, we haven't "reverted" to the previous changeset.
  expect(A.getAllChanges(rolledBackDoc).length).toBeGreaterThan(
    A.getAllChanges(doc3).length
  );
});

it("handles multiple fields being set", () => {
  const doc1 = A.from({
    title: "title 1",
    content: "content 1",
    resolved: false,
  });

  const doc2 = A.change(doc1, (d) => {
    d.title = "title 2";
    d.content = "content 2";
    d.resolved = true;
  });

  const doc3 = A.change(doc2, (d) => {
    d.title = "title 3";
    d.content = "content 3";
    d.resolved = false;
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
});

it("handles multiple fields being set", () => {
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
    d.resolved = true;
  });

  // Update data again (get back yet another new doc)
  const doc3 = A.change(doc2, (d) => {
    d.title = "title 3";
    d.content = "content 3";
    d.resolved = false;
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
});

it("handles array insertions", () => {
  const doc1 = A.from({
    items: [1, 2, 3, 4, 5],
  });

  const doc2 = A.change(doc1, (d) => {
    d.items.splice(2, 0, 6); // Insert 6 at index 2
    d.items.push(7); // Insert 7 at the end
    d.items.unshift(0); // Insert 0 at the beginning
  });

  const doc3 = A.change(doc2, (d) => {
    d.items.splice(2, 0, 6); // Insert 6 at index 2
    d.items.push(7); // Insert 7 at the end
    d.items.unshift(0); // Insert 0 at the beginning
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
});

it("handles string editing", () => {
  const doc1 = A.from({
    content: "initial content",
  });

  const doc2 = A.change(doc1, (d) => {
    A.splice(d, ["content"], 8, 7, "words");
  });

  const doc3 = A.change(doc2, (d) => {
    A.splice(d, ["content"], 8, 5, "string stuff");
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
});
