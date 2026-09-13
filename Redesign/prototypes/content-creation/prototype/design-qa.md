# Design QA — Issue #14 內容創作型壓力測試

source visual truth: `../concept-chapter-spine.png`

implementation: `http://localhost:4173/`

scope: 本輪只修復既有 Chapter Spine React 原型的可觀察狀態、窄螢幕可用性、density、字體 token 引用與產品 accent mock 驗證；未重設計方向，未接外部 AI。

## 後續瀏覽器重驗回報與修復

主代理提供的瀏覽器重驗指出 D-1 至 D-4 版面缺陷。本輪依該證據修復，未在本輪重開瀏覽器：

| 缺陷 | 修復 |
|---|---|
| D-1：820px 以下主稿空白 | mobile grid 宣告加上 `!important`，解除舊版收合欄位規則的覆寫；sidebar／AI panel 保持 fixed drawer，不再 `display:none`。 |
| D-2：900–1000px topbar 遮住主稿 | `max-width:1120px` 時 topbar 寬度跟隨 sidebar 的 280px；821px 以上 sidebar 收合時 topbar 改為 72px 並保留漢堡控制。 |
| D-3：sidebar 收合後左側孤兒空白 | app shell 以狀態 class 控制 topbar 與 manuscript inner；收合 sidebar 時 manuscript inner 上限提升至 960px。 |
| D-4：AI panel 關閉後孤兒空白 | AI panel 關閉時 manuscript inner 上限提升至 960px；雙 panel 關閉時提升至 1200px，長文 body measure 仍維持 36rem。 |
| 無效控件 | Draft、Add chapter、章節 actions、writing settings、filters、more actions 標記 disabled；子場景改為非互動 list item；不再讓點擊看似有效。 |
| 靜態字數 | 由目前章節段落計算字數，Apply 與章節切換後更新。 |

這些是程式與 CSS 修復結果；本輪沒有視覺 render 證據，不能宣稱 D-1 至 D-4 已通過視覺驗收。

## 本輪修復前後

| 問題 | 修復前 | 修復後 | 證據 |
|---|---|---|---|
| Apply | 只有 `setApplied(true)`，稿件段落不變 | `applySuggestion()` 以目前章節與指定段落更新本機 mock draft；quote、套用後文案與章節一致 | `tests/editor-model.test.mjs` 2 tests passed |
| 窄螢幕 panel | `sidebar`、`ai-panel` 在 820px 以下 `display: none`，開關無法使用 | 以可開關側滑 panel、scrim、topbar controls、focus return 提供操作；關閉狀態加 `aria-hidden`／`inert` | source contract checks、build passed；未做瀏覽器視覺重驗 |
| Tab 邊界 | grid track 收合後 panel 仍可能進入 Tab | panel 關閉時 `inert`，開啟時 focus 到 panel control／prompt input | App source review；未做瀏覽器鍵盤重驗 |
| 密度 | scene row 為 28px；small button 共用 sidebar 尺寸 | `App.jsx` 在 sidebar／manuscript／AI panel 上標了 `data-density="compact"`／`"default"`，但這只是標記，尚未接上任何 density 樣式規則——`styles.css` 沒有任何 `[data-density=...]` 選擇器，Foundation CSS 的 density 切換只認 `:root[data-density=...]`。目前各處尺寸（如 36px）仍是各自硬編，跟這個屬性無關；density 尚未真正實作，是已知未完成項目。 | CSS source review：無 `[data-density]` 規則命中 |
| Accent | 只有三槽；disabled 使用 success 白字 | 六個明確產品 mock 插槽；disabled 使用 `accent-disabled` 與 `accent-text`；無 fallback、推導或混色 | `tests/accent-contract.test.mjs` 1 test passed |
| 字體 | h1／長文以 CSS 硬編尺寸 | 由生成的 `palladioTokens.text.display` 與 `palladioTokens.text["body-lg"]` 結構化 token 注入；長文維持 body-lg 16px / 1.6 | build passed；未做瀏覽器 computed-style 重驗 |

## Accent contract evidence

實際讀取 `src/styles.css` 的六個產品 mock slot，再傳入 `palladio/pipeline/validate-accessibility.mjs` 的 `validateAccentPairs()`：

```text
accent          #8E82F0
accent-hover    #A59BFF
accent-active   #8170EA
accent-disabled #8F84B9
accent-subtle   #1F1A38
accent-text     #141414
```

必要 `accent-text` 配對（A-M1）已執行：

- accent：5.79:1
- accent-hover：7.66:1
- accent-active：4.77:1
- accent-disabled：5.41:1

產品實際列出的其他配對也已執行：

- accent-hover text on active chapter surface：6.45:1，A-M1
- accent-hover icon on accent-subtle：6.91:1，A-M2
- accent icon on active chapter surface：4.88:1，A-M2

結果：7/7 passes。這是原型產品 mock 的對比證據，不代表 Palladio 全域 token 或 issue 驗收完成。

## 已執行驗證

- `node --test tests/editor-model.test.mjs tests/accent-contract.test.mjs`：3 tests passed。
- `npm run build`：通過，Sites 產物存在。
- `npm run test:sites`：4 tests passed。
- 靜態檢查確認 `data-density`、`aria-hidden`、`inert`、六槽 CSS 值、32／36px semantic size 引用、mobile drawer 宣告與收合後 layout class 存在。
- `tests/layout-contract.test.mjs`：2 tests passed，覆蓋 mobile grid、drawer、topbar 收合、manuscript inner 與 disabled／dynamic word count 契約。
- 本輪未使用瀏覽器或 Computer Use；沒有新增視覺截圖，也沒有把舊截圖當成修復後證據。

## 未執行與待主代理重驗

- 未在本輪執行桌面或窄視窗 render、截圖、console、Tab 順序與 focus return 的瀏覽器驗證。
- 未確認短視窗實際 scroll／panel 高度在真實瀏覽器中的 optical 結果；CSS 已改用 `100dvh` 與 panel `max-height: 100dvh`，仍需 render evidence。
- 未重新確認 Chapter Spine 與生成圖的欄寬、稿紙 measure、topbar 遮擋與 panel 視覺層級。
- 未確認無效控件的 disabled 視覺樣式是否足以讓使用者辨識「未實作」；目前保留 `title` 與 disabled semantics。
- 舊版視覺 QA 的 `passed` 僅代表修復前狀態；本文件目前不宣稱本輪視覺通過。

final result: pending visual recheck by main agent
