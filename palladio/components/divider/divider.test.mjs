import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(componentDir, 'divider.css');
const readmePath = path.join(componentDir, 'README.md');

assert.ok(fs.existsSync(cssPath), 'Divider CSS implementation must exist.');
assert.ok(fs.existsSync(readmePath), 'Divider usage and accessibility contract must exist.');

const css = fs.readFileSync(cssPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Divider must define ${selector}.`);
  return match[1];
}

for (const token of [
  '--pd-color-border-subtle',
  '--pd-space-4'
]) {
  assert.match(css, new RegExp(token), `Divider must consume ${token}.`);
}

assert.match(css, /\.pd-divider\b/, 'Divider must define a stable base class.');
assert.match(css, /\.pd-divider--vertical\b/, 'Divider must define the vertical variant.');
assert.doesNotMatch(css, /var\(--pd-color-[a-z-]+[^)]*,/,
  'Divider must not provide a color token fallback.');
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i,
  'Divider must not hardcode color values.');
assert.doesNotMatch(css, /:hover|:active|:focus|:disabled/,
  'Divider is non-interactive and must not define interaction states.');

// No dimension is hardcoded except the 1px border width — this design system
// defines no border-width token (matches the precedent set by Button/Input),
// so "1px" is the one literal this component is allowed to use, and only in
// a border-block-start:/border-inline-start: declaration.
const dimensionLiterals = css.match(/\b\d+(?:\.\d+)?(?:px|rem|ms)\b/g) || [];
for (const literal of dimensionLiterals) {
  assert.equal(literal, '1px', `Divider must not hardcode token dimensions or durations (found "${literal}").`);
}
const onePxDeclarations = css.match(/border-(?:block|inline)-start:\s*1px[^;]*;/g) || [];
const onePxCount = (css.match(/\b1px\b/g) || []).length;
assert.equal(onePxCount, onePxDeclarations.length,
  'Every hardcoded "1px" must appear only in a border-block-start:/border-inline-start: declaration.');

assert.match(rule('.pd-divider'), /border-block-start:\s*1px solid var\(--pd-color-border-subtle\);/,
  'Horizontal Divider must use the border-subtle semantic token.');
assert.match(rule('.pd-divider'), /margin-block:\s*var\(--pd-space-4\);/,
  'Horizontal Divider must use a 4px-scale spacing token for its default margin.');
assert.match(rule('.pd-divider--vertical'), /border-inline-start:\s*1px solid var\(--pd-color-border-subtle\);/,
  'Vertical Divider must use the border-subtle semantic token.');
assert.match(rule('.pd-divider--vertical'), /margin-inline:\s*var\(--pd-space-4\);/,
  'Vertical Divider must use a 4px-scale spacing token for its default margin.');

assert.match(readme, /<hr\s+class="pd-divider"/,
  'Documentation must use a native hr element.');
assert.match(readme, /aria-orientation="vertical"/,
  'Documentation must show the vertical variant with an explicit orientation.');
assert.match(readme, /role="none"/,
  'Documentation must cover the decorative-only accessibility escape hatch.');

console.log('Divider component contract verified.');
