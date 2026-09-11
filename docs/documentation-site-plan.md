# Palladio 文件站規劃

狀態：已決定技術選型；待後續實作 Issue 執行  
對應：GitHub Issue #45  
建立日：2026-09-11

## 1. 目的、範圍與現況

文件站（concept C）是供設計師、工程師與 AI agent 查詢 token 值、元件行為、可及性契約與 density 的參考站。它不是行銷 landing page（concept B）。

`site/` 已由 PR #47 納入本 repo，且由 PR #48 部署至 GitHub Pages；它保持為 landing page。本規劃不修改 `site/`、`docs/spec.md` 或任何文件站程式碼。

本文件只規劃下列項目：

- 資訊架構（IA）與路由。
- 文件內容的來源、收集規則與版本一致性。
- 技術選型。
- 原始碼與部署落點建議。

不處理內容改寫、文件站實作、landing page 導覽連結、網域採購或自訂網域設定。

## 2. 決策摘要

採用 **Node 靜態產生腳本加 vanilla JavaScript**，直接產出 `site/docs/` 的 HTML、CSS、JSON 與少量 JavaScript。

理由：第一版約 15–20 頁，內容來源固定且已存在於 repo；所需的搜尋與 token inspector 都是小型、明確的靜態功能。Node 腳本可在建置期讀取 Markdown 與 `tokens.json`，模板直接輸出靜態頁；客戶端 JavaScript 只負責搜尋與表格篩選，不導入 Vue、hydration 或 theme 系統。Markdown 轉譯使用一個鎖定版本的 parser 開發依賴，避免自行實作 Markdown parser。

此選擇保留未來替換空間：頁數、內容模型或互動複雜度明顯擴大時，再以實際維護成本評估專用 SSG。實作必須在後續 Issue 進行。

## 3. IA

Issue 原始 IA 的六個群組合理，保留其意圖並做兩項調整：

1. `Principles` 與 `Foundations` 分開。前者回答設計判斷，後者提供可查詢的 token 與規格資料。
2. `Tokens` 獨立為資料工具，不與 Foundations 合併。Foundation 頁說明規則；Token inspector 提供精確值、輸出格式與複製入口。

第一版路由如下。每條內容頁均由第 4 節的權威來源生成。

| 群組 | 路由 | 內容 | 來源 |
|---|---|---|---|
| Overview | `/docs/` | 系統定位、套件版本、dark-only 與三種 density 的入口摘要 | `palladio/package.json`、`palladio/dist/agent-reference.md`、`docs/spec.md` |
| Principles | `/docs/principles/` | 核心個性、P1–P5、非目標 | `docs/spec.md` 第 1 章 |
| Foundations | `/docs/foundations/color/`、`type/`、`space-density/`、`radius/`、`motion/` | 各基礎規則、語意 token 的用途、density 與 reduced-motion 契約 | `docs/spec.md` 第 2–6 章；值以 `tokens.json` 為準 |
| Components | `/docs/components/` 與 `/docs/components/{name}/` | 元件索引與 Button、Input、Divider、Badge、Card、Navigation 的行為、狀態、鍵盤與可及性 | `palladio/components/<name>/README.md` |
| Accessibility | `/docs/accessibility/` | A-M1–A-M6、focus、reduced motion、accent 對比流程與驗證指令 | `palladio/docs/accessibility/accessibility-contract.md` |
| Tokens | `/docs/tokens/` | 可篩選的 semantic、density、theme token；CSS、TS、JSON 用法與套件版本 | `palladio/dist/json/tokens.json`、`palladio/dist/agent-reference.md`、`palladio/package.json` |
| Guides | `/docs/guides/consuming-tokens/`、`density/`、`agent-reference/` | 安裝、精確版本 pin、消費端 accent 責任、AI agent 使用契約 | `palladio/README.md`、`palladio/dist/agent-reference.md` |

### 3.1 三欄骨架的參考邊界

文件站採 header、左側 IA 導覽、中央內容與右側面板的三欄骨架。此分區邏輯可參考 WattCIAutomationEngine 文件站；不複製其 HTML、CSS、色彩、提示框樣式或逐頁手寫內容模型。Palladio 維持第 4 節的自動內容產生契約。

### 3.2 介面實作骨架：Palladio dogfooding

