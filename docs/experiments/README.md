# Experiments — 實驗生命週期

> 本目錄放尚待驗證的候選規則（視覺、產品、架構或工作流方向）。這裡的內容**不是** source of truth，不能被當成已定案的規格引用。升格為正式契約後移入 `docs/spec.md`（或違反底線時移入 `docs/guardrails.md` 的討論記錄），原檔案保留並標註升格結果，不刪除。

## 狀態

| 狀態 | 意義 |
|---|---|
| `Hypothesis` | 候選規則已寫下，尚無原型、渲染或測試證據 |
| `Experimented` | 已有原型／渲染／壓力測試證據，尚未經使用者裁決 |
| `Validated in consumer` | 使用者已裁決接受，且至少一個真實消費端／情境驗證通過 |
| `Rejected` | 使用者裁決不採用，或被後續證據反證 |

只有 `Validated in consumer`（或視規則類型，`docs/guardrails.md` 定義的最低證據已齊備）的規則可以移入 `docs/spec.md`。`Experimented` 不等於通過——agent 之間互相審查不能替代使用者本人的裁決（見 `docs/guardrails.md`「人眼裁決 gate」）。

## 每個實驗記錄的必要欄位

```markdown
# <實驗標題>

- 狀態：Hypothesis ｜ Experimented ｜ Validated in consumer ｜ Rejected
- 舊規格出處：docs/spec.md 舊 §x.x（若適用）
- 假設：這條規則想驗證什麼？
- 輸入：原始素材（截圖、概念圖、既有 token、消費端需求）
- 狀態矩陣：涵蓋哪些 state × density × theme 的組合
- 壓力測試／情境：在哪些真實或模擬的使用情境下測試過
- 證據：渲染截圖、測試檔案路徑、消費端接入紀錄
- 使用者裁決：裁決結果與日期（未裁決則留空，不得代填）
- 結論：升格、拒絕，或需要更多證據
```

## 目前的實驗記錄

- `design-language-personality.md` — 核心個性、P1–P4 視覺原則（原規格第一章）
- `color-desaturation-rationale.md` — 語意色去飽和的美學理由（原規格 2.4 拆分出的非閾值部分）
- `typography-font-family.md` — 字體選擇理由（原規格 3.1）
- `shape-context-principles.md` — 圓角使用原則（原規格 4.2）
- `motion-personality.md` — 動效個性與 easing 使用限制（原規格 5.1、5.3 部分）
- `grouping-priority.md` — 分組手段優先順序（原規格第七章）
- `architecture-component-layer.md` — Layer 2 元件級 token override（原規格 9.1 選用部分）

分類與升格條件見 repo 根目錄 `SPEC_MIGRATION_PLAN.md`。
