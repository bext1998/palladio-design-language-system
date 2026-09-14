# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

壓力測試階段已退場：規格第十一章改為「驗證策略」，以生產環境接入取代合成壓力測試（commit `420c579`）；#4、#8、#14、#15 依此次改寫後的驗收條件關閉——原始「兩產品真實 accent 驗證」條件當時未達成（對應 PR #32、#33 自承不滿足 #15、撤回未合併），對抗式審查已就此開 Issue #88 記錄文件誠實度落差，PR #89 已修正 `DECISIONS.md`／`NEXT_ACTION.md` 對應敘述，**Issue #88 已關閉**。Foundation、可及性修正與第一批元件全數關閉，`@pdiodsgn/tokens` v0.1.1 已發佈；官網已遷入 `site/` 並由 PR #48 部署至 GitHub Pages，但官網 CSS 目前手動複製色值、未實際消費 Palladio token，不構成「生產環境驗證」的真實案例。

目前前線是 PR #70（文件站規劃＋實作，對應 #45）——**已開啟、未合併**，使用者在細節（視覺骨架、accent 插槽、active 狀態 class、token inspector 去留）上持續提出要求，PR 內已迭代三輪；使用者已明確要求**先不要合併**，還有更多細節要求待提出。另外看板/通用元件素材盤點累計元件缺口工單 16 張（#49、#53、#54、#57、#58、#60–#69、#77）。

**規格四層拆分已執行（2026-09-14）**：依 `SPEC_MIGRATION_PLAN.md` 的分類表，`docs/spec.md` 已重寫為只收已升格契約，護欄移入 `docs/guardrails.md`，待驗證候選規則移入 `docs/experiments/`（7 個主題檔案），已取代／背景內容移入 `docs/archive/spec-v0.1.md`；`AGENTS.md`、`DECISIONS.md`、`README.md`、`PROJECT_BRIEF.md`、`MAZE_PROJECT.md`、元件 README、pipeline 內的舊章節引用已同步更新。此變更以 PR 形式提出，尚待使用者審查合併（不是本次自動合併）。

**工作流方向調整（2026-09-13～14）**：Issue #85（使用者親自設計六元件視覺稿，Issue #84 六元件視覺重審的前置依賴）指出根因——元件從沒被人以視覺品味實際設計過，agent 只能在規格真空裡自己填。對應調整：`AGENTS.md` 規則 8（PR #87）把「設計不確定」的處理方式改為「先做候選原型比較，使用者裁決後才寫回 `docs/spec.md`」；`Redesign/IMAGE_TO_DESIGN_TOKEN_WORKFLOW.md`（PR #90）落地這套「圖像／概念先行 → 原型實驗驗證 → 逐步收斂回正式規格」的具體流程，`Redesign/prototypes/content-creation/` 是第一個依此流程產出的探索原型。這使得上述 16 張元件缺口工單原本「皆需先完成 `docs/spec.md` 第十章程式範圍變更才能實作」的阻塞條件過期——已在每張工單留言指向新路徑（可直接用 `Redesign/prototypes/` 開始做候選方案，不必再等一個範圍變更核准），工單本身內容（缺口盤點、風格要求、驗收條件）未變、未關閉。

## 行動（最多 3 項）

