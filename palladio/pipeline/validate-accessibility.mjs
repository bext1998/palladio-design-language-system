/**
 * Accessibility Contract Validation Script for Palladio Design System
 *
 * Companion to `validate-tokens.mjs`. That script already enforces A-M1
 * (general text contrast >= 4.5:1) dynamically. This script covers the part
 * of the accessibility contract A-M1 does not: A-M2 (>= 3:1) for non-text UI
 * elements — specifically the border/focus-ring tokens.
 *
 * Full rule documentation, rationale and the "known gap" register live in
 * `palladio/docs/accessibility/accessibility-contract.md` (Issue #3). This
 * script is the machine-checkable half of that document:
 *
 * - Every border token x surface pair below has an EXPECTED contrast ratio.
 *   If the actual computed ratio drifts from the expected value (someone
 *   changed a token without updating the accessibility doc), the script
 *   throws — this is regression detection, not a compliance judgement.
 * - Pairs marked `gated: true` are additionally checked against the A-M2
 *   3:1 threshold. A pair listed in KNOWN_GAPS is allowed to stay below
 *   3:1 (documented, tracked, not silently ignored); a gated pair that is
 *   NOT in KNOWN_GAPS must pass 3:1 or the script throws — this is what
 *   catches a *new*, previously-undocumented A-M2 violation.
 * - If a KNOWN_GAPS pair unexpectedly starts passing 3:1 (i.e. someone
 *   fixed the underlying token), the script prints a reminder to update
 *   the "known gaps" table in the accessibility doc, but does not fail.
 */

import { fileURLToPath } from 'node:url';
import { loadTokenSources, resolveRef } from './token-model.mjs';
import {
  contrastRatio,
  hexToColorObj,
  A_M1_THRESHOLD,
  A_M2_THRESHOLD,
  validateAccentPairs
} from './accent-contract.mjs';

// `validateAccentPairs` lives in the dependency-free accent-contract module so
// the published package can ship it without the pipeline. Re-exported here for
// in-repo callers that historically imported it from this file.
export { validateAccentPairs } from './accent-contract.mjs';

const DRIFT_TOLERANCE = 0.01;

// Expected ratios below are the ones documented and explained in
// palladio/docs/accessibility/accessibility-contract.md (section 3).
// `gated: true` means the token is used as a UI element that conveys a
// boundary/state (docs/spec.md 2.2, 8) — a focus/UI indicator or an input's
// identifiable edge — and is therefore subject to the A-M2 3:1 threshold.
// `gated: false` is reserved for tokens that are *only* decorative borders
// (border-subtle and border-default, spec 2.2). Input's identifiable boundary
// is input-border, which is gated under A-M2 (see accessibility-contract.md §3).
const EXPECTED = [
  { token: 'border-subtle', surface: 'bg', ratio: 1.19, gated: false },
  { token: 'border-subtle', surface: 'surface', ratio: 1.10, gated: false },
  { token: 'border-default', surface: 'bg', ratio: 1.46, gated: false },
  { token: 'border-default', surface: 'surface', ratio: 1.35, gated: false },
  { token: 'border-default', surface: 'surface-raised', ratio: 1.23, gated: false },
  { token: 'border-default', surface: 'surface-overlay', ratio: 1.07, gated: false },
  { token: 'input-border', surface: 'bg', ratio: 4.29, gated: true },
  { token: 'input-border', surface: 'surface', ratio: 3.97, gated: true },
  { token: 'input-border', surface: 'surface-raised', ratio: 3.62, gated: true },
  { token: 'input-border', surface: 'surface-overlay', ratio: 3.16, gated: true },
  { token: 'border-strong', surface: 'bg', ratio: 4.29, gated: true },
  { token: 'border-strong', surface: 'surface', ratio: 3.97, gated: true },
  { token: 'border-strong', surface: 'surface-raised', ratio: 3.62, gated: true },
  { token: 'border-strong', surface: 'surface-overlay', ratio: 3.16, gated: true }
];

// Confirmed gaps register — see accessibility-contract.md §11. A gated pair
// listed here is allowed to stay below 3:1 without failing this script.
// Issue #24 resolves the former Input boundary gap; keep this set for future
// documented exceptions rather than silently permitting a new A-M2 violation.
const KNOWN_GAPS = new Set();