文件站是 Palladio 設計語言的活範例。宣稱提供 token 與元件的系統，文件站本身也必須使用它們；不得另建一套外觀，也不得沿用 Watt 的 CSS。

建置器必須從 `palladio/dist/css/palladio.css` 複製 Foundation CSS，並從對應元件目錄複製 CSS 到 `site/docs/assets/palladio/`。每個產生頁先載入 Foundation CSS，再載入該頁使用的元件 CSS；部署時的副本須與同一 commit 的來源一致，不可手工修改。文件站外殼的自訂 CSS 只使用 Semantic token，不直接使用 Primitive 值。

| 介面區塊 | Palladio 實作 | 約束 |
|---|---|---|
| 文件根節點與 header | `palladio.css`、`<html data-theme="dark">`、`pd-color-bg`／`surface`／`text-*`／`space-*`／`radius-*` | dark-only；不定義文件站自己的 accent fallback 或推導色值。 |
| 左側 IA 導覽 | `palladio/components/navigation` 的 `.pd-nav` | 使用原生 `<nav>`、`aria-current="page"` 與元件既有 active／focus／keyboard 契約。 |
| 中央文章與章節分隔 | Foundation typography／spacing token，加上 `.pd-divider` | Divider 放在 `bg` 或 `surface` 上；不放進 `surface-raised` Card 內期待可見線條。 |
| Components 索引與 Guides 摘要 | 非互動 `.pd-card`；有真實導覽目的時才用 `.pd-card--interactive` 搭配原生 `<a>` | Card 是分組手段最後選項，不將每個文章段落卡片化。互動 Card 保留原生鍵盤語意與 focus indicator。 |
| 狀態與分類標籤 | 含文字 label 的非互動 `.pd-badge` | 用於「非契約」、「AI agent 使用契約」等分類；不以色彩單獨傳達意思，不把未驗證的 accent 變體當預設。 |
| 右側 token inspector 與頁內目錄 | `palladio.css` 的 surface／border／spacing token；內部以 `.pd-divider` 分隔控制項與 TOC；需要獨立選取邊界時使用 `.pd-card` | 面板是文件工具，不另創視覺語言；篩選控制項的可及性依 A-M3 與 A-M6 驗收。 |

三種 density 與 A-M1–A-M6 對文件站完整適用，沒有例外：預設為 Default；以 `data-density="compact"` 與 `data-density="spacious"` 進行渲染驗收，且不因 density 改變 DOM 結構。文字與 UI 對比遵守 A-M1／A-M2；所有互動控制保留可見 focus（A-M3）並在 reduced motion 下移除非必要 transition／transform（A-M4）；Navigation active 與 Badge 均具文字或其他非色彩線索（A-M5）；連結、搜尋、篩選與可互動 Card 遵守各 density 的最小互動尺寸（A-M6）。

#### 文件站自己的 accent 插槽（規格 2.5，必須列出實際配對）

文件站是消費端，依規格 2.5 必須自行提供全部六個 `pd-color-accent-*` 插槽，Palladio 不提供 fallback 或推導。第一版實作漏了這步——`Navigation` 的 active 項目左側色條（`navigation.css` 的 `border-inline-start-color: var(--pd-color-accent)`）因此沒有顏色，只剩背景色與粗體字兩種線索，是側邊導覽看起來平板的直接原因。

修正後的六個插槽沿用 `site/assets/css/styles.css` 既有的官網品牌色 `--brand: #D9814F`（landing page 已用作連結、按鈕、程式碼 tab 的強調色），讓文件站與官網共用同一個色相，而不是另外發明一個：

| 插槽 | 值 | 用途 |
|---|---|---|
| `accent` | `#D9814F` | 主強調色，沿用官網 `--brand` |
| `accent-hover` | `#E4A079` | hover 狀態，沿用官網 `--brand-hover` |
| `accent-active` | `#C06A38` | active／按壓狀態 |
| `accent-disabled` | `#9C8171` | disabled 狀態 |
| `accent-subtle` | `#2E2118` | 低飽和背景（目前文件站未使用，僅補齊格式） |
| `accent-text` | `#141414` | 疊在上述四個背景上的文字／圖示色 |

