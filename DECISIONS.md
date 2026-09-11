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
| 驗證策略以生產環境接入為主（非合成壓力測試）；發現不足直接更新 Palladio 並同步消費端。 | 有效 | docs/spec.md 第 11 章、commit 420c579 |
| Token 產物以單一 npm 套件 `@pdiodsgn/tokens` 發佈（`dist/` only，CDN 走 jsDelivr/unpkg，GitHub Release 掛同 tag 為鏡像）；消費端 pin 精確版本，不 clone repo。SemVer 全格式同步，token 值變更視為 minor。 | 有效 | palladio/package.json、palladio/README.md、.github/workflows/release.yml |
| 文件站採 Node 靜態產生腳本加 vanilla JavaScript，直接輸出 `site/docs/`；建置期從 token 產物與既有權威文件收集內容，不維護同步複本。 | 有效 | docs/documentation-site-plan.md |
| 文件站以 Palladio token 與既有元件作為自身介面（dogfooding）；三欄骨架不帶入 Watt 的 CSS 或手寫內容模式。 | 有效 | docs/documentation-site-plan.md |
| 文件站外殼暫時允許 breakpoint、grid 欄位與收合規則使用原生 CSS；#61 定義 layout token 後重新檢視並遷移。 | 有效 | docs/documentation-site-plan.md、Issue #61 |
| 文件站的六個 accent 插槽沿用官網品牌色 `#D9814F`（`site/assets/css/styles.css` 的 `--brand`），已通過 `validateAccentPairs()` A-M1 驗證，不另外發明色相。 | 有效 | docs/documentation-site-plan.md、site/assets/css/styles.css |
