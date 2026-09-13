# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

壓力測試階段已退場：規格第十一章改為「驗證策略」，以生產環境接入取代合成壓力測試（commit `420c579`）；#4、#8、#14、#15 依此次改寫後的驗收條件關閉——原始「兩產品真實 accent 驗證」條件當時未達成（對應 PR #32、#33 自承不滿足 #15、撤回未合併），對抗式審查已就此開 Issue #88 記錄。Foundation、可及性修正與第一批元件全數關閉，`@pdiodsgn/tokens` v0.1.1 已發佈；官網已遷入 `site/` 並由 PR #48 部署至 GitHub Pages，但官網 CSS 目前手動複製色值、未實際消費 Palladio token，不構成「生產環境驗證」的真實案例（同見 Issue #88）。

目前前線是 PR #70（文件站規劃＋實作，對應 #45）——**已開啟、未合併**，使用者在細節（視覺骨架、accent 插槽、active 狀態 class、token inspector 去留）上持續提出要求，PR 內已迭代三輪；使用者已明確要求**先不要合併**，還有更多細節要求待提出。另外今日盤點看板/通用元件素材，新開 10 張待決策工單（#60–#69），加上既有 5 張（#49、#53、#54、#57、#58），元件缺口工單共 15 張，皆需先完成 `docs/spec.md` 第十章程式範圍變更才能實作。

## 行動（最多 3 項）