1. **PR #70**（[文件站：規劃＋實作](https://github.com/bext1998/palladio-design-language-system/pull/70)）：等待使用者提出下一批細節要求，收到後在同一分支（`maze/2026-09-11-3cc58d`）繼續調整；**不要合併**。已完成的迭代：技術選型（撤回 VitePress，改 Node script＋vanilla JS）、dogfooding 元件對應、accent 插槽補齊、側邊導覽 active class 修正、常駐 token inspector 移除。
2. [#46](https://github.com/bext1998/palladio-design-language-system/issues/46) 官網加入指向 `skills/palladio-design-tokens/` 與版本鎖定 `agent-reference.md` 的內容與連結；`site/` 已在 repo、Pages 已上線，可直接施工。
3. 元件缺口工單（阻塞條件已更新，見上方「工作流方向調整」——可直接用 `Redesign/prototypes/` 開始做候選方案，不必等 spec 範圍變更核准）：
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
   - [#77](https://github.com/bext1998/palladio-design-language-system/issues/77) **Button 強度層級變體**（Secondary／Ghost／Subtle）：Pi Agent 美學審查提出，`.pd-button` 目前只有單一實心強度，查無既有 README 記錄理由，需決策是否提供層級變體。

   #60–#69 十張皆為**使用者提出**的未雨綢繆盤點（看板素材調查與畫 GUI mockup 預備），非源自特定消費端規格；各工單皆已附依 `docs/guardrails.md`（reduced motion 移除 transform、semantic-only）與尺寸跟隨 `docs/spec.md` §6.2 density 的硬規則，圓角「`full` 是點綴不是預設」與「不得 box-shadow」目前是 `docs/experiments/shape-context-principles.md`、`docs/experiments/design-language-personality.md` 記錄的候選原則（尚待使用者裁決），工單援引時應視為候選方向而非已定案規則。

## 阻塞與待決策

- **待推進：Issue #85／#84（六元件視覺重審鏈）**：#85 要求使用者親自畫六元件視覺稿，是 #84 視覺重審的前置依賴；目前已有具體流程可用（`Redesign/IMAGE_TO_DESIGN_TOKEN_WORKFLOW.md`、`docs/experiments/README.md`），但六元件視覺稿本身尚未交付，對應規則裁決後才會寫入 `docs/spec.md`。不是阻塞，是待使用者產出。
- **不再阻塞：元件缺口工單（#49、#53、#57、#58、#60、#62–#69、#77）**：原本「需使用者明確要求才能修改 `docs/spec.md` 功能範圍」的前置關卡已被 `AGENTS.md` 規則 8 取代——現在可以直接用 `Redesign/prototypes/` 原型驗證候選方案，方案經使用者裁決後才寫回 spec。以下待決策內容本身不變，只是不再需要「先核准範圍」這一步：
  - **#49 浮層疊序**：面板本體現有 token 已足夠——§2.1 已把 dropdown 歸入 `pd-color-surface-raised`、§4.1 歸入 `pd-radius-md`；依現行慣例（線條優先、elevation 保守；見 `docs/experiments/design-language-personality.md` 候選原則 P2）不引入陰影 token，待決策者僅為 z-index／疊序語意是否 token 化。#63（Modal）、#64（Tooltip）、#69（Menu）皆依賴此決策。
  - **#53 圖示來源與附掛契約**：需決定 Palladio 是否提供圖示規範（或明示消費端自備 SVG）、1:1 圓形是否以 `aspect-ratio` 實作、`.pd-field` 是否新增 trailing slot。#62（Avatar）的幾何決策可能共用結論。
  - **#57 容器命名與插槽契約**：`.pd-field` 契約為單行 input，對話框需新容器（leading／trailing 插槽）；另需決定 Enter／Shift+Enter 與 IME 組字行為、auto-grow 上限。
  - **#58 符號與幾何**：`＋` 或迴紋針、圓形或圓角方形（見 `docs/experiments/shape-context-principles.md` 候選原則：「`full` 是點綴」不得因常見而預設）、`accept`／`multiple` 是否由 Palladio 提供預設；若採多入口選單則與 #49 疊序相依。
  - **#61 版面 token 範圍決策**：核心是先決定 Palladio 要不要規範版面層級 token，或明確定位為「版面由消費端自行決定」；PR #70 已提供第一個真實卡點證據，優先度可望提升。
- **已決：#54 採「先備好的能力（備案）」定位**：Palladio 是通用設計系統，元件供給不依賴任何單一消費端的當期路線圖（§10.1 選件判準為「能同時驗證最多 Foundation 決策」）；Taylor 是否／何時承諾 Pause／Resume UI 由 Taylor 依其產品性質自行決定，不構成 Palladio 的阻塞。首次真實消費前標記為**未經生產驗證能力**，接入後依 §11 補一輪回饋；不得順帶鋪開非必需 token（§12 風險表）。
- 無其他阻塞。

## 工作區現況

- PR #90（已合併）把 `palladio/docs/stress-tests/content-creation/` 搬到 `Redesign/prototypes/content-creation/`、`docs/research/` 搬到 `Redesign/research/`；`DESIGN_REVIEW*.md`、`review-artifacts/`、`SPEC_ADVERSARIAL_REVIEW-2026-09-13.md` 皆已提交版控（原本是本機未追蹤檔案，細節見 `Redesign/MOVE_MANIFEST.md`）。此段先前列的「未追蹤、勿誤刪」路徑已不適用。
- `paseo.json`（[Paseo](https://github.com/getpaseo/paseo) 本機 agent workspace 設定檔）已加入 `.gitignore`，不進版控，非本專案原始碼。
- 兩個 prototype（`Redesign/prototypes/content-creation/prototype`、`review-artifacts/button-baseline-v0.1/prototype`）的 `dist/` build 產物已加入 `.gitignore`，不進版控；`npm run demo` 可一鍵 build + 開瀏覽器預覽。

## 權威連結

- [Open PR #70（文件站規劃＋實作，對應 #45）](https://github.com/bext1998/palladio-design-language-system/pull/70)
- [Open Issues（#45、#46、#49、#53、#54、#57、#58、#60–#69、#75、#76、#77、#84、#85）](https://github.com/bext1998/palladio-design-language-system/issues)
- [Redesign 原型先行工作流](Redesign/IMAGE_TO_DESIGN_TOKEN_WORKFLOW.md)（PR #90，取代舊有「先核准 spec 範圍」關卡）
- [官網（GitHub Pages）](https://bext1998.github.io/palladio-design-language-system/)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物）
- [可及性契約](palladio/docs/accessibility/accessibility-contract.md)（第九節：accent 插槽對比驗證流程）
- [已升格契約](docs/spec.md)／[護欄](docs/guardrails.md)／[候選規則](docs/experiments/)／[已取代內容](docs/archive/spec-v0.1.md)——四層分工依 `SPEC_MIGRATION_PLAN.md` 執行完成，取代原規格第十一章「驗證策略」（commit `420c579`；狀態見 `DECISIONS.md`、Issue #88）
