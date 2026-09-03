import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(componentDir, 'button.css');
const readmePath = path.join(componentDir, 'README.md');

assert.ok(fs.existsSync(cssPath), 'Button CSS implementation must exist.');
assert.ok(fs.existsSync(readmePath), 'Button usage and accessibility contract must exist.');

const css = fs.readFileSync(cssPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Button must define ${selector}.`);
  return match[1];
}

for (const token of [
  '--pd-color-accent',
  '--pd-color-accent-hover',
  '--pd-color-accent-active',
  '--pd-color-accent-disabled',
  '--pd-color-accent-text',
  '--pd-color-border-strong',
  '--pd-radius-md',
  '--pd-radius-full',
  '--pd-density-component-padding-vertical',
  '--pd-density-component-padding-horizontal',
  '--pd-density-component-min-interactive-size',
  '--pd-duration-fast',
  '--pd-easing-default',
  '--pd-space-1'
]) {
  assert.match(css, new RegExp(token), `Button must consume ${token}.`);
}

assert.match(css, /\.pd-button\b/, 'Button must define a stable base class.');
assert.match(css, /\.pd-button--pill\b/, 'Button must define the pill variant.');
assert.match(css, /:not\(:disabled\):hover/, 'Button must define hover without styling disabled buttons.');
assert.match(css, /:not\(:disabled\):active/, 'Button must define active without styling disabled buttons.');
assert.match(css, /:focus-visible/, 'Button must preserve keyboard-visible focus.');
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'Button must define reduced-motion behavior.');
assert.match(css, /transition:\s*none/, 'Reduced-motion behavior must remove transitions.');
assert.doesNotMatch(css, /var\(--pd-color-accent[^)]*,/,
  'Button must not provide an accent fallback.');
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i,
  'Button must not hardcode color values.');
assert.doesNotMatch(css, /\b\d+(?:\.\d+)?(?:px|rem|ms)\b/,
  'Button must not hardcode token dimensions or durations.');

assert.match(rule('.pd-button'), /background-color:\s*var\(--pd-color-accent\);/,
  'Default Button background must use the accent slot.');
assert.match(rule('.pd-button'), /color:\s*var\(--pd-color-accent-text\);/,
  'Default Button text must use the accent-text slot.');
assert.match(rule('.pd-button'), /border-radius:\s*var\(--pd-radius-md\);/,
  'Default Button must use the semantic medium radius.');
assert.match(rule('.pd-button'), /min-block-size:\s*var\(--pd-density-component-min-interactive-size\);/,
  'Button must use the semantic density interactive size.');
assert.match(rule('.pd-button--pill'), /border-radius:\s*var\(--pd-radius-full\);/,
  'Pill Button must use the semantic full radius.');
assert.match(rule('.pd-button:not(:disabled):hover'), /background-color:\s*var\(--pd-color-accent-hover\);/,
  'Hover Button must use the hover accent slot.');
assert.match(rule('.pd-button:not(:disabled):active'), /background-color:\s*var\(--pd-color-accent-active\);/,
  'Active Button must use the active accent slot.');
assert.match(rule('.pd-button:disabled'), /background-color:\s*var\(--pd-color-accent-disabled\);/,
  'Disabled Button must use the disabled accent slot.');
assert.match(rule('.pd-button:focus-visible'), /var\(--pd-color-border-strong\)/,
  'Focus Button must use the semantic focus-ring token.');

assert.match(readme, /<button\s+class="pd-button"/,
  'Documentation must use a native button element.');
assert.match(readme, /Enter.*Space|Space.*Enter/,
  'Documentation must define native keyboard activation.');
assert.match(readme, /A-M2/, 'Documentation must record the focus contrast contract.');

console.log('Button component contract verified.');
