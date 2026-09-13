# Layer 2：元件級 Token Override（可選架構）

- 狀態：Hypothesis
- 舊規格出處：`docs/spec.md` 舊 §9.1「Layer 2 — Component（可選）」段落（Layer 0 Primitive、Layer 1 Semantic 的紀律是 Promoted contract，保留在 `docs/spec.md`；本檔只處理尚未實作的 Layer 2）
- 假設：Token 架構預留第三層「Layer 2 — Component」，讓各產品可選擇性地做元件級 override（例：`pd-button-bg-default`、`pd-card-border-color`），作為 Layer 1 Semantic 之上的可選能力。
- 輸入：原規格 9.1 的架構圖示與描述；規格第一章 P5「開放的強調色插槽」提到系統「不強迫所有產品長一樣」，Layer 2 曾被設想為實現這個承諾的機制之一。
- 狀態矩陣：不適用——沒有任何消費端實際使用過這一層。
- 壓力測試／情境：無。
- 證據：`palladio/tokens/component/` 目錄不存在，沒有任何 Layer 2 token 被定義或消費（`SPEC_ADVERSARIAL_REVIEW-2026-09-13.md` 主張 C 的查核結果）。這代表「Accent 六插槽開放＋不強迫所有產品長一樣是可實現的架構承諾」這個主張目前**無法判定**（既未被證實也未被證偽），因為承諾的機制從未被實踐。
- 使用者裁決：尚未裁決。
- 結論：維持 Hypothesis。不承諾此能力已存在或可用，直到有消費端需求、原型、相容性模型與驗證都到位；不應在 `docs/spec.md` 裡繼續把它寫成「已定義的架構」。
