# Specification Review

> Source spec: `D:\AgentCoding\PalladioDesignLanguage&System\docs\spec.md`
> Previous revision: `SHA-256 CBEFF93A72D252E889069CC2928C2E8387E05623E70F21E1487E3163422F5D5F`
> Revision: `SHA-256 82A73CC5200A1FA85F4F5A0FC174C3AAC827094EB69D69BEB350761EED2261D9`
> Mode: `verify`
> Conclusion: `可開始但有備註`

## Summary

- Blocker: `0 open / 0 reviewed`
- Major: `0 open / 4 resolved`
- Minor: `1 prior finding / not rechecked`
- Suggestion: `0 prior findings / not rechecked`

前次四個 Major 均已修正，沒有仍會造成主要返工的已知問題。依複審規則，本次未重查前次 Minor `SR-005`，因此保守保留備註。

## Findings

### SR-001 — `Major` / 可及性契約自相矛盾

- Status: `resolved`
- Spec location: `2.3（lines 78–79）、8（lines 249–250）`
- Problem: 前次 `pd-color-text-tertiary` 同時承擔 placeholder 與 disabled，且大字門檻誤用 px。
- Evidence: **Fact** — 現行規格已拆成 `pd-color-text-placeholder` 與 `pd-color-text-disabled`，A-M1 明列兩者須達 `4.5:1`；A-M2 已改為 `≥24px regular / ≥18.5px bold`。
- Impact: 前次 token 用途衝突與錯誤門檻已不存在。
- Suggested revision: `none`
- Must resolve before implementation: `no`

### SR-002 — `Major` / Density 與 4px spacing 規則衝突

- Status: `resolved`
- Spec location: `6.1（line 204）、6.2（lines 224–225）`
- Problem: 前次 Default density 使用 `6px` 基準及非 4 倍數 padding，與全域 4px 規則衝突。
- Evidence: **Fact** — 三個 density 的 base spacing unit 均為 `4px`；component padding 現在全部是 4 的倍數。
- Impact: spacing scale 與 density preset 現在只有一種解讀。
- Suggested revision: `none`
- Must resolve before implementation: `no`

### SR-003 — `Major` / Accent 狀態無法按規格確定產出

- Status: `resolved`
- Spec location: `P5（line 39）、2.5（lines 98–106）、12（line 382）`
- Problem: 前次缺少 disabled token，且 hover／active fallback 的算法與驗證配對不確定。
- Evidence: **Fact** — 現行規格新增 `pd-color-accent-disabled`，要求產品提供全部 accent 插槽，明確取消 fallback 與跨消費端混色，並要求列出實際前景／背景配對後依 A-M1／A-M2 驗證。
- Impact: Button 與其他 accent 消費端可取得唯一狀態來源及可觀察的對比契約。
- Suggested revision: `none`
- Must resolve before implementation: `no`

### SR-004 — `Major` / 核心完成條件不可重現

- Status: `resolved`
- Spec location: `9.4（line 306）、11（line 373）、13（line 400）`
- Problem: 前次把 AI one-shot 表現當成完成 gate，且「不需繞過 Palladio」沒有客觀分類規則。
- Evidence: **Fact** — 現行規格已把單次 AI 生成降為質性訊號；硬性條件改為逐項歸類成既有 Semantic token、允許的產品插槽或確認的系統缺漏，且不得有未分類項目。
- Impact: 完成判定現在可依固定分類結果重現，不再取決於單次模型輸出。
- Suggested revision: `none`
- Must resolve before implementation: `no`

### SR-005 — `Minor` / Reduced Motion 對 opacity 的要求互斥

- Status: `open`
- Verification note: 本次 verify 依規則未重查 Minor；沿用前次狀態，不代表現行 revision 仍有同一問題。
- Spec location: `5.4（lines 192–194）、A-M4（line 250）`
- Problem: 一方面要求所有 duration 變成 `0ms`，另一方面要求保留必要的 opacity「轉換」。若 duration 是 `0ms`，實際上只剩狀態切換，沒有 transition。
- Evidence: **Fact** — 同一段落對 reduced-motion 的可觀察行為有兩種解讀。
- Impact: 不同元件可能保留短 opacity 動畫，也可能全部瞬時切換；不影響架構，但會讓驗收不一致。
- Suggested revision: 明寫必要 opacity 是「瞬時切換」，或為它定義唯一的 reduced-motion duration；選一種即可。
- Must resolve before implementation: `no`

## Undecided Items

- 本次 Blocker／Major 複審範圍內無未決策事項。

## Suggested Acceptance Criteria

- 實作產物維持現行規格已明確化的文字對比、4px density、顯式 accent 插槽與壓力測試分類契約。

## Suggested Revision Order

1. `none` — 前次 Blocker／Major 已全部 resolved。

## Unverified Limitations

- 工作區仍只有來源規格與審查報告，沒有實作、測試、設計稿或 pipeline 產物可核對；本次只驗證規格文字是否解決既有 Major。
- 工作目錄不是 Git repository，無法綁定 commit revision；本報告改以來源檔 SHA-256 識別版本。
- 來源 revision 已改變，但修訂集中在既有 findings 對應範圍，核心範圍未大幅變更，因此符合 verify 前提。
- 依 verify 規則未重查 Minor／Suggestion，也未探索新 finding。

## Source Identification

- Path: `D:\AgentCoding\PalladioDesignLanguage&System\docs\spec.md`
- Previous revision: `SHA-256 CBEFF93A72D252E889069CC2928C2E8387E05623E70F21E1487E3163422F5D5F`
- Revision: `SHA-256 82A73CC5200A1FA85F4F5A0FC174C3AAC827094EB69D69BEB350761EED2261D9`
