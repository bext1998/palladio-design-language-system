# @pdiodsgn/tokens

Generated design-token artifacts for the **Palladio Design Language & System** —
CSS custom properties, TypeScript, JSON and an agent reference, built from one
token source of truth.

This package is **not a UI kit**. It ships token values plus validation tools;
it does not ship component CSS. Components remain source-repo spec-validation
material, while the component validator gives consumers a build/CI guard for
their copied component markup.

- Design language: `docs/spec.md` chapters 1–8 in the [source repo](https://github.com/bext1998/palladio-design-language-system).
- The source repo (pipeline, spec, stress-test prototypes) is for Palladio
  maintainers. **Consuming products install this package — they do not clone the repo.**

## Install

```sh
npm install @pdiodsgn/tokens
```

Pin an exact version. Palladio's validation strategy is production-first
(`docs/spec.md` §11): a consuming product finds a gap, Palladio is updated and
republished, then the product bumps its pinned version and re-verifies. Track a
range (`^`) only for non-first-party consumers.

## What's in the package

| Entry | File | For |
|---|---|---|
| `@pdiodsgn/tokens` | `dist/ts/tokens.js` + `.d.ts` | React / TS — `palladioTokens`, `palladioDensity`, `palladioTheme` |
| `@pdiodsgn/tokens/css` | `dist/css/palladio.css` | The custom properties, theme + density variants |
| `@pdiodsgn/tokens/tokens.json` | `dist/json/tokens.json` | Go / Wails / any language — `semantic` · `density` · `theme` |
| `@pdiodsgn/tokens/tokens.ts` | `dist/ts/tokens.ts` | Source form, if you prefer to compile it yourself |
| `@pdiodsgn/tokens/agent-reference.md` | `dist/agent-reference.md` | AI coding agents — token overview + rules |
| `@pdiodsgn/tokens/validate-accents` | `dist/validate-accents.js` + `.d.ts` | `validateAccentPairs()` for your accent slots |
| `@pdiodsgn/tokens/validate-components` | `dist/validate-components.js` | Validate component HTML class, native-element and required ARIA contracts |

Every example below that names a version uses `<version>` — replace it with the
exact version you installed (see `package.json`). Do not use `latest` or an
unpinned range for first-party consumers; that breaks the production-first sync
(pin → gap → Palladio release → bump pin → re-verify).

## Using it

### React / bundled web app

```ts
import "@pdiodsgn/tokens/css";               // registers the custom properties
import { palladioTokens } from "@pdiodsgn/tokens"; // only when you need a value in JS

const surface = palladioTokens.color.surface.hex;
```

Theme and density are attribute-driven, set them on the root element. The
colour custom properties are declared **only** under `:root[data-theme="dark"]`
(dark is the one theme today; `docs/spec.md` §9.3). Without the attribute every
`--pd-color-*` is undefined — `data-theme="dark"` is required, not optional:

```html
<html data-theme="dark" data-density="compact">
```

### No-build page / landing page

```html
<!-- replace <version> with the exact version you want to pin -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@pdiodsgn/tokens@<version>/dist/css/palladio.css"
/>
<link rel="stylesheet" href="/accent.css" /> <!-- your product's own accent slots -->
```

```html
<html data-theme="dark">
  ...
</html>
```

```css
.button { background: var(--pd-color-accent); color: var(--pd-color-accent-text); }
```

### Go / Wails

At build time, fetch `tokens.json` for the exact version you pin — from
`https://cdn.jsdelivr.net/npm/@pdiodsgn/tokens@<version>/dist/json/tokens.json`
or the matching GitHub Release asset — into a temporary file your build script
writes, then `go:embed` it. Do **not** hand-copy the file into the repo where it
will never be updated. The Wails WebView loads the same-version CSS. No runtime
network fetch of tokens.

### AI coding agent

Point the consuming product's own `AGENTS.md` / context file at the
`agent-reference.md` URL for the version you pin (the file itself carries
release-tagged links back to the spec):
`https://cdn.jsdelivr.net/npm/@pdiodsgn/tokens@<version>/dist/agent-reference.md`.
The agent reads that one document; never feed it the whole Palladio repo.

## Accent slots

Palladio does **not** ship accent values and never derives or falls back for
them. Each product defines all six `--pd-color-accent-*` slots in its own
stylesheet, then validates them:

```ts
import { validateAccentPairs } from "@pdiodsgn/tokens/validate-accents";

validateAccentPairs(
  {
    accent: "#8E82F0", accentHover: "#A59BFF", accentActive: "#8170EA",
    accentDisabled: "#8F84B9", accentSubtle: "#1F1A38", accentText: "#141414",
  },
  [{ name: "icon on accent-subtle", foreground: "#A59BFF", background: "#1F1A38", kind: "ui" }],
); // throws if a slot is missing/invalid or a pair is below its A-M1 / A-M2 threshold
```

Or in CI, without importing (pin the same version as the rest of your build):

```sh
npx --package @pdiodsgn/tokens@<version> palladio-validate-accents ./palladio-accent.json
```

The full contract is `palladio/docs/accessibility/accessibility-contract.md` §9
in the source repo, at the `v<version>` tag.

## Component markup contracts

Use the validator against built HTML fragments that are expected to contain a
specific Palladio component. It rejects unknown `pd-*` classes and validates
the native-element and required-ARIA rules for the selected component. This is
intended for build/CI, including generated output; it is not a replacement for
reviewing component behavior or visual rendering.

```sh
npx --package @pdiodsgn/tokens@<version> palladio-validate-components \
  --component navigation ./dist/docs-navigation.html
```

The `navigation` target would reject the PR #70 regression: a `<nav>` using
`docs-nav__link--current` instead of `pd-nav__link--active` fails because the
root, list and active link no longer meet the Navigation contract. Pass each
component only for a focused HTML fragment (or a page section containing only
that component's native root); a selected target treats every matching native
element in that input as Palladio markup.

For programmatic use, the function returns errors without writing to stdout or
throwing, so the consumer controls its test framework:

```js
import { validateComponentHtml } from '@pdiodsgn/tokens/validate-components';

const errors = validateComponentHtml(html, { components: ['navigation'] });
if (errors.length > 0) throw new Error(errors.join('\n'));
```

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
