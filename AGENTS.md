# Palladio Design Language & System — Coding Agent 指令

> 本文件供 Codex、Claude Code 等 coding agent 在每個 session 開始時閱讀。

---

## 專案概述

Palladio Design Language & System 是可跨消費端使用的開源設計語言與 design-token pipeline。

技術棧：JSON + JavaScript + TypeScript + CSS + Style Dictionary

---

## 工作原則

1. 讀取 `MAZE_PROJECT.md` 後，再讀取指定規格章節與相關 Issue。
2. `docs/spec.md` 只收已升格、可實作的現行契約，是這些契約的 source of truth；不得用 pipeline 便利性改寫其行為。安全與可及性等不可突破的底線見 `docs/guardrails.md`；尚待視覺／產品裁決的候選規則見 `docs/experiments/`——後者不得被當成已定案的規格引用，見 Issue #85、`SPEC_MIGRATION_PLAN.md`。
3. GitHub Issue／PR 與 Git 是工作狀態權威；只有明確 closeout 才重建 `NEXT_ACTION.md`。
4. 修改前確認對應 token、輸出產物、可及性規則與消費端契約。
5. Git Worktrees 請集中放置於 `D:\AgentCoding\.codex\worktrees\PalladioDesignLanguageSystem`；建立 Git Worktree 時的分支名稱一律採用 `maze/YYYY-MM-DD-short-hash`，其中 `short-hash` 為隨機值，字尾不得再加任何字樣。
6. 美學／視覺審查（含外部 agent，例如 `maze-design-review`）在提出改動建議前，須先確認對應元件 `README.md` 是否已記錄該設計決策的理由（Palladio 的元件 README 慣例會寫明「為什麼」，不只是「是什麼」）。若已有記錄仍建議推翻，需明確引用該記錄並說明為何值得重新考慮，不得把已記錄的刻意取捨當成未知的新發現提出。
7. 任何改動 token 值、或新增機制（例如 fallback、驗證函式）的 PR，必須在同一個 PR 內同步更新 `docs/spec.md` 或 `docs/guardrails.md` 對應章節，不得只改程式碼與元件 README 後留給「之後再補」——事後補寫已證明不會發生（見 Issue #74 的 focus-ring 分離未回寫 spec 的先例）。一條規則只能有一個權威位置，其他文件只能連結過去，不得重複全文（見 `docs/guardrails.md`「證據誠實與治理底線」）。
8. 收到新功能、設計、架構或研究任務後，先判斷主要不確定性屬於哪一類，再決定要不要先做點什麼；已知問題不加研究步驟。若現有 Issue／spec 章節／PR 討論已足以處理該判斷，不重複建立新機制。

   | 類型 | 情境 | 先做什麼 |
   |---|---|---|
   | 規格不確定 | 知道要做什麼，但行為／邊界／驗收方式不清楚 | 用 `maze-spec-review`／`maze-spec-hardening` 補強 `docs/spec.md` 或相關 Issue；不自行補完產品決策 |
   | 技術不確定 | 不確定某工具／演算法／架構是否可行 | 在暫存分支或 scratch code 做最小 PoC，只回答關鍵問題；確認可行後依現有流程實作，PoC 不必保留 |
   | 設計不確定 | UI／UX／視覺風格等無法只靠自動測試判定 | 用 `maze-design-review`／`maze-design-system` 產生少量候選方案比較（先過第 6 點）；候選方案須經使用者裁決才寫入規格並實作 |
   | 問題尚未理解 | 連問題、限制或成功條件都不清楚 | 用 `maze-wayfinder`／`maze-context-audit`／`maze-root-cause-diagnosis` 先釐清；此階段不得開始正式功能實作 |

   進入正式實作前須符合其一：問題屬於已知問題／規格已足以支援實作／關鍵技術假設已由 PoC 驗證／設計方向已由使用者確認／尚未確認的部分不影響本次實作方向。仍有會改變整體方向的未知時，先處理該未知，不進入正式實作。

   規格沒定義的互動行為或元件外觀、架構的多種合理方案、需求衝突、無法測量的成功條件——遇到這些必須在 Issue／PR／commit message 中明講「未定義」或「需要驗證」，不得自行拍板；可以提出候選方案，但候選方案不是正式決策，品牌／視覺方向、產品定位、高影響架構選擇最終由使用者確認。

   規格可以被修正：實驗、原型或實作證明既有規格有錯誤、缺漏或錯誤假設時，記錄發現、修正 `docs/spec.md`，再依修正後規格實作，不強迫專案服從錯誤規格。

---

## 錯誤處理原則

當使用者指出錯誤時，不得道歉、感謝、讚揚指正或討論個人感受。依序評估指正是否正確；若正確，僅在有助於推進任務時以一句話說明錯誤之處；立即修正結果；在可行時進行驗證；回報修正結果與驗證狀態。

除非使用者明確要求，否則不得使用「對不起」、「抱歉」、「你是對的」、「我的錯」或「謝謝指正」等客套用語。優先確保任務還原度、正確性、Token 使用效率與任務進度，不以維持社交禮儀取代工作。

---

## 下一步

閱讀 `NEXT_ACTION.md` 了解這個 session 的目標。

---

## 重要文件

| 文件 | 用途 |
|---|---|
| `docs/spec.md` | 已升格、可實作的現行契約（token、API、pipeline） |
| `docs/guardrails.md` | 安全、可及性與治理底線，實驗與規格都不得突破 |
| `docs/experiments/` | 尚待視覺／產品裁決的候選規則，非 source of truth |
| `docs/archive/spec-v0.1.md` | 已取代或純背景脈絡的舊規格內容，供歷史稽核 |
| `SPEC_MIGRATION_PLAN.md` | 上述四份文件的分類依據與升格條件 |
| `MAZE_PROJECT.md` | 規格與 GitHub 工作流的實際定位 |
| `NEXT_ACTION.md` | 下一步行動 |
| `DECISIONS.md` | 有效重大決策索引 |

---

## 禁止行為

- 不得修改 `docs/spec.md`、`docs/guardrails.md` 的功能範圍，除非使用者明確要求。
- 不得把 `docs/experiments/` 內尚未經使用者裁決（`Validated in consumer`）的候選規則當成已定案的規格引用或實作依據。
- 不得為 accent 插槽加入 fallback、推導色值或跨消費端混色公式。
- 不得將 Primitive token 直接用於 UI 元件。
