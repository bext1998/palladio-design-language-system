# Palladio 可及性契約（Accessibility Contract）

> Spec 路徑：`docs/spec.md`
> 對應章節：5.4, 8, 9.4, 13
> Task ID：accessibility-contract-validation（Issue #3）
> 建立日期：2026-09-01

---

## 一、範圍與方法

規格第八章將 A-M1 至 A-M6 定義為 `[MUST]` 硬規則。本文件是這六條規則**唯一可查閱的驗收說明**：每條規則列出（1）適用的 Token／行為、（2）驗證方式、（3）目前 Foundation token 的實際驗證結果。

驗證方式分兩種：

- **自動化**：色彩對比使用 WCAG 2.1 相對亮度公式（`palladio/pipeline/validate-tokens.mjs` 與本文件新增的 `palladio/pipeline/validate-accessibility.mjs`）針對已解析的 token hex 值計算，可重複執行、不依賴人工判讀。
- **人工／元件層級**：Focus indicator 實際渲染、keyboard navigation、reduced-motion 行為降級等需在元件實作（#6、#7、#11、#12、#13）與壓力測試（#4、#8、#14）階段以實際渲染結果覆核，本文件定義「元件必須滿足什麼」，不代替元件驗收。

本文件**不**替產品推導 accent 色值，**不**放寬任何 MUST 門檻——這兩點是 Issue #3 明確排除的範圍。

---

## 二、A-M1 — 一般文字對比（含 placeholder、disabled）≥ 4.5:1

**規則**：一般文字（含 placeholder、disabled 文字）對其背景的 contrast ratio 必須 ≥ 4.5:1。

**適用 token**：`pd-color-text-primary`、`pd-color-text-secondary`、`pd-color-text-placeholder`、`pd-color-text-disabled`，以及語意色 `pd-color-success` / `warning` / `danger` / `info`（規格 2.4：「暗色系上的語意色需確保 contrast ratio ≥ 4.5:1」，門檻與 A-M1 相同）。

**驗證方式**：`npm --prefix palladio run validate:tokens`（第 10 節「Dynamic WCAG Contrast Ratio Check」），對 `bg`、`surface`、`surface-raised`、`surface-overlay` 四層表面逐一計算，任何低於 4.5:1 會使腳本擲出例外並中止。

**目前結果**（2026-09-01 執行，全數通過）：

