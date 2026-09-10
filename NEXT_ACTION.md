# Palladio Design Language & System — 下一步行動

> 僅保留當前有效前線；明確 closeout 時整體重建，不追加歷史。

## 下一個 Session 目標

壓力測試階段已退場：規格第十一章改為「驗證策略」，以生產環境接入取代合成壓力測試（commit `420c579`）；#4、#8、#14、#15 皆以 COMPLETED 關閉，對應 PR #32、#33 撤回未合併。Foundation、可及性修正與第一批元件全數關閉，`@pdiodsgn/tokens` v0.1.1 已發佈，官網已遷入 `site/` 並由 PR #48 部署至 GitHub Pages。

目前前線轉向文件與官網，開啟中的 Issue 為 #45（文件站規劃）、#46（官網指向 AI 技能包與 agent-reference）與 #49（Select／Dropdown 缺口，見行動 3）。

## 行動（最多 3 項）

1. [#46](https://github.com/bext1998/palladio-design-language-system/issues/46) 官網加入指向 `skills/palladio-design-tokens/` 與版本鎖定 `agent-reference.md` 的內容與連結；原文相依的「官網原始碼要先決定落點」已由 PR #47、PR #48 解除（`site/` 已在 repo、Pages 已上線），可直接施工。
2. [#45](https://github.com/bext1998/palladio-design-language-system/issues/45) 文件站規劃（IA、產生來源、技術選型、部署）；施工前先修正 Issue 前提，見下方阻塞項。
3. [#49](https://github.com/bext1998/palladio-design-language-system/issues/49) Select／Dropdown 元件與 token 缺口：本次調查確認系統既無此元件、也無 `select`／`dropdown` token，且未定義浮層疊序（z-index）語意——依 §1.2 P2，陰影式 elevation 是刻意不採用而非缺漏。工單已附依第一至八章的風格要求（不得 box-shadow、面板 `surface-raised` + `radius-md`、reduced motion 移除 transform 等）。需先完成 `docs/spec.md` 第十章程式範圍變更才能實作。

## 阻塞與待決策

- **#45 前提過期（文件層，非阻塞）**：Issue 描述「行銷官網（concept B，`Palladio-static-site/`，目前在桌面、尚未進 repo）」與現況不符——`site/` 已於 PR #47 遷入並經 PR #48 部署；文件站規劃本體（IA、生成來源、技術選型、部署）仍有效。
- **待決策：Select／Dropdown 的浮層疊序（#49）**：需使用者明確要求才能修改 `docs/spec.md` 功能範圍；目前僅記錄、不實作。面板本體現有 token 已足夠——§2.1 已把 dropdown 歸入 `pd-color-surface-raised`、§4.1 歸入 `pd-radius-md`；依 §1.2 P2（線條優先、elevation 保守）不引入陰影 token，待決策者僅為 z-index／疊序語意是否 token 化。
- **待決策：缺漏 C-1（擱置）**——「版面容器欄寬／欄數／格比／對齊策略無 token 規範」原記錄於 `palladio/docs/stress-tests/landing-page/decisions.md`，該檔隨 PR #32 撤回而不在 `main`（僅存於撤回分支 `origin/maze/2026-09-06-e69e`）。合成壓力測試已非完成 gate，此事項擱置，待真實產品接入再提。
- 無其他阻塞。

## 工作區現況（未追蹤，勿誤刪）

- `palladio/docs/stress-tests/content-creation/`：Chapter Spine 原型與審查紀錄，依 #14 結論刻意保留在未追蹤工作區。
- 本機未提交變更：`AGENTS.md`（worktree 路徑修正）、`DESIGN_REVIEW.md`、`review-artifacts/`、`paseo.json`。

## 權威連結

- [Open Issues（#45、#46、#49）](https://github.com/bext1998/palladio-design-language-system/issues)
- [官網（GitHub Pages）](https://bext1998.github.io/palladio-design-language-system/)
- [Agent Reference](palladio/dist/agent-reference.md)（#10 交付物）
- [可及性契約](palladio/docs/accessibility/accessibility-contract.md)（第九節：accent 插槽對比驗證流程）
- [規格第十一章驗證策略](docs/spec.md)（commit `420c579`）
