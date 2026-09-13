# Redesign 搬移 manifest（B2 executed）

狀態：EXECUTED。核准的兩項已搬移並完成引用處理；否決項目保留原位。此檔保留每項原路徑作為搬移稽核記錄。

判準：納入未規格化／未測試元件、直接相關研究或可重現原型資料。正式 spec、token source、已規格化元件、已通過 Button Baseline 證據、生成輸出與文件站資料排除。

版控狀態註記：下表與「明確排除」列出的所有路徑，在本 PR（617b6db）之前**都不在 `main` 的 git 歷史裡**——它們原本只是工作目錄中的未追蹤檔案，本 PR 是它們第一次被 `git add`。「Moved」「Excluded」「Kept in place」描述的是本次檔案系統重組決策（要不要搬進 `Redesign/`），不代表這些檔案本身有既有版控紀錄；任何「已通過」「既有證據」等字樣僅反映本地工作區的先前狀態，不能當作已被 git 追蹤或既有 PR 審查過的證明。

## 搬移明細

| Status | Source | Destination | Evidence | Confidence | Reference handling |
|---|---|---|---|---|---|
| Moved | `palladio/docs/stress-tests/content-creation/concept-chapter-spine.png` | `Redesign/prototypes/content-creation/concept-chapter-spine.png` | 內容創作壓力測試視覺來源；prototype QA 明確引用。 | High | Updated moved QA source reference to `../concept-chapter-spine.png`. |
| Moved | `palladio/docs/stress-tests/content-creation/concept-margin-dialogue.png` | `Redesign/prototypes/content-creation/concept-margin-dialogue.png` | 同一內容創作原型視覺研究素材。 | High | No direct reference required. |
| Moved | `palladio/docs/stress-tests/content-creation/concept-quiet-desk.png` | `Redesign/prototypes/content-creation/concept-quiet-desk.png` | 同一內容創作原型視覺研究素材。 | High | No direct reference required. |
| Moved | `palladio/docs/stress-tests/content-creation/prototype/**` | `Redesign/prototypes/content-creation/prototype/**`（保留完整結構，含 `node_modules`／`dist`） | 未規格化、可重現的內容創作原型與測試；`NEXT_ACTION.md` 原列為未追蹤原型。 | High | Updated QA source path and moved relative imports for Palladio CSS、tokens、pipeline; `NEXT_ACTION.md` intentionally unchanged per instruction and remains an expected historical old-path reference. |
| Excluded | `review-artifacts/component-audit/**` | — | 六個既有元件的視覺審查證據。 | High | Kept in place; no links changed. |
| Excluded | `review-artifacts/pr28/**` | — | Divider PR #28 審查證據。 | High | Kept in place; no links changed. |
| Excluded | `review-artifacts/focus-accent.png`, `focus-fallback.png`, `focus-ring-check-1280.png`, `focus-ring-check.html`, `issue-74-report.json` | — | Focus／accent／fallback 研究證據。 | Medium | Kept in place; no links changed. |
| Excluded | `review-artifacts/test-page-actual.png`, `test-page-corrected-field.png`, `typography-check-1280.png`, `typography-check-375.png`, `typography-metrics.json` | — | Field／typography 研究證據。 | Medium | Kept in place; no links changed. |
| Excluded | `DESIGN_REVIEW-2026-09-11.md`, `DESIGN_REVIEW.md` | — | 既有元件／Divider 審查文件。 | High | Kept in place; evidence paths remain valid. |
| Moved | `docs/research/design-system-component-maturity.md` | `Redesign/research/design-system-component-maturity.md` | 元件規模與成熟度直接研究。 | Medium | Updated moved document self-reference to its new path. |

## 明確排除

- `review-artifacts/button-baseline-v0.1/**`：Button Baseline 與可執行驗證已通過（本地工作區狀態，本 PR 前未進版控）；不得納入本次 Redesign 工作集。
- `palladio/components/{badge,button,card,divider,input,navigation}/**`：正式元件，已有 README、CSS 與測試。
- `palladio/tokens/**`、`palladio/dist/**`、`palladio/pipeline/**`、`palladio/themes/**`：正式 token source、已發布輸出與 pipeline。
- `Redesign/prototypes/content-creation/prototype/dist/**`、`node_modules/**`：生成輸出與安裝依賴；本次核准的整體搬移保留它們，但後續研究整理不得將其視為 source。
- `docs/spec.md`、`AGENTS.md`、`MAZE_PROJECT.md`、`NEXT_ACTION.md`、`DECISIONS.md`、`palladio/docs/accessibility/**`：正式規格、治理、工作狀態與 accessibility 契約。
- `site/**` 與文件站 PR 產物：已發布／文件站範圍。
- 其他未追蹤 agent／使用者工作檔（例如 `paseo.json`、規格審查草稿）：目前沒有足夠證據屬於本次元件重構。

## 驗證紀錄

1. `Resolve-Path` 驗證 repo、兩個 source 與兩個 destination 均位於 `D:\AgentCoding\PalladioDesignLanguageSystem`；destination 原先不存在。
2. 以 PowerShell `Move-Item -LiteralPath` 完成兩項搬移，未刪除檔案；`node_modules`／`dist` 隨核准的整體原型搬移保留。
3. 搬移後 source 路徑不存在，destination 路徑存在；完整 prototype 結構與研究檔案仍可讀取。
4. 直接引用已更新：`Redesign/prototypes/content-creation/prototype/design-qa.md` 改為 `../concept-chapter-spine.png`；prototype 的 CSS／token／pipeline 相對 import 已指向 repo 內 `palladio/`；研究文件 self-reference 改為 `Redesign/research/design-system-component-maturity.md`。
5. `NEXT_ACTION.md` 的舊 `palladio/docs/stress-tests/content-creation/` 引用依指示保留，列為已知未處理治理文件引用；未修改 `docs/spec.md`、正式 token/source component。
6. 否決項目仍在原位；`review-artifacts/button-baseline-v0.1/**` 未搬移。
