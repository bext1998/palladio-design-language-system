import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cssPath = new URL("../src/styles.css", import.meta.url);
const appPath = new URL("../src/App.jsx", import.meta.url);

test("responsive layout keeps the manuscript track and drawer behavior", async () => {
  const css = await readFile(cssPath, "utf8");
  const mobileCss = css.slice(css.indexOf("@media (max-width: 820px)"), css.indexOf("@media (min-width: 821px)"));

  assert.match(mobileCss, /grid-template-columns: minmax\(0, 1fr\) !important/);
  assert.match(mobileCss, /\.sidebar,\n  \.ai-panel \{[\s\S]*position: fixed/);
  assert.doesNotMatch(mobileCss, /\.sidebar,\n  \.ai-panel \{\s*display: none/);
  assert.match(css, /\.app-shell--sidebar-hidden \.topbar \{\s*width: 72px/);
  assert.match(css, /\.app-shell--sidebar-hidden \.manuscript__inner,[\s\S]*\.app-shell--ai-hidden \.manuscript__inner/);
  assert.doesNotMatch(css, /\.scene-item \{[\s\S]*min-height: 28px/);
});

test("prototype exposes disabled controls and a dynamic word count", async () => {
  const app = await readFile(appPath, "utf8");

  assert.match(app, /disabled title="Not implemented in prototype"/);
  assert.match(app, /wordCount\.toLocaleString\("en-US"\)/);
  assert.match(app, /role="listitem"/);
});
