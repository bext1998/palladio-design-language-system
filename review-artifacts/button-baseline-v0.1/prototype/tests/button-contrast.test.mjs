import assert from "node:assert/strict";
import test from "node:test";

import { THEME_FIXTURES } from "../src/themeFixtures.js";

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const value = hex.slice(1);
  const rgb = [0, 2, 4].map((offset) => channel(Number.parseInt(value.slice(offset, offset + 2), 16)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

test("prototype theme fixtures meet text, control and accent contrast gates", () => {
  for (const [theme, fixture] of Object.entries(THEME_FIXTURES)) {
    const c = fixture.colors;
    const surfaces = ["--pd-color-bg", "--pd-color-surface", "--pd-color-surface-raised", "--pd-color-surface-overlay"];
    for (const foreground of ["--pd-color-text-primary", "--pd-color-text-secondary", "--pd-color-text-placeholder"]) {
      for (const surface of surfaces) {
        assert.ok(contrast(c[foreground], c[surface]) >= 4.5, `${theme}: ${foreground} on ${surface}`);
      }
    }
    for (const border of ["--pd-color-border-strong", "--pd-color-input-border"]) {
      for (const surface of surfaces) {
        assert.ok(contrast(c[border], c[surface]) >= 3, `${theme}: ${border} on ${surface}`);
      }
    }
    for (const accent of ["--pd-color-accent", "--pd-color-accent-hover", "--pd-color-accent-active", "--pd-color-accent-disabled"]) {
      assert.ok(contrast(c["--pd-color-accent-text"], c[accent]) >= 4.5, `${theme}: accent text on ${accent}`);
    }
  }
});
