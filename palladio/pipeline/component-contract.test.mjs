import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { componentRequirements, createComponentContractValidator } from './component-contract.mjs';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(pipelineDir, '..');
const componentNames = Object.keys(componentRequirements);
const knownClasses = new Set();

for (const component of componentNames) {
  const cssPath = path.join(packageDir, 'components', component, `${component}.css`);
  assert.ok(fs.existsSync(cssPath), `${component} CSS implementation must exist.`);
  const css = fs.readFileSync(cssPath, 'utf8');
  for (const match of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
    if (match[1].startsWith('pd-')) knownClasses.add(match[1]);
  }
}

for (const className of [
  'pd-nav', 'pd-nav__list', 'pd-nav__link', 'pd-nav__link--active',
  'pd-button', 'pd-input', 'pd-divider', 'pd-divider--vertical',
  'pd-badge', 'pd-badge--interactive', 'pd-card', 'pd-card--interactive'
]) {
  assert.ok(knownClasses.has(className), `Component CSS must define ${className}.`);
}

const validateSource = createComponentContractValidator(knownClasses);
const { validateComponentHtml: validate } = await import(
  pathToFileURL(path.join(packageDir, 'dist', 'validate-components.js')).href
);

for (const className of knownClasses) {
  assert.deepEqual(
    validate(`<span class="${className}"></span>`),
    validateSource(`<span class="${className}"></span>`),
    `The emitted validator must include ${className} extracted from component CSS.`
  );
}

const validFixtures = [
  ['navigation', '<nav class="pd-nav"><ul class="pd-nav__list"><li><a class="pd-nav__link pd-nav__link--active" aria-current="page" href="/dashboard">Dashboard</a></li></ul></nav>'],
  ['button', '<button class="pd-button" type="button">Save</button>'],
  ['input', '<input class="pd-input" type="email">'],
  ['divider', '<hr class="pd-divider pd-divider--vertical" aria-orientation="vertical">'],
  ['badge', '<button class="pd-badge pd-badge--interactive" type="button">Draft</button>'],
  ['card', '<article class="pd-card">Content</article>']
];

for (const [component, html] of validFixtures) {
  assert.deepEqual(validate(html, { components: [component] }), [], `${component} fixture must satisfy its contract.`);
}

const pr70Regression = validate(`
  <nav class="docs-nav" aria-label="Documentation">
    <ul class="docs-nav__list">
      <li><a class="docs-nav__link docs-nav__link--current" aria-current="page" href="/getting-started">Getting started</a></li>
    </ul>
  </nav>
`, { components: ['navigation'] });

assert.ok(pr70Regression.some((error) => error.includes('.pd-nav')),
  'The validator must reject PR #70\'s missing pd-nav root class.');
assert.ok(pr70Regression.some((error) => error.includes('.pd-nav__link--active')),
  'The validator must reject PR #70\'s docs-nav__link--current active class.');
assert.ok(pr70Regression.some((error) => error.includes('.pd-nav__link')),
  'The validator must reject PR #70\'s missing pd-nav__link class.');
assert.deepEqual(pr70Regression, validateSource(`
  <nav class="docs-nav" aria-label="Documentation">
    <ul class="docs-nav__list">
      <li><a class="docs-nav__link docs-nav__link--current" aria-current="page" href="/getting-started">Getting started</a></li>
    </ul>
  </nav>
`, { components: ['navigation'] }),
  'The emitted consumer validator must match its source contract rules.');

assert.deepEqual(
  validate('<button class="pd-button pd-button--current">Save</button>'),
  ['<button> uses unknown Palladio class .pd-button--current.'],
  'The validator must reject invented pd-* classes without an explicit component target.'
);

console.log('Validated consumer-facing component contract checks, including the PR #70 regression.');
