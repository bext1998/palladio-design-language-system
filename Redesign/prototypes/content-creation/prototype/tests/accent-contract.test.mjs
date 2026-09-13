import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateAccentPairs } from "../../../../../palladio/pipeline/validate-accessibility.mjs";

const cssPath = new URL("../src/styles.css", import.meta.url);

function readSlot(css, slot) {
  const variable = slot === "base" ? "--product-accent" : `--product-accent-${slot}`;
  const match = css.match(new RegExp(`${variable}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `missing product accent slot ${slot}`);
  return match[1];
}

test("validates the six CSS product accent slots and rendered pairs", async () => {
  const css = await readFile(cssPath, "utf8");
  const accent = {
    accent: readSlot(css, "base"),
    accentHover: readSlot(css, "hover"),
    accentActive: readSlot(css, "active"),
    accentDisabled: readSlot(css, "disabled"),
    accentSubtle: readSlot(css, "subtle"),
    accentText: readSlot(css, "text"),
  };

  const results = validateAccentPairs(accent, [
    { name: "accent-hover text on active chapter surface", foreground: accent.accentHover, background: "#242424", kind: "text" },
    { name: "accent-hover icon on accent-subtle", foreground: accent.accentHover, background: accent.accentSubtle, kind: "ui" },
    { name: "accent icon on active chapter surface", foreground: accent.accent, background: "#242424", kind: "ui" },
  ]);

  assert.equal(results.length, 7);
  assert.ok(results.every((result) => result.passes));
});
