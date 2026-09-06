# 消費規則與反例

每條規則附「正確 / 錯誤 / 為什麼」。token 名稱與值查 `agent-reference.md`（見 `integration.md`）。

---

## 1. 只用 Semantic 層

UI 樣式只能引用 `--pd-*` 自訂屬性，或 `@pdiodsgn/tokens` 匯出的 `palladioTokens` / `palladioDensity` / `palladioTheme`。

**正確**
```css
.card {
  background: var(--pd-color-surface-raised);
  border: 1px solid var(--pd-color-border-subtle);
  border-radius: var(--pd-radius-md);
  padding: var(--pd-space-4);
}
```

**錯誤**
```css
.card {
  background: #242424;              /* 裸 hex */
  border: 1px solid var(--pd-color-charcoal-300); /* Primitive token */
  border-radius: 8px;              /* 裸 px */
  padding: 16px;
}
```

**為什麼**：Primitive 值（hex、裸 px、`charcoal-*` 這類原始階）是實作細節，會變。只有 Semantic 層是穩定契約。數值剛好相等也不行 —— 相等是巧合，不是保證。

---

## 2. Theme 是必要屬性

色彩只宣告在 `:root[data-theme="dark"]`。根元素沒有這個屬性，所有 `--pd-color-*` 就是未定義。

**正確**
```html
<html data-theme="dark">
```

**錯誤**
```jsx
// 元件內硬編
<div style={{ ['--pd-color-accent']: '#8E82F0' }}>
// 或假設 :root 就有色彩，不設 data-theme
```

**為什麼**：Palladio 目前只有 dark theme，選擇器刻意是 `[data-theme="dark"]` 而不是裸 `:root`，是為了之後加 light theme 不用重構。硬編 theme 到元件會讓整個 app 沒辦法切。

---

## 3. Density 靠屬性，不改結構

`data-density="compact"` / `"spacious"`（省略 = Default）套在容器上。三種 density 下元件的 DOM 結構、class、layout 都不變，只有 padding、最小互動尺寸、body 字級跟著換 —— 這些已經由 token 綁在 density 選擇器上。

**正確**
```html
<section data-density="compact">
  <button class="btn">Save</button>   <!-- 同一個 button，padding 由 token 換 -->
</section>
```

**錯誤**
```jsx
{density === 'compact' ? <CompactButton/> : <Button/>}   // 兩套元件
// 或針對 compact 手動改 padding、min-height
```

**為什麼**：density 是消費端契約 —— 換 density 不該讓消費端重寫元件。手動調尺寸會偏離 spec 第 6.2 節的固定值。

---

## 4. Accent 六插槽是產品責任

`--pd-color-accent` / `-hover` / `-active` / `-disabled` / `-subtle` / `-text` 六個，全部由消費端在自己的 CSS／token 檔提供。Palladio 一個都不給。

**正確**：消費端 `accent.css` 定義全部六個，然後 `validateAccentPairs()` 驗過（見 `integration.md`）。

**錯誤**
```css
:root[data-theme="dark"] {
  --pd-color-accent: #8E82F0;
  --pd-color-accent-hover: color-mix(in srgb, var(--pd-color-accent) 85%, white); /* 混色公式 */
  /* 沒定義 -disabled，讓它 fallback 到 -active */
}
```

**為什麼**：規格禁止 fallback、推導、跨插槽湊、跨消費端混色。缺哪個插槽就是缺 —— 回報，不要自己補。混色公式在不同消費端會算出不同結果，破壞一致性。

---

## 5. 可及性硬規則不可放寬

| 規則 | 門檻 |
|---|---|
| A-M1 一般文字（含 placeholder、disabled 文字） | ≥ 4.5:1 |
| A-M2 大字（≥24px regular / ≥18.5px bold）與 UI 元件 | ≥ 3:1 |
| A-M3 互動元件的 focus indicator | 可見，不得只 `outline: none` 無替代 |
| A-M4 `prefers-reduced-motion: reduce` | 停用非必要動畫（transform 類完全移除，必要 opacity 瞬時切換）|
| A-M5 狀態傳達 | 不可只靠色彩，需搭配文字／圖示 |
| A-M6 最小互動尺寸 | 依 density：32 / 36 / 48px |

**錯誤**：把 disabled 文字改成低對比灰「因為看起來比較淡才對」；用紅／綠色差表示成功失敗但沒有圖示或文字；`outline: none` 後沒給替代 focus 樣式。

**為什麼**：這些是 spec 第八章的 `[MUST]`，每個元件驗收都要過，不是視覺偏好。

---

## 6. focus ring 與 Input 邊界的指定 token

- **focus indicator 用 `--pd-color-border-strong`**（`#7A7A7A`，已對四層既有表面通過 A-M2，最低 3.16:1）。保留 `:focus-visible` 語意。若改用 accent 或雙層 ring，該元件要對實際相鄰表面逐一重驗 A-M2。
- **Input 可識別邊界用 `--pd-color-input-border`**，不要用 `--pd-color-border-default`（純裝飾性 card edge，對比不足）。

**錯誤**
```css
.input { border: 1px solid var(--pd-color-border-default); } /* 對比不足，非可識別邊界 */
.btn:focus-visible { outline: 1px solid var(--pd-color-border-subtle); } /* subtle 幾乎看不見 */
```

---

## 7. 分組手段優先順序（`[SHOULD]`）

需要視覺分組時依序選：1) 留白 → 2) 字級層級 → 3) 1px divider（`--pd-color-border-subtle`）→ 4) surface elevation → 5) card／明確邊框（最後手段）。

**錯誤**：每個區塊都包一張 card 加 shadow —— 「線條是第一公民」，card 是最後才動用的。

---

## 8. 字重

不使用 font-weight 100–300（深色背景上過細難讀，spec 3.3）。標題 `-0.01em`～`-0.02em` letter-spacing，body 維持 `0` —— 這些已在 `--pd-text-*` 裡，直接用 token 就對。
