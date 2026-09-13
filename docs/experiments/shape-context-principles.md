# 圓角使用原則（情境化規則）

- 狀態：Hypothesis
- 舊規格出處：`docs/spec.md` 舊 §4.2（圓角比例數值表 §4.1 是 Promoted contract，保留在 `docs/spec.md`；本檔只處理「哪個元件該用哪個圓角」的情境判斷）
- 假設：
  - 大面積容器（panel、sidebar、modal）傾向 `sm` 或 `md`
  - 按鈕預設 `md`；pill 變體使用 `full`
  - `xl` 和 `full` 是點綴，不是預設
  - 同一層級的元件保持圓角一致性——混用多個不同圓角值會產生視覺噪音
- 輸入：`SPEC_ADVERSARIAL_REVIEW-2026-09-13.md` 與 Issue #84 直接指出的根因案例——`docs/spec.md` §4.1 的圓角對照表完全沒有把 nav item、tab、menu item 這類元素列進去，agent 實作 Navigation 時因為規格沒提到「nav item 該用哪個 radius」，於是不加任何圓角，變成純方形；使用者對此外觀「極其不滿意」。
- 狀態矩陣：需要涵蓋 button／input／card／navigation／badge／未來的 tab、menu item 等元件類型 × 三種 density 的圓角情境矩陣，目前只有已完成六元件的現況渲染（`review-artifacts/component-audit/`），沒有候選方案比較。
- 壓力測試／情境：Navigation 是目前唯一有明確記錄的失敗案例。
- 證據：E2（`SPEC_ADVERSARIAL_REVIEW-2026-09-13.md`）反證「這條原則已經足夠讓 agent 做出正確判斷」——規則存在不等於規則涵蓋完整、也不等於實作結果符合設計語言。
- 使用者裁決：尚未裁決。
- 結論：維持 Hypothesis。這是 Issue #84／#85 六元件視覺重審鏈的核心待解問題之一——下一步建議以 Navigation 的圓角情境作為第一個候選方案比較的實驗對象（`Redesign/prototypes/` 流程），而不是繼續讓 agent 依「同一層級保持一致」這種抽象原則自行發明數值。
