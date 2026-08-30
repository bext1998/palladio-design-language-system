import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectTokenRecords, loadTokenSources } from './token-model.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, '..');
const distDir = path.join(packageDir, 'dist');

const cssPath = path.join(distDir, 'css/palladio.css');
const tsPath = path.join(distDir, 'ts/tokens.ts');
const jsonPath = path.join(distDir, 'json/tokens.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}

function assertFileExists(filePath) {
  assert(fs.existsSync(filePath), `Missing artifact: ${path.relative(packageDir, filePath)}`);
}

function cssBlock(source, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`^${escapedSelector}\\s*\\{([\\s\\S]*?)\\}`, 'm'));
  assert(match, `CSS selector not found: ${selector}`);
  return match[1];
}

function cssVariable(block, name) {
  const match = block.match(new RegExp(`^\\s*--${name}:\\s*([^;]+);$`, 'm'));
  assert(match, `CSS variable not found: --${name}`);
  return match[1].trim();
}

assertFileExists(cssPath);
assertFileExists(tsPath);
assertFileExists(jsonPath);

const css = fs.readFileSync(cssPath, 'utf8');
const ts = fs.readFileSync(tsPath, 'utf8');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const themeBlock = cssBlock(css, ':root[data-theme="dark"]');
const defaultDensityBlock = cssBlock(css, ':root[data-density]');
const compactBlock = cssBlock(css, ':root[data-density="compact"]');
const spaciousBlock = cssBlock(css, ':root[data-density="spacious"]');

assertEqual(cssVariable(themeBlock, 'pd-color-bg'), '#141414', 'Dark theme background');
assertEqual(cssVariable(themeBlock, 'pd-color-text-primary'), '#F0F0F0', 'Dark theme primary text');
assertEqual(cssVariable(defaultDensityBlock, 'pd-density-component-min-interactive-size'), '36px', 'Default density minimum interactive size');
assertEqual(cssVariable(compactBlock, 'pd-density-component-min-interactive-size'), '32px', 'Compact density minimum interactive size');
assertEqual(cssVariable(spaciousBlock, 'pd-density-component-min-interactive-size'), '48px', 'Spacious density minimum interactive size');

assert(ts.includes('export const palladioTokens =') && ts.includes(' as const;'), 'palladioTokens is not a const object');
assert(ts.includes('export const palladioDensity =') && ts.includes(' as const;'), 'palladioDensity is not a const object');
assert(ts.includes('export const palladioTheme =') && ts.includes(' as const;'), 'palladioTheme is not a const object');

assert(JSON.stringify(Object.keys(json)) === JSON.stringify(['semantic', 'density', 'theme']), 'JSON artifact top-level structure is incorrect');
assert(JSON.stringify(Object.keys(json.density)) === JSON.stringify(['compact', 'default', 'spacious']), 'JSON density keys are incorrect');
assert(JSON.stringify(Object.keys(json.theme)) === JSON.stringify(['dark']), 'JSON theme keys are incorrect');
assertEqual(json.semantic.color.bg.hex, '#141414', 'JSON semantic background');
assertEqual(json.density.default.density.component['min-interactive-size'].value, 36, 'JSON default density minimum interactive size');
assertEqual(json.theme.dark.color.bg.hex, '#141414', 'JSON dark theme background');

const sources = loadTokenSources(packageDir);
const primitivePaths = new Set(collectTokenRecords(sources.primitive, sources.primitive).map((record) => record.path));
const artifactContent = JSON.stringify(json);
const leakedPrimitivePaths = [...primitivePaths].filter((primitivePath) => artifactContent.includes(`"${primitivePath}"`));
assert(leakedPrimitivePaths.length === 0, `Primitive tokens leaked into JSON artifact: ${leakedPrimitivePaths.join(', ')}`);

const before = {
  css: fs.readFileSync(cssPath, 'utf8'),
  ts: fs.readFileSync(tsPath, 'utf8'),
  json: fs.readFileSync(jsonPath, 'utf8')
};
execFileSync(process.execPath, [path.join(packageDir, 'pipeline/config.js')], { cwd: packageDir, stdio: 'ignore' });
assert(fs.readFileSync(cssPath, 'utf8') === before.css, 'Rebuild changed CSS artifact unexpectedly.');
assert(fs.readFileSync(tsPath, 'utf8') === before.ts, 'Rebuild changed TypeScript artifact unexpectedly.');
assert(fs.readFileSync(jsonPath, 'utf8') === before.json, 'Rebuild changed JSON artifact unexpectedly.');

console.log('Validated CSS, TypeScript and JSON artifacts.');
