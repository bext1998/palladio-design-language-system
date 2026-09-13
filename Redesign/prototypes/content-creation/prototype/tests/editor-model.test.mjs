import assert from "node:assert/strict";
import test from "node:test";
import { applySuggestion, getSuggestion } from "../src/editorModel.js";

const drafts = {
  "03": {
    paragraphs: ["Opening", "Original target", "Closing"],
  },
  "04": {
    paragraphs: ["Other opening", "Other target", "Other closing"],
  },
};

test("applySuggestion updates the active chapter target and preserves other chapters", () => {
  const before = structuredClone(drafts);
  const suggestion = getSuggestion("03", before);
  const after = applySuggestion(before, "03");

  assert.equal(suggestion.quote, "Original target");
  assert.notEqual(after, before);
  assert.equal(after["03"].paragraphs[1], suggestion.replacement);
  assert.deepEqual(after["03"].paragraphs.slice(0, 1), before["03"].paragraphs.slice(0, 1));
  assert.deepEqual(after["04"], before["04"]);
});

test("suggestion quote follows the selected chapter context", () => {
  const suggestion = getSuggestion("04", drafts);

  assert.equal(suggestion.quote, "Other target");
  assert.notEqual(suggestion.quote, getSuggestion("03", drafts).quote);
});
