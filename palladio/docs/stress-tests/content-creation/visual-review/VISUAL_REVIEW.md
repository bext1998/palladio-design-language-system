# 視覺審查 — Issue #14 內容創作型壓力測試（Chapter Spine 原型）

- 審查對象：`http://localhost:4173/`（vite preview，serve `prototype/dist/client`）
- 分支：`maze/2026-09-06-d1f82e`
- 來源視覺真值：`../concept-chapter-spine.png`
- 對應 QA 文件：`../prototype/design-qa.md`（其 `final result: pending visual recheck by main agent`）
- 方法：Chrome 實機 render + 點擊測試 + 多視窗寬度；每個動作皆截圖，存於本目錄 `01-*.jpg … 24-*.jpg`
- Console：全程 `read_console_messages` 無任何 error / warning → 以下皆為 CSS 版面問題，非 JS 例外

> 備註：使用者原稱「網頁已開好」，但 `localhost:4173` 當時未在監聽（`curl` 回 000）。本次審查由審查者以 `npm run preview -- --port 4173` 啟動同一份 `dist` 後進行。

---

## 一、可運作的互動（通過）

| 動作 | 結果 | 截圖 |
|---|---|---|
| 初始載入（桌面 1456px） | 三欄（sidebar / manuscript / AI panel）正常，符合概念圖結構 | `01` |
| AI 建議 **Apply** | manuscript 第 2 段即時被 mock 改寫；建議卡轉為「Suggestion applied」綠框；按鈕轉「✓ Applied」並停用 | `02` |
| 章節切換（點 `01 The Arrival` 等章層項目） | manuscript、章節 eyebrow、AI 建議、Apply 狀態全部隨章節更新 | `03` |
| **Ask AI** 開啟 → 輸入 → Enter 送出 | 底部出現輸入框並取得焦點；送出後建議卡標題變「Reviewing: …」；輸入框清空保持開啟 | `05` `06` `07` |
| 關閉 AI 編輯器（X） | AI panel 收起，中欄容器變寬 | `12` |
| 於窄視窗按 **Show AI / Hide AI** | AI panel 以覆蓋方式開合 | `19` |
| Sidebar 顯示/隱藏切換（頂部漢堡鈕） | 章節清單本身可被隱藏並可再顯示 | `13` `15` |

---

## 二、缺陷（需修）

### D-1　窄視窗下 manuscript 主編輯區完全空白（嚴重）
視窗寬 ≈760px 時，**新載入畫面只剩頂部 bar，sidebar 與 manuscript 皆為全黑空白**；按漢堡鈕只叫得出 sidebar，稿件內容從頭到尾不出現，按 Show AI 後左側稿件區仍是空白。長文與 sidebar+panel 多密度混用在此寬度下不可用。
- 證據：`20`（fresh load 全空）、`16`（sidebar 開、右側空白）、`17` `18`（sidebar 關、內容區空白）、`19`（Show AI 後稿件區仍空）
- 與 `design-qa.md`「窄螢幕 panel：以可開關側滑 panel、scrim、topbar controls… 提供操作」不符——實測無側滑、無 scrim，且主內容遺失。該列證據欄自述「未做瀏覽器視覺重驗」，本次重驗未通過。

### D-2　中等寬度 header 與標題碰撞、裁切（中）
視窗寬 ≈900–1000px 時，章節 eyebrow「Chapter 03」被 sticky 頂部 bar 與漢堡鈕遮成「er 03」，H1「The Threshold」上緣被切、左緣被 sidebar 蓋住成「…e Threshold」。manuscript header 沒有為 sticky topbar 讓出空間。
- 證據：`21`（sidebar 關，標題被頂 bar 裁掉上半）、`22`（三欄擠壓 + 標題/eyebrow 重疊）、`23`（放大特寫）

### D-3　桌面收合 sidebar 不回收版面（中）
桌面寬度按漢堡鈕收合 sidebar 後，左側約 320px grid track 變成**空的黑色區塊**，manuscript 不左移、不加寬，只是把清單藏起來。
- 證據：`13`（收合後左側大片空白）、`14`（左上放大：只剩標題與漢堡浮在空白上）、`15`（再按一次可復原）

### D-4　關閉 AI 編輯器後 manuscript 不重新置中（輕）
桌面關閉 AI panel 後中欄變寬，但受 measure 上限限制的內文維持靠左，sidebar 與內文之間留下 ≈240px 孤兒空白，視覺上與 sidebar 黏連、與版面脫節。
- 證據：`12`

---

## 三、無效元件（點擊無反應，建議標示為未實作或移除）

以下控制項有 hover/focus 樣式但點擊無任何可觀察結果，與使用者「不要留無效元件」的要求相關：

| 元件 | 位置 | 截圖 |
|---|---|---|
| `Draft ▾` 下拉 | 左上標題下 | `09` |
| `+`（Add chapter） | CHAPTERS 標頭右 | `11` |
| 章節 `⋮`（Chapter actions） | manuscript 標題右 | `10` |
| `Open writing settings`（齒輪） | sidebar 左下 | `08` |
| `Open chapter filters`（滑桿圖示） | sidebar 右下 | 併於 `08` 視野 |
| 子場景項目（`03.02 The Choice` 等） | sidebar；點非作用章節下的子場景只切換自身粗體，不換章、不捲動、manuscript 無變化 | `04` |

---

## 四、其他觀察（非阻斷）

- 字數「2,734 words」為靜態字串：Apply 大幅縮短段落後、切到僅數行的章節後皆不變（`02` `03`）。
- 桌面遠右側與 AI panel 各有一條在內容未溢出時仍出現的垂直捲軸（`24`）。
- 桌面 manuscript 每行約 90 字元，略寬於長文舒適區間（60–75），與概念圖一致，僅記錄。

---

## 五、結論

- 桌面單一寬度（≈1400px 以上）下核心寫作流程（讀章、切章、AI 建議 Apply、Ask AI）**可運作**。
- **響應式（D-1、D-2）未通過視覺重驗**：Issue #14 明確要驗「sidebar + panel 配合、多密度混用」，目前在桌面以外的寬度會遺失主內容或發生 header 碰撞，`design-qa.md` 對窄螢幕的修復宣稱在瀏覽器中不成立。
- 另有多個無效控制項（第三節），與「不留無效元件」的要求衝突，建議一併處理或移除。
- 建議：D-1 視為 merge blocker；D-2/D-3 為次級；D-4 與第三、四節可排入後續。
