# Badge / Tag

`Badge` 是一個小型的 pill 標籤，框架無關，可用在非互動的 `<span>`（純資訊展示）或互動的 `<button>`／`<a>`（可點擊的 filter tag、可移除的標籤觸發器等）。根元素須先套用 Foundation 的 `data-theme="dark"`，載入 `palladio/dist/css/palladio.css` 後再載入 `badge.css`。**Badge 一律要有文字 label**——不提供純色點／色塊變體（A-M5：色彩不可作為唯一資訊傳達手段）。

```html
<!-- 非互動：純資訊展示 -->
<span class="pd-badge">Draft</span>
<span class="pd-badge pd-badge--success">Published</span>
<span class="pd-badge pd-badge--danger">Failed</span>

<!-- 需要品牌強調色時，使用產品提供的 accent-subtle / accent-text -->
<span class="pd-badge pd-badge--accent">Beta</span>

<!-- 互動：可點擊的 filter tag -->
<button class="pd-badge pd-badge--interactive" type="button">All tags ×</button>
<button class="pd-badge pd-badge--interactive" type="button" disabled>Archived</button>
```

## 顯示、互動與非互動語意

- **顯示（base）**：`.pd-badge` 定義外觀——`pd-radius-full` 的 pill 形狀、`pd-color-surface-raised` 背景、`pd-color-text-primary` 文字。單獨使用時（搭配 `<span>`）是純資訊展示，不具游標、hover、focus 或 disabled 語意。
- **非互動**：語意變體（`--success`／`--warning`／`--danger`／`--info`）與 `--accent` 只覆寫 `color` 或 `background-color`，本身不隱含可點擊——放在 `<span>` 上即為狀態標籤。
- **互動**：加上 `.pd-badge--interactive` 並改用 `<button>`（或 `<a>`）才具備 hover／active／focus／disabled 四種狀態，適合可點擊的 filter tag 或移除觸發器。

## 語意（狀態）變體

| Class | 用途 | 對比驗證 |
|---|---|---|
| `.pd-badge`（預設） | 中性標籤 | `text-primary` 對 `surface-raised`：13.62:1（A-M1，已由 `accessibility-contract.md` 第二節驗證） |
| `.pd-badge--success` / `--warning` / `--danger` / `--info` | 系統狀態（非品牌色） | 四個語意色對 `surface-raised` 皆 ≥5.25:1（A-M1，見 `accessibility-contract.md` 第二節），背景維持中性 `surface-raised`，不新增未驗證的著色背景 |
| `.pd-badge--accent` | 品牌強調（需要產品 accent） | 使用產品提供的 `pd-color-accent-subtle` 背景與 `pd-color-accent-text` 文字。**這組配對不在 Palladio 保證驗證的四組 accent-text 配對內**（`accessibility-contract.md` 第九節：`accent-text` 只對 `accent`／`accent-hover`／`accent-active`／`accent-disabled` 四個背景有強制驗證）。產品必須把 `{ name: 'badge-accent-subtle', foreground: accentText, background: accentSubtle, kind: 'text' }` 加進呼叫 `validateAccentPairs()` 時的 `extraPairs`，自行驗證這組實際色值符合 A-M1（一般文字尺寸）或 A-M2（若視覺上算大字）。**不得**為未驗證的 accent-subtle 配對推導或假設任何 fallback 前景色。

若用於狀態語意，`.pd-badge--success` 等變體必須維持文字 label（例如「Published」而非只有色點），符合可及性契約第七節對 Badge/Tag 的 A-M5 checklist。

## Density

- `.pd-badge` 本身不隨 density 改變 padding／尺寸——`pd-space-1`／`pd-space-2` 是固定的 4px 倍數，文字仍會透過繼承的 `font: inherit` 反映當前 density 的 body 字級（13／14／15px），因此三種 density 下 Badge 仍會呈現對應字級，但外觀比例（pill 高度、padding）刻意保持一致，不像 Button／Input 隨 density 明顯放大縮小——一個小型資訊標籤沒有理由隨 density 變成更大的可點擊目標。
- `.pd-badge--interactive` 是例外：因為它是真正的互動元件，受規格 A-M6「互動元素最小尺寸依 density preset 對應值」約束，因此消費 `--pd-density-component-min-interactive-size`（32／36／48px）與 `--pd-density-component-padding-horizontal`，與 Button 的密度行為一致。這代表互動版 Badge 在視覺上會比純資訊版更高——這是刻意的取捨，用來滿足 A-M6，而非疏漏。

## Typography

規格 3.2 把 `pd-text-label-sm`（12px / 500 / line-height 1）明確標註為「小型標籤、badge」用途。但 `--pd-text-label-sm` 目前產出的 CSS 自訂屬性是描述性組合字串（例如 `Noto Sans, ... 12px font-weight 500 line-height 1 letter-spacing 0px`），**不是**合法的 `font` shorthand，無法直接寫成 `font: var(--pd-text-label-sm);`（見 `agent-reference.md` 第三節註記；pipeline 目前只對外提供 TS／JSON 產物中的結構化欄位，尚未產出可在純 CSS 消費的獨立 `font-size`／`font-weight` 自訂屬性）。因此 `badge.css` 與 Button／Input／Divider 一致，使用 `font: inherit`，由消費端的排版 context 決定實際字級；`line-height: 1` 則直接對齊 `pd-text-label-sm` 本身定義的行高，避免瀏覽器預設行高把 pill 撐高。這是刻意的、有記錄的選擇，不是遺漏。

## 可及性與動效

- **Focus**（僅 `.pd-badge--interactive`）：`:focus-visible` 顯示 `pd-color-border-strong` 的偏移 outline，與 Button／Input 使用同一組已驗證的 A-M2 對比（四層表面 4.29／3.97／3.62／3.16:1）。
- **Hover／Active**（僅 `.pd-badge--interactive`）：改用 `text-decoration: underline`，而非改變背景色。原因：Badge 的背景依變體而異（中性 `surface-raised`、語意色文字＋中性背景、或產品的 `accent-subtle`），若統一在 hover 時换成 `pd-color-surface-hover`，`accent-subtle` 變體的 `accent-text` 對 `surface-hover` 的對比完全未經驗證（`accent-text` 是為 accent 家族背景設計的前景色，不保證對一個無關的中性灰階背景仍然可讀）。改用 underline 是純文字層面的線索，不引入任何新的前景／背景配對，對所有變體都安全。
- **Reduced motion**：Badge 沒有任何連續轉場動畫（hover／active 是即時切換的 `text-decoration`，不是漸變），因此沒有需要在 `prefers-reduced-motion: reduce` 下停用的動畫，A-M4 在此元件上是自動滿足、無需額外宣告。
- **A-M5**：見上方「語意（狀態）變體」——Badge 一律要求文字 label，不提供純色點模式。
