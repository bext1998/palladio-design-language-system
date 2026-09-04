import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(componentDir, 'card.css');
const readmePath = path.join(componentDir, 'README.md');

assert.ok(fs.existsSync(cssPath), 'Card CSS implementation must exist.');
assert.ok(fs.existsSync(readmePath), 'Card usage and accessibility contract must exist.');

const css = fs.readFileSync(cssPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Card must define ${selector}.`);
  return match[1];
}

for (const token of [
  '--pd-color-surface-raised',
  '--pd-color-border-default',
  '--pd-color-border-strong',
  '--pd-color-text-primary',
  '--pd-color-text-disabled',
  '--pd-radius-sm',
  '--pd-space-4',
  '--pd-space-1',
  '--pd-density-component-min-interactive-size',
  '--pd-duration-fast',
  '--pd-easing-default'
]) {
  assert.match(css, new RegExp(token), `Card must consume ${token}.`);
}

assert.match(css, /\.pd-card\b/, 'Card must define a stable base class.');
assert.match(css, /\.pd-card--interactive\b/, 'Card must define the interactive variant.');
assert.match(css, /:not\(:disabled\):hover/, 'Card must define hover without styling disabled cards.');
assert.match(css, /:focus-visible/, 'Card must preserve keyboard-visible focus on the interactive variant.');
assert.match(css, /:disabled\b/, 'Card must define a disabled state on the interactive variant.');
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'Card must define reduced-motion behavior.');
assert.match(css, /transition:\s*none/, 'Reduced-motion behavior must remove transitions.');
assert.doesNotMatch(css, /var\(--pd-color-[a-z-]+[^)]*,/,
  'Card must not provide a color token fallback.');
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i,
  'Card must not hardcode color values.');

// No dimension/duration is hardcoded except the border width — this design
// system defines no border-width token (same precedent as Button/Input/
// Divider), so "1px" is the one literal this component is allowed to use,
// and only in a border: declaration.
const dimensionLiterals = css.match(/\b\d+(?:\.\d+)?(?:px|rem|ms)\b/g) || [];
for (const literal of dimensionLiterals) {
  assert.equal(literal, '1px', `Card must not hardcode token dimensions or durations (found "${literal}").`);
}
const onePxDeclarations = css.match(/border:\s*1px[^;]*;/g) || [];
const onePxCount = (css.match(/\b1px\b/g) || []).length;
assert.equal(onePxCount, onePxDeclarations.length,
  'Every hardcoded "1px" must appear only in a border: declaration.');

// Non-interactive base must never define interaction styling — that is the
// interactive variant's contract, not the display-only base.
assert.doesNotMatch(rule('.pd-card'), /cursor|outline|:hover|:focus/,
  'The non-interactive base .pd-card must not define any interaction styling.');

assert.match(rule('.pd-card'), /background-color:\s*var\(--pd-color-surface-raised\);/,
  'Card must use the surface-raised elevation token (spec 2.1).');
assert.match(rule('.pd-card'), /border:\s*1px solid var\(--pd-color-border-default\);/,
  'Card boundary must use the border-default "card edge" token (spec 2.2), not border-subtle.');
assert.match(rule('.pd-card'), /border-radius:\s*var\(--pd-radius-sm\);/,
  'Card must use the semantic small radius (spec 4.1: "input、大型 card").');
assert.match(rule('.pd-card--interactive'), /min-block-size:\s*var\(--pd-density-component-min-interactive-size\);/,
  'Interactive Card must meet A-M6 with the semantic density interactive size.');
assert.match(rule('.pd-card--interactive:not(:disabled):hover'), /border-color:\s*var\(--pd-color-border-strong\);/,
  'Hover Card must switch to the A-M2-validated border-strong token.');
assert.match(rule('.pd-card--interactive:focus-visible'), /outline:\s*var\(--pd-space-1\) solid var\(--pd-color-border-strong\);/,
  'Focus Card must use the same validated offset outline ring as Button/Input/Badge.');
assert.match(rule('.pd-card--interactive:disabled'), /color:\s*var\(--pd-color-text-disabled\);/,
  'Disabled Card text must use the disabled text token (A-M1).');

assert.match(readme, /<article\s+class="pd-card"/,
  'Documentation must show the non-interactive base usage.');
assert.match(readme, /<a\s+class="pd-card pd-card--interactive"\s+href=/,
  'Documentation must show the interactive usage on a native anchor element.');
assert.match(readme, /<button\s+class="pd-card pd-card--interactive"/,
  'Documentation must show the interactive usage on a native button element.');
assert.match(readme, /A-M6/, 'Documentation must record the interactive minimum size contract.');
assert.match(readme, /border-subtle/, 'Documentation must explain why Card uses border-default rather than border-subtle.');

console.log('Card component contract verified.');
