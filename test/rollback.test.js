// sum.test.js
import { expect, it } from "vitest";
import * as A from "@automerge/automerge/next";
import { rollbackDoc } from "../index";

it("does a simple rollback", () => {
  // Make an initial doc
  const doc1 = A.from({
    title: "title 1",
  });

  // Update the data (we get back a new doc)
  const doc2 = A.change(doc1, (d) => {
    d.title = "title 2";
  });

  // Update data again (get back yet another new doc)
  const doc3 = A.change(doc2, (d) => {
    d.title = "title 3";
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
  expect(A.getAllChanges(rolledBackDoc).length).toBeGreaterThan(
    A.getAllChanges(doc3).length
  );
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
  expect(A.getAllChanges(rolledBackDoc).length).toBeGreaterThan(
    A.getAllChanges(doc3).length
  );
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
  expect(A.getAllChanges(rolledBackDoc).length).toBeGreaterThan(
    A.getAllChanges(doc3).length
  );
});

it("handles array insertions", () => {
  // Make an initial doc
  const doc1 = A.from({
    items: [1, 2, 3, 4, 5],
  });

  // Update the data (we get back a new doc)
  const doc2 = A.change(doc1, (d) => {
    d.items.splice(2, 0, 6); // Insert 6 at index 2
    d.items.push(7); // Insert 7 at the end
    d.items.unshift(0); // Insert 0 at the beginning
  });

  // Update data again (get back yet another new doc)
  const doc3 = A.change(doc2, (d) => {
    d.items.splice(2, 0, 6); // Insert 6 at index 2
    d.items.push(7); // Insert 7 at the end
    d.items.unshift(0); // Insert 0 at the beginning
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
  expect(A.getAllChanges(rolledBackDoc).length).toBeGreaterThan(
    A.getAllChanges(doc3).length
  );
});

it("handles string editing", () => {
  // Make an initial doc
  const doc1 = A.from({
    content: "initial content",
  });

  // Update the data (we get back a new doc)
  const doc2 = A.change(doc1, (d) => {
    A.splice(d, ["content"], 8, 7, "words");
  });

  // Update data again (get back yet another new doc)
  const doc3 = A.change(doc2, (d) => {
    A.splice(d, ["content"], 8, 5, "string stuff");
  });

  const rolledBackDoc = rollbackDoc(doc3, A.getHeads(doc2));

  expect(rolledBackDoc).toEqual(doc2);
  expect(A.getAllChanges(rolledBackDoc).length).toBeGreaterThan(
    A.getAllChanges(doc3).length
  );
});