| 文字 Token | 值 | 對 `bg` (#141414) | 對 `surface` (#1C1C1C) | 對 `surface-raised` (#242424) | 對 `surface-overlay` (#2E2E2E) |
|---|---|---|---|---|---|
| `text-primary` | `#F0F0F0` | 16.17:1 | 14.95:1 | 13.62:1 | 11.92:1 |
| `text-secondary` | `#9A9A9A` | 6.55:1 | 6.06:1 | 5.52:1 | 4.83:1 |
| `text-placeholder` | `#9A9A9A` | 6.55:1 | 6.06:1 | 5.52:1 | 4.83:1 |
| `text-disabled` | `#969696` | 6.23:1 | 5.76:1 | 5.25:1 | 4.59:1 |
| `success` | `#5CB87A` | 7.54:1 | 6.97:1 | 6.35:1 | 5.56:1 |
| `warning` | `#E5A93C` | 8.84:1 | 8.17:1 | 7.45:1 | 6.51:1 |
| `danger` | `#EB7878` | 6.57:1 | 6.08:1 | 5.54:1 | 4.84:1 |
| `info` | `#64B5F6` | 8.32:1 | 7.70:1 | 7.01:1 | 6.13:1 |

✅ **結論**：所有既定文字／語意色在四層表面上皆符合 A-M1。

---

## 三、A-M2 — 大字與 UI 元件對比 ≥ 3:1

**規則**：大字（≥24px regular / ≥18.5px bold）與 UI 元件（border、focus ring、icon 等非文字元素）的 contrast ratio 必須 ≥ 3:1。

**大字部分**：規格 3.2 中唯一達到「大字」門檻的字級是 `pd-text-display`（32px/600）與 `pd-text-heading-lg`（24px/600）。這兩者實務上沿用 `text-primary` 或語意色，而這些顏色在第二節已驗證達 4.5:1（嚴格高於 3:1 門檻），因此大字部分自動符合，不需獨立驗證，除非未來新增專屬於大字、對比更低的顏色 token。

**UI 元件部分（border / focus ring）**：使用 `npm --prefix palladio run validate:accessibility` 驗證 `pd-color-border-subtle`、`pd-color-border-default`、`pd-color-input-border`、`pd-color-border-strong` 對四層表面的對比。

**目前結果**：

| Border Token | 值 | 對 `bg` | 對 `surface` | 對 `surface-raised` | 對 `surface-overlay` | 用途 |
|---|---|---|---|---|---|---|
| `border-subtle` | `#242424` | 1.19:1 ❌ | 1.10:1 ❌ | — | — | 純分隔線（「幾乎與表面融合」），非互動邊界，不受 A-M2 約束 |
| `border-default` | `#333333` | 1.46:1 ❌ | 1.35:1 ❌ | 1.23:1 ❌ | 1.07:1 ❌ | 純裝飾性 card edge，非 Input 可識別邊界，不受 A-M2 約束 |
| `input-border` | `#7A7A7A` | **4.29:1 ✅** | **3.97:1 ✅** | **3.62:1 ✅** | **3.16:1 ✅** | **規格 2.2 指定為 Input 可識別邊界 → 符合 A-M2** |
| `border-strong` | `#7A7A7A` | **4.29:1 ✅** | **3.97:1 ✅** | **3.62:1 ✅** | **3.16:1 ✅** | **規格 2.2 指定為 focus ring 底色 → 符合 A-M2** |

`border-subtle` 依規格 2.2 定義為「最輕量的分隔（幾乎與表面融合）」，屬純裝飾性分隔線；WCAG 1.4.11 與 A-M2 僅約束「傳達資訊或狀態」的 UI 元件，故 `border-subtle` 不受 3:1 門檻約束，維持現狀。

`border-default` 依規格 2.2 的修訂定義為純裝飾性 card edge；它不得作為 Input 可識別邊界。Input 必須使用 `input-border`，其最小對比是對 `surface-overlay` 的 3.16:1，已符合 A-M2。

`border-strong` 是所有元件可直接消費的 focus ring 底色。它已對四層既有表面通過 A-M2；最小對比是對 `surface-overlay` 的 3.16:1。元件仍須依第四節契約保留可見 focus indicator 與 `:focus-visible` 語意。

---

## 四、A-M3 — Focus Indicator 契約

**規則**：所有互動元件必須有可見的 focus indicator；不得僅依賴 `outline: none` 後無替代方案。

**契約內容**（供 #6、#7、#11、#12、#13 元件實作遵循）：

1. Focus indicator 的呈現色彩（無論是 border、outline 或 box-shadow）必須對其相鄰的表面達到 A-M2 的 3:1 門檻。
2. 元件應以 `pd-color-border-strong`（`#7A7A7A`）作為 focus ring 呈現色；它已對四層既有表面通過 A-M2。若元件改用產品 accent、`pd-color-text-primary` 或雙層 ring，該元件仍須依 A-M2 對實際相鄰表面逐一驗證。
3. Keyboard focus 與 mouse focus 的呈現不得矛盾；`:focus-visible` 語意應被保留（鍵盤操作可見、單純滑鼠點擊不必要時可省略），除非規格另有指定。
4. 每個元件 Issue 的驗收條件都必須包含「focus indicator 可見且符合 A-M2」——這是既有 Issue #6/#7/#11/#12/#13 驗收條件已明列的項目，本文件把它的判定標準（3:1、相鄰表面計算方式）落地為可重複執行的規則。

---

## 五、A-M4 — `prefers-reduced-motion` 觸發時停用非必要動畫

**規則**：`prefers-reduced-motion: reduce` 觸發時，所有非必要動畫停用。

具體的、可測試的行為定義見第六節（解決規格 5.4 與 A-M4 之間過去存在的解讀歧義，對應 `SPEC_REVIEW.md` 的 `SR-005`）。

---

## 六、Reduced Motion 契約（規格 5.4 節，解決 SR-005）

`SPEC_REVIEW.md` 的 `SR-005`（Minor，狀態 open）指出規格 5.4 節「所有 duration 替換為 `pd-duration-instant`（`0ms`）」與「必要的 opacity 狀態可保留，但必須瞬時切換」兩句話理論上可以有兩種讀法。Issue #3 的驗收條件已經明確指定其中一種讀法：

> 「reduced-motion 不保留 transition，transform 動畫移除」

本文件把它訂為唯一、可測試的行為契約：

| 情境 | Reduced-motion 關閉（一般） | Reduced-motion 啟用（`prefers-reduced-motion: reduce`） |
|---|---|---|
| Transform 類動畫（位移、縮放、`pd-easing-expressive` signature animation） | 依 `pd-duration-*` 與 `pd-easing-*` 正常播放 | **完全移除**，不得以 `duration: 0` 的方式「假裝播放」——`transform` 屬性不套用任何 transition／animation |
| 必要保留的 opacity 狀態切換（例如 modal/tooltip 的顯示與隱藏，仍需要用 opacity 表達「有」或「沒有」） | 依 `pd-duration-normal` 等正常過渡 | **瞬時切換**：`transition-duration` 一律替換為 `pd-duration-instant`（`0ms`），不得保留任何 `transition` 宣告造成漸變觀感 |
| 非必要的裝飾性動畫（hover 光暈、loading 呼吸感等） | 正常播放 | 直接停用（不渲染該動畫，而非降速） |

**判定準則**：reduced-motion 啟用時，觀察者不應看到任何「漸變」——狀態要嘛立即出現/消失（`0ms`），要嘛不再位移/縮放。這與規格 5.4 原文「必須瞬時切換，不保留 transition」一致，也是本文件對 `SR-005` 的正式決議：**必要的 opacity 狀態切換是「瞬時」，不是另一組獨立的短動畫**。

此契約適用於所有元件 Issue 與三種壓力測試；元件驗收條件中的「`prefers-reduced-motion` 下動畫正確降級」（規格 10.2）以此表格為準。

---

## 七、A-M5 — 色彩不可作為唯一的資訊傳達手段

**規則**：色彩不可作為唯一的資訊傳達手段。

**元件實作 checklist**（供 #6、#7、#11、#12、#13 及後續壓力測試核對）：

- [ ] 語意狀態（success／warning／danger／info）除了顏色外，同時搭配圖示、文字標籤或其中之一。
- [ ] Navigation 的 active state（Issue #6 驗收條件已明列）除顏色外，需有第二種視覺線索（例如左側指示條、字重變化、背景色塊），不得只靠文字或圖示變色。
- [ ] Input 的 error state（Issue #13）不得只用 `pd-color-danger` 改變邊框色，需搭配文字說明或圖示。
- [ ] Badge/Tag（Issue #12）若用於狀態語意，需搭配文字 label，不得只用色點／色塊。

第二節已驗證所有語意色本身對比達標；本節管的是「除了顏色之外還有沒有別的線索」，屬於元件實作與壓力測試階段的人工覆核項目，本文件在此立下契約，不代替元件逐一驗收。

---

## 八、A-M6 — 互動元素最小尺寸依 density preset 對應值

**規則**：互動元素最小尺寸依 density preset 對應值。

| Density | `min-interactive-size` |
|---|---|
| Compact | 32px |
| Default | 36px |
| Spacious | 48px |

**驗證方式**：`npm --prefix palladio run validate:tokens`（第 7 節「Verify Density Presets」）已對三組 density token 的 `min-interactive-size` 做精確數值斷言（32／36／48px），任何偏移會使腳本擲出例外。本節僅將既有驗證結果對應回 A-M6，不重複實作。

✅ **結論**：三組 density 的最小互動尺寸皆已由 pipeline 驗證通過，符合 A-M6。

---

## 九、Accent 插槽對比驗證流程（規格 2.5 節，對應 Issue #15）

Palladio 不定義 accent 色值，本文件**不推導**任何產品的 accent 色（Issue #3 明確排除範圍）。以下是待兩個產品提供實際 accent 色值後（Issue #15），驗證其六個插槽必須遵循的固定流程：

1. **蒐集**：產品須明確提供全部六個插槽——`pd-color-accent`、`accent-hover`、`accent-active`、`accent-disabled`、`accent-subtle`、`accent-text`。缺一即視為未完成，不得由系統推導或以其他插槽混色代替。
2. **必驗配對（4.5:1 / A-M1）**：`accent-text` 分別對 `accent`、`accent-hover`、`accent-active`、`accent-disabled` 四種背景，逐一計算 contrast ratio，必須 ≥ 4.5:1。
3. **其他配對（依內容判定 A-M1 或 A-M2）**：產品實際使用的其他前景／背景組合（例如 icon-on-accent、accent 邊框、accent 上的大字標題）需先判定是文字或 UI 元件：一般文字走 A-M1（4.5:1），大字或非文字 UI 元素走 A-M2（3:1）。
4. **記錄**：每個產品需在其 token 文件列出實際使用的前景／背景配對清單（規格 2.5 節要求），驗證結果需可追溯回該清單，不得只驗證系統預設的四組。
5. **不允許的操作**：不得為未提供的插槽套用 fallback；不得用同一色相的深淺變化「推算」`hover`／`active`；不得跨產品共用同一組 accent 驗證結果。

`palladio/pipeline/validate-accessibility.mjs` 的 `validateAccentPairs()`（見腳本內註解）是兩個產品實際色值到位後可直接呼叫的驗證函式，避免 Issue #15 需要重新設計驗證邏輯。它強制檢查全部**六個** slot 是否齊備（含 `accent-subtle`；缺任一即擲例外，不推導、不 fallback），對規格指定的四組 `accent-text` 配對套 A-M1（4.5:1），並要求 `extraPairs` 逐一標明 `kind`：`text`（A-M1 4.5:1）、`largeText`（A-M2 3:1）、`ui`（A-M2 3:1）；未知 `kind` 一律擲例外，不靜默降級。`accent-subtle` 僅做齊備性檢查、無固定對比配對，其實際渲染配對由產品透過 `extraPairs` 提供。

---

## 十、驗證指令

```bash
# A-M1：一般文字／語意色對四層表面 ≥ 4.5:1（含既有 DTCG 格式與 token 覆蓋率驗證）
npm --prefix palladio run validate:tokens

# A-M2：border／focus 相關 UI 元件對四層表面 ≥ 3:1，並列出已確認缺漏
npm --prefix palladio run validate:accessibility

# 產物（CSS/TS/JSON）與 pipeline 重建一致性驗證
npm --prefix palladio run validate:artifacts
```

`validate:accessibility` 對「已知缺漏清單」（第十一節）中的項目只回報、不擲出例外；對清單外、原本應通過卻變成不通過的任何配對，會擲出例外中止（避免未來 token 調整在未察覺的情況下引入新的 A-M2 違規）。

---

## 十一、已確認缺漏（Confirmed Gaps）

依規格第十一章的分類原則（每項 UI 決策須歸類為既有 Semantic token、允許的產品插槽，或已確認缺漏），本文件正式登記以下缺漏：

| 缺漏 | 影響規則 | 現況 | 後續處置 |
|---|---|---|---|
目前沒有已確認的 A-M2 缺漏。Issue #24 已以 `pd-color-input-border` 取代原本不合規的 Input 邊界用法；`KNOWN_GAPS` 保留為未來已記錄例外的明確追蹤機制。

---

## 十二、與規格及既有審查文件的關係

- 本文件是規格第八章 A-M1–A-M6 的**唯一可查閱驗收說明來源**（Issue #3 驗收條件第一項）。
- 本文件第六節是 `SPEC_REVIEW.md` `SR-005` 的正式決議：reduced-motion 下必要的 opacity 狀態切換為瞬時（`0ms`），不保留 transition。
- 本文件不修改 `docs/spec.md` 的功能範圍、不放寬任何 MUST 門檻、不為 accent 插槽推導色值，皆與 `AGENTS.md` 的工作原則一致。
