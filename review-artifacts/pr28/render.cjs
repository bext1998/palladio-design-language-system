const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/tiger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve('.git/pr28-review');
const out = __dirname;
const css = fs.readFileSync(path.join(root,'palladio/dist/css/palladio.css'),'utf8') + fs.readFileSync(path.join(root,'palladio/components/divider/divider.css'),'utf8');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({deviceScaleFactor:1});
 const results=[];
 for(const width of [1280,375]) for(const density of ['compact','default','spacious']){
  await page.setViewportSize({width,height:900});
  const html=`<!doctype html><html data-theme="dark" data-density="${density}"><meta charset="utf-8"><style>${css}
  body{margin:0;padding:24px;background:var(--pd-color-bg);color:var(--pd-color-text-primary);font:14px/1.5 Arial,sans-serif}h1{font-size:22px}h2{font-size:16px;margin:0 0 16px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}section{padding:20px}p{margin:0}.row{display:flex;align-items:stretch;margin-top:24px;height:64px}.row span{flex:1}small{color:var(--pd-color-text-secondary)}</style>
  <h1>Divider · ${density} · ${width}px</h1><p>PR #28 · horizontal / vertical · 1 CSS px · 16px spacing</p><br><div class="grid">${['bg','surface','surface-raised','surface-overlay','surface-hover'].map(s=>`<section style="background:var(--pd-color-${s})"><h2>${s}</h2><p>Section A · 第一段內容</p><hr class="pd-divider"><p>Section B · 第二段內容</p><div class="row"><span>Left<br>左側內容</span><hr class="pd-divider pd-divider--vertical" aria-orientation="vertical"><span>Right<br>右側內容</span></div></section>`).join('')}</div></html>`;
  fs.writeFileSync(path.join(out,`${density}-${width}.html`),html);
  await page.setContent(html);
  await page.screenshot({path:path.join(out,`${density}-${width}.png`),fullPage:true});
  results.push({width,density,metrics:await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,dividers:[...document.querySelectorAll('hr')].map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {vertical:e.classList.contains('pd-divider--vertical'),width:r.width,height:r.height,margin:s.margin,color:e.classList.contains("pd-divider--vertical")?s.borderLeftColor:s.borderTopColor,background:getComputedStyle(e.closest("section")).backgroundColor}})}))});
 }
 fs.writeFileSync(path.join(out,'metrics.json'),JSON.stringify(results,null,2));
 await browser.close();
 console.log("Browser: " + browser.version() + "; verified " + results.length + " render cases; metrics saved.");
})();
