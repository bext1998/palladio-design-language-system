const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/tiger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.resolve(__dirname, '../..');
const output = __dirname;
const cssPaths = [
  'palladio/dist/css/palladio.css',
  'palladio/components/button/button.css',
  'palladio/components/input/input.css',
  'palladio/components/badge/badge.css',
  'palladio/components/card/card.css',
  'palladio/components/navigation/navigation.css',
  'palladio/components/divider/divider.css',
];
const css = cssPaths.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');

function pageHtml(density) {
  return `<!doctype html><html lang="zh-Hant" data-theme="dark" data-density="${density}"><head><meta charset="utf-8"><style>${css}
  :root { --pd-color-accent:#d9814f; --pd-color-accent-hover:#e4a079; --pd-color-accent-active:#b96739; --pd-color-accent-disabled:#6f4835; --pd-color-accent-subtle:#4b3024; --pd-color-accent-text:#141414; }
  body { margin:0; padding:24px; background:var(--pd-color-bg); color:var(--pd-color-text-primary); font:var(--pd-text-body-md); }
  main { max-width:1120px; margin:auto; } h1 { margin:0 0 8px; font:inherit; font-size:24px; } h2 { margin:0 0 16px; font:inherit; font-size:16px; } p { margin:0; color:var(--pd-color-text-secondary); }
  .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:24px; margin-top:24px; } section { min-width:0; padding:20px; background:var(--pd-color-surface); border:1px solid var(--pd-color-border-default); }
  .stack { display:flex; flex-wrap:wrap; align-items:center; gap:12px; } .field-stack { display:grid; gap:16px; max-width:360px; } .pd-input { inline-size:100%; } .pd-nav { max-width:280px; }
  .pd-card { max-width:360px; } .pd-card h3 { margin:0 0 8px; font:inherit; font-size:16px; } .pd-card p { margin:0; }
  .divider-row { display:flex; align-items:stretch; min-height:52px; } .divider-row > span { flex:1; }
  @media (max-width:600px) { body { padding:16px; } .grid { grid-template-columns:1fr; gap:16px; } section { padding:16px; } }
  </style></head><body><main><h1>Palladio 元件檢查 · ${density}</h1><p>Foundation token 載入後的實際元件渲染；accent 插槽是測試產品提供值。</p><div class="grid">
  <section><h2>Button</h2><div class="stack"><button class="pd-button">儲存</button><button class="pd-button pd-button--pill">發佈</button><button class="pd-button" disabled>無法儲存</button></div></section>
  <section><h2>Badge</h2><div class="stack"><span class="pd-badge">Draft</span><span class="pd-badge pd-badge--success">Published</span><span class="pd-badge pd-badge--warning">Review</span><span class="pd-badge pd-badge--danger">Failed</span><button class="pd-badge pd-badge--interactive">All tags ×</button></div></section>
  <section><h2>Input</h2><div class="field-stack"><div class="pd-field"><label class="pd-field__label" for="name">姓名</label><input class="pd-input" id="name" placeholder="王小明"></div><div class="pd-field pd-field--error"><label class="pd-field__label" for="email">電子郵件</label><input class="pd-input" id="email" aria-invalid="true" aria-describedby="email-message" value="invalid"><p class="pd-field__message" id="email-message">請輸入有效的電子郵件地址。</p></div></div></section>
  <section><h2>Navigation</h2><nav class="pd-nav" aria-label="範例導覽"><ul class="pd-nav__list"><li><a class="pd-nav__link pd-nav__link--active" href="#active" aria-current="page">設計基礎</a></li><li><a class="pd-nav__link" href="#components">元件</a></li><li><a class="pd-nav__link" aria-disabled="true">封存項目</a></li></ul></nav></section>
  <section><h2>Card</h2><a class="pd-card pd-card--interactive" href="#card"><h3>待審查</h3><p>需要獨立互動邊界時，才使用 Card。</p></a></section>
  <section><h2>Divider</h2><p>第一段內容</p><hr class="pd-divider"><p>第二段內容</p><div class="divider-row"><span>左側內容</span><hr class="pd-divider pd-divider--vertical" aria-orientation="vertical"><span>右側內容</span></div></section>
  </div></main></body></html>`;
}

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const results = [];
  for (const width of [1280, 375]) for (const density of ['compact', 'default', 'spacious']) {
    await page.setViewportSize({ width, height: 900 });
    const html = pageHtml(density);
    const htmlPath = path.join(output, `${density}-${width}.html`);
    const pngPath = path.join(output, `${density}-${width}.png`);
    fs.writeFileSync(htmlPath, html);
    await page.setContent(html);
    await page.screenshot({ path: pngPath, fullPage: true });
    const initial = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      minInteractive: [...document.querySelectorAll('.pd-button, .pd-input, .pd-badge--interactive, .pd-nav__link')].map((element) => ({ cls: element.className, height: element.getBoundingClientRect().height })),
      transitions: [...document.querySelectorAll('.pd-button, .pd-input, .pd-card--interactive, .pd-nav__link')].map((element) => ({ cls: element.className, transition: getComputedStyle(element).transitionDuration })),
    }));
    await page.hover('.pd-button');
    await page.waitForTimeout(150);
    const hoverButton = await page.locator('.pd-button').first().evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.locator('.pd-input').first().focus();
    const focusInput = await page.locator('.pd-input').first().evaluate((element) => ({ outline: getComputedStyle(element).outline, outlineOffset: getComputedStyle(element).outlineOffset }));
    results.push({ width, density, initial, hoverButton, focusInput });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setContent(pageHtml('default'));
  results.push({ reducedMotion: await page.evaluate(() => [...document.querySelectorAll('.pd-button, .pd-input, .pd-card--interactive, .pd-nav__link')].map((element) => ({ cls: element.className, transition: getComputedStyle(element).transitionDuration }))) });
  fs.writeFileSync(path.join(output, 'metrics.json'), JSON.stringify(results, null, 2));
  await browser.close();
  console.log(`Rendered ${results.length - 1} visual cases and one reduced-motion case.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