已用 `palladio/dist/validate-accents.js` 的 `validateAccentPairs()` 驗證全部四組強制配對，皆通過 A-M1（4.5:1）：`accent-text` 對 `accent` 6.32:1、對 `accent-hover` 8.42:1、對 `accent-active` 4.70:1、對 `accent-disabled` 5.08:1。`accent-subtle` 僅格式驗證，文件站目前沒有使用它的實際前景／背景配對。

#### 已知例外：文件站結構性版面

文件站外殼的 breakpoint 寬度、`grid-template-columns`、grid 欄位比例與收合規則可暫時使用原生 CSS 值。這些值只定義 layout 結構，不可用於色彩、字級、間距、圓角、動效或元件狀態；後者仍只能使用 Semantic token。

原因是 Palladio 目前沒有欄寬、欄數、對齊策略或 breakpoint 的 layout token；此缺口由 [Issue #61](https://github.com/bext1998/palladio-design-language-system/issues/61) 追蹤。這不是文件站可任意逃逸 token 系統的許可：原生值限於上述結構性屬性，且在 #61 定義多欄版面 token 後必須重新檢視並遷移。看板欄位（#60）預期會遇到相同缺口。

文件正文的字體規則是建置時由 `tokens.json` 的 `semantic.text` 結構化欄位（`fontFamily`、`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`）產生，不屬於手工維護的原生字級值；正文的字級仍保留 density token。Header 與表格列的分隔線可使用原生 `1px` 作為線寬，但色彩必須使用 `--pd-color-border-subtle`。目前尚無 Semantic border-width token；此例外僅限分隔線線寬，不擴及其他視覺屬性。

### 3.3 右側 token inspector 顯示規則

右欄在桌面寬度的**全部路由常駐 token inspector**，不會退化成只有頁內 TOC。它始終讀同一次建置的 `tokens.json`，提供 token 名稱與值的查詢；頁內 TOC 位於 inspector 下方，作為補充導覽。

- Foundations、Components、Tokens：顯示完整群組／density／theme 篩選、值與目前頁面引用 token；Tokens 頁將 inspector 擴展為主內容工具。
- Overview、Principles、Accessibility、Guides：仍顯示精簡查詢與目前頁面引用 token；沒有引用 token 時顯示可展開的全域查詢，不以純 TOC 取代 inspector。
- 窄螢幕：右欄收合成可由鍵盤操作的面板；其中仍先顯示 token inspector，再顯示 TOC。文章、導覽與原始 token 資料在 JavaScript 停用時仍可讀。

建置腳本產生 `search-index.json`；搜尋以少量 vanilla JavaScript 在瀏覽器做標題、token 名稱與內容文字的比對。

## 4. 內容產生與單一事實來源

### 4.1 強制原則

文件站**不得有手工同步的 token 值、元件行為、可及性規則或規格文字複本**。文字或值的修正必須回到下表的權威來源；下一次建置才反映變更。

文件站原始碼可手工維護的範圍只有路由／側欄映射、版型、資料轉換程式、測試與樣式，不含上述領域內容。產生出的 Markdown、JSON、搜尋索引與靜態網站皆是 build artifact，不提交為人工維護文件。

### 4.2 來源清單與處理方式

| 權威來源 | 文件站用途 | 建置處理 | 失敗條件 |
|---|---|---|---|
| `palladio/dist/json/tokens.json` | Token inspector 的值、群組與輸出格式 | 建置期解析；生成索引資料並供 token inspector 載入 | 檔案不存在、JSON 無法解析，或缺少 `semantic`、`density`、`theme` 頂層 key |
| `palladio/dist/agent-reference.md` | token 使用規則、禁止事項、agent guide | 以 Markdown 渲染；與 package 版本一起顯示 | 檔案不存在，或內容缺少版本／使用規則標頭 |
| `docs/spec.md` | Principles 與 Foundations | 依第一至六章標題範圍抽取；token 值由 `tokens.json` 取代或交叉驗證，不另建表格複本 | 指定章節不存在，或引用 token 未在 JSON 產物找到 |
| `palladio/components/*/README.md` | Components 索引與元件頁 | 依目錄列舉 README，產生索引；原 README 直接渲染 | 目錄存在但缺 README；重複或無法轉成 slug 的元件名稱 |
| `palladio/docs/accessibility/accessibility-contract.md` | Accessibility | 原文件直接渲染，保留小節 anchor | 檔案不存在 |
| `palladio/README.md`、`palladio/package.json` | 安裝、套件入口、版本與發布規則 | Markdown 渲染與 package metadata 讀取 | 入口與 `exports` 不一致，或版本不存在 |

`palladio/docs/design-language/` 與 `palladio/docs/components/` 目前只有 `.gitkeep`，不是內容來源。元件行為來源是 `palladio/components/<name>/README.md`；本規劃不假設或要求將其搬移。

### 4.3 建置契約

後續實作應建立 `scripts/build-docs.mjs`，輸入僅限第 4.2 節白名單。它讀取來源、將 Markdown 轉為 HTML、套用共用模板，並直接寫入受版本控制的 `site/docs/` 部署輸出；來源檔不被複製回 repo 作為手工內容頁。

collector 必須：

1. 讀取 `palladio/package.json` 的版本，並在每頁標示該版本。
2. 在同一次 CI 工作區讀取 `palladio/dist/`，不於建置時抓取 `latest` npm 套件或遠端 URL。
3. 對 token key、元件 README、規格章節與可及性文件執行完整性檢查；缺漏時使文件站 build 失敗。
4. 將 token inspector 的資料限制在目前發佈格式，且不推導 accent 色值、不提供 fallback。
5. 對 `agent-reference.md`、`tokens.json` 與 `package.json` 的版本做一致性檢查；版本不一致時使 build 失敗。
6. 從 `palladio/dist/css/palladio.css` 與實際使用的 `navigation.css`、`card.css`、`badge.css`、`divider.css` 產生部署 CSS 副本；副本與來源不一致時使 build 失敗。

這讓網站、npm 產物與 agent reference 來自同一 commit 的產物。歷史版本的文件由對應 Git tag 與 npm 版 `agent-reference.md` 保留；第一版不建立網站內多版本文件。當產品需要同時查閱兩個以上已支援 major 版本時，再評估版本化文件功能。

## 5. 技術選型比較

| 方向 | 優點 | 代價與缺口 | 結論 |
|---|---|---|---|
| Node 靜態產生腳本 + vanilla JS | 與現有 Node token pipeline、純靜態 `site/` 一致；僅新增一個 Markdown parser 開發依賴；可把固定來源收集、HTML 模板、搜尋索引與 token 表格限制在小型程式 | 頁面 metadata、導覽與搜尋匹配需自行維護；頁數或互動需求擴大時，腳本可能失去優勢 | **採用** |
| VitePress 靜態產生器 | 提供 Markdown 路由、文件主題、資料載入與搜尋 | 新增 Vue、client hydration、theme 擴充與獨立專案配置；第一版規模無法攤提固定成本 | 不採用 |
| Eleventy 類輕量 SSG | 沒有 client framework，提供模板與 Markdown pipeline | 仍需獨立設定、模板模型與外掛；本案的固定路由與客製搜尋／inspector 無法比單一腳本明顯減少程式碼 | 不採用 |
| 直接從 token package 生成整站 | token 值不會漂移 | package 不含完整的設計原則、元件 README 與 accessibility contract，無法交付 IA 或元件行為文件 | 不採用；僅作為 token、agent reference 與版本資料來源 |

## 6. 原始碼落點建議（待實作 Issue 確認）

建議將建置程式放在 repo 根目錄的 `scripts/`，文件站部署輸出放在 `site/docs/`。不建立獨立 `docs-site/` 專案，也不將產生器邏輯混入 landing page 的 HTML 或 CSS。

建議結構：

```text
package.json                     # 僅含 Markdown parser 開發依賴與 docs build script
scripts/
└── build-docs.mjs               # 來源收集、完整性檢查、Markdown 轉譯與 HTML 輸出
site/
├── index.html                   # 現有 landing page，維持不變
└── docs/                        # 產生物：HTML、Palladio CSS 副本、assets、tokens.json、search-index.json
```

理由：`site/` 是已部署的純靜態 landing page，GitHub Pages 已直接上傳該目錄。將文件產生物放在其 `/docs/` 子路徑可沿用相同部署單位；把產生器留在 `scripts/` 則維持 landing page 與建置邏輯的邊界。`site/docs/` 是可重建部署輸出，不是手工維護的內容來源。此項是後續實作的建議，不是本 Issue 直接執行的檔案重組決定。

文件輸出建議掛在既有站點的 `/docs/`，而不是獨立 GitHub Pages 網站。理由是同一 origin 可保留 landing page 根路徑、避免第二個 Pages workflow 競態，使用者也能從同一專案 URL 發現兩種入口。

## 7. 部署與網域

延續現有 GitHub Pages workflow 與 `github-pages` environment，且不修改其部署模型。它已上傳 `site/`；後續實作的腳本直接生成 `site/docs/`，因此 Pages workflow 因 `site/**` 變更觸發後會一併部署 landing page 與文件站。

後續實作只需：

1. 在本機或 CI 執行 `scripts/build-docs.mjs`，產生並提交 `site/docs/`。
2. 在既有 CI 增加非部署的 drift check：重新產生到暫存位置並比對 `site/docs/`，來源變更卻未更新輸出時失敗。
3. 讓產生頁以相對 URL 連結文件資產與頁面，不設定 SSG 專屬 `base`；在 GitHub Pages 專案子路徑實測連結與資產。

目標 URL 為：

```text
https://bext1998.github.io/palladio-design-language-system/docs/
```

本階段不設定自訂網域。現有 GitHub Pages 專案 URL 足以驗證 IA、內容生成與搜尋；只有需要品牌網域、跨站 cookie 或明確 SEO 需求時，才另開決策處理 `docs.<domain>`、根網域與 `/docs/` 的取捨。

## 8. 後續實作的驗收與驗證

後續 Issue 在實作前應拆分內容產生器、vanilla token inspector／搜尋、drift check 與視覺驗收；本規劃不建立這些項目。實作完成時至少驗證：

- [ ] 任一 token 變更後，token inspector 與 Foundation 頁的值在一次 build 後更新；沒有人工同步檔案。
- [ ] 任一元件 README 變更後，對應元件頁與索引更新；缺 README 使 build 失敗。
- [ ] `agent-reference.md`、`tokens.json`、`package.json` 版本不一致時，build 失敗。
- [ ] `/docs/`、六個元件頁、Accessibility、Tokens 與 Guides 均可在 GitHub Pages 專案子路徑載入。
- [ ] `search-index.json` 與 vanilla 搜尋可找到中文規格文字、token 名稱與元件名稱。
- [ ] 文件站在所有路由載入 Foundation CSS 與對應的 `pd-nav`、`pd-card`、`pd-badge`、`pd-divider` CSS；自訂 layout CSS 只引用 Semantic token。
- [ ] 右欄在桌面所有路由顯示 token inspector；窄螢幕面板先顯示 inspector，再顯示頁內 TOC。
- [ ] dark-only、Compact／Default／Spacious、鍵盤導覽與 reduced-motion 以實際 render 截圖及互動檢查驗收。
- [ ] 文件站本身通過 A-M1–A-M6；沒有將 token、元件或可及性規則排除於文件站範圍。
- [ ] Pages workflow 成功部署後，landing page 根路徑未被改寫。

## 9. 風險與後續決策

| 風險 | 處理方式 |
|---|---|
| 規格章節結構改名，抽取規則失效 | collector 對必要標題執行明確斷言，失敗後要求更新映射，不靜默產生空頁。 |
| 元件 README 的格式不一致 | 第一版原樣渲染並從目錄生成索引；需要結構化 metadata 時才新增最小 frontmatter 契約。 |
| 文件與 npm 發佈版本不同步 | 網站使用同一 commit 的 `dist/`，顯示 package 版本，並在 build 驗證一致性。 |
| 文件輸出未隨來源更新 | 產生物受版本控制，CI drift check 重新產生並比對；不一致時阻止合併。 |
| 文件站暫時自訂 layout breakpoint 與欄位 | 只允許 breakpoint、grid 欄位與收合規則使用原生 CSS；#61 定案後重新檢視並遷移。 |
| 未來需要多版本文件 | 先由 tag 與版本化 agent reference 提供歷史查閱；出現多個受支援 major 版本後再立項評估。 |

## 10. 本文件的權威性

本文件是 Issue #45 的文件站 IA、內容來源、技術選型與部署規劃的唯一權威來源。設計語言、token 值、元件行為與可及性規則的權威來源仍分別是 `docs/spec.md`、`palladio/dist/`、`palladio/components/*/README.md` 與 `palladio/docs/accessibility/accessibility-contract.md`；本文件不取代它們。
