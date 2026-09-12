export function luminance(colorObj: any): number;
export function contrastRatio(a: any, b: any): number;
export function hexToColorObj(hex: any): {
    components: number[];
    hex: string;
};
/**
 * Validate a product's accent slot pairs per accessibility-contract.md §9
 * (docs/spec.md 2.5). Palladio does not derive or hold any product's accent
 * values — the product provides all six slots.
 *
 * @param {{ accent: string, accentHover: string, accentActive: string, accentDisabled: string, accentSubtle: string, accentText: string }} accent
 *   All six required accent slots as "#rrggbb" strings. accentSubtle is
 *   presence-validated here but has no mandated fixed foreground/background pair
 *   of its own, so it is not part of the contrast checks below — list any pair a
 *   product actually renders on it via `extraPairs`.
 * @param {Array<{ name: string, foreground: string, background: string, kind: 'text' | 'largeText' | 'ui' }>} [extraPairs]
 *   Additional foreground/background pairs the product actually uses (spec 2.5
 *   requires listing these in the product's own token docs). `kind` selects the
 *   required threshold and must be one of:
 *   - 'text'      → normal text, A-M1 (>= 4.5:1)
 *   - 'largeText' → large text (>=24px regular / >=18.5px bold), A-M2 (>= 3:1)
 *   - 'ui'        → non-text UI element (border/icon/etc.), A-M2 (>= 3:1)
 *   An unrecognised `kind` is rejected — it is never silently downgraded to a laxer threshold.
 * @returns {Array<{ pair: string, ratio: number, threshold: number, passes: boolean }>}
 */
export function validateAccentPairs(accent: {
    accent: string;
    accentHover: string;
    accentActive: string;
    accentDisabled: string;
    accentSubtle: string;
    accentText: string;
}, extraPairs?: Array<{
    name: string;
    foreground: string;
    background: string;
    kind: "text" | "largeText" | "ui";
}>): Array<{
    pair: string;
    ratio: number;
    threshold: number;
    passes: boolean;
}>;
/**
 * Enable an accent-coloured focus ring only after the product has validated
 * that its accent is distinguishable from every focus backdrop it renders on.
 *
 * Components consume `--pd-color-focus-ring` with
 * `--pd-color-border-strong` as the CSS fallback. Clearing this property
 * before validation makes a missing call, an invalid accent, or a failed
 * re-validation fall back to that neutral A-M2-safe ring rather than leaving
 * a focus indicator invisible.
 *
 * @param {{ setProperty(name: string, value: string): void, removeProperty(name: string): void }} style
 *   The product root's `style` object, normally `document.documentElement.style`.
 * @param {{ accent: string, accentHover: string, accentActive: string, accentDisabled: string, accentSubtle: string, accentText: string }} accent
 *   The exact six accent slot values installed by the product.
 * @param {Array<{ name: string, background: string }>} focusBackdrops
 *   Every actual surface colour adjacent to the product's focus ring.
 * @returns {Array<{ pair: string, ratio: number, threshold: number, passes: boolean }>}
 */
export function enableValidatedAccentFocusRing(style: {
    setProperty(name: string, value: string): void;
    removeProperty(name: string): void;
}, accent: {
    accent: string;
    accentHover: string;
    accentActive: string;
    accentDisabled: string;
    accentSubtle: string;
    accentText: string;
}, focusBackdrops: Array<{
    name: string;
    background: string;
}>): Array<{
    pair: string;
    ratio: number;
    threshold: number;
    passes: boolean;
}>;
/**
 * Accent slot contrast contract — the pure, dependency-free half of the
 * accessibility contract that products consume directly.
 *
 * `validateAccentPairs()` is documented in
 * `palladio/docs/accessibility/accessibility-contract.md` §9 (docs/spec.md 2.5).
 * Palladio never derives or holds a product's accent values, so this module has
 * no token/pipeline imports: a product ships its own six `#rrggbb` slot values
 * and calls this at build time or in CI.
 *
 * The published package re-exports this file as
 * `@pdiodsgn/tokens/validate-accents` (see `pipeline/emit-dist-extras.mjs`).
 * `pipeline/validate-accessibility.mjs` also re-exports `validateAccentPairs`
 * for in-repo callers, and its own A-M2 border audit reuses `contrastRatio`
 * and `A_M2_THRESHOLD` from here.
 */
export const A_M1_THRESHOLD: 4.5;
export const A_M2_THRESHOLD: 3;
