import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(componentDir, 'badge.css');
const readmePath = path.join(componentDir, 'README.md');

assert.ok(fs.existsSync(cssPath), 'Badge CSS implementation must exist.');
assert.ok(fs.existsSync(readmePath), 'Badge usage and accessibility contract must exist.');

const css = fs.readFileSync(cssPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Badge must define ${selector}.`);
  return match[1];
}

for (const token of [
  '--pd-radius-full',
  '--pd-color-surface-raised',
  '--pd-color-text-primary',
  '--pd-color-text-disabled',
  '--pd-color-success',
  '--pd-color-warning',
  '--pd-color-danger',
  '--pd-color-info',
  '--pd-color-accent-subtle',
  '--pd-color-accent-text',
  '--pd-color-border-strong',
  '--pd-density-component-min-interactive-size',
  '--pd-density-component-padding-horizontal',
  '--pd-space-1',
  '--pd-space-2'
]) {
  assert.match(css, new RegExp(token), `Badge must consume ${token}.`);
}

assert.match(css, /\.pd-badge\b/, 'Badge must define a stable base class.');
assert.match(css, /\.pd-badge--success\b/, 'Badge must define the success variant.');
assert.match(css, /\.pd-badge--warning\b/, 'Badge must define the warning variant.');
assert.match(css, /\.pd-badge--danger\b/, 'Badge must define the danger variant.');
assert.match(css, /\.pd-badge--info\b/, 'Badge must define the info variant.');
assert.match(css, /\.pd-badge--accent\b/, 'Badge must define the accent-subtle variant.');
assert.match(css, /\.pd-badge--interactive\b/, 'Badge must define the interactive variant.');
assert.match(css, /:not\(:disabled\):hover/, 'Badge must define hover without styling disabled badges.');
assert.match(css, /:not\(:disabled\):active/, 'Badge must define active without styling disabled badges.');
assert.match(css, /:focus-visible/, 'Badge must preserve keyboard-visible focus on the interactive variant.');
assert.match(css, /:disabled\b/, 'Badge must define a disabled state on the interactive variant.');
assert.doesNotMatch(css, /var\(--pd-color-[a-z-]+[^)]*,/,
  'Badge must not provide a color token fallback.');
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i,
  'Badge must not hardcode color values.');
assert.doesNotMatch(css, /\b\d+(?:\.\d+)?(?:px|rem|ms)\b/,
  'Badge must not hardcode token dimensions or durations (no border-width literal is needed — badge has no border).');

// Non-interactive base states must never define hover/active/focus/disabled —
// those are the interactive variant's contract, not the display-only base.
const baseRule = rule('.pd-badge');
assert.doesNotMatch(baseRule, /cursor|outline|text-decoration/,
  'The non-interactive base .pd-badge must not define any interaction styling.');

assert.match(rule('.pd-badge'), /border-radius:\s*var\(--pd-radius-full\);/,
  'Badge must use the semantic full radius for its pill shape.');
assert.match(rule('.pd-badge'), /background-color:\s*var\(--pd-color-surface-raised\);/,
  'Idle Badge must use a neutral, already A-M1-validated background.');
assert.match(rule('.pd-badge--success'), /color:\s*var\(--pd-color-success\);/,
  'Success Badge must use the success semantic color as text, not an unvalidated fill.');
assert.match(rule('.pd-badge--accent'), /background-color:\s*var\(--pd-color-accent-subtle\);/,
  'Accent Badge must use the product accent-subtle slot.');
assert.match(rule('.pd-badge--accent'), /color:\s*var\(--pd-color-accent-text\);/,
  'Accent Badge must use the product accent-text slot.');
assert.match(rule('.pd-badge--interactive'), /min-block-size:\s*var\(--pd-density-component-min-interactive-size\);/,
  'Interactive Badge must meet A-M6 with the semantic density interactive size.');
assert.match(rule('.pd-badge--interactive:focus-visible'), /outline:\s*var\(--pd-space-1\) solid var\(--pd-color-border-strong\);/,
  'Focus Badge must use the same validated offset outline ring as Button/Input.');
assert.match(rule('.pd-badge--interactive:disabled'), /color:\s*var\(--pd-color-text-disabled\);/,
  'Disabled Badge text must use the disabled text token (A-M1).');

assert.match(readme, /<span\s+class="pd-badge"/,
  'Documentation must show the non-interactive base usage.');
assert.match(readme, /<button\s+class="pd-badge pd-badge--interactive"/,
  'Documentation must show the interactive usage on a native button element.');
assert.match(readme, /extraPairs/,
  'Documentation must record that accent-subtle/accent-text is a product-verified pair, not a Palladio-guaranteed one.');
assert.match(readme, /A-M5/, 'Documentation must record the color-is-not-the-only-cue contract.');
assert.match(readme, /A-M6/, 'Documentation must record the interactive minimum size contract.');

console.log('Badge component contract verified.');
