# Palladio 專案官網 — 壓力測試決策分類（Issue #4）

檢視素材：`index.html`（瀏覽器直接開啟）。分類依規格第十一章：**A** = 既有 Semantic token、**B** = 明確允許的產品插槽、**C** = 已確認的系統缺漏。

## 產品概念

「Palladio Design Language & System」的專案官網，文案採本專案 README／規格的實際說明。**佈局依使用者 2026-09-06 草圖重建**：單一畫面 hero 佈局——左側 2×2 格（圖片1／任意元件1／任意元件2／圖片2）、右側反白 H1＋Hero 說明段（Regular）＋Getting Started 按鈕、右下角形象 logo、深灰背景。草圖中的字體註解（H1 Bold 反白、內文 Regular、按鈕 Regular）以灰色註解標籤保留在原型中。

重點驗證：**Default → Spacious density**（頁面 Spacious、元件格內 Default）、**accent 插槽在網頁情境的表現**（規格 2.5、6.2、7、8、11、13）。

## Accent 色盤（產品明確提供，規格 2.5）

| 插槽 | 值 | 用途 |
|---|---|---|
| `pd-color-accent` | `#7154E8` | Getting Started 按鈕、元件2 圖示 |
| `pd-color-accent-hover` | `#7157DA` | 按鈕 hover |
| `pd-color-accent-active` | `#5138B8` | 按鈕 active |
| `pd-color-accent-disabled` | `#433A6B` | 按鈕 disabled |
| `pd-color-accent-subtle` | `#262040` | badge（DTCG 2025.10）底色 |
| `pd-color-accent-text` | `#F5F3FF` | accent 上的文字 |

> 注意：本產品 accent 無法作為深底內文連結色（accent on `bg` 僅 3.63:1，低於 A-M1 的 4.5:1），只能用於**大字**（≥3:1）或 **UI 元件**。草圖 H1 全反白（`text-primary`），accent 不進 H1。

## 配對驗證結果

由 `node palladio/docs/stress-tests/validate-accents.mjs`（匯入 `validateAccentPairs()`，契約第九節流程）驗證：

| 配對 | 結果 | 門檻 |
|---|---|---|
| accent-text on accent | 4.63:1 ✅ | A-M1 4.5:1 |
| accent-text on hover | 4.70:1 ✅ | A-M1 4.5:1 |
| accent-text on active | 7.34:1 ✅ | A-M1 4.5:1 |
| accent-text on disabled | 9.31:1 ✅ | A-M1 4.5:1 |
| accent-text on subtle（badge--accent，元件1） | 14.05:1 ✅ | A-M1 4.5:1 |
| 元件2 accent 圖示 on raised | 3.06:1 ✅ | A-M2 3:1 |

## UI 決策分類表

| # | UI 決策 | 分類 | 依據 |
|---|---|---|---|
| 1 | 背景深灰色 | A | `pd-color-bg` |
| 2 | 主框 Spacious density（草圖大留白） | A | `data-density="spacious"`（規格 6.2） |
| 3 | 左右兩欄寬度、2×2 格 4:3 比例 | C | **缺漏 C-1**：版面容器尺寸／欄數／格比無 token 規範 |
| 4 | 圖片1／圖片2 佔位框（pipeline 產物、density 畫面示意） | A | `surface-raised` + `border-default` + `radius-sm`；居中標籤 `body-sm` + `text-secondary`（實際圖片為內容素材，非 UI 決策） |
| 5 | 任意元件1：`pd-card` | A | `surface-raised` + `border-default` + `radius-sm` + `space-4` |
| 6 | 元件1 標題 | A | `pd-text-heading-sm`（14px/600） |
| 7 | 元件1 內文 | A | `pd-text-body-sm` + `text-secondary` |
| 8 | 元件1 badge「DTCG 2025.10」 | B | `pd-badge--accent` = `accent-subtle` 底 + `accent-text` 字（14.05:1） |
| 9 | 任意元件2：`pd-card` + accent 圖示 | B | accent 圖示 on `surface-raised` 3.06:1（`extraPairs`，ui） |
| 10 | 元件格內 Default density（對照頁面 Spacious） | A | `data-density="default"`（規格 6.2；Default 省略屬性即生效，#26 決策） |
| 11 | H1 反白 | A | `pd-text-display`（32px/600/-0.64px）+ `text-primary`；**草圖差異記錄**：草圖寫「Bold」，token 表為 600（SemiBold），以 token 為準 |
| 12 | H1 字體 Noto Sans TW | A | `pd-text-display` 字型欄（Noto Sans，zh-TW 消費端補 Noto Sans TC fallback） |
| 13 | Hero 說明段（Regular，本專案 README 文案） | A | `pd-text-body-lg`（16px/400）+ `text-secondary`；字體隨 body 走 `Noto Sans` 棧 |
| 14 | Getting Started 按鈕 | B | `pd-button`：accent 四態插槽 + `accent-text` 前景（四組必驗配對全過） |
| 15 | 按鈕幾何與字級 | A | `radius-md`、density padding、`min-interactive-size`（Spacious 48px）、`font: inherit` |
| 16 | 「背景：深灰色」註解 | A | `pd-text-body-sm` + `text-secondary`（檢視素材註記標籤） |
| 17 | logo 佔位框 | A | `border-strong` 虛線指示框（on `bg` 4.29:1 ≥3）+ `radius-sm`；logo 本身為內容素材，非 UI 決策 |
| 18 | logo 位置（右下）、尺寸 160×64 | C | **缺漏 C-1**：版面幾何無 token |
| 19 | 欄距／格距 | A | `pd-space-10`（欄間）／`pd-space-6`（格間）／`pd-space-16`（頁緣） |
| 20 | 內容垂直置中與 Getting Started 右對齊（草圖位置） | C | 版面對齊策略，歸入 C-1 版面幾何缺漏一併記錄 |
| 21 | 焦點可見性 | A | `pd-color-border-strong` focus ring（契約第四節，四表面已驗 ≥3:1） |
| 22 | hover／active 轉場 | A | `pd-duration-fast` + `pd-easing-default`（元件內建） |
| 23 | Reduced motion 行為 | A | 契約第六節（元件內建） |

**結論**：23 項 UI 決策全數歸類，無未分類項目；缺漏集中在 C-1（版面幾何）一項。

## 系統缺漏登記

| 編號 | 缺漏 | 影響 | 建議 |
|---|---|---|---|
| C-1 | 版面容器欄寬／欄數／格比／對齊策略無 token（#3、#19、#21） | 產品自訂版面幾何，無共享約束 | 記錄即可；版面幾何是否 token 化交由規格修訂流程決定 |

## 產品責任邊界（非缺漏，屬 B 類插槽的驗證責任）

- accent 不可作深底內文連結色（3.63:1 < 4.5）→ 原型無 accent 內文連結；H1 依草圖全反白。
- accent 圖示只能在 `bg`／`surface`／`surface-raised` 上使用；`surface-overlay` 未達 3:1（2.67:1）→ 本原型未在 overlay 上放置 accent UI 元件。