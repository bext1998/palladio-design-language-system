# 視覺重驗 v2 — Issue #14（修正後）

- 對象：`http://localhost:4173/`，以本次 `npm run build` 產出的 `dist/client` 重新 serve
- 分支：`maze/2026-09-06-d1f82e`
- 方法：Chrome 實機 render，涵蓋寬度 760 / 984 / 1440–1456px，另以 `documentElement` / 各面板 `scrollHeight` 量測捲動；截圖 `v2-01 … v2-11`
- Console：全程無 error / warning

---

## 修正驗證結果

| 項目 | v1 問題 | v2 實測 | 判定 | 截圖 |
|---|---|---|---|---|
| **D-1** 窄視窗主編輯區空白 | <820px manuscript 全空白、無側滑、無 scrim | 760px fresh load：manuscript 完整 render（標題＋全文，measure 用滿寬度）。漢堡 → sidebar 以覆蓋 drawer 滑入、manuscript 在後方變暗仍在；點 manuscript(scrim) 可關閉。Show AI → AI 以右側 drawer 覆蓋、manuscript 變暗仍在 | **已修復** | `v2-04` `v2-05` `v2-06` `v2-07` |
| **D-2** 中寬度 header 碰撞裁切 | 900–1000px eyebrow 被漢堡遮成「er 03」、H1 上緣被切 | 984px：「Chapter 03」「The Threshold」完整可見，漢堡在 280px sidebar 欄內不重疊；三欄雖擠但無裁切 | **已修復** | `v2-08` `v2-09` |
| **D-3** 桌面收合 sidebar 不回收版面 | 收合後左側 ~320px 死白、內文不動 | 收合後 manuscript 左移並重排使用釋出空間；topbar 縮為僅漢堡 | **已修復** | `v2-02` |
| **D-4** 關閉 AI panel 內文不重排 | 內文靠左、與 sidebar 間 ~240px 孤兒空白 | 關閉 AI 後 manuscript 佔用原 AI 區、量測寬度加大並置於合理位置，與 sidebar 間距正常；`Ask AI` 為重開入口 | **已修復** | `v2-03` |
| 無效控制項 | Draft▾ / +Add / ⋮ / 齒輪 / filters / more actions 點擊無反應 | DOM 確認皆 `disabled`：Draft、Add chapter、More document actions、Open writing settings、Open chapter filters、Chapter actions。章節 01–05、Toggle chapters、Hide AI、Close panel 仍可用 | **已處理** | `v2-01` |
| 子場景項目 | 點非作用章節子場景只切粗體、無作用 | 子場景不再是 `button`；為非互動清單 | **已處理** | `v2-01` |
| 動態字數 | 靜態「2,734 words」 | 隨章節變化（Chapter 03 顯示「178 words」） | **已修復** | `v2-01` |

---

## 桌面多餘垂直捲軸（待決事項）覆核

以 JS 量測（viewport 1440×889）：

- `html` 垂直溢出 = 0、`body` 水平溢出 = 0 → **無頁面級捲軸、無水平捲軸**
- 唯一內部捲動元素：`nav.chapter-list`（章節清單過長時內捲），屬預期設計
- viewport 高度僅 749px 時另見 `main.manuscript` 溢出 45px、`div.ai-panel__content` 溢出 4px；把視窗調高（889px 以上）即消失 → 純內容高度／sub-pixel 造成，非版面缺陷

結論：在正常視窗高度下桌面沒有多餘捲軸；`ai-panel__content` 的 4px 溢出只在極矮視窗出現，屬 cosmetic edge case，同意不要用猜測方式強制隱藏。若要收尾，可檢查 `.ai-panel__content` 的 padding / border-box 計算是否差 4px。

---

## 總結

- D-1～D-4 四項在瀏覽器中皆通過重驗；D-1 從 merge blocker 解除。
- 無效控制項與子場景已依「不留無效元件」要求處理（disabled / 非互動）。
- 動態字數已修。
- 桌面捲軸：無實質問題，僅極矮視窗有 4px sub-pixel 溢出，列為可選收尾。
- 原型層級：回歸測試 5/5、build、`test:sites` 4/4 皆通過（開發者回報，未於本輪重跑）。本輪由審查者重跑 `layout-contract.test.mjs` → 2/2 通過。
