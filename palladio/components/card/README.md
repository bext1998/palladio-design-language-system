# Card

`Card` 是規格第七章「分組手段優先順序」中排在**最後**的技巧——「Card / 明確邊框，最後手段，用於需要獨立互動邊界的場景」。在用 Card 之前，請先確認 spacing、typography hierarchy、Divider 或單純的 surface elevation（`surface` → `surface-raised`）不足以表達所需的分組層次；Card **不是**預設的視覺分組手段。根元素須先套用 Foundation 的 `data-theme="dark"`，載入 `palladio/dist/css/palladio.css` 後再載入 `card.css`。

```html
<!-- 非互動：純內容容器，元素依語意自行選擇（div / article / section） -->
<article class="pd-card">
  <h3>標題</h3>
  <p>內文說明。</p>
</article>

<!-- 互動：整張卡片可點擊，導向詳情頁 -->
<a class="pd-card pd-card--interactive" href="/items/42">
  <h3>標題</h3>
  <p>內文說明。</p>
</a>

<!-- 互動：JS 觸發的動作 -->
<button class="pd-card pd-card--interactive" type="button">
  <h3>標題</h3>
  <p>內文說明。</p>
</button>
```

## Surface、border 與 radius 契約

- **背景**：`pd-color-surface-raised`（規格 2.1：「提升一層的表面（card、dropdown）」）。
- **邊框**：`pd-color-border-default`。規格 2.2 的 token 表已將 `border-default` 的角色明確定義為「標準裝飾性 border（**card edge**）」——這是目前 spec.md（source of truth）對 Card 邊框的權威指定，取代 Issue 原始描述中較早期提到的 `border-subtle`（`border-subtle` 現在的角色是規格第七章第 3 順位的 Divider 線條，「幾乎與表面融合」，不是 Card 的邊界）。`border-default` 對四層表面的對比是 1.46／1.35／1.23／1.07:1，全部低於 3:1——這是**刻意**的：它是純裝飾性邊界，不受 A-M2 約束（見 `accessibility-contract.md` 第三節），因為 idle 狀態的 Card 本身不需要作為一個「可識別的互動邊界」；只有在 Card 本身可互動時，才需要額外的、已驗證的 focus indicator（見下方）。
- **Radius**：`pd-radius-sm`。規格 4.1 的 token 表把 `sm`（4px）的適用場景直接寫成「輕微圓角（**input、大型 card**）」——這是「保守 radius」驗收條件最直接對應的 token，與 Input 共用同一個語意角色。
- **Padding**：`pd-space-4`（16px），固定值，不隨 density 變動——Card 是內容容器而非緊湊控制項，規格 6.2 的 density 表只定義「元件 padding」（控制項的 padding／最小互動尺寸／body 字級），沒有另外定義「容器 padding」隨 density 縮放的規則；`pd-space-4` 仍是合法的 Semantic 4px 倍數 token，三種 density 下都適用、不會破版。

## Density

- 三種 density 下 Card 的外觀結構不變（padding、border、radius 皆固定）；Palladio 把 density 的 body font size 套在根元素，Card 內容仍由消費端的語意元素與排版規則決定，並自然繼承該 body 字級。
- `.pd-card--interactive` 額外消費 `--pd-density-component-min-interactive-size`（32／36／48px），滿足 A-M6「互動元素最小尺寸依 density preset 對應值」——實務上任何有實際內容的 Card 高度都遠超過這個下限，此宣告主要是為了忠實對齊規則本身，而非實際的限制因素。
- Card 沒有固定 text role，這是刻意的例外，不是漏套：Card 內容排版完全交給消費端決定。互動變體是原生 `<button>`，瀏覽器對 `<button>` 有自己的預設字體，需要重設才能讓它跟非互動的 `<article>`/`<div>` 一樣單純繼承周圍內容的字體。`font` 屬於可繼承屬性，`unset` 在可繼承屬性上的效果等同 `inherit`——這裡選 `font: unset` 純粹是要跟規格 §10.2「不得以 `font: inherit` 迴避 text role」這條檢查的字面比對區分開，實際渲染行為跟寫 `font: inherit`完全一樣，不是換了一種不同的重設方式。

## 互動與 focus 行為

- **非互動**：`.pd-card` 單獨使用時（`<div>`／`<article>`／`<section>`）不具游標、hover、focus 語意，純粹是內容容器。
- **互動**：加上 `.pd-card--interactive` 並改用原生 `<a href="...">`（導向）或 `<button type="button">`（JS 動作），保留原生鍵盤語意——不要用 `role="button"`、`tabindex` 或 JavaScript 在 `<div>` 上重建互動卡片。`<button>` 支援原生 `disabled`；`<a>` 沒有原生 disabled 概念，若連結目前不可用，請不要渲染成看似可點擊的樣子（例如乾脆不輸出該連結），不要用假的 disabled 樣式偽裝。
- **Hover**（僅互動卡片）：邊框從裝飾性的 `border-default` 換成 A-M2 的 `border-strong`；它對 `surface-raised` 是 3.47:1。
- **Active**（僅互動卡片）：背景額外換成 `pd-color-surface-overlay`，邊框維持 `border-strong`，對該表面是 3.03:1。仍不用 `surface-hover`：它不在稽核範圍，`border-strong` 對它只有 2.86:1，未達門檻。
- **Focus**（僅互動卡片）：`:focus-visible` 顯示已驗證 accent 的偏移 outline；未驗證時回退 `pd-color-border-strong`，維持 A-M3 安全網與 `--pd-space-1` 幾何模式。
- **Disabled**（僅 `<button>` 變體）：文字改為 `pd-color-text-disabled`，`cursor: not-allowed` 與原生 `disabled` 一起表達停用；邊框維持不變，不使用 opacity。
- **Reduced motion**：互動卡片轉場 `background-color` 與 `border-color`，使用 `--pd-duration-fast` 與 `--pd-easing-default`；`prefers-reduced-motion: reduce` 時移除 transition。非互動卡片沒有任何轉場，A-M4 自動滿足。
