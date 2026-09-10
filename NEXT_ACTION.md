# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

壓力測試階段已退場：規格第十一章改為「驗證策略」，以生產環境接入取代合成壓力測試（commit `420c579`）；#4、#8、#14、#15 皆以 COMPLETED 關閉，對應 PR #32、#33 撤回未合併。Foundation、可及性修正與第一批元件全數關閉，`@pdiodsgn/tokens` v0.1.1 已發佈，官網已遷入 `site/` 並由 PR #48 部署至 GitHub Pages。

目前前線為文件與官網，外加三張待規格修訂的元件缺口工單。開啟中的 Issue：#45（文件站規劃）、#46（官網指向 AI 技能包與 agent-reference）、#49（Select／Dropdown）、#53（圓形圖示按鈕）、#54（播放／暫停切換鈕）。

## 行動（最多 3 項）

1. [#46](https://github.com/bext1998/palladio-design-language-system/issues/46) 官網加入指向 `skills/palladio-design-tokens/` 與版本鎖定 `agent-reference.md` 的內容與連結；原文相依的「官網原始碼要先決定落點」已由 PR #47、PR #48 解除（`site/` 已在 repo、Pages 已上線），可直接施工。
2. [#45](https://github.com/bext1998/palladio-design-language-system/issues/45) 文件站規劃（IA、產生來源、技術選型、部署）；施工前先修正 Issue 前提，見下方阻塞項。
3. 元件缺口三張工單，皆需先完成 `docs/spec.md` 第十章程式範圍變更才能實作：
   - [#49](https://github.com/bext1998/palladio-design-language-system/issues/49) **Select／Dropdown**：無元件、無 `select`／`dropdown` token，浮層疊序（z-index）語意未定義。
   - [#53](https://github.com/bext1998/palladio-design-language-system/issues/53) **圓形圖示按鈕**：無 icon-only 按鈕、全 spec 無圖示規範、無 1:1 幾何、`.pd-field` 無 trailing slot。
   - [#54](https://github.com/bext1998/palladio-design-language-system/issues/54) **播放／暫停圓形切換鈕**：無元件亦無圖示可用；已決採「先備好的能力（備案）」定位，見下方已決項。

   三者皆已附依設計語言第一至八章的風格要求（不得 box-shadow、圓形用 `pd-radius-full` 但 §4.2 `full` 為點綴、尺寸跟隨 §6.2 density、reduced motion 移除 transform、semantic-only 等）。

## 阻塞與待決策

- **#45 前提過期（文件層，非阻塞）**：Issue 描述「行銷官網（concept B，`Palladio-static-site/`，目前在桌面、尚未進 repo）」與現況不符——`site/` 已於 PR #47 遷入並經 PR #48 部署；文件站規劃本體（IA、生成來源、技術選型、部署）仍有效。
- **待決策：元件缺口工單（#49、#53）**：皆需使用者明確要求才能修改 `docs/spec.md` 功能範圍；目前僅記錄、不實作。
  - **#49 浮層疊序**：面板本體現有 token 已足夠——§2.1 已把 dropdown 歸入 `pd-color-surface-raised`、§4.1 歸入 `pd-radius-md`；依 §1.2 P2（線條優先、elevation 保守）不引入陰影 token，待決策者僅為 z-index／疊序語意是否 token 化。
  - **#53 圖示來源與附掛契約**：需決定 Palladio 是否提供圖示規範（或明示消費端自備 SVG）、1:1 圓形是否以 `aspect-ratio` 實作、`.pd-field` 是否新增 trailing slot。
- **已決：#54 採「先備好的能力（備案）」定位**：Palladio 是通用設計系統，元件供給不依賴任何單一消費端的當期路線圖（§10.1 選件判準為「能同時驗證最多 Foundation 決策」）；Taylor 是否／何時承諾 Pause／Resume UI 由 Taylor 依其產品性質自行決定，不構成 Palladio 的阻塞。首次真實消費前標記為**未經生產驗證能力**，接入後依 §11 補一輪回饋；不得順帶鋪開非必需 token（§12 風險表）。
- **待決策：缺漏 C-1（擱置）**——「版面容器欄寬／欄數／格比／對齊策略無 token 規範」原記錄於 `palladio/docs/stress-tests/landing-page/decisions.md`，該檔隨 PR #32 撤回而不在 `main`（該撤回分支已刪除；內容仍可由 PR ref `refs/pull/32/head` 取回）。合成壓力測試已非完成 gate，此事項擱置，待真實產品接入再提。
- 無其他阻塞。

## 工作區現況（未追蹤，勿誤刪）

- `palladio/docs/stress-tests/content-creation/`：Chapter Spine 原型與審查紀錄，依 #14 結論刻意保留在未追蹤工作區。
- 本機未提交變更：`AGENTS.md`（worktree 路徑修正）、`DESIGN_REVIEW.md`、`review-artifacts/`、`paseo.json`。

## 權威連結

- [Open Issues（#45、#46、#49、#53、#54）](https://github.com/bext1998/palladio-design-language-system/issues)
- [官網（GitHub Pages）](https://bext1998.github.io/palladio-design-language-system/)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物）
- [可及性契約](palladio/docs/accessibility/accessibility-contract.md)（第九節：accent 插槽對比驗證流程）
- [規格第十一章驗證策略](docs/spec.md)（commit `420c579`）
