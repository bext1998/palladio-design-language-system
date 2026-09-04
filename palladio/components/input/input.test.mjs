import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(componentDir, 'input.css');
const readmePath = path.join(componentDir, 'README.md');

assert.ok(fs.existsSync(cssPath), 'Input CSS implementation must exist.');
assert.ok(fs.existsSync(readmePath), 'Input usage and accessibility contract must exist.');

const css = fs.readFileSync(cssPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Input must define ${selector}.`);
  return match[1];
}

for (const token of [
  '--pd-color-input-border',
  '--pd-color-border-strong',
  '--pd-color-danger',
  '--pd-color-surface-raised',
  '--pd-color-text-primary',
  '--pd-color-text-placeholder',
  '--pd-color-text-disabled',
  '--pd-color-text-secondary',
  '--pd-radius-sm',
  '--pd-density-component-padding-vertical',
  '--pd-density-component-padding-horizontal',
  '--pd-density-component-min-interactive-size',
  '--pd-duration-fast',
  '--pd-easing-default',
  '--pd-space-1',
  '--pd-space-2'
]) {
  assert.match(css, new RegExp(token), `Input must consume ${token}.`);
}

assert.match(css, /\.pd-input\b/, 'Input must define a stable base class.');
assert.match(css, /\.pd-field\b/, 'Input must define the field wrapper class.');
assert.match(css, /\.pd-field__label\b/, 'Input must define a label class.');
assert.match(css, /\.pd-field__message\b/, 'Input must define an error/helper message class.');
assert.match(css, /\.pd-field__icon\b/, 'Input must define a non-color error icon class.');
assert.match(css, /\.pd-input--error\b/, 'Input must define an error modifier.');
assert.match(css, /::placeholder\b/, 'Input must style placeholder text.');
assert.match(css, /:not\(:disabled\):hover/, 'Input must define hover without styling disabled inputs.');
assert.match(css, /:focus-visible/, 'Input must preserve keyboard-visible focus.');
assert.match(css, /:disabled\b/, 'Input must define a disabled state.');
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'Input must define reduced-motion behavior.');
assert.match(css, /transition:\s*none/, 'Reduced-motion behavior must remove transitions.');
assert.doesNotMatch(css, /var\(--pd-color-[a-z-]+[^)]*,/,
  'Input must not provide a color token fallback.');
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i,
  'Input must not hardcode color values.');

// No dimension/duration is hardcoded except the border width — this design
// system defines no border-width token (see docs/agent-reference.md's own
// `border: 1px solid ...` consumption example), so "1px" is the one literal
// this component is allowed to use, and only in a `border:` declaration.
const dimensionLiterals = css.match(/\b\d+(?:\.\d+)?(?:px|rem|ms)\b/g) || [];
for (const literal of dimensionLiterals) {
  assert.equal(literal, '1px', `Input must not hardcode token dimensions or durations (found "${literal}").`);
}
const borderDeclarations = css.match(/border:\s*[^;]+;/g) || [];
const onePxCount = (css.match(/\b1px\b/g) || []).length;
assert.equal(onePxCount, borderDeclarations.length,
  'Every hardcoded "1px" must appear only in a border: declaration.');
assert.ok(borderDeclarations.every((decl) => /\b1px\b/.test(decl)),
  'Input border declarations must use the 1px literal (no border-width token exists).');

assert.match(rule('.pd-input'), /background-color:\s*transparent;/,
  'Idle Input must be transparent so it blends with its surrounding surface.');
assert.match(rule('.pd-input'), /border:\s*1px solid var\(--pd-color-input-border\);/,
  'Idle Input boundary must use the input-border semantic token, not border-default.');
assert.match(rule('.pd-input'), /border-radius:\s*var\(--pd-radius-sm\);/,
  'Input must use the semantic small radius (spec 4.1).');
assert.match(rule('.pd-input'), /min-block-size:\s*var\(--pd-density-component-min-interactive-size\);/,
  'Input must use the semantic density interactive size.');
assert.match(rule('.pd-input::placeholder'), /color:\s*var\(--pd-color-text-placeholder\);/,
  'Placeholder text must use the placeholder text token (A-M1).');
assert.match(rule('.pd-input:not(:disabled):hover'), /background-color:\s*var\(--pd-color-surface-raised\);/,
  'Hover Input must use surface-raised, not surface-hover (undocumented A-M2 gap — see README).');
assert.match(rule('.pd-input:focus-visible'), /outline:\s*var\(--pd-space-1\) solid var\(--pd-color-border-strong\);/,
  'Focus Input must use an offset outline ring, not a same-color border swap.');
assert.match(rule('.pd-input:focus-visible'), /outline-offset:\s*var\(--pd-space-1\);/,
  'Focus Input outline must be offset to create a visible geometric difference from the idle border.');
assert.match(rule('.pd-input:disabled'), /color:\s*var\(--pd-color-text-disabled\);/,
  'Disabled Input text must use the disabled text token (A-M1).');

const errorRule = rule('.pd-input--error,\n.pd-field--error .pd-input');
assert.match(errorRule, /border-color:\s*var\(--pd-color-danger\);/,
  'Error Input must use the danger token for its boundary.');

assert.match(readme, /<input\s+class="pd-input/,
  'Documentation must use a native input element.');
assert.match(readme, /aria-invalid="true"/,
  'Documentation must show the error state wired up with aria-invalid.');
assert.match(readme, /pd-field__icon/,
  'Documentation must show a non-color (icon) cue for the error state (A-M5).');
assert.match(readme, /A-M2/, 'Documentation must record the focus contrast contract.');
assert.match(readme, /A-M5/, 'Documentation must record the color-is-not-the-only-cue contract.');
assert.match(readme, /幾何差異/, 'Documentation must explain the idle/focus geometric distinction.');

console.log('Input component contract verified.');
