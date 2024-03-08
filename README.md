This is just a tiny repo experimenting with rolling back [Automerge](https://automerge.org) documents using [automerge-patcher](https://github.com/onsetsoftware/automerge-patcher).

index.js has a small bit of helper code to integrate `Automerge.diff` with the `patch` function from `automerge-patcher`.

Run:

```
yarn
yarn test
```

## simple test

```js
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
```