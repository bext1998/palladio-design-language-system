# 設計系統元件規模與成熟度研究

查閱日：2026-09-11

## 研究問題

成熟設計系統至少要有多少元件，才可稱為成熟？本研究檢查大型第一方設計系統的元件目錄、分類方式與成熟度訊號，判斷能否從元件數量建立可靠門檻，並轉換成適合 Palladio 的早期開源、跨消費端參考。

## 方法與範圍

- 只採用各系統維護者的官方設計系統網站；不採用二手文章、社群排行或第三方統計。Material 3 索引在本次 HEAD 檢查回傳 405，代表伺服器不接受此方法；因此保留官方 URL 並把其數字標成快照估算，未把 HEAD 成功當作證據。
- 「元件數」以官方元件索引中可辨識的命名條目為單位；不把 token、圖示、模板、指南或 pattern 自動算成元件。若索引把 primitive、beta、deprecated 或 library 混入，會在限制欄說明。
- 目錄會持續變動，因此數字是 2026-09-11 的快照。無法由官方頁面穩定取得完整數字時，使用「至少／約」並保留可重現的分類或頁面範圍。
- 「成熟度訊號」採官方明示的生產狀態、文件深度、實作渠道、可及性驗證、維護流程與跨產品定位；這些訊號比單一數量更能支持成熟判斷。

## 系統比較

