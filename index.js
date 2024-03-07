import { patch } from "@onsetsoftware/automerge-patcher";
import * as A from "@automerge/automerge/next";

// A demonstration of rolling back an automerge doc
// We will step thru states 1 -> 2 -> 3, and then do a "revert change" to get back to
// state 2

// Make an initial doc
const doc1 = A.from({
  title: "title 1",
  content: "content 1",
  resolved: false,
});

// Update some data
const doc2 = A.change(doc1, (d) => {
  d.title = "title 2";
  d.content = "content 2";
  d.resolved = false;
});

//
const doc3 = A.change(doc2, (d) => {
  d.title = "title 3";
  d.content = "content 3";
  d.resolved = true;
});

const diffFromNewToOld = A.diff(doc3, A.getHeads(doc3), A.getHeads(doc2));

let rollingBack = doc3;

for (const diffPatch of diffFromNewToOld) {
  rollingBack = A.change(rollingBack, (doc) => {
    patch(doc, diffPatch);
  });
}

console.log(rollingBack);
