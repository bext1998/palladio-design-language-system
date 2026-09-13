# 語意色去飽和的美學理由

- 狀態：Hypothesis
- 舊規格出處：`docs/spec.md` 舊 §2.4（美學理由部分；對比度閾值 ≥4.5:1 本身屬於 A-M1，留在 `docs/guardrails.md`／`docs/spec.md` 不受本檔影響）
- 假設：語意色彩（success／warning／danger／info）刻意去飽和（desaturated），理由是避免在深碳灰背景上過於刺眼。四色參考色相：success 綠色系、warning 琥珀色系、danger 紅色系、info 藍色系，皆為 desaturated 版本。
- 輸入：原規格 2.4 表格與註記。
- 狀態矩陣：尚無不同飽和度版本的並列渲染比較。
- 壓力測試／情境：尚未在實際消費端或壓力測試情境中比較「去飽和」與「標準飽和度」何者更符合設計語言。
- 證據：token 本身與 A-M1 對比驗證存在（`palladio/pipeline/validate-accessibility.mjs`），但這只證明「這四個色值通過對比門檻」，不證明「去飽和是正確的美學選擇」——兩者是不同種類的證據（見 `SPEC_MIGRATION_PLAN.md` SR-103）。
- 使用者裁決：尚未裁決。
- 結論：維持 Hypothesis。對比度門檻已是 `docs/guardrails.md`（A-M1）的一部分，不受此檔影響；本檔只處理「為什麼選去飽和」這個美學理由本身尚缺乏視覺比較證據。
