import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(componentDir, 'navigation.css');
const readmePath = path.join(componentDir, 'README.md');

assert.ok(fs.existsSync(cssPath), 'Navigation CSS implementation must exist.');
assert.ok(fs.existsSync(readmePath), 'Navigation usage and accessibility contract must exist.');

const css = fs.readFileSync(cssPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Navigation must define ${selector}.`);
  return match[1];
}

for (const token of [
  '--pd-color-surface',
  '--pd-color-surface-hover',
  '--pd-color-surface-raised',
  '--pd-color-text-secondary',
  '--pd-color-text-primary',
  '--pd-color-text-disabled',
  '--pd-color-accent',
  '--pd-color-border-strong',
  '--pd-density-component-min-interactive-size',
  '--pd-density-component-padding-vertical',
  '--pd-density-component-padding-horizontal',
  '--pd-duration-fast',
  '--pd-easing-default',
  '--pd-space-1'
]) {
  assert.match(css, new RegExp(token), `Navigation must consume ${token}.`);
}

assert.match(css, /\.pd-nav\b/, 'Navigation must define the sidebar container class.');
assert.match(css, /\.pd-nav__list\b/, 'Navigation must define the list class.');
assert.match(css, /\.pd-nav__link\b/, 'Navigation must define the link class.');
assert.match(css, /\.pd-nav__link--active\b/, 'Navigation must define the active modifier.');
assert.match(css, /\[aria-disabled='true'\]|\[aria-disabled="true"\]/,
  'Navigation must style disabled links via [aria-disabled], not a fake :disabled (native <a> never matches :disabled).');
assert.match(css, /:focus-visible/, 'Navigation must preserve keyboard-visible focus.');
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'Navigation must define reduced-motion behavior.');
assert.match(css, /transition:\s*none/, 'Reduced-motion behavior must remove transitions.');
assert.doesNotMatch(css, /var\(--pd-color-[a-z-]+[^)]*,/,
  'Navigation must not provide a color token fallback.');
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i,
  'Navigation must not hardcode color values.');
assert.doesNotMatch(css, /\b\d+(?:\.\d+)?(?:px|rem|ms)\b/,
  'Navigation must not hardcode token dimensions or durations (border width and outline offset are both token-derived, not literal).');

// A-M5: the active state must carry at least one non-color cue. font-weight
// is the color-independent one — assert it directly rather than just
// trusting the README.
assert.match(rule('.pd-nav__link.pd-nav__link--active'), /font-weight:\s*600;/,
  'Active Navigation link must carry a non-color cue (font-weight) per A-M5, not color alone.');
assert.match(rule('.pd-nav__link.pd-nav__link--active'), /background-color:\s*var\(--pd-color-surface-raised\);/,
  'Active Navigation link must carry a second non-color cue (background block) per A-M5.');
assert.match(rule('.pd-nav__link.pd-nav__link--active'), /border-inline-start-color:\s*var\(--pd-color-accent\);/,
  'Active Navigation link indicator bar must use the product accent slot, not a derived/hardcoded color.');

assert.match(rule('.pd-nav__link'), /min-block-size:\s*var\(--pd-density-component-min-interactive-size\);/,
  'Navigation link must meet A-M6 with the semantic density interactive size.');

const disabledRule = rule(".pd-nav__link[aria-disabled='true']");
assert.match(disabledRule, /background-color:\s*var\(--pd-color-surface\);/,
  'Disabled link must restore the container background so a pointer hovering it does not leave behind ' +
  'surface-hover (property-level ties resolve independently of color, so this must be declared explicitly).');

const focusRule = rule('.pd-nav__link:focus-visible');
assert.match(focusRule, /background-color:\s*var\(--pd-color-surface-raised\);/,
  'Focus-visible must force a validated backdrop (surface-raised), not leave an unvalidated surface-hover fill under the ring.');
assert.match(focusRule, /outline:\s*var\(--pd-space-1\) solid var\(--pd-color-border-strong\);/,
  'Focus Navigation link must use the same validated border-strong ring as the other components.');
assert.match(focusRule, /outline-offset:\s*calc\(-1 \* var\(--pd-space-1\)\);/,
  'Focus ring must be inset (negative offset derived from the space-1 token), not clipped by an edge-to-edge list layout.');

// The disabled rule must come after --active and hover in the cascade, and
// :focus-visible must be the very last rule, so it always wins the tie
// against a simultaneously-hovered item (see the ordering comment in the
// CSS file itself).
const hoverIndex = css.indexOf('.pd-nav__link:hover');
const activeIndex = css.indexOf('.pd-nav__link.pd-nav__link--active');
const disabledIndex = css.indexOf(".pd-nav__link[aria-disabled");
const focusIndex = css.indexOf('.pd-nav__link:focus-visible');
assert.ok(hoverIndex < activeIndex && activeIndex < disabledIndex && disabledIndex < focusIndex,
  'Rule order must be hover, then --active, then [aria-disabled], then :focus-visible last, so equal-specificity ties resolve safely.');

assert.match(readme, /aria-current="page"/,
  'Documentation must show aria-current="page" alongside the active class.');
assert.match(readme, /aria-disabled="true"/,
  'Documentation must show the disabled link pattern.');
assert.match(readme, /extraPairs/,
  'Documentation must record that the accent indicator bar is a product-verified pair, not a Palladio-guaranteed one.');
assert.match(readme, /A-M5/, 'Documentation must record the color-is-not-the-only-cue contract.');
assert.match(readme, /A-M6/, 'Documentation must record the interactive minimum size contract.');
assert.match(readme, /2\.99/, 'Documentation must explain why the focus ring avoids the surface-hover contrast gap.');

console.log('Navigation component contract verified.');
