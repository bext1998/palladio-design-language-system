# Palladio Design Language & System — 有效決策索引

> 只列仍有效、難以逆轉且使用者明確要求同步的決策；細節位於唯一權威 ADR、Issue 或 PR。取代或失效時更新或移除，不追加歷史。

---

## 有效決策

| 摘要 | 狀態 | 唯一權威來源 |
|---|---|---|
| 深碳灰表面層級與六個強調色插槽（產品自主權）的 token 契約已升格；「克制的圓潤」「線條優先分組」「流體有機動效」等視覺個性描述仍是待驗證的候選方向，尚未經使用者裁決。 | 部分有效（見拆分） | token 契約：docs/spec.md §2；候選方向：docs/experiments/design-language-personality.md、grouping-priority.md、motion-personality.md |
| Token 採三層架構（Layer 0 Primitive、Layer 1 Semantic 已落地；Layer 2 Component override 尚未被任何消費端實作），使用 Style Dictionary 產出 CSS、TypeScript、JSON 與 agent reference。 | 有效（Layer 2 除外） | docs/spec.md 第七章；Layer 2 見 docs/experiments/architecture-component-layer.md |
| 三種 density 以共享的 `pd.density.*` token 路徑提供切換契約，消費端不需因 density 改變元件結構。 | 有效 | docs/spec.md 第 6.2 節、PR #18 |
| Default `min-interactive-size` 保留 36px inline dimension；space scale 沒有對應 primitive，因此不新增 `space.9`。 | 有效 | PR #18 |
| 本專案以 MIT License 公開發布。 | 有效 | LICENSE |
「生產環境接入為主要驗證策略」已正式取代為：概念原型 → 實驗／壓力測試 → 消費端驗證 → 使用者裁決 → 規格升格；消費端接入回饋仍是升格證據之一，但不再是唯一或優先策略。 | 已取代（新機制生效中） | docs/experiments/README.md、docs/archive/spec-v0.1.md（原文）、SPEC_MIGRATION_PLAN.md（SR-102）、Issue #88 |
| Token 產物以單一 npm 套件 `@pdiodsgn/tokens` 發佈（`dist/` only，CDN 走 jsDelivr/unpkg，GitHub Release 掛同 tag 為鏡像）；消費端 pin 精確版本，不 clone repo。SemVer 全格式同步，token 值變更視為 minor。 | 有效 | palladio/package.json、palladio/README.md、.github/workflows/release.yml |
| 元件契約採建置期 HTML 驗證器：合法 `pd-*` class 從元件 CSS 擷取，原生元素與必要 ARIA 關係以小型機器規則定義；消費端在 focused HTML fragment／CI 指定元件驗證。未另發佈手工維護的 class JSON 清單，也不只靠 README。 | 有效 | palladio/pipeline/component-contract.mjs、palladio/README.md、Issue #72 |
| Typography CSS 對每個 `pd-text-{role}` 產出五個獨立屬性（family、size、weight、line-height、letter-spacing），元件完整引用 role；density 只切換根元素 body 字級，text role 不縮放。Card 內容維持消費端排版，Divider 不套用文字 role。 | 有效 | palladio/pipeline/config.js、palladio/components/*、Issue #73 |
| Focus ring 優先使用通過實際 backdrop A-M2 驗證的產品 accent；只有 `enableValidatedAccentFocusRing()` 可啟用，未驗證或驗證失敗時 CSS 回退 `border-strong`。`border-strong`／`input-border` 固定為 `#777777`，Card hover／active 等剩餘用途最低仍達 3.03:1。 | 有效 | Issue #74、palladio/docs/accessibility/accessibility-contract.md 第三、四、九節 |
| `text-disabled` 改為 `#7A7A7A`，只限 inactive UI component，依 WCAG SC 1.4.3 豁免不納入 A-M1 gate；`text-placeholder` 維持 `#9A9A9A`，繼續受 A-M1 gate 約束。 | 有效 | Issue #74、palladio/docs/accessibility/accessibility-contract.md 第二節 |
「設計不確定」（UI／視覺風格無法只靠自動測試判定）不再要求先取得 `docs/spec.md` 範圍變更核准才能動手；改為先用原型／候選方案供使用者裁決，裁決後才寫回 spec。`docs/spec.md`／`docs/guardrails.md`／`docs/experiments/`／`docs/archive/` 的四層分工已依此執行。 | 有效 | AGENTS.md 規則 2、8、Redesign/IMAGE_TO_DESIGN_TOKEN_WORKFLOW.md、SPEC_MIGRATION_PLAN.md、Issue #85 |
