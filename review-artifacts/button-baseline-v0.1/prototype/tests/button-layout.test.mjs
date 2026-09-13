import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const styles = readFileSync(join(root, "src", "styles.css"), "utf8");

test("Matrix loading CSS precondition keeps the indicator in inline flow", () => {
  // This is a source-level precondition; final overlap/overflow proof comes from browser geometry.
  assert.match(
    styles,
    /\.theme-cell\s*\{[^}]*gap:\s*0;[^}]*padding:\s*var\(--pd-space-3\) var\(--pd-space-1\)/s,
    "Matrix cells need the existing compact semantic spacing budget for three equal tracks",
  );
  assert.match(
    styles,
    /\.matrix \.pd-prototype-button\[data-force-state="loading"\]\s*\{[^}]*gap:\s*var\(--pd-space-1\);[^}]*padding-inline:\s*0/s,
    "Matrix loading buttons need a compact inline spacing budget",
  );
  assert.match(
    styles,
    /\.matrix \.pd-prototype-button\[data-force-state="loading"\] \.loading-icon\s*\{[^}]*inline-size:\s*var\(--pd-space-2\)/s,
    "The Matrix indicator must retain its semantic loading size",
  );
  assert.match(
    styles.replace(/\s+/g, " "),
    /\.matrix \.pd-prototype-button\[data-force-state="loading"\] \.loading-icon \{ (?![^}]*position:\s*absolute)[^}]*\}/s,
    "The Matrix indicator must remain in normal inline flow",
  );
});
