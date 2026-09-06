---
name: palladio-design-tokens
description: 建立或修改前端 UI（元件、頁面、CSS、React 視圖、桌面 WebView）時，套用 Palladio design tokens：強制 semantic-only、theme/density 屬性、accent 六插槽與可及性硬規則。使用者或任務指定「用 Palladio」或 `@pdiodsgn/tokens` 時使用；不因專案裝了套件就自動觸發。
invocation: both
---

# palladio-design-tokens

## 目標

用 Palladio 的 Semantic token 建構或修改 UI，讓輸出在 dark theme 與三種 density 下都成立、符合可及性硬規則，且不把產品的 accent 責任推回設計系統。

## 觸發與安全

- 只有使用者或任務明確要求「用 Palladio」「用 `@pdiodsgn/tokens`」時才啟用本 Skill。專案的 `node_modules` 有這個套件、或 repo 有 `palladio.css`，都不是觸發條件。
- 本 Skill 不修改 token 來源、不發佈套件、不改任何 `@pdiodsgn/tokens` 的檔案。它只規範「消費端怎麼用 token」。

## 前置條件

1. 確認消費端已取得 token 產物。依環境擇一，細節見 `references/integration.md`：
   - JS／React／打包網頁 → 專案已 `npm install @pdiodsgn/tokens`（pin 精確版本）
   - 無 build 網頁 → 版本鎖定的 CDN URL
   - Go／Wails／其他語言 → build 時取得 `tokens.json`
   - 都沒有 → 停下來，先讓使用者裝好，不要自己 `npm install`
2. **token 數值一律以消費端安裝的產物為準**，不要靠記憶。要查具體 token 名稱與值時，讀該版本的 `agent-reference.md`（取得方式見 `references/integration.md` 的「AI coding agent」段）。
3. 開始寫 UI 前，讀 `references/consuming.md`（規則、禁止事項、反例）。

## 核心規則（完整版與反例見 `references/consuming.md`）

1. **只用 Semantic 層**：UI 只能引用 `--pd-*` 自訂屬性或 `@pdiodsgn/tokens` 匯出的 `palladioTokens` / `palladioDensity` / `palladioTheme`。**不得**出現裸 hex、裸 px、或 Primitive token —— 即使數值剛好相等。
2. **Theme 是必要屬性**：色彩只宣告在 `:root[data-theme="dark"]`。根元素沒有 `data-theme="dark"` 時所有 `--pd-color-*` 未定義。目前只有 dark，不要假設有其他 theme。
3. **Density 靠屬性、不改結構**：`data-density="compact"` / `"spacious"`（省略為 Default）。三種 density 下元件結構不變，只有 padding、最小互動尺寸、body 字級跟著換。
4. **Accent 六插槽是產品責任**：`--pd-color-accent` / `-hover` / `-active` / `-disabled` / `-subtle` / `-text` 全部由消費端自己定義。**不得**加 fallback、推導色值、跨插槽湊或混色。改動 accent 後用 `validateAccentPairs()`（`@pdiodsgn/tokens/validate-accents`）或 CLI `palladio-validate-accents accent.json` 驗證。
5. **可及性硬規則不可放寬**：A-M1 一般文字 ≥4.5:1、A-M2 大字與 UI 元件 ≥3:1、A-M3 可見 focus indicator、A-M4 `prefers-reduced-motion` 停用非必要動畫、A-M5 不只用色彩傳達狀態、A-M6 最小互動尺寸依 density。
6. **focus ring 用 `--pd-color-border-strong`**；**Input 可識別邊界用 `--pd-color-input-border`**，不要用 `--pd-color-border-default`（那是裝飾性 card edge）。

## 邊界

- 不修改 `@pdiodsgn/tokens` 套件內任何檔案；缺 token 就回報「Palladio 沒有涵蓋這個決策」，不要自己補一個。
- 不為了讓畫面「看起來對」而繞過規則（例：直接寫 `#8E82F0` 而不是 `var(--pd-color-accent)`、把 `data-theme` 硬編進元件、用色差取代 A-M2 對比）。
- 不宣稱「已符合 Palladio」除非：所有 UI 值都是 Semantic token、`data-theme="dark"` 在根元素、accent 六插槽齊備且過驗證、focus indicator 對相鄰表面達 A-M2。
