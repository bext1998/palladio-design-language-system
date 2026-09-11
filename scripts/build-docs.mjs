import { cp, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = resolve(scriptDirectory, '..');
const componentCss = ['navigation', 'card', 'badge', 'divider'];

const DOCS_CSS = `
:root {
  color-scheme: dark;
}

* { box-sizing: border-box; }

html { background: var(--pd-color-bg); }

body {
  background: var(--pd-color-bg);
  color: var(--pd-color-text-primary);
  font-size: var(--pd-density-typography-body-font-size);
  margin: 0;
}

a { color: var(--pd-color-text-primary); }

:focus-visible {
  outline: var(--pd-space-1) solid var(--pd-color-border-strong);
  outline-offset: var(--pd-space-1);
}

.docs-skip-link {
  background: var(--pd-color-surface-overlay);
  color: var(--pd-color-text-primary);
  inset-inline-start: var(--pd-space-4);
  padding: var(--pd-space-2);
  position: absolute;
  transform: translateY(-200%);
}

.docs-skip-link:focus { transform: translateY(var(--pd-space-2)); }

.docs-header {
  align-items: center;
  background: var(--pd-color-surface);
  border-block-end: 1px solid var(--pd-color-border-subtle);
  display: flex;
  gap: var(--pd-space-3);
  justify-content: space-between;
  padding: var(--pd-space-3) var(--pd-space-4);
}

.docs-brand {
  font-size: var(--pd-density-typography-body-font-size);
  text-decoration: none;
}

.docs-layout {
  display: grid;
  gap: var(--pd-space-4);
  grid-template-columns: minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr);
  margin-inline: auto;
  max-inline-size: 96rem;
  padding: var(--pd-space-4);
}

.docs-sidebar,
.docs-inspector {
  align-self: start;
  min-inline-size: 0;
}

.docs-sidebar { padding: var(--pd-space-2); }

.docs-nav__link--current {
  background: var(--pd-color-surface-raised);
  color: var(--pd-color-text-primary);
  text-decoration: underline;
}

.docs-content {
  min-inline-size: 0;
}

.docs-document > :first-child { margin-block-start: 0; }

.docs-document :where(h1, h2, h3, h4, p, ul, ol, table, pre, blockquote) { margin-block: 0; }

.docs-document > * + * { margin-block-start: var(--pd-space-3); }

.docs-document h1 {
  margin-block-end: var(--pd-space-6);
}

.docs-document h2 {
  margin-block-start: var(--pd-space-8);
  margin-block-end: var(--pd-space-3);
}

.docs-document h3,
.docs-document h4 {
  margin-block-start: var(--pd-space-6);
  margin-block-end: var(--pd-space-2);
}

.docs-document ul,
.docs-document ol {
  padding-inline-start: var(--pd-space-5);
}

.docs-document li + li { margin-block-start: var(--pd-space-1); }

.docs-document img,
.docs-document pre { max-inline-size: 100%; }

.docs-document pre {
  background: var(--pd-color-surface);
  overflow: auto;
  padding: var(--pd-space-3);
}

.docs-document code { color: var(--pd-color-text-primary); }

.docs-document table {
  border-collapse: collapse;
  inline-size: 100%;
}

.docs-document tr {
  border-block-end: 1px solid var(--pd-color-border-subtle);
}

.docs-document th,
.docs-document td {
  padding: var(--pd-space-2);
  text-align: start;
  vertical-align: top;
}

.docs-card-grid {
  display: grid;
  gap: var(--pd-space-3);
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

.docs-card-grid .pd-card--interactive { color: var(--pd-color-text-primary); }

.docs-inspector {
  background: var(--pd-color-surface);
  padding: var(--pd-space-3);
}

.docs-inspector__search,
.docs-token-group,
.docs-search {
  background: var(--pd-color-surface-raised);
  border: none;
  color: var(--pd-color-text-primary);
  font: inherit;
  inline-size: 100%;
  min-block-size: var(--pd-density-component-min-interactive-size);
  outline: var(--pd-space-1) solid transparent;
  padding: var(--pd-density-component-padding-vertical) var(--pd-density-component-padding-horizontal);
}

.docs-inspector__search:focus-visible,
.docs-search:focus-visible {
  outline-color: var(--pd-color-border-strong);
}

.docs-token-list,
.docs-search-results,
.docs-toc {
  display: grid;
  gap: var(--pd-space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.docs-token-list { margin-block-start: var(--pd-space-3); }

.docs-token-list code { color: var(--pd-color-text-secondary); }

.docs-token-list span { color: var(--pd-color-text-primary); }

.docs-panel-toggle {
  background: var(--pd-color-surface-raised);
  border: none;
  color: var(--pd-color-text-primary);
  display: none;
  font: inherit;
  min-block-size: var(--pd-density-component-min-interactive-size);
  padding: var(--pd-density-component-padding-vertical) var(--pd-density-component-padding-horizontal);
}

.docs-panel-toggle[aria-expanded="true"] { text-decoration: underline; }

.docs-search-shell { margin-block-end: var(--pd-space-4); }

.docs-search-results { margin-block-start: var(--pd-space-3); }

.docs-muted { color: var(--pd-color-text-secondary); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none; }
}

@media (max-width: 72rem) {
  .docs-layout { grid-template-columns: minmax(0, 1fr) minmax(0, 3fr); }
  .docs-inspector { grid-column: 1 / -1; }
}

@media (max-width: 48rem) {
  .docs-layout { grid-template-columns: minmax(0, 1fr); }
  .docs-sidebar { display: none; }
  .docs-panel-toggle { display: block; }
  .docs-inspector {
    background: var(--pd-color-surface);
    inset: var(--pd-space-3);
    overflow-y: auto;
    position: fixed;
    z-index: 1;
  }
  .docs-inspector[hidden] { display: none; }
}
`;

const DOCS_JS = `
const root = document.documentElement;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function flattenTokens(value, prefix = []) {
  if (typeof value === 'string' || typeof value === 'number') return [{ name: '--pd-' + prefix.join('-'), value: String(value) }];
  if (Array.isArray(value)) return [{ name: '--pd-' + prefix.join('-'), value: value.join(', ') }];
  if (!value || typeof value !== 'object') return [];
  if (typeof value.hex === 'string') return [{ name: '--pd-' + prefix.join('-'), value: value.hex }];
  if (typeof value.value === 'number' && typeof value.unit === 'string') return [{ name: '--pd-' + prefix.join('-'), value: value.value + value.unit }];
  return Object.entries(value).flatMap(([key, nested]) => flattenTokens(nested, [...prefix, key]));
}

function tokenEntries(tokens) {
  return [
    ...flattenTokens(tokens.semantic).map((entry) => ({ ...entry, group: 'semantic' })),
    ...Object.entries(tokens.density).flatMap(([context, tokenGroup]) => flattenTokens(tokenGroup.density, ['density']).map((entry) => ({ ...entry, context, group: 'density' }))),
    ...Object.entries(tokens.theme).flatMap(([context, tokenGroup]) => flattenTokens(tokenGroup).map((entry) => ({ ...entry, context, group: 'theme' }))),
  ];
}

function tokenLabel(entry) {
  return entry.context ? entry.context + ' · ' + entry.name : entry.name;
}

function renderTokens(container, entries, query = '', group = 'all') {
  const normalized = query.trim().toLowerCase();
  const matches = entries.filter((entry) => (group === 'all' || entry.group === group) && (!normalized || (tokenLabel(entry) + ' ' + entry.value).toLowerCase().includes(normalized)));
  container.innerHTML = matches.slice(0, 24).map((entry) => '<li><code>' + escapeHtml(tokenLabel(entry)) + '</code><br><span>' + escapeHtml(entry.value) + '</span></li>').join('') || '<li class="docs-muted">沒有相符的 Token。</li>';
}

function renderPageReferences(container, entries) {
  if (!container) return;
  const names = JSON.parse(container.dataset.tokenNames || '[]');
  const matches = entries.filter((entry) => entry.group !== 'theme' && names.includes(entry.name));
  container.innerHTML = matches.map((entry) => '<li><code>' + escapeHtml(tokenLabel(entry)) + '</code><br><span>' + escapeHtml(entry.value) + '</span></li>').join('') || '<li class="docs-muted">本頁未直接引用 Token。</li>';
}

async function setupInspector() {
  const container = document.querySelector('[data-token-results]');
  const input = document.querySelector('[data-token-query]');
  const group = document.querySelector('[data-token-group]');
  if (!container || !input || !group) return;
  const response = await fetch(root.dataset.docsBase + 'tokens.json');
  const tokens = await response.json();
  const entries = tokenEntries(tokens);
  const render = () => renderTokens(container, entries, input.value, group.value);
  render();
  renderPageReferences(document.querySelector('[data-page-token-references]'), entries);
  input.addEventListener('input', render);
  group.addEventListener('change', render);
}

async function setupSearch() {
  const input = document.querySelector('[data-site-search]');
  const results = document.querySelector('[data-site-search-results]');
  if (!input || !results) return;
  const response = await fetch(root.dataset.docsBase + 'search-index.json');
  const index = await response.json();
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const matches = index.filter((entry) => !query || (entry.title + ' ' + entry.text).toLowerCase().includes(query)).slice(0, 12);
    results.innerHTML = matches.map((entry) => '<li><a href="' + escapeHtml(root.dataset.docsBase + entry.href) + '">' + escapeHtml(entry.title) + '</a></li>').join('');
  });
}

function setupInspectorPanel() {
  const button = document.querySelector('[data-panel-toggle]');
  const panel = document.querySelector('[data-token-inspector]');
  if (!button || !panel) return;
  const narrowViewport = window.matchMedia('(max-width: 48rem)');
  const synchronizePanel = () => {
    button.hidden = !narrowViewport.matches;
    if (!narrowViewport.matches) {
      panel.hidden = false;
      return;
    }
    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };
  synchronizePanel();
  narrowViewport.addEventListener('change', synchronizePanel);
  button.addEventListener('click', () => {
    if (!narrowViewport.matches) return;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    if (expanded) button.focus();
    else panel.querySelector('[data-token-query]')?.focus();
  });
}

setupInspector().catch(() => {});
setupSearch().catch(() => {});
setupInspectorPanel();
`;

const requiredSources = [
  'docs/spec.md',
  'palladio/docs/accessibility/accessibility-contract.md',
  'palladio/dist/json/tokens.json',
  'palladio/dist/agent-reference.md',
  'palladio/README.md',
  'palladio/package.json',
  'palladio/dist/css/palladio.css',
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function typographyDimension(value, label) {
  if (!value || !Number.isFinite(value.value) || typeof value.unit !== 'string') throw new Error(`Invalid typography dimension: ${label}`);
  return `${value.value}${value.unit}`;
}

function typographyToken(tokens, name) {
  const token = tokens.semantic?.text?.[name];
  if (!token || !Array.isArray(token.fontFamily) || !token.fontFamily.every((family) => typeof family === 'string') || !Number.isFinite(token.fontWeight) || !Number.isFinite(token.lineHeight)) {
    throw new Error(`Invalid typography token: semantic.text.${name}`);
  }
  return token;
}

function typographyDeclarations(token, { densityFontSize = false } = {}) {
  const fontSize = densityFontSize ? 'var(--pd-density-typography-body-font-size)' : typographyDimension(token.fontSize, 'fontSize');
  return [
    `  font-family: ${token.fontFamily.map((family) => JSON.stringify(family)).join(', ')};`,
    `  font-size: ${fontSize};`,
    `  font-weight: ${token.fontWeight};`,
    `  line-height: ${token.lineHeight};`,
    `  letter-spacing: ${typographyDimension(token.letterSpacing, 'letterSpacing')};`,
  ].join('\n');
}

function documentationTypographyCss(tokens) {
  const display = typographyToken(tokens, 'display');
  const headingMd = typographyToken(tokens, 'heading-md');
  const headingSm = typographyToken(tokens, 'heading-sm');
  const bodyMd = typographyToken(tokens, 'body-md');
  const labelMd = typographyToken(tokens, 'label-md');
  const mono = typographyToken(tokens, 'mono');

  return `
body {
${typographyDeclarations(bodyMd, { densityFontSize: true })}
}

.docs-document {
${typographyDeclarations(bodyMd, { densityFontSize: true })}
}

.docs-document h1 {
${typographyDeclarations(display)}
}

.docs-document h2 {
${typographyDeclarations(headingMd)}
}

.docs-document h3,
.docs-document h4 {
${typographyDeclarations(headingSm)}
}

.docs-document th {
${typographyDeclarations(labelMd)}
}

.docs-document pre,
.docs-document code {
${typographyDeclarations(mono)}
}
`;
}

function extractRange(markdown, start, end) {
  const startMatch = markdown.match(start);
  if (!startMatch) throw new Error(`Missing required section: ${start}`);
  const content = markdown.slice(startMatch.index);
  const endMatch = content.match(end);
  return endMatch ? content.slice(0, endMatch.index) : content;
}

function headings(markdown) {
  return [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gmu)].map((match) => ({
    depth: match[1].length,
    text: match[2].replace(/[`*_]/g, ''),
    id: slugify(match[2]),
  }));
}

function renderMarkdown(markdown) {
  const usedIds = new Map();
  const renderer = new MarkdownIt({ html: false, linkify: true, typographer: false });
  renderer.renderer.rules.heading_open = (tokens, index, options, env, self) => {
    const inline = tokens[index + 1];
    const baseId = slugify(inline.content);
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);
    tokens[index].attrSet('id', count ? `${baseId}-${count}` : baseId);
    return self.renderToken(tokens, index, options);
  };
  return renderer.render(markdown);
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?(\[[^\]]*\])\([^)]*\)/g, '$1')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function routeHref(from, to) {
  const path = (relative(from || '.', to || '.') || '.').replaceAll('\\', '/');
  return path === '.' ? './' : `${path}/`;
}

function assetHref(route, asset) {
  return routeHref(route, asset);
}

function navItems() {
  return [
    ['Overview', ''],
    ['Principles', 'principles'],
    ['Foundations', 'foundations/color'],
    ['Components', 'components'],
    ['Accessibility', 'accessibility'],
    ['Tokens', 'tokens'],
    ['Guides', 'guides/consuming-tokens'],
  ];
}

function pageTokenReferences(source) {
  const matches = source.match(/(?:--)?pd-[a-zA-Z0-9-]+/g) ?? [];
  return [...new Set(matches
    .filter((name) => !name.endsWith('-'))
    .map((name) => name.startsWith('--') ? name : `--${name}`))].sort();
}

async function readRequired(repoRoot, relativePath) {
  const path = join(repoRoot, relativePath);
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    throw new Error(`Missing required documentation source: ${relativePath}`, { cause: error });
  }
}

async function readSources(repoRoot) {
  const sources = {};
  for (const source of requiredSources) sources[source] = await readRequired(repoRoot, source);

  const packageJson = JSON.parse(sources['palladio/package.json']);
  const tokens = JSON.parse(sources['palladio/dist/json/tokens.json']);
  if (!packageJson.version) throw new Error('palladio/package.json is missing a version.');
  if (packageJson.exports?.['./tokens.json'] !== './dist/json/tokens.json' || packageJson.exports?.['./agent-reference.md'] !== './dist/agent-reference.md') {
    throw new Error('palladio/package.json exports do not match the documentation token artifacts.');
  }
  for (const key of ['semantic', 'density', 'theme']) {
    if (!Object.hasOwn(tokens, key)) throw new Error(`tokens.json is missing top-level key: ${key}`);
  }
  if (!sources['palladio/dist/agent-reference.md'].includes(`v${packageJson.version}`)) {
    throw new Error('agent-reference.md version does not match palladio/package.json');
  }

  const componentsRoot = join(repoRoot, 'palladio/components');
  const entries = await readdir(componentsRoot, { withFileTypes: true });
  const componentNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  if (!componentNames.length) throw new Error('No component documentation directories were found.');
  const components = [];
  for (const name of componentNames) {
    const readmePath = `palladio/components/${name}/README.md`;
    const content = await readRequired(repoRoot, readmePath);
    components.push({ name, content, title: content.match(/^#\s+(.+)$/m)?.[1] ?? name });
  }

  for (const name of componentCss) {
    const path = `palladio/components/${name}/${name}.css`;
    sources[path] = await readRequired(repoRoot, path);
  }

  return { components, packageJson, sources, tokens };
}

function shell({ body, page, packageVersion }) {
  const route = page.route;
  const docsBase = assetHref(route, '');
  const cssBase = assetHref(route, 'assets').replace(/\/$/, '');
  const nav = navItems().map(([label, target]) => {
    const current = target === route;
    return `<li><a class="pd-nav__link${current ? ' docs-nav__link--current' : ''}"${current ? ' aria-current="page"' : ''} href="${routeHref(route, target)}">${label}</a></li>`;
  }).join('');
  const toc = headings(page.source ?? '').map((heading) => `<li class="docs-toc__item docs-toc__item--${heading.depth}"><a href="#${heading.id}">${escapeHtml(heading.text)}</a></li>`).join('') || '<li class="docs-muted">本頁無次級標題。</li>';
  const search = route === '' ? '<section class="docs-search-shell"><label for="site-search">搜尋文件</label><input class="docs-search" data-site-search id="site-search" type="search" autocomplete="off"><ul class="docs-search-results" data-site-search-results></ul></section>' : '';
  const references = pageTokenReferences(page.source ?? '');
  const pageReferences = references.length
    ? `<section aria-labelledby="page-token-references-title"><h2 id="page-token-references-title">本頁引用 Token</h2><ul class="docs-token-list" data-page-token-references data-token-names="${escapeHtml(JSON.stringify(references))}"><li class="docs-muted">載入 Token 資料…</li></ul></section><hr class="pd-divider">`
    : '';

  return `<!doctype html>
<html lang="zh-Hant" data-theme="dark" data-docs-base="${docsBase}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Palladio 設計系統文件 — ${escapeHtml(page.title)}">
  <title>${escapeHtml(page.title)} · Palladio</title>
  <link rel="stylesheet" href="${cssBase}/palladio/palladio.css">
  <link rel="stylesheet" href="${cssBase}/palladio/navigation.css">
  <link rel="stylesheet" href="${cssBase}/palladio/card.css">
  <link rel="stylesheet" href="${cssBase}/palladio/badge.css">
  <link rel="stylesheet" href="${cssBase}/palladio/divider.css">
  <link rel="stylesheet" href="${cssBase}/docs.css">
</head>
<body>
  <a class="docs-skip-link" href="#content">跳至主要內容</a>
  <header class="docs-header">
    <a class="docs-brand" href="${routeHref(route, '')}">Palladio</a>
    <span class="pd-badge">Token 套件 v${escapeHtml(packageVersion)}</span>
    <button class="docs-panel-toggle" data-panel-toggle type="button" aria-controls="token-inspector" aria-expanded="false">Token 檢視器</button>
  </header>
  <div class="docs-layout">
    <aside class="docs-sidebar">
      <nav class="pd-nav" aria-label="文件導覽">
        <ul class="pd-nav__list">${nav}</ul>
      </nav>
    </aside>
    <main class="docs-content" id="content">
      ${search}
      <article class="docs-document">${body}</article>
    </main>
    <aside class="docs-inspector" data-token-inspector id="token-inspector">
      <section aria-labelledby="token-inspector-title">
        <h2 id="token-inspector-title">Token 檢視器</h2>
        <label for="token-query">搜尋 Token</label>
        <input class="docs-inspector__search" data-token-query id="token-query" type="search" autocomplete="off">
        <label for="token-group">Token 分組</label>
        <select class="docs-token-group" data-token-group id="token-group"><option value="all">全部 Token</option><option value="semantic">Semantic</option><option value="density">Density</option><option value="theme">Theme</option></select>
        <ul class="docs-token-list" data-token-results><li class="docs-muted">載入 Token 資料…</li></ul>
      </section>
      <hr class="pd-divider">
      ${pageReferences}
      <nav aria-label="本頁目錄">
        <h2>本頁目錄</h2>
        <ul class="docs-toc">${toc}</ul>
      </nav>
    </aside>
  </div>
  <script src="${cssBase}/docs.js" defer></script>
</body>
</html>`;
}

function page(route, title, source, body) {
  return { body, route, source, title };
}

function buildPages({ components, packageJson, sources }) {
  const spec = sources['docs/spec.md'];
  const accessibility = sources['palladio/docs/accessibility/accessibility-contract.md'];
  const agentReference = sources['palladio/dist/agent-reference.md'];
  const readme = sources['palladio/README.md'];
  const pages = [];

  pages.push(page('', 'Overview', '', `
<h1>Palladio 設計系統文件</h1>
<div class="docs-card-grid">
  <a class="pd-card pd-card--interactive" href="principles/"><h2>Principles</h2><p>核心視覺原則、表面層級、線條分組與動效語彙。</p></a>
  <a class="pd-card pd-card--interactive" href="tokens/"><h2>Tokens</h2><p>Semantic、Density 與 Theme Token 的名稱、值與分組。</p></a>
  <a class="pd-card pd-card--interactive" href="accessibility/"><h2>Accessibility</h2><p>A-M1 至 A-M6、focus、reduced motion 與 accent 驗證流程。</p></a>
</div>
<hr class="pd-divider">
<p class="docs-muted">Token 套件版本：${escapeHtml(packageJson.version)}。文件站採用 dark-only，並提供三種 density 檢視。</p>`));

  const chapters = [
    ['principles', 'Principles', /^## 一、/m, /^## 二、/m],
    ['foundations/color', 'Color', /^## 二、/m, /^## 三、/m],
    ['foundations/type', 'Type', /^## 三、/m, /^## 四、/m],
    ['foundations/radius', 'Radius', /^## 四、/m, /^## 五、/m],
    ['foundations/motion', 'Motion', /^## 五、/m, /^## 六、/m],
    ['foundations/space-density', 'Space and density', /^## 六、/m, /^## 七、/m],
  ];
  for (const [route, title, start, end] of chapters) {
    const source = extractRange(spec, start, end);
    pages.push(page(route, title, source, `<h1>${escapeHtml(title)}</h1>${renderMarkdown(source)}`));
  }

  const componentCards = components.map((component) => `<a class="pd-card pd-card--interactive" href="${component.name}/"><h2>${escapeHtml(component.title)}</h2><p>結構、狀態、Token 對應與可及性規範。</p></a>`).join('');
  pages.push(page('components', 'Components', '', `<p><span class="pd-badge">元件行為契約</span></p><h1>Components</h1><p>各元件頁定義結構、狀態、Token 對應與可及性規範。</p><div class="docs-card-grid">${componentCards}</div>`));
  for (const component of components) {
    pages.push(page(`components/${component.name}`, component.title, component.content, `<h1>${escapeHtml(component.title)}</h1>${renderMarkdown(component.content.replace(/^#\s+.+$/m, ''))}`));
  }

  pages.push(page('accessibility', 'Accessibility', accessibility, `<p><span class="pd-badge">可及性契約</span></p><h1>Accessibility</h1>${renderMarkdown(accessibility.replace(/^#\s+.+$/m, ''))}`));
  pages.push(page('tokens', 'Tokens', '', `<p><span class="pd-badge">發佈中 Token 產物</span></p><h1>Tokens</h1><p>在 Token 檢視器查看目前發佈版本的 Semantic、Density 與 Theme 值。原始 JSON：<a href="../tokens.json">tokens.json</a>。</p><div class="pd-card"><h2>目前套件</h2><p>${escapeHtml(packageJson.name)} v${escapeHtml(packageJson.version)}</p></div>`));

  const consuming = extractRange(readme, /^## Install/m, /^## Accent slots/m);
  const accent = extractRange(readme, /^## Accent slots/m, /^## Versioning/m);
  const density = extractRange(spec, /^## 六、/m, /^## 七、/m);
  pages.push(page('guides/consuming-tokens', 'Consuming tokens', consuming, `<p><span class="pd-badge">套件 README（英文原文）</span></p><h1>Consuming tokens</h1>${renderMarkdown(consuming)}`));
  pages.push(page('guides/density', 'Density', density, `<p><span class="pd-badge">使用指南（完整規則見規格）</span></p><h1>Density</h1>${renderMarkdown(density)}`));
  pages.push(page('guides/agent-reference', 'Agent reference', agentReference, `<p><span class="pd-badge">AI agent 使用契約</span></p><h1>Agent reference</h1>${renderMarkdown(agentReference.replace(/^#\s+.+$/m, ''))}<hr class="pd-divider"><p class="docs-muted">以下章節原文為套件 README（英文）。</p><h2>Accent slots</h2>${renderMarkdown(accent)}`));

  return pages;
}

async function writeFileTree(outputDir, relativePath, content) {
  const target = join(outputDir, relativePath);
  await writeFile(target, content, 'utf8');
}

async function ensureDirectory(path) {
  await (await import('node:fs/promises')).mkdir(path, { recursive: true });
}

async function populate(outputDir, repoRoot) {
  const { components, packageJson, sources, tokens } = await readSources(repoRoot);
  await ensureDirectory(outputDir);
  await ensureDirectory(join(outputDir, 'assets/palladio'));

  for (const [source, destination] of [
    ['palladio/dist/css/palladio.css', 'assets/palladio/palladio.css'],
    ['palladio/components/navigation/navigation.css', 'assets/palladio/navigation.css'],
    ['palladio/components/card/card.css', 'assets/palladio/card.css'],
    ['palladio/components/badge/badge.css', 'assets/palladio/badge.css'],
    ['palladio/components/divider/divider.css', 'assets/palladio/divider.css'],
  ]) {
    await writeFileTree(outputDir, destination, sources[source]);
  }
  await writeFileTree(outputDir, 'assets/docs.css', `${DOCS_CSS.trimStart()}${documentationTypographyCss(tokens)}`);
  await writeFileTree(outputDir, 'assets/docs.js', DOCS_JS.trimStart());
  await writeFileTree(outputDir, 'tokens.json', `${JSON.stringify(tokens, null, 2)}\n`);

  const pages = buildPages({ components, packageJson, sources });
  for (const currentPage of pages) {
    const directory = join(outputDir, currentPage.route);
    await ensureDirectory(directory);
    await writeFile(join(directory, 'index.html'), shell({ body: currentPage.body, page: currentPage, packageVersion: packageJson.version }), 'utf8');
  }

  const searchIndex = pages.map((currentPage) => ({
    href: routeHref('', currentPage.route),
    text: stripMarkdown(currentPage.source || currentPage.body),
    title: currentPage.title,
  }));
  await writeFileTree(outputDir, 'search-index.json', `${JSON.stringify(searchIndex, null, 2)}\n`);
}

async function listFiles(root, path = '') {
  const directory = join(root, path);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(root, relativePath));
    else files.push(relativePath);
  }
  return files.sort();
}

async function assertSameTree(expectedDir, actualDir) {
  const [expectedFiles, actualFiles] = await Promise.all([listFiles(expectedDir), listFiles(actualDir)]);
  if (expectedFiles.join('\n') !== actualFiles.join('\n')) throw new Error('site/docs is stale: generated file list differs.');
  for (const file of expectedFiles) {
    const [expected, actual] = await Promise.all([readFile(join(expectedDir, file)), readFile(join(actualDir, file))]);
    if (!expected.equals(actual)) throw new Error(`site/docs is stale: generated content differs for ${file}.`);
  }
}

export async function buildDocumentation({ repoRoot = defaultRepoRoot, outputDir = join(defaultRepoRoot, 'site/docs'), check = false, allowExternalOutput = false } = {}) {
  const resolvedRoot = resolve(repoRoot);
  const resolvedOutput = resolve(outputDir);
  if (!allowExternalOutput && !resolvedOutput.startsWith(`${resolvedRoot}${process.platform === 'win32' ? '\\' : '/'}`)) throw new Error('Output directory must remain inside the repository.');

  if (check) {
    try { await stat(resolvedOutput); } catch { throw new Error('site/docs does not exist; run the documentation build first.'); }
    const temporary = await mkdtemp(join(tmpdir(), 'palladio-docs-check-'));
    try {
      await populate(temporary, resolvedRoot);
      await assertSameTree(temporary, resolvedOutput);
    } finally {
      await rm(temporary, { force: true, recursive: true });
    }
    return;
  }

  const temporary = await mkdtemp(join(tmpdir(), 'palladio-docs-build-'));
  try {
    await populate(temporary, resolvedRoot);
    await rm(resolvedOutput, { force: true, recursive: true });
    await ensureDirectory(dirname(resolvedOutput));
    await cp(temporary, resolvedOutput, { recursive: true });
  } finally {
    await rm(temporary, { force: true, recursive: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildDocumentation({ check: process.argv.includes('--check') }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
