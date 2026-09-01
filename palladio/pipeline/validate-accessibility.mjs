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

function srgbToLinear(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(colorObj) {
  const [r, g, b] = colorObj.components;
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const A_M1_THRESHOLD = 4.5;
const A_M2_THRESHOLD = 3.0;
const DRIFT_TOLERANCE = 0.01;

// Expected ratios below are the ones documented and explained in
// palladio/docs/accessibility/accessibility-contract.md (section 3).
// `gated: true` means the token is used as a UI element that conveys a
// boundary/state (docs/spec.md 2.2, 8) — a focus/UI indicator or an input's
// identifiable edge — and is therefore subject to the A-M2 3:1 threshold.
// `gated: false` is reserved for tokens that are *only* a decorative divider
// (border-subtle: "幾乎與表面融合", spec 2.2). border-default is NOT decorative:
// spec 2.2 defines it as the standard input/card edge, so as an input boundary
// it is a non-text UI element under A-M2 (see accessibility-contract.md §3/§11).
const EXPECTED = [
  { token: 'border-subtle', surface: 'bg', ratio: 1.19, gated: false },
  { token: 'border-subtle', surface: 'surface', ratio: 1.10, gated: false },
  { token: 'border-default', surface: 'bg', ratio: 1.46, gated: true },
  { token: 'border-default', surface: 'surface', ratio: 1.35, gated: true },
  { token: 'border-default', surface: 'surface-raised', ratio: 1.23, gated: true },
  { token: 'border-default', surface: 'surface-overlay', ratio: 1.07, gated: true },
  { token: 'border-strong', surface: 'bg', ratio: 2.01, gated: true },
  { token: 'border-strong', surface: 'surface', ratio: 1.86, gated: true },
  { token: 'border-strong', surface: 'surface-raised', ratio: 1.70, gated: true },
  { token: 'border-strong', surface: 'surface-overlay', ratio: 1.48, gated: true }
];

// Confirmed gaps register — see accessibility-contract.md §11. A gated pair
// listed here is allowed to stay below 3:1 without failing this script.
// - border-strong: focus-ring base (spec 2.2), tracked in Issue #21.
// - border-default: standard input/card edge (spec 2.2); as an input boundary
//   it is an A-M2 UI element but is < 3:1 on every surface. Documented as a
//   confirmed gap in accessibility-contract.md §11; GitHub tracking (new issue
//   or expanding #21) is pending a maintainer decision — not created here.
const KNOWN_GAPS = new Set(['border-strong', 'border-default']);

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
  console.log('  (Confirmed A-M2 gaps — see docs/accessibility/accessibility-contract.md §11:');
  console.log('   - border-strong (focus-ring base), tracked in Issue #21;');
  console.log('   - border-default (input/card edge), GitHub tracking pending a maintainer decision.)');
}

// Only run the audit (and its console output) when this file is executed
// directly (`node pipeline/validate-accessibility.mjs` / `npm run validate:accessibility`),
// not when another module imports `validateAccentPairs` from it.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runBorderContrastAudit();
  runAccentPairsRegression();
}

function hexToColorObj(hex) {
  const clean = String(hex).replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const components = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
  return { components, hex: `#${clean.toUpperCase()}` };
}

/**
 * Validate a product's accent slot pairs per accessibility-contract.md §9
 * (docs/spec.md 2.5). Palladio does not derive or hold any product's accent
 * values, so this function is NOT called by this script's own run above —
 * it is exported for the product's own validation (Issue #15) to import
 * and call once real accent hex values are available.
 *
 * @param {{ accent: string, accentHover: string, accentActive: string, accentDisabled: string, accentSubtle: string, accentText: string }} accent
 *   All six required accent slots as "#rrggbb" strings (spec 2.5 mandates every slot; the product
 *   provides them, Palladio never derives or falls back). accentSubtle is presence-validated here but
 *   has no mandated fixed foreground/background pair of its own, so it is not part of the contrast
 *   checks below — list any pair a product actually renders on it via `extraPairs`.
 * @param {Array<{ name: string, foreground: string, background: string, kind: 'text' | 'largeText' | 'ui' }>} [extraPairs]
 *   Additional foreground/background pairs the product actually uses (spec 2.5 requires listing these
 *   in the product's own token docs). `kind` selects the required threshold and must be one of:
 *   - 'text'      → normal text, A-M1 (>= 4.5:1)
 *   - 'largeText' → large text (>=24px regular / >=18.5px bold), A-M2 (>= 3:1)
 *   - 'ui'        → non-text UI element (border/icon/etc.), A-M2 (>= 3:1)
 *   An unrecognised `kind` is rejected — it is never silently downgraded to a laxer threshold.
 * @returns {Array<{ pair: string, ratio: number, threshold: number, passes: boolean }>}
 */
export function validateAccentPairs(accent, extraPairs = []) {
  const required = ['accent', 'accentHover', 'accentActive', 'accentDisabled', 'accentSubtle', 'accentText'];
  for (const key of required) {
    if (!accent?.[key]) {
      throw new Error(`Missing required accent slot "${key}". Palladio does not fall back or derive accent values (spec 2.5).`);
    }
    // Every slot must be a well-formed "#rrggbb" hex color, even accentSubtle,
    // which has no mandated fixed contrast pair of its own (see JSDoc above) —
    // format validity is still required, it is just not paired against anything here.
    try {
      hexToColorObj(accent[key]);
    } catch {
      throw new Error(`Accent slot "${key}" is not a valid "#rrggbb" hex color: ${accent[key]}`);
    }
  }

  const results = [];

  // Mandatory pairs (spec 2.5): accent-text against accent / hover / active / disabled — A-M1 (4.5:1).
  for (const bg of ['accent', 'accentHover', 'accentActive', 'accentDisabled']) {
    const ratio = contrastRatio(hexToColorObj(accent.accentText), hexToColorObj(accent[bg]));
    results.push({ pair: `accent-text on ${bg}`, ratio, threshold: A_M1_THRESHOLD, passes: ratio >= A_M1_THRESHOLD });
  }

  // Product-listed extra pairs — the caller classifies each pair's `kind`, which
  // selects the required threshold. Unknown kinds are rejected, never downgraded.
  const KIND_THRESHOLDS = { text: A_M1_THRESHOLD, largeText: A_M2_THRESHOLD, ui: A_M2_THRESHOLD };
  for (const { name, foreground, background, kind } of extraPairs) {
    const threshold = KIND_THRESHOLDS[kind];
    if (threshold === undefined) {
      throw new Error(
        `Unknown extraPairs kind "${kind}" for pair "${name}". Use 'text' (A-M1 4.5:1), 'largeText' (A-M2 3:1) or 'ui' (A-M2 3:1).`
      );
    }
    const ratio = contrastRatio(hexToColorObj(foreground), hexToColorObj(background));
    results.push({ pair: name, ratio, threshold, passes: ratio >= threshold });
  }

  const failures = results.filter((r) => !r.passes);
  if (failures.length > 0) {
    throw new Error(
      `Accent contrast validation failed: ${failures.map((f) => `${f.pair} is ${f.ratio.toFixed(2)}:1 (< ${f.threshold}:1)`).join('; ')}`
    );
  }

  return results;
}

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
