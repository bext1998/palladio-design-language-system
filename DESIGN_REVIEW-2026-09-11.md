# Palladio 元件美學設計審查

> 審查日期：2026-09-11
> 審查對象：Button、Input、Badge、Card、Navigation、Divider
> 審查者：Codex（maze-design-review）
> Render 環境／尺寸／Scale／Theme：Windows 10、headless Microsoft Edge（Chromium）、DPR 1、dark theme；375×900 與 1280×900，Compact／Default／Spacious。

---

## 總覽評分

| 維度 | 分數（0-10） | 說明 |
|---|---:|---|
| Anti-AI-Slop | 9.5 | 線條、留白與小圓角有明確角色；無漸層、陰影、裝飾卡片或浮誇文案。 |
| UX 流程 | 9.0 | 原生互動元素、disabled、error、hover、active、focus 與鍵盤契約清楚；展示頁兩個 tab control 的選取狀態也已實測更新。 |
| 視覺品質 | 8.5 | 深色表面階層、狀態色、間距及 375px 換行乾淨；Typography token 尚未能直接落在 CSS 元件上。 |
| Design System Conformance | 8.0 | 色彩、間距、形狀、密度與動效皆走 Semantic token；字體 token 的 CSS 交付格式使元件只能 `font: inherit`。 |
| **總分** | **8.75** | 基礎品質可用；先處理字型 token 的可消費性。 |

---

## 高優先問題（需立即修正）

無。現有元件在三種 density、375px／1280px 與 reduced-motion 下沒有重疊、裁切或水平溢位。

## 中優先問題（建議修正）

- [ ] **P2：Typography token 無法直接套用，元件的字級與字重依賴消費端繼承。** `--pd-text-*` 輸出為描述性組合字串，不能作為 CSS `font` shorthand；Button、Input、Badge、Card、Navigation 均使用 `font: inherit`。這使規格指定的 `label-md`（Button／tab）與 `label-sm`（Badge）不是元件的可驗證視覺契約，產品一旦使用不同的 parent typography，元件比例與層級會漂移。建議在 pipeline 輸出可直接引用的語意 typography properties（如 `--pd-text-label-sm-font-size`、`font-weight`、`line-height`、`letter-spacing`），或提供等價的已組合 typography utility；完成後讓元件依其指定角色消費它們。此變更涉及 token 交付契約，需先決定規格與相容策略。

## 低優先問題（可選改善）

- [ ] **P3：Spacious 下互動 Badge 的視覺角色接近 Button。** A-M6 使 `.pd-badge--interactive` 高度為 48px，非互動 Badge 保持小型 pill；兩者並列時，互動版明顯變成主要操作。此行為符合現有 README，但產品若需要密集 filter tag，可改用 Default／Compact，或在後續規格中定義「48px hit target 與較小視覺 badge」的實作契約。

## 優點（保留的部分）

- `surface`、`surface-raised`、細邊框與 4px spacing 建立一致的深色層次，Card 沒有膨脹成通用容器。
- 圓角只用於 Button、Badge 與 Input；Card 維持 4px，符合克制圓潤原則。
- Input error 有文字訊息；Navigation active 同時使用背景、字重與左側指示條，不以色彩單獨傳達狀態。
- 實測互動控制項高度在 Compact／Default／Spacious 分別至少為 32／36／48px；reduced-motion 中 Button、Input、Card、Navigation transition 都是 `0s`。
- Divider 在 `surface` 上的輕分隔可辨識；其在 `surface-raised` 消失的限制已由 README 明確界定，非本次缺陷。

## 建議優先處理順序

1. 決定並實作 CSS 可直接消費的 typography token 交付方式。
2. 用新 typography 輸出重跑六個元件的 375px／1280px 及三種 density 視覺驗收。
3. 若目標產品大量使用可點擊 tag，為 Spacious 的 visual density 設計額外契約。

## 證據與限制

- 渲染檔與 computed metrics：`review-artifacts/component-audit/`。
- 官網實測 JSON/CSS tabs 與 density selector；兩者更新 `aria-selected` 與對應內容／密度展示。
- `npm --prefix palladio run validate:components`、`validate:tokens` 與 `pipeline/validate-accessibility.mjs` 通過。
- `validate:artifacts` 未完成：工作區缺少 `style-dictionary`，pipeline 無法載入該套件；未安裝依賴或修改 lockfile。
- 本次是元件美學與基本互動狀態審查；未執行跨瀏覽器、螢幕閱讀器、完整鍵盤流程或產品情境使用者研究。