| 系統 | 官方目錄與盤點結果 | 分類／範圍觀察 | 官方成熟度訊號 | 限制 |
|---|---|---|---|---|
| [Material Design 3](https://m3.material.io/components) | 官方 Components 索引涵蓋約 30 個常用元件類別（以索引頁可見的元件頁逐項計；不同平台與版本可能分拆）。 | 元件以互動與內容用途分類，另有 foundations、styles、accessibility 與 Android／Web 實作。 | 每個元件通常提供 guidance、規格、token／狀態與平台實作；官方以完整設計語言與跨平台實作呈現，而非只列名稱。 | M3 頁面會依平台、版本與導覽改版，不能把頁面快照當固定 API 數量。 |
| [Adobe Spectrum](https://spectrum.adobe.com/page/components/) | 官方元件索引約 40+ 條目；以索引中的元件頁為準，含多種輸入、導覽、overlay、feedback 與 data display。 | Spectrum 將 components 與 principles、resources、icons、UI kits、Spectrum CSS、React Spectrum、Web Components 分開。 | 官方首頁明示同時提供 components、tools 與多套 open-source implementations；元件頁通常有 usage、anatomy、states、accessibility 與實作連結。 | Spectrum、React Spectrum、Spectrum CSS、Web Components 可能有不同元件集合，跨集合去重後數量不宜硬算。 |
| [Atlassian Design System](https://atlassian.design/components) | 以官方分類逐項盤點約 70+ 條目；包含一般元件、primitives、beta、caution/deprecation 與 libraries。 | Forms and inputs、images and icons、labels、layout、loading、messaging、navigation、overlays、status、text/data、primitives、libraries。 | 官方說明 ADS 是 foundations、tools、components 的集合，供 Atlassian、Marketplace partners 與外部使用；另有 tokens、React/TypeScript 套件、設計與開發文件。官方原則明示「先可信 fundamentals，再做完整 patterns」，並把文件、支援、工具與維護納入完成條件。 | 70+ 是索引條目，不是去重後的核心互動元件；beta、deprecated 與 libraries 會拉高數字。 |
| [Shopify Polaris](https://polaris.shopify.com/components) | 官方 Components 索引約 50+ 條目（以分類頁命名條目盤點；部分內容按 React、Web Components 或 pattern 分頁）。 | 覆蓋 actions、forms、selection、feedback、navigation、layout、data display、media 與 overlays。 | 官方將 Polaris 定位為 Shopify 商家產品的設計系統，並提供元件 API、設計資源、內容與可及性指引；成熟訊號在可安裝實作、元件使用規則與跨產品一致性。 | Polaris 導覽與版本在遷移中；官方索引未提供固定總數，且部分條目是組合元件或 pattern。 |
| [Microsoft Fluent 2](https://fluent2.microsoft.design/components/web/react/) | Fluent Web React 官方 overview 索引列出 50+ 元件／建構塊；頁面支援 filter 與 React／Web Components 平台切換。 | 以非情境化 building blocks 解決 UI 問題，索引涵蓋 accordion、avatar、badge、breadcrumb、field、input、list、menu、dialog、table、tabs 等。 | 官方明示 Fluent Web 同時支援 Web Components 與 React，並提供一致 web experience；元件索引有平台篩選與 preview 標示，顯示版本與實作治理。 | overview 是動態索引，完整條目需依 filter 展開；preview 條目不能視為 stable 生產元件。 |
| [IBM Carbon](https://carbondesignsystem.com/components/overview/components/) | 官方 Components overview 列出 40 個左右條目；本次盤點包含 Accordion 至 Tree view，另標示 feature flag 元件。 | 以元件解決具體 UI 問題；另有 community assets、patterns、產品與 AI 生態。 | 官方元件頁提供 usage/style/code/accessibility 分頁；Component checklist 定義 PDLC：Draft、Preview candidate、Preview、Stable，Stable 要完成 code、kit、docs、design 並可投入 production。官方頁另公布 accessibility testing status。 | 官方索引含 feature flag 與社群資產；總數會隨版本變動，不能以約 40 推導成熟門檻。 |
| [GitHub Primer](https://primer.style/product/components/) | 官方 Product Components 索引約 55–60 條目；本次依索引逐項盤點，涵蓋 ActionBar 至 UnderlinePanels。 | actions、containment、communication、navigation、selection、text input，以及 layout、loading、status、overlay 等。 | 官方定義元件為可重用、互動的 building blocks，並強調 cohesive/accessibility；另有逐元件 accessibility guidance 索引，及 React 實作文件。 | Primer 同時有 component、pattern、layout 與 typographic abstraction；索引數量是產品層條目，不等於所有 Primer 套件總量。 |

## 結論

沒有官方證據支持「至少 N 個元件」這個普遍門檻。上述成熟系統的官方目錄從約 30 到 70+ 不等，但目錄定義不同：有的只列核心元件，有的包含 primitives、beta、libraries 或 patterns。相同數量也可能代表完全不同的交付狀態。

可用的判斷應是分層，而不是單一硬閾值：

1. **可用（約 8–15 個核心元件）**：能覆蓋 actions、forms、navigation、feedback、layout 的一條真實流程；每個元件有 API、狀態、基本可及性與可安裝實作。
2. **可擴展（約 15–30 個）**：補足 overlay、selection、data display、loading、錯誤與空狀態；有跨元件 token 契約、文件、測試與至少一個真實消費端。
3. **成熟（數量不定，常見為 30+）**：核心情境覆蓋完整，且有穩定／preview 分級、版本治理、設計與程式雙端資產、可及性驗證、維護流程與生產回饋。Carbon 的 PDLC 與 Atlassian 對「文件、支援、工具、維護」的官方描述，直接支持這種品質定義。

## 對 Palladio 的可行建議

- 不宣稱「元件數達到 X 即成熟」。對外改用「成熟度分層」與可驗收條件。
- 以目前 Foundation 與第一批元件為 **可用層** 基準：先完成 Button、Field/Input、Checkbox、Radio、Toggle、Tabs、Badge/Tag、Progress/Spinner、Modal/Dialog、Select/Dropdown 等高頻核心，涵蓋 actions、forms、navigation、feedback、overlay。
- 每個元件建立同一份交付契約：usage/anatomy、variants、互動狀態、鍵盤與 reduced-motion 行為、semantic token 使用、可安裝輸出、可及性驗證與生產接入紀錄。這比擴大目錄更接近 Carbon Stable、Primer accessibility、Atlassian foundations/tools 的成熟訊號。
- 將 Beta／未經生產驗證能力明確標記，不把缺少真實消費端驗證的元件算作成熟供給；以真實跨消費端接入回饋決定下一批元件。
- 盤點時維持三個數字：核心元件數、組合／primitive 數、仍在 preview 或未驗證數。這能避免 Palladio 因目錄膨脹而誤判成熟。

## 來源與驗證

所有外部來源均為設計系統官方網站，查閱日均為 2026-09-11：

- [Material Design 3 Components](https://m3.material.io/components)
- [Adobe Spectrum Components](https://spectrum.adobe.com/page/components/)
- [Atlassian Components](https://atlassian.design/components)
- [Atlassian Design System overview](https://atlassian.design/get-started/about-atlassian-design-system)
- [Shopify Polaris Components](https://polaris.shopify.com/components)
- [Fluent 2 Web React overview](https://fluent2.microsoft.design/components/web/react/)
- [IBM Carbon Components overview](https://carbondesignsystem.com/components/overview/components/)
- [IBM Carbon Component checklist](https://carbondesignsystem.com/contributing/component-checklist/)
- [GitHub Primer Product Components](https://primer.style/product/components/)
- [GitHub Primer accessibility patterns](https://primer.style/accessibility/patterns/primer-components/)

驗證結果：檔案已建立於 `Redesign/research/design-system-component-maturity.md`；Markdown 標題、表格與連結格式已人工檢查。連結均指向官方網域；動態索引的條目數保留估算與盤點限制，未宣稱固定精準總數。