/** Runs the border/focus-ring A-M2 audit against the live token sources. Throws on drift or an undocumented A-M2 violation. */
function runBorderContrastAudit() {
  const { primitive, theme } = loadTokenSources();
  const registry = primitive;
  const darkColors = theme.dark.pd.color;
  const resolvedColor = (name) => resolveRef(darkColors[name].$value, registry);
  const resolvedSurfaces = Object.fromEntries(
    ['bg', 'surface', 'surface-raised', 'surface-overlay'].map((name) => [name, resolvedColor(name)])
  );

  console.log('=== Palladio Accessibility Contract Validation (A-M2 — UI element contrast) ===\n');

  let sawUnexpectedFailure = false;

  for (const { token, surface, ratio: expectedRatio, gated } of EXPECTED) {
    const tokenColor = resolvedColor(token);
    const surfaceColor = resolvedSurfaces[surface];
    const actual = contrastRatio(tokenColor, surfaceColor);

    if (Math.abs(actual - expectedRatio) > DRIFT_TOLERANCE) {
      throw new Error(
        `Contrast drift detected for ${token} (${tokenColor.hex}) on ${surface} (${surfaceColor.hex}): ` +
          `expected ${expectedRatio.toFixed(2)}:1 (as documented in accessibility-contract.md), got ${actual.toFixed(2)}:1. ` +
          'Update the token intentionally and refresh the accessibility doc, or revert the change.'
      );
    }

    const passesAM2 = actual >= A_M2_THRESHOLD;
    const label = `${token} (${tokenColor.hex}) on ${surface} (${surfaceColor.hex}) => ${actual.toFixed(2)}:1`;

    if (!gated) {
      console.log(`[decorative, A-M2 n/a] ${label}`);
      continue;
    }

    if (passesAM2) {
      if (KNOWN_GAPS.has(token)) {
        console.log(`[A-M2 ✔ — was a known gap, now passing] ${label} — update accessibility-contract.md §11.`);
      } else {
        console.log(`[A-M2 ✔] ${label}`);
      }
    } else if (KNOWN_GAPS.has(token)) {
      console.log(`[A-M2 ✘ — confirmed gap, see accessibility-contract.md §11] ${label}`);
    } else {
      console.log(`[A-M2 ✘ — UNDOCUMENTED VIOLATION] ${label}`);
      sawUnexpectedFailure = true;
    }
  }

  if (sawUnexpectedFailure) {
    throw new Error(
      'A-M2 violation found on a pair that is not in the documented known-gaps register. ' +
        'Either fix the token, or add it to KNOWN_GAPS here and to accessibility-contract.md §11 with a rationale.'
    );
  }

  console.log('\n✔ Accessibility contract audit complete. All pairs match documented, expected values.');
  console.log('  (No confirmed A-M2 gaps — see docs/accessibility/accessibility-contract.md §11.)');
}

// Only run the audit (and its console output) when this file is executed
// directly (`node pipeline/validate-accessibility.mjs` / `npm run validate:accessibility`),
// not when another module imports `validateAccentPairs` from it.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runBorderContrastAudit();
  runAccentPairsRegression();
}

// `hexToColorObj` and `validateAccentPairs` now live in `./accent-contract.mjs`
// (imported and re-exported at the top of this file) so the published package
// can ship the accent validator without the Style Dictionary pipeline.

/**
 * Regression coverage for validateAccentPairs() — the behaviours the PR #22
 * review required. Runs as part of `npm run validate:accessibility`; throws if
 * any case regresses. No test framework is used in this repo, matching the
 * other pipeline validators (validate-tokens.mjs / validate-artifacts.mjs).
 */
function runAccentPairsRegression() {
  // A fully-populated, passing accent set: white text on black backgrounds is
  // 21:1, comfortably above A-M1, so the mandatory accent-text pairs pass and
  // the extraPairs behaviour is what the case under test actually exercises.
  const goodAccent = {
    accent: '#000000', accentHover: '#000000', accentActive: '#000000',
    accentDisabled: '#000000', accentSubtle: '#333333', accentText: '#FFFFFF'
  };
  // #8A8A8A on #FFFFFF is 3.45:1 — between the A-M2 (3:1) and A-M1 (4.5:1)
  // thresholds, so it must pass as largeText and fail as normal text.
  const midPair = { name: 'mid', foreground: '#8A8A8A', background: '#FFFFFF' };

  const expectThrow = (fn, label) => {
    let threw = false;
    try { fn(); } catch { threw = true; }
    if (!threw) throw new Error(`Accent regression failed: expected "${label}" to throw, but it did not.`);
  };
  const expectPass = (fn, label) => {
    try { fn(); } catch (e) { throw new Error(`Accent regression failed: expected "${label}" to pass, but it threw: ${e.message}`); }
  };

  // 1. Missing accentSubtle must be rejected (spec 2.5: all six slots required).
  const { accentSubtle, ...withoutSubtle } = goodAccent;
  expectThrow(() => validateAccentPairs(withoutSubtle), 'missing accentSubtle');

  // 1b. A malformed accentSubtle (present but not a valid hex color) must also
  // be rejected — presence alone is not enough, format is still validated.
  expectThrow(
    () => validateAccentPairs({ ...goodAccent, accentSubtle: 'not-a-hex-colour' }),
    'malformed accentSubtle rejected'
  );

  // 2. A 3.45:1 pair passes as large text (A-M2 3:1).
  expectPass(() => validateAccentPairs(goodAccent, [{ ...midPair, kind: 'largeText' }]), '3.45:1 large text passes A-M2');

  // 3. The same 3.45:1 pair fails as normal text (A-M1 4.5:1).
  expectThrow(() => validateAccentPairs(goodAccent, [{ ...midPair, kind: 'text' }]), '3.45:1 normal text fails A-M1');

  // 4. An unknown kind is rejected, not silently downgraded.
  expectThrow(() => validateAccentPairs(goodAccent, [{ ...midPair, kind: 'decorative' }]), 'unknown extraPairs kind rejected');

  console.log('\n✔ validateAccentPairs regression checks passed (accentSubtle required; largeText/text/unknown kind handling).');
}
