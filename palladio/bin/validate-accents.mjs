#!/usr/bin/env node
/**
 * CLI wrapper around `validateAccentPairs()` for a product's CI / build.
 *
 *   npx --package @palladio/tokens palladio-validate-accents ./palladio-accent.json
 *
 * Input JSON shape:
 *   {
 *     "accent":         "#8E82F0",
 *     "accentHover":    "#A59BFF",
 *     "accentActive":   "#8170EA",
 *     "accentDisabled": "#8F84B9",
 *     "accentSubtle":   "#1F1A38",
 *     "accentText":     "#141414",
 *     "extraPairs": [
 *       { "name": "icon on accent-subtle", "foreground": "#A59BFF", "background": "#1F1A38", "kind": "ui" }
 *     ]
 *   }
 *
 * Exit code 0 = all pairs pass. Non-zero = a slot is missing/invalid or a pair
 * is below its A-M1 / A-M2 threshold. Palladio never derives or fills accent
 * values — the product owns this file.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateAccentPairs } from '../dist/validate-accents.js';

const file = process.argv[2];
if (!file) {
  console.error('usage: palladio-validate-accents <accent.json>');
  process.exit(2);
}

let input;
try {
  input = JSON.parse(await readFile(path.resolve(file), 'utf8'));
} catch (err) {
  console.error(`Could not read/parse ${file}: ${err.message}`);
  process.exit(2);
}

const { extraPairs = [], ...accent } = input;

try {
  const results = validateAccentPairs(accent, extraPairs);
  for (const r of results) {
    console.log(`  ${r.passes ? 'PASS' : 'FAIL'}  ${r.pair}: ${r.ratio.toFixed(2)}:1 (>= ${r.threshold}:1)`);
  }
  console.log(`\n${results.length} pair(s) checked — all pass.`);
} catch (err) {
  console.error(`\nAccent validation failed: ${err.message}`);
  process.exit(1);
}
