# Changelog — @pdiodsgn/tokens

SemVer across all formats; they move together. A token **value** change is a
minor bump (visually breaking) with its impact noted here. See `README.md`
"Versioning".

## 0.1.1

- 驗證 Trusted Publishing 發佈流程。無 token / 產物內容變更（`agent-reference.md`
  僅版本字串與 tag URL 隨版號更新）。

## Unreleased

- Package renamed `@palladio/design-system` → `@pdiodsgn/tokens`; set up for
  public npm publish (`files`/`exports`/`publishConfig`, `bin`, compiled
  `dist/ts/tokens.js` + `.d.ts`).
- `validateAccentPairs()` extracted to a dependency-free module and shipped as
  `@pdiodsgn/tokens/validate-accents` (`dist/validate-accents.js` + `.d.ts`,
  `exports` declares `types`) + `palladio-validate-accents` CLI.
- `LICENSE` (MIT) now included in the package and the Release tarball.
- `agent-reference.md` rewritten for consumers who never clone the repo:
  package entry points and `v<version>`-tagged URLs instead of repo-relative
  paths and `npm run` scripts.
- No token values changed.

## 0.1.0

- Initial token set: charcoal surface ladder, borders, text, semantic colours,
  accent slots (product-defined), typography scale, radius, motion, spacing,
  three density presets. Dark theme. CSS / TS / JSON / agent-reference artifacts.
