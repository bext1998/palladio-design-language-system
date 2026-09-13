import assert from "node:assert/strict";
import test from "node:test";

import {
  BUTTON_STATES,
  BUTTON_VARIANTS,
  THEMES,
  activationAllowed,
  contextStateForTheme,
  tertiaryAnatomy,
} from "../src/buttonModel.js";

test("all themes share one Button variant and state model", () => {
  assert.deepEqual(BUTTON_VARIANTS, ["primary", "secondary", "tertiary"]);
  assert.deepEqual(BUTTON_STATES, [
    "default",
    "hover",
    "focus-visible",
    "pressed",
    "loading",
    "disabled",
  ]);
  assert.deepEqual(THEMES, ["charcoal", "metal", "moon"]);
});

test("disabled and loading controls cannot activate twice", () => {
  assert.equal(activationAllowed({ disabled: false, loading: false }), true);
  assert.equal(activationAllowed({ disabled: true, loading: false }), false);
  assert.equal(activationAllowed({ disabled: false, loading: true }), false);
});

test("tertiary disabled state preserves anatomy without a new indicator", () => {
  assert.deepEqual(tertiaryAnatomy("default"), ["label"]);
  assert.deepEqual(tertiaryAnatomy("disabled"), ["label"]);
  assert.deepEqual(tertiaryAnatomy("loading"), ["progress", "label"]);
});

test("theme comparison holds context state constant", () => {
  for (const context of ["toolbar", "form", "dialog"]) {
    const expected = contextStateForTheme(context, "charcoal");
    assert.deepEqual(contextStateForTheme(context, "metal"), expected);
    assert.deepEqual(contextStateForTheme(context, "moon"), expected);
  }
});
