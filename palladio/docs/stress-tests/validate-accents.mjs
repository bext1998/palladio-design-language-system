/**
 * Stress-test accent validation runner.
 *
 * Imports the official validateAccentPairs() from the Palladio pipeline
 * (accessibility-contract.md §9 flow) and runs it against each stress-test
 * product's explicitly provided accent slots (spec 2.5: products provide all
 * six slots; Palladio never derives or falls back).
 *
 * Usage: node palladio/docs/stress-tests/validate-accents.mjs
 * Exits non-zero if any product fails.
 */

import { validateAccentPairs } from '../../pipeline/validate-accessibility.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const products = ['landing-page'];

let failed = false;

for (const name of products) {
  const spec = JSON.parse(readFileSync(join(here, name, 'product.json'), 'utf8'));
  console.log(`\n=== ${spec.product}（palladio/docs/stress-tests/${name}/）===`);
  console.log(`accent slots: ${Object.values(spec.accent).join(' ')}`);

  const results = validateAccentPairs(spec.accent, spec.extraPairs ?? []);
  for (const r of results) {
    console.log(
      `  ${r.passes ? 'PASS' : 'FAIL'}  ${r.pair.padEnd(46)} ${r.ratio.toFixed(2)}:1 (門檻 ${r.threshold}:1)`
    );
    if (!r.passes) failed = true;
  }
}

console.log(failed ? '\n結果：FAIL — 存在未達門檻的配對' : '\n結果：ALL PASS — 全部配對達門檻');
process.exit(failed ? 1 : 0);