1. **PR #70**（[文件站：規劃＋實作](https://github.com/bext1998/palladio-design-language-system/pull/70)）：等待使用者提出下一批細節要求，收到後在同一分支（`maze/2026-09-11-3cc58d`）繼續調整；**不要合併**。已完成的迭代：技術選型（撤回 VitePress，改 Node script＋vanilla JS）、dogfooding 元件對應、accent 插槽補齊、側邊導覽 active class 修正、常駐 token inspector 移除。
2. [#46](https://github.com/bext1998/palladio-design-language-system/issues/46) 官網加入指向 `skills/palladio-design-tokens/` 與版本鎖定 `agent-reference.md` 的內容與連結；`site/` 已在 repo、Pages 已上線，可直接施工。
3. 元件缺口工單，皆需先完成 `docs/spec.md` 第十章程式範圍變更才能實作：
   - [#49](https://github.com/bext1998/palladio-design-language-system/issues/49) **Select／Dropdown**：無元件、無 `select`／`dropdown` token，浮層疊序（z-index）語意未定義。
   - [#53](https://github.com/bext1998/palladio-design-language-system/issues/53) **圓形圖示按鈕**：無 icon-only 按鈕、全 spec 無圖示規範、無 1:1 幾何、`.pd-field` 無 trailing slot。
   - [#54](https://github.com/bext1998/palladio-design-language-system/issues/54) **播放／暫停圓形切換鈕**：無元件亦無圖示可用；已決採「先備好的能力（備案）」定位，見下方已決項。
   - [#57](https://github.com/bext1998/palladio-design-language-system/issues/57) **對話輸入框**：無 composer 元件；`input` README 明文不涵蓋 `<textarea>`，連多行輸入基礎都不存在。僅對話框本體，不含訊息列表／氣泡／串流。
   - [#58](https://github.com/bext1998/palladio-design-language-system/issues/58) **＋ 附加檔案按鈕**：無 icon-only 按鈕、無附件／上傳相關元素或 token；需求來源為**使用者提出**（TaylorAgent 規格對「附件／圖片／上傳」0 命中，工單已如實註記）。
   - [#60](https://github.com/bext1998/palladio-design-language-system/issues/60) **看板欄位容器**：無 column/list 容器元件；依賴 #61 版面決策才能實際多欄並排。
   - [#61](https://github.com/bext1998/palladio-design-language-system/issues/61) **多欄版面 token**：欄寬／欄數／對齊策略完全無 token；即 NEXT_ACTION 舊版「缺漏 C-1（擱置）」的正式化。**已不再是純理論缺口**——PR #70 的文件站是第一個真實撞到這個空白的消費端，目前以「breakpoint／grid 用原生 CSS」的暫時例外繞過（規劃文件 §3.1 已知例外），待此工單定案後需回頭遷移。
   - [#62](https://github.com/bext1998/palladio-design-language-system/issues/62) **Avatar**：無頭像元件，圖片／縮寫雙模式與 fallback 色彩規則未定義。
   - [#63](https://github.com/bext1998/palladio-design-language-system/issues/63) **Modal / Dialog**：無彈窗容器，依賴 #49 疊序決策。
   - [#64](https://github.com/bext1998/palladio-design-language-system/issues/64) **Tooltip**：無提示框，依賴 #49 疊序決策，觸控裝置替代方案未定。
   - [#65](https://github.com/bext1998/palladio-design-language-system/issues/65) **Tabs**：無分頁元件，鍵盤導覽模式全新，與 Navigation 明確區分。
   - [#66](https://github.com/bext1998/palladio-design-language-system/issues/66) **表單勾選控制項**（Checkbox／Radio／Switch）：Input 目前只涵蓋文字型 `<input>`。
   - [#67](https://github.com/bext1998/palladio-design-language-system/issues/67) **Table**：無資料表格元件，依賴已關閉 #8 壓力測試的結論，需重新確認是否可沿用。
   - [#68](https://github.com/bext1998/palladio-design-language-system/issues/68) **Toast / Notification**：無系統提示元件，語意色可沿用 Badge 既有驗證。
   - [#69](https://github.com/bext1998/palladio-design-language-system/issues/69) **Menu（下拉操作選單）**：無動作選單，明確與 #49 Select（選值）區分，依賴 #49 疊序決策。

   #60–#69 十張皆為**使用者提出**的未雨綢繆盤點（看板素材調查與畫 GUI mockup 預備），非源自特定消費端規格；各工單皆已附依設計語言第一至八章的風格要求（不得 box-shadow、圓形用 `pd-radius-full` 但 §4.2 `full` 為點綴、尺寸跟隨 §6.2 density、reduced motion 移除 transform、semantic-only 等）。

## 阻塞與待決策

- **待決策：元件缺口工單（#49、#53、#57、#58、#60、#62–#69）**：皆需使用者明確要求才能修改 `docs/spec.md` 功能範圍；目前僅記錄、不實作。
  - **#49 浮層疊序**：面板本體現有 token 已足夠——§2.1 已把 dropdown 歸入 `pd-color-surface-raised`、§4.1 歸入 `pd-radius-md`；依 §1.2 P2（線條優先、elevation 保守）不引入陰影 token，待決策者僅為 z-index／疊序語意是否 token 化。#63（Modal）、#64（Tooltip）、#69（Menu）皆依賴此決策。
  - **#53 圖示來源與附掛契約**：需決定 Palladio 是否提供圖示規範（或明示消費端自備 SVG）、1:1 圓形是否以 `aspect-ratio` 實作、`.pd-field` 是否新增 trailing slot。#62（Avatar）的幾何決策可能共用結論。
  - **#57 容器命名與插槽契約**：`.pd-field` 契約為單行 input，對話框需新容器（leading／trailing 插槽）；另需決定 Enter／Shift+Enter 與 IME 組字行為、auto-grow 上限。
  - **#58 符號與幾何**：`＋` 或迴紋針、圓形或圓角方形（§4.2「`full` 是點綴」不得因常見而預設）、`accept`／`multiple` 是否由 Palladio 提供預設；若採多入口選單則與 #49 疊序相依。
  - **#61 版面 token 範圍決策**：核心是先決定 Palladio 要不要規範版面層級 token，或明確定位為「版面由消費端自行決定」；PR #70 已提供第一個真實卡點證據，優先度可望提升。
- **已決：#54 採「先備好的能力（備案）」定位**：Palladio 是通用設計系統，元件供給不依賴任何單一消費端的當期路線圖（§10.1 選件判準為「能同時驗證最多 Foundation 決策」）；Taylor 是否／何時承諾 Pause／Resume UI 由 Taylor 依其產品性質自行決定，不構成 Palladio 的阻塞。首次真實消費前標記為**未經生產驗證能力**，接入後依 §11 補一輪回饋；不得順帶鋪開非必需 token（§12 風險表）。
- 無其他阻塞。

## 工作區現況（未追蹤，勿誤刪）

- `palladio/docs/stress-tests/content-creation/`：Chapter Spine 原型與審查紀錄，依 #14 結論刻意保留在未追蹤工作區。
- `docs/research/`：另一 agent 對「成熟設計系統元件數量」的研究筆記，本次 session 的旁支產物，尚未整理進正式文件。
- 本機未提交變更：`AGENTS.md`（worktree 路徑修正）、`DESIGN_REVIEW.md`、`review-artifacts/`、`paseo.json`。

## 權威連結

- [Open PR #70（文件站規劃＋實作，對應 #45）](https://github.com/bext1998/palladio-design-language-system/pull/70)
- [Open Issues（#46、#49、#53、#54、#57、#58、#60–#69）](https://github.com/bext1998/palladio-design-language-system/issues)
- [官網（GitHub Pages）](https://bext1998.github.io/palladio-design-language-system/)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物）
- [可及性契約](palladio/docs/accessibility/accessibility-contract.md)（第九節：accent 插槽對比驗證流程）
- [規格第十一章驗證策略](docs/spec.md)（commit `420c579`）
