# Palladio Guardrails

> 本文件收錄實驗、原型與規格升格流程中**不得被突破**的底線。護欄不是「目前這樣做比較好看」的偏好，是安全、可及性、證據誠實與治理層級的硬約束——來源見 `SPEC_MIGRATION_PLAN.md` 的分類表（Guardrail 類）。
>
> 跟 `docs/spec.md`、`docs/experiments/` 的分工：`docs/spec.md` 放已升格、可實作的現行契約；`docs/experiments/` 放尚待驗證的候選規則；本文件放兩者都不能違反的底線。可及性規則的完整驗收程序唯一權威來源是 `palladio/docs/accessibility/accessibility-contract.md`，本文件只列規則本身、不重複驗收細節。

## 可及性硬規則（`[MUST]`）

| 規則 | 標準 |
|------|------|
| A-M1 | 一般文字（含 placeholder；inactive UI 的 disabled 文字依 WCAG 豁免）contrast ratio ≥ 4.5:1 |
| A-M2 | 大字（≥24px regular / ≥18.5px bold）及 UI 元件 contrast ratio ≥ 3:1 |
| A-M3 | 所有互動元件必須有可見的 focus indicator（不得僅依賴 `outline: none` 後無替代方案） |
| A-M4 | `prefers-reduced-motion` 觸發時，所有非必要動畫停用 |
| A-M5 | 色彩不可作為唯一的資訊傳達手段 |
| A-M6 | 互動元素最小尺寸依 density preset 對應值 |

完整驗證方式、目前 Foundation token 的實際驗證結果：`palladio/docs/accessibility/accessibility-contract.md`（該文件是這六條規則唯一可查閱的驗收說明來源）。

## Reduced Motion（`[MUST]`，原規格 §5.4）

當使用者啟用 `prefers-reduced-motion: reduce`：

- 所有 duration 替換為 `pd-duration-instant`（`0ms`）
- 所有 transform 類動畫移除
- 必要的 opacity 狀態可保留，但必須瞬時切換，不保留 transition

## 元件升格的機器可驗底線（原規格 §10.2）

任何元件從候選原型升格為正式元件前，以下必須成立：

- [ ] 在 Compact / Default / Spacious 三種密度下正常呈現，結構不變
- [ ] Hover、active、focus、disabled 四種互動狀態完整定義
- [ ] Keyboard navigation 行為符合規範
- [ ] Focus indicator 可見且符合 A-M2 對比標準
- [ ] `prefers-reduced-motion` 下動畫正確降級
- [ ] Token 引用只使用 Semantic 層（不直接使用 Primitive 值）
- [ ] 不得以 `font: inherit` 迴避 text role；有文字的元件必須完整引用對應 role 的字體屬性，純容器與非文字元素須記錄不套用 role 的理由
- [ ] 圓角、動效曲線、分組手段的選擇，逐條對照 `docs/spec.md`（已升格契約）或 `docs/experiments/`（候選假設，需明確標明狀態）說明理由；不得只因為「省事」或「其他元件也這樣」而套用，無對應依據可引用時視為未完成

這些項目是機器／人工可逐條核對的下限，**不能取代**下一條的人眼裁決。

## 人眼裁決 gate（`[MUST]`，原規格 §10.2 最後一項）

沒有任何元件、視覺規則可以只憑 agent 審查或自動化檢查通過就宣稱「符合設計語言」。升格為正式契約前，必須：

- 在標準 demo 頁渲染三種 density 的實際截圖或可互動原型；
- 由**使用者本人**裁決是否符合設計方向，裁決結果記錄在對應的 `docs/experiments/*.md` 或 Issue 中；
- agent 之間互相審查（例如「另一個 agent 覺得好看」）不能替代使用者裁決——這是 Issue #85 指出的根因問題，重複發生一次就是規則失效一次。

## 證據誠實與治理底線

- 「有實作」「有測試通過」不等於「已被驗證符合設計語言」。這兩種證據類型不能互相替代或混淆（見 `SPEC_MIGRATION_PLAN.md` SR-103）。
- 一條規則只能有一個權威位置；其他文件（`DECISIONS.md`、元件 README、`docs/spec.md`）只能連結過去，不得重複全文——重複會導致三處各自漂移、失去單一事實來源。
- 任何改動 token 值、或新增像 `pd-color-focus-ring` fallback 這類機制的 PR，必須在同一個 PR 內同步更新對應的權威文件（`docs/spec.md` 或本文件），不得只改程式碼與元件 README 後留給「之後再補」——事後補寫已證明不會發生（見 Issue #74 的 focus-ring 分離未回寫 spec 的先例）。
- Git／GitHub Issue／PR 是工作狀態的權威記錄；文件對現況的描述如果跟 git 證據對不上，以 git 為準並更正文件（見 Issue #88）。

## 已確認的安全／可及性缺陷例外

`docs/spec.md` 的「已升格契約」原則上在重新驗證期間維持現值不變，但**已確認的安全、可及性或資料正確性缺陷是例外**：發現這類缺陷時立即修正、發版、更新契約與 migration note，不必等待下一輪實驗或使用者裁決週期。
