# Palladio Design Language & System — 有效決策索引

> 只列仍有效、難以逆轉且使用者明確要求同步的決策；細節位於唯一權威 ADR、Issue 或 PR。取代或失效時更新或移除，不追加歷史。

---

## 有效決策

| 摘要 | 狀態 | 唯一權威來源 |
|---|---|---|
| 設計語言以深碳灰層級、線條分組與流體有機動效為核心；產品保有強調色自主權。 | 有效 | docs/spec.md 第 1–8 章 |
| Token 採三層架構，使用 Style Dictionary 產出 CSS、TypeScript、JSON 與 agent reference。 | 有效 | docs/spec.md 第 9 章 |
| 三種 density 以共享的 `pd.density.*` token 路徑提供切換契約，消費端不需因 density 改變元件結構。 | 有效 | docs/spec.md 第 6.2 節、PR #18 |
| Default `min-interactive-size` 保留 36px inline dimension；space scale 沒有對應 primitive，因此不新增 `space.9`。 | 有效 | PR #18 |
| 本專案以 MIT License 公開發布。 | 有效 | LICENSE |
