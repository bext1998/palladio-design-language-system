# Changelog — @palladio/tokens

SemVer across all formats; they move together. A token **value** change is a
minor bump (visually breaking) with its impact noted here. See `README.md`
"Versioning".

## Unreleased

- Package renamed `@palladio/design-system` → `@palladio/tokens`; set up for
  public npm publish (`files`/`exports`/`publishConfig`, `bin`, compiled
  `dist/ts/tokens.js` + `.d.ts`, `dist/validate-accents.mjs`).
- `validateAccentPairs()` extracted to a dependency-free module and shipped as
  `@palladio/tokens/validate-accents` + `palladio-validate-accents` CLI.
- No token values changed.

## 0.1.0

- Initial token set: charcoal surface ladder, borders, text, semantic colours,
  accent slots (product-defined), typography scale, radius, motion, spacing,
  three density presets. Dark theme. CSS / TS / JSON / agent-reference artifacts.
