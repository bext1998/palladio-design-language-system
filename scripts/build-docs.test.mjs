import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { buildDocumentation } from './build-docs.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

test('buildDocumentation generates the documentation routes and deployment artifacts', async () => {
  const outputDir = await mkdtemp(join(tmpdir(), 'palladio-docs-'));

  try {
    await buildDocumentation({ allowExternalOutput: true, repoRoot, outputDir });

    for (const relativePath of [
      'index.html',
      'principles/index.html',
      'foundations/color/index.html',
      'foundations/type/index.html',
      'foundations/space-density/index.html',
      'foundations/radius/index.html',
      'foundations/motion/index.html',
      'components/index.html',
      'components/button/index.html',
      'components/input/index.html',
      'components/divider/index.html',
      'components/badge/index.html',
      'components/card/index.html',
      'components/navigation/index.html',
      'accessibility/index.html',
      'tokens/index.html',
      'guides/consuming-tokens/index.html',
      'guides/density/index.html',
      'guides/agent-reference/index.html',
      'assets/palladio/palladio.css',
      'assets/palladio/navigation.css',
      'assets/palladio/card.css',
      'assets/palladio/badge.css',
      'assets/palladio/divider.css',
      'assets/docs.css',
      'assets/docs.js',
      'tokens.json',
      'search-index.json',
    ]) {
      await readFile(join(outputDir, relativePath), 'utf8');
    }

    const overview = await readFile(join(outputDir, 'index.html'), 'utf8');
    assert.match(overview, /data-theme="dark"/);
    assert.match(overview, /class="pd-nav"/);
    assert.match(overview, /class="pd-nav__link pd-nav__link--active" aria-current="page"/);
    assert.match(overview, /data-nav-panel/);
    assert.match(overview, /Palladio 設計系統文件 — Overview/);
    assert.match(overview, /跳至主要內容/);
    assert.match(overview, /文件導覽選單/);
    assert.match(overview, /搜尋文件/);
    assert.doesNotMatch(overview, /Generated reference|Skip to content|Search documentation|Token inspector|data-token-query|data-token-group/);
    assert.match(overview, /Palladio/);
    assert.doesNotMatch(overview, /href="[^"]*\\\\/);
    assert.doesNotMatch(overview, /assets\/\//);

    const tokenIndex = JSON.parse(await readFile(join(outputDir, 'search-index.json'), 'utf8'));
    assert.ok(tokenIndex.some((entry) => entry.title === 'Tokens'));
    assert.ok(tokenIndex.some((entry) => entry.title === 'Button'));

    const sourceCss = await readFile(join(repoRoot, 'palladio/dist/css/palladio.css'), 'utf8');
    const deployedCss = await readFile(join(outputDir, 'assets/palladio/palladio.css'), 'utf8');
    assert.equal(deployedCss, sourceCss);

    const docsCss = await readFile(join(outputDir, 'assets/docs.css'), 'utf8');
    assert.match(docsCss, /@media \(max-width: 48rem\)[\s\S]*?\.docs-sidebar \{\s*background: var\(--pd-color-surface\);\s*inset: var\(--pd-space-3\);\s*overflow-y: auto;\s*position: fixed;/);
    assert.match(docsCss, /--pd-color-accent: #D9814F;/);
    assert.match(docsCss, /\.docs-header \{[\s\S]*?border-block-end: 1px solid var\(--pd-color-border-subtle\);/);
    assert.match(docsCss, /\.docs-document h1 \{[\s\S]*?font-size: 32px;[\s\S]*?font-weight: 600;/);
    assert.match(docsCss, /\.docs-document h2 \{[\s\S]*?font-size: 18px;[\s\S]*?line-height: 1.35;/);
    assert.match(docsCss, /\.docs-document tr \{\s*border-block-end: 1px solid var\(--pd-color-border-subtle\);/);
    assert.match(docsCss, /\.docs-document > \* \+ \* \{ margin-block-start: var\(--pd-space-3\); \}/);

    const docsJs = await readFile(join(outputDir, 'assets/docs.js'), 'utf8');
    assert.match(docsJs, /panel\.querySelector\('a'\)\?\.focus\(\)/);
    assert.doesNotMatch(docsJs, /renderTokens|data-token-query|data-token-group/);
    assert.match(docsJs, /if \(Array\.isArray\(value\)\) return \[\{ name: '--pd-' \+ prefix\.join\('-'\), value: value\.join\(', '\) \}\];/);
    assert.match(docsJs, /if \(typeof value === 'string' \|\| typeof value === 'number'\) return \[\{ name: '--pd-' \+ prefix\.join\('-'\), value: String\(value\) \}\];/);
    assert.match(docsJs, /Object\.entries\(tokens\.density\)\.flatMap\(\(\[context, tokenGroup\]\) => flattenTokens\(tokenGroup\.density, \['density'\]\)/);
    assert.match(docsJs, /Object\.entries\(tokens\.theme\)\.flatMap\(\(\[context, tokenGroup\]\) => flattenTokens\(tokenGroup\)/);

    const componentsPage = await readFile(join(outputDir, 'components/index.html'), 'utf8');
    assert.match(componentsPage, /元件行為契約/);

    const buttonPage = await readFile(join(outputDir, 'components/button/index.html'), 'utf8');
    assert.match(buttonPage, /data-page-token-references/);

    const consumingTokens = await readFile(join(outputDir, 'guides/consuming-tokens/index.html'), 'utf8');
    assert.match(consumingTokens, /套件 README（英文原文）/);

    await buildDocumentation({ allowExternalOutput: true, check: true, repoRoot, outputDir });
  } finally {
    await rm(outputDir, { force: true, recursive: true });
  }
});
