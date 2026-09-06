# Palladio 壓力測試檢視素材 — Landing page（Issue #4）

對應規格第十一章與 [Issue #4](https://github.com/bext1998/palladio-design-language-system/issues/4)。

## 這是什麼

「專案官網 / Landing page」型態的概念原型與 UI 決策分類表，用來檢視 token 覆蓋率是否足夠。依規格第十一章：

> 驗收標準：檢視三種概念圖中的每項 UI 決策，皆可歸類為既有 Semantic token、明確允許的產品插槽，或已確認的系統缺漏；不得存在未分類項目。概念圖或單次 AI 生成結果只作為檢視素材，不作為唯一通過條件。

## 產品

| 目錄 | 對應 Issue | 產品型態 | 密度重點 | Accent（產品提供） |
|---|---|---|---|---|
| `landing-page/` | #4 | 本專案官網（Palladio） | Default → Spacious | 紫 `#7154E8` 系 |

`landing-page/` 包含：

- `index.html` — 概念原型（單檔 HTML，直接引用 `palladio/dist/css/palladio.css` 與正式元件 CSS，瀏覽器開啟即用）
- `decisions.md` — 產品概念、accent 色盤、配對驗證結果、**逐項 UI 決策分類表**（A：既有 Semantic token／B：明確允許的產品插槽／C：已確認的系統缺漏）
- `product.json` — 產品明確提供的六個 accent 插槽值與實際渲染的額外配對

> Issue #4 的驗收範圍僅涵蓋 Landing page 型態；另兩種型態（#8 資料密集桌面工具、#14 內容創作型）尚未執行，不在本 PR 範圍。

## Accent 色盤的定位

色盤由**虛構產品**明確提供（規格 2.5：產品提供全部六插槽，Palladio 不推導、不 fallback）。這是檢視素材用的假想資料，**不滿足** Issue #15（該 Issue 要求兩個真實產品的實際色彩資料）。

驗證方式：`node palladio/docs/stress-tests/validate-accents.mjs`，匯入 `palladio/pipeline/validate-accessibility.mjs` 的 `validateAccentPairs()`（可及性契約第九節的正式流程），執行：

1. 六插槽齊備性檢查（缺一即失敗）
2. 必驗配對：`accent-text` 對 `accent` / `hover` / `active` / `disabled` 四種背景 ≥ 4.5:1（A-M1）
3. `extraPairs`：原型實際渲染的其他前景／背景配對，逐一標明 `text`（A-M1）／`largeText`／`ui`（A-M2 3:1）

## 壓力測試發現（摘要）

| 發現 | 類別 | 詳見 |
|---|---|---|
| 版面容器欄寬／欄數等版面尺寸無 token 規範 | C（缺漏） | `landing-page/decisions.md` C-1 |
| MazeMaze 的 accent 不能作深底內文連結色（3.63:1 < 4.5），只能用於大字或 UI 元件 | B 的產品責任邊界 | `landing-page/decisions.md` |

缺漏（C 類）僅記錄，不在本 PR 修復；是否補 token 由規格修訂流程決定。