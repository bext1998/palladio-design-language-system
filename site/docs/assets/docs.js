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

function renderPageReferences(container, entries) {
  if (!container) return;
  const names = JSON.parse(container.dataset.tokenNames || '[]');
  const matches = entries.filter((entry) => entry.group !== 'theme' && names.includes(entry.name));
  container.innerHTML = matches.map((entry) => '<li><code>' + escapeHtml(tokenLabel(entry)) + '</code><br><span>' + escapeHtml(entry.value) + '</span></li>').join('') || '<li class="docs-muted">本頁未直接引用 Token。</li>';
}

async function setupPageReferences() {
  const container = document.querySelector('[data-page-token-references]');
  if (!container) return;
  const response = await fetch(root.dataset.docsBase + 'tokens.json');
  const tokens = await response.json();
  renderPageReferences(container, tokenEntries(tokens));
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

function setupNavPanel() {
  const button = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
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
    else panel.querySelector('a')?.focus();
  });
}

setupPageReferences().catch(() => {});
setupSearch().catch(() => {});
setupNavPanel();
