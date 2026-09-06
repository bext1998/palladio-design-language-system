# @palladio/tokens

Generated design-token artifacts for the **Palladio Design Language & System** —
CSS custom properties, TypeScript, JSON and an agent reference, built from one
token source of truth.

This package is **not a UI kit**. It ships values and the accent-contrast
validator, nothing else. Components live in the source repo as spec-validation
material, not as a consumer contract.

- Design language: `docs/spec.md` chapters 1–8 in the [source repo](https://github.com/bext1998/palladio-design-language-system).
- The source repo (pipeline, spec, stress-test prototypes) is for Palladio
  maintainers. **Consuming products install this package — they do not clone the repo.**

## Install

```sh
npm install @palladio/tokens
```

Pin an exact version. Palladio's validation strategy is production-first
(`docs/spec.md` §11): a consuming product finds a gap, Palladio is updated and
republished, then the product bumps its pinned version and re-verifies. Track a
range (`^`) only for non-first-party consumers.

## What's in the package

| Entry | File | For |
|---|---|---|
| `@palladio/tokens` | `dist/ts/tokens.js` + `.d.ts` | React / TS — `palladioTokens`, `palladioDensity`, `palladioTheme` |
| `@palladio/tokens/css` | `dist/css/palladio.css` | The custom properties, theme + density variants |
| `@palladio/tokens/tokens.json` | `dist/json/tokens.json` | Go / Wails / any language — `semantic` · `density` · `theme` |
| `@palladio/tokens/tokens.ts` | `dist/ts/tokens.ts` | Source form, if you prefer to compile it yourself |
| `@palladio/tokens/agent-reference.md` | `dist/agent-reference.md` | AI coding agents — token overview + rules |
| `@palladio/tokens/validate-accents` | `dist/validate-accents.mjs` | `validateAccentPairs()` for your accent slots |

## Using it

### React / bundled web app

```ts
import "@palladio/tokens/css";               // registers the custom properties
import { palladioTokens } from "@palladio/tokens"; // only when you need a value in JS

const surface = palladioTokens.color.surface.hex;
```

Theme and density are attribute-driven, set them on the root element:

```html
<html data-theme="dark" data-density="compact">
```

### No-build page / landing page

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@palladio/tokens@0.1.0/dist/css/palladio.css"
/>
<link rel="stylesheet" href="/accent.css" /> <!-- your product's own accent slots -->
```

```css
.button { background: var(--pd-color-accent); color: var(--pd-color-accent-text); }
```

### Go / Wails

Fetch the pinned JSON at build time (a temporary file your build script
downloads — **not** a hand-copied file that never updates) and `go:embed` it, or
take it from the matching GitHub Release asset. The Wails WebView loads the
same-version CSS. No runtime network fetch of tokens.

### AI coding agent

Point the consuming product's own `AGENTS.md` / context file at the
version-tagged `agent-reference.md` raw URL. The agent reads that one document;
never feed it the whole Palladio repo.

## Accent slots

Palladio does **not** ship accent values and never derives or falls back for
them. Each product defines all six `--pd-color-accent-*` slots in its own
stylesheet, then validates them:

```ts
import { validateAccentPairs } from "@palladio/tokens/validate-accents";

validateAccentPairs(
  {
    accent: "#8E82F0", accentHover: "#A59BFF", accentActive: "#8170EA",
    accentDisabled: "#8F84B9", accentSubtle: "#1F1A38", accentText: "#141414",
  },
  [{ name: "icon on accent-subtle", foreground: "#A59BFF", background: "#1F1A38", kind: "ui" }],
); // throws if a slot is missing/invalid or a pair is below its A-M1 / A-M2 threshold
```

Or in CI, without importing:

```sh
npx --package @palladio/tokens palladio-validate-accents ./palladio-accent.json
```

See `docs/accessibility/accessibility-contract.md` §9 in the source repo for the
full contract.

## Versioning

One SemVer across all formats; they always move together.

| Change | Bump |
|---|---|
| Token renamed or removed; CSS selector / JSON shape / TS type change | **major** |
| Token added; new consumer capability | **minor** |
| Token **value** changed (colour, size, timing) | **minor** — a value change is visually breaking; changelog notes the impact |
| Non-visual fix (doc typo, build metadata) | patch |

`0.x`: breaking changes may land in a minor bump until the contract stabilises.

## License

MIT © Tiger Zhang
